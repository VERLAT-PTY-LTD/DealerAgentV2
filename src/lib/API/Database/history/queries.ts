'use server';

import prisma from '../../Services/init/prisma';
import { GetUser } from '@/lib/API/Database/user/queries'; // Ensure this import is correct
import { PrismaDBError } from '@/lib/utils/error';

export const getAllCalls = async () => {
  try {
    const user = await GetUser(); // Fetch the user based on session
    if (!user) {
      throw new Error('User not authenticated'); // Handle case where no user is found
    }

    const calls = await prisma.call.findMany({
      where: {
        userId: user.id, // Fetch only calls that belong to the authenticated user
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

export const getCallById = async (id) => {
  try {
    const user = await GetUser(); // Fetch the user based on session
    if (!user) {
      throw new Error('User not authenticated'); // Handle case where no user is found
    }

    const call = await prisma.call.findUnique({
      where: {
        id,
        userId: user.id, // Ensure that call can only be fetched by its owner
      },
      include: {
        todo: true,
      },
    });
    return call;
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};
