// src/Responses.js

import { useState, useEffect } from "react";
import { db, ref, get } from "firebase/database";

const Responses = () => {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // Fetch data from Firebase Realtime Database when component mounts
    const fetchResponses = async () => {
      try {
        const responsesRef = ref(db, "responses");
        const snapshot = await get(responsesRef);
        const data = snapshot.val();
        const responsesArray = data ? Object.values(data) : [];
        setResponses(responsesArray);
      } catch (error) {
        console.error("Error fetching responses: ", error);
      }
    };

    fetchResponses();
  }, []);

  return (
    <div>
      <h2>Responses</h2>
      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <ul>
          {responses.map((response, index) => (
            <li key={index}>
              <strong>Name:</strong> {response.name} <br />
              <strong>Email:</strong> {response.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Responses;
