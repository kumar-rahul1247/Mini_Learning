import { createStore } from 'redux';
import authReducer from '../reducer/authReducer';

const store = createStore(authReducer);

export default store;
