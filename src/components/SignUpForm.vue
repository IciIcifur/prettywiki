<script setup lang="ts">
  import type { SignUpFormSchemaType } from '../types/zodSchemas.ts';
  import { signUpFormSchema } from '../types/zodSchemas.ts';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { state } = defineProps<{
    state: SignUpFormSchemaType;
  }>();
  const passwordVisible = ref(false);
  const { t } = useI18n();
</script>

<template>
  <UForm :schema="signUpFormSchema" :state="state" class="flex w-full flex-col gap-2 pt-2">
    <UFormField :label="t('signUp.username')" name="login" size="sm" required>
      <UInput
        icon="i-lucide-circle-user"
        v-model="state.login"
        variant="soft"
        :placeholder="t('signUp.usernamePlaceholder')"
        class="w-full"
        size="xl"
      >
        <template v-if="state.login?.length" #trailing>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-x"
            :aria-label="t('signUp.clearInput')"
            @click="state.login = ''"
          />
        </template>
      </UInput>
      <template #error="{ error }">
        {{ error && t(error) }}
      </template>
    </UFormField>

    <UFormField :label="t('signUp.password')" name="password" size="sm" required>
      <UInput
        icon="i-lucide-lock"
        v-model="state.password"
        variant="soft"
        :placeholder="t('signUp.passwordPlaceholder')"
        :type="passwordVisible ? 'text' : 'password'"
        class="w-full"
        size="xl"
      >
        <template #trailing>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            :icon="passwordVisible ? 'i-lucide-eye' : 'i-lucide-eye-closed'"
            :aria-label="t('signUp.showPassword')"
            @click.stop="passwordVisible = !passwordVisible"
          />
        </template>
      </UInput>
      <template #error="{ error }">
        {{ error && t(error) }}
      </template>
    </UFormField>

    <UFormField :label="t('signUp.email')" name="email" size="sm">
      <UInput
        icon="i-lucide-mail"
        v-model="state.email"
        variant="soft"
        :placeholder="t('signUp.emailPlaceholder', { at: '@' })"
        class="w-full"
        size="xl"
      >
        <template v-if="state.email?.length" #trailing>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-x"
            :aria-label="t('signUp.clearInput')"
            @click="state.email = ''"
          />
        </template>
      </UInput>
      <template #error="{ error }">
        {{ error && t(error) }}
      </template>
    </UFormField>
  </UForm>
</template>
