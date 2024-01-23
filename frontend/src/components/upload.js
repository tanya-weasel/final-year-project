
import React, { useState } from 'react';
import { Button, InputLabel, Input, TextField, Card, CardContent } from '@mui/material';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        console.log('File uploaded successfully!', data);
        // alert file uploaded
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        // Handle errors
      });
    } else {
      console.warn('No file selected');
    }
  };

  return (
    <Card sx={{ maxWidth: '50vh', maxHeight: '80vh' }}>
      <CardContent> 
        <div>
          <input
            // sx={{ maxWidth: 280, maxHeight: 100 }}
            id="contained-button-file"
            multiple
            type="file"
            onChange={handleFileChange}
          />
            <Button variant="outlined" color="primary" component="span" size="small" onClick={handleUpload}>
              Upload
            </Button>
          
        </div> 
      </CardContent>
    </Card>
  );
};

export default FileUpload;

