import { useState, useEffect } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/StackScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  email: string;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadUserFromStorage = async () => {
      setLoading(true);
      try {
        const [storedToken, storedEmail] = await Promise.all([
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('email'),
        ]);
        if (storedToken && storedEmail) {
          setToken(storedToken);
          setUser({ email: storedEmail });
        }
      } catch (err) {
        console.error('Failed to load user from storage:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUserFromStorage();
  }, []);

  const handleAuthResponse = async (response: Response, email: string) => {
    const data = await response.json();
    if (response.ok) {
      const { token, username } = data.data || {};
      if (token) {
        setUser({ email });
        setToken(token);
        await Promise.all([
          AsyncStorage.setItem('userToken', token),
          AsyncStorage.setItem('email', email),
          username && AsyncStorage.setItem('username', username),
        ]);
        return true;
      }
    }
    throw new Error(data.message || 'Authentication failed.');
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://gemini-api-production-e6a2.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username }),
      });
      await handleAuthResponse(response, email);
      navigation.navigate('LogIn');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://gemini-api-production-e6a2.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (await handleAuthResponse(response, email)) {
        navigation.navigate('Home');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (
    email: string,
    oldPassword: string,
    newPassword: string,
    token: string
  ): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://gemini-api-production-e6a2.up.railway.app/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });
      const data = await response.json();
      return response.ok
        ? { success: true, message: 'Password updated successfully.' }
        : { success: false, message: data.message || 'An error occurred.' };
    } catch {
      return { success: false, message: 'Failed to update password. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (): Promise<void> => {
    if (!user || !token) {
      setError('User or token missing.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://gemini-api-production-e6a2.up.railway.app/api/auth/delete-user', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: user.email }),
      });

      if (response.ok) {
        await Promise.all([
          AsyncStorage.removeItem('userToken'),
          AsyncStorage.removeItem('email'),
        ]);
        setUser(null);
        setToken(null);
        navigation.navigate('LogIn');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete user.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    // Add a function to check if the email exists
    const checkEmailExists = async (email: string) => {
      try {
        const response = await fetch('https://gemini-api-production-e6a2.up.railway.app/api/auth/check-email', { 
          method: 'POST',
          body: JSON.stringify({ email }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const result = await response.json();
        if (result.exists) {
          return true;
        }
        return false;
      } catch (err) {
        console.error('Error checking email existence:', err);
        return false;
      }
    };
  

  return { user, token, loading, error, register, login, updatePassword, deleteUser, checkEmailExists };
};

export default useAuth;