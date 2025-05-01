import { Http } from "../../utils/http";
import { objectToQueryString } from "../../utils/objectToQueryString";


export interface User {
    id: string;
    uid: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: string;
    profile_picture?: string;
    created_at: string;
    updated_at: string;
}

export interface UserResponse {
    data: User[];
    meta: {
        current_page: number;
        last_page: number;
    };
}


export const getUsers = (activePage: number, filter: any): Promise<UserResponse> =>
    Http.get(`/user-management/customers?page=${activePage}&${objectToQueryString(filter)}`);

