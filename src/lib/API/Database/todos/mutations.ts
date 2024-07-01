'use server'
import prisma, { Prisma } from '../../Services/init/prisma';
import { GetUser } from '@/lib/API/Database/user/queries';
import { PrismaDBError } from '@/lib/utils/error';
import { todoFormValues } from '@/lib/types/validations';
import { callBlandAI } from '@/lib/API/Services/blandAi/blandai';

interface UpdateTodoPropsI extends todoFormValues {
  id: number;
}

interface DeleteTodoPropsI {
  id: number;
}

interface ActivateTodoPropsI {
  id: number;
}

export const CreateTodo = async (data: todoFormValues & { datasetIds: string[], customerCallList: string, agentId: string }) => {
  const {
    name, scheduleTime, isActive, datasetIds,
    localDialing,  answeredByEnabled, waitForGreeting,
    record, amd,  voicemailMessage,  
    pronunciationGuide, startTime, requestData, tools, webhook, calendly, customerCallList, agentId, 
  } = data;

  const user = await GetUser();
  const user_id = user?.id;
  const author = user?.display_name || '';

  const todoData: Prisma.TodoCreateInput = {
    name,
    scheduleTime: new Date(scheduleTime), // Ensure correct format
    isActive,
    user: { connect: { id: user_id } },
    author,
    localDialing,
    answeredByEnabled,
    waitForGreeting,
    record,
    amd,
    voicemailMessage,
    temperature: 0.5, // Set default value
    pronunciationGuide: pronunciationGuide || [], // Use empty array if undefined
    startTime,
    requestData: requestData || {}, // Use empty object if undefined
    tools: tools || [], // Use empty array if undefined
    webhook,
    calendly: calendly || {}, // Use empty object if undefined
    customerCallList: { connect: { id: customerCallList } }, // Correctly connect customer call list
    agent: { connect: { id: agentId } }, // Correctly connect agent
    datasets: {
      connect: datasetIds.map(id => ({ id })),
    },
  };

  try {
    // Create todo in the database
    const newTodo = await prisma.todo.create({ data: todoData });
    return newTodo; // Return the created Todo
  } catch (err) {
    PrismaDBError(err);
  }
};

export const ActivateTodo = async ({ id }: ActivateTodoPropsI) => {
  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: { isActive: true },
      include: {
        customerCallList: {
          include: { customers: true }
        },
        agent: true, // Include the agent details
        datasets : true
      }
    });

    if (!todo.customerCallList) {
      throw new Error('Customer call list not found');
    }

    if (!todo.agent) {
      throw new Error('Agent not found');
    }

    if (!todo.datasets) {
      throw new Error('Datasets not found');
    }

    const dataset = todo.datasets.map(dataset => dataset.type + ' : ' + dataset.content).join('\n'); 

    const customerData = todo.customerCallList.customers.map(customer => ({
      phone_number: customer.phone,
      task: todo.agent.prompt + "\nThis is information:\n" + dataset, // Use the agent's prompt as the task
      // Additional customer-specific data if needed
    }));

    // Call BlandAI for each customer
    for (const customer of customerData) {
      const payload = {
        phone_number: customer.phone_number,
        task: customer.task,
        model: todo.agent.model,
        language : todo.agent.language,
        voice : todo.agent.voice,
        voiceSettings : todo.voiceSettings,
        local_dialing : todo.localDialing,
        temperature: todo.temperature,
        max_duration: todo.agent.max_duration,
        answered_by_enabled: todo.answeredByEnabled,
        wait_for_greeting: todo.waitForGreeting,
        record: todo.record,
        amd: todo.amd,
        interruption_threshold: todo.agent.interruption_threshold,
        voicemail_message: todo.voicemailMessage,
        pronunciation_guide: todo.pronunciationGuide,
        start_time: todo.startTime,
        request_data: todo.requestData,
        tools: todo.tools,
        webhook: todo.webhook,
        calendly: todo.calendly
      };

      console.log(payload)
      
      await callBlandAI(payload);
    }

  } catch (err) {
    PrismaDBError(err);
  }
};

export const UpdateTodo = async (data: UpdateTodoPropsI & { datasetIds: string[], customerCallList: string, agentId: string }) => {
  const {
    id, name, scheduleTime, isActive, datasetIds,
    localDialing, answeredByEnabled, waitForGreeting,
    record, amd, voicemailMessage,
    pronunciationGuide, startTime, requestData, tools, webhook, calendly, customerCallList, agentId
  } = data;

  const user = await GetUser();
  const user_id = user?.id;
  const author = user?.display_name || '';

  const todoData: Prisma.TodoUpdateInput = {
    name,
    scheduleTime: new Date(scheduleTime), // Ensure correct format
    isActive,
    user: { connect: { id: user_id } },
    author,
    localDialing,
    answeredByEnabled,
    waitForGreeting,
    record,
    amd,
    voicemailMessage,
    temperature: 0.5, // Set default value
    pronunciationGuide: pronunciationGuide || [], // Use empty array if undefined
    startTime,
    requestData: requestData || {}, // Use empty object if undefined
    tools: tools || [], // Use empty array if undefined
    webhook,
    calendly: calendly || {}, // Use empty object if undefined
    customerCallList: { connect: { id: customerCallList } }, // Correctly connect customer call list
    agent: { connect: { id: agentId } }, // Correctly connect agent
    datasets: {
      set: datasetIds.map(id => ({ id })),
    },
  };

  try {
    await prisma.todo.update({
      where: { id },
      data: todoData,
    });
  } catch (err) {
    PrismaDBError(err);
  }
};

export const DeleteTodo = async ({ id }: DeleteTodoPropsI) => {
  try {
    await prisma.todo.delete({
      where: {
        id,
      },
    });
  } catch (err) {
    PrismaDBError(err);
  }
};
