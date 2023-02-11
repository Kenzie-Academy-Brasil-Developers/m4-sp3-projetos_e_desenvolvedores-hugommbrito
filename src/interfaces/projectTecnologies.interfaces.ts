import { Project } from "./projects.interfaces"
import { Developer, DevInfo } from "./developers.interfaces"
import { QueryResult } from "pg"

export interface ProjTechRequest{
    name: string
}
export interface ProjTech extends ProjTechRequest {
    id: number
}

export interface FullProj extends Project, Developer, DevInfo{
    technologyID: string,
    TechnologyName: string
}

export type FullProjResult = QueryResult<FullProj>
