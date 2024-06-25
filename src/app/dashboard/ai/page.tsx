'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

import { AIInstructions } from './_PageSections/AIInstructions';  // Import the new component

import { Message, useChat } from 'ai/react';

export default function PlaygroundPage() {
  const { messages, input, handleInputChange, handleSubmit, stop, setMessages } = useChat();
  const [instructions, setInstructions] = useState(''); // Add state for instructions

  const emptyMessage: Message[] = [
    {
      id: 'empty34d345',
      createdAt: new Date('2024-02-08T00:57:54.306Z'),
      content: '',
      role: 'system'
    }
  ];

  const getCurrentRole = (role: string) => {
    if (role === 'system') return;
    return messages.length > 1 && role.toUpperCase();
  };

  const handleInstructionsChange = (event) => {
    setInstructions(event.target.value);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow flex">
        <div className="w-1/4 p-4 border-r">
          <h2 className="text-2xl mb-4 font-bold">Playground</h2>
          <AIInstructions instructions={instructions} handleInstructionsChange={handleInstructionsChange} />
        </div>
        <div className="flex-grow p-4 flex flex-col">
          <h1 className="text-xl font-bold tracking-tight mb-2">Output:</h1>
          <div className="flex-grow rounded-md border bg-muted overflow-y-scroll p-4 mb-4">
            {messages.map((m) => (
              <div key={m.id} className="mt-2 whitespace-pre-wrap">
                <div className="font-bold">{getCurrentRole(m.role)}</div>
                {m.content}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <Textarea
            placeholder="Submit some text to generate an AI Response"
            className="flex-grow min-h-[3rem]"
            value={input}
            onChange={handleInputChange}
          />
          <Button type="submit">Submit</Button>
          <Button onClick={() => setMessages(emptyMessage)} variant="secondary">
            Reset
          </Button>
          <Button onClick={() => stop()} variant="destructive">
            Stop
          </Button>
        </form>
      </div>
    </div>
  );
}
