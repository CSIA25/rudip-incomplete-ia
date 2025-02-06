import React, { useState, useEffect } from "react";
import FormBuilder from "./components/FormBuilder";
import "./index.css";

const App = () => {
  const [responses, setResponses] = useState({});

  useEffect(() => {
    localStorage.setItem("formResponses", JSON.stringify(responses));
  }, [responses]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Random Title</h1>
      </header>

      {/* Main Form Editor */}
      <FormBuilder responses={responses} setResponses={setResponses} />
    </div>
  );
};

export default App;
