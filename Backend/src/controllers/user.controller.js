import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Get user details from frontend
  const { fullName, email, username, password } = req.body;

  // Validation
  if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Check for avatar file
  const avatarLocalPath = req.file?.path;
  
  let avatar;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(400, "Avatar file is required but failed to upload");
    }
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    avatar: {
        public_id: avatar?.public_id,
        url: avatar?.url || "",
    },
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const isProduction = process.env.NODE_ENV === "production";
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed"
      )
    );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getCurrentUser = asyncHandler(async(req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"))
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new passwords are required");
  }

  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password cannot be the same as the old one");
  }

  user.password = newPassword; // The pre-save hook will hash it
  await user.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName && !email) {
    throw new ApiError(400, "At least one field (fullName or email) is required to update");
  }
  
  // Find the user and update their details.
  // The { new: true } option ensures that the updated document is returned.
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName, // Will be undefined if not provided, and $set ignores undefined fields
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
        throw new ApiError(500, "Error while uploading avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                avatar: {
                    public_id: avatar.public_id,
                    url: avatar.url
                }
            }
        },
        { new: true }
    ).select("-password -refreshToken");

    // Optional: Delete the old avatar from Cloudinary here if needed

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar image updated successfully"));
});


// --- ADMIN ONLY ---
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password -refreshToken");
    return res.status(200).json(new ApiResponse(200, users, "All users fetched successfully"));
});

const getUserAddresses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user.addresses, "Addresses fetched successfully"));
});

const addAddress = asyncHandler(async (req, res) => {
    const { addressLine1, city, state, country, postalCode } = req.body;

    if (!addressLine1 || !city || !state || !country || !postalCode) {
        throw new ApiError(400, "All address fields are required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    
    // If this is the first address, make it the default
    const isDefault = user.addresses.length === 0;

    user.addresses.push({ addressLine1, city, state, country, postalCode, isDefault });
    await user.save({ validateBeforeSave: false });

    return res.status(201).json(new ApiResponse(201, user.addresses, "Address added successfully"));
});

const updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    const { addressLine1, city, state, country, postalCode } = req.body;

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);
    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    address.addressLine1 = addressLine1 || address.addressLine1;
    address.city = city || address.city;
    address.state = state || address.state;
    address.country = country || address.country;
    address.postalCode = postalCode || address.postalCode;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, user.addresses, "Address updated successfully"));
});

const deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);
    if (!address) {
        throw new ApiError(404, "Address not found");
    }

    // Mongoose sub-document removal
    address.remove();
    await user.save({ validateBeforeSave: false });
    
    return res.status(200).json(new ApiResponse(200, user.addresses, "Address deleted successfully"));
});

const setDefaultAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(404, "User not found");

    // Set all other addresses to not be default
    user.addresses.forEach(addr => {
        addr.isDefault = false;
    });

    // Find the new default address and set it
    const newDefault = user.addresses.id(addressId);
    if (!newDefault) throw new ApiError(404, "Address not found");
    newDefault.isDefault = true;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, user.addresses, "Default address updated"));
});

// --- SOCIAL LOGIN CONTROLLERS ---
const googleAuth = asyncHandler(async (req, res) => {
  const { googleId, email, fullName, avatar } = req.body;

  if (!googleId || !email) {
    throw new ApiError(400, "Google ID and email are required");
  }

  // Check if user exists with this Google ID
  let user = await User.findOne({ googleId });

  if (!user) {
    // Check if user exists with this email
    user = await User.findOne({ email });
    
    if (user) {
      // Link Google account to existing user
      user.googleId = googleId;
      user.authProvider = "google";
      if (avatar) {
        user.avatar = { url: avatar };
      }
      await user.save({ validateBeforeSave: false });
    } else {
      // Create new user with Google auth
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(7);
      user = await User.create({
        googleId,
        email,
        fullName: fullName || email.split('@')[0],
        username,
        avatar: avatar ? { url: avatar } : undefined,
        authProvider: "google",
      });
    }
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in with Google successfully"
      )
    );
});


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  changeCurrentPassword,
  updateAccountDetails,
  updateUserAvatar,
  getAllUsers,
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  googleAuth,
};