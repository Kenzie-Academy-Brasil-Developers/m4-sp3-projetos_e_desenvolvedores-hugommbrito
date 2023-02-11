import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

export const validateTech = async(req:Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const techName: string = req.params.name || req.body.name
    
    const queryString: string = `SELECT COUNT (*) FROM technologies t WHERE t.name = $1`
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [techName]
    }

    const queryResult: QueryResult<{count: number}> = await client.query(queryConfig)

    if (queryResult.rows[0].count != 1){
        return res.status(400).json({
            "message": "Technology not supported.",
            "options": [
                "JavaScript",
                "Python",
                "React",
                "Express.js",
                "HTML",
                "CSS",
                "Django",
                "PostgreSQL",
                "MongoDB"
            ]
        })
    }

    return next()

}