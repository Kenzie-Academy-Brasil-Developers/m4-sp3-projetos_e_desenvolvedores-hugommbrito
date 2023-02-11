import { QueryResult } from "pg"

export interface DeveloperRequest{
    name: string,
    email: string
}

export interface DevInfoRequest{
    developerSince: string,
    preferredOS: string,
}

export interface Developer extends DeveloperRequest{
    id: number,
}

export interface DevInfo extends DevInfoRequest{
    id: number
    developersId: number
}

export interface DevWithInfo extends Developer, DevInfo{}

export type DevInfoResponse = QueryResult<DevInfo>
export type DeveloperResponse = QueryResult<Developer>
export type DevWithInfoResponse = QueryResult<DevWithInfo>