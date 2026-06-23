import { ref, computed, nextTick } from 'vue';
import { useCanvasStore } from '../stores/canvas';
const props = defineProps();
const emit = defineEmits();
const store = useCanvasStore();
/** 按钮点击动画 */
const btnPressed = ref(false);
/** 容器拖拽悬停 */
const isDragOver = ref(false);
/** 文本编辑器引用 */
const textEditorRef = ref(null);
/** 是否为正在编辑的文本组件 */
const isEditing = computed(() => store.editingId === props.component.id);
/** 从 store 读取该组件的 props（供模板用） */
const compProps = computed(() => props.component.props);
// ─── 文本编辑 ────────────────────────────────────
function startEditing() {
    store.setEditingId(props.component.id);
    nextTick(() => {
        textEditorRef.value?.focus();
    });
}
function saveEdit() {
    const text = textEditorRef.value?.innerText ?? '';
    const compProps = props.component.props;
    if (compProps.content !== text) {
        store.updateComponent(props.component.id, { content: text });
    }
    store.setEditingId(null);
}
function cancelEdit() {
    store.setEditingId(null);
}
function onTextPaste(e) {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain') ?? '';
    document.execCommand('insertText', false, text);
}
// ─── 按钮点击 ────────────────────────────────────
function onButtonClick() {
    btnPressed.value = true;
    setTimeout(() => {
        btnPressed.value = false;
    }, 200);
}
// ─── 容器拖放 ────────────────────────────────────
function onContainerDragOver(e) {
    e.preventDefault();
    if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
    }
    isDragOver.value = true;
}
function onContainerDragLeave() {
    isDragOver.value = false;
}
function onContainerDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    isDragOver.value = false;
    const type = e.dataTransfer?.getData('component-type');
    if (type) {
        store.addChildToContainer(props.component.id, type);
    }
}
function onChildSelect(id) {
    emit('select', id);
}
/** 点击组件自身触发选中（子组件用） */
// function onSelfClick(): void {
//   emit('select', props.component.id)
// }
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['component-text']} */ ;
/** @type {__VLS_StyleScopedClasses['component-button']} */ ;
/** @type {__VLS_StyleScopedClasses['is-child']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-default']} */ ;
/** @type {__VLS_StyleScopedClasses['component-button']} */ ;
/** @type {__VLS_StyleScopedClasses['component-container']} */ ;
/** @type {__VLS_StyleScopedClasses['container-child-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['container-child-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['form-field-input']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.component.type === 'text') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onDblclick: (__VLS_ctx.startEditing) },
        ...{ class: "component-render component-text" },
        ...{ class: ({ 'is-child': __VLS_ctx.isChild }) },
    });
    if (!__VLS_ctx.isEditing) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "text-display" },
            ...{ style: ({ fontSize: __VLS_ctx.compProps.fontSize + 'px' || '14px', color: __VLS_ctx.compProps.color || '#333' }) },
        });
        (__VLS_ctx.compProps.content || '文本');
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onBlur: (__VLS_ctx.saveEdit) },
            ...{ onKeydown: (__VLS_ctx.saveEdit) },
            ...{ onKeydown: (__VLS_ctx.cancelEdit) },
            ...{ onPaste: (__VLS_ctx.onTextPaste) },
            ref: "textEditorRef",
            ...{ class: "text-editor" },
            contenteditable: true,
        });
        /** @type {typeof __VLS_ctx.textEditorRef} */ ;
        (__VLS_ctx.compProps.content);
    }
}
else if (__VLS_ctx.component.type === 'button') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.onButtonClick) },
        ...{ class: "component-render component-button" },
        ...{ class: ([
                __VLS_ctx.compProps.type === 'primary' ? 'btn-primary' : 'btn-default',
                { 'btn-pressed': __VLS_ctx.btnPressed, 'is-child': __VLS_ctx.isChild },
            ]) },
    });
    (__VLS_ctx.compProps.label || '按钮');
}
else if (__VLS_ctx.component.type === 'image') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.img)({
        ...{ class: "component-render component-image" },
        ...{ class: ({ 'is-child': __VLS_ctx.isChild }) },
        src: (__VLS_ctx.compProps.src),
        alt: (__VLS_ctx.compProps.alt ?? ''),
        draggable: "false",
    });
}
else if (__VLS_ctx.component.type === 'container') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ onDragover: (__VLS_ctx.onContainerDragOver) },
        ...{ onDragleave: (__VLS_ctx.onContainerDragLeave) },
        ...{ onDrop: (__VLS_ctx.onContainerDrop) },
        ...{ class: "component-render component-container" },
        ...{ class: ({ 'drag-over': __VLS_ctx.isDragOver, 'is-child': __VLS_ctx.isChild }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "container-children" },
        ...{ style: ({
                display: 'flex',
                flexDirection: __VLS_ctx.compProps.direction || 'column',
                gap: (__VLS_ctx.compProps.gap ?? 8) + 'px',
                padding: '8px',
                minHeight: '100%',
            }) },
    });
    if (!__VLS_ctx.component.children || __VLS_ctx.component.children.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "container-empty" },
        });
    }
    for (const [child] of __VLS_getVForSourceType((__VLS_ctx.component.children))) {
        const __VLS_0 = {}.ComponentRenderer;
        /** @type {[typeof __VLS_components.ComponentRenderer, ]} */ ;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
            ...{ 'onSelect': {} },
            key: (child.id),
            component: (child),
            isChild: (true),
            ...{ class: "container-child-wrapper" },
            ...{ class: ({ selected: __VLS_ctx.store.selectedId === child.id }) },
        }));
        const __VLS_2 = __VLS_1({
            ...{ 'onSelect': {} },
            key: (child.id),
            component: (child),
            isChild: (true),
            ...{ class: "container-child-wrapper" },
            ...{ class: ({ selected: __VLS_ctx.store.selectedId === child.id }) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        let __VLS_4;
        let __VLS_5;
        let __VLS_6;
        const __VLS_7 = {
            onSelect: (__VLS_ctx.onChildSelect)
        };
        var __VLS_3;
    }
}
else if (__VLS_ctx.component.type === 'form') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-render component-form" },
        ...{ class: ({ 'is-child': __VLS_ctx.isChild }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-header" },
    });
    (__VLS_ctx.compProps.title ?? '表单');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "form-fields" },
    });
    for (const [field, idx] of __VLS_getVForSourceType((__VLS_ctx.compProps.fields ?? []))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: () => { } },
            key: (idx),
            ...{ class: "form-field" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "form-field-label" },
        });
        (field.label);
        if (field.type === 'textarea') {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
                ...{ class: "form-field-input form-field-textarea" },
                placeholder: (field.placeholder ?? `请输入${field.label}`),
                disabled: true,
            });
        }
        else {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
                ...{ class: "form-field-input" },
                type: (field.type),
                placeholder: (field.placeholder ?? `请输入${field.label}`),
                disabled: true,
            });
        }
    }
    if (!(__VLS_ctx.compProps.fields?.length)) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "form-fields-empty" },
        });
    }
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "component-render component-unknown" },
    });
}
/** @type {__VLS_StyleScopedClasses['component-render']} */ ;
/** @type {__VLS_StyleScopedClasses['component-text']} */ ;
/** @type {__VLS_StyleScopedClasses['is-child']} */ ;
/** @type {__VLS_StyleScopedClasses['text-display']} */ ;
/** @type {__VLS_StyleScopedClasses['text-editor']} */ ;
/** @type {__VLS_StyleScopedClasses['component-render']} */ ;
/** @type {__VLS_StyleScopedClasses['component-button']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-pressed']} */ ;
/** @type {__VLS_StyleScopedClasses['is-child']} */ ;
/** @type {__VLS_StyleScopedClasses['component-render']} */ ;
/** @type {__VLS_StyleScopedClasses['component-image']} */ ;
/** @type {__VLS_StyleScopedClasses['is-child']} */ ;
/** @type {__VLS_StyleScopedClasses['component-render']} */ ;
/** @type {__VLS_StyleScopedClasses['component-container']} */ ;
/** @type {__VLS_StyleScopedClasses['drag-over']} */ ;
/** @type {__VLS_StyleScopedClasses['is-child']} */ ;
/** @type {__VLS_StyleScopedClasses['container-children']} */ ;
/** @type {__VLS_StyleScopedClasses['container-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['container-child-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['selected']} */ ;
/** @type {__VLS_StyleScopedClasses['component-render']} */ ;
/** @type {__VLS_StyleScopedClasses['component-form']} */ ;
/** @type {__VLS_StyleScopedClasses['is-child']} */ ;
/** @type {__VLS_StyleScopedClasses['form-header']} */ ;
/** @type {__VLS_StyleScopedClasses['form-fields']} */ ;
/** @type {__VLS_StyleScopedClasses['form-field']} */ ;
/** @type {__VLS_StyleScopedClasses['form-field-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-field-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-field-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['form-field-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-fields-empty']} */ ;
/** @type {__VLS_StyleScopedClasses['component-render']} */ ;
/** @type {__VLS_StyleScopedClasses['component-unknown']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            store: store,
            btnPressed: btnPressed,
            isDragOver: isDragOver,
            textEditorRef: textEditorRef,
            isEditing: isEditing,
            compProps: compProps,
            startEditing: startEditing,
            saveEdit: saveEdit,
            cancelEdit: cancelEdit,
            onTextPaste: onTextPaste,
            onButtonClick: onButtonClick,
            onContainerDragOver: onContainerDragOver,
            onContainerDragLeave: onContainerDragLeave,
            onContainerDrop: onContainerDrop,
            onChildSelect: onChildSelect,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
