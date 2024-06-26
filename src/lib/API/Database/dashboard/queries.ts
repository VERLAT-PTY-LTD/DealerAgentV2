// src/lib/API/Database/queries.ts
'use server';
import prisma from '../../Services/init/prisma';
import { PrismaDBError } from '@/lib/utils/error';
import { GetUser } from '@/lib/API/Database/user/queries';

export const getUserDashboardData = async () => {
  try {
    const user = await GetUser(); // Make sure GetUser is implemented correctly
    if (!user) {
      throw new Error('User not authenticated');
    }

    const agents = await prisma.agent.findMany({
      where: { userId: user.id },
      include: { todos: true },
    });

    const todos = await prisma.todo.findMany({
      where: { user_id: user.id },
      include: { calls: true },
    });

    const calls = await prisma.call.findMany({
      where: { userId: user.id },
    });

    return { agents, todos, calls };
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};
