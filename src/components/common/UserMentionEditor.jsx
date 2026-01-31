import React, { useState, useEffect, useRef } from 'react';
import userService from '../../services/userService';
import './UserMentionEditor.css';

const UserMentionEditor = ({ value, onChange, placeholder = "Type @ to mention users..." }) => {
  const [users, setUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [mentionPosition, setMentionPosition] = useState(0);
  const [attachedUsers, setAttachedUsers] = useState([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const textareaRef = useRef(null);
  const userListRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userListRef.current && !userListRef.current.contains(event.target)) {
        setShowUserList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    onChange(inputValue);
    
    // Check if @ was typed
    const textBeforeCursor = inputValue.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      
      // Show user list if @ is at word boundary and no space after @
      if (textAfterAt.length === 0 || !textAfterAt.includes(' ')) {
        setMentionPosition(lastAtIndex);
        setShowUserList(true);
        setSelectedUserIndex(0);
        
        // Filter users based on text after @
        const filtered = users.filter(user => 
          user.name?.toLowerCase().includes(textAfterAt.toLowerCase()) ||
          user.email?.toLowerCase().includes(textAfterAt.toLowerCase())
        );
        setFilteredUsers(filtered);
      } else {
        setShowUserList(false);
      }
    } else {
      setShowUserList(false);
    }
  };

  const handleUserSelect = (user) => {
    const textBeforeMention = value.substring(0, mentionPosition);
    const cursorPos = textareaRef.current.selectionStart;
    const textAfterCursor = value.substring(cursorPos);
    
    const newValue = `${textBeforeMention}@${user.name} ${textAfterCursor}`;
    onChange(newValue);
    
    // Add to attached users
    if (!attachedUsers.find(u => u.id === user.id)) {
      const newAttachedUsers = [...attachedUsers, user];
      setAttachedUsers(newAttachedUsers);
      
      // Send to backend
      sendAttachedUsersToBackend(newAttachedUsers);
    }
    
    setShowUserList(false);
    
    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textareaRef.current.focus();
      const newCursorPos = mentionPosition + user.name.length + 2; // +2 for @ and space
      textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleUserRemove = (userId) => {
    const updatedUsers = attachedUsers.filter(user => user.id !== userId);
    setAttachedUsers(updatedUsers);
    
    // Remove mention from text
    const userToRemove = attachedUsers.find(u => u.id === userId);
    if (userToRemove) {
      const mentionText = `@${userToRemove.name}`;
      const newValue = value.replace(new RegExp(mentionText, 'g'), '');
      onChange(newValue);
    }
    
    // Send updated list to backend
    sendAttachedUsersToBackend(updatedUsers);
  };

  const sendAttachedUsersToBackend = async (userList) => {
    try {
      const attachedUsersData = userList.map(u => ({ 
        id: u.id, 
        name: u.name, 
        email: u.email 
      }));
      
      await userService.sendAttachedUsers(attachedUsersData);
      console.log('Successfully sent attached users to backend:', attachedUsersData);
      
    } catch (error) {
      console.error('Error sending attached users to backend:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (showUserList && filteredUsers.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedUserIndex(prev => 
            prev < filteredUsers.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedUserIndex(prev => 
            prev > 0 ? prev - 1 : filteredUsers.length - 1
          );
          break;
        case 'Enter':
        case 'Tab':
          e.preventDefault();
          if (filteredUsers[selectedUserIndex]) {
            handleUserSelect(filteredUsers[selectedUserIndex]);
          }
          break;
        case 'Escape':
          setShowUserList(false);
          break;
      }
    }
  };

  return (
    <div className="user-mention-editor">
      {/* Attached Users Display */}
      {attachedUsers.length > 0 && (
        <div className="attached-users">
          {attachedUsers.map(user => (
            <span key={user.id} className="attached-user-tag">
              @{user.name}
              <button
                onClick={() => handleUserRemove(user.id)}
                className="attached-user-remove"
                title="Remove user"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Text Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="mention-textarea"
      />

      {/* User List Dropdown */}
      {showUserList && (
        <div ref={userListRef} className="user-dropdown">
          {users.length === 0 ? (
            <div className="no-users">
              No user found
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className={`user-item ${index === selectedUserIndex ? 'selected' : ''}`}
                onMouseEnter={() => setSelectedUserIndex(index)}
              >
                <div className="user-avatar">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-users">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMentionEditor;