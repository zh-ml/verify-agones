import GameServerAllocation from './components/GameServerAllocation';
import GameServerListAllocated from './components/GameServerListAllocated';
import { usePodWatchSocket } from './usePodSocket';
import MainPage from './components/MainPage';
import OrderPage from './components/OrderPage';
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SelectPage from './components/SelectPage';
import GuidePage from './components/GuidePage';

// 示例数据
const sampleList = [
  { id: 0, image: '/minecraft.svg', webp: '/minecraft.webp', name: 'Minecraft Java', content: '¥ 20000 / month', isClick: 'true' },
  { id: 1, image: '/vite.svg', webp: '/vite.svg', name: 'item1', content: 'item1', isClick: 'false' },
  { id: 2, image: '/vite.svg', webp: '/vite.svg', name: 'item2', content: 'item2', isClick: 'false' },
  { id: 3, image: '/vite.svg', webp: '/vite.svg', name: 'item3', content: 'item3', isClick: 'false' },
  { id: 4, image: '/vite.svg', webp: '/vite.svg', name: 'item4', content: 'item4', isClick: 'false' },
  { id: 5, image: '/vite.svg', webp: '/vite.svg', name: 'item5', content: 'item5', isClick: 'false' },
];

function MainApp() {
  const navigate = useNavigate();
  const location = useLocation();
  // 监听 Pod 事件，用于实时更新
  // usePodWatchSocket((event) => {
  //   console.log('Pod event received:', event);
  //   // 可以在这里处理特定的事件类型
  // });

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h1 style={{ margin: '0', color: '#333' }}>Dedicated Game Server</h1>
        <p style={{ margin: '10px 0 0 0', color: '#666' }}>
          Choose which you want.
        </p>
        { location.pathname !== '/info/' && (
        <button
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 700,
            transition: 'background-color 0.3s',
          }}
          onClick={() => navigate('/info/')}
        >
          Console Page
        </button>
        )}
        { location.pathname === '/info/' && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', gap: '10px' }}>
        <button
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 700,
            transition: 'background-color 0.3s',
          }}
          onClick={() => navigate('/')}
        >
          Main Page
        </button>
        <button
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 700,
            transition: 'background-color 0.3s',
          }}
          onClick={() => navigate('/guide/')}
        >
          Guide Page
        </button>
        </div>
        )}
      </header>
      <main>
        <Routes>
          <Route path="/" element={<MainPage list={sampleList} />} />
          <Route path="/info/" element={<GameServerListAllocated />} />
          <Route path="/guide/" element={<GuidePage />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="select/:id" element={<SelectPage />} />
        </Routes>
      </main>
      <div style={{
      maxWidth: 1000,
      margin: '20px auto',
      background: '#000',
      borderRadius: 12,
      boxShadow: '0 2px 16px #0001',
      padding: 24,
      color: '#fff',
      textAlign: 'center',
      fontSize: '16px',
      opacity: 0.7,
    }}>
      <p>
        <strong>Note:</strong> This is a demo page. The server will be allocated for 1 hour and then automatically released.
        <br />
        If you want to keep it longer, please contact the administrator.
      </p>
    </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}