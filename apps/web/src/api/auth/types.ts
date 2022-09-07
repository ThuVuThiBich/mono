export interface TCodeRequest {
  token: string;
  account: string;
  languageType: string;
}
export interface TTokenResponse {
  token: string;
}

export interface TRegisterRequest {
  token: string;
  code: string;
  account: string;
  password?: string;
  passwordConfirm?: string;
}
export interface TLoginRequest {
  account: string;
  password: string;
}

export interface TLogoutRequest {
  token: string;
  loginUser: any;
}
