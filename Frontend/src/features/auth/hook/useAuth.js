import {useDispatch} from 'react-redux'
import {login, register,getMe } from '../services/auth.api'
import { setUser,setLoading,setError } from '../auth.slice'   

export function useAuth() {
    const dispatch = useDispatch()  

    async function handleLogin(email, username,password) {
        dispatch(setUser())     
        try {
            const data = await login(email, password)
            dispatch(setLoading({ user: data.user, token: data.token }))
        }           

        catch (error) {
            dispatch(setError(error.response?.data?.message || 'Login failed'))
        }   
    }

    async function handleRegister(email, username, password) {
        dispatch(setUser())     
        try {
            const data = await register(email, username, password)
            dispatch(setLoading({ user: data.user, token: data.token }))
        }            catch (error) {
            dispatch(setError(error.response?.data?.message || 'Registration failed'))
        }   
    }

    async function handleGetMe() {
        try {
            const data = await getMe()
            dispatch(setLoading({ user: data.user, token: null }))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to fetch user'))
        }
    }   

    return {
        handleLogin,
        handleRegister,
        fetchCurrentUser,
    }
}   