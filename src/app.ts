import express, { Application } from "express"
import 'dotenv/config'
import { startDatabase } from "./database"
import { getAllDeveloper, registerDeveloper, getDevById, addInfoToDev, updateDevData, updateDevInfo, deleteDev } from "./functions/developers.func"
import { checkDevIdExists, checkEmailIsUnique } from "./middlewares/middleware.developers"

const app: Application = express()
app.use(express.json())



app.post('/developers', checkEmailIsUnique, registerDeveloper)

app.get('/developers', getAllDeveloper)

app.get('/developers/:id', checkDevIdExists, getDevById)

app.post('/developers/:id/infos', checkDevIdExists, addInfoToDev)

app.patch('/developers/:id', checkDevIdExists, updateDevData)

app.patch('/developers/:id/infos', checkDevIdExists, updateDevInfo)

app.delete('/developers/:id', checkDevIdExists, deleteDev)



const PORT: number = parseInt(process.env.SERVER_PORT!)
const connectMsg: string = `Server connected on http://localhost:${PORT}`
app.listen(PORT, async() => {
    await startDatabase()
    console.log(connectMsg)
})