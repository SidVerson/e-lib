<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">
            Вход
          </h1>
          <p class="text-balance text-muted-foreground">
            Введите свой адрес электронной почты, чтобы войти в свою учетную запись          </p>
        </div>
      <form @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Введите свой email" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Пароль</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Введите свой пароль" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit" variant="outline" class="w-full mt-4">
          Войти
        </Button>
        <div class="mt-4 text-center text-sm">
          Еще нету аккаунта?
          <NuxtLink to="/auth/register" class="underline">
            Зарегистрируйтесь
          </NuxtLink>
        </div>
      </form>





    </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <NuxtImg
          src="https://images.pexels.com/photos/4132936/pexels-photo-4132936.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Image"
          width="1920"
          height="1080"
          class="h-full w-full object-cover"
      />
      </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useUserStore} from '~/stores/user.js';
import {useRouter} from 'vue-router';
import {toTypedSchema} from '@vee-validate/zod'
import * as z from 'zod'
import {useForm} from "vee-validate";

definePageMeta({
  layout: false // Disables the default layout for this page
})
const formSchema = toTypedSchema(z.object({
  email: z.string().email(),
  password:z.string(),
}))
// const form = ref({
//   email: '',
//   password: '',
// });
const form = useForm({
  validationSchema: formSchema,
})
const onSubmit = form.handleSubmit(async (values) => {
  console.log('Form submitted!', values)
  loading.value = true;
  try {
    const {token} = await $fetch(`${config.public.apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      body: values,
    });

    userStore.setToken(token); // Сохраняем токен в хранилище
    await userStore.fetchUser(); // Загружаем данные пользователя

    await router.push('/home'); // Перенаправление на главную страницу
  } catch (error) {
    alert(error.data.message || 'Failed to login.');
  } finally {
    loading.value = false;
  }
})
const loading = ref(false);
const userStore = useUserStore();
const router = useRouter();
const config = useRuntimeConfig();

async function login() {
  loading.value = true;
  try {
    const { token } = await $fetch(`${config.public.apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      body: form.value,
    });

    userStore.setToken(token); // Сохраняем токен в хранилище
    await userStore.fetchUser(); // Загружаем данные пользователя

    await router.push('/home'); // Перенаправление на главную страницу
  } catch (error) {
    alert(error.data.message || 'Failed to login.');
  } finally {
    loading.value = false;
  }
}
</script>
