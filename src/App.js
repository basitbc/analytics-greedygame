import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import store from '../src/redux/store/Store';
import './App.css';
import Home from './pages/Home/Home';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
