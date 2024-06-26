'use server'

import blandai from '@/lib/API/Services/init/blandai';
import { GetUser } from '@/lib/API/Database/user/queries';
import { BlandAIError } from '@/lib/utils/error';

// Define functions for each API endpoint

export const callBlandAI = async (todo) => {
    const user = await GetUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
  
    const payload = {
      phone_number: todo.phoneNumber,
      task: todo.task,
      model: todo.model || 'enhanced',
      language: todo.language || 'en',
      voice: todo.voice || 'nat',
      voice_settings: todo.voiceSettings || {},
      local_dialing: todo.localDialing || false,
      max_duration: todo.maxDuration || 12,
      answered_by_enabled: todo.answeredByEnabled || false,
      wait_for_greeting: todo.waitForGreeting || false,
      record: todo.record || false,
      amd: todo.amd || false,
      interruption_threshold: todo.interruptionThreshold || 100,
      voicemail_message: todo.voicemailMessage || null,
      temperature: todo.temperature || null,
      transfer_list: todo.transferList || {},
      metadata: todo.metadata || {},
      pronunciation_guide: todo.pronunciationGuide || [],
      start_time: todo.startTime || null,
      request_data: todo.requestData || {},
      tools: todo.tools || [],
      webhook: todo.webhook || null,
      calendly: todo.calendly || {},
    };
  
    try {
      const response = await blandai.post('/v1/calls', payload, {
        headers: {
          'Authorization': `Bearer ${process.env.BLAND_AI_API_KEY}`,
        },
      });
      return response.data;
    } catch (error) {
      BlandAIError(error);
    }
  };
export const analyzeCall = async (callId: string) => {
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BLAND_AI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      goal: 'analyze',
      questions: [['What insights can you provide from this call?']]
    })
  };

  try {
    const response = await blandai.post(`/v1/calls/${callId}/analyze`, options);
    return response.data;
  } catch (error) {
    BlandAIError(error);
  }
};

export const listCalls = async () => {
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.BLAND_AI_API_KEY}`
    }
  };

  try {
    const response = await blandai.get('/v1/calls', options);
    return response.data;
  } catch (error) {
    BlandAIError(error);
  }
};

export const getRecording = async (callId: string) => {
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.BLAND_AI_API_KEY}`
    }
  };

  try {
    const response = await blandai.get(`/v1/calls/${callId}/recording`, options);
    return response.data;
  } catch (error) {
    BlandAIError(error);
  }
};

export const correctCall = async (callId: string) => {
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.BLAND_AI_API_KEY}`
    }
  };

  try {
    const response = await blandai.get(`/v1/calls/${callId}/correct`, options);
    return response.data;
  } catch (error) {
    BlandAIError(error);
  }
};

export const listVoices = async () => {
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.BLAND_AI_API_KEY}`
    }
  };

  try {
    const response = await blandai.get('/v1/voices', options);
    return response.data;
  } catch (error) {
    BlandAIError(error);
  }
};

export const stopCall = async (callId: string) => {
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BLAND_AI_API_KEY}`
    }
  };

  try {
    const response = await blandai.post(`/v1/calls/${callId}/stop`, options);
    return response.data;
  } catch (error) {
    BlandAIError(error);
  }
};
