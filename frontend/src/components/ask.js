import React, { useState } from 'react';

const AskQuestion = (props) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAsk = async () => {
    try {
      const response = await fetch(`http://localhost:8000/ask?question=${encodeURIComponent(question)}&tab=${encodeURIComponent(props.tab)}`);
      const data = await response.json();
      console.log(data);
      setAnswer(data.answer);
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
