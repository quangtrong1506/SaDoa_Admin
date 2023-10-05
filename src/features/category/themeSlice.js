import { createSlice } from '@reduxjs/toolkit';

export const categorySlice = createSlice({
    name: 'category',
    initialState: [],
    reducers: {
        setInitialValue: (_state, action) => {
            return action.payload;
        },
    },
});

export const { setInitialValue } = categorySlice.actions;
export default categorySlice.reducer;
