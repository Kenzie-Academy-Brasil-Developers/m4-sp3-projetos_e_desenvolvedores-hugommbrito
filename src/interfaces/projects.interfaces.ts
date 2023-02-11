import { QueryResult } from "pg"

export interface ProjRequest{
    name: string,
    description: string,
    estimatedTime: string,
    repository: string,
    startDate: string,
    developers_id: number
}
export type ProjRequestedKeys = 'name' | 'description' | 'estimatedTime' | 'repository' | 'startDate' | 'developers_id'


export interface Project extends ProjRequest{
    id: number,
    endDate: string
}
export interface ProjWithTechnologies extends Project{
    technology_id: number,
    technologyName: string
}



export type ProjResult = QueryResult<Project>
export type ProjWithTechnologiesResult = QueryResult<ProjWithTechnologies>