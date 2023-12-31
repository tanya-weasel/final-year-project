import logo from './logo.svg';
import './App.css';

// src/App.js

import React, { useState, useEffect } from 'react';
// import { fetchMessage } from './Api';
import FileUpload from './components/upload';
import AskQuestion from './components/ask';
import AddUrl from './components/url';

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
    let tab = 0;
    return (
        <div className="App">
            <FileUpload/>
            <AddUrl/>
            <AskQuestion tab={tab}/>
        </div>
    );
}

export default App;