import { useCallback, useEffect } from 'react'
import useAtelierStore from '../store/useAtelierStore'
import * as historyService from '../services/historyService'

export default function useHistory() {
  const {
    history,
    setHistory,
    addToHistory,
    setConfig,
    setSegment,
    setCurrentSpecs,
    setCurrentPrompt,
    setSourcingMode,
  } = useAtelierStore()

  // Load history from localStorage on mount
  useEffect(() => {
    setHistory(historyService.getAll())
  }, [setHistory])

  const save = useCallback((entry) => {
    const created = historyService.create(entry)
    addToHistory(created)
    return created
  }, [addToHistory])

  const remove = useCallback((id) => {
    historyService.remove(id)
    setHistory(historyService.getAll())
  }, [setHistory])

  const clearAll = useCallback(() => {
    historyService.clearAll()
    setHistory([])
  }, [setHistory])

  const getRecent = useCallback((n = 5) => {
    return history.slice(0, n)
  }, [history])

  const loadEntry = useCallback((entry) => {
    if (entry.config) {
      const { segment, ...rest } = entry.config
      if (segment) setSegment(segment)
      setConfig(rest)
    }
    if (entry.enrichment) setCurrentSpecs(entry.enrichment)
    if (entry.prompt) setCurrentPrompt(entry.prompt)
    if (entry.sourcingMode) setSourcingMode(entry.sourcingMode)
  }, [setSegment, setConfig, setCurrentSpecs, setCurrentPrompt, setSourcingMode])

  return { history, save, remove, clearAll, getRecent, loadEntry }
}
