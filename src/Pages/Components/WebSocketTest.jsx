import { useEffect, useState } from "react";
import echo from "../../Services/echo";

export default function WebSocketTest() {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Verify initial state
        const initialState = echo.connector.pusher.connection.state;
        setConnected(initialState === 'connected');
        console.log('Initial state:', initialState);

        // Subscribe to channel
        const channel = echo.channel('test-channel')

        // Listen to event
        channel.listen('TestEvent', (data) => {
            console.log('Data received: ', data)
            setMessages(prev => [...prev, {
                message: data.message,
                time: new Date().toLocaleTimeString()
            }])
        })

        // Monitor connection
        echo.connector.pusher.connection.bind('state_change', (states) => {
            console.log('Cambio de estado:', states.current);
            setConnected(states.current === 'connected');
        });

        echo.connector.pusher.connection.bind('connected', () => {
            console.log('Connected to WebSocker')
            setConnected(true)
        })

        echo.connector.pusher.connection.bind('disconnected', () => {
            console.log('Disconnected from WebSocker')
            setConnected(false)
        })

        // Cleanup
        return () => {
            echo.leaveChannel('test-channel')
        }
    }, [])

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>WebSocket Test</h1>
            
            <div style={{ 
                padding: '10px', 
                marginBottom: '20px',
                backgroundColor: connected ? '#d4edda' : '#f8d7da',
                border: `1px solid ${connected ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '5px'
            }}>
                State: {connected ? 'Connected' : 'Disconnected'}
            </div>

            <div style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '5px',
                marginBottom: '20px'
            }}>
                <h3>To test:</h3>
                <p>Run in Laravel Tinker:</p>
                <code style={{
                    display: 'block',
                    padding: '10px',
                    backgroundColor: '#2d2d2d',
                    color: '#a9dc76',
                    borderRadius: '3px',
                    overflow: 'auto'
                }}>
                    event(new App\Events\TestEvent());
                </code>
            </div>

            <h2>Received messages: ({messages.length})</h2>
            
            {messages.length === 0 ? (
                <p style={{ color: '#999' }}>
                    Waiting for messages from Laravel...
                </p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {messages.map((msg, index) => (
                        <li key={index} style={{
                            padding: '10px',
                            marginBottom: '10px',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '5px'
                        }}>
                            <strong>{msg.message}</strong>
                            <br />
                            <small style={{ color: '#666' }}>{msg.time}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}