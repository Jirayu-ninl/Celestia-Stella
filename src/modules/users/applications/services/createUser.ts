import type {
  IUserRepository,
  TCreateUserParams,
  TCreateUserResponse,
} from '../../domain'

const CreateUser = (userRepository: IUserRepository) => {
  const execute = async (
    params: TCreateUserParams,
  ): Promise<TCreateUserResponse> => {
    const response = await userRepository.create(params)

    return response
  }

  return { execute }
}

export { CreateUser }
