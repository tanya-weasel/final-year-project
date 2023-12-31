import React, { useState } from 'react';

const AddUrl = () => {
  const [url_str, setUrl_str] = useState('');
  //const [answer, setAnswer] = useState('');

  const handleAdd = async () => {
    try {
      const response = await fetch(`http://localhost:8000/url?url=${encodeURIComponent(url_str)}`);
      const data = await response.json();
      console.log(data);
      //setAnswer(data.answer); // Adjust this based on the actual response structure
    } catch (error) {
      console.error('Error fetching answer:', error);
    }
  };

  return (
    <div>
      <div>
        <label>Add url</label>
        <input
          type="text"
          value={url_str}
          onChange={(e) => setUrl_str(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
};

export default AddUrl;
