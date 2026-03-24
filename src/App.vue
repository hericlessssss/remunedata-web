<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAutoSeo } from '@/shared/utils/seo'

useAutoSeo()
</script>

<template>
  <RouterView />
</template>

<style>
/* Estilos globais */
</style>
