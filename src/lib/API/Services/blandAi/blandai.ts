'use server'

import blandai from '@/lib/API/Services/init/blandai';
import { GetUser } from '@/lib/API/Database/user/queries';
import { BlandAIError } from '@/lib/utils/error';

// Define functions for each API endpoint

const getAuthHeaders = () => ({
  'Authorization': `${process.env.BLAND_AI_API_KEY}`,
  'Content-Type': 'application/json'
});

export const callBlandAI = async (payload) => {
  try {
    const headers = {
      'Authorization': `Bearer ${process.env.BLAND_AI_API_KEY}`,
      'Content-Type': 'application/json'
    };

    const response = await blandai.post('/v1/calls', payload, { headers });
    return response.data;
  } catch (error) {
    BlandAIError(error);
  }
};

export const analyzeCall = async (callId) => {
  try {
    const user = await GetUser();
    if (!user) throw new Error('User not authenticated');

    const payload = {
      goal: 'analyze',
      questions: [['What insights can you provide from this call?']],
    };

    const response = await blandai.post(`/v1/calls/${callId}/analyze`, payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    BlandAIError(error);
  }
};

export const listCalls = async (startDate, endDate) => {
  try {
    const user = await GetUser();
    if (!user) throw new Error('User not authenticated');

    const queryParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      limit: '1000',
    });

    const headers = getAuthHeaders();
    console.log('Fetching calls from BlandAI API with params:', queryParams.toString());
    console.log('Authorization headers for listCalls:', headers);

    const response = await blandai.get(`/v1/calls?${queryParams.toString()}`, { headers });
    console.log('Full BlandAI API Response:', JSON.stringify(response.data, null, 2));

    return response.data.calls || [];
  } catch (error) {
    BlandAIError(error);
    throw error;
  }
};

export const getRecording = async (callId) => {
  try {
    const headers = getAuthHeaders();
    console.log(`Fetching recording for call ID: ${callId} with headers:`, headers);

    const response = await blandai.get(`/v1/calls/${callId}/recording`, { headers });
    console.log('Recording fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching recording:', error.response ? error.response.data : error.message);
    throw new Error(`Bland AI API call failed: ${error.message}`);
  }
};

export const correctCall = async (callId) => {
  try {
    const headers = getAuthHeaders();
    console.log(`Fetching corrected transcript for call ID: ${callId} with headers:`, headers);

    const response = await blandai.get(`/v1/calls/${callId}/correct`, { headers });
    console.log('Corrected transcript fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching corrected transcript:', error);
    throw new Error(`Bland AI API call failed: ${error.message}`);
  }
};

export const getTranscript = async (callId) => {
  try {
    console.log('Fetching transcript for call ID:', callId);
    const response = await blandai.post(`/v1/calls/correct`, {
      call_id: callId
    }, {
      headers: getAuthHeaders(),
    });
    console.log('Transcript fetched successfully:', response.data);

    if (response.data.status === 'processing') {
      console.log('Transcript is still processing.');
      return { status: 'processing' };
    }

    const { corrected, aligned, original } = response.data;

    if (!corrected || !aligned || !original) {
      console.log('Transcript data is not yet available.');
      return { status: 'not available' };
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching transcript:', error.response ? error.response.data : error.message);
    throw new Error(`Bland AI API call failed: ${error.message}`);
  }
};

export const listVoices = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await blandai.get('/v1/voices', { headers });
    return response.data.voices;
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw new Error(`Bland AI API call failed: ${error.message}`);
  }
};

export const stopCall = async (callId) => {
  try {
    const response = await blandai.post(`/v1/calls/${callId}/stop`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    BlandAIError(error);
  }
};

export const createAgent = async (agentData) => {
  try {
    const user = await GetUser();
    if (!user) throw new Error('User not authenticated');

    const payload = {
      name: agentData.name,
      prompt: agentData.prompt,
      voice: agentData.voice,
      analysis_schema: agentData.analysisSchema || {},
      metadata: agentData.metadata || {},
      pathway_id: agentData.pathwayId,
      language: agentData.language || 'en',
      model: agentData.model || 'base',
      first_sentence: agentData.firstSentence,
      tools: agentData.tools || [],
      dynamic_data: agentData.dynamicData || {},
      interruption_threshold: agentData.interruptionThreshold || 100,
      max_duration: agentData.maxDuration || 12,
    };

    console.log('Creating agent in BlandAI with payload:', payload);
    const blandAIResponse = await blandai.post('/v1/agents', payload, {
      headers: getAuthHeaders(),
    });
    console.log('Agent created in BlandAI:', blandAIResponse.data);

    const dbPayload = {
      name: agentData.name,
      prompt: agentData.prompt,
      voice: agentData.voice,
      first_sentence: agentData.firstSentence,
      user: {
        connect: { id: user.id }
      }
    };
    const dbResponse = await saveAgentToDatabase(dbPayload);
    console.log('Agent saved to DB:', dbResponse);

    return blandAIResponse.data;
  } catch (error) {
    BlandAIError(error);
    throw error;
  }
};

const saveAgentToDatabase = async (agentData) => {
  return await prisma.agent.create({ data: agentData });
};

export const updateAgent = async (agentId, agentData) => {
  try {
    const user = await GetUser();
    if (!user) throw new Error('User not authenticated');

    const payload = {
      prompt: agentData.prompt,
      voice: agentData.voice,
      analysis_schema: agentData.analysisSchema || {},
      metadata: agentData.metadata || {},
      pathway_id: agentData.pathwayId,
      language: agentData.language || 'en',
      webhook: agentData.webhook,
      model: agentData.model || 'default_model',
      first_sentence: agentData.firstSentence,
      tools: agentData.tools || [],
      dynamic_data: agentData.dynamicData || {},
      interruption_threshold: agentData.interruptionThreshold || 100,
      max_duration: agentData.maxDuration || 12,
    };

    const response = await blandai.post(`/v1/agents/${agentId}`, payload, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    BlandAIError(error);
    throw error;
  }
};

export const authorizeAgent = async (agentId) => {
  try {
    const user = await GetUser();
    if (!user) throw new Error('User not authenticated');

    const response = await blandai.post(`/v1/agents/${agentId}/authorize`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    BlandAIError(error);
    throw error;
  }
};

export const deleteAgent = async (agentId) => {
  try {
    const user = await GetUser();
    if (!user) throw new Error('User not authenticated');

    const response = await blandai.post(`/v1/agents/${agentId}/delete`, {}, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    BlandAIError(error);
    throw error;
  }
};

export const listAgents = async () => {
  try {
    const headers = getAuthHeaders();
    const response = await blandai.get('/v1/agents', { headers });
    return response.data.agents || [];
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw new Error(`Bland AI API call failed: ${error.message}`);
  }
};
