<script setup lang="ts">
import { useUserStore } from '../stores/userStore.ts';
import { computed, reactive, ref } from 'vue';
import type {
  SignInFormSchemaType,
  SignUpFormSchemaType,
} from '../utils/zodSchemas.ts';
import { signInFormSchema, signUpFormSchema } from '../utils/zodSchemas.ts';

const userStore = useUserStore();
const items = ref([{ label: 'Вход' }, { label: 'Регистрация' }]);
const activeTab = ref('0');

const signInFormValue = reactive<SignInFormSchemaType>({
  login: '',
  password: '',
});
const signUpFormValue = reactive<SignUpFormSchemaType>({
  login: '',
  password: '',
  email: undefined,
});

function onSubmit() {
  if (activeTab.value === '0') console.log(signInFormValue.login);
  else console.log(signUpFormValue.login);
  userStore.login({ id: Date.now().toString(), login: signInFormValue.login });
}

const actionText = computed<string>(() =>
  activeTab.value === '0' ? 'Войти' : 'Зарегистрироваться',
);

const actionDisabled = computed<boolean>(() => {
  try {
    if (activeTab.value === '0') signInFormSchema.parse(signInFormValue);
    else signUpFormSchema.parse(signUpFormValue);
    return false;
  } catch {
    return true;
  }
});
</script>

<template>
  <div class="flex w-full items-center justify-center">
    <UCard v-if="userStore.isAuthenticated" class="max-w-md">
      <template #header>
        <h4 class="h-8 w-full">Вы уже вошли в систему!</h4>
      </template>

      <p>
        Вы уже выполнили вход в систему с логином
        <span class="font-medium text-cyan-500 dark:text-cyan-400">{{
          userStore.user?.login
        }}</span
        >. Хотите выйти из аккаунта?
      </p>

      <template #footer>
        <div class="flex h-8 justify-between gap-4">
          <UButton
            @click="userStore.logout"
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
          ><SignInForm v-if="index == 0" :state="signInFormValue" />
          <SignUpForm v-else :state="signUpFormValue" />
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
            :disabled="actionDisabled"
            :label="actionText"
            variant="solid"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>
