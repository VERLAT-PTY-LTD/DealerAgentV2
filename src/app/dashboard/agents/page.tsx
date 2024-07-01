'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { createAgent, deleteAgent, listAgents, listVoices } from '@/lib/API/Services/blandAi/blandai';
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
      const updatedAgents = await listAgents();
      setAgents(updatedAgents);

      // Reset form fields
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
              onChange={(e) => setAgentName(e.target.value)}
            />
            <Textarea
              placeholder="Enter agent prompt"
              className="min-h-[18rem] mb-4"
              value={agentPrompt}
              onChange={(e) => setAgentPrompt(e.target.value)}
            />
            <input
              type="text"
              placeholder="First Sentence"
              className="w-full mb-4 p-2 border"
              value={firstSentence}
              onChange={(e) => setFirstSentence(e.target.value)}
            />
            <select
              className="w-full mb-4 p-2 border"
              value={agentVoice}
              onChange={(e) => setAgentVoice(e.target.value)}
            >
              <option value="" disabled>Select Voice</option>
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id}>{voice.name}</option>
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
                      <h2 className="font-bold">Agent ID : {agent.agent_id}</h2>
                      <p>Prompt: {agent.prompt}</p>
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
