import axios, { AxiosInstance } from 'axios';

import { Content, ContentCreateBackend } from '../types';

class ApiService {
  private _instance: AxiosInstance;

  constructor() {
    this._instance = axios.create({
      baseURL: '/api',
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

  createNft = async (body: ContentCreateBackend) => {
    await this._instance.post<void>('/metadata', body);
  };

  getNftList = async () => {
    const { data } = await this._instance.get<Content[]>('/metadata');

    return data;
  };
}

export const apiService = new ApiService();
