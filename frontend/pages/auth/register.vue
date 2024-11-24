<template>
<!--  <div class="max-w-md mx-auto p-8">-->
<!--    <h1 class="text-2xl font-bold mb-6">Register</h1>-->
<!--    <form @submit.prevent="register">-->
<!--      <div class="mb-4">-->
<!--        <label class="block text-sm font-medium mb-2">Name</label>-->
<!--        <input-->
<!--            type="text"-->
<!--            v-model="form.name"-->
<!--            placeholder="Your name"-->
<!--            class="input input-bordered w-full"-->
<!--            required-->
<!--        />-->
<!--      </div>-->
<!--      <div class="mb-4">-->
<!--        <label class="block text-sm font-medium mb-2">Email</label>-->
<!--        <input-->
<!--            type="email"-->
<!--            v-model="form.email"-->
<!--            placeholder="you@example.com"-->
<!--            class="input input-bordered w-full"-->
<!--            required-->
<!--        />-->
<!--      </div>-->
<!--      <div class="mb-4">-->
<!--        <label class="block text-sm font-medium mb-2">Password</label>-->
<!--        <input-->
<!--            type="password"-->
<!--            v-model="form.password"-->
<!--            placeholder="Your password"-->
<!--            class="input input-bordered w-full"-->
<!--            required-->
<!--        />-->
<!--      </div>-->
<!--      <button-->
<!--          type="submit"-->
<!--          class="btn btn-primary w-full"-->
<!--          :disabled="loading"-->
<!--      >-->
<!--        {{ loading ? 'Registering...' : 'Register' }}-->
<!--      </button>-->
<!--    </form>-->
<!--  </div>-->
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">
            Регистрация
          </h1>
          <p class="text-balance text-muted-foreground">
Зарегистрируйтесь чтобы быстрее начать чтение!        </p>
        </div>
        <form @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Введите ваше имя" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel> Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Введите ваш email" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Придумайте пароль" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" variant="outline" class="w-full mt-4">
            Зарегистрироваться
          </Button>
          <div class="mt-4 text-center text-sm">
            Уже есть аккаунт?
            <NuxtLink to="/auth/login" class="underline">
              Войти
            </NuxtLink>
          </div>
        </form>





      </div>
    </div>
    <div class="hidden bg-muted lg:block">
      <NuxtImg
          src="https://images.pexels.com/photos/28982078/pexels-photo-28982078/free-photo-of-open-book-on-cozy-bed-with-dramatic-shadows.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
          alt="Image"
          width="1920"
          height="1080"
          class="h-full w-full object-cover"
      />
    </div>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router';
import {toTypedSchema} from "@vee-validate/zod";
import * as z from "zod";
import {useForm} from "vee-validate";

definePageMeta({
  layout: false // Disables the default layout for this page
})
const formSchema = toTypedSchema(z.object({
  name:z.string(),
  email: z.string().email(),
  password:z.string(),
}))

const form = useForm({
  validationSchema: formSchema,
})
const router = useRouter();
const config = useRuntimeConfig();

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await $fetch(`${config.public.apiBaseUrl}/api/auth/register`, {
      method: 'POST',
      body: values,
    });
    await router.push('/auth/login'); // Перенаправление на страницу логина
  } catch (error) {
    alert(error.data.message || 'Failed to register.');
  }
})





</script>
