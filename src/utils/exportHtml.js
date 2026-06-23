function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
function renderProps(comp) {
    return comp.props;
}
function renderText(comp) {
    const p = renderProps(comp);
    const content = escapeHtml(p.content || '文本');
    const fontSize = p.fontSize || 16;
    const color = p.color || '#333333';
    return `<div style="padding: 8px; font-size: ${fontSize}px; color: ${color}; text-align: center; word-break: break-all;">${content}</div>`;
}
function renderButton(comp) {
    const p = renderProps(comp);
    const label = escapeHtml(p.label || '按钮');
    const type = p.type || 'primary';
    const bgColor = type === 'primary' ? '#409eff' : '#f5f5f5';
    const textColor = type === 'primary' ? '#fff' : '#333';
    const border = type === 'primary' ? 'none' : '1px solid #d9d9d9';
    return `<button style="padding: 6px 16px; border: ${border}; border-radius: 6px; font-size: 14px; background: ${bgColor}; color: ${textColor}; cursor: pointer;">${label}</button>`;
}
function renderImage(comp) {
    const p = renderProps(comp);
    const src = escapeHtml(p.src || '');
    const alt = escapeHtml(p.alt || '');
    const width = p.width || 200;
    return `<img src="${src}" alt="${alt}" style="width: ${width}px; max-width: 100%; object-fit: cover;" />`;
}
function renderContainer(comp) {
    const p = renderProps(comp);
    const direction = p.direction || 'column';
    const gap = p.gap || 8;
    const children = comp.children || [];
    const childrenHtml = children.length > 0
        ? children.map(renderComponent).join('\n      ')
        : '<div style="display: flex; align-items: center; justify-content: center; min-height: 60px; border: 2px dashed #d9d9d9; border-radius: 4px; color: #bbb; font-size: 12px;">容器区域</div>';
    return `<div style="display: flex; flex-direction: ${direction}; gap: ${gap}px; padding: 8px; background: #fafafa; border: 1px dashed #d9d9d9; border-radius: 4px; min-height: 60px;">
      ${childrenHtml}
    </div>`;
}
function renderFormField(field) {
    const label = escapeHtml(field.label || '字段');
    const placeholder = escapeHtml(field.placeholder || `请输入${field.label}`);
    const required = field.required ? ' required' : '';
    if (field.type === 'textarea') {
        return `<div style="display: flex; flex-direction: column; gap: 2px;">
      <label style="font-size: 12px; color: #666; font-weight: 500;">${label}</label>
      <textarea placeholder="${placeholder}"${required} style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px; font-size: 13px; box-sizing: border-box; min-height: 48px;"></textarea>
    </div>`;
    }
    return `<div style="display: flex; flex-direction: column; gap: 2px;">
    <label style="font-size: 12px; color: #666; font-weight: 500;">${label}</label>
    <input type="${field.type}" placeholder="${placeholder}"${required} style="width: 100%; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px; font-size: 13px; box-sizing: border-box;" />
  </div>`;
}
function renderForm(comp) {
    const p = renderProps(comp);
    const title = escapeHtml(p.title || '表单');
    const fields = p.fields || [];
    const fieldsHtml = fields.length > 0
        ? fields.map(renderFormField).join('\n        ')
        : '<div style="font-size: 11px; color: #bbb; text-align: center; padding: 8px;">暂无表单字段</div>';
    return `<div style="display: flex; flex-direction: column; gap: 4px; padding: 8px;">
    <div style="font-size: 13px; font-weight: 600; color: #333;">${title}</div>
    <div style="display: flex; flex-direction: column; gap: 6px;">
      ${fieldsHtml}
    </div>
  </div>`;
}
/** 递归渲染单个组件为 HTML */
function renderComponent(comp) {
    switch (comp.type) {
        case 'text':
            return renderText(comp);
        case 'button':
            return renderButton(comp);
        case 'image':
            return renderImage(comp);
        case 'container':
            return renderContainer(comp);
        case 'form':
            return renderForm(comp);
        default:
            return '<div>未知组件</div>';
    }
}
/** 生成完整 HTML 文档 */
function generateHtml(components) {
    const bodyHtml = components.map((comp) => {
        return `<div style="margin-bottom: 12px;">
      ${renderComponent(comp)}
    </div>`;
    }).join('\n    ');
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>导出的页面</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #333;
      padding: 20px;
      background: #fff;
      max-width: 900px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
}
/** 触发 HTML 文件下载 */
function downloadHtml(html, filename = 'my-page.html') {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
export { generateHtml, downloadHtml };
