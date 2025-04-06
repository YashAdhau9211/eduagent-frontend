import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DOMPurify from 'dompurify';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AnswerTabs Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="tabs-error">
          <h4>Error displaying content</h4>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Markdown Component with Sanitization
const MarkdownContent = ({ content }) => {
  const cleanContent = DOMPurify.sanitize(content || '');
  return (
    <div className="markdown-container">
      <ReactMarkdown
        children={cleanContent}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
};

// Main Component
const AnswerTabs = ({ responseData, isLoading }) => {
  const [activeTab, setActiveTab] = useState('final');
  const [tabs, setTabs] = useState([]);

  // Update available tabs when data changes
  useEffect(() => {
    if (responseData) {
      const availableTabs = ['final', 'rag', 'llm', 'web', 'sources'].filter(tab => {
        if (tab === 'sources') return responseData.sources?.length > 0;
        return responseData[tab]?.length > 0;
      });
      setTabs(availableTabs);
      
      // Reset to first tab if current tab becomes invalid
      if (!availableTabs.includes(activeTab)) {
        setActiveTab(availableTabs[0] || null);
      }
    }
  }, [responseData, activeTab]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (['ArrowRight', 'ArrowLeft'].includes(e.key)) {
      const currentIndex = tabs.indexOf(activeTab);
      const direction = e.key === 'ArrowRight' ? 1 : -1;
      const newIndex = (currentIndex + direction + tabs.length) % tabs.length;
      setActiveTab(tabs[newIndex]);
    }
  };

  // Content rendering
  const renderContent = () => {
    if (!responseData) return null;
    
    try {
      switch (activeTab) {
        case 'final':
          return responseData.final ? (
            <MarkdownContent content={responseData.final} />
          ) : <div className="empty-tab">No final answer available</div>;
        
        case 'rag':
          return responseData.rag ? (
            <MarkdownContent content={responseData.rag} />
          ) : <div className="empty-tab">No RAG analysis available</div>;
        
        case 'llm':
          return responseData.llm ? (
            <MarkdownContent content={responseData.llm} />
          ) : <div className="empty-tab">No LLM reasoning available</div>;
        
        case 'web':
          return responseData.web ? (
            <MarkdownContent content={responseData.web} />
          ) : <div className="empty-tab">No web context available</div>;
        
        case 'sources':
          return responseData.sources?.length > 0 ? (
            <div className="sources-list">
              <h4>Reference Sources</h4>
              <ul>
                {responseData.sources.map((url, index) => {
                  const isValid = isValidUrl(url);
                  return (
                    <li key={index}>
                      {isValid ? (
                        <a
                          href={url.startsWith('http') ? url : `https://${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {url}
                        </a>
                      ) : (
                        <span className="invalid-url">{url} (invalid URL)</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : <div className="empty-tab">No sources cited</div>;
        
        default:
          return null;
      }
    } catch (error) {
      console.error('Error rendering tab content:', error);
      return <div className="tabs-error">Error displaying content</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="answer-tabs loading">
        <div className="tab-buttons">
          {['final', 'rag', 'llm', 'web', 'sources'].map(tab => (
            <button key={tab} disabled>{tab.toUpperCase()}</button>
          ))}
        </div>
        <div className="tab-content">
          <p>Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!responseData || tabs.length === 0) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="answer-tabs">
        <div 
          className="tab-buttons"
          role="tablist"
          onKeyDown={handleKeyDown}
        >
          {tabs.map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`tabpanel-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'active' : ''}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        <div 
          className="tab-content"
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {renderContent()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Helper function
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Prop validation
AnswerTabs.propTypes = {
  responseData: PropTypes.shape({
    final: PropTypes.string,
    rag: PropTypes.string,
    llm: PropTypes.string,
    web: PropTypes.string,
    sources: PropTypes.arrayOf(PropTypes.string),
  }),
  isLoading: PropTypes.bool
};

export default AnswerTabs;