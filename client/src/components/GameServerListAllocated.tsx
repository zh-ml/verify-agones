import { useEffect } from "react";
import { usePodStore } from "../store/podStore";
// import { usePodWatchSocket } from "../usePodSocket";

export default function GameServerListAllocated() {
  const { allocatedGameServers, fetchAllocatedGameServers, deleteAllocatedGameServer, loading, error } = usePodStore();

  // 初始加载 Pod 列表
  useEffect(() => {
    fetchAllocatedGameServers();
  }, [fetchAllocatedGameServers]);

  // // 监听 Pod 事件更新
  // usePodWatchSocket((event) => {
  //   console.log('Pod event received:', event);
  //   // 当收到 Pod 事件时，重新获取列表
  //   fetchAllocatedGameServers();
  // });

  const handleRelease = async (name: string) => {
    if (window.confirm(`Are you sure you want to release game server "${name}"?`)) {
      await deleteAllocatedGameServer(name);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'Allocated':
        return '#28a745';
      case 'Ready':
        return '#ffc107';
      case 'Shutdown':
        return '#dc3545';
      case 'Scheduled':
        return '#17a2b8';
      default:
        return '#6c757d';
    }
  };

  if (loading && allocatedGameServers && allocatedGameServers.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading pods...</div>
      </div>
    );
  }

  if (error || !allocatedGameServers) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        Error: {error}
        <button 
          onClick={() => fetchAllocatedGameServers()} 
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          Retry
        </button>
      </div>
    );
  } else if (!allocatedGameServers || allocatedGameServers.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>No allocated game servers</h2>
        <button 
          onClick={() => fetchAllocatedGameServers()} 
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Allocated Game Servers ({allocatedGameServers.length})</h2>
        <button 
          onClick={() => fetchAllocatedGameServers()} 
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
      
      {allocatedGameServers.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#6c757d', padding: '40px' }}>
          No pods found. Create a new pod to get started.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          {allocatedGameServers.map((gameServer) => (
            <div 
              key={gameServer.name} 
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '15px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{gameServer.name}</h4>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    <span style={{ 
                      color: getStatusColor(gameServer.status), 
                      fontWeight: 'bold' 
                    }}>
                      {gameServer.status}
                    </span>
                    {gameServer.ip && (
                      <span style={{ marginLeft: '10px' }}>
                        IP: {gameServer.ip}
                      </span>
                    )}
                    {gameServer.port && (
                      <span style={{ marginLeft: '10px' }}>
                        Port: {gameServer.port}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleRelease(gameServer.name)}
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
                    Release
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
