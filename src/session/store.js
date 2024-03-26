import { createStore } from 'redux';

const initialState = {
    isLoggedIn: false, // Initial state for session flag
    userData: {},     // Store user data if needed
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return { ...state, isLoggedIn: true, userData: action.payload };
        case 'LOGOUT':
            return { ...state, isLoggedIn: false, userData: {} };
        default:
            return state;
    }
};

const store = createStore(reducer);

export default store;
