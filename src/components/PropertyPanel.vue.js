import { computed } from 'vue';
import { useCanvasStore } from '../stores/canvas';
const store = useCanvasStore();
const selectedComponent = computed(() => {
    if (!store.selectedId)
        return null;
    return store.findComponent(store.selectedId) ?? null;
});
function closePanel() {
    store.selectComponent(null);
}
// ─── 通用属性更新 ────────────────────────
function updateProp(key, value) {
    if (!store.selectedId)
        return;
    store.updateComponent(store.selectedId, { [key]: value });
}
function onTextInput(e) {
    const el = e.target;
    updateProp('content', el.value);
}
function onLabelInput(e) {
    const el = e.target;
    updateProp('label', el.value);
}
function onSrcInput(e) {
    const el = e.target;
    updateProp('src', el.value);
}
function onAltInput(e) {
    const el = e.target;
    updateProp('alt', el.value);
}
function onTitleInput(e) {
    const el = e.target;
    updateProp('title', el.value);
}
function onSelectChange(key, e) {
    const el = e.target;
    updateProp(key, el.value);
}
function onColorChange(e) {
    const el = e.target;
    updateProp('color', el.value);
}
function onRangeChange(key, e) {
    const el = e.target;
    const val = parseInt(el.value, 10);
    if (!isNaN(val))
        updateProp(key, val);
}
// ─── 表单字段管理 ────────────────────────
function addField() {
    if (!store.selectedId)
        return;
    const comp = store.findComponent(store.selectedId);
    if (!comp || comp.type !== 'form')
        return;
    const fields = [...(comp.props.fields ?? []), { label: '新字段', type: 'text', placeholder: '', required: false }];
    store.updateComponent(store.selectedId, { fields });
}
function removeField(index) {
    if (!store.selectedId)
        return;
    const comp = store.findComponent(store.selectedId);
    if (!comp || comp.type !== 'form')
        return;
    const fields = [...(comp.props.fields ?? [])];
    fields.splice(index, 1);
    store.updateComponent(store.selectedId, { fields });
}
function updateField(index, key, e) {
    if (!store.selectedId)
        return;
    const comp = store.findComponent(store.selectedId);
    if (!comp || comp.type !== 'form')
        return;
    const fields = [...(comp.props.fields ?? [])];
    const el = e.target;
    const value = el.type === 'checkbox' ? el.checked : el.value;
    fields[index] = { ...fields[index], [key]: value };
    store.updateComponent(store.selectedId, { fields });
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel-close']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add-field']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-remove-field']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.selectedComponent) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "property-panel" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "panel-title" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.closePanel) },
        ...{ class: "panel-close" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "panel-body" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "type-badge" },
    });
    (__VLS_ctx.selectedComponent.type);
    if (__VLS_ctx.selectedComponent.type === 'text') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prop-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "prop-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.textarea, __VLS_intrinsicElements.textarea)({
            ...{ onInput: (__VLS_ctx.onTextInput) },
            ...{ class: "prop-input prop-textarea" },
            value: (__VLS_ctx.selectedComponent.props.content),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prop-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "prop-label" },
        });
        (__VLS_ctx.selectedComponent.props.fontSize ?? 16);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onInput: (...[$event]) => {
                    if (!(__VLS_ctx.selectedComponent))
                        return;
                    if (!(__VLS_ctx.selectedComponent.type === 'text'))
                        return;
                    __VLS_ctx.onRangeChange('fontSize', $event);
                } },
            type: "range",
            ...{ class: "prop-range" },
            min: "12",
            max: "48",
            value: (__VLS_ctx.selectedComponent.props.fontSize ?? 16),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prop-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "prop-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onChange: (__VLS_ctx.onColorChange) },
            type: "color",
            ...{ class: "prop-color" },
            value: (__VLS_ctx.selectedComponent.props.color ?? '#333333'),
        });
    }
    if (__VLS_ctx.selectedComponent.type === 'button') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prop-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "prop-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onInput: (__VLS_ctx.onLabelInput) },
            ...{ class: "prop-input" },
            value: (__VLS_ctx.selectedComponent.props.label),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prop-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "prop-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
            ...{ onChange: (...[$event]) => {
                    if (!(__VLS_ctx.selectedComponent))
                        return;
                    if (!(__VLS_ctx.selectedComponent.type === 'button'))
                        return;
                    __VLS_ctx.onSelectChange('type', $event);
                } },
            ...{ class: "prop-input" },
            value: (__VLS_ctx.selectedComponent.props.type),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "primary",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "default",
        });
    }
    if (__VLS_ctx.selectedComponent.type === 'image') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prop-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "prop-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onInput: (__VLS_ctx.onSrcInput) },
            ...{ class: "prop-input" },
            value: (__VLS_ctx.selectedComponent.props.src),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prop-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "prop-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onInput: (__VLS_ctx.onAltInput) },
            ...{ class: "prop-input" },
            value: (__VLS_ctx.selectedComponent.props.alt),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prop-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "prop-label" },
        });
        (__VLS_ctx.selectedComponent.props.width ?? 200);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onInput: (...[$event]) => {
                    if (!(__VLS_ctx.selectedComponent))
                        return;
                    if (!(__VLS_ctx.selectedComponent.type === 'image'))
                        return;
                    __VLS_ctx.onRangeChange('width', $event);
                } },
            type: "range",
            ...{ class: "prop-range" },
            min: "50",
            max: "800",
            value: (__VLS_ctx.selectedComponent.props.width ?? 200),
        });
    }
    if (__VLS_ctx.selectedComponent.type === 'container') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prop-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "prop-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
            ...{ onChange: (...[$event]) => {
                    if (!(__VLS_ctx.selectedComponent))
                        return;
                    if (!(__VLS_ctx.selectedComponent.type === 'container'))
                        return;
                    __VLS_ctx.onSelectChange('direction', $event);
                } },
            ...{ class: "prop-input" },
            value: (__VLS_ctx.selectedComponent.props.direction),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "column",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
            value: "row",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prop-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "prop-label" },
        });
        (__VLS_ctx.selectedComponent.props.gap ?? 8);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onInput: (...[$event]) => {
                    if (!(__VLS_ctx.selectedComponent))
                        return;
                    if (!(__VLS_ctx.selectedComponent.type === 'container'))
                        return;
                    __VLS_ctx.onRangeChange('gap', $event);
                } },
            type: "range",
            ...{ class: "prop-range" },
            min: "0",
            max: "24",
            value: (__VLS_ctx.selectedComponent.props.gap ?? 8),
        });
    }
    if (__VLS_ctx.selectedComponent.type === 'form') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prop-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "prop-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onInput: (__VLS_ctx.onTitleInput) },
            ...{ class: "prop-input" },
            value: (__VLS_ctx.selectedComponent.props.title),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prop-group" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "prop-label-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            ...{ class: "prop-label" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (__VLS_ctx.addField) },
            ...{ class: "btn-add-field" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "field-list" },
        });
        for (const [field, idx] of __VLS_getVForSourceType((__VLS_ctx.selectedComponent.props.fields ?? []))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (idx),
                ...{ class: "field-item" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "field-item-header" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "field-item-label" },
            });
            (field.label);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.selectedComponent))
                            return;
                        if (!(__VLS_ctx.selectedComponent.type === 'form'))
                            return;
                        __VLS_ctx.removeField(idx);
                    } },
                ...{ class: "btn-remove-field" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "field-item-editor" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
                ...{ onInput: (...[$event]) => {
                        if (!(__VLS_ctx.selectedComponent))
                            return;
                        if (!(__VLS_ctx.selectedComponent.type === 'form'))
                            return;
                        __VLS_ctx.updateField(idx, 'label', $event);
                    } },
                ...{ class: "prop-input prop-input-sm" },
                value: (field.label),
                placeholder: "字段名",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
                ...{ onChange: (...[$event]) => {
                        if (!(__VLS_ctx.selectedComponent))
                            return;
                        if (!(__VLS_ctx.selectedComponent.type === 'form'))
                            return;
                        __VLS_ctx.updateField(idx, 'type', $event);
                    } },
                ...{ class: "prop-input prop-input-sm" },
                value: (field.type),
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                value: "text",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                value: "number",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                value: "email",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                value: "password",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                value: "textarea",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
                ...{ onInput: (...[$event]) => {
                        if (!(__VLS_ctx.selectedComponent))
                            return;
                        if (!(__VLS_ctx.selectedComponent.type === 'form'))
                            return;
                        __VLS_ctx.updateField(idx, 'placeholder', $event);
                    } },
                ...{ class: "prop-input prop-input-sm" },
                value: (field.placeholder ?? ''),
                placeholder: "占位提示",
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
                ...{ class: "prop-checkbox" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
                ...{ onChange: (...[$event]) => {
                        if (!(__VLS_ctx.selectedComponent))
                            return;
                        if (!(__VLS_ctx.selectedComponent.type === 'form'))
                            return;
                        __VLS_ctx.updateField(idx, 'required', $event);
                    } },
                type: "checkbox",
                checked: (field.required ?? false),
            });
        }
        if (!(__VLS_ctx.selectedComponent.props.fields?.length)) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "field-empty" },
            });
        }
    }
}
/** @type {__VLS_StyleScopedClasses['property-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-header']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-title']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-close']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-body']} */ ;
/** @type {__VLS_StyleScopedClasses['type-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-group']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-label']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-textarea']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-group']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-label']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-range']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-group']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-label']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-color']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-group']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-label']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-group']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-label']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-group']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-label']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-group']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-label']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-group']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-label']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-range']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-group']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-label']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-group']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-label']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-range']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-group']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-label']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-group']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-label-row']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-label']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-add-field']} */ ;
/** @type {__VLS_StyleScopedClasses['field-list']} */ ;
/** @type {__VLS_StyleScopedClasses['field-item']} */ ;
/** @type {__VLS_StyleScopedClasses['field-item-header']} */ ;
/** @type {__VLS_StyleScopedClasses['field-item-label']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-remove-field']} */ ;
/** @type {__VLS_StyleScopedClasses['field-item-editor']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-input-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['prop-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['field-empty']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            selectedComponent: selectedComponent,
            closePanel: closePanel,
            onTextInput: onTextInput,
            onLabelInput: onLabelInput,
            onSrcInput: onSrcInput,
            onAltInput: onAltInput,
            onTitleInput: onTitleInput,
            onSelectChange: onSelectChange,
            onColorChange: onColorChange,
            onRangeChange: onRangeChange,
            addField: addField,
            removeField: removeField,
            updateField: updateField,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
