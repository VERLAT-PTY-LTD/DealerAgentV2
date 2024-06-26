'use server';

import prisma from '../../Services/init/prisma';
import { GetUser } from '@/lib/API/Database/user/queries';
import { PrismaDBError } from '@/lib/utils/error';

export const getKnowledgeDatasetById = async (id) => {
  try {
    const user = await GetUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const dataset = await prisma.knowledgeDataset.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    return dataset;
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};

export const getAllKnowledgeDatasets = async () => {
  try {
    const user = await GetUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const datasets = await prisma.knowledgeDataset.findMany({
      where: {
        userId: user.id,
      },
    });
    return datasets;
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};

export const getCustomerCallListById = async (id) => {
  try {
    const user = await GetUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const callList = await prisma.customerCallList.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });
    return callList;
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};

export const getAllCustomerCallLists = async () => {
  try {
    const user = await GetUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const callLists = await prisma.customerCallList.findMany({
      where: {
        userId: user.id,
      },
    });
    return callLists;
  } catch (err) {
    PrismaDBError(err);
    throw err;
  }
};
