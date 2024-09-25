import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <Home></Home>
    </Provider>
  );
}

export default App;
