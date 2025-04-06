import { useMutation, useQuery } from "@tanstack/react-query";
import { endpoints, getRequest, postRequest } from "../lib/api";
import { ICreateUpdateEventRequest, ICreateUpdateEventResponse, IDeleteEventRequest, IDeleteEventResponse, IGetEventListResponse } from "./dtos/event.dto";

export const useGetEvents = (pageNumber: number, pageSize: number) => {
    return useQuery<IGetEventListResponse, Error>({
        queryKey: ["events", pageNumber, pageSize],
        queryFn: () => getRequest(endpoints.event.get_events, `pageNumber=${pageNumber}&pageSize=${pageSize}`)
    })
}
export const useCreateUpdateEvent = () => {
    return useMutation<ICreateUpdateEventResponse, Error, ICreateUpdateEventRequest>({
        mutationFn: (payload: ICreateUpdateEventRequest) => postRequest(endpoints.event.create_update, payload),
    });
}
export const useDeleteEvent = () => {
    return useMutation<IDeleteEventResponse, Error, IDeleteEventRequest>({
        mutationFn: (payload: IDeleteEventRequest) => postRequest(endpoints.event.delete_event, payload),
    });
}