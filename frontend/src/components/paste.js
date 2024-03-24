
import React, { useState } from 'react';
import { Button, TextareaAutosize, Card, CardContent, Box, Snackbar, Tooltip } from '@mui/material';

const AddText = () => {
  const [text_str, setText_str] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleAdd = async () => {
    try {
      setSnackbarMessage('Text adding...');
      setOpenSnackbar(true);
      const response = await fetch(`http://localhost:8000/paste?text_str=${encodeURIComponent(text_str)}`);
      const data = await response.json();
      console.log(data);
      console.log("text added");
      setSnackbarMessage('Text added successfully!');
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
        <Box >
          {/* <label>Your text: </label> */}
          <TextareaAutosize
            placeholder='Type or paste text' 
            sx={{ marginTop:'5vh'}}
            maxRows={10}
            value={text_str}
            onChange={(e) => setText_str(e.target.value)}
          />
          <Tooltip title="Paste or type some text">
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

export default AddText;
