import { drizzle } from 'drizzle-orm/d1';
export const getDB = (platform: Readonly<App.Platform>) => drizzle(platform.env.DB);