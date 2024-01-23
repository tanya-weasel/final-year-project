import React, { useState } from 'react';
import { Button, Input, Card, CardContent, TextareaAutosize } from '@mui/material';

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
    <Card sx={{ maxWidth: '60vh' }}>
      <CardContent>
        <div>
          {/* <label><strong>Question: </strong></label> */}
          <TextareaAutosize
            placeholder="Type your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            //margin="dense"
          />

          <Button variant="contained" size="small" disableElevation onClick={handleAsk}
          sx={{ marginLeft: '10px' }}>Ask</Button>
        </div>
        <div>
          <p><strong>Answer: </strong>{answer}</p>
        </div>
      </CardContent>  
    </Card>
  );
};

export default AskQuestion;
