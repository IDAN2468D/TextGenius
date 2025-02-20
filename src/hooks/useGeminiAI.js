import { useReducer } from 'react';
import axios from 'axios';

// Initial State
const initialState = {
    prompt: '',
    response: '',
    image: null,
    imageAnalysis: '',
    loading: false,
    error: '',
};

// Action Types
const actionTypes = {
    SET_PROMPT: 'SET_PROMPT',
    SET_RESPONSE: 'SET_RESPONSE',
    SET_IMAGE: 'SET_IMAGE',
    SET_IMAGE_ANALYSIS: 'SET_IMAGE_ANALYSIS',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
};

// Reducer function
const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_PROMPT:
            return { ...state, prompt: action.payload };
        case actionTypes.SET_RESPONSE:
            return { ...state, response: action.payload };
        case actionTypes.SET_IMAGE:
            return { ...state, image: action.payload };
        case actionTypes.SET_IMAGE_ANALYSIS:
            console.log('Setting image analysis:', action.payload);  
            return { ...state, imageAnalysis: action.payload.description }; 
        case actionTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        case actionTypes.SET_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

// Custom Hook
const useGeminiAI = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Handle input change
    const handlePromptChange = (text) => {
        dispatch({ type: actionTypes.SET_PROMPT, payload: text });
    };

    // Handle image selection
    const handleImageChange = (selectedImage) => {
        console.log('Selected image:', selectedImage);
        // Log the type of image
        console.log('Image type:', selectedImage.type);
        dispatch({ type: actionTypes.SET_IMAGE, payload: selectedImage });
    };
    
    // Handle text generation
    const handleSubmit = async () => {
        if (!state.prompt.trim()) {
            dispatch({ type: actionTypes.SET_ERROR, payload: 'Prompt is required' });
            return;
        }

        dispatch({ type: actionTypes.SET_ERROR, payload: '' });
        dispatch({ type: actionTypes.SET_LOADING, payload: true });

        try {
            const { data } = await axios.post('http://192.168.1.199:5000/api/gemini/generate', { prompt: state.prompt });
            dispatch({ type: actionTypes.SET_RESPONSE, payload: data.text });
        } catch (err) {
            dispatch({ type: actionTypes.SET_ERROR, payload: err.response?.data?.error || 'Error processing the request' });
        } finally {
            dispatch({ type: actionTypes.SET_LOADING, payload: false });
        }
    };

    // Handle image analysis
    const handleImageAnalysis = async () => {
        if (!state.image) {
            dispatch({ type: actionTypes.SET_ERROR, payload: 'Image is required' });
            return;
        }
    
        dispatch({ type: actionTypes.SET_ERROR, payload: '' });
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
    
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: state.image.uri,
                type: 'image/jpeg',
                name: state.image.fileName,
            });
    
            // Log the formData content
            console.log('FormData being sent:', formData);
    
            const { data } = await axios.post('http://192.168.1.199:5000/api/gemini/analyze-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
    
            console.log('Image analysis response:', data);
            dispatch({ type: actionTypes.SET_IMAGE_ANALYSIS, payload: data });
        } catch (err) {
            console.error('Error processing image:', err.response?.data?.error || err.message);
            dispatch({ type: actionTypes.SET_ERROR, payload: err.response?.data?.error || 'Error processing image' });
        } finally {
            dispatch({ type: actionTypes.SET_LOADING, payload: false });
        }
    };
    
    return {
        state,
        handlePromptChange,
        handleSubmit,
        handleImageChange,
        handleImageAnalysis,
    };
};

export default useGeminiAI;