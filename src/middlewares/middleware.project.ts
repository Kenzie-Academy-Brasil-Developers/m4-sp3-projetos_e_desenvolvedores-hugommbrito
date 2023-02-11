import { NextFunction, Request, Response } from "express"
import { QueryConfig, QueryResult } from "pg"
import { client } from "../database"


export const checkDevIdExistsForProj = async(req:Request, res:Response, next:NextFunction): Promise<Response | void> => {
    const id: number = parseInt(req.body.developers_id)

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

export const checkProjIdExists = async(req:Request, res:Response, next:NextFunction): Promise<Response | void> => {
    const id: number = parseInt(req.params.id)

    const queryString: string = `
        SELECT *
        FROM projects
        WHERE id = $1
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResponse: QueryResult = await client.query(queryConfig)

    if(queryResponse.rowCount === 0){
        return res.status(404).json({"message": "Project not found."})
    }

    return next()

}