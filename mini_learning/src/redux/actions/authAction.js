export const SET_USER = 'SET_USER'
export const LOGOUT_USER = 'LOGOUT_USER'

export const setUser = (payload) => {
    return {
        type: SET_USER,
        payload: payload
    }
}


export const logoutUser = () => {
    return {
        type: LOGOUT_USER,
        payload: null
    }
}