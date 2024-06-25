'use server';

import prisma, { Prisma } from '../../Services/init/prisma';
import { GetUser } from '@/lib/API/Database/user/queries';
import { PrismaDBError } from '@/lib/utils/error';
import { todoFormValues } from '@/lib/types/validations';

interface UpdateTodoPropsI extends todoFormValues {
  id: number;
}

interface DeleteTodoPropsI {
  id: number;
}

export const CreateTodo = async (data: todoFormValues & { datasetIds: string[] }) => {
  const { name, task, transferPhoneNumber, aiVoice, metadataKey, metadataValue, scheduleTime, isActive, datasetIds } = data;
  
  const user = await GetUser();
  const user_id = user?.id;
  const author = user?.display_name || '';

  const todoData: Prisma.TodoCreateInput = {
    name,
    task,
    transferPhoneNumber,
    aiVoice,
    metadataKey,
    metadataValue,
    scheduleTime: new Date(scheduleTime), // Ensure correct format
    isActive,
    user: { connect: { id: user_id } },
    author,
    datasets: {
      connect: datasetIds.map(id => ({ id })),
    },
  };

  try {
    await prisma.todo.create({ data: todoData });
  } catch (err) {
    PrismaDBError(err);
  }
};

export const UpdateTodo = async (data: UpdateTodoPropsI & { datasetIds: string[] }) => {
  const { id, name, task, transferPhoneNumber, aiVoice, metadataKey, metadataValue, scheduleTime, isActive, datasetIds } = data;

  const todoData: Prisma.TodoUpdateInput = {
    name,
    task,
    transferPhoneNumber,
    aiVoice,
    metadataKey,
    metadataValue,
    scheduleTime: new Date(scheduleTime), // Ensure correct format
    isActive,
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
