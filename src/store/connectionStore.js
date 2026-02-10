import { create } from 'zustand'

/**
 * Store de conexiones remotas con Zustand
 */
export const useConnectionStore = create((set) => ({
  connections: [],
  activeSession: null,
  isLoading: false,

  setConnections: (connections) => set({ connections }),

  addConnection: (connection) =>
    set((state) => ({
      connections: [...state.connections, connection],
    })),

  updateConnection: (id, updates) =>
    set((state) => ({
      connections: state.connections.map((conn) =>
        conn.id === id ? { ...conn, ...updates } : conn
      ),
    })),

  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((conn) => conn.id !== id),
    })),

  setActiveSession: (session) => set({ activeSession: session }),

  setLoading: (isLoading) => set({ isLoading }),

  clearConnections: () => set({ connections: [], activeSession: null }),
}))
