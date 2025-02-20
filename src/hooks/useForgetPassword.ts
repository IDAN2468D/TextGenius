import { useReducer } from 'react';
import useAuth from './useAuth';

type ActionType = 
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_EMAIL_ERROR'; payload: string }
  | { type: 'SET_OLD_PASSWORD'; payload: string }
  | { type: 'SET_OLD_PASSWORD_ERROR'; payload: string }
  | { type: 'SET_NEW_PASSWORD'; payload: string }
  | { type: 'SET_NEW_PASSWORD_ERROR'; payload: string }
  | { type: 'RESET_ERRORS' }
  | { type: 'SET_LOADING'; payload: boolean };

interface ForgetPasswordState {
  email: string;
  oldPassword: string;
  newPassword: string;
  emailError: string;
  oldPasswordError: string;
  newPasswordError: string;
  isLoading: boolean;
}

const forgetPasswordReducer = (state: ForgetPasswordState, action: ActionType): ForgetPasswordState => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_EMAIL_ERROR':
      return { ...state, emailError: action.payload };
    case 'SET_OLD_PASSWORD':
      return { ...state, oldPassword: action.payload };
    case 'SET_OLD_PASSWORD_ERROR':
      return { ...state, oldPasswordError: action.payload };
    case 'SET_NEW_PASSWORD':
      return { ...state, newPassword: action.payload };
    case 'SET_NEW_PASSWORD_ERROR':
      return { ...state, newPasswordError: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'RESET_ERRORS':
      return { ...state, emailError: '', oldPasswordError: '', newPasswordError: '' };
    default:
      return state;
  }
};

const useForgetPassword = () => {
  const { updatePassword, token } = useAuth();
  const [state, dispatch] = useReducer(forgetPasswordReducer, {
    email: '',
    oldPassword: '',
    newPassword: '',
    emailError: '',
    oldPasswordError: '',
    newPasswordError: '',
    isLoading: false,
  });

  const handleForgetPassword = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'RESET_ERRORS' });

    if (!state.email) {
      dispatch({ type: 'SET_EMAIL_ERROR', payload: 'Email is required' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    if (!state.oldPassword) {
      dispatch({ type: 'SET_OLD_PASSWORD_ERROR', payload: 'Old password is required' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    if (!state.newPassword) {
      dispatch({ type: 'SET_NEW_PASSWORD_ERROR', payload: 'New password is required' });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    try {
      if (!token) {
        throw new Error('Authentication token is missing');
      }
      
      await updatePassword(state.email, state.oldPassword, state.newPassword, token);
    } catch (err) {
      console.error('Error updating password:', err);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return {
    email: state.email,
    oldPassword: state.oldPassword,
    newPassword: state.newPassword,
    emailError: state.emailError,
    oldPasswordError: state.oldPasswordError,
    newPasswordError: state.newPasswordError,
    isLoading: state.isLoading,
    setEmail: (email: string) => dispatch({ type: 'SET_EMAIL', payload: email }),
    setOldPassword: (password: string) => dispatch({ type: 'SET_OLD_PASSWORD', payload: password }),
    setNewPassword: (password: string) => dispatch({ type: 'SET_NEW_PASSWORD', payload: password }),
    handleForgetPassword,
  };
};

export default useForgetPassword;