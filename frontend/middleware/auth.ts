// middleware/auth.js
export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore(); // Получаем доступ к userStore

    if (!userStore.user) {
        // Если пользователь не авторизован, перенаправляем на страницу входа
        return navigateTo('/auth/login');
    }
});
