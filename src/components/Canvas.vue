<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, shallowRef } from 'vue'
import { useCanvasStore } from '../stores/canvas'
import ComponentRenderer from './ComponentRenderer.vue'
import type { ComponentSchema, LayoutResult } from '../types/schema'

const emit = defineEmits<{
  select: [id: string | null]
}>()

const store = useCanvasStore()

/** 画布容器引用 */
const canvasRef = ref<HTMLDivElement | null>(null)
const containerWidth = ref(800)

/** Worker 实例 */
const worker = shallowRef<Worker | null>(null)
/** Worker 计算结果（位置信息） */
const layoutResults = shallowRef<LayoutResult[]>([])
/** Worker 是否就绪 */
const workerReady = ref(false)
/** Worker 错误降级标志 */
const workerFailed = ref(false)

/** 初始化 Worker */
function initWorker(): void {
  try {
    const w = new Worker(
      new URL('../workers/layout.worker.ts', import.meta.url),
      { type: 'module' },
    )

    w.onmessage = (e: MessageEvent<LayoutResult[]>) => {
      layoutResults.value = e.data
      workerReady.value = true
    }

    w.onerror = () => {
      console.warn('Worker 加载失败，降级到主线程计算')
      workerFailed.value = true
      workerReady.value = true
    }

    worker.value = w
    workerReady.value = true
  } catch {
    console.warn('Worker 创建失败，降级到主线程计算')
    workerFailed.value = true
    workerReady.value = true
  }
}

/** 主线程降级布局计算 */
function computeLayoutFallback(): void {
  if (!store.components.length || containerWidth.value <= 0) {
    layoutResults.value = []
    return
  }

  const COLUMNS = 3
  const GAP = 12
  const ITEM_HEIGHT = 120
  const itemWidth = (containerWidth.value - GAP * (COLUMNS + 1)) / COLUMNS

  layoutResults.value = store.components.map((comp, index) => {
    const row = Math.floor(index / COLUMNS)
    const col = index % COLUMNS
    return {
      id: comp.id,
      x: GAP + col * (itemWidth + GAP),
      y: GAP + row * (ITEM_HEIGHT + GAP),
      width: Math.max(itemWidth, 50),
      height: ITEM_HEIGHT,
    }
  })
}

/** 派发布局计算 */
function requestLayout(): void {
  if (!containerWidth.value) {
    layoutResults.value = []
    return
  }

  if (workerFailed.value || !worker.value) {
    computeLayoutFallback()
    return
  }

  worker.value.postMessage({
    components: JSON.parse(JSON.stringify(store.components)),
    containerWidth: containerWidth.value,
  })
}

/** 初始化 Worker */
initWorker()

/** 当组件列表变化时重新计算布局 */
watch(
  () => store.components.length,
  () => requestLayout(),
  { immediate: true },
)

/** ResizeObserver 监听容器宽度变化 */
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    containerWidth.value = entry.contentRect.width
    requestLayout()
  }
})

watch(
  () => canvasRef.value,
  (el) => {
    if (el) {
      resizeObserver.observe(el)
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  worker.value?.terminate()
  resizeObserver.disconnect()
  window.removeEventListener('keydown', onKeyDown)
})

/** 拖拽放置 */
function onDragOver(e: DragEvent): void {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy'
  }
}

function onDrop(e: DragEvent): void {
  e.preventDefault()
  const type = e.dataTransfer?.getData('component-type')
  if (!type) return

  // 检查是否放在容器上（通过 data 属性查找）
  const containerEl = (e.target as HTMLElement).closest('[data-container-id]')
  if (containerEl) {
    const containerId = containerEl.getAttribute('data-container-id')!
    store.addChildToContainer(containerId, type as ComponentSchema['type'])
  } else {
    store.addComponent(type as ComponentSchema['type'])
  }
}

/** 选中组件 */
function onSelectComponent(id: string | null): void {
  store.selectComponent(id)
  emit('select', id)
}

/** 点击画布空白取消选中 */
function onCanvasClick(e: MouseEvent): void {
  const target = e.target as HTMLElement
  if (!target.closest('.canvas-component') && !target.closest('.canvas-status') && !target.closest('.canvas-empty')) {
    store.selectComponent(null)
    emit('select', null)
  }
}

/** 键盘删除选中组件 */
function onKeyDown(e: KeyboardEvent): void {
  const tag = (e.target as HTMLElement).tagName
  const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable

  // 撤销/重做 Ctrl+Z / Ctrl+Shift+Z
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    if (isInput) return
    e.preventDefault()
    if (e.shiftKey) {
      store.redo()
    } else {
      store.undo()
    }
    return
  }

  // 删除 Delete / Backspace
  if ((e.key === 'Delete' || e.key === 'Backspace') && store.selectedId) {
    if (isInput) return
    if (store.editingId) return
    e.preventDefault()
    store.removeComponent(store.selectedId)
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

/** 根据类型查找 layout 结果 */
function getLayout(id: string): LayoutResult | undefined {
  return layoutResults.value.find((l) => l.id === id)
}

/** 导出 HTML */
function handleExport(): void {
  import('../utils/exportHtml').then(({ generateHtml, downloadHtml }) => {
    const html = generateHtml(store.components)
    downloadHtml(html, 'my-page.html')
  })
}
</script>

<template>
  <div class="canvas-wrapper">
    <!-- 工具栏 -->
    <div class="canvas-toolbar">
      <div class="toolbar-left">
        <button
          class="toolbar-btn"
          :disabled="store.history.length === 0"
          title="撤销 Ctrl+Z"
          @click="store.undo()"
        >↩ 撤销</button>
        <button
          class="toolbar-btn"
          :disabled="store.future.length === 0"
          title="重做 Ctrl+Shift+Z"
          @click="store.redo()"
        >↪ 重做</button>
      </div>
      <div class="toolbar-right">
        <button class="toolbar-btn btn-export" @click="handleExport">导出 HTML</button>
      </div>
    </div>

    <div
      ref="canvasRef"
      class="canvas"
      :class="{ 'canvas-dragover': false }"
      @dragover="onDragOver"
      @drop="onDrop"
      @click="onCanvasClick"
    >
      <!-- 加载提示 -->
      <div v-if="!workerReady" class="canvas-status">
        布局计算中...
      </div>

      <!-- 空画布提示 -->
      <div
        v-else-if="store.components.length === 0"
        class="canvas-empty"
      >
        <div class="canvas-empty-icon">+</div>
        <p>拖拽组件到此处</p>
      </div>

      <!-- 组件渲染区 -->
      <div
        v-else
        class="canvas-components"
        :style="{ position: 'relative', width: '100%', minHeight: '400px' }"
      >
        <div
          v-for="comp in store.components"
          :key="comp.id"
          class="canvas-component"
          :class="{ selected: store.selectedId === comp.id }"
          :style="{
            position: 'absolute',
            left: (getLayout(comp.id)?.x ?? 0) + 'px',
            top: (getLayout(comp.id)?.y ?? 0) + 'px',
            width: comp.type === 'container' ? 'auto' : (getLayout(comp.id)?.width ?? 200) + 'px',
            minWidth: (getLayout(comp.id)?.width ?? 200) + 'px',
            height: comp.type === 'container' ? 'auto' : (getLayout(comp.id)?.height ?? 80) + 'px',
            minHeight: (getLayout(comp.id)?.height ?? 80) + 'px',
          }"
          :data-container-id="comp.type === 'container' ? comp.id : undefined"
          @click.stop="onSelectComponent(comp.id)"
        >
          <div class="component-type-tag">{{ comp.type }}</div>
          <ComponentRenderer :component="comp" @select="onSelectComponent" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas {
  width: 100%;
  max-width: 900px;
  min-height: 500px;
  background: #fff;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  transition: border-color 0.2s, background 0.2s;
  position: relative;
}

.canvas:has(.canvas-component):not(:has(.canvas-empty)) {
  border-style: solid;
  border-color: #e8e8e8;
}

.canvas-status,
.canvas-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #bbb;
  user-select: none;
}

.canvas-empty-icon {
  width: 48px;
  height: 48px;
  border: 2px dashed #d9d9d9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #d9d9d9;
  margin-bottom: 12px;
}

.canvas-empty p {
  font-size: 14px;
  color: #bbb;
}

.canvas-components {
  min-height: 400px;
}

.canvas-component {
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.canvas-component:hover {
  border-color: #409eff80;
}

.canvas-component.selected {
  border-color: #409eff;
  box-shadow: 0 0 0 2px #409eff33;
}

.component-type-tag {
  position: absolute;
  top: 2px;
  right: 4px;
  font-size: 10px;
  color: #999;
  background: #f5f5f5;
  padding: 0 4px;
  border-radius: 2px;
  line-height: 16px;
  z-index: 1;
}

/* ─── 工具栏 ─────────────────────── */
.canvas-wrapper {
  width: 100%;
  max-width: 900px;
}

.canvas-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px 8px 0 0;
  border-bottom: none;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toolbar-btn {
  padding: 4px 10px;
  font-size: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.toolbar-btn:hover:not(:disabled) {
  border-color: #409eff;
  color: #409eff;
}

.toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-export {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.btn-export:hover:not(:disabled) {
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}
</style>
