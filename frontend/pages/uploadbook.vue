<script setup lang="ts">
import {Button} from '@/components/ui/button'
import {CardContent, CardDescription, CardFooter, CardTitle} from '@/components/ui/card'
import {Input} from '@/components/ui/input'


import {toTypedSchema} from '@vee-validate/zod'
import * as z from 'zod'
import {useForm} from "vee-validate";
import {useUserStore} from "~/stores/user";

const userStore = useUserStore();

const formSchema = toTypedSchema(z.object({
  title: z.string(),
  author:z.string(),
  description:z.string(),
  genre: z.string(),
  file:z.any().refine(file => file, "Please upload ID")
}))
const form = useForm({
  validationSchema: formSchema,
})
const onFileDrop = (files: File[]) => {
  // Populate the VeeValidate field with the dropped files
  form.setFieldValue("file", files);
};
const onSubmit = form.handleSubmit(async (values) => {
  console.log("Form submitted!", values);

  const config = useRuntimeConfig();
  const formData = new FormData();

  // Добавляем данные формы в FormData
  formData.append("title", values.title);
  formData.append("author", values.author);
  formData.append("description", values.description);
  formData.append("genre", values.genre);

  // Добавляем файл
  if (values.file && values.file[0]) {
    formData.append("file", values.file[0]); // "file" — имя поля, ожидаемое на сервере
  }

  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/api/books/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${userStore.token}`, // Токен авторизации
      },
    });

    console.log("Книга загружена:", response);
  } catch (error) {
    console.error("Ошибка при загрузке книги:", error);
  }
});

const files = ref<File[]>([]);

function formatFileSize(fileSize: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = fileSize;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

const removeFile = (index: number) => {
  files.value.splice(index, 1);
};
</script>

<template>
  <div class="w-full p-[32px]">
    <div class="p-6 pt-0">
      <CardTitle class="text-2xl">
        Загрузить книгу
      </CardTitle>
      <CardDescription>
Вы можете загрузить свою книгу на наш сайт и пользователи смогу прочитать ее!      </CardDescription>
    </div>
      <form @submit="onSubmit">
    <CardContent class="grid gap-4">
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel>Название</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Введите название" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="author">
          <FormItem>
            <FormLabel>Автор</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Введите автора" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      <FormField v-slot="{ componentField }" name="description">
        <FormItem>
          <FormLabel>Описание</FormLabel>
          <FormControl>
            <Textarea placeholder="Введите описание" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="genre">
        <FormItem>
          <FormLabel>Жанр</FormLabel>

          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Выберите жанр" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Научная фантастика">
                  Научная фантастика
                </SelectItem>
                <SelectItem value="Фэнтези">
                  Фэнтези
                </SelectItem>
                <SelectItem value="Детектив">
                  Детектив
                </SelectItem>
                <SelectItem value="Роман">
                  Роман
                </SelectItem>
                <SelectItem value="Приключения">
                  Приключения
                </SelectItem>
                <SelectItem value="Триллер">
                  Триллер
                </SelectItem>
                <SelectItem value="Ужасы">
                  Ужасы
                </SelectItem>
                <SelectItem value="Мистика">
                  Мистика
                </SelectItem>
                <SelectItem value="Исторический">
                  Исторический
                </SelectItem>
                <SelectItem value="Биография">
                  Биография
                </SelectItem>
                <SelectItem value="Психология">
                  Психология
                </SelectItem>
                <SelectItem value="Научно-популярное">
                  Научно-популярное
                </SelectItem>
                <SelectItem value="Современная литература">
                  Современная литература
                </SelectItem>
                <SelectItem value="Литература для детей">
                  Литература для детей
                </SelectItem>
                <SelectItem value="Поэзия">
                  Поэзия
                </SelectItem>
                <SelectItem value="Классика">
                  Классика
                </SelectItem>
                <SelectItem value="Фантастика">
                  Фантастика
                </SelectItem>
              </SelectGroup>

            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField @dropped="files = $event" v-slot="{ componentField }" name="file">
        <FormItem>
          <FormLabel>Книга</FormLabel>
          <FormControl>
            <DropFile :onDrop="onFileDrop" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
        <div class="mt-5" v-if="files && files.length">
          <div
              v-for="(file, i) in files"
              :key="file.name"
              class="group relative mb-2 flex h-12 items-center justify-between rounded border px-3 py-3"
          >
            <div class="flex grow items-center gap-3">
delete              <p class="w-[80%] truncate text-sm">{{ file.name }}</p>
              <p
                  class="ml-auto whitespace-nowrap text-xs text-muted-foreground/60 transition group-hover:hidden"
              >
                {{ formatFileSize(file.size) }}
              </p>
            </div>

            <div class="hidden transition group-hover:block">
              <Button @click="removeFile(i)" variant="outline">
delete              </Button>
            </div>
          </div>
        </div>
    </CardContent>
    <CardFooter>
      <Button type="submit" class="w-full">
        Загрузить книгу
      </Button>
    </CardFooter>
      </form>
  </div>
</template>