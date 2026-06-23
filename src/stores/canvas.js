import { defineStore } from 'pinia';
import { reactive, shallowRef, toRaw } from 'vue';
/** 每种组件类型的默认 props */
const DEFAULT_PROPS = {
    text: { content: '请输入文字', fontSize: 16, color: '#333333' },
    button: { label: '按钮', type: 'primary' },
    image: { src: 'https://placehold.co/200x120', alt: '图片', width: 200 },
    container: { direction: 'row', gap: 8 },
    form: { title: '表单', fields: [{ label: '姓名', type: 'text' }] },
};
export const useCanvasStore = defineStore('canvas', () => {
    /** 组件列表 */
    const components = reactive([]);
    /** 当前选中组件 ID */
    const selectedId = shallowRef(null);
    /** 正在编辑的文本组件 ID */
    const editingId = shallowRef(null);
    /** 撤销/重做栈 */
    const MAX_HISTORY = 50;
    const history = shallowRef([]);
    const future = shallowRef([]);
    /** 生成唯一 ID */
    function generateId() {
        return crypto.randomUUID();
    }
    /** 保存当前状态快照（所有 mutation 操作前调用） */
    function snapshot() {
        const cloned = JSON.parse(JSON.stringify(toRaw(components)));
        history.value = [...history.value, cloned];
        if (history.value.length > MAX_HISTORY) {
            history.value = history.value.slice(history.value.length - MAX_HISTORY);
        }
        future.value = [];
    }
    /** 恢复组件数组 */
    function restoreComponents(data) {
        components.splice(0, components.length, ...data);
    }
    /** 撤销 */
    function undo() {
        if (history.value.length === 0)
            return;
        const current = JSON.parse(JSON.stringify(toRaw(components)));
        future.value = [...future.value, current];
        const prev = history.value.pop();
        restoreComponents(prev);
        selectedId.value = null;
        editingId.value = null;
    }
    /** 重做 */
    function redo() {
        if (future.value.length === 0)
            return;
        const current = JSON.parse(JSON.stringify(toRaw(components)));
        history.value = [...history.value, current];
        const next = future.value.pop();
        restoreComponents(next);
        selectedId.value = null;
        editingId.value = null;
    }
    /** 递归查找组件（支持容器嵌套） */
    function findComponent(id, list = components) {
        for (const comp of list) {
            if (comp.id === id)
                return comp;
            if (comp.children) {
                const found = findComponent(id, comp.children);
                if (found)
                    return found;
            }
        }
        return undefined;
    }
    /** 添加组件到画布 */
    function addComponent(type, index) {
        snapshot();
        const comp = {
            id: generateId(),
            type,
            props: { ...DEFAULT_PROPS[type] },
            children: type === 'container' ? [] : undefined,
        };
        if (index !== undefined && index >= 0 && index < components.length) {
            components.splice(index, 0, comp);
        }
        else {
            components.push(comp);
        }
        return comp;
    }
    /** 移除组件（递归：支持容器嵌套） */
    function removeComponent(id) {
        snapshot();
        const idx = components.findIndex((c) => c.id === id);
        if (idx !== -1) {
            components.splice(idx, 1);
        }
        else {
            // 在容器 children 中递归查找
            for (const comp of components) {
                if (comp.children) {
                    const childIdx = comp.children.findIndex((c) => c.id === id);
                    if (childIdx !== -1) {
                        comp.children = comp.children.filter((c) => c.id !== id);
                        break;
                    }
                }
            }
        }
        if (selectedId.value === id) {
            selectedId.value = null;
        }
    }
    /** 选中组件 */
    function selectComponent(id) {
        selectedId.value = id;
    }
    /** 更新组件 props（浅合并，递归查找） */
    function updateComponent(id, props) {
        snapshot();
        const comp = findComponent(id);
        if (comp) {
            comp.props = { ...comp.props, ...props };
        }
    }
    /** 向容器添加子组件 */
    function addChildToContainer(containerId, type, index) {
        snapshot();
        const container = findComponent(containerId);
        if (!container || !container.children)
            return undefined;
        const child = {
            id: generateId(),
            type,
            props: { ...DEFAULT_PROPS[type] },
            children: type === 'container' ? [] : undefined,
        };
        if (index !== undefined && index >= 0 && index < container.children.length) {
            const newChildren = [...container.children];
            newChildren.splice(index, 0, child);
            container.children = newChildren;
        }
        else {
            container.children = [...container.children, child];
        }
        return child;
    }
    /** 从容器移除子组件 */
    function removeChildFromContainer(containerId, childId) {
        snapshot();
        const container = findComponent(containerId);
        if (!container?.children)
            return;
        container.children = container.children.filter((c) => c.id !== childId);
    }
    /** 设置/清除文本编辑状态 */
    function setEditingId(id) {
        editingId.value = id;
    }
    return {
        components,
        selectedId,
        editingId,
        history,
        future,
        findComponent,
        addComponent,
        removeComponent,
        selectComponent,
        updateComponent,
        addChildToContainer,
        removeChildFromContainer,
        setEditingId,
        undo,
        redo,
    };
});
