import { KiwiClient } from "./client";
import { env } from "./env";

import mongoose from "mongoose";

export class DatabaseManager {
    public client: KiwiClient;
    private connection: mongoose.Connection;

    constructor(client: KiwiClient) {
        this.client = client;
    }

    async connect() {
        console.log("Connecting to database");
        this.connection = (await mongoose.connect(env.DATABASE_URL)).connection;
        console.log("Connected to database");
        console.log(this.connection)
    }
}