<script setup lang="ts">
  import type { SignUpFormSchemaType } from '../types/zodSchemas.ts';
  import { signUpFormSchema } from '../types/zodSchemas.ts';
  import { reactive, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { state: globalState } = defineProps<{ state: SignUpFormSchemaType }>();
  const state = reactive({ ...globalState });

  const passwordVisible = ref(false);
  const { t } = useI18n();

  const emit = defineEmits(['update:state']);
  watch(state, (newState) => emit('update:state', { ...newState }), {
    deep: true,
  });
</script>

<template>
  <UForm
    :schema="signUpFormSchema"
    :state="state"
    class="flex w-full flex-col gap-2 pt-2"
  >
    <UFormField :label="t('signUp.username')" name="login" required size="sm">
      <UInput
        v-model="state.login"
        :placeholder="t('signUp.usernamePlaceholder')"
        class="w-full"
        icon="i-lucide-circle-user"
        size="xl"
        variant="soft"
      >
        <template #trailing v-if="state.login?.length">
          <UButton
            @click="state.login = ''"
            :aria-label="t('signUp.clearInput')"
            color="neutral"
            icon="i-lucide-x"
            size="sm"
            variant="ghost"
          />
        </template>
      </UInput>
      <template #error="{ error }">
        {{ error && t(error as string) }}
      </template>
    </UFormField>

    <UFormField
      :label="t('signUp.password')"
      name="password"
      required
      size="sm"
    >
      <UInput
        v-model="state.password"
        :placeholder="t('signUp.passwordPlaceholder')"
        :type="passwordVisible ? 'text' : 'password'"
        class="w-full"
        icon="i-lucide-lock"
        size="xl"
        variant="soft"
      >
        <template #trailing>
          <UButton
            @click.stop="passwordVisible = !passwordVisible"
            :aria-label="t('signUp.showPassword')"
            :icon="passwordVisible ? 'i-lucide-eye' : 'i-lucide-eye-closed'"
            color="neutral"
            size="sm"
            variant="ghost"
          />
        </template>
      </UInput>
      <template #error="{ error }">
        {{ error && t(error as string) }}
      </template>
    </UFormField>

    <UFormField :label="t('signUp.email')" name="email" size="sm">
      <UInput
        v-model="state.email"
        :placeholder="t('signUp.emailPlaceholder', { at: '@' })"
        class="w-full"
        icon="i-lucide-mail"
        size="xl"
        variant="soft"
      >
        <template #trailing v-if="state.email?.length">
          <UButton
            @click="state.email = ''"
            :aria-label="t('signUp.clearInput')"
            color="neutral"
            icon="i-lucide-x"
            size="sm"
            variant="ghost"
          />
        </template>
      </UInput>
      <template #error="{ error }">
        {{ error && t(error as string) }}
      </template>
    </UFormField>
  </UForm>
</template>
