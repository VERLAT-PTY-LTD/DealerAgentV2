'use server';

import prisma from '../../Services/init/prisma';
import { GetUser } from '@/lib/API/Database/user/queries';
import { PrismaDBError } from '@/lib/utils/error';

export const createKnowledgeDataset = async (data) => {
  try {
    const user = await GetUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const dataset = await prisma.knowledgeDataset.create({
      data: {
        title: data.title,
        type: data.type,
        content: data.content,
        userId: user.id,
      },
    });
    return dataset;
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};

export const updateKnowledgeDataset = async (id, data) => {
  try {
    const dataset = await prisma.knowledgeDataset.update({
      where: { id },
      data: {
        title: data.title,
        type: data.type,
        content: data.content,
      },
    });
    return dataset;
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};

export const deleteKnowledgeDataset = async (id) => {
  try {
    await prisma.knowledgeDataset.delete({
      where: { id },
    });
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};

export const createCustomerCallList = async (data) => {
  try {
    const user = await GetUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!data.customerName || !data.customerPhone) {
      throw new Error('Customer name and phone are required');
    }

    const callList = await prisma.customerCallList.create({
      data: {
        name: data.name,
        userId: user.id,
        customers: {
          create: [
            {
              name: data.customerName,
              phone: data.customerPhone,
            },
          ],
        },
      },
      include: {
        customers: true,
      },
    });
    return callList;
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};

export const deleteCustomerCallList = async (id) => {
  try {
    await prisma.customerCallList.delete({
      where: { id },
      include: { customers: true, todos: true },
    });
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};
