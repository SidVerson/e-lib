<template>
  <div class="p-8">
    <!-- Header Section -->
    <h1 class="text-3xl font-bold text-primary mb-8">Каталог книг</h1>

    <!-- Filter Section -->
    <div class="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      <!-- Title Filter -->
      <div class="flex items-center">
        <Input
            v-model="filters.title"
            type="text"
            id="title"
            placeholder="Поиск по названию"
            class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <!-- Author Filter -->
      <div class="flex items-center">
        <Input
            v-model="filters.author"
            type="text"
            id="author"
            placeholder="Поиск по автору"
            class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <!-- Genre Filter -->
      <div class="flex items-center">
        <Input
            v-model="filters.genre"
            type="text"
            id="genre"
            placeholder="Поиск по жанру"
            class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-gray-600 text-xl">Грузим книги...</div>

    <!-- Books Section -->
    <div v-else>
      <div v-if="filteredBooks.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- Loop through books and create cards -->
        <Card
            class="w-full max-w-xs shadow-lg rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
            v-for="book in filteredBooks"
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
            <CardTitle class="text-lg font-semibold text-primary hover:text-primary/50 transition">
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

      <!-- No Books Available Message -->
      <div v-else>
        <p class="text-gray-600 text-lg">No books available.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useRuntimeConfig} from '#app';

definePageMeta({
  middleware: 'auth',
});

const books = ref([]);
const loading = ref(true);
const filters = ref({
  title: '',
  author: '',
  genre: '',
});
const config = useRuntimeConfig();

// Fetch books data
async function fetchBooks() {
  try {
    const data = await $fetch(`${config.public.apiBaseUrl}/api/books`);
    books.value = data;
  } catch (err) {
    console.error('Failed to fetch books:', err);
  } finally {
    loading.value = false;
  }
}

// Filtered books based on filters
const filteredBooks = computed(() => {
  return books.value.filter((book) => {
    const titleMatch = book.title.toLowerCase().includes(filters.value.title.toLowerCase());
    const authorMatch = book.author.toLowerCase().includes(filters.value.author.toLowerCase());
    const genreMatch = book.genre && book.genre.toLowerCase().includes(filters.value.genre.toLowerCase());

    return titleMatch && authorMatch && genreMatch;
  });
});

onMounted(fetchBooks);
</script>


