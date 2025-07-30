import { useEffect, useRef, useState } from "react";
import { usePodStore } from "../store/podStore";
// import { usePodWatchSocket } from "../usePodSocket";
import { GameServerState } from "../common/const";

export default function GameServerListAllocated() {
  const { allocatedGameServers, fetchAllGameServers, deleteAllocatedGameServer, loading } = usePodStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUnmountedRef = useRef(false);
  const [now, setNow] = useState(Date.now());

  const fetchData = async () => {
    if (isUnmountedRef.current) return;
    await fetchAllGameServers(GameServerState.ALLOCATED);
    setNow(Date.now());
    timeoutRef.current = setTimeout(fetchData, 5000);
  };

  useEffect(() => {
    isUnmountedRef.current = false;
    fetchData(); // 初次调用
    return () => {
      isUnmountedRef.current = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        console.log('清除 timeout');
      }
    };
  }, []);

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

  function formatDuration(start: string, end?: string): string {
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : now;

    let diff = Math.max(0, endTime - startTime); // 毫秒差

    const totalMinutes = Math.floor(diff / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(days)}天:${pad(hours)}时:${pad(minutes)}分`;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Allocated Game Servers ({allocatedGameServers.length})</h2>
        <button 
          onClick={() => fetchAllGameServers(GameServerState.ALLOCATED)}
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
                    {gameServer.startTime && (
                      <span style={{ marginLeft: '10px' }}>
                        Time: {gameServer.startTime ? formatDuration(gameServer.startTime) : 'N/A'}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => handleRelease(gameServer.name)}
                    disabled={loading}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      marginLeft: '10px'
                    }}
                  >
                    {loading ? 'Terminating...' : 'Terminate'}
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
