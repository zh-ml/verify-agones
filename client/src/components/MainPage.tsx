import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface ItemData {
  id: number;
  image: string;
  webp: string;
  name: string;
  content: string;
  isClick: string; // 'true' or 'false'
}

interface MainPageProps {
  list: ItemData[];
}

export default function MainPage({ list }: MainPageProps) {
  const navigate = useNavigate();

  // 每4个一组分组
  const rows = [];
  for (let i = 0; i < list.length; i += 4) {
    rows.push(list.slice(i, i + 4));
  }

  const handleClick = (item: ItemData) => {
    if (item.isClick === 'true') {
      navigate(`/order/${item.id}`, {state: item});
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} style={{ display: 'flex', marginBottom: '20px', gap: '20px' }}>
          {row.map((item) => (
            <div
              key={item.id}
              style={{
                flex: 1,
                minWidth: 0,
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
                background: item.isClick === 'true' ? '#000' : 'gray',
                cursor: item.isClick === 'true' ? 'pointer' : 'not-allowed',
                boxShadow: item.isClick === 'true' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                transition: 'box-shadow 0.2s',
              }}
              onClick={() => handleClick(item)}
            >
              <img src={item.image} alt={item.content} style={{ width: '40px', height: '40px', objectFit: 'cover', marginBottom: '8px' }} />
              <div style={{ fontSize: '20px', color: '#fff' }}>{item.name}</div>
              <div style={{ fontSize: '12px', color: '#fff' }}>{item.content}</div>
            </div>
          ))}
          {/* 补齐空格 */}
          {/* {row.length < 4 && Array.from({ length: 4 - row.length }).map((_, idx) => (
            <div key={idx} style={{ flex: 1, minWidth: 0 }} />
          ))} */}
        </div>
      ))}
    </div>
  );
}