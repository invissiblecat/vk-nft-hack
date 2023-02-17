import axios, { AxiosInstance } from 'axios';

import { nftCreateBackend } from '../types';

class ApiService {
  private _instance: AxiosInstance;

  constructor() {
    this._instance = axios.create({
      baseURL: 'https://user151920325-feb4xxq3.wormhole.vk-apps.com/api',
    });
  }

  setAuthHeader(signature: string) {
    this._instance.interceptors.request.use((config) => {
      config.headers.set('Authorization', signature);

      return config;
    });
  }

  removeAuthHeader() {
    this._instance.interceptors.request.clear();
  }

  createNft = async (body: nftCreateBackend) => {
    await this._instance.post<void>('/metadata', body);
  };
}

export const apiService = new ApiService();
