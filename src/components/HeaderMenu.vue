<script setup lang="ts"></script>

<template>
  <header
    class="sticky top-0 z-50 flex h-fit w-full items-center justify-between gap-2 border-b border-neutral-200 bg-white/40 px-8 py-2 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/60"
  >
    <div class="flex h-fit flex-col items-start justify-center">
      <ULink
        to="/"
        class="font-cormorant text-4xl font-black text-indigo-500 transition-colors hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-500"
        ><p>PrettyWiki</p></ULink
      >
      <p class="text-xs italic">Красивая энциклопедия</p>
    </div>
    <ToggleColorScheme />
  </header>
</template>
