import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

const App = () => {
  return (
    <>
        <BrowserRouter>
          <Routes>
        <Route path="/"  element={<Home />}/>
         <Route path="login"  element={<Login />}/>
          <Route path="/register"  element={<Register />}/>
          </Routes>
        </BrowserRouter>
    </>
  );
};

export default App;
