import React from 'react';
import Button from '@mui/material/Button';
import { SxProps, Theme } from '@mui/material/styles';

interface CustomButtonProps {
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    onClick?: () => void;
    children: React.ReactNode;
    sx?: SxProps<Theme>;
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    disabled?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    variant = 'contained',
    color = 'primary',
    onClick,
    children,
    sx = {},
    size = 'medium',
    fullWidth = false,
    disabled = false,
    startIcon,
    endIcon,
}) => {
    return (
        <Button
            variant={variant}
            color={color}
            onClick={onClick}
            size={size}
            fullWidth={fullWidth}
            disabled={disabled}
            startIcon={startIcon}
            endIcon={endIcon}
            sx={{
                bgcolor: color === 'primary' ? '#290854' : '',
                padding: '10px 25px',
                borderRadius: '50px',
                textTransform: 'capitalize',
                fontSize: '1rem',
                boxShadow: 0,
                '&:hover': {
                    bgcolor: color === 'primary' ? '#290854' : '',
                },
                ...sx
            }}
        >
            {children}
        </Button>
    );
};

export default CustomButton;