import { motion } from "framer-motion";

interface Message {
  id: string;
  content: string;
  sender: 'USER' | 'BOT';
  createdAt: string;
  sourceUrls?: string[];
}

interface MessageBubbleProps {
  message: Message;
  index: number;
}

interface ParsedElement {
  type: 'text' | 'bold' | 'list' | 'header' | 'numbered_list' | 'disclaimer' | 'bold_header';
  content: string;
  children?: ParsedElement[];
}

const parseContent = (content: string): ParsedElement[] => {
  const lines = content.split('\n');
  const processedLines: ParsedElement[] = [];
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) return; // Skip empty lines
    
    // Handle disclaimer (starts with ⚠️)
    if (trimmedLine.startsWith('⚠️')) {
      processedLines.push({
        type: 'disclaimer',
        content: trimmedLine
      });
      return;
    }
    
    // Handle numbered lists (1. 2. 3.)
    if (trimmedLine.match(/^\d+\.\s+/)) {
      const content = trimmedLine.replace(/^\d+\.\s+/, '');
      processedLines.push({
        type: 'numbered_list',
        content: content
      });
      return;
    }
    
    // Handle bullet lists (- or *)
    if (trimmedLine.match(/^[-*]\s+/)) {
      const content = trimmedLine.replace(/^[-*]\s+/, '');
      processedLines.push({
        type: 'list',
        content: content
      });
      return;
    }
    
    // Handle headers (### without dot at the end)
    if (trimmedLine.startsWith('###')) {
      const content = trimmedLine.replace(/^###\s*/, '').replace(/\.$/, '');
      processedLines.push({
        type: 'header',
        content: content
      });
      return;
    }
    
    // Handle **Bold:** headers (bold text ending with colon and nothing else after)
    const boldHeaderMatch = trimmedLine.match(/^\*\*([^*]+)\*\*:\s*$/);
    if (boldHeaderMatch) {
      processedLines.push({
        type: 'bold_header',
        content: boldHeaderMatch[1] + ':' // Keep the colon in content
      });
      return;
    }
    
    // Handle **Bold** headers (bold text with nothing else on the line)
    const standaloneBoldMatch = trimmedLine.match(/^\*\*([^*]+)\*\*\s*$/);
    if (standaloneBoldMatch) {
      processedLines.push({
        type: 'bold_header',
        content: standaloneBoldMatch[1] // No colon for standalone bold
      });
      return;
    }
    
    // Regular text (may contain inline **bold** markdown)
    processedLines.push({
      type: 'text',
      content: trimmedLine
    });
  });
  
  return processedLines;
};

// Component to render text with inline markdown
const MarkdownText = ({ text }: { text: string }) => {
  // Split text by **bold** patterns
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.match(/^\*\*[^*]+\*\*$/)) {
          // This is bold text
          const boldText = part.slice(2, -2);
          return (
            <strong key={index} className="font-bold text-gray-900">
              {boldText}
            </strong>
          );
        }
        
        // Handle single * for italic (but not part of **)
        const italicParts = part.split(/(\*[^*]+\*)/g);
        
        return italicParts.map((italicPart, italicIndex) => {
          if (italicPart.match(/^\*[^*]+\*$/) && !part.includes('**')) {
            // Italic text
            return (
              <em key={`${index}-${italicIndex}`} className="italic text-gray-700">
                {italicPart.slice(1, -1)}
              </em>
            );
          }
          
          // Regular text
          return <span key={`${index}-${italicIndex}`}>{italicPart}</span>;
        });
      })}
    </>
  );
};

const extractDomainFromUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
};

export const MessageBubble = ({ message, index }: MessageBubbleProps) => {
  const isUser = message.sender === 'USER';
  const parsedContent = isUser ? null : parseContent(message.content);
  const hasSourceUrls = message.sourceUrls && message.sourceUrls.length > 0;
  
  if (isUser) {
    // User message with bubble (right side)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex justify-end mb-6"
      >
        <div className="max-w-xs lg:max-w-md xl:max-w-lg">
          <div className="px-4 py-3 rounded-2xl rounded-br-md bg-emerald-500 text-white shadow-sm">
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // AI message without bubble (left side)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex justify-start mb-6"
    >
      <div className="max-w-full">
        <div className="space-y-3">
          {/* Message Content */}
          {parsedContent?.map((item, idx) => (
            <div key={idx}>
              {/* Regular ### Headers */}
              {item.type === 'header' && (
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-800 bg-emerald-50 px-4 py-3 rounded-lg border-l-4 border-emerald-500">
                    <MarkdownText text={item.content} />
                  </h3>
                </div>
              )}
              
              {/* **Bold:** Headers (Green Background) */}
              {item.type === 'bold_header' && (
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-800 bg-emerald-50 px-4 py-3 rounded-lg border-l-4 border-emerald-500">
                    {item.content}
                  </h3>
                </div>
              )}
              
              {/* Regular Text with Inline Markdown */}
              {item.type === 'text' && (
                <p className="text-gray-700 leading-relaxed mb-2">
                  <MarkdownText text={item.content} />
                </p>
              )}
              
              {/* Bullet Lists */}
              {item.type === 'list' && (
                <div className="ml-4 flex items-start space-x-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed flex-1">
                    <MarkdownText text={item.content} />
                  </p>
                </div>
              )}
              
              {/* Numbered Lists */}
              {item.type === 'numbered_list' && (
                <div className="ml-4 flex items-start space-x-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center mt-1 flex-shrink-0">
                    {(() => {
                      // Calculate the actual number for this numbered item
                      let numberCount = 0;
                      for (let i = 0; i <= idx; i++) {
                        if (parsedContent[i].type === 'numbered_list') {
                          numberCount++;
                        }
                      }
                      return numberCount;
                    })()}
                  </div>
                  <p className="text-gray-700 leading-relaxed flex-1">
                    <MarkdownText text={item.content} />
                  </p>
                </div>
              )}
              
              {/* Disclaimer */}
              {item.type === 'disclaimer' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    <MarkdownText text={item.content} />
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Source URLs */}
          {hasSourceUrls && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Sumber Referensi:
              </h4>
              <div className="flex flex-wrap gap-2">
                {message.sourceUrls!.map((url, urlIndex) => (
                  <a
                    key={urlIndex}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-full border border-blue-200 transition-colors"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {extractDomainFromUrl(url)}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};