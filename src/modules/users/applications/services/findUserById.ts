import type {
  IUserRepository,
  TFindUserByIdParams,
  TFindUserByIdResponse,
} from '../../domain'

export class FindUserById {
  constructor(private userRepository: IUserRepository) {}

  execute = async (
    params: TFindUserByIdParams,
  ): Promise<TFindUserByIdResponse> => {
    const response = await this.userRepository.findUserById(params)

    return response
  }
}
