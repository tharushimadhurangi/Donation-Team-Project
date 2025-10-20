// config/paypal.js
import dotenv from "dotenv";
dotenv.config();

export const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT_ID;
export const PAYPAL_SECRET = process.env.PAYPAL_CLIENT_SECRET;
export const PAYPAL_BASE = "https://api-m.sandbox.paypal.com";
