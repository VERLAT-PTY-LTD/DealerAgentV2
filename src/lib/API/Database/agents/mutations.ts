'use server';

import prisma from '../../Services/init/prisma';
import { GetUser } from '@/lib/API/Database/user/queries';
import { PrismaDBError } from '@/lib/utils/error';

export const createAgent = async (data) => {
  try {
    const user = await GetUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const agent = await prisma.agent.create({
      data: {
        ...data,
        userId: user.id,
      },
    });
    return agent;
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};

export const deleteAgent = async (id) => {
  try {
    await prisma.agent.delete({
      where: { id },
    });
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};
