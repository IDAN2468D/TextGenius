import { useReducer } from 'react';
import useAuth from './useAuth';

type ActionType =
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_CONFIRM_PASSWORD'; payload: string }
  | { type: 'TOGGLE_PASSWORD_VISIBILITY'; payload: 'password' | 'confirmPassword' }
  | { type: 'SET_EMAIL_ERROR'; payload: string }
  | { type: 'SET_PASSWORD_ERROR'; payload: string }
  | { type: 'SET_CONFIRM_PASSWORD_ERROR'; payload: string }
  | { type: 'RESET_ERRORS' };

interface RegisterState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  passwordSecureText: boolean;
  confirmPasswordSecureText: boolean;
  emailError: string;
  passwordError: string;
  confirmPasswordError: string;
}

const registerReducer = (state: RegisterState, action: ActionType): RegisterState => {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_CONFIRM_PASSWORD':
      return { ...state, confirmPassword: action.payload };
    case 'TOGGLE_PASSWORD_VISIBILITY':
      return action.payload === 'password'
        ? { ...state, passwordSecureText: !state.passwordSecureText }
        : { ...state, confirmPasswordSecureText: !state.confirmPasswordSecureText };
    case 'SET_EMAIL_ERROR':
      return { ...state, emailError: action.payload };
    case 'SET_PASSWORD_ERROR':
      return { ...state, passwordError: action.payload };
    case 'SET_CONFIRM_PASSWORD_ERROR':
      return { ...state, confirmPasswordError: action.payload };
    case 'RESET_ERRORS':
      return { ...state, emailError: '', passwordError: '', confirmPasswordError: '' };
    default:
      return state;
  }
};

const useRegisterForm = () => {
  const { register } = useAuth();
  const [state, dispatch] = useReducer(registerReducer, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    passwordSecureText: true,
    confirmPasswordSecureText: true,
    emailError: '',
    passwordError: '',
    confirmPasswordError: '',
  });

  const handleRegister = async () => {
    dispatch({ type: 'RESET_ERRORS' });

    if (!state.username) {
      console.error('Username is required');
      return;
    }
    if (!state.email) {
      dispatch({ type: 'SET_EMAIL_ERROR', payload: 'Email is required' });
      return;
    }
    if (!state.password) {
      dispatch({ type: 'SET_PASSWORD_ERROR', payload: 'Password is required' });
      return;
    }
    if (state.password !== state.confirmPassword) {
      dispatch({ type: 'SET_CONFIRM_PASSWORD_ERROR', payload: 'Passwords do not match' });
      return;
    }

    try {
      await register(state.username, state.email, state.password);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return {
    username: state.username,
    email: state.email,
    password: state.password,
    confirmPassword: state.confirmPassword,
    passwordSecureText: state.passwordSecureText,
    confirmPasswordSecureText: state.confirmPasswordSecureText,
    emailError: state.emailError,
    passwordError: state.passwordError,
    confirmPasswordError: state.confirmPasswordError,
    setUsername: (username: string) => dispatch({ type: 'SET_USERNAME', payload: username }),
    setEmail: (email: string) => dispatch({ type: 'SET_EMAIL', payload: email }),
    setPassword: (password: string) => dispatch({ type: 'SET_PASSWORD', payload: password }),
    setConfirmPassword: (confirmPassword: string) =>
      dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: confirmPassword }),
    togglePasswordVisibility: (field: 'password' | 'confirmPassword') =>
      dispatch({ type: 'TOGGLE_PASSWORD_VISIBILITY', payload: field }),
    handleRegister,
  };
};

export default useRegisterForm;