'use server';

import prisma from '../../Services/init/prisma';
import { GetUser } from '@/lib/API/Database/user/queries';
import { PrismaDBError } from '@/lib/utils/error';

export const createCall = async (data) => {
  try {
    const user = await GetUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const call = await prisma.call.create({
      data: {
        customerName: data.customerName,
        recording: data.recording,
        transcript: data.transcript,
        todoId: data.todoId,
        dateTime: data.dateTime,
        duration: data.duration,
        userId: user.id,
      },
    });
    return call;
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};

export const deleteCall = async (id) => {
  try {
    await prisma.call.delete({
      where: { id },
    });
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};
