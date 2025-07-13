import type { User } from '@prisma/client'
import type { ROLE } from '../enums'

export type TCreateUserParams = {
  name: string
  email: string
  role: ROLE
  username?: string
}

export type TCreateUserResponse = {
  id: string
  email: string
}

export type TFindUserByIdParams = {
  where: {
    id: string
    role?: ROLE
  }
}

export type TFindUserByIdResponse = {
  user: User | null
}

export interface IUserRepository {
  create(params: TCreateUserParams): Promise<TCreateUserResponse>
  findUserById(params: TFindUserByIdParams): Promise<TFindUserByIdResponse>
}
