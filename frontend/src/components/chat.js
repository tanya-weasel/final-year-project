
// import React, { useState } from 'react';
// import { Box } from '@mui/material';

// const ChatInterface = (props) => {
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState('');

//   const handleMessageSubmit = async (e) => {
//     e.preventDefault();
//     if (!inputValue.trim()) return;

//     const response = await fetch(`http://localhost:8000/ask?question=${encodeURIComponent(inputValue)}&tab=${encodeURIComponent(props.tab)}`);
//     const data = await response.json();
//     console.log(data);
    
//     // response from the chatbot
//     setMessages([
//     ...messages,
//     { sender: 'user', text: inputValue }, { sender: 'bot', text: data.answer },
//     ]);

//     setInputValue('');
//   };

//   return (
//     <div className="chat-interface">
//       <Box className="chat-window">
//         {messages.map((message, index) => (
//           <Box key={index} className={`message ${message.sender}`} 
//           sx={{ borderColor: '#000099', borderRadius: '2', backgroundColor: 'pink', borderWidth:'5'}}>
//             {message.text}
//           </Box>
//         ))}
//       </Box>
//       <form onSubmit={handleMessageSubmit} className="message-input-form">
//         <input
//           type="text"
//           placeholder="Type your question..."
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//         />
//         <button type="submit">Send</button>
//       </form>
//     </div>
//   );
// };
// export default ChatInterface;


import React, { useState } from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'; // Import CSS

const ChatInterface = (props) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleMessageSubmit = async (text) => {
    //e.preventDefault();
    //console.log(inputValue);
    console.log(text);
    if (!text.trim()) return;

    const response = await fetch(`http://localhost:8000/ask?question=${encodeURIComponent(text)}&tab=${encodeURIComponent(props.tab)}&llmName=${encodeURIComponent(props.llmName)}`);
    const data = await response.json();
    console.log(data);
    
    // Update the chat window with user's message and bot's response
    setMessages([
      ...messages,
      { sender: 'user', text: text },
      { sender: 'bot', text: data.answer },
    ]);

    setInputValue('');
  };

  return (
    <div style={{ position: 'relative',  }}>
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messages.map((message, index) => (
              <Message
                key={index}
                model={{
                // different coulurs and sides for bot and user  
                  message: message.text,
                  sentTime: 'just now',
                  sender: message.sender,
                  direction: message.sender === "bot" ? "incoming" : "outgoing",
                }}
              />
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type your question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target?.value)}
            onSend={(text) => {
              handleMessageSubmit(text);
            }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default ChatInterface;


