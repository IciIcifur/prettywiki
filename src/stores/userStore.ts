import { defineStore } from 'pinia';
import type { User } from '../types/types.ts';
import {
  GetUserFromCookie,
  RemoveUserFromCookie,
  SaveUserToCookie,
} from '../utils/session.ts';
import { GetUserByLogin } from '../api/userAPI.ts';

export const useUserStore = defineStore('user', {
  state: (): { isAuthenticated: boolean; user: null | User } => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    async restoreUser() {
      const login = GetUserFromCookie();

      if (login) {
        const userData = await GetUserByLogin(login);
        if (userData) this.login(userData);
      }
    },
    login(userData: User) {
      this.user = userData;
      this.isAuthenticated = true;
      RemoveUserFromCookie();
      SaveUserToCookie(userData.login);
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      RemoveUserFromCookie();
    },
  },
});
