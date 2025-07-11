import { useState } from "react";
import { usePodStore } from "../store/podStore";
import React from "react";

export default function GameServerAllocation() {
  const [name, setName] = useState("");
  const { allocateGameServer, loading, error } = usePodStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    
    await allocateGameServer(name);
    // 只有在成功创建后才清空表单
    if (!error) {
      setName("");
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Allocate Game Server</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Game Server Name" 
            style={{ padding: '8px', width: '200px', marginRight: '10px' }}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !name.trim()}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: loading ? '#ccc' : '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Allocating...' : 'Allocate Game Server'}
          </button>
        </div>
        {error && (
          <div style={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>
            Error: {error}
          </div>
        )}
      </form>
    </div>
  );
}
