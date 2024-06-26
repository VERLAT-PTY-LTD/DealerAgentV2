'use server';

import prisma from '../../Services/init/prisma';
import { GetUser } from '@/lib/API/Database/user/queries';
import { PrismaDBError } from '@/lib/utils/error';

export const getAllAgents = async () => {
  try {
    const user = await GetUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const agents = await prisma.agent.findMany({
      where: {
        userId: user.id,
      },
    });
    return agents;
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};
