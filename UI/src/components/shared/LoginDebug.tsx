import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

const LoginDebug: React.FC = () => {
    const [debugInfo, setDebugInfo] = useState<any>({
        accessToken: null,
        allKeys: [],
        tokenLength: 0,
        timestamp: ''
    });

    useEffect(() => {
        const updateDebugInfo = () => {
            setDebugInfo({
                accessToken: localStorage.getItem('accessToken'),
                allKeys: Object.keys(localStorage),
                tokenLength: localStorage.getItem('accessToken')?.length || 0,
                timestamp: new Date().toLocaleTimeString()
            });
        };

        updateDebugInfo();
        const interval = setInterval(updateDebugInfo, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleTestLogin = () => {
        // Test with common credentials
        const testCredentials = [
            { email: 'joshichinmay775@gmail.com', password: 'yourpassword' },
            { email: 'admin@example.com', password: 'admin123' },
            { email: 'test@example.com', password: 'test123' },
            { email: 'user@example.com', password: 'user123' }
        ];
        
        console.log('Try these test credentials:');
        testCredentials.forEach((cred, index) => {
            console.log(`${index + 1}. Email: ${cred.email}, Password: ${cred.password}`);
        });
    };

    const handleCheckLocalStorage = () => {
        console.log('Current localStorage:', {
            accessToken: localStorage.getItem('accessToken'),
            allKeys: Object.keys(localStorage),
            tokenDecoded: localStorage.getItem('accessToken') ? 'Token exists' : 'No token'
        });
    };

    const handleClearStorage = () => {
        localStorage.clear();
        console.log('LocalStorage cleared');
        window.location.reload();
    };

    return (
        <Box sx={{ 
            position: 'fixed', 
            bottom: 20, 
            left: 20, 
            backgroundColor: 'black', 
            color: 'white', 
            padding: 2, 
            borderRadius: 1,
            fontSize: '12px',
            maxWidth: 350,
            zIndex: 9999
        }}>
            <Typography variant="h6" sx={{ fontSize: '14px', mb: 1 }}>
                Login Debug
            </Typography>
            
            <Box sx={{ fontSize: '10px', mb: 2 }}>
                <div>Token: {debugInfo.accessToken ? '✅ Present' : '❌ Missing'}</div>
                <div>Length: {debugInfo.tokenLength} chars</div>
                <div>Keys: {debugInfo.allKeys ? debugInfo.allKeys.join(', ') : 'Loading...'}</div>
                <div>Time: {debugInfo.timestamp}</div>
            </Box>
            
            <Button 
                variant="contained" 
                size="small" 
                onClick={handleTestLogin}
                sx={{ mb: 1, fontSize: '11px', width: '100%' }}
            >
                Show Test Credentials
            </Button>
            <Button 
                variant="contained" 
                size="small" 
                onClick={handleCheckLocalStorage}
                sx={{ mb: 1, fontSize: '11px', width: '100%' }}
            >
                Check LocalStorage
            </Button>
            <Button 
                variant="contained" 
                size="small" 
                onClick={handleClearStorage}
                sx={{ fontSize: '11px', width: '100%' }}
            >
                Clear Storage & Reload
            </Button>
        </Box>
    );
};

export default LoginDebug;
