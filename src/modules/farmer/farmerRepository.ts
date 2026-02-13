import { prisma } from "../../config/prisma.js";

export const farmerRepository = {
  async create(data: any) {
    return prisma.farmerProfile.create({ data });
  },

  async update(userId: string, data: any) {
    return prisma.farmerProfile.update({
      where: { userId },
      data,
    });
  },

  async findByUserId(userId: string) {
    return prisma.farmerProfile.findUnique({
      where: { userId },
    });
  },

  async updateVerificationStatus(userId: string, isVerified: boolean) {
    return prisma.farmerProfile.update({
      where: { userId },
      data: { isVerified },
    });
  },

  async findNearbyFarmers(latitude: number, longitude: number, radius: number) {
    // Haversine formula in a raw SQL query to find nearby farmers
    // The earth's radius is approximately 6371 kilometers.
    return prisma.$queryRaw<any[]>
      `SELECT * FROM (
        SELECT
          *,
          (
            6371 * acos(
              cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude))
            )
          ) AS distance
        FROM "FarmerProfile"
      ) AS subquery
      WHERE distance < ${radius}
      ORDER BY distance`;
  },
};
