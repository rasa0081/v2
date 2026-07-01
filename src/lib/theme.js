import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#5D4037',
      light: '#8B6F61',
      dark: '#3E2723',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#D4A574',
      light: '#E8C9A0',
      dark: '#B8864E',
      contrastText: '#3E2723',
    },
    background: {
      default: '#FDFBF7',
      paper: '#ffffff',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#6B6B6B',
    },
    divider: 'rgba(93, 64, 55, 0.08)',
    action: {
      hover: 'rgba(93, 64, 55, 0.06)',
      selected: 'rgba(93, 64, 55, 0.1)',
    },
  },
  typography: {
    fontFamily: "'IranYekan', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: 'clamp(1.8rem, 5vw, 3rem)',
      fontWeight: 900,
      color: '#3E2723',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
      fontWeight: 800,
      color: '#3E2723',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
      fontWeight: 700,
    },
    h5: {
      fontSize: 'clamp(1rem, 2vw, 1.2rem)',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '0.95rem',
      lineHeight: 1.8,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.85rem',
      lineHeight: 1.7,
      fontWeight: 400,
    },
    button: {
      fontWeight: 600,
      fontSize: '0.9rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '8px 20px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(93, 64, 55, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FDFBF7',
        },
      },
    },
  },
})

export default theme