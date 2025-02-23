import { useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import { withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

// Initial state
const initialState = {
  conversation: [],
  loading: false,
  error: '',
};

// Reducer function
function chatReducer(state, action) {
  switch (action.type) {
    case 'SEND_MESSAGE':
      return {
        ...state,
        loading: true,
        error: '',
      };
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        loading: false,
        conversation: [
          ...state.conversation,
          { role: 'user', content: action.payload.userMessage },
          { role: 'bot', content: action.payload.botMessage },
        ],
      };
    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

// Custom Hook with state and animation logic
export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const [message, setMessage] = useState('');

  // Shared animation values
  const colorAnim = useSharedValue(0); // 0 = light color, 1 = dark color
  const borderAnim = useSharedValue(0); // 0 = light border, 1 = dark border

  // Trigger animations when the hook is used
  useEffect(() => {
    colorAnim.value = withTiming(1, { duration: 500 });
    borderAnim.value = withTiming(1, { duration: 500 });
  }, []);

  // Animated style for text
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: colorAnim.value === 0 ? 'gray' : 'blue',
      fontSize: colorAnim.value === 0 ? 14 : 18,
    };
  });

  // Animated style for input border
  const animatedBorderStyle = useAnimatedStyle(() => {
    return {
      borderColor: borderAnim.value === 0 ? '#ccc' : '#4CAF50',
    };
  });

  // Function to send a message
  const sendMessage = async (message) => {
    if (!message) return;

    dispatch({ type: 'SEND_MESSAGE' });

    try {
      const result = await axios.post('https://gemini-api-production-e6a2.up.railway.app/api/gemini/bot-response', {
        prompt: message,
      });

      dispatch({
        type: 'RECEIVE_MESSAGE',
        payload: {
          userMessage: message,
          botMessage: result.data.response,
        },
      });
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: '❌ Failed to get response',
      });
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };


  return {
    state,
    message,
    handleSend,
    setMessage,
    animatedTextStyle,
    animatedBorderStyle,
  };
}
