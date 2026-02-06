import axios from "axios";

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

export async function geocodeAddress(address: string) {
  const url = "https://api.opencagedata.com/geocode/v1/json";

  const response = await axios.get(url, {
    params: {
      q: address,
      key: OPENCAGE_API_KEY,
      limit: 1
    }
  });

  if (!response.data.results.length) {
    throw new Error("Location not found");
  }

  const { lat, lng } = response.data.results[0].geometry;

  return { lat, lng };
}
