<script setup lang="ts">
import ComponentPanel from './components/ComponentPanel.vue'
import Canvas from './components/Canvas.vue'
</script>

<template>
  <div class="app-layout">
    <aside class="app-sidebar">
      <ComponentPanel />
    </aside>
    <main class="app-main">
      <Canvas />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.app-sidebar {
  width: 280px;
  min-width: 280px;
  border-right: 1px solid #e0e0e0;
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  overflow: auto;
  padding: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
</style>
