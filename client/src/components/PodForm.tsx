import { useState } from "react";
import { usePodStore } from "../store/podStore";
import React from "react";

export default function PodForm() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const { createPod, loading, error } = usePodStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !image.trim()) {
      return;
    }
    
    await createPod(name, image);
    // 只有在成功创建后才清空表单
    if (!error) {
      setName("");
      setImage("");
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Create New Pod</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Pod Name" 
            style={{ padding: '8px', width: '200px', marginRight: '10px' }}
            disabled={loading}
          />
          <input 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
            placeholder="Image (e.g., nginx:latest)" 
            style={{ padding: '8px', width: '250px', marginRight: '10px' }}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !name.trim() || !image.trim()}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: loading ? '#ccc' : '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating...' : 'Create Pod'}
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
