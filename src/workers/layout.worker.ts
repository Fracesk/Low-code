import type { LayoutInput, LayoutResult } from '../types/schema'

/** 每行组件数 */
const COLUMNS = 3
/** 间距 */
const GAP = 12
/** 组件高度 */
const ITEM_HEIGHT = 120

/** 网格布局算法 */
function computeLayout(input: LayoutInput): LayoutResult[] {
  if (!input.components || input.components.length === 0) return []
  if (input.containerWidth <= 0) return []

  const itemWidth = (input.containerWidth - GAP * (COLUMNS + 1)) / COLUMNS

  return input.components.map((comp, index) => {
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

self.onmessage = (e: MessageEvent<LayoutInput>) => {
  const result = computeLayout(e.data)
  self.postMessage(result)
}
