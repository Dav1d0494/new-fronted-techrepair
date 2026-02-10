import { useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

/**
 * Hook para sincronización offline
 * Almacena datos pendientes y los sincroniza cuando hay conexión
 */
export function useOfflineSync() {
  const [pendingData, setPendingData, removePendingData] = useLocalStorage('offline_sync', [])
  const [isSyncing, setIsSyncing] = useState(false)

  const addPendingData = useCallback(
    (data) => {
      setPendingData([
        ...pendingData,
        {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...data,
        },
      ])
    },
    [pendingData, setPendingData]
  )

  const removePendingItem = useCallback(
    (itemId) => {
      setPendingData(pendingData.filter(item => item.id !== itemId))
    },
    [pendingData, setPendingData]
  )

  const clearPendingData = useCallback(() => {
    removePendingData()
  }, [removePendingData])

  const syncData = useCallback(async (syncFn) => {
    if (pendingData.length === 0) return true

    setIsSyncing(true)
    try {
      for (const item of pendingData) {
        await syncFn(item)
        removePendingItem(item.id)
      }
      return true
    } catch (error) {
      console.error('Error syncing data:', error)
      return false
    } finally {
      setIsSyncing(false)
    }
  }, [pendingData, removePendingItem])

  return {
    pendingData,
    isSyncing,
    addPendingData,
    removePendingItem,
    clearPendingData,
    syncData,
  }
}
