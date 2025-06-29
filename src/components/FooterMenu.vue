<script setup lang="ts"></script>

<template>
  <footer
    class="bottom-0 z-50 flex h-fit w-full items-center justify-between gap-2 border-t border-neutral-200 bg-white/60 px-8 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900/60"
  >
    <p>© IciIcifur, 2025</p>

    <div class="flex h-fit items-center justify-center gap-1">
      <p class="text-xs italic">Источники</p>
    </div>

    <div class="flex h-fit items-center justify-center gap-1">
      <UButton
        to="https://t.me/icicle_icifur"
        variant="link"
        icon="i-lucide-send"
      />
      <UButton
        to="https://github.com/IciIcifur/prettywiki"
        variant="link"
        icon="i-lucide-github"
      />
    </div>
  </footer>
</template>
