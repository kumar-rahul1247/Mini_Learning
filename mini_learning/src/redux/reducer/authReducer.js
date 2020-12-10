import {SET_USER, LOGOUT_USER} from '../actions/authAction';

const initialState={
    token:null,
    user: null
}

const authReducer = (state = initialState, action) =>{

    switch(action.type){

        case SET_USER:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user
            }

        case LOGOUT_USER:
            return {
                ...state,
                token: null,
                user: null
            }

        default:
             return state

    }
}

export default authReducer