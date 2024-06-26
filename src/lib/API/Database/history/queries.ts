'use server';

import prisma from '../../Services/init/prisma';
import { GetUser } from '@/lib/API/Database/user/queries';
import { PrismaDBError } from '@/lib/utils/error';

export const getAllCalls = async () => {
  try {
    const user = await GetUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const calls = await prisma.call.findMany({
      where: {
        userId: user.id,
      },
      include: {
        todo: true,
      },
    });
    return calls;
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};
