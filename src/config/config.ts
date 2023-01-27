require("dotenv").config();

export const CONFIG = {
  BITGET_API_KEY: process.env.API_KEY || "",
  BITGET_API_SECRET: process.env.API_SECRET || "",
  BITGET_API_PASSPHRASE: process.env.API_PASSPHRASE || "",
};
