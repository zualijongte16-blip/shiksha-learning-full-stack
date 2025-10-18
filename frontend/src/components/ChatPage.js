import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './ChatPage.css';

const ChatPage = ({ username, onLogout, embedded = false }) => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [showTeacherList, setShowTeacherList] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Get user info from localStorage or props
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userId = userInfo.id;
  const userRole = userInfo.role || 'student';

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5001');

    // Fetch initial data
    fetchChats();
    if (userRole === 'student') {
      fetchTeachers();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/chat/chats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const chatsData = await response.json();
        setChats(chatsData);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/admin/teachers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const teachersData = await response.json();
        setTeachers(teachersData);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const requestChat = async (teacherId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/chat/chats/request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ teacherId })
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setShowTeacherList(false);
        // Refresh chats to show any accepted chats
        fetchChats();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to send chat request');
      }
    } catch (error) {
      console.error('Error requesting chat:', error);
      alert('Failed to send chat request');
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/chat/chats/${chatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);

        // Join chat room
        if (socketRef.current) {
          socketRef.current.emit('join-chat', { chatId, userId });
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/chat/chats/${selectedChat._id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ content: newMessage })
      });

      if (response.ok) {
        const message = await response.json();
        setMessages(prev => [...prev, message]);
        setNewMessage('');

        // Emit message via socket
        if (socketRef.current) {
          socketRef.current.emit('send-message', {
            chatId: selectedChat._id,
            message
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const selectChat = (chat) => {
    setSelectedChat(chat);
    loadMessages(chat._id);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getChatDisplayName = (chat) => {
    const otherParticipant = chat.participants.find(p => p.userId._id !== userId);
    if (otherParticipant) {
      return `${otherParticipant.userId.firstName} ${otherParticipant.userId.lastName}`;
    }
    return 'Unknown';
  };

  const getMessageSenderName = (message) => {
    if (message.senderId._id === userId) {
      return 'You';
    }
    return `${message.senderId.firstName} ${message.senderId.lastName}`;
  };

  if (loading) {
    return (
      <div className="chat-page">
        <div className="loading">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* Header */}
      {!embedded && (
        <div className="chat-header">
          <div className="chat-title">
            <h1>💬 Chat</h1>
            <p>Connect with your teachers</p>
          </div>
          <div className="chat-actions">
            {userRole === 'student' && (
              <button
                className="new-chat-btn"
                onClick={() => setShowTeacherList(!showTeacherList)}
              >
                ✏️ New Chat
              </button>
            )}
            <button className="back-btn" onClick={() => navigate('/dashboard')}>
              ←
            </button>
          </div>
        </div>
      )}

      <div className="chat-container">
        {/* Teacher List Modal */}
        {showTeacherList && (
          <div className="teacher-list-modal">
            <div className="modal-content">
              <h3>Select a Teacher to Chat With</h3>
              <div className="teacher-list">
                {teachers.map(teacher => (
                  <div
                    key={teacher._id}
                    className="teacher-item"
                    onClick={() => requestChat(teacher._id)}
                  >
                    <div className="teacher-avatar">👨‍🏫</div>
                    <div className="teacher-info">
                      <h4>{teacher.firstName} {teacher.lastName}</h4>
                      <p>Teacher</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setShowTeacherList(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Chat List */}
        <div className="chat-list">
          <h3>Your Chats</h3>
          {chats.length === 0 ? (
            <div className="no-chats">
              <p>No chats yet. Start a conversation with a teacher!</p>
            </div>
          ) : (
            chats.map(chat => (
              <div
                key={chat._id}
                className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
                onClick={() => selectChat(chat)}
              >
                <div className="chat-avatar">
                  {chat.participants.find(p => p.role === 'teacher') ? '👨‍🏫' : '👩‍🎓'}
                </div>
                <div className="chat-info">
                  <h4>{getChatDisplayName(chat)}</h4>
                  <p className="last-message">
                    {chat.lastMessage?.content || 'No messages yet'}
                  </p>
                  <span className="last-message-time">
                    {chat.lastMessage ? formatTime(chat.lastMessage.timestamp) : ''}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {selectedChat ? (
            <>
              <div className="chat-header-info">
                <div className="chat-partner">
                  <div className="partner-avatar">
                    {selectedChat.participants.find(p => p.role === 'teacher') ? '👨‍🏫' : '👩‍🎓'}
                  </div>
                  <div className="partner-info">
                    <h4>{getChatDisplayName(selectedChat)}</h4>
                    <p>Online</p>
                  </div>
                </div>
              </div>

              <div className="messages-container">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.senderId._id === userId ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-input-form" onSubmit={sendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="message-input"
                />
                <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                  📤
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h3>Select a chat to start messaging</h3>
                <p>Choose a conversation from the list or start a new chat with a teacher.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
