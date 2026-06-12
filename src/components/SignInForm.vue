<script setup lang="ts">
  import type { SignInFormSchemaType } from '../types/zodSchemas.ts';
  import { signInFormSchema } from '../types/zodSchemas.ts';
  import { reactive, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { state: globalState } = defineProps<{ state: SignInFormSchemaType }>();
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
    :schema="signInFormSchema"
    :state="state"
    class="flex w-full flex-col gap-2 pt-2"
  >
    <UFormField :label="t('signIn.username')" name="login" size="sm">
      <UInput
        v-model="state.login"
        :placeholder="t('signIn.usernamePlaceholder')"
        class="w-full"
        icon="i-lucide-circle-user"
        size="xl"
        variant="soft"
      >
        <template #trailing v-if="state.login?.length">
          <UButton
            @click="state.login = ''"
            aria-label="Clear input"
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

    <UFormField :label="t('signIn.password')" name="password" size="sm">
      <UInput
        v-model="state.password"
        :placeholder="t('signIn.passwordPlaceholder')"
        :type="passwordVisible ? 'text' : 'password'"
        class="w-full"
        icon="i-lucide-lock"
        size="xl"
        variant="soft"
      >
        <template #trailing>
          <UButton
            @click.stop="passwordVisible = !passwordVisible"
            :aria-label="t('signIn.showPassword')"
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
  </UForm>
</template>
