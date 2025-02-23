import { useReducer } from "react";
import { launchImageLibrary } from "react-native-image-picker"; 

const actionTypes = {
    SET_TEXT: "SET_TEXT",
    SET_IMAGE: "SET_IMAGE",
    SET_LOADING: "SET_LOADING",
    SET_ERROR: "SET_ERROR",
    SET_RESULT: "SET_RESULT",
};

const formReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_TEXT:
            return { ...state, text: action.payload };
        case actionTypes.SET_IMAGE:
            return { ...state, imageUri: action.payload.uri, imageData: action.payload.data };
        case actionTypes.SET_LOADING:
            return { ...state, loading: action.payload };
        case actionTypes.SET_ERROR:
            return { ...state, error: action.payload };
        case actionTypes.SET_RESULT:
            return { ...state, result: action.payload };
        default:
            return state;
    }
};

export const useMultimodalForm = () => {
    const [state, dispatch] = useReducer(formReducer, {
        text: "",
        imageUri: null,
        imageData: null,
        loading: false,
        error: null,
        result: null,
    });

    const handleTextChange = (newText) => {
        dispatch({ type: actionTypes.SET_TEXT, payload: newText });
    };

    const setImage = (uri, data) => {
        dispatch({ type: actionTypes.SET_IMAGE, payload: { uri, data } });
    };

    const handleSubmit = async () => {
        dispatch({ type: actionTypes.SET_LOADING, payload: true });
        dispatch({ type: actionTypes.SET_ERROR, payload: null });
        dispatch({ type: actionTypes.SET_RESULT, payload: null });

        const formData = new FormData();
        formData.append("text", state.text);
        if (state.imageData) {
            formData.append("image", {
                uri: state.imageUri,
                type: "image/jpeg",
                name: "image.jpg",
            });
        }

        try {
            const response = await fetch("https://gemini-api-production-e6a2.up.railway.app/api/gemini/multimodal", {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = await response.json();
            dispatch({ type: actionTypes.SET_RESULT, payload: data.analysis });
        } catch (err) {
            dispatch({ type: actionTypes.SET_ERROR, payload: "There was an error with the request. Please try again." });
            console.error("Error:", err);
        } finally {
            dispatch({ type: actionTypes.SET_LOADING, payload: false });
        }
    };

    const handleImageSelection = () => {
        launchImageLibrary(
                {
                    mediaType: "photo",
                    includeBase64: false, 
                    quality: 1, 
                    maxWidth: 800, 
                    maxHeight: 800,
                },
                (response) => {
                    if (response.didCancel) {
                        console.log("User cancelled image picker");
                    } else if (response.errorCode) {
                        console.log("ImagePicker Error: ", response.errorMessage);
                    } else if (response.assets && response.assets[0]) {
                        const { uri } = response.assets[0];
                        setImage(uri, response.assets); // הגדרת תמונה
                    } else {
                        console.log("No assets found.");
                    }
                }
            );
    };

    return {
        ...state,
        handleTextChange,
        setImage,
        handleSubmit,
        handleImageSelection
    };
};