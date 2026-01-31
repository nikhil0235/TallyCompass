import React, { useState } from 'react';
import UserMentionEditor from '../components/common/UserMentionEditor';

const UserMentionExample = () => {
  const [content, setContent] = useState('');

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>User Mention Editor Example</h2>
      <p>Type @ to see the list of users and select them. Selected users will be attached and sent to the backend.</p>
      
      <UserMentionEditor
        value={content}
        onChange={handleContentChange}
        placeholder="Type @ to mention users..."
      />
      
      <div style={{ marginTop: '20px' }}>
        <h3>Current Content:</h3>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px',
          whiteSpace: 'pre-wrap'
        }}>
          {content || 'No content yet...'}
        </pre>
      </div>
    </div>
  );
};

export default UserMentionExample;