'use client'

import { useState, FormEvent, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendIcon, EditIcon, UserCircle, Bot } from 'lucide-react'

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'advisor';
  timestamp: Date;
}

export function Chatbot({ advisor, userData }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editableBubbles, setEditableBubbles] = useState(['', '', '']);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);

  const generateSuggestions = useCallback(async () => {
    console.log('API Call: generateSuggestions');
    setIsLoadingPrompts(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          route: 'generate-chat-bubbles',
          userData,
          conversationHistory: messages.map(m => `${m.sender}: ${m.text}`).join('\n')
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Split the result into an array of suggestions
      const suggestions = data.result.split('||').map(s => s.trim());
      setEditableBubbles(suggestions);
    } catch (error) {
      console.error('Error in generateSuggestions:', error);
      setError('Failed to get suggestions. Please try again.');
      setEditableBubbles(['Error loading prompts', 'Please try again', '']);
    } finally {
      setIsLoadingPrompts(false);
    }
  }, [messages, userData]);

  const getAdvisorResponse = useCallback(async (text: string) => {
    console.log('API Call: getAdvisorResponse');
    setIsLoading(true);
    setError(null);

    const newMessage: Message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          route: 'mimic-advisor',
          userData,
          conversationHistory: newMessages.map(m => `${m.sender}: ${m.text}`).join('\n')
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const advisorMessage: Message = {
        id: Date.now(),
        text: data.result,
        sender: 'advisor',
        timestamp: new Date()
      };
      setMessages([...newMessages, advisorMessage]);

      // Generate new suggestions after advisor's response
      generateSuggestions();
    } catch (error) {
      console.error('Error in getAdvisorResponse:', error);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [messages, userData, generateSuggestions]);

  useEffect(() => {
    // Generate initial prompts when the component mounts
    if (messages.length === 0) {
      generateSuggestions();
    }
  }, [generateSuggestions, messages]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      getAdvisorResponse(input.trim());
    }
  }

  const handleBubbleClick = (text: string) => {
    getAdvisorResponse(text);
  }

  const handleBubbleEdit = (index: number, newText: string) => {
    const newBubbles = [...editableBubbles];
    newBubbles[index] = newText;
    setEditableBubbles(newBubbles);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chat with {advisor.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages.map(message => (
            <div key={message.id} className="mb-4">
              <div className="flex items-center mb-1">
                {message.sender === 'user' ? (
                  <UserCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Bot className="w-4 h-4 mr-2" />
                )}
                <span className="text-xs font-semibold">
                  {message.sender === 'user' ? 'You' : 'Financial Advisor'}
                </span>
                <span className="text-xs ml-2 text-gray-500">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex">
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {message.text}
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <div className="grid grid-cols-3 gap-2 mb-4 w-full">
          {editableBubbles.map((bubble, index) => (
            <div key={index} className="relative group">
              <Button
                variant="outline"
                className="w-full h-auto py-2 px-3 text-left flex flex-col items-start justify-start"
                onClick={() => handleBubbleClick(bubble)}
                disabled={isLoadingPrompts || !bubble}
              >
                {isLoadingPrompts ? (
                  <span className="text-xs break-words whitespace-pre-wrap">Loading...</span>
                ) : (
                  <span className="text-xs break-words whitespace-pre-wrap">{bubble}</span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 w-6 h-6 p-1 bg-background border border-input opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  const newText = prompt('Edit message:', bubble);
                  if (newText) handleBubbleEdit(index, newText);
                }}
                disabled={isLoadingPrompts}
              >
                <EditIcon className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex w-full">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" className="ml-2" disabled={isLoading}>
            {isLoading ? 'Sending...' : <SendIcon className="w-4 h-4" />}
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}