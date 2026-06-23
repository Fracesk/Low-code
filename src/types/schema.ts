/** 组件类型枚举 */
export type ComponentType = 'text' | 'button' | 'image' | 'container' | 'form'

/** Text 组件属性 */
export interface TextProps {
  content: string
  fontSize?: number
  color?: string
}

/** Button 组件属性 */
export interface ButtonProps {
  label: string
  type?: 'primary' | 'default'
}

/** Image 组件属性 */
export interface ImageProps {
  src: string
  alt?: string
  width?: number
}

/** Container 组件属性 */
export interface ContainerProps {
  direction?: 'row' | 'column'
  gap?: number
}

/** 表单字段定义 */
export interface FormField {
  label: string
  type: string
  placeholder?: string
  required?: boolean
}

/** Form 组件属性 */
export interface FormProps {
  title?: string
  fields?: FormField[]
}

/** 组件实例协议 */
export interface ComponentSchema {
  id: string
  type: ComponentType
  props: TextProps | ButtonProps | ImageProps | ContainerProps | FormProps
  children?: ComponentSchema[]
}

/** 页面协议 */
export interface PageSchema {
  components: ComponentSchema[]
  globalSettings?: {
    backgroundColor?: string
    width?: number
    height?: number
  }
}

/** Worker 布局计算输入 */
export interface LayoutInput {
  components: ComponentSchema[]
  containerWidth: number
}

/** Worker 布局计算输出 — 每个组件的位置尺寸 */
export interface LayoutResult {
  id: string
  x: number
  y: number
  width: number
  height: number
}
