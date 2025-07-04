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
    class="flex w-full flex-col gap-2 pt-2"
    :schema="signInFormSchema"
    :state="state"
  >
    <UFormField :label="t('signIn.username')" name="login" size="sm">
      <UInput
        v-model="state.login"
        class="w-full"
        icon="i-lucide-circle-user"
        :placeholder="t('signIn.usernamePlaceholder')"
        size="xl"
        variant="soft"
      >
        <template v-if="state.login?.length" #trailing>
          <UButton
            aria-label="Clear input"
            color="neutral"
            icon="i-lucide-x"
            size="sm"
            variant="ghost"
            @click="state.login = ''"
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
        class="w-full"
        icon="i-lucide-lock"
        :placeholder="t('signIn.passwordPlaceholder')"
        size="xl"
        :type="passwordVisible ? 'text' : 'password'"
        variant="soft"
      >
        <template #trailing>
          <UButton
            :aria-label="t('signIn.showPassword')"
            color="neutral"
            :icon="passwordVisible ? 'i-lucide-eye' : 'i-lucide-eye-closed'"
            size="sm"
            variant="ghost"
            @click.stop="passwordVisible = !passwordVisible"
          />
        </template>
      </UInput>
      <template #error="{ error }">
        {{ error && t(error as string) }}
      </template>
    </UFormField>
  </UForm>
</template>
