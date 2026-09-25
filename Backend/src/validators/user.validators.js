import { body } from "express-validator";

const registerUserValidator = () => {
  return [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email is invalid"),
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("fullName")
        .trim()
        .notEmpty().withMessage("Full name is required")
  ];
};

export { registerUserValidator };