import {createSlice} from '@reduxjs/toolkit'

const authSlice = createSlice({ 
    name: 'auth',
    initialState: {
        user: null, 
        token: null,
        loading: false,
        error: null,
    },  

    reducers: {
        setUser: (state) => {
            state.loading = true
            state.error = null
        },
        setLoading: (state, action) => {
            state.loading = false
            state.user = action.payload.user
            state.token = action.payload.token
        },
        setError: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        logout: (state) => {
            state.user = null
            state.token = null
        }           
    }
})  

export const { setUser, setLoading, setError, logout } = authSlice.actions
export default authSlice.reducer        
    