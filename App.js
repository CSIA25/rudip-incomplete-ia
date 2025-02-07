import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormBuilder from "./components/FormBuilder";
import Login from "./components/Login"; // Example login page
import NotFound from "./components/NotFound"; // 404 Page
import "./index.css";

const App = () => {
  const [responses, setResponses] = useState({});

  useEffect(() => {
    localStorage.setItem("formResponses", JSON.stringify(responses));
  }, [responses]);

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Random Title</h1>
        </header>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<FormBuilder responses={responses} setResponses={setResponses} />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} /> {/* Handles unknown routes */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
