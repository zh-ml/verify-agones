import { useEffect, useRef } from 'react';
import { createPodStatusWebSocket, createPodWatchWebSocket } from './api/pod';
import type { PodInfo } from './api/pod';

export type WebSocketType = 'status' | 'watch';

export function usePodSocket(
  onMessage: (data: any) => void, 
  type: WebSocketType = 'status'
) {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 根据类型创建不同的 WebSocket 连接
    if (type === 'status') {
      ws.current = createPodStatusWebSocket(onMessage);
    } else {
      ws.current = createPodWatchWebSocket(onMessage);
    }

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [onMessage, type]);

  return ws.current;
}

// 专门用于 Pod 状态更新的 hook
export function usePodStatusSocket(onPodUpdate: (pod: PodInfo) => void) {
  return usePodSocket((data) => {
    // 处理 Pod 状态更新
    if (data && data.name) {
      onPodUpdate(data as PodInfo);
    }
  }, 'status');
}

// 专门用于 Pod 事件监听的 hook
export function usePodWatchSocket(onPodEvent: (event: any) => void) {
  return usePodSocket((data) => {
    // 处理 Pod 事件
    onPodEvent(data);
  }, 'watch');
}
