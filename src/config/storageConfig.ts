import { LocalStorageConnectorConfig } from 'src/store/storage';

export const localStorageConfig: LocalStorageConnectorConfig = {
  properties: [
    'selectedNetwork',
    'selectedAsset',
    'searchParams',
    'walletAuth',
    'userSettings'
  ]
};

export const sessionStorageConfig: LocalStorageConnectorConfig = {
  properties: ['bookingInfo', 'organizerInfo']
};
