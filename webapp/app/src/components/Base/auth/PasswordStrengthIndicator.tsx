import React from 'react';
import {Box, useTheme} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface PasswordStrengthIndicatorProps {
    password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
    const theme = useTheme();

    const requirements = [
        {
            label: 'Minimo 8 caratteri',
            met: password.length >= 8,
            regex: /.{8,}/
        },
        {
            label: 'Almeno una lettera maiuscola',
            met: /[A-Z]/.test(password),
            regex: /[A-Z]/
        },
        {
            label: 'Almeno un numero',
            met: /[0-9]/.test(password),
            regex: /[0-9]/
        },
        {
            label: 'Almeno un carattere speciale',
            met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
        }
    ];

    const metCount = requirements.filter(r => r.met).length;
    const strength = (metCount / requirements.length) * 100;

    const getStrengthLabel = () => {
        if (strength < 40) return 'Debole';
        if (strength < 70) return 'Media';
        return 'Forte';
    };

    const getStrengthColor = () => {
        if (strength < 40) return theme.palette.error.main;
        if (strength < 70) return theme.palette.warning.main;
        return theme.palette.success.main;
    };

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            {/* Strength Bar */}
            <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <span style={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
                        Forza password
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: getStrengthColor() }}>
                        {getStrengthLabel()}
                    </span>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            height: '100%',
                            width: `${strength}%`,
                            backgroundColor: getStrengthColor(),
                            transition: 'all 0.3s ease',
                        }}
                    />
                </Box>
            </Box>

            {/* Requirements List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                {requirements.map((req, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.8,
                            fontSize: '0.8rem',
                            color: req.met ? theme.palette.success.main : theme.palette.text.secondary,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        {req.met ? (
                            <CheckCircleIcon sx={{ fontSize: '1rem', color: theme.palette.success.main }} />
                        ) : (
                            <CancelIcon sx={{ fontSize: '1rem', color: theme.palette.text.disabled }} />
                        )}
                        {req.label}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default PasswordStrengthIndicator;

