import { geocodeAddress } from "../../shared/utils/geoCodingUtil.js";
import { farmerRepository } from "../farmer/farmerRepository.js";

export async function searchLocation(address: string) {
  try {
    return await geocodeAddress(address);
  } catch (error) {
    throw new Error("Error in geocoding address: " + (error as Error).message);
  }
}

export async function searchNearbyFarmers(address: string, radius: number) {
  const location = await searchLocation(address);
  if (!location) {
    throw new Error("Could not find location for the given address.");
  }
  return farmerRepository.findNearbyFarmers(location.lat, location.lng, radius);
}
