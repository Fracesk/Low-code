<script setup lang="ts">
import ComponentPanel from './components/ComponentPanel.vue'
import Canvas from './components/Canvas.vue'
import PropertyPanel from './components/PropertyPanel.vue'
import { useCanvasStore } from './stores/canvas'

const store = useCanvasStore()
</script>

<template>
  <div class="app-layout">
    <aside class="app-sidebar">
      <ComponentPanel />
    </aside>
    <main class="app-main">
      <Canvas />
    </main>
    <Transition name="slide">
      <aside v-if="store.selectedId" class="app-property-panel">
        <PropertyPanel />
      </aside>
    </Transition>
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

.app-property-panel {
  width: 300px;
  min-width: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 滑入/滑出动画 */
.slide-enter-active,
.slide-leave-active {
  transition: width 0.2s ease, min-width 0.2s ease, opacity 0.2s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  width: 0;
  min-width: 0;
  opacity: 0;
}
</style>
