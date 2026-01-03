<script setup lang="ts">
import Content from './components/Content.vue';
import Header from './components/Header.vue';

</script>

<template>
  <div class="content">
    <Header></Header>
    <Content></Content>
  </div>
</template>

<style scoped>
.content {
  @apply w-full min-h-screen flex flex-col;
}

.content > div.header {
  @apply flex-none;
}

.content > div.main {
  @apply flex-auto;
}
</style>
