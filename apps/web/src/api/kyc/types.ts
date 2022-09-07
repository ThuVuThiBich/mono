export interface TGetPresignedURLRequest {
  sub: string;
}
export interface TGetPresignedURLResponse {
  backIDCardImageUrl: string;
  frontIDCardImageUrl: string;
  selfieWithDocImageUrl: string;
}

export interface TGetReferralInfoRequest {
  sub: string;
}

export interface TGetReferralInfoResponse {
  referralCode: string;
  inviter: string;
}

export interface TVerifyUserRequest {
  sub: string;
  firstName: string;
  lastName: string;
  birthday: string;
  identityNumber: number;
  documentType: number;
  country: string;
  countryCode: number;
  nationality: string;
  nationalityCode: string;
  city: string;
  prefectures: string;
  postcode: number;
  phoneNumber: string;
  usCitizen: boolean;
}

export interface TVerifyUserResponse {
  code: number;
}
