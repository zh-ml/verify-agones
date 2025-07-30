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

export interface GameServerInfo {
  name: string;
  ip?: string;
  port?: number;
  status: string;
  startTime?: string; // ISO 8601 format
}

export interface CreatePodRequest {
  name: string;
  image: string;
}

export interface AllocateGameServerRequest {
  name: string;
}

export interface DeployGameServerRequest {
  name: string;
  version: string;
  cpuResource: string;
  memoryResource: string;
  label: string;
}

export interface ListGameServerRequest {
  status?: string;
}

export const createPod = (data: CreatePodRequest): Promise<PodInfo> =>
  api.post("/pods", data).then((res) => res.data);

export const getPod = (name: string): Promise<PodInfo> =>
  api.get(`/pods/${name}`).then((res) => res.data);

export const listPods = (): Promise<PodInfo[]> =>
  api.get("/pods/list").then((res) => res.data);

export const deletePod = (name: string): Promise<{ message: string }> =>
  api.delete(`/pods/${name}`).then((res) => res.data);

export const allocateGameServer = (data: AllocateGameServerRequest): Promise<GameServerInfo> =>
  api.post("/gs/allocate", data).then((res) => res.data);

export const listGameServers = (status: ListGameServerRequest): Promise<GameServerInfo[]> =>
  api.post("/gs/listGameServers", status).then((res) => res.data);

export const deleteAllocatedGameServer = (name: string): Promise<{ message: string }> =>
  api.delete(`/gs/delete/${name}`).then((res) => res.data);

export const deployGameServer = (data: DeployGameServerRequest): Promise<GameServerInfo> =>
  api.post("/gs/deployGameServer", data).then((res) => res.data);
