<script setup lang="ts">
  import type { SignInFormSchemaType } from '../types/zodSchemas.ts';
  import { signInFormSchema } from '../types/zodSchemas.ts';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { state } = defineProps<{ state: SignInFormSchemaType }>();
  const passwordVisible = ref(false);
  const { t } = useI18n();
</script>

<template>
  <UForm
    :schema="signInFormSchema"
    :state="state"
    class="flex w-full flex-col gap-2 pt-2"
  >
    <UFormField :label="t('signIn.username')" name="login" size="sm">
      <UInput
        icon="i-lucide-circle-user"
        v-model="state.login"
        variant="soft"
        :placeholder="t('signIn.usernamePlaceholder')"
        class="w-full"
        size="lg"
      >
        <template v-if="state.login?.length" #trailing>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-x"
            aria-label="Clear input"
            @click="state.login = ''"
          />
        </template>
      </UInput>
      <template #error="{ error }">
        {{ error && t(error) }}
      </template>
    </UFormField>

    <UFormField :label="t('signIn.password')" name="password" size="sm">
      <UInput
        icon="i-lucide-lock"
        v-model="state.password"
        variant="soft"
        :placeholder="t('signIn.passwordPlaceholder')"
        :type="passwordVisible ? 'text' : 'password'"
        class="w-full"
        size="lg"
      >
        <template #trailing>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            :icon="passwordVisible ? 'i-lucide-eye' : 'i-lucide-eye-closed'"
            :aria-label="t('signIn.showPassword')"
            @click.stop="passwordVisible = !passwordVisible"
          />
        </template>
      </UInput>
      <template #error="{ error }">
        {{ error && t(error) }}
      </template>
    </UFormField>
  </UForm>
</template>
