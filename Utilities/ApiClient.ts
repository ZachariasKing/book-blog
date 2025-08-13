import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export default class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, defaultHeaders?: Record<string, string>, timeout = 5000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: defaultHeaders
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error) => {
        console.error('API Error:', error.message);
        return Promise.reject(error);
      }
    );
  }


public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // Use the underlying axios instance directly to get the full response
    return this.client.request<T>({
        method: 'get',
        url,
        ...config,
        // Override the response interceptor for this request
        transformResponse: undefined
    });
}
  public async post<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>({
      method: 'post',
      url,
      data,
      ...config,
      // Override the response interceptor for this request
      transformResponse: undefined
    });
  }

  public async put<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>({
      method: 'put',
      url,
      data,
      ...config,
      // Override the response interceptor for this request
      transformResponse: undefined
    });
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>({
      method: 'delete',
      url,
      ...config,
      // Override the response interceptor for this request
      transformResponse: undefined
    });
  }
  public async patch<T = any>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>({
      method: 'patch',
      url,
      data,
      ...config,
      // Override the response interceptor for this request
      transformResponse: undefined
    });
  }
}