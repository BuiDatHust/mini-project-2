import { Observable } from 'rxjs'

export interface IUser {
  id: string
  name: string
  birthday: string
  email: string
}

export interface ICreateUserRequest {
  name: string
  birthday: string
  email: string
}

export interface ICreateUserResponse {
  status: boolean
}

export interface IUpdateUserRequest {
  id: string
  name: string
  birthday: string
}

export interface IUpdateUserResponse {
  status: boolean
}

export interface IGetUserRequest {
  id: string
}

export interface IGrpcMiniProjectService {
  CreateUser: (request: ICreateUserRequest) => Observable<ICreateUserResponse>
  GetOneUser: (request: IGetUserRequest) => Observable<IUser | null>
  UpdateUser: (request: IUpdateUserRequest) => Observable<IUpdateUserResponse>
}
