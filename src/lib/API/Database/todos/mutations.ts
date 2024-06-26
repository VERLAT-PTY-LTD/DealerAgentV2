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

export const CreateTodo = async (data: todoFormValues & { datasetIds: string[] }) => {
  const {
    name, task, transferPhoneNumber, aiVoice, scheduleTime, isActive, datasetIds,
    model, language, localDialing, maxDuration, answeredByEnabled, waitForGreeting,
    record, amd, interruptionThreshold, voicemailMessage, transferList, metadata,
    pronunciationGuide, startTime, requestData, tools, webhook, calendly
  } = data;
  
  const user = await GetUser();
  const user_id = user?.id;
  const author = user?.display_name || '';

  const todoData: Prisma.TodoCreateInput = {
    name,
    task,
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
    transferList, // Already an object
    metadata, // Already an object
    pronunciationGuide, // Already an object
    startTime,
    requestData, // Already an object
    tools, // Already an object
    webhook,
    calendly, // Already an object
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
    });

    await callBlandAI({
      phoneNumber: todo.transferPhoneNumber,
      task: todo.task,
      model: todo.model,
      language: todo.language,
      voice: todo.aiVoice,
      localDialing: todo.localDialing,
      maxDuration: todo.maxDuration,
      answeredByEnabled: todo.answeredByEnabled,
      waitForGreeting: todo.waitForGreeting,
      record: todo.record,
      amd: todo.amd,
      interruptionThreshold: todo.interruptionThreshold,
      voicemailMessage: todo.voicemailMessage,
      temperature: todo.temperature,
      transferList: todo.transferList,
      metadata: todo.metadata,
      pronunciationGuide: todo.pronunciationGuide,
      startTime: todo.startTime,
      requestData: todo.requestData,
      tools: todo.tools,
      webhook: todo.webhook,
      calendly: todo.calendly,
    });
  } catch (err) {
    PrismaDBError(err);
  }
};

export const UpdateTodo = async (data: UpdateTodoPropsI & { datasetIds: string[] }) => {
  const {
    id, name, task, transferPhoneNumber, aiVoice, scheduleTime, isActive, datasetIds,
    model, language, localDialing, maxDuration, answeredByEnabled, waitForGreeting,
    record, amd, interruptionThreshold, voicemailMessage, transferList, metadata,
    pronunciationGuide, startTime, requestData, tools, webhook, calendly
  } = data;

  const todoData: Prisma.TodoUpdateInput = {
    name,
    task,
    transferPhoneNumber,
    aiVoice,
    scheduleTime: new Date(scheduleTime), // Ensure correct format
    isActive,
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
    transferList, // Already an object
    metadata, // Already an object
    pronunciationGuide, // Already an object
    startTime,
    requestData, // Already an object
    tools, // Already an object
    webhook,
    calendly, // Already an object
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
