import { BadRequestException, Injectable } from "@nestjs/common"
import { SetTokenDto } from "./dto/set-token.dto"
import { GetTokenDto } from "./dto/get-token.dto"
import { DeleteTokenDto } from "./dto/delete-token.dto"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { GetTokenQuery } from "./queries/impl/get-token.query"
import { DeleteTokenCommand } from "./commands/impl/delete-token.command"
import { SetTokenCommand } from "./commands/impl/set-token.command"

@Injectable()
export class TokenService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async setToken(setTokenDto: SetTokenDto) {
    try {
      const { userId, token } = setTokenDto
      return await this.commandBus.execute(new SetTokenCommand(userId, token))
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async getToken(getTokenDto: GetTokenDto) {
    try {
      const { userId } = getTokenDto
      return await this.queryBus.execute(new GetTokenQuery(userId))
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async deleteToken(deleteTokenDto: DeleteTokenDto) {
    try {
      const { userId } = deleteTokenDto
      return await this.commandBus.execute(new DeleteTokenCommand(userId))
    } catch (error) {
      throw new BadRequestException()
    }
  }
}
