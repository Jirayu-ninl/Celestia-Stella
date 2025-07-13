import { describe, expect, it, spyOn } from 'bun:test'
import { ROLE } from '../../domain'
import MockUserRepository, {
  mockUser,
} from '../../repositories/mock/MockUserRepository'
import { CreateUser } from './createUser'

const mockRepo = new MockUserRepository()
const useCase = CreateUser(mockRepo)
const create = spyOn(mockRepo, 'create')

describe('Create user [Mock]', () => {
  it('should be able to create', async () => {
    const response = await useCase.execute({
      name: 'User 1',
      email: 'user@email.com',
      role: ROLE.ADMIN,
      username: 'username',
    })

    expect(create).toHaveBeenCalled()
    expect(response).toEqual(mockUser)
  })
})
