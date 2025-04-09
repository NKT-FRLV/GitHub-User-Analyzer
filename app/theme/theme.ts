import { createTheme } from '@mui/material/styles';

// Добавляем кастомные типы в тему до создания темы
declare module '@mui/material/styles' {
  interface Palette {
    customPaper: {
      light: string;
      lightBg: string;
    };
  }
  interface PaletteOptions {
    customPaper?: {
      light?: string;
      lightBg?: string;
    };
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    light: true;
  }
}

// Создаем светлую тему для всего приложения
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#546E7A', // Элегантный тёмно-синий вместо серого
      light: '#78909C',
      dark: '#455A64',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#90A4AE', // Светло-синий вместо тёмно-серого
      light: '#B0BEC5',
      dark: '#78909C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F5F5', // Светло-серый фон
      paper: '#FFFFFF',   // Белый для карточек
    },
    error: {
      main: '#E57373', // Более яркий красный для светлой темы
    },
    warning: {
      main: '#FFB74D', // Более яркий жёлтый
    },
    info: {
      main: '#64B5F6', // Более яркий синий
    },
    success: {
      main: '#81C784', // Более яркий зелёный
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    // Кастомные цвета для тёмных карточек
    customPaper: {
      light: '#212121', // Тёмный вариант для карточек
      lightBg: '#333333', // Тёмный фон
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)',
          },
        },
        containedPrimary: {
          backgroundColor: '#546E7A', // Более элегантный цвет кнопки
          '&:hover': {
            backgroundColor: '#616161',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
      variants: [
        {
          props: { variant: 'light' },
          style: {
            backgroundColor: '#212121',
            color: '#FFFFFF',
          },
        },
      ],
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          position: 'relative',
          color: '#546E7A',
          transition: 'color 0.2s',
          '&:hover': {
            color: '#455A64',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '0',
            height: '1px',
            bottom: '-2px',
            left: '0',
            backgroundColor: '#455A64',
            transition: 'width 0.2s',
          },
          '&:hover::after': {
            width: '100%',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#546E7A',
          },
          '& .MuiInputBase-input': {
            '&:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 100px #F8F8F8 inset', // Более сдержанный цвет автозаполнения
              WebkitTextFillColor: '#333333',
            },
          },
        },
      },
    },
  },
});

export default theme; 