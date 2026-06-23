<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { ComponentType } from '../types/schema'

/** 预设组件定义 */
interface ComponentDef {
  type: ComponentType
  label: string
  icon: string
}

const COMPONENT_DEFS: ComponentDef[] = [
  { type: 'text', label: '文本', icon: 'T' },
  { type: 'button', label: '按钮', icon: '▣' },
  { type: 'image', label: '图片', icon: '🖼' },
  { type: 'container', label: '容器', icon: '▢' },
  { type: 'form', label: '表单', icon: '☰' },
]

/** 搜索关键词 */
const searchQuery = ref('')

/** 过滤后的组件列表 */
const filteredList = computed(() => {
  if (!searchQuery.value.trim()) return COMPONENT_DEFS
  const q = searchQuery.value.toLowerCase().trim()
  return COMPONENT_DEFS.filter((d) => d.label.includes(q) || d.type.includes(q))
})

/** 为了演示虚拟滚动，扩展列表到 1000 条 */
const extendedList = computed(() => {
  const list = filteredList.value
  const result: Array<{ def: ComponentDef; index: number }> = []
  for (let i = 0; i < 1000; i++) {
    result.push({ def: list[i % list.length], index: i })
  }
  return result
})

// ---- 自实现虚拟滚动 ----
const ITEM_HEIGHT = 80
const OVERSCAN = 5

const scrollRef = ref<HTMLDivElement | null>(null)
const containerHeight = ref(0)
const scrollTop = ref(0)

function onScroll(): void {
  scrollTop.value = scrollRef.value?.scrollTop ?? 0
}

/** 当前可见的条目索引范围 */
const visibleRange = computed(() => {
  const total = extendedList.value.length
  if (total === 0) return { start: 0, end: 0 }

  const start = Math.max(0, Math.floor(scrollTop.value / ITEM_HEIGHT) - OVERSCAN)
  const end = Math.min(total, Math.ceil((scrollTop.value + containerHeight.value) / ITEM_HEIGHT) + OVERSCAN)

  return { start, end }
})

/** 可见的条目 */
const visibleItems = computed(() => {
  const { start, end } = visibleRange.value
  return extendedList.value.slice(start, end).map((item, i) => ({
    ...item,
    indexInList: start + i,
  }))
})

/** 总高度 */
const totalHeight = computed(() => extendedList.value.length * ITEM_HEIGHT)

/** 上方位移（撑出滚动空间） */
const paddingTop = computed(() => visibleRange.value.start * ITEM_HEIGHT)
const paddingBottom = computed(() =>
  Math.max(0, totalHeight.value - visibleRange.value.end * ITEM_HEIGHT)
)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (scrollRef.value) {
    containerHeight.value = scrollRef.value.clientHeight
    resizeObserver = new ResizeObserver(() => {
      if (scrollRef.value) {
        containerHeight.value = scrollRef.value.clientHeight
      }
    })
    resizeObserver.observe(scrollRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

/** 拖拽开始 */
function onDragStart(e: DragEvent, type: ComponentType): void {
  if (!e.dataTransfer) return

  // 拖拽的是卡片 div（不是 img 元素本身），浏览器不会触发图片默认行为
  e.dataTransfer.setData('component-type', type)
  e.dataTransfer.effectAllowed = 'copy'
}
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h3>组件列表</h3>
    </div>

    <div class="panel-search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索组件..."
        class="search-input"
      />
    </div>

    <div
      ref="scrollRef"
      class="panel-list"
      @scroll="onScroll"
    >
      <div
        v-if="extendedList.length === 0"
        class="panel-empty"
      >
        暂无组件
      </div>

      <!-- 虚拟滚动渲染区 -->
      <div
        v-else
        class="virtual-container"
        :style="{ height: totalHeight + 'px' }"
      >
        <!-- 顶部空白 -->
        <div :style="{ height: paddingTop + 'px' }" />

        <!-- 可见卡片 -->
        <div
          v-for="item in visibleItems"
          :key="item.index"
          class="component-card"
          draggable="true"
          @dragstart="onDragStart($event, item.def.type)"
        >
          <span class="component-icon">{{ item.def.icon }}</span>
          <span class="component-label">{{ item.def.label }}</span>
          <span class="component-type-badge">{{ item.def.type }}</span>
        </div>

        <!-- 底部空白 -->
        <div :style="{ height: paddingBottom + 'px' }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.panel-header h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.panel-search {
  padding: 8px 16px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #409eff;
}

.panel-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
}

.panel-empty {
  text-align: center;
  color: #999;
  padding: 32px 0;
  font-size: 14px;
}

.virtual-container {
  position: relative;
  width: 100%;
}

.component-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fafafa;
  cursor: grab;
  user-select: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  margin-bottom: 8px;
}

.component-card:last-child {
  margin-bottom: 0;
}

.component-card:active {
  cursor: grabbing;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  border-color: #409eff;
}

.component-icon {
  font-size: 20px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f5ff;
  border-radius: 6px;
  color: #409eff;
  flex-shrink: 0;
}

.component-label {
  font-size: 14px;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.component-type-badge {
  font-size: 11px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}
</style>
