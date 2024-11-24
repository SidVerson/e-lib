<template>
  <div class="max-w-4xl mx-auto p-8">
    <div v-if="book" class="flex flex-col md:flex-row bg-card p-6 justify-between gap-6 rounded-lg shadow-xl space-y-6 md:space-y-0">
      <!-- Book Cover Section -->
      <div class="flex-shrink-0 w-full md:w-1/3 rounded-lg overflow-hidden shadow-lg">
        <NuxtImg
            v-if="book.id"
            :src="`http://localhost:8000/api/books/${book.id}/cover`"
            alt="Book cover"
            class="w-full h-full object-cover transform transition duration-300 hover:scale-105"
        />
      </div>

      <!-- Book Info Section -->
      <div class="flex-1 space-y-4">
        <h2 class="text-3xl font-semibold text-primary">{{ book.title }}</h2>
        <p class="text-sm text-muted-foreground">{{ book.description }}</p>

        <div class="flex flex-wrap gap-4">
          <span class="text-sm font-medium text-primary">{{ book.author }}</span>
          <span class="text-sm font-medium text-muted-foreground">{{ book.genre || 'Не указан' }}</span>
        </div>

        <div class="flex items-center gap-4 mt-6">
          <!-- Read Book Button -->
          <Button>

          <NuxtLink
              as="Button"
              :to="`/books/${book.id}/read`"
          >
            Читать
          </NuxtLink>
          </Button>

          <!-- Add Book to Read List Button -->
          <Button
              @click="addBookToReadList"
variant="secondary"              :disabled="isAdding"
          >
            {{ isAdding ? 'Добавляем...' : 'Добавить в читательский лист' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useRoute, useRuntimeConfig} from '#app';

const userStore = useUserStore()
const route = useRoute();
const config = useRuntimeConfig();
const book = ref(null);
const loading = ref(true);
const isAdding = ref(false);

// Функция для получения данных о книге
async function fetchBook() {
  try {
    book.value = await $fetch(`${config.public.apiBaseUrl}/api/books/${route.params.id}`);
    console.log('book', book.value);
  } catch (err) {
    console.error('Failed to fetch book details:', err);
  } finally {
    loading.value = false;
  }
}

// Функция для добавления книги в список прочитанных
async function addBookToReadList() {
  isAdding.value = true;

  // const token = localStorage.getItem('token');
  // if (!token) {
  //   alert('You need to be logged in');
  //   isAdding.value = false;
  //   return;
  // }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/user/books`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userStore.token}`, // Токен авторизации
      },
      body: {
        bookId: book.value.id,
      },
    });

    if (response.message) {
      alert('Book added to your list of read books');
    }
  } catch (error) {
    console.error('Failed to add book:', error);
    alert('Failed to add book to your list');
  } finally {
    isAdding.value = false;
  }
}


onMounted(fetchBook);
</script>

<style scoped>
/* Стили */
</style>
