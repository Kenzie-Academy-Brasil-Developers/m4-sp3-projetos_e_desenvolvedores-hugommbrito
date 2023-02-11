import { Request, Response } from "express"
import { QueryConfig, QueryResult } from "pg"
import { FullProj, FullProjResult, ProjTech, ProjTechRequest } from "../interfaces/projectTecnologies.interfaces"
import { client } from "../database"

export const getProjectsByDeveloperId = async(req:Request, res:Response): Promise<Response> => {
    const projId: number = parseInt(req.params.id)

    const queryString: string = `
        SELECT 
            d.id "developerID",
            d."name" "developerName",
            d.email "developerEmail",
            di.id "developerInfoID",
            di."developerSince" "developerInfoDeveloperSince",
            di."preferredOS" "developerInfoPreferredOS",
            p.id "projectID",
            p."name" "projectName",
            p.description "projectDescription",
            p."estimatedTime" "projectEstimatedTime",
            p.repository "projectRepository",
            p."startDate" "projectStartDate",
            p."endDate" "projectEndDate",
            pt.technology_id "technologyID",
            t.name "technologyName" 
        FROM developers d 
        FULL OUTER JOIN
            projects p ON p.developers_id = d.id 
        FULL OUTER JOIN 
            developer_infos di ON d.id = di.developers_id 
        FULL OUTER JOIN
            project_technologies pt ON p.id = pt.project_id
        FULL OUTER JOIN
            technologies t ON pt.technology_id = t.id
        WHERE d.id = $1;
    `
    const queryConfig: QueryConfig = {
        text:queryString,
        values: [projId]
    }

    const queryResult: FullProjResult = await client.query(queryConfig)
    const queryResponse: FullProj[] = queryResult.rows

    return res.status(200).json(queryResponse)

}

export const addTechToProj = async(req:Request, res:Response): Promise<Response> => {

    const projID: number = parseInt(req.params.id)
    const newProjTechInfo: ProjTechRequest = req.body

    if(!newProjTechInfo.name){
        return res.status(400).json({message: 'Missing a required key: name'})
    }

    const queryString1: string = `
        SELECT *
        FROM technologies t
        WHERE t.name = $1
    `

    const queryConfig1: QueryConfig ={
        text: queryString1,
        values: [newProjTechInfo.name]
    }

    const queryResult1: QueryResult<ProjTech> = (await client.query(queryConfig1))
    const techID: number = queryResult1.rows[0].id


    const today: Date = new Date()
   

    const queryString2: string = `
        INSERT INTO project_technologies ("technology_id", "project_id", "addedIn")
        VALUES ($1, $2, $3)
        RETURNING *;
    `

    const queryConfig2: QueryConfig = {
        text: queryString2,
        values: [techID, projID, today]
    }

    const queryResult2: FullProjResult = await client.query(queryConfig2)
    const newProjTechInfoResult: FullProj = queryResult2.rows[0]

    return res.status(201).json(newProjTechInfoResult)
}

export const deleteTechFromProj = async(req:Request, res:Response): Promise<Response> => {
    const projID: number = parseInt(req.params.id)
    const techName: string = req.params.name

    const queryString1: string = `
        SELECT *
        FROM technologies t
        WHERE t.name = $1
    `

    const queryConfig1: QueryConfig ={
        text: queryString1,
        values: [techName]
    }

    const queryResult1: QueryResult<ProjTech> = await client.query(queryConfig1)
    const techID: number = queryResult1.rows[0].id


    const queryString2: string = `
        DELETE FROM
            project_technologies pt 
        WHERE
            pt.technology_id = $1 AND pt.project_id = $2
        RETURNING *
    `

    const queryConfig2: QueryConfig = {
        text: queryString2,
        values: [techID, projID]
    }

    const queryResult2 = await client.query(queryConfig2)
    console.log(queryResult2);

    if(queryResult2.rowCount != 1){
        return res.status(404).json({ message: `Technologie '${techName}' not found in this project`})
    }

    return res.status(201).send()

}