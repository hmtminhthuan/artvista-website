import { jwtDecode, JwtPayload } from 'jwt-decode';
import axiosInstances from '../config/axios';

const isValidToken = (accessToken: string): boolean => {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded: JwtPayload = jwtDecode(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp !== undefined && decoded.exp > currentTime;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axiosInstances.management.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    axiosInstances.market.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axiosInstances.management.defaults.headers.common.Authorization;
    delete axiosInstances.market.defaults.headers.common.Authorization;
  }
};

export { isValidToken, setSession };
