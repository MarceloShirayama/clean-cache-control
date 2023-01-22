import dotenv from "dotenv";

dotenv.config();

export const config = {
  cacheExpirationInDays: Number(process.env.CACHE_EXPIRATION_IN_DAYS),
};
