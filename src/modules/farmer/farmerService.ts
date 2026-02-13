import { farmerRepository } from "./farmerRepository.js";
const { geocodeAddress } = await import("../../shared/utils/geoCodingUtil.js");
import { throwError } from "../../shared/middleware/errorHandler.js";

export const farmerService = {
  async createProfile(userId: string, data: any) {
    const existingProfile = await farmerRepository.findByUserId(userId);
    const fullAddress = `${data.address}, ${data.city}, ${data.district}`;
    const { lat, lng } = await geocodeAddress(fullAddress);
    data.latitude = lat;
    data.longitude = lng;
    if (existingProfile) {
      throw throwError(409, "Farmer profile already exists for this user.");
    }

    return farmerRepository.create({ ...data, userId, latitude: lat, longitude: lng });
  },

  async updateProfile(userId: string, data: any) {
    const safeData = { ...data };
    delete safeData.userId;
    delete safeData.isVerified; // Prevent changing verification status directly

    const existingProfile = await farmerRepository.findByUserId(userId);
    if (!existingProfile) {
      throw throwError(404, "Farmer profile not found.");
    }

    return farmerRepository.update(userId, safeData);
  },

  async verifyFarmer(userId: string, status: boolean) {
    const existingProfile = await farmerRepository.findByUserId(userId);
    if (!existingProfile) {
      throw throwError(404, "Farmer profile not found.");
    }

    return await farmerRepository.updateVerificationStatus(userId, status);
  },
};
