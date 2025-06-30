<script setup lang="ts"></script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <HeaderMenu />
    <div class="flex h-full w-full flex-1 px-8 py-4">
      <router-view />
    </div>
    <FooterMenu />
  </div>
</template>
