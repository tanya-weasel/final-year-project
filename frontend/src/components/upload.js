import React, { useState } from 'react';
import { Button, InputLabel, Input, TextField } from '@mui/material';

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
    <div>
      <Input type="file" color="primary" onChange={handleFileChange} />
      <Button variant="outlined" size="small" disableElevation onClick={handleUpload}>Upload</Button>
      
      {/* <div>
      <InputLabel htmlFor="file-upload" style={{ marginBottom: '8px' }}>
        Upload File
      </InputLabel>
      <Input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        color="primary"
        component="label"
        htmlFor="file-upload"
        onClick={handleUpload}
      >
        Upload
      </Button>
    </div> */}

    </div>
  );
};

export default FileUpload;
