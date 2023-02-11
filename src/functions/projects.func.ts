import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import { Project, ProjRequest, ProjRequestedKeys, ProjResult, ProjWithTechnologies, ProjWithTechnologiesResult } from '../interfaces/projects.interfaces'

export const registerProject = async(req:Request, res:Response): Promise<Response> => {
    const newProjData: ProjRequest = req.body
    const newProjKeys: Array<string> = Object.keys(newProjData)
    const requiredKeys: ProjRequestedKeys[] = ['name', 'description', 'estimatedTime', 'repository', 'startDate', 'developers_id']
    
    const reqContainsAllRequiredKeys: boolean = requiredKeys.every((key: string) => newProjKeys.includes(key))

    if(!reqContainsAllRequiredKeys){
        return res.status(400).json({message: `Missing required Keys: ${requiredKeys}`})
    }

    const date: string = newProjData.startDate
    const formatedDate: string = `${date.slice(6,10)}-${date.slice(3,5)}-${date.slice(0,2)}`
    
    let selectedProjData: ProjRequest = {
        name: newProjData.name,
        description:newProjData.description,
        estimatedTime: newProjData.estimatedTime,
        repository: newProjData.repository,
        startDate: formatedDate,
        developers_id: newProjData.developers_id
    }

    const queryString = format(
        `
        INSERT INTO projects (%I)
        VALUES (%L)
        RETURNING *;
        `,
        Object.keys(selectedProjData),
        Object.values(selectedProjData)
    )

    const queryResult: ProjResult = await client.query(queryString)
    const newProjResponse: Project = queryResult.rows[0]
    console.log(queryResult);

    return res.status(201).json(newProjResponse)
}

export const getAllProjects = async(req:Request, res:Response): Promise<Response> => {
    const queryString: string = `
        SELECT 
            p.*,
            pt.technology_id "technologyID",
            t.name "technologyName" 
        FROM projects p 
        LEFT JOIN
            project_technologies pt 
            ON p.id = pt.project_id
        LEFT JOIN
            technologies t 
            ON pt.technology_id = t.id;
    `
    const queryResult: ProjWithTechnologiesResult = await client.query(queryString)
    const queryResponse: ProjWithTechnologies[] = queryResult.rows

    return res.status(200).json(queryResponse)

}

export const getProjectsById = async(req:Request, res:Response): Promise<Response> => {
    const projId: number = parseInt(req.params.id)

    const queryString: string = `
        SELECT 
            p.*,
            pt.technology_id "technologyID",
            t.name "technologyName" 
        FROM projects p 
        LEFT JOIN
            project_technologies pt 
            ON p.id = pt.project_id
        LEFT JOIN
            technologies t 
            ON pt.technology_id = t.id
        WHERE p.id = $1;
    `
    const queryConfig: QueryConfig = {
        text:queryString,
        values: [projId]
    }

    const queryResult: ProjWithTechnologiesResult = await client.query(queryConfig)
    const queryResponse: ProjWithTechnologies[] = queryResult.rows

    return res.status(200).json(queryResponse)

}

export const updateProject = async(req:Request, res:Response): Promise<Response> => {
    const projectID: number = parseInt(req.params.id)
    const updateProjData: Project = req.body
    const requiredKeys: ProjRequestedKeys[] = ['name', 'description', 'estimatedTime', 'repository', 'startDate', 'developers_id']

    let selectedProjData: Partial<Project> = {}

    if(updateProjData.name){selectedProjData.name = updateProjData.name}
    if(updateProjData.description){selectedProjData.description = updateProjData.description}
    if(updateProjData.estimatedTime){selectedProjData.estimatedTime = updateProjData.estimatedTime}
    if(updateProjData.repository){selectedProjData.repository = updateProjData.repository}
    if(updateProjData.startDate){
        const startDate: string | null = updateProjData.startDate && updateProjData.startDate
        const formatedStartDate: string | null= startDate && `${startDate.slice(6,10)}-${startDate.slice(3,5)}-${startDate.slice(0,2)}`
        selectedProjData.startDate = formatedStartDate
    }
    if(updateProjData.endDate){
        const endDate: string | null = updateProjData.endDate && updateProjData.endDate
        const formatedEndDate: string | null= endDate && `${endDate.slice(6,10)}-${endDate.slice(3,5)}-${endDate.slice(0,2)}`
        selectedProjData.endDate = formatedEndDate
    }
    if(updateProjData.developers_id){selectedProjData.developers_id = updateProjData.developers_id}

    if(Object.keys(selectedProjData).length < 1){
        return res.status(400).json({
            message: "At least one of those keys must be send",
            keys: requiredKeys
        })
    }
    
    console.log(selectedProjData);

    const queryString = format(
        `
        UPDATE projects
        SET (%I) = ROW(%L)
        WHERE id = $1
        RETURNING *;
        `,
        Object.keys(selectedProjData),
        Object.values(selectedProjData)
    )

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectID]
    }

    const queryResult: ProjResult = await client.query(queryConfig)
    const newProjResponse: Project = queryResult.rows[0]
    console.log(queryResult);

    return res.status(201).json(newProjResponse)
}

export const deleteProj = async(req: Request, res:Response): Promise<Response> => {
    const projectID: number = parseInt(req.params.id)

    const queryString: string = `
        DELETE FROM projects WHERE id = $1
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectID]
    }

    await client.query(queryConfig)

    return res.status(204).send()

}

