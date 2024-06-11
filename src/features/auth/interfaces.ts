export interface IUserRegister{
    username: string;
    password: string;
}
export interface IUserLogin{
    username:string;
    password:string;
}
export interface IProfileData{
    username:string;
}
export interface QueryParams {
    page: number;
    limit: number;
    sortBy: string;
    order: string;
    filter: string;
}
export interface IResponse<T> {
    message: string;
    data?: T;
    success: boolean;
}

export interface IUserData {
    token: string;
    user: {
        id: string;
        username: string;
    };
}

export interface IErrorResponse {
    error: string;
}

export interface IUser {
    _id: string;
    username: string;
    role:string;
}

export interface IUserResponseData {
    user: IUser;
}

export interface IUserListData {
    users: IUser[];
    totalPages: number;
    currentPage: number;
}