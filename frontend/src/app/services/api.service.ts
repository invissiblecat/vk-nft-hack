import axios, { AxiosInstance } from 'axios';

import { fileToBase64 } from '../../shared';
import { Content, ContentCreateBackend } from '../types';

class ApiService {
  private _instance: AxiosInstance;

  private _signature?: string;

  constructor() {
    this._instance = axios.create({
      baseURL: '/api',
    });
  }

  get signature() {
    return this._signature;
  }

  setAuthHeader(signature: string) {
    this._signature = signature;
    this._instance.interceptors.request.use((config) => {
      config.headers.set('Authorization', signature);

      return config;
    });
  }

  removeAuthHeader() {
    this._signature = undefined;
    this._instance.interceptors.request.clear();
  }

  createNft = async (body: ContentCreateBackend) => {
    await this._instance.post<void>('/metadata', body);
  };

  getNftList = async () => {
    const { data } = await this._instance.get<Content[]>('/metadata');

    return data;
  };

  uploadImage = async ({
    file,
    tokenId,
    collectionAddress,
  }: {
    file: Blob,
    tokenId: string,
    collectionAddress: string
  }) => {
    const base64File = await fileToBase64(file);

    await this._instance.post('/images', { base64File, tokenId, collectionAddress });
  };
}

export const apiService = new ApiService();
