import { useEffect, useMemo, useRef } from 'react';
import useWebsocket from './useWebsocket';

/**
 * Custom hook to handle board events.
 * 
 * @param {string} boardToken - Board's token
 * @param {Object} handlers - Custom handlers for each event
 * @returns {Object} - Connection state and functions
 * 
 * Use example:
 * const { connected } = useBoardWebSocket(boardId, {
 *   onListCreated: (data) => setLists(prev => [...prev, data.list]),
 *   onTaskCreated: (data) => addTaskToList(data.task),
 *   onTaskMoved: (data) => moveTask(data),
 * });
 */
export default function useBoardWebSocket(boardToken, handlers = {}) {
  const handlersRef = useRef(handlers)

  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  const eventHandlers = useMemo(() => ({
    'column.created': (data) => handlersRef.current.onListCreated?.(data),

    'column.updated': (data) => handlersRef.current.onListUpdated?.(data),
    
    'column.deleted': (data) => handlersRef.current.onListDeleted?.(data),
    
    'task.created': (data) => handlersRef.current.onTaskCreated?.(data),
    
    'task.updated': (data) => handlersRef.current.onTaskUpdated?.(data),

    'task.movedWithinColumn': (data) => handlersRef.current.onTaskMovedWithinColumn?.(data),

    'task.movedToColumn': (data) => handlersRef.current.onTaskMovedToColumn?.(data),

    'task.deleted': (data) => handlersRef.current.onTaskDeleted?.(data),
  }), [])

  const { connected, reconnect, disconnect } = useWebsocket(
    boardToken ? `board.${boardToken}` : null,
    eventHandlers
  );

  return {
    connected,
    reconnect,
    disconnect,
  };
}