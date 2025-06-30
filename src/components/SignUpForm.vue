<script setup lang="ts">
import { signUpFormSchema, SignUpFormSchemaType } from '../utils/zodSchemas.ts';
import { ref } from 'vue';

const { state } = defineProps<{ state: SignUpFormSchemaType }>();
const passwordVisible = ref(false);
</script>

<template>
  <UForm
    :schema="signUpFormSchema"
    :state="state"
    class="flex w-full flex-col gap-2 pt-2"
  >
    <UFormField label="Имя пользователя" name="login" size="sm" required>
      <UInput
        icon="i-lucide-circle-user"
        v-model="state.login"
        variant="soft"
        placeholder="PrettyMade"
        class="w-full"
        size="lg"
        ><template v-if="state.login?.length" #trailing>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-x"
            aria-label="Clear input"
            @click="state.login = ''"
          /> </template
      ></UInput>
    </UFormField>

    <UFormField label="Пароль" name="password" size="sm" required>
      <UInput
        icon="i-lucide-lock"
        v-model="state.password"
        variant="soft"
        placeholder="Qwerty123"
        :type="passwordVisible ? 'text' : 'password'"
        class="w-full"
        size="lg"
        ><template #trailing>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            :icon="passwordVisible ? 'i-lucide-eye' : 'i-lucide-eye-closed'"
            aria-label="Show password"
            @click.stop="passwordVisible = !passwordVisible"
          /> </template
      ></UInput>
    </UFormField>

    <UFormField label="Эл. адрес" name="email" size="sm">
      <UInput
        icon="i-lucide-mail"
        v-model="state.email"
        variant="soft"
        placeholder="pretty_made@gmail.com"
        class="w-full"
        size="lg"
        ><template v-if="state.email?.length" #trailing>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-x"
            aria-label="Clear input"
            @click="state.email = ''"
          /> </template
      ></UInput>
    </UFormField>
  </UForm>
</template>
