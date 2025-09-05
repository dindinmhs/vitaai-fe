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

const parseContent = (content: string) => {
  // Split content by lines and process each line
  const lines = content.split('\n');
  const processedLines: { type: 'text' | 'bold' | 'list' | 'header', content: string }[] = [];
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    if (!trimmedLine) return; // Skip empty lines
    
    // Handle text with **word** inside regular text
    if (trimmedLine.includes('**') && !trimmedLine.startsWith('**')) {
      // Replace **word** with processed segments
      const segments = trimmedLine.split(/(\*\*[^*]+\*\*)/g);
      let hasProcessedSegments = false;
      
      segments.forEach(segment => {
        if (segment.match(/^\*\*[^*]+\*\*$/)) {
          // This is a bold segment
          processedLines.push({
            type: 'header',
            content: segment.slice(2, -2)
          });
          hasProcessedSegments = true;
        } else if (segment.trim()) {
          // This is regular text
          processedLines.push({
            type: 'text',
            content: segment.trim()
          });
          hasProcessedSegments = true;
        }
      });
      
      if (hasProcessedSegments) return;
    }
    
    // Pattern: **Text** (standalone headers)
    if (trimmedLine.match(/^\*\*[^*]+\*\*$/)) {
      processedLines.push({
        type: 'header',
        content: trimmedLine.slice(2, -2)
      });
    }
    // Pattern: **Text:** or **Text**, (headers with colon or comma)
    else if (trimmedLine.match(/^\*\*[^*]+\*\*[,:]\s*(.*)/)) {
      const match = trimmedLine.match(/^\*\*([^*]+)\*\*[,:]\s*(.*)/);
      if (match) {
        processedLines.push({
          type: 'header',
          content: match[1].trim()
        });
        if (match[2]) {
          processedLines.push({
            type: 'text',
            content: match[2]
          });
        }
      }
    }
    // Pattern: *Text**: or *Text**,
    else if (trimmedLine.match(/^\*[^*]+\*\*[,:]\s*(.*)/)) {
      const match = trimmedLine.match(/^\*([^*]+)\*\*[,:]\s*(.*)/);
      if (match) {
        processedLines.push({
          type: 'header',
          content: match[1].trim()
        });
        if (match[2]) {
          processedLines.push({
            type: 'text',
            content: match[2]
          });
        }
      }
    }
    // Pattern: List items with *   or - 
    else if (trimmedLine.match(/^(\*\s{3}|- )/)) {
      const content = trimmedLine.startsWith('*   ') ? trimmedLine.slice(4) : trimmedLine.slice(2);
      processedLines.push({
        type: 'list',
        content: content.trim()
      });
    }
    // Pattern: Any text starting with * (but not ** or list)
    else if (trimmedLine.startsWith('*') && !trimmedLine.startsWith('**')) {
      processedLines.push({
        type: 'bold',
        content: trimmedLine.slice(1).trim()
      });
    }
    // Regular text
    else {
      processedLines.push({
        type: 'text',
        content: trimmedLine
      });
    }
  });
  
  return processedLines;
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
              {item.type === 'header' && (
                <div className="mb-3">
                  <h3 className="text-base font-bold text-gray-800 bg-emerald-50 px-3 py-2 rounded-lg border-l-4 border-emerald-500">
                    {item.content}
                  </h3>
                </div>
              )}
              
              {item.type === 'bold' && (
                <p className="font-semibold text-gray-800 mb-2">
                  {item.content}
                </p>
              )}
              
              {item.type === 'text' && (
                <p className="text-gray-700 leading-relaxed mb-2">
                  {item.content}
                </p>
              )}
              
              {item.type === 'list' && (
                <div className="ml-4 flex items-start space-x-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed flex-1">
                    {item.content}
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