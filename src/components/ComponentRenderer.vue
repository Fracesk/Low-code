<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useCanvasStore } from '../stores/canvas'
import type { ComponentSchema } from '../types/schema'

const props = defineProps<{
  component: ComponentSchema
  isChild?: boolean
}>()

const emit = defineEmits<{
  select: [id: string | null]
}>()

const store = useCanvasStore()

/** 按钮点击动画 */
const btnPressed = ref(false)

/** 容器拖拽悬停 */
const isDragOver = ref(false)

/** 文本编辑器引用 */
const textEditorRef = ref<HTMLDivElement | null>(null)

/** 是否为正在编辑的文本组件 */
const isEditing = computed(() => store.editingId === props.component.id)

/** 从 store 读取该组件的 props（供模板用） */
const compProps = computed(() => props.component.props)

// ─── 文本编辑 ────────────────────────────────────

function startEditing(): void {
  store.setEditingId(props.component.id)
  nextTick(() => {
    textEditorRef.value?.focus()
  })
}

function saveEdit(): void {
  const text = textEditorRef.value?.innerText ?? ''
  const compProps = props.component.props as { content?: string }
  if (compProps.content !== text) {
    store.updateComponent(props.component.id, { content: text } as Record<string, unknown>)
  }
  store.setEditingId(null)
}

function cancelEdit(): void {
  store.setEditingId(null)
}

function onTextPaste(e: ClipboardEvent): void {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain') ?? ''
  document.execCommand('insertText', false, text)
}

// ─── 按钮点击 ────────────────────────────────────

function onButtonClick(): void {
  btnPressed.value = true
  setTimeout(() => {
    btnPressed.value = false
  }, 200)
}

// ─── 容器拖放 ────────────────────────────────────

function onContainerDragOver(e: DragEvent): void {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'copy'
  }
  isDragOver.value = true
}

function onContainerDragLeave(): void {
  isDragOver.value = false
}

function onContainerDrop(e: DragEvent): void {
  e.preventDefault()
  e.stopPropagation()
  isDragOver.value = false
  const type = e.dataTransfer?.getData('component-type')
  if (type) {
    store.addChildToContainer(
      props.component.id,
      type as ComponentSchema['type'],
    )
  }
}

function onChildSelect(id: string | null): void {
  emit('select', id)
}

/** 点击组件自身触发选中（子组件用） */
// function onSelfClick(): void {
//   emit('select', props.component.id)
// }
</script>

<template>
  <!-- text -->
  <div
    v-if="component.type === 'text'"
    class="component-render component-text"
    :class="{ 'is-child': isChild }"
    @dblclick.stop="startEditing"
  >
    <div v-if="!isEditing" class="text-display" :style="{ fontSize: (compProps as any).fontSize + 'px' || '14px', color: (compProps as any).color || '#333' }">
      {{ (compProps as any).content || '文本' }}
    </div>
    <div
      v-else
      ref="textEditorRef"
      class="text-editor"
      contenteditable
      @blur="saveEdit"
      @keydown.enter.prevent="saveEdit"
      @keydown.escape.prevent="cancelEdit"
      @paste="onTextPaste"
    >{{ (compProps as any).content }}</div>
  </div>

  <!-- button -->
  <button
    v-else-if="component.type === 'button'"
    class="component-render component-button"
    :class="[
      (compProps as any).type === 'primary' ? 'btn-primary' : 'btn-default',
      { 'btn-pressed': btnPressed, 'is-child': isChild },
    ]"
    @click.stop="onButtonClick"
  >
    {{ (compProps as any).label || '按钮' }}
  </button>

  <!-- image -->
  <img
    v-else-if="component.type === 'image'"
    class="component-render component-image"
    :class="{ 'is-child': isChild }"
    :src="(compProps as any).src"
    :alt="(compProps as any).alt ?? ''"
    draggable="false"
  />

  <!-- container -->
  <div
    v-else-if="component.type === 'container'"
    class="component-render component-container"
    :class="{ 'drag-over': isDragOver, 'is-child': isChild }"
    @dragover="onContainerDragOver"
    @dragleave="onContainerDragLeave"
    @drop="onContainerDrop"
  >
    <div
      class="container-children"
      :style="{
        display: 'flex',
        flexDirection: (compProps as any).direction || 'column',
        gap: ((compProps as any).gap ?? 8) + 'px',
        padding: '8px',
        minHeight: '100%',
      }"
    >
      <div
        v-if="!component.children || component.children.length === 0"
        class="container-empty"
      >
        拖拽组件到此处
      </div>
      <ComponentRenderer
        v-for="child in component.children"
        :key="child.id"
        :component="child"
        :is-child="true"
        class="container-child-wrapper"
        :class="{ selected: store.selectedId === child.id }"
        @select="onChildSelect"
      />
    </div>
  </div>

  <!-- form -->
  <div
    v-else-if="component.type === 'form'"
    class="component-render component-form"
    :class="{ 'is-child': isChild }"
  >
    <div class="form-header">{{ (compProps as any).title ?? '表单' }}</div>
    <div class="form-fields">
      <div
        v-for="(field, idx) in (compProps as any).fields ?? []"
        :key="idx"
        class="form-field"
        @click.stop
      >
        <label class="form-field-label">{{ field.label }}</label>
        <textarea
          v-if="field.type === 'textarea'"
          class="form-field-input form-field-textarea"
          :placeholder="field.placeholder ?? `请输入${field.label}`"
          disabled
        ></textarea>
        <input
          v-else
          class="form-field-input"
          :type="field.type"
          :placeholder="field.placeholder ?? `请输入${field.label}`"
          disabled
        />
      </div>
      <div v-if="!((compProps as any).fields?.length)" class="form-fields-empty">
        暂无表单字段
      </div>
    </div>
  </div>

  <!-- unknown -->
  <div v-else class="component-render component-unknown">未知组件</div>
</template>

<style scoped>
/* ─── 文本 ──────────────────────────── */
.component-text {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  word-break: break-all;
  cursor: pointer;
}
.component-text.is-child {
  min-height: 40px;
}
.text-display {
  width: 100%;
  text-align: center;
  user-select: none;
}
.text-editor {
  width: 100%;
  min-height: 24px;
  outline: 2px solid #409eff;
  outline-offset: -2px;
  border-radius: 2px;
  cursor: text;
  white-space: pre-wrap;
  background: #fff;
  padding: 2px;
}

/* ─── 按钮 ──────────────────────────── */
.component-button {
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  margin: auto;
  transition: all 0.15s;
}
.component-button.is-child {
  margin: 4px auto;
}
.btn-primary {
  background: #409eff;
  color: #fff;
}
.btn-primary:hover {
  filter: brightness(0.9);
}
.btn-default {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #d9d9d9;
}
.btn-default:hover {
  background: #e8e8e8;
}
.component-button:active {
  transform: scale(0.97);
}
.btn-pressed {
  transform: scale(0.96);
  opacity: 0.85;
}

/* ─── 图片 ──────────────────────────── */
.component-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

/* ─── 容器 ──────────────────────────── */
.component-container {
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  color: #999;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  min-height: 60px;
  transition: border-color 0.2s, background 0.2s;
}
.component-container.drag-over {
  border-color: #409eff !important;
  background: #f0f8ff !important;
}
.container-children {
  flex: 1;
  width: 100%;
}
.container-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  border: 2px dashed #d9d9d9;
  border-radius: 4px;
  color: #bbb;
  font-size: 12px;
}
.container-child-wrapper {
  position: relative;
  width: 100%;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  background: #fff;
  transition: border-color 0.15s;
  min-height: 32px;
  overflow: hidden;
}
.container-child-wrapper:hover {
  border-color: #409eff80;
}
.container-child-wrapper.selected {
  border-color: #409eff;
  box-shadow: 0 0 0 2px #409eff33;
}

/* ─── 表单 ──────────────────────────── */
.component-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}
.form-header {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  padding: 4px 12px 0;
}
.form-fields {
  width: 100%;
  padding: 4px 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.form-field-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}
.form-field-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  background: #fafafa;
  box-sizing: border-box;
}
.form-field-input:disabled {
  color: #999;
  cursor: not-allowed;
}
.form-field-textarea {
  min-height: 48px;
  resize: vertical;
}
.form-fields-empty {
  font-size: 11px;
  color: #bbb;
  text-align: center;
  padding: 8px;
}

/* ─── 未知 ──────────────────────────── */
.component-unknown {
  color: #999;
  font-size: 13px;
  background: #fafafa;
}
</style>
