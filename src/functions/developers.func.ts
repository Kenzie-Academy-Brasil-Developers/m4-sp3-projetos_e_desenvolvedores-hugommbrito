import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database"

import { Developer, DeveloperRequest, DeveloperResponse, DevInfo, DevInfoRequest, DevInfoResponse, DevWithInfo, DevWithInfoResponse } from "../interfaces/interfaces";

export const registerDeveloper = async(req:Request, res:Response): Promise<Response> => {

    const newDevData: DeveloperRequest = req.body

    if(!newDevData.email || !newDevData.name){
        return res.status(400).json({message: 'Missing a required key'})
    }

    const queryString: string = `
        INSERT INTO developers ("name", "email")
        VALUES ($1, $2)
        RETURNING *;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [newDevData.name, newDevData.email]
    }

    const queryResult: DeveloperResponse = await client.query(queryConfig)
    const newDevResponse: Developer = queryResult.rows[0]

    return res.status(201).json(newDevResponse)
}


export const getAllDeveloper = async(req:Request, res:Response): Promise<Response> => {

    const queryString: string = `
        SELECT
            d.*,
            di."developerSince",
            di."preferredOS",
            di."developers_id" 
        FROM developers AS d
        LEFT JOIN developer_infos di
            ON d.id = di.developers_id;
    `

    const queryResult: DevWithInfoResponse = await client.query(queryString)
    const getDevResponse: DevWithInfo[] = queryResult.rows

    return res.status(200).json(getDevResponse)
}

export const getDevById = async(req:Request, res:Response): Promise<Response> => {

    const developerId: number = parseInt(req.params.id)

    const queryString: string = `
        SELECT 
            d.*,
            di."developerSince",
            di."preferredOS",
            di."developers_id" 
        FROM developers AS d
        LEFT JOIN developer_infos di
            ON d.id = di.developers_id
        WHERE d.id = $1;
    `

    const queryConfig: QueryConfig = {
        text:queryString,
        values: [developerId]
    }

    const queryResult: DevWithInfoResponse = await client.query(queryConfig)
    const getDevResponse: DevWithInfo = queryResult.rows[0]

    return res.status(200).json(getDevResponse)
}

export const addInfoToDev = async(req:Request, res:Response): Promise<Response> => {

    const devId: number = parseInt(req.params.id)
    const newDevInfo: DevInfoRequest = req.body

    if(!newDevInfo.developerSince || !newDevInfo.preferredOS){
        return res.status(400).json({message: 'Missing a required key: developerSince or preferredOs'})
    }

    const queryString: string = `
        INSERT INTO developer_infos ("developerSince", "preferredOS", "developers_id")
        VALUES ($1, $2, $3)
        RETURNING *;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [newDevInfo.developerSince, newDevInfo.preferredOS, devId]
    }

    const queryResult: DevInfoResponse = await client.query(queryConfig)
    const newDevInfoResponse: DevInfo = queryResult.rows[0]

    return res.status(201).json(newDevInfoResponse)
}

export const updateDevData = async(req: Request, res: Response): Promise<Response> => {
    const devId: number = parseInt(req.params.id)
    const devNewDataReq: Partial<Developer> = req.body

    if(!devNewDataReq.email && !devNewDataReq.name){
        const errorJSON = {
            "message": "At least one of those keys must be send.",
            "keys": [ "name", "email" ]
          }
        return res.status(400).json(errorJSON)
    }

    const devNewData: Partial<Developer> = {}

    if(devNewDataReq.name){devNewData.name = devNewDataReq.name}
    if(devNewDataReq.email){devNewData.email = devNewDataReq.email}

    const queryString: string = format(
        `
            UPDATE developers
            SET (%I) = ROW(%L)
            WHERE id = $1
            RETURNING *
        `,
        Object.keys(devNewData),
        Object.values(devNewData)
    )

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [devId]
    }

    const updatedDevResponse: Partial<DeveloperResponse> = await client.query(queryConfig)
    const updatedDev: Developer = updatedDevResponse.rows![0]

    return res.status(200).json(updatedDev)

}

export const updateDevInfo = async(req: Request, res: Response): Promise<Response> => {
    const devId: number = parseInt(req.params.id)
    const devNewInfoReq: Partial<DevInfoRequest> = req.body

    if(!devNewInfoReq.developerSince && !devNewInfoReq.preferredOS){
        const errorJSON = {
            "message": "At least one of those keys must be send.",
            "keys": [ "developerSince", "preferredOS" ]
          }
        return res.status(400).json(errorJSON)
    }

    const devNewInfo: Partial<DevInfo> = {}

    if(devNewInfoReq.developerSince){devNewInfo.developerSince = devNewInfoReq.developerSince}
    if(devNewInfoReq.preferredOS){devNewInfo.preferredOS = devNewInfoReq.preferredOS}

    const queryString1: string = `
        SELECT COUNT (*)
        FROM developer_infos
        WHERE developers_id = $1
    `
    const queryConfig1: QueryConfig = {
        text:queryString1,
        values: [devId]
    }

    const devHasInfoResult: QueryResult = await client.query(queryConfig1)
    const devHasInfo: number = devHasInfoResult.rows[0].count

    if(devHasInfo == 1){
        const queryString2: string = format(
            `
                UPDATE developer_infos
                SET (%I) = ROW(%L)
                WHERE developers_id = $1
                RETURNING *
            `,
            Object.keys(devNewInfo),
            Object.values(devNewInfo)
        )
    
        const queryConfig2: QueryConfig = {
            text: queryString2,
            values: [devId]
        }
    
        const updatedDevResponse: Partial<DeveloperResponse> = await client.query(queryConfig2)
        const updatedDev: Developer = updatedDevResponse.rows![0]
        
        return res.status(200).json(updatedDev)
        
    }else {
        return res.status(404).json({message: "Developer has no info to be updated"})

    }

}

export const deleteDev = async(req:Request, res:Response): Promise<Response> => {

    const devId: number = parseInt(req.params.id)

    const queryString: string = 
    `
        DELETE FROM developers WHERE id = $1
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [devId]
    }

    await client.query(queryConfig)

    return res.status(204).send()
}