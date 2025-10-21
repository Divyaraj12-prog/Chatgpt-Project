import React from 'react';
import './ChatSidebar.css';


const ChatSidebar = ({ chats = [], activeChatId, onSelectChat, onNewChat, open }) => {
  return (
    <aside className={"chat-sidebar " + (open ? 'open' : '')} aria-label="Previous chats">
      <div className="sidebar-header">
        <h2>Chats</h2>
        <button className="small-btn" onClick={onNewChat}>New</button>
      </div>
      <nav className="chat-list" aria-live="polite">
        {chats.map(c => {
          const id = c._id || c.chat || c.id;
          const messagesCount = Array.isArray(c.messages) ? c.messages.length : 0;
          return (
            <button
              key={id}
              className={"chat-list-item " + (id === activeChatId ? 'active' : '')}
              onClick={() => onSelectChat(id)}
            >
              <span className="title-line">{c.title || 'New Chat'}</span>
              {/* <span className="meta-line">{messagesCount} msg{messagesCount !== 1 && 's'}</span> */}
            </button>
          );
        })}
        {chats.length === 0 && <p className="empty-hint">No chats yet.</p>}
      </nav>
    </aside>
  );
};

export default ChatSidebar;