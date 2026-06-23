<script setup lang="ts">
import { computed, onUnmounted, ref, watch, shallowRef } from 'vue'
import { useCanvasStore } from '../stores/canvas'
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
  if (type) {
    store.addComponent(type as ComponentSchema['type'])
  }
}

/** 选中组件 */
function onSelectComponent(id: string): void {
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

/** 根据类型查找 layout 结果 */
function getLayout(id: string): LayoutResult | undefined {
  return layoutResults.value.find((l) => l.id === id)
}

/** 渲染单个组件（无递归容器，只展示一层） */
function renderComponent(comp: ComponentSchema): string {
  switch (comp.type) {
    case 'text':
      return (comp.props as { content?: string }).content || '文本'
    case 'button':
      return (comp.props as { label?: string }).label || '按钮'
    case 'image':
      return '🖼 图片'
    case 'container':
      return `容器 (${comp.children?.length ?? 0} 个子组件)`
    case 'form':
      return (comp.props as { title?: string }).title || '表单'
    default:
      return '未知组件'
  }
}
</script>

<template>
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
          width: (getLayout(comp.id)?.width ?? 200) + 'px',
          height: (getLayout(comp.id)?.height ?? 80) + 'px',
        }"
        @click.stop="onSelectComponent(comp.id)"
      >
        <div class="component-type-tag">{{ comp.type }}</div>

        <!-- text -->
        <div v-if="comp.type === 'text'" class="component-render component-text">
          {{ (comp.props as { content: string }).content }}
        </div>

        <!-- button -->
        <button
          v-else-if="comp.type === 'button'"
          class="component-render component-button"
          :class="(comp.props as { type?: string }).type === 'primary' ? 'btn-primary' : 'btn-default'"
        >
          {{ (comp.props as { label: string }).label }}
        </button>

        <!-- image -->
        <img
          v-else-if="comp.type === 'image'"
          class="component-render component-image"
          :src="(comp.props as { src: string }).src"
          :alt="(comp.props as { alt?: string }).alt ?? ''"
          draggable="false"
        />

        <!-- container -->
        <div v-else-if="comp.type === 'container'" class="component-render component-container">
          <div class="container-placeholder">
            容器 ({{ comp.children?.length ?? 0 }} 子组件)
          </div>
        </div>

        <!-- form -->
        <div v-else-if="comp.type === 'form'" class="component-render component-form">
          <div class="form-title">{{ (comp.props as { title?: string }).title ?? '表单' }}</div>
          <div class="form-placeholder">表单区域</div>
        </div>

        <!-- 未知类型 -->
        <div v-else class="component-render component-unknown">未知组件</div>
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

.component-render {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.component-text {
  padding: 8px;
  font-size: 14px;
  word-break: break-all;
}

.component-button {
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  margin: auto;
}

.btn-primary {
  background: #409eff;
  color: #fff;
}

.btn-default {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
}

.component-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.component-container {
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  color: #999;
  font-size: 13px;
}

.component-form {
  flex-direction: column;
  gap: 4px;
}

.form-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.form-placeholder {
  font-size: 11px;
  color: #bbb;
}

.component-unknown {
  color: #999;
  font-size: 13px;
  background: #fafafa;
}
</style>
