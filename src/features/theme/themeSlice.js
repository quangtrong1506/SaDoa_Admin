import { createSlice } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
    name: 'theme',
    initialState: 'light',
    reducers: {
        setTheme: (_state, action) => {
            if (action.payload === 'light' || action.payload === 'dark') return action.payload;
            else return 'light';
        },
    },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
