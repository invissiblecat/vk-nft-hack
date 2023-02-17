import axios, { AxiosInstance } from 'axios';

import { signatureService } from './signature.service';

class ApiService {
  private _instance: AxiosInstance;

  constructor() {
    this._instance = axios.create({
      baseURL: 'https://user151920325-4ppez4i6.wormhole.vk-apps.com/api',
    });
    this._initInterceptor();
  }

  private _initInterceptor = () => {
    this._instance.interceptors.request.use((config) => {
      if (signatureService.signature) {
        config.headers.set('Authorization', signatureService.signature);
      }

      return config;
    });
  };

  login = async (signature: string) => {
    const { data } = await this._instance.post('/users/login', { signature });
    signatureService.setSignature(data);
  };
}

export const apiService = new ApiService();
