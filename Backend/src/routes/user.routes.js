import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
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
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { registerUserValidator } from "../validators/user.validators.js"; 
import { validate } from "../middlewares/validation.middleware.js"; 

const router = Router();

// ... (existing public routes: /register, /login)
router.route("/register").post(
  upload.single("avatar"),
  registerUserValidator(), // 1. Run validation rules
  validate,                // 2. Check for validation errors
  registerUser             // 3. If no errors, proceed to controller
);
router.route("/login").post(loginUser);

// Social login routes
router.route("/auth/google").post(googleAuth);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// +++ ADD: Address management routes +++
router.route("/addresses").get(verifyJWT, getUserAddresses);
router.route("/addresses").post(verifyJWT, addAddress);
router.route("/addresses/:addressId").put(verifyJWT, updateAddress);
router.route("/addresses/:addressId").delete(verifyJWT, deleteAddress);
router.route("/addresses/:addressId/default").patch(verifyJWT, setDefaultAddress);


// --- ADMIN ONLY ROUTES ---
router.route("/all-users").get(verifyJWT, verifyAdmin, getAllUsers);

export default router;