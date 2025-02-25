import { useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuth from '../hooks/useAuth';

// Types for the possible actions
type ActionType =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'TOGGLE_PASSWORD_VISIBILITY'; payload: 'password' | 'confirmPassword' }
  | { type: 'RESET_ERRORS' }
  | { type: 'SET_EMAIL_ERROR'; payload: string }
  | { type: 'SET_PASSWORD_ERROR'; payload: string };

// Initial state structure
interface LoginState {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  passwordSecureText: boolean;
  confirmPasswordSecureText: boolean;
}

// Reducer function for state management
const loginReducer = (state: LoginState, action: ActionType): LoginState => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'TOGGLE_PASSWORD_VISIBILITY':
      return action.payload === 'password'
        ? { ...state, passwordSecureText: !state.passwordSecureText }
        : { ...state, confirmPasswordSecureText: !state.confirmPasswordSecureText };
    case 'RESET_ERRORS':
      return { ...state, emailError: '', passwordError: '' };
    case 'SET_EMAIL_ERROR':
      return { ...state, emailError: action.payload };
    case 'SET_PASSWORD_ERROR':
      return { ...state, passwordError: action.payload };
    default:
      return state;
  }
};

// Custom Hook for managing the form
const useLoginForm = () => {
  const { login, loading, error } = useAuth();

  const [state, dispatch] = useReducer(loginReducer, {
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    passwordSecureText: true,
    confirmPasswordSecureText: true,
  });

  // פונקציה לשמירת פרטי ההתחברות ב-AsyncStorage
  const saveLoginData = async (email: string, password: string) => {
    try {
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('password', password);
      console.log('Login data saved!');
    } catch (error) {
      console.error('Failed to save login data:', error);
    }
  };

  // פונקציה לשליפת פרטי התחברות מ-AsyncStorage
  const getLoginData = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const password = await AsyncStorage.getItem('password');
      if (email && password) {
        dispatch({ type: 'SET_EMAIL', payload: email });
        dispatch({ type: 'SET_PASSWORD', payload: password });
        console.log('Login data retrieved:', email, password);
        await login(email, password); 
      } else {
        console.log('No login data found');
      }
    } catch (error) {
      console.error('Failed to retrieve login data:', error);
    }
  };

  useEffect(() => {
    getLoginData();
  }, []);

  const handleLogin = async () => {
    dispatch({ type: 'RESET_ERRORS' });

    if (!state.email) {
      dispatch({ type: 'SET_EMAIL_ERROR', payload: 'Email is required' });
    }
    if (!state.password) {
      dispatch({ type: 'SET_PASSWORD_ERROR', payload: 'Password is required' });
    }

    if (!state.email || !state.password) return;

    try {
      await login(state.email, state.password);
      saveLoginData(state.email, state.password); // שמירת נתוני התחברות
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        if (err.message.includes('email')) {
          dispatch({ type: 'SET_EMAIL_ERROR', payload: err.message });
        } else {
          dispatch({ type: 'SET_PASSWORD_ERROR', payload: err.message });
        }
      } else {
        dispatch({ type: 'SET_PASSWORD_ERROR', payload: 'An unknown error occurred' });
      }
    }
  };

  return {
    email: state.email,
    setEmail: (email: string) => dispatch({ type: 'SET_EMAIL', payload: email }),
    password: state.password,
    setPassword: (password: string) => dispatch({ type: 'SET_PASSWORD', payload: password }),
    emailError: state.emailError,
    passwordError: state.passwordError,
    passwordSecureText: state.passwordSecureText,
    confirmPasswordSecureText: state.confirmPasswordSecureText,
    togglePasswordVisibility: (field: 'password' | 'confirmPassword') =>
      dispatch({ type: 'TOGGLE_PASSWORD_VISIBILITY', payload: field }),
    handleLogin,
    loading,
    error,
  };
};

export default useLoginForm;
