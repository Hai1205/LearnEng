import { MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGO_URI || "";

if (!MONGO_URI) {
    throw new Error("Please define MONGODB_URI in your environment variables");
}

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(MONGO_URI, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(MONGO_URI, options);
    clientPromise = client.connect();
}

export default clientPromise;

const DB_NAME = "learnwordeng";

export async function getDb(): Promise<Db> {
    const client = await clientPromise;
    return client.db(DB_NAME);
}
