<script setup lang="ts"></script>

<template>
  <div class="flex h-fit min-h-screen w-full flex-col">
    <HeaderMenu />
    <div class="flex-1 px-8 py-4"><slot /></div>
    <FooterMenu />
  </div>
</template>
