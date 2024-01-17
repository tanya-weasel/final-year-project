import React, { useState } from 'react';
import { Button, Input } from '@mui/material';

const AskQuestion = (props) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleAsk = async () => {
    try {
      setAnswer("generating...");
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
        <label><strong>Question: </strong></label>
        <Input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          margin="dense"
        />

        <Button variant="contained" size="small" disableElevation onClick={handleAsk}>Ask</Button>
      </div>
      <div>
        <label><strong>Answer: </strong></label>
        <p>{answer}</p>
      </div>
    </div>
  );
};

export default AskQuestion;
