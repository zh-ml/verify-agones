import { create } from "zustand";
import * as podApi from "../api/pod";
import type { GameServerInfo, PodInfo } from "../api/pod";

interface PodStore {
  pods: PodInfo[];
  allocatedGameServers: GameServerInfo[];
  loading: boolean;
  error: string | null;
  fetchPods: () => Promise<void>;
  fetchPod: (name: string) => Promise<void>;
  createPod: (name: string, image: string) => Promise<void>;
  deletePod: (name: string) => Promise<void>;
  updatePod: (pod: PodInfo) => void;
  allocateGameServer: (name: string) => Promise<void>;
  deployGameServer: (name: string, version: string, cpuResource: string, memoryResource: string, label: string) => Promise<void>;
  fetchAllGameServers: (status: string) => Promise<void>;
  deleteAllocatedGameServer: (name: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePodStore = create<PodStore>((set) => ({
  pods: [],
  allocatedGameServers: [],
  loading: false,
  error: null,
  
  fetchPods: async () => {
    set({ loading: true, error: null });
    try {
      const pods = await podApi.listPods();
      set({ pods: pods || [], loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch pods', 
        loading: false 
      });
    }
  },

  fetchPod: async (name) => {
    try {
      const pod = await podApi.getPod(name);
      set((state) => ({
        pods: state.pods.map((p) => (p.name === name ? pod : p)),
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch pod' 
      });
    }
  },

  createPod: async (name, image) => {
    set({ loading: true, error: null });
    try {
      const pod = await podApi.createPod({ name, image });
      set((state) => ({ 
        pods: [...state.pods, pod],
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create pod',
        loading: false 
      });
    }
  },

  deletePod: async (name) => {
    set({ loading: true, error: null });
    try {
      await podApi.deletePod(name);
      set((state) => ({
        pods: state.pods.filter((p) => p.name !== name),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete pod',
        loading: false 
      });
    }
  },

  updatePod: (pod) => {
    set((state) => ({
      pods: state.pods.map((p) => (p.name === pod.name ? pod : p)),
    }));
  },

  allocateGameServer: async (name: string) => {
    set({ loading: true, error: null });
    try {
      const gameServer = await podApi.allocateGameServer({ name });
      set((state) => ({ allocatedGameServers: [...state.allocatedGameServers, gameServer], loading: false }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to allocate game server',
        loading: false 
      });
    }
  },

  deployGameServer: async (name: string, version: string, cpuResource: string, memoryResource: string, label: string) => {
    set({ loading: true, error: null });
    try {
      // fixme: 异步不等待
      podApi.deployGameServer({ name, version, cpuResource, memoryResource, label });
      set({loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to allocate game server',
        loading: false
      });
    }
  },

  fetchAllGameServers: async (status: string) => {
    set({ loading: false, error: null });
    try {
      const gameServers = await podApi.listGameServers({ status });
      set({ allocatedGameServers: gameServers || [], loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch game servers',
        loading: false 
      });
    }
  },

  deleteAllocatedGameServer: async (name: string) => {
    set({ loading: true, error: null });
    try {
      await podApi.deleteAllocatedGameServer(name);
      set((state) => ({ allocatedGameServers: state.allocatedGameServers?.filter((gs) => gs.name !== name) || [], loading: false }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete game server',
        loading: false 
      });
    }
  },


  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
