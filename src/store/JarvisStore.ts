import {makePersistable} from 'mobx-persist-store';
import {makeAutoObservable, runInAction} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class JarvisStore {
  serverUrl = '';
  token = '';

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'JarvisStore',
      properties: ['serverUrl', 'token'],
      storage: AsyncStorage,
    });
  }

  setServerUrl(url: string) {
    runInAction(() => {
      this.serverUrl = url;
    });
  }

  setToken(token: string) {
    runInAction(() => {
      this.token = token;
    });
  }
}

export const jarvisStore = new JarvisStore();
