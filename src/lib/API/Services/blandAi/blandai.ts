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
    pathway_id: todo.pathwayId || 'default_pathway_id',
    start_node_id: todo.startNodeId || 'default_start_node_id',
    voice: todo.voice || 'default_voice',
    first_sentence: todo.firstSentence || 'Hello, this is your AI assistant.',
    wait_for_greeting: todo.waitForGreeting || true,
    block_interruptions: todo.blockInterruptions || true,
    interruption_threshold: todo.interruptionThreshold || 123,
    model: todo.model || 'default_model',
    temperature: todo.temperature || 0.7,
    keywords: todo.keywords || ['default'],
    pronunciation_guide: todo.pronunciationGuide || [],
    transfer_phone_number: todo.transferPhoneNumber || 'default_transfer_number',
    transfer_list: todo.transferList || {},
    language: todo.language || 'en',
    calendly: todo.calendly || {},
    timezone: todo.timezone || 'UTC',
    request_data: todo.requestData || {},
    tools: todo.tools || [],
    dynamic_data: todo.dynamicData || [],
    start_time: todo.startTime || new Date().toISOString(),
    voicemail_message: todo.voicemailMessage || 'Please leave a message.',
    voicemail_action: todo.voicemailAction || {},
    retry: todo.retry || {},
    max_duration: todo.maxDuration || 300,
    record: todo.record || true,
    from: todo.from || 'default_from_number',
    webhook: todo.webhook || 'https://default.webhook.url',
    metadata: todo.metadata || {},
    summary_prompt: todo.summaryPrompt || 'Summarize the call.',
    analysis_prompt: todo.analysisPrompt || 'Analyze the call.',
    analysis_schema: todo.analysisSchema || {},
    answered_by_enabled: todo.answeredByEnabled || true,
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
