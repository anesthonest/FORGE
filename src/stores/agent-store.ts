import { create } from 'zustand';

/**
 * @fileOverview Forge OS Agent Mesh Store
 * Manages distributed agent pools and active reasoning chains.
 */

interface AgentState {
  activeCount: number;
  totalTasks: number;
  recentLogs: any[];
  setMetrics: (active: number, tasks: number) => void;
  addLog: (log: any) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  activeCount: 0,
  totalTasks: 0,
  recentLogs: [],
  setMetrics: (activeCount, totalTasks) => {
    set({ activeCount, totalTasks });
  },
  addLog: (log) => set((state) => ({ 
    recentLogs: [log, ...state.recentLogs].slice(0, 10) 
  })),
}));
