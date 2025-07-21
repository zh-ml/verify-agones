import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ItemData } from './MainPage';

const plans = [
  { label: 'Monthly', price: 12.9, discount: 0, desc: '/ month' },
  { label: 'Quarterly', price: 12.9 * 3 * 0.9, discount: 10, desc: '/ 3 months' },
  { label: 'Yearly', price: 12.9 * 12 * 0.8, discount: 20, desc: '/ year' },
];

const features = [
  { icon: '🖥️', text: '16GB RAM' },
  { icon: '🌐', text: 'Unlimited slots' },
  { icon: '💬', text: 'Human support' },
  { icon: '🗂️', text: 'All major server types' },
  { icon: '💸', text: '7 day money-back guarantee' },
  { icon: '⚡', text: 'CurseForge integration' },
  { icon: '🔄', text: 'Unlimited game swapping' },
  { icon: '🌱', text: 'Fresh starts and failsafes' },
];

const orderFeatures = [
  '7 day money-back guarantee',
  'Unlimited slots and 16GB RAM',
  'All major server types supported',
  'Safe and secure payments',
];

export default function OrderPage() {
  const [planIdx, setPlanIdx] = useState(0);
  const location = useLocation();
  const data = location.state as ItemData;
  const navigate = useNavigate();

  const handleClick = (item: ItemData) => {
    if (item.isClick === 'true') {
      navigate(`/select/${item.id}`, {state: item});
    }
  };

  return (
    <div style={{
    //   minHeight: '100vh',
    //   background: 'linear-gradient(120deg, #232946 60%, #232946cc 100%)',
      backgroundImage: `url(${data.webp})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    //   padding: '40px 0',
      opacity: 0.9,
    }}>
      <div style={{ display: 'flex', gap: 48, alignItems: 'stretch', maxWidth: 1100, width: '100%' }}>
        {/* 左侧特性 */}
        <div style={{ flex: 1, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '10px' }}>
          <div style={{ fontSize: 44, fontWeight: 400, marginBottom: 32, lineHeight: 1.1 }}>
            All-inclusive Minecraft hosting.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
            {features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* <span style={{ fontSize: 28, background: '#393e46', borderRadius: 8, padding: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{f.icon}</span> */}
                <span style={{ fontWeight: 600, fontSize: 18 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 右侧套餐卡片 */}
        <div style={{
          background: 'rgba(35,41,70,0.95)',
          borderRadius: 18,
          boxShadow: '0 4px 32px #0002',
          padding: '40px 36px',
          minWidth: 340,
          maxWidth: 380,
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: 0.9,
        }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {plans.map((p, idx) => (
              <button
                key={p.label}
                onClick={() => setPlanIdx(idx)}
                style={{
                  background: planIdx === idx ? '#ffb800' : 'transparent',
                  color: planIdx === idx ? '#232946' : '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 20px',
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: 'pointer',
                  position: 'relative',
                  outline: 'none',
                  marginRight: idx < plans.length - 1 ? 8 : 0,
                }}
              >
                {p.label}
                {p.discount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: -18,
                    right: 0,
                    background: '#ffb800',
                    color: '#232946',
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 6,
                    padding: '2px 8px',
                  }}>{p.discount} % OFF</span>
                )}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 8 }}>
            {data.content}
            {/* <span style={{ fontSize: 18, fontWeight: 400, marginLeft: 4 }}>{plan.desc}</span> */}
          </div>
          <button style={{
            background: '#ffb800',
            color: '#232946',
            fontWeight: 700,
            fontSize: 20,
            border: 'none',
            borderRadius: 24,
            padding: '16px 0',
            width: '100%',
            margin: '24px 0 16px 0',
            cursor: 'pointer',
            letterSpacing: 1,
          }}
          onClick={() => handleClick(data)}
          >
            ORDER NOW
          </button>
          <div style={{ width: '100%', marginBottom: 8 }}>
            {orderFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, marginBottom: 6 }}>
                <span style={{ color: '#ffb800', fontSize: 18 }}>✔</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}