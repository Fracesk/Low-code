import { defineStore } from 'pinia'
import { shallowReactive, shallowRef } from 'vue'
import type { ComponentSchema, ComponentType } from '../types/schema'

/** 每种组件类型的默认 props */
const DEFAULT_PROPS: Record<ComponentType, ComponentSchema['props']> = {
  text: { content: '请输入文字', fontSize: 16, color: '#333333' },
  button: { label: '按钮', type: 'primary' },
  image: { src: 'https://placehold.co/200x120', alt: '图片', width: 200 },
  container: { direction: 'row', gap: 8 },
  form: { title: '表单', fields: [{ label: '姓名', type: 'text' }] },
}

export const useCanvasStore = defineStore('canvas', () => {
  /** 组件列表 — shallowReactive 无需深层响应式监听 props 内部变化 */
  const components = shallowReactive<ComponentSchema[]>([])

  /** 当前选中组件 ID */
  const selectedId = shallowRef<string | null>(null)

  /** 生成唯一 ID */
  function generateId(): string {
    return crypto.randomUUID()
  }

  /** 添加组件到画布 */
  function addComponent(type: ComponentType, index?: number): ComponentSchema {
    const comp: ComponentSchema = {
      id: generateId(),
      type,
      props: { ...DEFAULT_PROPS[type] },
      children: type === 'container' ? [] : undefined,
    }

    if (index !== undefined && index >= 0 && index < components.length) {
      components.splice(index, 0, comp)
    } else {
      components.push(comp)
    }

    return comp
  }

  /** 移除组件 */
  function removeComponent(id: string): void {
    const idx = components.findIndex((c) => c.id === id)
    if (idx !== -1) {
      components.splice(idx, 1)
    }
    if (selectedId.value === id) {
      selectedId.value = null
    }
  }

  /** 选中组件 */
  function selectComponent(id: string | null): void {
    selectedId.value = id
  }

  /** 更新组件 props（浅合并） */
  function updateComponent(id: string, props: Partial<ComponentSchema['props']>): void {
    const comp = components.find((c) => c.id === id)
    if (comp) {
      comp.props = { ...comp.props, ...props } as ComponentSchema['props']
    }
  }

  return {
    components,
    selectedId,
    addComponent,
    removeComponent,
    selectComponent,
    updateComponent,
  }
})
