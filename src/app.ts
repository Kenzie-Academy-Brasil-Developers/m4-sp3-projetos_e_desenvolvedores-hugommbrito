import express, { Application } from "express"
import 'dotenv/config'
import { startDatabase } from "./database"

const app: Application = express()
app.use(express.json())

const PORT: number = parseInt(process.env.DB_PORT!)
const connectMsg: string = `Server connected on http://localhost:${PORT}`
app.listen(PORT, async() => {
    await startDatabase()
    console.log(connectMsg)
})