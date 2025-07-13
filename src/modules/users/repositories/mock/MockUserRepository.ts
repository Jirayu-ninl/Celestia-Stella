import type { User } from '@prisma/client'
import type {
  IUserRepository,
  TCreateUserResponse,
  TFindUserByIdResponse,
} from '../../domain'

export const mockUser: User = {
  id: 'ce3c8cad-ae9d-4f46-b2c2-1440bdac16b7',
  username: 'mockUser',
  email: 'mock@email.com',
  name: 'Mock User',
  password: null,
  createdAt: new Date(),
  metadata: {},
  image: null,
  active: true,
  plan: 'FREE',
  role: 'USER',
  balance: 0,
  projectIds: [],
  subscriptionId: null,
  emailVerified: null,
}

export class MockUserRepository implements IUserRepository {
  create = (): Promise<TCreateUserResponse> => {
    return Promise.resolve({ id: mockUser.id, email: mockUser.email })
  }

  findUserById = (): Promise<TFindUserByIdResponse> => {
    return Promise.resolve({ user: mockUser })
  }
}

export default MockUserRepository
