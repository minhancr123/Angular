import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  ApiRoot: 'https://angularbackend-latest-1.onrender.com/api',
  USERDATA_KEY: 'auth-user'
};
