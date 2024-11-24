<script lang="ts">
export const description
    = 'A sidebar that collapses to icons.'

</script>

<script setup lang=ts>

import {useUserStore} from '~/stores/user';
import {useRouter} from 'vue-router';
import {

  BookOpen,

  ChevronsUpDown,
    Upload,


  LogOut,
    LogIn,


  SquareTerminal,
} from 'lucide-vue-next'
const userStore = useUserStore();
const router = useRouter();

function logout() {
  userStore.clear(); // Очищаем токен и данные пользователя
  router.push('/'); // Перенаправляем на страницу логина
}
// Обработчик клика по кнопке
function handleAuth() {
  if (userStore.user) {
    // Если пользователь авторизован — выполняем выход
    userStore.clear();
    router.push('/'); // Перенаправляем на главную страницу
  } else {
    // Если пользователь не авторизован — перенаправляем на страницу входа
    router.push('/auth/login');
  }
}


// This is sample data.
const data = {
  navMain: [
    {
      title: 'Главная',
      url: '/home',
      icon: SquareTerminal,
      isActive: true,
    },

    {
      title: 'Каталог',
      url: '/books',
      icon: BookOpen,
    },
    {
      title: 'Загрузить книгу',
      url: '/uploadbook',
      icon: Upload,
    },
  ],

}

const route = useRoute()

const breadcrumbs = ref([])

// Helper to define custom breadcrumb names for dynamic params
const getBreadcrumbName = (part) => {
  if (part === 'books') {
    return 'Books'
  } else if (part === 'authors') {
    return 'Authors'
  } else if (part === 'id') {
    return 'Book Details'
  } else {
    return part.charAt(0).toUpperCase() + part.slice(1) // Capitalize default path parts
  }
}
// Function to generate breadcrumbs based on route
const generateBreadcrumbs = computed(() => {
  const pathParts = route.path.split('/').filter(Boolean)

  return pathParts.map((part, index) => {
    const breadcrumbName = getBreadcrumbName(part)
    const href = `/${pathParts.slice(0, index + 1).join('/')}`

    return { name: breadcrumbName, href }
  })
})

// Watch the route for changes and update breadcrumbs
watch(() => route.path, () => {
  breadcrumbs.value = generateBreadcrumbs.value
}, { immediate: true })


</script>

<template>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
                size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Icon name='lucide:book-open-text' class="size-4"/>
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Bookly</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>

                  <SidebarMenuButton v-for="item in data.navMain"
                                     :key="item.title" :tooltip="item.title">
                    <component :is="item.icon" />
                    <NuxtLink :to="item.url">

                    <span>{{ item.title }}</span>
                    </NuxtLink>
                  </SidebarMenuButton>

          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter v-if="userStore.user">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <SidebarMenuButton
                    size="lg"
                    class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage src="data.user.avatar" :alt="userStore.user?.name" />
                    <AvatarFallback class="rounded-lg">
                      {{userStore.user?.name}}
                    </AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ userStore.user?.name }}</span>
                    <span class="truncate text-xs">{{ userStore.user?.email }}</span>
                  </div>
                  <ChevronsUpDown class="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom" align="end" :side-offset="4">
                <DropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar class="h-8 w-8 rounded-lg">
                      <AvatarImage src="data.user.avatar" :alt="userStore.user?.name" />
                      <AvatarFallback class="rounded-lg">
                        {{ userStore.user?.name }}
                      </AvatarFallback>
                    </Avatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{ userStore.user?.name }}</span>
                      <span class="truncate text-xs">{{ userStore.user?.email }}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleAuth">
                  <LogOut v-if="userStore.user" />
                  <LogIn v-else/>
                  {{ userStore.user ? 'Выйти' : 'Войти' }}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <!-- Loop through each route to generate breadcrumbs -->
              <BreadcrumbItem
                  v-for="(crumb, index) in breadcrumbs"
                  :key="index"
                  :class="{' ': index !== breadcrumbs.length - 1}"
              >
                <BreadcrumbLink :href="crumb.href">
                  {{ crumb.name }}
                </BreadcrumbLink>
              <BreadcrumbSeparator  />
              </BreadcrumbItem>
              <!-- Separator between items -->
            </BreadcrumbList>
          </Breadcrumb>
          <ColorModeToggle/>
        </div>
      </header>
      <NuxtPage/>
    </SidebarInset>
  </SidebarProvider>
</template>