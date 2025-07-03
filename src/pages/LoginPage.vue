<script setup lang="ts">
  import { useUserStore } from '../stores/userStore.ts';
  import { computed, reactive, ref } from 'vue';
  import type {
    SignInFormSchemaType,
    SignUpFormSchemaType,
  } from '../types/zodSchemas.ts';
  import { signInFormSchema, signUpFormSchema } from '../types/zodSchemas.ts';
  import { GetUserByLogin } from '../api/userAPI.ts';
  import { useI18n } from 'vue-i18n';

  const toast = useToast();
  const { t } = useI18n();

  const userStore = useUserStore();

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

  async function onSubmit() {
    if (activeTab.value === '0') {
      const userData = await GetUserByLogin(signInFormValue.login);
      if (userData) userStore.login(userData);
      else toast.add({ color: 'error', title: t('login.userDoesntExist') });
    } else {
      toast.add({
        color: 'error',
        title: t('login.registrationUnavailable.title'),
        description: t('login.registrationUnavailable.description'),
      });
    }
  }

  const items = computed(() => [
    { label: t('login.signInTab') },
    { label: t('login.signUpTab') },
  ]);
  const actionText = computed<string>(() =>
    activeTab.value === '0' ? t('login.signInAction') : t('login.signUpAction')
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
  const alreadySignedInDescription = computed(() =>
    t('login.alreadySignedIn.description', {
      login: `<span class="font-medium text-secondary">${
        userStore.user?.login
      }</span>`,
    })
  );
</script>

<template>
  <div class="flex w-full items-center justify-center">
    <UCard v-if="userStore.isAuthenticated" class="max-w-md">
      <template #header>
        <h4 class="h-8 w-full">{{ t('login.alreadySignedIn.title') }}</h4>
      </template>

      <p v-html="alreadySignedInDescription" />

      <template #footer>
        <div class="flex h-8 justify-between gap-4">
          <UButton
            @click="userStore.logout"
            :label="t('login.signOut')"
            size="lg"
            variant="ghost"
            color="error"
          />
          <UButton to="/" :label="t('login.toMain')" variant="link" />
        </div>
      </template>
    </UCard>
    <UCard v-else class="w-full max-w-md">
      <template #header>
        <h4 class="h-8 w-full">
          {{
            activeTab === '0'
              ? t('login.header.signIn')
              : t('login.header.signUp')
          }}
        </h4>
      </template>
      <UTabs v-model="activeTab" :items="items" color="neutral" class="w-full">
        <template #content="{ index }">
          <SignInForm v-if="index == 0" :state="signInFormValue" />
          <SignUpForm v-else :state="signUpFormValue" />
        </template>
      </UTabs>

      <template #footer>
        <div class="flex h-8 items-center justify-between gap-4">
          <UButton
            to="/"
            :label="t('login.toMain')"
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
