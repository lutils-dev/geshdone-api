import { config } from 'dotenv';

config();

export const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`,
  scope: ['profile', 'email']
};
