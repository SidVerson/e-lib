<template>
  <div class="p-[32px]" v-if="books.length">
    <h1 class="text-2xl font-bold mb-4">Список для чтения</h1>
    <div  class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- Loop through books and create cards -->
      <Card
          class="w-full max-w-xs shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
          v-for="book in books"
          :key="book.id"
      >
        <!-- Book Cover Image -->
        <div class="relative w-full h-64 overflow-hidden">
          <NuxtImg
              :src="`http://localhost:8000/api/books/${book.id}/cover`"
              alt="Book cover"
              class="w-full h-full object-cover"
              loading="lazy"
          />
        </div>

        <!-- Book Info -->
        <CardContent class="p-4 space-y-4 bg-card text-card-foreground">
          <CardTitle class="text-lg font-semibold text-primary hover:text-primary-foreground transition">
            <NuxtLink :to="`/books/${book.id}`">{{ book.title }}</NuxtLink>
          </CardTitle>
          <CardDescription class="text-sm text-muted-foreground line-clamp-3">
            {{ book.description }}
          </CardDescription>

          <!-- Author and Genre -->
          <div class="flex items-center justify-between text-sm font-medium text-muted-foreground">
            <span>{{ book.author }}</span>
            <span>{{ book.genre || '' }}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  <div v-else>
    <p class="text-center mt-[25%]">У вас нет прочитанных книг.</p>
  </div>

  <div v-if="!loading && books.length > 0" class="mt-6 p-[32px]">
    <h3 class="text-2xl font-semibold mb-4">Your Achievements</h3>
    <div class="flex flex-wrap gap-4">
      <!-- Здесь отображаем ачивки в зависимости от количества прочитанных книг -->
      <div v-if="readBooksCount >= 1" class="badge">Achievement 1: 1 book</div>
      <div v-if="readBooksCount >= 5" class="badge">Achievement 2: 5 books</div>
      <div v-if="readBooksCount >= 10" class="badge">Achievement 3: 10 books</div>
      <div v-if="readBooksCount >= 15" class="badge">Achievement 4: 15 books</div>
      <!-- Можно добавлять больше ачивок по мере увеличения количества -->
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useFetch} from '#app';

const userStore = useUserStore()
const books = ref([]);
const readBooksCount = ref(0); // Количество прочитанных книг

const config = useRuntimeConfig();
const loading = ref(true); // Состояние загрузки
async function fetchUserBooks() {
  try {
    // Используем useFetch для отправки запроса на сервер
    const { data, error } = await useFetch(`${config.public.apiBaseUrl}/api/user/books`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userStore.token}`, // Передаем токен авторизации
      },
    });

    if (error.value) {
      console.error('Error fetching user books:', error.value); // Логируем ошибку
    } else {
      books.value = data.value || []; // Записываем полученные данные в books
      readBooksCount.value = data.value.length || 0;

    }
  } catch (err) {
    console.error('Failed to fetch user books:', err);
  } finally {
    loading.value = false; // Завершаем загрузку
  }
}

onMounted(fetchUserBooks);
</script>

<style scoped>
/* Добавьте стили по вашему усмотрению */
</style>
