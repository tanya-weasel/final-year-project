import logo from './logo.svg';
import './App.css';

// src/App.js

import React, { useState, useEffect } from 'react';
// import { fetchMessage } from './Api';
import FileUpload from './components/upload';
import AskQuestion from './components/ask';
import AddUrl from './components/url';
import ChatInterface from './components/chat';

import {Tabs, Tab, Typography, Box, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import PropTypes from 'prop-types';

function App() {
    // const [message, setMessage] = useState('');

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const data = await fetchMessage();
    //             setMessage(data.message);
    //         } catch (error) {
    //             console.error('Error:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);
    //let tab = 0;

    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
      }
      
    CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    };
      
    function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
    }

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    
    // Initialize state to hold the selected value
    const [selectedLLM, setSelectedLLM] = useState('');
  
    // Function to handle dropdown value change
    const handleDropdownChange = (event) => {
      setSelectedLLM(event.target.value);
    } 
      
    return (
        <div className="App">
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Upload file" {...a11yProps(0)} />
                        <Tab label="Enter url" {...a11yProps(1)} />
                    </Tabs>
                    
                    <Box sx={{ minWidth: 120, marginTop:5 }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">LLM</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectedLLM}
                          label="LLM"
                          onChange={handleDropdownChange}
                        >
                          <MenuItem value={"JinaChat"}>JinaChat</MenuItem>
                          <MenuItem value={"Cohere"}>Cohere</MenuItem>
                          {/* <MenuItem value={30}>Thirty</MenuItem> */}
                        </Select>
                      </FormControl>
                    </Box>

                </Box>
                <CustomTabPanel value={value} index={0}>
                   
                    <FileUpload/>
                    <ChatInterface tab={value} llmName={selectedLLM}/>

                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    
                    <AddUrl/>
                    <ChatInterface tab={value} llmName={selectedLLM}/>

                </CustomTabPanel>
                
            </Box>
            {/* <AskQuestion tab={value}/> */}
        </div>
    );
}

export default App;