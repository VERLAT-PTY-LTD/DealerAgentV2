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

export const CreateTodo = async ({ name, task, transferPhoneNumber, aiVoice, metadataKey, metadataValue }: todoFormValues) => {
  const user = await GetUser();
  const user_id = user?.id;
  const author = user?.display_name || '';
  const data: Prisma.TodoCreateInput = {
    name,
    task,
    transferPhoneNumber,
    aiVoice,
    metadataKey,
    metadataValue,
    user: { connect: { id: user_id } },
    author
  };

  try {
    await prisma.todo.create({ data });
  } catch (err) {
    PrismaDBError(err);
  }
};


export const UpdateTodo = async ({ id, name, task, transferPhoneNumber, aiVoice, metadataKey, metadataValue }: UpdateTodoPropsI) => {
  const data: Prisma.TodoUpdateInput = {
    name,
    task,
    transferPhoneNumber,
    aiVoice,
    metadataKey,
    metadataValue
  };

  try {
    await prisma.todo.update({
      where: { id },
      data
    });
  } catch (err) {
    PrismaDBError(err);
  }
};


export const DeleteTodo = async ({ id }: DeleteTodoPropsI) => {
  try {
    await prisma.todo.delete({
      where: {
        id
      }
    });
  } catch (err) {
    PrismaDBError(err);
  }
};
