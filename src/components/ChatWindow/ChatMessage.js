import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; 


const ChatMessage = ({ message }) => {
    const { role, content, isError } = message;
    const alignClass = role === 'user' ? 'user-message' : 'assistant-message';
    const errorClass = isError ? 'error-message' : ''; 
    return (
        <div className={`message ${alignClass} ${errorClass}`}>
            <div className="message-content">
                 
                 {role === 'assistant' || role === 'system' ? ( // Handle system messages similarly
                    <ReactMarkdown
                        children={content}
                        components={{
                            code({node, inline, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        children={String(children).replace(/\n$/, '')}
                                        style={oneDark} 
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                     />
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        }}
                    />
                 ) : (
                    content 
                 )}
            </div>
             
        </div>
    );
};

export default ChatMessage;