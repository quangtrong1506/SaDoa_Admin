import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '../features/category/themeSlice';
import themeReducer from '../features/theme/themeSlice';

export default configureStore({
    reducer: {
        theme: themeReducer,
        category: categoryReducer,
    },
});
