import { computed, ref, onMounted, onUnmounted } from 'vue';
const COMPONENT_DEFS = [
    { type: 'text', label: '文本', icon: 'T' },
    { type: 'button', label: '按钮', icon: '▣' },
    { type: 'image', label: '图片', icon: '🖼' },
    { type: 'container', label: '容器', icon: '▢' },
    { type: 'form', label: '表单', icon: '☰' },
];
/** 搜索关键词 */
const searchQuery = ref('');
/** 过滤后的组件列表 */
const filteredList = computed(() => {
    if (!searchQuery.value.trim())
        return COMPONENT_DEFS;
    const q = searchQuery.value.toLowerCase().trim();
    return COMPONENT_DEFS.filter((d) => d.label.includes(q) || d.type.includes(q));
});
/** 为了演示虚拟滚动，扩展列表到 1000 条 */
const extendedList = computed(() => {
    const list = filteredList.value;
    const result = [];
    for (let i = 0; i < 1000; i++) {
        result.push({ def: list[i % list.length], index: i });
    }
    return result;
});
// ---- 自实现虚拟滚动 ----
const ITEM_HEIGHT = 80;
const OVERSCAN = 5;
const scrollRef = ref(null);
const containerHeight = ref(0);
const scrollTop = ref(0);
function onScroll() {
    scrollTop.value = scrollRef.value?.scrollTop ?? 0;
}
/** 当前可见的条目索引范围 */
const visibleRange = computed(() => {
    const total = extendedList.value.length;
    if (total === 0)
        return { start: 0, end: 0 };
    const start = Math.max(0, Math.floor(scrollTop.value / ITEM_HEIGHT) - OVERSCAN);
    const end = Math.min(total, Math.ceil((scrollTop.value + containerHeight.value) / ITEM_HEIGHT) + OVERSCAN);
    return { start, end };
});
/** 可见的条目 */
const visibleItems = computed(() => {
    const { start, end } = visibleRange.value;
    return extendedList.value.slice(start, end).map((item, i) => ({
        ...item,
        indexInList: start + i,
    }));
});
/** 总高度 */
const totalHeight = computed(() => extendedList.value.length * ITEM_HEIGHT);
/** 上方位移（撑出滚动空间） */
const paddingTop = computed(() => visibleRange.value.start * ITEM_HEIGHT);
const paddingBottom = computed(() => Math.max(0, totalHeight.value - visibleRange.value.end * ITEM_HEIGHT));
let resizeObserver = null;
onMounted(() => {
    if (scrollRef.value) {
        containerHeight.value = scrollRef.value.clientHeight;
        resizeObserver = new ResizeObserver(() => {
            if (scrollRef.value) {
                containerHeight.value = scrollRef.value.clientHeight;
            }
        });
        resizeObserver.observe(scrollRef.value);
    }
});
onUnmounted(() => {
    resizeObserver?.disconnect();
});
/** 拖拽开始 */
function onDragStart(e, type) {
    if (!e.dataTransfer)
        return;
    // 拖拽的是卡片 div（不是 img 元素本身），浏览器不会触发图片默认行为
    e.dataTransfer.setData('component-type', type);
    e.dataTransfer.effectAllowed = 'copy';
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['component-card']} */ ;
/** @type {__VLS_StyleScopedClasses['component-card']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-search" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    value: (__VLS_ctx.searchQuery),
    type: "text",
    placeholder: "搜索组件...",
    ...{ class: "search-input" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onScroll: (__VLS_ctx.onScroll) },
    ref: "scrollRef",
    ...{ class: "panel-list" },
});
/** @type {typeof __VLS_ctx.scrollRef} */ ;
if (__VLS_ctx.extendedList.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-empty" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "virtual-container" },
        ...{ style: ({ height: __VLS_ctx.totalHeight + 'px' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
        ...{ style: ({ height: __VLS_ctx.paddingTop + 'px' }) },
    });
    for (const [item] of __VLS_getVForSourceType((__VLS_ctx.visibleItems))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onDragstart: (...[$event]) => {
                    if (!!(__VLS_ctx.extendedList.length === 0))
                        return;
                    __VLS_ctx.onDragStart($event, item.def.type);
                } },
            key: (item.index),
            ...{ class: "component-card" },
            draggable: "true",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "component-icon" },
        });
        (item.def.icon);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "component-label" },
        });
        (item.def.label);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "component-type-badge" },
        });
        (item.def.type);
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
        ...{ style: ({ height: __VLS_ctx.paddingBottom + 'px' }) },
    });
}
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-search']} */ ;
/** @type {__VLS_StyleScopedClasses['search-input']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-list']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['virtual-container']} */ ;
/** @type {__VLS_StyleScopedClasses['component-card']} */ ;
/** @type {__VLS_StyleScopedClasses['component-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['component-label']} */ ;
/** @type {__VLS_StyleScopedClasses['component-type-badge']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            searchQuery: searchQuery,
            extendedList: extendedList,
            scrollRef: scrollRef,
            onScroll: onScroll,
            visibleItems: visibleItems,
            totalHeight: totalHeight,
            paddingTop: paddingTop,
            paddingBottom: paddingBottom,
            onDragStart: onDragStart,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
