'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { createAgent, deleteAgent, listAgents } from '@/lib/API/Services/blandAi/blandai';
import { listVoices } from '@/lib/API/Services/blandAi/blandai';
import { Textarea } from '@/components/ui/Textarea';

export default function AgentPage() {
  const [agents, setAgents] = useState([]);
  const [agentName, setAgentName] = useState('');
  const [agentPrompt, setAgentPrompt] = useState('');
  const [agentVoice, setAgentVoice] = useState('');
  const [firstSentence, setFirstSentence] = useState('');
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const allAgents = await listAgents();
        console.log('Agents fetched from BlandAI:', allAgents);
        setAgents(allAgents);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    const fetchVoices = async () => {
      try {
        const allVoices = await listVoices();
        setVoices(allVoices);
      } catch (error) {
        console.error('Error fetching voices:', error);
      }
    };

    fetchAgents();
    fetchVoices();
  }, []);

  const handleAgentNameChange = (event) => setAgentName(event.target.value);
  const handleAgentPromptChange = (event) => setAgentPrompt(event.target.value);
  const handleAgentVoiceChange = (event) => setAgentVoice(event.target.value);
  const handleFirstSentenceChange = (event) => setFirstSentence(event.target.value);

  const handleSubmitAgent = async (event) => {
    event.preventDefault();
    const newAgent = {
      name: agentName,
      prompt: agentPrompt,
      voice: agentVoice,
      firstSentence: firstSentence
    };

    try {
      const createdAgent = await createAgent(newAgent);
      console.log('Agent created:', createdAgent);

      // Fetch agents again to update the UI
      const updatedAgents = await listAgents();
      setAgents(updatedAgents);

      setAgentName('');
      setAgentPrompt('');
      setAgentVoice('');
      setFirstSentence('');
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  const handleDeleteAgent = async (id) => {
    try {
      await deleteAgent(id);
      setAgents(agents.filter(agent => agent.agent_id !== id));
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  };

  return (
    <div className="mb-24">
      <h2 className="text-2xl mb-4 font-bold">Agents</h2>
      <Separator />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-2">Add New Agent:</h1>
          <form onSubmit={handleSubmitAgent} className="h-full">
            <input
              type="text"
              placeholder="Agent Name"
              className="w-full mb-4 p-2 border"
              value={agentName}
              onChange={handleAgentNameChange}
            />
            <Textarea
              placeholder="Enter agent prompt"
              className="min-h-[18rem] mb-4"
              value={agentPrompt}
              onChange={handleAgentPromptChange}
            />
            <input
              type="text"
              placeholder="First Sentence"
              className="w-full mb-4 p-2 border"
              value={firstSentence}
              onChange={handleFirstSentenceChange}
            />
            <select
              className="w-full mb-4 p-2 border"
              value={agentVoice}
              onChange={handleAgentVoiceChange}
            >
              <option value="" disabled>Select Voice</option>
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name}
                </option>
              ))}
            </select>
            <Button type="submit">Add Agent</Button>
          </form>
        </div>
        <div className="col-span-2">
          <h1 className="text-xl font-bold tracking-tight mb-2">Existing Agents:</h1>
          <div className="space-y-4">
            {agents.length > 0 ? (
              agents.map((agent) => (
                <div key={agent.agent_id} className="rounded-md border bg-muted p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-bold">{agent.name}</h2>
                      <pre>{agent.prompt}</pre>
                      <p>Voice: {agent.voice}</p>
                      <p>First Sentence: {agent.first_sentence}</p>
                    </div>
                    <Button variant="destructive" onClick={() => handleDeleteAgent(agent.agent_id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p>No agents added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
