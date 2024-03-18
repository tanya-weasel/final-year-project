
import React, { useState } from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'; // Import CSS
import { Alert } from '@mui/material';

const ChatInterface = (props) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleMessageSubmit = async (text) => {
    if (!text.trim()) return;

    setShowAlert(true);

    try {
      const response = await fetch(`http://localhost:8000/ask?question=${encodeURIComponent(text)}&tab=${encodeURIComponent(props.tab)}&llmName=${encodeURIComponent(props.llmName)}`);
      const data = await response.json();
      console.log(data);
    
      // Update the chat window with user's message and bot's response
      setMessages([
        ...messages,
        { sender: 'user', text: text },
        { sender: 'bot', text: data.answer },
      ]);
    } catch (error) {
      console.error('Error fetching answer:', error);
    } finally {
      setShowAlert(false);
    }

    setInputValue('');
  };

  return (
    <div style={{ position: 'relative' }}>
      {showAlert && (
            <Alert severity="info" sx={{ position: 'absolute', bottom: '5px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
              Generating answer...
            </Alert>
          )}
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messages.map((message, index) => (
              <Message
                key={index}
                model={{
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
