import { resolve } from "path";
import dotenv from "dotenv";
dotenv.config({ path: resolve(__dirname, "..", ".env") });

export const env = {
    CLIENT_ID: process.env.CLIENT_ID as string,
    CLIENT_TOKEN: process.env.CLIENT_TOKEN as string,

    STAFF: process.env.STAFF as string,
    PREFIX: process.env.PREFIX as string,

    DATABASE_URL: process.env.DATABASE_URL as string,
}
