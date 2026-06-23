import ComponentPanel from './components/ComponentPanel.vue';
import Canvas from './components/Canvas.vue';
import PropertyPanel from './components/PropertyPanel.vue';
import { useCanvasStore } from './stores/canvas';
const store = useCanvasStore();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-layout" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "app-sidebar" },
});
/** @type {[typeof ComponentPanel, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ComponentPanel, new ComponentPanel({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "app-main" },
});
/** @type {[typeof Canvas, ]} */ ;
// @ts-ignore
const __VLS_3 = __VLS_asFunctionalComponent(Canvas, new Canvas({}));
const __VLS_4 = __VLS_3({}, ...__VLS_functionalComponentArgsRest(__VLS_3));
const __VLS_6 = {}.Transition;
/** @type {[typeof __VLS_components.Transition, typeof __VLS_components.Transition, ]} */ ;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent(__VLS_6, new __VLS_6({
    name: "slide",
}));
const __VLS_8 = __VLS_7({
    name: "slide",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_9.slots.default;
if (__VLS_ctx.store.selectedId) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
        ...{ class: "app-property-panel" },
    });
    /** @type {[typeof PropertyPanel, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(PropertyPanel, new PropertyPanel({}));
    const __VLS_11 = __VLS_10({}, ...__VLS_functionalComponentArgsRest(__VLS_10));
}
var __VLS_9;
/** @type {__VLS_StyleScopedClasses['app-layout']} */ ;
/** @type {__VLS_StyleScopedClasses['app-sidebar']} */ ;
/** @type {__VLS_StyleScopedClasses['app-main']} */ ;
/** @type {__VLS_StyleScopedClasses['app-property-panel']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ComponentPanel: ComponentPanel,
            Canvas: Canvas,
            PropertyPanel: PropertyPanel,
            store: store,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
