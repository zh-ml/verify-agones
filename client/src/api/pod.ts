import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export interface PodInfo {
  name: string;
  ip?: string;
  ports?: number[];
  status: string;
}

export interface CreatePodRequest {
  name: string;
  image: string;
}

export const createPod = (data: CreatePodRequest): Promise<PodInfo> =>
  api.post("/pods", data).then((res) => res.data);

export const getPod = (name: string): Promise<PodInfo> =>
  api.get(`/pods/${name}`).then((res) => res.data);

export const listPods = (): Promise<PodInfo[]> =>
  api.get("/pods/list").then((res) => res.data);

export const deletePod = (name: string): Promise<{ message: string }> =>
  api.delete(`/pods/${name}`).then((res) => res.data);

// WebSocket 连接方法
export const createPodStatusWebSocket = (onMessage: (data: any) => void): WebSocket => {
  const ws = new WebSocket(`ws://${window.location.host}/api/ws/pods`);
  
  ws.onopen = () => {
    console.log('Pod Status WebSocket connected');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onclose = () => {
    console.log('Pod Status WebSocket disconnected');
  };

  return ws;
};

export const createPodWatchWebSocket = (onMessage: (data: any) => void): WebSocket => {
  const ws = new WebSocket(`ws://${window.location.host}/api/watch/pods`);
  
  ws.onopen = () => {
    console.log('Pod Watch WebSocket connected');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  ws.onclose = () => {
    console.log('Pod Watch WebSocket disconnected');
  };

  return ws;
};
