import axios, { AxiosInstance } from 'axios';

import { fileToBase64 } from '../../shared';
import { Application, Collection, Content, ContentCreateBackend } from '../types';

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

  getNft = async ({ tokenId, collectionAddress }: { tokenId: string, collectionAddress: string }) => {
    const { data } = await this._instance.get<Content>(`/metadata/${tokenId}?collectionAddress=${collectionAddress}`);

    return data;
  };

  createApplication = async (tokenDbId: string) => {
    await this._instance.post<void>('/application', { tokenDbId });
  };

  getCollection = async (address: string) => {
    const { data } = await this._instance.get<Collection>(`/collection/${address}`);

    return data;
  };

  getNftListAvailable = async () => {
    const { data } = await this._instance.get<Content[]>('/application/metadata/availible');

    return data;
  };

  getApplication = async (tokenId: string) => {
    const { data } = await this._instance.get<Application>(`/application/${tokenId}`);

    return data;
  };

  getApplicationList = async (tokenId: string) => {
    const { data } = await this._instance.get<Application[]>(`/application/${tokenId}/all`);

    return data;
  };

  updateApplicationList = async ({
    tokenId,
    address,
    accepted,
    declined,
  }: {
    tokenId: string,
    address: string,
    accepted?: string[]
    declined?: string[]
  }) => {
    await this._instance.patch<Application[]>(`/application/${tokenId}`, {
      collectionAddress: address,
      accepted,
      declined,
    });
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
