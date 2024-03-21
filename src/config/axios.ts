import axios, { AxiosRequestConfig } from 'axios';

export enum AxiosClientFactoryEnum {
  AUTH = 'auth',
  MANAGEMENT = 'management',
  MARKET = 'market',
}

export const parseParams = (params: any) => {
  const keys = Object.keys(params);
  let options = '';

  keys.forEach((key) => {
    const isParamTypeObject = typeof params[key] === 'object';
    const isParamTypeArray =
      isParamTypeObject && Array.isArray(params[key]) && params[key].length >= 0;

    if (!isParamTypeObject) {
      options += `${key}=${params[key]}&`;
    }

    if (isParamTypeObject && isParamTypeArray) {
      params[key].forEach((element: any) => {
        options += `${key}=${element}&`;
      });
    }
  });

  return options ? options.slice(0, -1) : options;
};

const auth = `https://artvistaauthapi.azurewebsites.net/api/`;
const management = `https://artvistamanagementapi.azurewebsites.net/api/`;
const market = `https://artvistamarketapi.azurewebsites.net/api/`;

const request = axios.create({
  baseURL: auth,
  paramsSerializer: parseParams
});

request.interceptors.request.use((options) => {
  const { method } = options;

  if (method === 'put' || method === 'post') {
    Object.assign(options.headers, {
      'Content-Type': 'application/json;charset=UTF-8'
    });
  }

  return options;
});

request.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Có lỗi xảy ra')
);

const requestManagement = axios.create({
  baseURL: management,
  paramsSerializer: parseParams,
  headers: {
    Authorization:
      'Bearer '
  }
});

requestManagement.interceptors.request.use((options) => {
  const { method } = options;

  if (method === 'put' || method === 'post') {
    Object.assign(options.headers, {
      'Content-Type': 'application/json;charset=UTF-8'
    });
  }

  return options;
});

requestManagement.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Có lỗi xảy ra')
);

const requestMarket = axios.create({
    baseURL: market,
    paramsSerializer: parseParams,
    headers: {
        Authorization:
          'Bearer '
      }
  });
  
requestMarket.interceptors.request.use((options) => {
    const { method } = options;
  
    if (method === 'put' || method === 'post') {
      Object.assign(options.headers, {
        'Content-Type': 'application/json;charset=UTF-8'
      });
    }
  
    return options;
  });
  
requestMarket.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Có lỗi xảy ra')
  );

class AxiosClientFactory {
  getAxiosClient(type?: AxiosClientFactoryEnum, config: AxiosRequestConfig = {}) {
    switch (type) {
      case 'auth':
        return request;
      case 'management':
        return requestManagement;
      case 'market':
        return requestMarket;
      default:
        return request;
    }
  }
}

const axiosClientFactory = new AxiosClientFactory();

const axiosInstances = {
  auth: axiosClientFactory.getAxiosClient(AxiosClientFactoryEnum.AUTH),
  management: axiosClientFactory.getAxiosClient(AxiosClientFactoryEnum.MANAGEMENT),
  market: axiosClientFactory.getAxiosClient(AxiosClientFactoryEnum.MARKET),
};

export { axiosClientFactory };

export default axiosInstances;
