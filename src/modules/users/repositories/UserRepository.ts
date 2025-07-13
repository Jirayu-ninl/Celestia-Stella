import { prisma } from '@/infrastructure/prisma'
import type {
  IUserRepository,
  TCreateUserParams,
  TCreateUserResponse,
  TFindUserByIdParams,
  TFindUserByIdResponse,
} from '../domain'

class UserRepository implements IUserRepository {
  // skipcq: JS-0105
  create = async ({
    name,
    email,
    role,
    username,
  }: TCreateUserParams): Promise<TCreateUserResponse> => {
    return await prisma.user.create({
      data: {
        name,
        email,
        role,
        username: username ?? email.split('@')[0],
      },
      select: {
        id: true,
        email: true,
      },
    })
  }

  // skipcq: JS-0105
  findUserById = async ({
    where,
  }: TFindUserByIdParams): Promise<TFindUserByIdResponse> => {
    const response = await prisma.user.findUnique({
      where,
    })

    return {
      user: response,
    }
  }
}

export default UserRepository
