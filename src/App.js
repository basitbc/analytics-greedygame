import React from 'react';
import { Provider } from 'react-redux';
import store from '../src/redux/store/Store';
import './App.css';
import Home from './pages/Home/Home';

function App() {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
}

export default App;
