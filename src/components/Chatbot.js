import React, { useState, useRef, useEffect } from 'react';
import '../styles/components/chatbot.css';

const Chatbot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: "Hi there! I'm DevBot 🤖<br>How can I help you today?"
        }
    ]);
    const [userInput, setUserInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSendMessage = () => {
        if (userInput.trim() === '') return;

        // Add user message
        const newUserMessage = {
            type: 'user',
            content: userInput
        };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');

        // Simulate bot response
        setTimeout(() => {
            const botResponse = generateBotResponse(userInput);
            setMessages(prev => [...prev, { type: 'bot', content: botResponse }]);
        }, 500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const generateBotResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! I'm DevBot, your coding assistant. How can I help you today?";
        } else if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
            return "Sneha has worked on several full-stack projects using React, Node.js, and modern web technologies. Check out the Projects section to see her work!";
        } else if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
            return "Sneha specializes in frontend development with React, backend with Node.js, and various databases. You'll find all her skills in the Skills section.";
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('email')) {
            return "You can contact Sneha through the Contact section. She's available for freelance projects and would love to hear from you!";
        } else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
            return "You can download Sneha's resume using the Download Resume button in the hero section.";
        } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return "You're welcome! Is there anything else you'd like to know?";
        } else {
            return "I'm not sure I understand. You can ask me about Sneha's projects, skills, or how to contact her!";
        }
    };

    return (
        <div className={`chatbot-container ${isChatOpen ? 'chat-active' : ''}`}>
            <div className="tech-computer" id="techComputer" onClick={toggleChat}>
                <div className="computer-screen">
                    <div className="code-text">
                        {`> Hello World!<br>> console.log("Hi!")<br>> const dev = "Sneha"<br>> function createMagic() {<br>>   return awesomeCode;<br>> }<br>> while (true) {<br>>   keepCoding();<br>> }<br>> npm install creativity<br>> git commit -m "Awesome feature"<br>> // TODO: Build amazing things<br>> const passion = 100%;<br>> let innovation = ∞;<br>> export default skills;<br>> Happy coding! 💻`}
                    </div>
                </div>
                <div className="computer-keyboard"></div>
                <div className="computer-base"></div>
            </div>
            
            <div className="chat-window" id="chatWindow">
                <div className="chat-header">
                    <span>DevBot - Your Coding Assistant</span>
                    <button className="close-chat" onClick={toggleChat}>×</button>
                </div>
                <div className="chat-messages" id="chatMessages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.type}-message`}>
                            <div 
                                className="message-content"
                                dangerouslySetInnerHTML={{ __html: message.content }}
                            />
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input">
                    <input 
                        type="text" 
                        id="userInput"
                        value={userInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..." 
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;