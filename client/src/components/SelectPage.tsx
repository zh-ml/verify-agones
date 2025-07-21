import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ItemData } from './MainPage';
import { usePodStore } from '../store/podStore';

const allVersion = [
    {id: 0, versions: ['1.21.7', '1.21.6', '1.21.5', '1.21.4']},
]

export default function SelectPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ItemData;
  const [selected, setSelected] = useState('1.21.4');

  const { allocateGameServer, fetchAllocatedGameServers, allocatedGameServers, loading, error } = usePodStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.name.trim()) {
      return;
    }
    await allocateGameServer(state?.name);
    fetchAllocatedGameServers();
    if (!loading && allocatedGameServers) {
      setTimeout(() => {
        navigate(`/info/`);
      }, 500);
    }
  };

  if (!state) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>No data provided.</div>;
  }

  // window.confirm(JSON.stringify(allocatedGameServers));

  useEffect(() => {
    if (!allocatedGameServers || allocatedGameServers.length === 0) {
      fetchAllocatedGameServers();
    }
  }, []);

  return (
    <div>
      <div style={{ 
        maxWidth: 1000, 
        margin: '20px auto', 
        background: '#000', 
        borderRadius: 12, 
        boxShadow: '0 2px 16px #0001', 
        padding: 24,
        backgroundImage: `url(${state.webp})`,
        }}
        >
        {/* 图片 */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src={state.image} alt={state.name || 'select'} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, opacity: 0.7 }} />
          <div style={{ fontSize: '30px', color: 'black', fontWeight: 'bold' }}>{state.name}</div>
        </div>
        {/* 选择框 */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            style={{ fontSize: 18, padding: '8px 16px', borderRadius: 8, border: '1px solid #ccc', minWidth: 180, opacity: 0.7}}
          >
            {allVersion
              .filter(perGame => perGame.id === state.id)
              .flatMap(perGame => perGame.versions)
              .map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
          </select>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px', textAlign: 'center' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                background: '#fff', //'#232946',
                color: '#000',
                fontWeight: 700,
                fontSize: 18,
                border: 'none',
                borderRadius: 8,
                padding: '10px 40px',
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: 1,
                opacity: 0.7,
              }}
            >
              {loading ? 'Allocating...' : 'Deploy'}
            </button>
          </div>
          {error && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>
              Error: {error}
            </div>
          )}
        </form>
      </div>
      { allocatedGameServers.length > 0 && (
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Allocated Game Servers ({allocatedGameServers.length})</h2>
          {loading && <p>Loading...</p>}
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {allocatedGameServers.map((server) => (
            <li key={server.name} style={{ marginBottom: '10px' }}>
              <div style={{ 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                backgroundColor: '#f8f9fa' 
              }}>
                <strong>{server.name}</strong> - {server.status} - IP: {server.ip || 'N/A'} - Port: {server.port || 'N/A'}
              </div>
            </li>
          ))}
        </ul>
      </div>
      )}
    </div>
  );
}
