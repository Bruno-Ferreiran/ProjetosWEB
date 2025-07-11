import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import PF from "./pages/pf";
import PJ from "./pages/pj";
import Sucesso from "./pages/Sucesso";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Router>
      {/* ToastContainer global */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/pf" element={<PF />} />
        <Route path="/pj" element={<PJ />} />
        <Route path="/sucesso" element={<Sucesso />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
