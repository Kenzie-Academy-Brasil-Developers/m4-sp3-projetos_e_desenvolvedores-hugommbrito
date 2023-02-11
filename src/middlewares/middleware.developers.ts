import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database"

export const checkEmailIsUnique = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const email: string = req.body.email

    const queryString: string = `
        SELECT *
        FROM developers
        WHERE email = $1
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [email]
    }

    const queryResponse: QueryResult = await client.query(queryConfig)

    if(queryResponse.rowCount > 0){
        return res.status(409).json({"message": "Email already exists."})
    }

    return next()
}

export const checkDevIdExists = async(req:Request, res:Response, next:NextFunction): Promise<Response | void> => {
    const id: number = parseInt(req.params.id)

    const queryString: string = `
        SELECT *
        FROM developers
        WHERE id = $1
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResponse: QueryResult = await client.query(queryConfig)

    if(queryResponse.rowCount === 0){
        return res.status(404).json({"message": "Developer not found."})
    }

    return next()

}