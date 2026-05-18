import { PrismaNeon } from "@prisma/adapter-neon";
import config from "../config/config.js";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaNeon({
    connectionString: config.databaseUrl
});

export const prisma = new PrismaClient({ adapter });