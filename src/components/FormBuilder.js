import React, { useState } from "react";
import { ref, set } from "firebase/database";
import "../styles/FormBuilder.css";
import { db } from "./firebase"; // Ensure this is your initialized Firebase instance
import emailjs from "emailjs-com";

const FormBuilder = () => {
  // State for form metadata
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [formDescription, setFormDescription] = useState("Form description");
  const [themeColor, setThemeColor] = useState("#1a73e8");

  // State for form structure
  const [sections, setSections] = useState([
    {
      id: Date.now(),
      title: "Section 1",
      questions: [
        {
          id: Date.now(),
          text: "Untitled Question",
          type: "short-answer",
          options: [],
        },
      ],
    },
  ]);

  // State for form responses
  const [responses, setResponses] = useState({});
  const [file, setFile] = useState(null);

  // Save form structure to Firebase
  const saveFormToFirebase = async () => {
    const formData = {
      title: formTitle,
      description: formDescription,
      sections: sections,
    };

    try {
      const newFormRef = ref(db, "forms/" + Date.now());
      await set(newFormRef, formData);
      alert("Form saved successfully!");
    } catch (error) {
      console.error("Error saving form to Firebase:", error);
      alert("Error saving form.");
    }
  };

  // Handle response changes for questions
  const handleResponseChange = (sectionId, questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [questionId]: value },
    }));
  };

  // Submit responses to Firebase
  const submitResponses = async () => {
    try {
      const newResponseRef = ref(db, "responses/" + Date.now());
      await set(newResponseRef, responses);
      alert("Response submitted!");
    } catch (error) {
      console.error("Error submitting responses:", error);
      alert("Error submitting responses.");
    }
  };

  // Validate form inputs
  const validateForm = () => {
    if (!formTitle || !formDescription) {
      alert("Form title and description are required.");
      return false;
    }
    return true;
  };

  // Send form responses via EmailJS
  const sendFormToEmail = () => {
    if (!validateForm()) return;

    const emailData = {
      formTitle: formTitle,
      formDescription: formDescription,
      sections: sections.map((section) => ({
        title: section.title,
        questions: section.questions.map((q) => ({
          text: q.text,
          type: q.type,
          options: q.options.join(", "),
        })),
      })),
    };

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID, // Use environment variables
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        emailData,
        process.env.REACT_APP_EMAILJS_USER_ID
      )
      .then((response) => {
        console.log("Email sent successfully:", response);
        alert("Form responses have been sent to your email.");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Error sending email.");
      });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const uploadFile = () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      fetch(process.env.REACT_APP_FILE_UPLOAD_URL, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("File uploaded successfully:", data);
          alert("File uploaded successfully!");
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          alert("Error uploading file.");
        });
    } else {
      alert("No file selected.");
    }
  };

  // Add a new question to a section
  const addQuestion = (sectionId) => {
    const newQuestion = {
      id: Date.now(),
      text: "Untitled Question",
      type: "short-answer",
      options: [],
    };

    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    );
  };

  // Delete a question from a section
  const deleteQuestion = (sectionId, questionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.filter((q) => q.id !== questionId),
            }
          : section
      )
    );
  };

  // Update question text
  const updateQuestionText = (sectionId, questionId, newText) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId ? { ...q, text: newText } : q
              ),
            }
          : section
      )
    );
  };

  // Change question type
  const changeQuestionType = (sectionId, questionId, newType) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      type: newType,
                      options:
                        newType === "mcq" || newType === "checkbox" || newType === "dropdown"
                          ? ["Option 1"]
                          : [],
                    }
                  : q
              ),
            }
          : section
      )
    );
  };

  // Update options for MCQ, checkbox, or dropdown questions
  const updateOptionText = (sectionId, questionId, optionIndex, newText) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: q.options.map((opt, idx) =>
                        idx === optionIndex ? newText : opt
                      ),
                    }
                  : q
              ),
            }
          : section
      )
    );
  };

  // Add an option to MCQ, checkbox, or dropdown questions
  const addOption = (sectionId, questionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId
                  ? {
                      ...q,
                      options: [...q.options, `Option ${q.options.length + 1}`],
                    }
                  : q
              ),
            }
          : section
      )
    );
  };

  // Add a new section to the form
  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: `Section ${sections.length + 1}`,
      questions: [
        {
          id: Date.now(),
          text: "Untitled Question",
          type: "short-answer",
          options: [],
        },
      ],
    };
    setSections([...sections, newSection]);
  };

  // Export form to CSV
  const exportToCSV = () => {
    let csvContent = `"Form Title","${formTitle}"\n"Description","${formDescription}"\n\n`;
    csvContent += `"Section","Question","Type","Options"\n`;

    sections.forEach((section) => {
      section.questions.forEach((question) => {
        const options = question.options.length > 0 ? question.options.join("; ") : "N/A";
        csvContent += `"${section.title}","${question.text}","${question.type}","${options}"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${formTitle.replace(/\s+/g, "_")}_questions.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="form-container" style={{ borderTop: `8px solid ${themeColor}` }}>
      <header className="form-header" style={{ backgroundColor: themeColor }}>
        <div className="form-title-section">
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Untitled Form"
            className="form-title-input"
          />
          <textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            placeholder="Form description"
            className="form-description-input"
          />
        </div>
      </header>

      <main className="form-body">
        {sections.map((section) => (
          <div key={section.id} className="section">
            <h3>{section.title}</h3>
            {section.questions.map((q) => (
              <div key={q.id} className="question-card">
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => updateQuestionText(section.id, q.id, e.target.value)}
                />
                <select
                  value={q.type}
                  onChange={(e) => changeQuestionType(section.id, q.id, e.target.value)}
                >
                  <option value="short-answer">Short Answer</option>
                  <option value="paragraph">Paragraph</option>
                  <option value="mcq">Multiple Choice</option>
                  <option value="checkbox">Checkboxes</option>
                  <option value="dropdown">Dropdown</option>
                </select>

                {q.type === "short-answer" && (
                  <input
                    type="text"
                    value={responses[section.id]?.[q.id] || ""}
                    onChange={(e) => handleResponseChange(section.id, q.id, e.target.value)}
                    placeholder="Short answer text"
                  />
                )}
                {q.type === "paragraph" && (
                  <textarea
                    value={responses[section.id]?.[q.id] || ""}
                    onChange={(e) => handleResponseChange(section.id, q.id, e.target.value)}
                    placeholder="Long answer text"
                  />
                )}
                {q.type === "mcq" &&
                  q.options.map((opt, idx) => (
                    <div key={idx} className="option-container">
                      <input
                        type="radio"
                        name={`mcq-${q.id}`}
                        checked={responses[section.id]?.[q.id] === opt}
                        onChange={() => handleResponseChange(section.id, q.id, opt)}
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOptionText(section.id, q.id, idx, e.target.value)}
                        className="option-input"
                      />
                    </div>
                  ))}
                {q.type === "mcq" && (
                  <button onClick={() => addOption(section.id, q.id)}>+ Add Option</button>
                )}

                <button onClick={() => deleteQuestion(section.id, q.id)}>Delete</button>
              </div>
            ))}
            <button onClick={() => addQuestion(section.id)}>+ Add Question</button>
          </div>
        ))}

        <div className="add-section-card" onClick={addSection}>
          <span className="add-icon">+</span>
          <span>Add Section</span>
        </div>

        <button onClick={exportToCSV} className="export-btn">
          Export to CSV
        </button>
        <button onClick={saveFormToFirebase}>Save Form</button>
        <button onClick={submitResponses}>Submit Responses</button>
        <input type="file" onChange={handleFileChange} />
        <button onClick={uploadFile}>Upload File</button>
        <button onClick={sendFormToEmail}>Send Form to Email</button>
      </main>
    </div>
  );
};

export default FormBuilder;