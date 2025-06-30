<script setup lang="ts">
import { useUserStore } from '../stores/userStore.ts';
import { computed, reactive, ref } from 'vue';

const { user, isAuthenticated, logout } = useUserStore();
const items = ref([{ label: 'Вход' }, { label: 'Регистрация' }]);
const activeTab = ref('0');

const signInFormValue = reactive({});
const signUpFormValue = reactive({});

function onSubmit() {
  if (activeTab.value === '0') console.log(signInFormValue);
  else console.log(signUpFormValue);
}

const actionText = computed(() =>
  activeTab.value === '0' ? 'Войти' : 'Зарегистрироваться',
);
</script>

<template>
  <div class="flex w-full items-center justify-center">
    <UCard v-if="isAuthenticated" class="max-w-md">
      <template #header>
        <h4 class="h-8 w-full">Вы уже вошли в систему!</h4>
      </template>

      <p>
        Вы уже выполнили вход в систему под никнеймом
        <span class="text-indigo-500 dark:text-indigo-400">{{
          user.nickname
        }}</span
        >. Хотите выйти из аккаунта?
      </p>

      <template #footer>
        <div class="flex h-8 justify-between gap-4">
          <UButton
            @click="logout"
            label="Выйти"
            size="lg"
            variant="ghost"
            color="error"
          />
          <UButton to="/" label="На главную" variant="link" />
        </div>
      </template>
    </UCard>
    <UCard v-else class="w-full max-w-md">
      <UTabs v-model="activeTab" :items="items" color="neutral" class="w-full">
        <template #content="{ index }"
          ><SignInForm v-if="index === '0'" /> <SignUpForm v-else />
        </template>
      </UTabs>

      <template #footer>
        <div class="flex h-8 items-center justify-between gap-4">
          <UButton
            to="/"
            label="Вернуться на главную"
            variant="link"
            color="neutral"
          />
          <UButton
            @click.prevent="onSubmit"
            :label="actionText"
            variant="solid"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
