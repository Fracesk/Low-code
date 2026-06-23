import { onMounted, onUnmounted, ref, watch, shallowRef } from 'vue';
import { useCanvasStore } from '../stores/canvas';
import ComponentRenderer from './ComponentRenderer.vue';
const emit = defineEmits();
const store = useCanvasStore();
/** 画布容器引用 */
const canvasRef = ref(null);
const containerWidth = ref(800);
/** Worker 实例 */
const worker = shallowRef(null);
/** Worker 计算结果（位置信息） */
const layoutResults = shallowRef([]);
/** Worker 是否就绪 */
const workerReady = ref(false);
/** Worker 错误降级标志 */
const workerFailed = ref(false);
/** 初始化 Worker */
function initWorker() {
    try {
        const w = new Worker(new URL('../workers/layout.worker.ts', import.meta.url), { type: 'module' });
        w.onmessage = (e) => {
            layoutResults.value = e.data;
            workerReady.value = true;
        };
        w.onerror = () => {
            console.warn('Worker 加载失败，降级到主线程计算');
            workerFailed.value = true;
            workerReady.value = true;
        };
        worker.value = w;
        workerReady.value = true;
    }
    catch {
        console.warn('Worker 创建失败，降级到主线程计算');
        workerFailed.value = true;
        workerReady.value = true;
    }
}
/** 主线程降级布局计算 */
function computeLayoutFallback() {
    if (!store.components.length || containerWidth.value <= 0) {
        layoutResults.value = [];
        return;
    }
    const COLUMNS = 3;
    const GAP = 12;
    const ITEM_HEIGHT = 120;
    const itemWidth = (containerWidth.value - GAP * (COLUMNS + 1)) / COLUMNS;
    layoutResults.value = store.components.map((comp, index) => {
        const row = Math.floor(index / COLUMNS);
        const col = index % COLUMNS;
        return {
            id: comp.id,
            x: GAP + col * (itemWidth + GAP),
            y: GAP + row * (ITEM_HEIGHT + GAP),
            width: Math.max(itemWidth, 50),
            height: ITEM_HEIGHT,
        };
    });
}
/** 派发布局计算 */
function requestLayout() {
    if (!containerWidth.value) {
        layoutResults.value = [];
        return;
    }
    if (workerFailed.value || !worker.value) {
        computeLayoutFallback();
        return;
    }
    worker.value.postMessage({
        components: JSON.parse(JSON.stringify(store.components)),
        containerWidth: containerWidth.value,
    });
}
/** 初始化 Worker */
initWorker();
/** 当组件列表变化时重新计算布局 */
watch(() => store.components.length, () => requestLayout(), { immediate: true });
/** ResizeObserver 监听容器宽度变化 */
const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
        containerWidth.value = entry.contentRect.width;
        requestLayout();
    }
});
watch(() => canvasRef.value, (el) => {
    if (el) {
        resizeObserver.observe(el);
    }
}, { immediate: true });
onUnmounted(() => {
    worker.value?.terminate();
    resizeObserver.disconnect();
    window.removeEventListener('keydown', onKeyDown);
});
/** 拖拽放置 */
function onDragOver(e) {
    e.preventDefault();
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
    }
}
function onDrop(e) {
    e.preventDefault();
    const type = e.dataTransfer?.getData('component-type');
    if (!type)
        return;
    // 检查是否放在容器上（通过 data 属性查找）
    const containerEl = e.target.closest('[data-container-id]');
    if (containerEl) {
        const containerId = containerEl.getAttribute('data-container-id');
        store.addChildToContainer(containerId, type);
    }
    else {
        store.addComponent(type);
    }
}
/** 选中组件 */
function onSelectComponent(id) {
    store.selectComponent(id);
    emit('select', id);
}
/** 点击画布空白取消选中 */
function onCanvasClick(e) {
    const target = e.target;
    if (!target.closest('.canvas-component') && !target.closest('.canvas-status') && !target.closest('.canvas-empty')) {
        store.selectComponent(null);
        emit('select', null);
    }
}
/** 键盘删除选中组件 */
function onKeyDown(e) {
    const tag = e.target.tagName;
    const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable;
    // 撤销/重做 Ctrl+Z / Ctrl+Shift+Z
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (isInput)
            return;
        e.preventDefault();
        if (e.shiftKey) {
            store.redo();
        }
        else {
            store.undo();
        }
        return;
    }
    // 删除 Delete / Backspace
    if ((e.key === 'Delete' || e.key === 'Backspace') && store.selectedId) {
        if (isInput)
            return;
        if (store.editingId)
            return;
        e.preventDefault();
        store.removeComponent(store.selectedId);
    }
}
onMounted(() => {
    window.addEventListener('keydown', onKeyDown);
});
/** 根据类型查找 layout 结果 */
function getLayout(id) {
    return layoutResults.value.find((l) => l.id === id);
}
/** 导出 HTML */
function handleExport() {
    import('../utils/exportHtml').then(({ generateHtml, downloadHtml }) => {
        const html = generateHtml(store.components);
        downloadHtml(html, 'my-page.html');
    });
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['canvas']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-component']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-component']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-component']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-export']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "canvas-wrapper" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "canvas-toolbar" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.store.undo();
        } },
    ...{ class: "toolbar-btn" },
    disabled: (__VLS_ctx.store.history.length === 0),
    title: "撤销 Ctrl+Z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.store.redo();
        } },
    ...{ class: "toolbar-btn" },
    disabled: (__VLS_ctx.store.future.length === 0),
    title: "重做 Ctrl+Shift+Z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "toolbar-right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.handleExport) },
    ...{ class: "toolbar-btn btn-export" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ onDragover: (__VLS_ctx.onDragOver) },
    ...{ onDrop: (__VLS_ctx.onDrop) },
    ...{ onClick: (__VLS_ctx.onCanvasClick) },
    ref: "canvasRef",
    ...{ class: "canvas" },
    ...{ class: ({ 'canvas-dragover': false }) },
});
/** @type {typeof __VLS_ctx.canvasRef} */ ;
if (!__VLS_ctx.workerReady) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "canvas-status" },
    });
}
else if (__VLS_ctx.store.components.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "canvas-empty" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "canvas-empty-icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "canvas-components" },
        ...{ style: ({ position: 'relative', width: '100%', minHeight: '400px' }) },
    });
    for (const [comp] of __VLS_getVForSourceType((__VLS_ctx.store.components))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.workerReady))
                        return;
                    if (!!(__VLS_ctx.store.components.length === 0))
                        return;
                    __VLS_ctx.onSelectComponent(comp.id);
                } },
            key: (comp.id),
            ...{ class: "canvas-component" },
            ...{ class: ({ selected: __VLS_ctx.store.selectedId === comp.id }) },
            ...{ style: ({
                    position: 'absolute',
                    left: (__VLS_ctx.getLayout(comp.id)?.x ?? 0) + 'px',
                    top: (__VLS_ctx.getLayout(comp.id)?.y ?? 0) + 'px',
                    width: comp.type === 'container' ? 'auto' : (__VLS_ctx.getLayout(comp.id)?.width ?? 200) + 'px',
                    minWidth: (__VLS_ctx.getLayout(comp.id)?.width ?? 200) + 'px',
                    height: comp.type === 'container' ? 'auto' : (__VLS_ctx.getLayout(comp.id)?.height ?? 80) + 'px',
                    minHeight: (__VLS_ctx.getLayout(comp.id)?.height ?? 80) + 'px',
                }) },
            'data-container-id': (comp.type === 'container' ? comp.id : undefined),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "component-type-tag" },
        });
        (comp.type);
        /** @type {[typeof ComponentRenderer, ]} */ ;
        // @ts-ignore
        const __VLS_0 = __VLS_asFunctionalComponent(ComponentRenderer, new ComponentRenderer({
            ...{ 'onSelect': {} },
            component: (comp),
        }));
        const __VLS_1 = __VLS_0({
            ...{ 'onSelect': {} },
            component: (comp),
        }, ...__VLS_functionalComponentArgsRest(__VLS_0));
        let __VLS_3;
        let __VLS_4;
        let __VLS_5;
        const __VLS_6 = {
            onSelect: (__VLS_ctx.onSelectComponent)
        };
        var __VLS_2;
    }
}
/** @type {__VLS_StyleScopedClasses['canvas-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-toolbar']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-left']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-right']} */ ;
/** @type {__VLS_StyleScopedClasses['toolbar-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-export']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-dragover']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-status']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-empty-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-components']} */ ;
/** @type {__VLS_StyleScopedClasses['canvas-component']} */ ;
/** @type {__VLS_StyleScopedClasses['selected']} */ ;
/** @type {__VLS_StyleScopedClasses['component-type-tag']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ComponentRenderer: ComponentRenderer,
            store: store,
            canvasRef: canvasRef,
            workerReady: workerReady,
            onDragOver: onDragOver,
            onDrop: onDrop,
            onSelectComponent: onSelectComponent,
            onCanvasClick: onCanvasClick,
            getLayout: getLayout,
            handleExport: handleExport,
        };
    },
    __typeEmits: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
});
; /* PartiallyEnd: #4569/main.vue */
