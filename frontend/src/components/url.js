import React, { useState } from 'react';
import { Button, Input, Card, CardContent, Box, Snackbar, Tooltip } from '@mui/material';

const AddUrl = () => {
  const [url_str, setUrl_str] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAdd = async () => {
    try {
      setSnackbarMessage('URL adding...');
      setOpenSnackbar(true);
      const response = await fetch(`http://localhost:8000/url?url=${encodeURIComponent(url_str)}`);
      const data = await response.json();
      console.log(data);
      console.log("url added");
      setSnackbarMessage('URL added successfully!');
      setOpenSnackbar(true);
      //setAnswer(data.answer); // Adjust this based on the actual response structure
    } catch (error) {
      console.error('Error fetching answer:', error);
      setSnackbarMessage('Error adding URL: ' + error.message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
      <Card sx={{ maxWidth: '50vh', minHeight: '10vh', maxHeight: '80vh', marginBottom:'5vh', textAlign:'center' }}>
        <CardContent>
          <Box>
            <label>URL: </label>
            <input
              type="text"
              value={url_str}
              onChange={(e) => setUrl_str(e.target.value)}
            />
            <Tooltip title="Add a URL with some text data">
              <Button sx={{ marginLeft:'5vh' }} variant="outlined" size="small" onClick={handleAdd}>Add</Button>
            </Tooltip>
          </Box>
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

export default AddUrl;
