import { createSlice } from '@reduxjs/toolkit';

// if page refreshed to retain info in browser we are using local storage
const getInitialWorker = () => {
    try {
        const savedworker = localStorage.getItem('rojgar_worker');
        return (savedworker && savedworker !== 'undefined') ? JSON.parse(savedworker) : null;
    } catch (error) {
        return null;
    }
};

const initialState = {
    currentWorker: getInitialWorker(),
};

export const workerSlice = createSlice({
    name: 'worker',
    initialState,
    reducers: {
        // when worker register / onboard
        setWorker: (state, action) => {
            state.currentWorker = action.payload;
            localStorage.setItem('rojgar_worker', JSON.stringify(action.payload));
        },

        // to toggle the status of worker online/offline
        updateWorkerStatus: (state, action) => {
            if (state.currentWorker) {
                state.currentWorker.isOnline = action.payload;
                localStorage.setItem('rojgar_worker', JSON.stringify(state.currentWorker));
            }
        },

        // when user click exit button "Exit Worker Mode"
        clearWorker: (state) => {
            state.currentWorker = null;
            localStorage.removeItem('rojgar_worker');
        }
    },
});

export const { setWorker, updateWorkerStatus, clearWorker } = workerSlice.actions;
export default workerSlice.reducer;