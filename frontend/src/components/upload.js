
import React, { useState } from 'react';
import { Button, InputLabel, Input, TextField, Card, CardContent, Snackbar } from '@mui/material';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      setSnackbarMessage('File uploading...');
      setOpenSnackbar(true);

      fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        console.log('File uploaded successfully!', data);
        setSnackbarMessage('File uploaded successfully!');
        setOpenSnackbar(true);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        setSnackbarMessage('Error uploading file: ' + error.message);
        setOpenSnackbar(true);
      });
    } else {
      console.warn('No file selected');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Card sx={{ maxWidth: '50vh', maxHeight: '80vh', marginBottom:'5vh' }}>
      <CardContent> 
        <div>
          <input
            id="contained-button-file"
            multiple
            type="file"
            onChange={handleFileChange}
          />
            <Button variant="outlined" color="primary" component="span" size="small" onClick={handleUpload}>
              Upload
            </Button>
          
        </div> 
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          action={
            <Button color="info" size="small" onClick={handleCloseSnackbar}>
              Close
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
};

export default FileUpload;
