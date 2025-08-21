import { Module } from "@nestjs/common"
import { SubscriptionModule } from "./subscription/subscription.module"
import { config } from "src/config"
import { GeneralDbConnectionMap } from "src/shared/utils/db-connection.map"
import { ActivityModule } from "./activity/activity.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { EmailModule } from "./email/email.module"
import { ProductsModule } from "./products/products.module"
import { SolutionModule } from "./solutions/solution.module"

@Module({
  imports: [
    EntityModule.forRoot(config.CORE_DATABASE_URI, GeneralDbConnectionMap.Core),
    ActivityModule,
    SubscriptionModule,
    EmailModule,
    ProductsModule,
    SolutionModule,
  ],
})
export class CoreModule {}
