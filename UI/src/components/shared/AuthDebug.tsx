import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { getCurrentAccessToken, getUserId, isLoggedIn } from '../../services/axiosClient';
import { jwtDecode } from 'jwt-decode';

const AuthDebug: React.FC = () => {
    const [authInfo, setAuthInfo] = useState<any>({});

    useEffect(() => {
        const token = getCurrentAccessToken();
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setAuthInfo({
                    hasToken: true,
                    userId: getUserId(),
                    isLoggedIn: isLoggedIn(),
                    tokenExp: new Date(decoded.exp * 1000).toLocaleString(),
                    tokenIssued: new Date(decoded.iat * 1000).toLocaleString(),
                    decoded: decoded
                });
            } catch (error) {
                setAuthInfo({
                    hasToken: true,
                    error: 'Failed to decode token',
                    isLoggedIn: false
                });
            }
        } else {
            setAuthInfo({
                hasToken: false,
                isLoggedIn: false,
                userId: null
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <Box sx={{ 
            position: 'fixed', 
            bottom: 20, 
            right: 20, 
            backgroundColor: 'black', 
            color: 'white', 
            padding: 2, 
            borderRadius: 1,
            fontSize: '12px',
            maxWidth: 300,
            zIndex: 9999
        }}>
            <Typography variant="h6" sx={{ fontSize: '14px', mb: 1 }}>
                Auth Debug Info
            </Typography>
            <pre style={{ fontSize: '11px', margin: 0 }}>
                {JSON.stringify(authInfo, null, 2)}
            </pre>
            <Button 
                variant="contained" 
                size="small" 
                onClick={handleLogout}
                sx={{ mt: 1, fontSize: '11px' }}
            >
                Logout
            </Button>
        </Box>
    );
};

export default AuthDebug;
