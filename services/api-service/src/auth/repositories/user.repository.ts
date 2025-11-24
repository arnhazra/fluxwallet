import { Injectable } from "@nestjs/common"
import { User } from "../schemas/user.schema"
import { GeneralDbConnectionMap } from "@/shared/entity/entity-db-connection.map"
import { OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/constants/event.map"
import {
  EntityModel,
  EntityRepository,
  InjectEntityModel,
} from "@/shared/entity/entity.repository"
import {
  createOrConvertObjectId,
  QueryFilter,
} from "@/shared/entity/entity.schema"

@Injectable()
export class UserRepository extends EntityRepository<User> {
  constructor(
    @InjectEntityModel(User.name, GeneralDbConnectionMap.Auth)
    private userModel: EntityModel<User>
  ) {
    super(userModel)
  }

  @OnEvent(EventMap.GetUserDetails)
  async findUser<K extends keyof User>(
    filter: Pick<User, K>
  ): Promise<User | null> {
    return await super.findOne(filter as QueryFilter<User>)
  }

  async updateOneById<K extends keyof User>(
    userId: string,
    key: K,
    value: User[K]
  ): Promise<User | null> {
    return await super.update(
      { _id: createOrConvertObjectId(userId) },
      { [key]: value }
    )
  }
}
