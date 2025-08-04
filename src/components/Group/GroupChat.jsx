import React,{ useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import api from '../api/api';

export default function ChatTab() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { groupId } = useParams();
  const { user, token } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);

  const getMessages = async () =>{
    try{
        console.log("group mesages");
        const response = await api.get(`/api/chat/messages/${groupId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        setMessages(response.data);
          console.log(response.data);
    }catch(e){
        console.log(e.message);
    }
  }

  useEffect(() => {
    
    getMessages();
     
  }, [groupId]);

  useEffect(() => {
    socketRef.current = io('http://localhost:8000');
    socketRef.current.emit('joinRoom', groupId);

    socketRef.current.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      text: newMessage,
      groupId: groupId,
      sender: user,
    };

    socketRef.current.emit('sendMessage', msg);
    setNewMessage('');
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 h-[500px] flex flex-col`}>
      <h3 className="text-xl font-semibold mb-4">Group Chat</h3>
      
      <div className="flex-1 overflow-y-auto space-y-3 px-3 py-2">
  {messages.map(msg => {
    const isOwnMessage = msg.sender._id === user.id;
    return (
      <div
        key={msg._id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm break-words relative
            ${isOwnMessage 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : `${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'} rounded-bl-md`
            }`}
        >
          {!isOwnMessage && (
            <div className="font-semibold text-xs mb-2 opacity-90">
              {msg.sender.name || msg.sender.username}
            </div>
          )}
          
          <div className="mb-1 leading-relaxed">
            {msg.text}
          </div>

          <div 
            className={`text-xs mt-2 ${isOwnMessage ? 'text-right' : 'text-left'} opacity-60`}
          >
            {new Date(msg.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    );
  })}
  <div ref={messagesEndRef}></div>
</div>



      <form onSubmit={handleSend} className="flex gap-2 mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 rounded-md border"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Send
        </button>
      </form>
    </div>
  );
}
