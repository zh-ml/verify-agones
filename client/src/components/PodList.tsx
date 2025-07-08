import { useEffect } from "react";
import { usePodStore } from "../store/podStore";
import { usePodWatchSocket } from "../usePodSocket";

export default function PodList() {
  const { pods, deletePod, fetchPods, loading, error } = usePodStore();

  // 初始加载 Pod 列表
  useEffect(() => {
    fetchPods();
  }, [fetchPods]);

  // 监听 Pod 事件更新
  usePodWatchSocket((event) => {
    console.log('Pod event received:', event);
    // 当收到 Pod 事件时，重新获取列表
    fetchPods();
  });

  const handleDelete = async (name: string) => {
    if (window.confirm(`Are you sure you want to delete pod "${name}"?`)) {
      await deletePod(name);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'running':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'failed':
        return '#dc3545';
      case 'succeeded':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  if (loading && pods.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading pods...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        Error: {error}
        <button 
          onClick={() => fetchPods()} 
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Pods ({pods.length})</h2>
        <button 
          onClick={() => fetchPods()} 
          disabled={loading}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {pods.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>
          No pods found. Create a new pod to get started.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {pods.map((pod) => (
            <div 
              key={pod.name} 
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '15px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{pod.name}</h4>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    <span style={{ 
                      color: getStatusColor(pod.status), 
                      fontWeight: 'bold' 
                    }}>
                      {pod.status}
                    </span>
                    {pod.ip && (
                      <span style={{ marginLeft: '10px' }}>
                        IP: {pod.ip}
                      </span>
                    )}
                    {pod.ports && pod.ports.length > 0 && (
                      <span style={{ marginLeft: '10px' }}>
                        Ports: {pod.ports.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <button 
                    onClick={() => handleDelete(pod.name)}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginLeft: '10px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
