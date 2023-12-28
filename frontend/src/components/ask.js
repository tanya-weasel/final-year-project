import React, { useState } from 'react';

const AskQuestion = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAsk = async () => {
    try {
      const response = await fetch(`http://localhost:8000/ask?question=${encodeURIComponent(question)}`);
      const data = await response.json();
      console.log(data);
      setAnswer(data.answer); // Adjust this based on the actual response structure
    } catch (error) {
      console.error('Error fetching answer:', error);
    }
  };

  return (
    <div>
      <div>
        <label>Question:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleAsk}>Ask</button>
      </div>
      <div>
        <label>Answer:</label>
        <p>{answer}</p>
      </div>
    </div>
  );
};

export default AskQuestion;
