<template>
  <div class=" h-full p-8">

    <div v-if="loading" class="text-gray-600">Loading book...</div>
    <div v-else-if="book">

      <h1 class="text-3xl font-bold mb-4">{{ book.title }}</h1>

      <!-- Используем vue-pdf для отображения PDF -->
      <div v-if="fileType === 'pdf'" class="pdf-container">


      </div>

      <!-- EPUB Viewer -->
      <div v-else-if="fileType === 'epub'" class="epub-container">
        <div ref="epubViewer" class="epub-viewer"></div>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-600">Book not found.</p>
    </div>
    <embed :src="pdfUrl" width="100%" height="100%" />
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import {useRuntimeConfig} from '#app';

definePageMeta({
  middleware: 'auth',
});
const route = useRoute();
const config = useRuntimeConfig();

const book = ref(null);
const fileType = ref(null); // 'pdf' or 'epub'
const loading = ref(true);

const pdfUrl = ref('');
const currentPage = ref(1);
const totalPages = ref(0);

const epubReader = ref(null);

// Загружаем книгу по ID
async function fetchBook() {
  try {
    const data = await $fetch(`${config.public.apiBaseUrl}/api/books/${route.params.id}`);
    book.value = data;
console.log('boko',book)
    // Определяем тип файла книги (PDF или EPUB)
    if (book.value.file_path && book.value.file_path.endsWith('.pdf')) {
      fileType.value = 'pdf';
      pdfUrl.value = `${config.public.apiBaseUrl}/${book.value.file_path}`; // Устанавливаем правильный URL для PDF
    } else if (book.value.file_path && book.value.file_path.endsWith('.epub')) {
      fileType.value = 'epub';
      await loadEpub(book.value.fileUrl); // Загрузка EPUB
    }
  } catch (err) {
    console.error('Failed to fetch book details:', err);
  } finally {
    loading.value = false;
  }
}

// Переход по страницам PDF
function goToPage(pageNumber) {
  if (pageNumber < 1 || pageNumber > totalPages.value) return;
  currentPage.value = pageNumber;
}

// Обработчики для работы с PDF
function onPdfLoaded(pdfInfo) {
  totalPages.value = pdfInfo.numPages;
}

function onPageChanged(page) {
  currentPage.value = page;
}

// Загрузка EPUB
async function loadEpub(fileUrl) {
  const epubUrl = `${config.public.apiBaseUrl}${fileUrl}`; // Получаем полный путь
  const reader = EPUBJS.ReadingSystem();
  const epub = EPUBJS(epubUrl);
  const rendition = reader.renderTo($refs.epubViewer, {
    width: '100%',
    height: '600px',
  });
  rendition.display();
}

onMounted(fetchBook);
</script>

<style scoped>
.pdf-container {
  margin-top: 20px;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:disabled {
  background-color: #cccccc;
}

.epub-container {
  margin-top: 20px;
}

.epub-viewer {
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
}
</style>
