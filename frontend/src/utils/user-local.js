const user = 'USER';
export const setUser = (data) => localStorage.setItem(user, JSON.stringify(data));
export const getUser = () => JSON.parse(localStorage.getItem(user));
export const removeUser = () => localStorage.removeItem(user);

const token = 'TOKEN';
export const setToken = (data) => localStorage.setItem(token, data);
export const getToken = () => localStorage.getItem(token);
export const removeToken = () => localStorage.removeItem(token);
