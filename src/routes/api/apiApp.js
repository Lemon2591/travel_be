const { Router } = require("express");
const { Response } = require("../../libs/response_config");
const {
  AuthController,
  ApiAppController,
} = require("../../controller/apiAppController");
const { isAuthApp } = require("../../middlewares/isAuth");

const { uploadImageFile } = require("../../config/upload");
const svRouter = new Router();

svRouter.get("/refresh-token", AuthController.getRefreshToken);

svRouter.post("/login", Response(AuthController.loginController));

svRouter.post("/logout", isAuthApp, Response(AuthController.logoutController));

svRouter.post("/register", Response(AuthController.registerController));

svRouter.post("/very-otp", Response(AuthController.veryOTP));

svRouter.post("/retry-otp", Response(AuthController.retryOTP));

svRouter.get("/get-user", isAuthApp, Response(AuthController.getUser));

svRouter.post(
  "/upload-file",
  uploadImageFile.any(),
  Response(ApiAppController.ApiUpLoadFile)
);

svRouter.post("/create-post", Response(ApiAppController.createPost));
svRouter.get("/get-post", Response(ApiAppController.getPost));

svRouter.get("/get-feature-post", Response(ApiAppController.getFeaturePost));

svRouter.get("/get-list-post", Response(ApiAppController.getListPost));

module.exports = svRouter;
