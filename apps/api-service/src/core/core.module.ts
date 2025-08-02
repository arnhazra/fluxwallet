import { Module } from "@nestjs/common"
import { SubscriptionModule } from "./subscription/subscription.module"
import { UserModule } from "./user/user.module"
import { config } from "src/config"
import { DbConnectionMap } from "src/shared/utils/db-connection.map"
import { ActivityModule } from "./activity/activity.module"
import { TokenModule } from "./token/token.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { EmailModule } from "./email/email.module"
import { InstitutionModule } from "./institution/institution.module"
import { AssetModule } from "./asset/asset.module"
import { ValuationModule } from "./valuation/valuation.module"

@Module({
  imports: [
    EntityModule.forRoot(config.PRIMARY_DATABASE_URI, DbConnectionMap.Primary),
    ActivityModule,
    SubscriptionModule,
    UserModule,
    TokenModule,
    EmailModule,
    InstitutionModule,
    AssetModule,
    ValuationModule,
  ],
})
export class CoreModule {}
