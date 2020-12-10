
import './App.css';
import React from 'react'
import { Provider } from 'react-redux';
import store from './redux/store/authStore'

import Header from './Component/Header/Header';
import ProtectedRoute from './Component/ProtectedRoute/ProtectedRoute';

import { BrowserRouter } from 'react-router-dom'






function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
          <Header />
          <ProtectedRoute/>
        </BrowserRouter>
      </div>
    </Provider>
  );
}


export default App;
