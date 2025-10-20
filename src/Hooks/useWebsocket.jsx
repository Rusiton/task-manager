import { useEffect, useState, useCallback, useRef } from 'react';
import echo from "../Services/echo";

/**
 * Custom hook to handle WebSockets with Laravel Echo
 * 
 * @param {string} channelName - Channel name (ex: 'board.1')
 * @param {Object} eventHandlers - Objects with events and their handlers
 * @returns {Object} - Connection state and util functions
 * 
 * Use example:
 * const { connected, channel } = useWebSocket('board.1', {
 *   'task.created': (data) => console.log('New task', data),
 *   'task.updated': (data) => console.log('Task updated', data),
 * });
 */
export default function useWebsocket(channelName, eventHandlers = {}) {
  const [connected, setConnected] = useState(false);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!channelName) return;

    // Verify initial state
    const initialState = echo.connector.pusher.connection.state;
    setConnected(initialState === 'connected');

    // Subscribe to channel
    const channel = echo.channel(channelName);
    channelRef.current = channel;

    // Register listeners for each event
    Object.entries(eventHandlers).forEach(([eventName, handler]) => {
      channel.listen(`.${eventName}`, (data) => {
        handler(data);
      });
    });

    // Monitor connection state changes
    const handleStateChange = (states) => {
      setConnected(states.current === 'connected');
    };

    const handleConnected = () => {
      setConnected(true);
    };

    const handleDisconnected = () => {
      setConnected(false);
    };

    echo.connector.pusher.connection.bind('state_change', handleStateChange);
    echo.connector.pusher.connection.bind('connected', handleConnected);
    echo.connector.pusher.connection.bind('disconnected', handleDisconnected);

    // Cleanup
    return () => {
      // Remove event listeners
      Object.keys(eventHandlers).forEach(eventName => {
        channel.stopListening(`.${eventName}`);
      });
      
      echo.leaveChannel(channelName);
      
      echo.connector.pusher.connection.unbind('state_change', handleStateChange);
      echo.connector.pusher.connection.unbind('connected', handleConnected);
      echo.connector.pusher.connection.unbind('disconnected', handleDisconnected);
    };
  }, [channelName]);

  const reconnect = useCallback(() => {
    echo.connector.pusher.connection.connect();
  }, []);

  const disconnect = useCallback(() => {
    echo.connector.pusher.connection.disconnect();
  }, []);

  return {
    connected,
    channel: channelRef.current,
    reconnect,
    disconnect,
  };
}
