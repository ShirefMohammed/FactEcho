import {
  forgetPassword as commonForgetPassword,
  login as commonLogin,
  loginWithFacebook as commonLoginWithFacebook,
  loginWithFacebookCallback as commonLoginWithFacebookCallback,
  loginWithGoogle as commonLoginWithGoogle,
  loginWithGoogleCallback as commonLoginWithGoogleCallback,
  logout as commonLogout,
  refresh as commonRefresh,
  register as commonRegister,
  resetPassword as commonResetPassword,
  sendResetPasswordForm as commonSendResetPasswordForm,
  verifyAccount as commonVerifyAccount,
} from "../common/authController";

export const register = commonRegister;
export const login = commonLogin;
export const refresh = commonRefresh;
export const logout = commonLogout;
export const verifyAccount = commonVerifyAccount;
export const forgetPassword = commonForgetPassword;
export const sendResetPasswordForm = commonSendResetPasswordForm;
export const resetPassword = commonResetPassword;
export const loginWithGoogle = commonLoginWithGoogle;
export const loginWithGoogleCallback = commonLoginWithGoogleCallback;
export const loginWithFacebook = commonLoginWithFacebook;
export const loginWithFacebookCallback = commonLoginWithFacebookCallback;
