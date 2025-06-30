import { defineStore } from 'pinia';
import type { User } from '../utils/types.ts';

export const useUserStore = defineStore('user', {
  state: (): { isAuthenticated: boolean; user: null | User } => ({
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    login(userData: User) {
      this.user = userData;
      this.isAuthenticated = true;
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});
