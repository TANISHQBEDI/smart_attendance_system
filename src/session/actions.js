export const loginSuccess = (userData) => ({
    type: 'LOGIN_SUCCESS',
    payload: userData,
});

export const logout = () => ({
    type: 'LOGOUT',
});
