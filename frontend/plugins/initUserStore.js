export default defineNuxtPlugin(async (nuxtApp) => {
    const userStore = useUserStore();
    await userStore.initialize(); // Инициализация состояния пользователя
});
