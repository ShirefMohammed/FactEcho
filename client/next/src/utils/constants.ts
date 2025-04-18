export enum httpStatusText {
  SUCCESS = "success",
  FAIL = "fail",
  ERROR = "error",
  AccessTokenExpiredError = "accessTokenExpiredError",
  RefreshTokenExpiredError = "refreshTokenExpiredError",
}

export const RgxList = {
  NAME_REGEX: /^[A-z][A-z0-9-_]{3,23}$/,
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  PASS_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
};

export enum ROLES_LIST {
  Admin = 5151,
  Author = 5150,
  User = 2001,
}
