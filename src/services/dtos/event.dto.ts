import { IResponse } from "./common.dto"

export interface IEvent {
    id?: string
    name: string
    startTime: string
    endTime: string
    venue: string,
    invites: IInvitee[]
}

export interface IInvitee {
    id: string
    name: string
    email: string
}

export interface IGetEventListResponse extends IResponse {
    result: {
        data: IEvent[],
        totalRecords: number,
        pageNumber: number,
        pageSize: number
    }
}

export interface ICreateUpdateEventRequest extends IEvent {
}

export interface ICreateUpdateEventResponse extends IResponse {
    result: string
}

export interface IDeleteEventRequest {
    id: string
}

export interface IDeleteEventResponse extends IResponse {
    result: {
        id: string
    }
}