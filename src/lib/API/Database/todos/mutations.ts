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
    name, transferPhoneNumber, aiVoice, scheduleTime, isActive, datasetIds,
    model, language, localDialing, maxDuration, answeredByEnabled, waitForGreeting,
    record, amd, interruptionThreshold, voicemailMessage, transferList, metadata,
    pronunciationGuide, startTime, requestData, tools, webhook, calendly, customerCallList, agentId
  } = data;

  const user = await GetUser();
  const user_id = user?.id;
  const author = user?.display_name || '';

  const todoData: Prisma.TodoCreateInput = {
    name,
    transferPhoneNumber,
    aiVoice,
    scheduleTime: new Date(scheduleTime), // Ensure correct format
    isActive,
    user: { connect: { id: user_id } },
    author,
    model,
    language,
    localDialing,
    maxDuration,
    answeredByEnabled,
    waitForGreeting,
    record,
    amd,
    interruptionThreshold,
    voicemailMessage,
    temperature: 0.5, // Set default value
    transferList: transferList || {}, // Use empty object if undefined
    metadata: metadata || {}, // Use empty object if undefined
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
        agent: true // Include the agent details
      }
    });

    if (!todo.customerCallList) {
      throw new Error('Customer call list not found');
    }

    if (!todo.agent) {
      throw new Error('Agent not found');
    }

    const callData = todo.customerCallList.customers.map(customer => ({
      phone_number: customer.phone,
      task: todo.agent.prompt, // Use the agent's prompt as the task
      // Additional customer-specific data if needed
    }));

    const payload = {
      base_prompt: todo.agent.prompt, // Use the agent's prompt as the base prompt
      call_data: callData,
      from: todo.transferPhoneNumber,
      label: todo.name,
      campaign_id: todo.id,
      test_mode: false, // Set to true if testing
    };

    await callBlandAI(payload);
  } catch (err) {
    PrismaDBError(err);
  }
};

export const UpdateTodo = async (data: UpdateTodoPropsI & { datasetIds: string[], customerCallList: string, agentId: string }) => {
  const {
    id, name, transferPhoneNumber, aiVoice, scheduleTime, isActive, datasetIds,
    model, language, localDialing, maxDuration, answeredByEnabled, waitForGreeting,
    record, amd, interruptionThreshold, voicemailMessage, transferList, metadata,
    pronunciationGuide, startTime, requestData, tools, webhook, calendly, customerCallList, agentId
  } = data;

  const user = await GetUser();
  const user_id = user?.id;
  const author = user?.display_name || '';

  const todoData: Prisma.TodoUpdateInput = {
    name,
    transferPhoneNumber,
    aiVoice,
    scheduleTime: new Date(scheduleTime), // Ensure correct format
    isActive,
    user: { connect: { id: user_id } },
    author,
    model,
    language,
    localDialing,
    maxDuration,
    answeredByEnabled,
    waitForGreeting,
    record,
    amd,
    interruptionThreshold,
    voicemailMessage,
    temperature: 0.5, // Set default value
    transferList: transferList || {}, // Use empty object if undefined
    metadata: metadata || {}, // Use empty object if undefined
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
