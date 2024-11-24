import {defineStore} from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        user: null,
    }),
    actions: {
        setToken(token) {
            this.token = token;

            if (process.client) {
                const authCookie = useCookie('auth_token');
                authCookie.value = token; // Сохраняем токен в cookies только на клиенте
            }
        },
        setUser(user) {
            this.user = user;
        },
        clear() {
            this.token = null;
            this.user = null;
                const authCookie = useCookie('auth_token');
                authCookie.value = null; // Удаляем токен из cookies только на клиент
        },
        async fetchUser() {
            if (!this.token) return null;

            try {
                const user = await $fetch('http://localhost:8000/api/user', {
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                    },
                });
                this.setUser(user);
            } catch (err) {
                console.error('Failed to fetch user:', err);
                this.clear();
            }
        },
        async initialize() {
            if (process.client) {
                const authCookie = useCookie('auth_token');
                if (authCookie.value) {
                    this.setToken(authCookie.value);
                    await this.fetchUser();
                }
            }
        },
    },
});
