import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const navItems = [
  { key: 'minecraft', label: 'Minecraft: Connect to Server', file: '/markdown/minecraft.md' },
  { key: 'item1', label: '内容1', file: '/markdown/item1.md' },
  { key: 'item2', label: '内容2', file: '/markdown/item2.md' },
];

export default function GuidePage() {
  const [activeKey, setActiveKey] = useState(navItems[0].key);
  const [content, setContent] = useState('');

  useEffect(() => {
    const activeItem = navItems.find(item => item.key === activeKey);
    if (activeItem) {
      fetch(activeItem.file)
        .then(res => res.text())
        .then(text => setContent(text))
        .catch(() => setContent('加载失败'));
    }
  }, [activeKey]);

  const activeItem = navItems.find(item => item.key === activeKey);

  return (
    <div style={{ display: 'flex', height: '50vh', width: '100%' }}>
      {/* 左侧导航栏 */}
      <nav style={{
        width: '20%',
        background: '#f5f5f5',
        padding: '24px 16px',
        boxSizing: 'border-box',
        borderRight: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'auto',
      }}>
        <ul style={{ listStyle: 'none', paddingLeft: '10px' }}>
          {navItems.map(item => (
            <li
              key={item.key}
              style={{
                padding: '2px 0',
                cursor: 'pointer',
                fontWeight: activeKey === item.key ? 'bold' : 'normal',
                color: activeKey === item.key ? '#1976d2' : '#333'
              }}
              onClick={() => setActiveKey(item.key)}
            >
              {item.key}
            </li>
          ))}
        </ul>
      </nav>
      {/* 右侧内容区 */}
      <main style={{ flex: 1, padding: '10px', overflow: 'auto', width: '80%' }}>
        <h2>{activeItem?.label}</h2>
        <ReactMarkdown>{content}</ReactMarkdown>
      </main>
    </div>
  );
}
