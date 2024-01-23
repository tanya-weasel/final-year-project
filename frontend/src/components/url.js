import React, { useState } from 'react';
import { Button, Input, Card, CardContent } from '@mui/material';

const AddUrl = () => {
  const [url_str, setUrl_str] = useState('');
  //const [answer, setAnswer] = useState('');

  const handleAdd = async () => {
    try {
      const response = await fetch(`http://localhost:8000/url?url=${encodeURIComponent(url_str)}`);
      const data = await response.json();
      console.log(data);
      console.log("url added");
      //setAnswer(data.answer); // Adjust this based on the actual response structure
    } catch (error) {
      console.error('Error fetching answer:', error);
    }
  };

  return (
    <Card sx={{ maxWidth: '50vh', maxHeight: '80vh' }}>
      <CardContent>
        <div>
          <label>URL </label>
          <input
            type="text"
            value={url_str}
            onChange={(e) => setUrl_str(e.target.value)}
          />
        </div>
        <div>
          <Button variant="outlined" onClick={handleAdd}>Add</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddUrl;
