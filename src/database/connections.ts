import client from "./config";

const startDatabase = async (): Promise<void> => {
    await client.connect()
    console.log("Database Connected");
}

export default startDatabase