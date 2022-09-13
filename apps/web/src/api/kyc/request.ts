import { request } from 'api/axios';
import { TGetPresignedURLRequest, TGetPresignedURLResponse, TVerifyUserResponse, TVerifyUserRequest } from './types';
import axios from 'axios';
// import { TChangeNickName, TSuccessResponse } from "./types";

export const getPresignedUrl = async (params: TGetPresignedURLRequest): Promise<TGetPresignedURLResponse> => {
  const { data } = await request.post(`/skipid/user/verify/picture/presigned-url`, params);
  return data;
};

export const createKYCUploadPromises = (presignedUrl: TGetPresignedURLResponse, data: any) => {
  return [
    data?.front ? uploadImage(presignedUrl.frontIDCardImageUrl, data.front) : undefined,
    data?.back ? uploadImage(presignedUrl.backIDCardImageUrl, data.back) : undefined,
    data?.selfie ? uploadImage(presignedUrl.selfieWithDocImageUrl, data.selfie) : undefined,
  ];
};

const uploadImage = (presignedUrl: string, file: File) => {
  return axios.put(presignedUrl, file, {
    headers: { 'Content-Type': file.type },
  });
};

export const verifyUser = async (params: TVerifyUserRequest): Promise<TVerifyUserResponse> => {
  const { data } = await request.post(`/bb/user/real/verify`, params);
  return data;
};
