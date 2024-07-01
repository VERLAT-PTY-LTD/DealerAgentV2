import { PrismaDBError } from '@/lib/utils/error';
import { GetUser } from '../user/queries';
import prisma from '../../Services/init/prisma';
import { Todo } from '@prisma/client';
import { cache } from 'react';

export const GetTodosByUserId = cache(async (): Promise<Todo[]> => {
  const user = await GetUser();
  const user_id = user?.id;

  try {
    const todos = await prisma.todo.findMany({
      where: {
        user_id
      },
      include: {
        customerCallList: {
          include: { customers: true }
        },
        agent: true, // Include the agent details
        datasets : true
      }
    });

    return todos;
  } catch (err) {
    PrismaDBError(err);
  }
});

export const GetTodoById = cache(async (id: number): Promise<Todo> => {
  try {
    const todo = await prisma.todo.findFirst({
      where: {
        id
      },
      include: {
        customerCallList: {
          include: { customers: true }
        },
        agent: true, // Include the agent details
        datasets : true
      }
    });

    return todo;
  } catch (err) {
    PrismaDBError(err);
  }
});

export const GetAllTodos = cache(async (): Promise<Todo[]> => {
  try {
    const todos = await prisma.todo.findMany({
      take: 10,
      include: {
        customerCallList: {
          include: { customers: true }
        },
        agent: true, // Include the agent details
        datasets : true
      }
    });

    return todos;
  } catch (err) {
    PrismaDBError(err);
  }
});
