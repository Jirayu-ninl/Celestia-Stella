import { describe, expect, it, spyOn } from 'bun:test'
import MockUserRepository, {
  mockUser,
} from '../../repositories/mock/MockUserRepository'
import { FindUserById } from './findUserById'

const mockRepo = new MockUserRepository()
const useCase = new FindUserById(mockRepo)
const count = spyOn(mockRepo, 'findUserById')

describe('Find user by Id [Mock]', () => {
  it('should be able to count', async () => {
    const response = await useCase.execute({
      where: {
        id: mockUser.id,
      },
    })

    expect(count).toHaveBeenCalled()
    expect(response).toEqual({ user: mockUser })
  })

  // This should be move out of here
  it('should throw with an invalid parameters', () => {
    expect(async () => {
      await useCase.execute({
        where: {
          id: 'Invalid_role',
        },
      })
    }).toThrow()
  })
})
