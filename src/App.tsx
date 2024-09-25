import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import store from "./store/store";
import { SnackbarProvider } from "notistack";
import "typeface-roboto";
import WebSocketComponent from "./components/WebSocketComponent";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  return (
    <SnackbarProvider preventDuplicate maxSnack={3}>
      <Provider store={store}>
        <WebSocketComponent />
        <Router>
          <Routes>
            <Route path="/" element={<Home></Home>} />
          </Routes>
        </Router>
      </Provider>
    </SnackbarProvider>
  );
}

export default App;
