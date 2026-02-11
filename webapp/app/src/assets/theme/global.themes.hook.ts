import {createTheme} from "@mui/material";

export const synthwaveLightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#5e35b1', // Viola profondo (WCAG AA compliant su sfondo chiaro)
            contrastText: '#fff',
        },
        secondary: {
            main: '#0097a7', // Ciano/Teal scuro (migliore contrasto)
        },
        background: {
            default: '#f5f5f5', // Grigio molto chiaro
            paper: '#ffffff',   // Bianco puro per card
        },
        text: {
            primary: '#212121', // Quasi nero (contrasto massimo)
            secondary: '#424242', // Grigio scuro
        },
        error: {
            main: '#c62828', // Rosso scuro WCAG compliant
        },
        warning: {
            main: '#f57f17', // Arancione scuro
        },
        info: {
            main: '#0277bd', // Blu scuro
        },
        success: {
            main: '#00695c', // Verde scuro
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(94, 53, 177, 0.15)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px 0 rgba(94, 53, 177, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 12px 48px 0 rgba(94, 53, 177, 0.15)',
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                },
                contained: {
                    background: 'linear-gradient(135deg, #5e35b1 0%, #0097a7 100%)',
                    color: '#fff',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(94, 53, 177, 0.3)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
                outlined: {
                    borderColor: '#5e35b1',
                    color: '#5e35b1',
                    '&:hover': {
                        backgroundColor: '#5e35b1',
                        color: '#fff',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(94, 53, 177, 0.3)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderColor: 'rgba(94, 53, 177, 0.5)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                            borderColor: '#5e35b1',
                            boxShadow: '0 0 0 3px rgba(94, 53, 177, 0.1)',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: '#212121',
                        fontSize: '0.95rem',
                        '&::placeholder': {
                            opacity: 0.5,
                            color: '#424242',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#424242',
                        fontSize: '0.9rem',
                        '&.Mui-focused': {
                            color: '#5e35b1',
                        },
                    },
                    '& .MuiFormHelperText-root': {
                        fontSize: '0.8rem',
                        marginTop: '4px',
                        color: '#c62828',
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: 'rgba(94, 53, 177, 0.4)',
                    '&.Mui-checked': {
                        color: '#5e35b1',
                    },
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontSize: '0.8rem',
                    color: '#c62828',
                },
            },
        },
    },
});

export const synthwaveDarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#bb86fc', // Viola claro (WCAG AA 4.5:1 su dark)
            contrastText: '#000000',
        },
        secondary: {
            main: '#03dac6', // Ciano brillante
            contrastText: '#000000',
        },
        background: {
            default: '#121212', // Nero puro (OLED friendly)
            paper: '#1e1e1e',   // Grigio molto scuro
        },
        text: {
            primary: '#ffffff', // Bianco puro (contrasto massimo)
            secondary: '#b0bec5', // Grigio chiaro
        },
        error: {
            main: '#ff6b6b', // Rosso chiaro (WCAG AA su dark)
        },
        warning: {
            main: '#ffa726', // Arancione chiaro
        },
        info: {
            main: '#42a5f5', // Blu chiaro
        },
        success: {
            main: '#66bb6a', // Verde chiaro
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(30, 30, 30, 0.9)',
                    border: '1px solid rgba(187, 134, 252, 0.25)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px 0 rgba(187, 134, 252, 0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 12px 48px 0 rgba(187, 134, 252, 0.25)',
                        transform: 'translateY(-4px)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '12px',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                },
                contained: {
                    background: 'linear-gradient(135deg, #bb86fc 0%, #03dac6 100%)',
                    color: '#000000',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(187, 134, 252, 0.5)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
                outlined: {
                    borderColor: '#bb86fc',
                    color: '#bb86fc',
                    '&:hover': {
                        backgroundColor: 'rgba(187, 134, 252, 0.15)',
                        borderColor: '#bb86fc',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(187, 134, 252, 0.35)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.18)',
                            borderColor: 'rgba(187, 134, 252, 0.6)',
                        },
                        '&.Mui-focused': {
                            backgroundColor: 'rgba(255, 255, 255, 0.22)',
                            borderColor: '#bb86fc',
                            boxShadow: '0 0 0 3px rgba(187, 134, 252, 0.2)',
                        },
                    },
                    '& .MuiInputBase-input': {
                        color: '#ffffff',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        '&::placeholder': {
                            opacity: 0.6,
                            color: '#b0bec5',
                            fontWeight: 400,
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#b0bec5',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        '&.Mui-focused': {
                            color: '#bb86fc',
                        },
                    },
                    '& .MuiFormHelperText-root': {
                        fontSize: '0.8rem',
                        marginTop: '4px',
                        color: '#ff6b6b',
                        fontWeight: 500,
                    },
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: 'rgba(187, 134, 252, 0.4)',
                    '&.Mui-checked': {
                        color: '#bb86fc',
                    },
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontSize: '0.8rem',
                    color: '#ff6b6b',
                },
            },
        },
    },
});

export const metalMontaggiTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#004d73', // Blu acciaio profondo
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#666666', // Grigio neutro
        },
        background: {
            default: '#f0f0f0', // Grigio leggero
            paper: '#ffffff',   // Bianco
        },
        text: {
            primary: '#212121', // Quasi nero
            secondary: '#424242', // Grigio scuro
        },
        error: {
            main: '#c62828',
        },
        warning: {
            main: '#f57f17',
        },
        info: {
            main: '#0277bd',
        },
        success: {
            main: '#00695c',
        },
    },
});


