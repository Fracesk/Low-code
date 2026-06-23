<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '../stores/canvas'
import type { ComponentSchema } from '../types/schema'

const store = useCanvasStore()

const selectedComponent = computed<ComponentSchema | null>(() => {
  if (!store.selectedId) return null
  return store.findComponent(store.selectedId) ?? null
})

function closePanel(): void {
  store.selectComponent(null)
}

// ─── 通用属性更新 ────────────────────────

function updateProp(key: string, value: unknown): void {
  if (!store.selectedId) return
  store.updateComponent(store.selectedId, { [key]: value })
}

function onTextInput(e: Event): void {
  const el = e.target as HTMLTextAreaElement
  updateProp('content', el.value)
}

function onLabelInput(e: Event): void {
  const el = e.target as HTMLInputElement
  updateProp('label', el.value)
}

function onSrcInput(e: Event): void {
  const el = e.target as HTMLInputElement
  updateProp('src', el.value)
}

function onAltInput(e: Event): void {
  const el = e.target as HTMLInputElement
  updateProp('alt', el.value)
}

function onTitleInput(e: Event): void {
  const el = e.target as HTMLInputElement
  updateProp('title', el.value)
}

function onSelectChange(key: string, e: Event): void {
  const el = e.target as HTMLSelectElement
  updateProp(key, el.value)
}

function onColorChange(e: Event): void {
  const el = e.target as HTMLInputElement
  updateProp('color', el.value)
}

function onRangeChange(key: string, e: Event): void {
  const el = e.target as HTMLInputElement
  const val = parseInt(el.value, 10)
  if (!isNaN(val)) updateProp(key, val)
}

// ─── 表单字段管理 ────────────────────────

function addField(): void {
  if (!store.selectedId) return
  const comp = store.findComponent(store.selectedId)
  if (!comp || comp.type !== 'form') return
  const fields = [...((comp.props as any).fields ?? []), { label: '新字段', type: 'text', placeholder: '', required: false }]
  store.updateComponent(store.selectedId, { fields } as any)
}

function removeField(index: number): void {
  if (!store.selectedId) return
  const comp = store.findComponent(store.selectedId)
  if (!comp || comp.type !== 'form') return
  const fields = [...((comp.props as any).fields ?? [])]
  fields.splice(index, 1)
  store.updateComponent(store.selectedId, { fields } as any)
}

function updateField(index: number, key: string, e: Event): void {
  if (!store.selectedId) return
  const comp = store.findComponent(store.selectedId)
  if (!comp || comp.type !== 'form') return
  const fields = [...((comp.props as any).fields ?? [])]
  const el = e.target as HTMLInputElement | HTMLSelectElement
  const value = el.type === 'checkbox' ? (el as HTMLInputElement).checked : el.value
  fields[index] = { ...fields[index], [key]: value }
  store.updateComponent(store.selectedId, { fields } as any)
}
</script>

<template>
  <div class="property-panel" v-if="selectedComponent">
    <div class="panel-header">
      <span class="panel-title">属性面板</span>
      <button class="panel-close" @click="closePanel">✕</button>
    </div>

    <div class="panel-body">
      <div class="type-badge">{{ selectedComponent.type }}</div>

      <!-- ─── Text 属性 ─────────────────── -->
      <template v-if="selectedComponent.type === 'text'">
        <div class="prop-group">
          <label class="prop-label">文本内容</label>
          <textarea
            class="prop-input prop-textarea"
            :value="(selectedComponent.props as any).content"
            @input="onTextInput"
          ></textarea>
        </div>
        <div class="prop-group">
          <label class="prop-label">字号: {{ (selectedComponent.props as any).fontSize ?? 16 }}px</label>
          <input
            type="range" class="prop-range" min="12" max="48"
            :value="(selectedComponent.props as any).fontSize ?? 16"
            @input="onRangeChange('fontSize', $event)"
          />
        </div>
        <div class="prop-group">
          <label class="prop-label">颜色</label>
          <input
            type="color" class="prop-color"
            :value="(selectedComponent.props as any).color ?? '#333333'"
            @change="onColorChange"
          />
        </div>
      </template>

      <!-- ─── Button 属性 ─────────────────── -->
      <template v-if="selectedComponent.type === 'button'">
        <div class="prop-group">
          <label class="prop-label">按钮文字</label>
          <input
            class="prop-input"
            :value="(selectedComponent.props as any).label"
            @input="onLabelInput"
          />
        </div>
        <div class="prop-group">
          <label class="prop-label">类型</label>
          <select
            class="prop-input"
            :value="(selectedComponent.props as any).type"
            @change="onSelectChange('type', $event)"
          >
            <option value="primary">Primary</option>
            <option value="default">Default</option>
          </select>
        </div>
      </template>

      <!-- ─── Image 属性 ─────────────────── -->
      <template v-if="selectedComponent.type === 'image'">
        <div class="prop-group">
          <label class="prop-label">图片 URL</label>
          <input class="prop-input" :value="(selectedComponent.props as any).src" @input="onSrcInput" />
        </div>
        <div class="prop-group">
          <label class="prop-label">替代文本</label>
          <input class="prop-input" :value="(selectedComponent.props as any).alt" @input="onAltInput" />
        </div>
        <div class="prop-group">
          <label class="prop-label">宽度: {{ (selectedComponent.props as any).width ?? 200 }}px</label>
          <input
            type="range" class="prop-range" min="50" max="800"
            :value="(selectedComponent.props as any).width ?? 200"
            @input="onRangeChange('width', $event)"
          />
        </div>
      </template>

      <!-- ─── Container 属性 ─────────────────── -->
      <template v-if="selectedComponent.type === 'container'">
        <div class="prop-group">
          <label class="prop-label">排列方向</label>
          <select
            class="prop-input"
            :value="(selectedComponent.props as any).direction"
            @change="onSelectChange('direction', $event)"
          >
            <option value="column">垂直 (column)</option>
            <option value="row">水平 (row)</option>
          </select>
        </div>
        <div class="prop-group">
          <label class="prop-label">间距: {{ (selectedComponent.props as any).gap ?? 8 }}px</label>
          <input
            type="range" class="prop-range" min="0" max="24"
            :value="(selectedComponent.props as any).gap ?? 8"
            @input="onRangeChange('gap', $event)"
          />
        </div>
      </template>

      <!-- ─── Form 属性 ─────────────────── -->
      <template v-if="selectedComponent.type === 'form'">
        <div class="prop-group">
          <label class="prop-label">表单标题</label>
          <input class="prop-input" :value="(selectedComponent.props as any).title" @input="onTitleInput" />
        </div>
        <div class="prop-group">
          <div class="prop-label-row">
            <label class="prop-label">表单字段</label>
            <button class="btn-add-field" @click="addField">+ 添加字段</button>
          </div>
          <div class="field-list">
            <div v-for="(field, idx) in (selectedComponent.props as any).fields ?? []" :key="idx" class="field-item">
              <div class="field-item-header">
                <span class="field-item-label">{{ field.label }}</span>
                <button class="btn-remove-field" @click="removeField(idx)">✕</button>
              </div>
              <div class="field-item-editor">
                <input class="prop-input prop-input-sm" :value="field.label" placeholder="字段名" @input="updateField(idx, 'label', $event)" />
                <select class="prop-input prop-input-sm" :value="field.type" @change="updateField(idx, 'type', $event)">
                  <option value="text">文本</option>
                  <option value="number">数字</option>
                  <option value="email">邮箱</option>
                  <option value="password">密码</option>
                  <option value="textarea">多行文本</option>
                </select>
                <input class="prop-input prop-input-sm" :value="field.placeholder ?? ''" placeholder="占位提示" @input="updateField(idx, 'placeholder', $event)" />
                <label class="prop-checkbox">
                  <input type="checkbox" :checked="field.required ?? false" @change="updateField(idx, 'required', $event)" />
                  必填
                </label>
              </div>
            </div>
            <div v-if="!((selectedComponent.props as any).fields?.length)" class="field-empty">
              暂无字段，点击上方按钮添加
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.property-panel {
  width: 300px;
  min-width: 300px;
  background: #fff;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.panel-close {
  background: none;
  border: none;
  font-size: 14px;
  color: #999;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}
.panel-close:hover {
  background: #f5f5f5;
  color: #333;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.type-badge {
  display: inline-block;
  font-size: 11px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.prop-group {
  margin-bottom: 14px;
}

.prop-label {
  display: block;
  font-size: 12px;
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
}

.prop-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.prop-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
  background: #fff;
  box-sizing: border-box;
}
.prop-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px #409eff33;
}

.prop-input-sm {
  font-size: 12px;
  padding: 4px 6px;
}

.prop-textarea {
  min-height: 60px;
  resize: vertical;
}

.prop-range {
  width: 100%;
  margin: 0;
  accent-color: #409eff;
}

.prop-color {
  width: 100%;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 2px;
  cursor: pointer;
}

.btn-add-field {
  font-size: 11px;
  color: #409eff;
  background: none;
  border: 1px solid #409eff;
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
}
.btn-add-field:hover {
  background: #409eff;
  color: #fff;
}

.field-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-item {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow: hidden;
}

.field-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

.field-item-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.btn-remove-field {
  background: none;
  border: none;
  font-size: 11px;
  color: #999;
  cursor: pointer;
  padding: 1px 4px;
  border-radius: 3px;
}
.btn-remove-field:hover {
  background: #fee;
  color: #e44;
}

.field-item-editor {
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.prop-checkbox {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.field-empty {
  font-size: 12px;
  color: #bbb;
  text-align: center;
  padding: 12px;
}
</style>
