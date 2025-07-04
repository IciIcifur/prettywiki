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
    class="flex w-full flex-col gap-2 pt-2"
    :schema="signUpFormSchema"
    :state="state"
  >
    <UFormField :label="t('signUp.username')" name="login" required size="sm">
      <UInput
        v-model="state.login"
        class="w-full"
        icon="i-lucide-circle-user"
        :placeholder="t('signUp.usernamePlaceholder')"
        size="xl"
        variant="soft"
      >
        <template v-if="state.login?.length" #trailing>
          <UButton
            :aria-label="t('signUp.clearInput')"
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

    <UFormField
      :label="t('signUp.password')"
      name="password"
      required
      size="sm"
    >
      <UInput
        v-model="state.password"
        class="w-full"
        icon="i-lucide-lock"
        :placeholder="t('signUp.passwordPlaceholder')"
        size="xl"
        :type="passwordVisible ? 'text' : 'password'"
        variant="soft"
      >
        <template #trailing>
          <UButton
            :aria-label="t('signUp.showPassword')"
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

    <UFormField :label="t('signUp.email')" name="email" size="sm">
      <UInput
        v-model="state.email"
        class="w-full"
        icon="i-lucide-mail"
        :placeholder="t('signUp.emailPlaceholder', { at: '@' })"
        size="xl"
        variant="soft"
      >
        <template v-if="state.email?.length" #trailing>
          <UButton
            :aria-label="t('signUp.clearInput')"
            color="neutral"
            icon="i-lucide-x"
            size="sm"
            variant="ghost"
            @click="state.email = ''"
          />
        </template>
      </UInput>
      <template #error="{ error }">
        {{ error && t(error as string) }}
      </template>
    </UFormField>
  </UForm>
</template>
