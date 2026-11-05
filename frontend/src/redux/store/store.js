import {configureStore} from '@reduxjs/toolkit'
import workerReducer from '../slice/workerSlice'

export const store = configureStore({
    reducer: {
        worker: workerReducer
    },
});