export interface TSuccessResponse {
  code: number;
}

export interface TError {
  code: number;
  msg: string;
  msg_code: string;
  message?: string;
}
