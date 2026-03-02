import { prisma } from "../../config/prisma.js";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  create(data: any) {
    return prisma.user.create({ data });
  },

  findProfileById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        farmerProfile: {
          select: {
            id: true,
            farmName: true,
            address: true,
            city: true,
          },
        },
      },
    });
  },

  findByIdWithPassword(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, password: true },
    });
  },

  updateProfileById(
    id: string,
    data: { fullName?: string; email?: string; password?: string },
  ) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        farmerProfile: {
          select: {
            id: true,
            farmName: true,
            address: true,
            city: true,
          },
        },
      },
    });
  },
};
