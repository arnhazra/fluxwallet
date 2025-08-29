import { Module } from "@nestjs/common"
import { GoalModule } from "./goal/goal.module"
import { EntityModule } from "@/shared/entity/entity.module"
import { config } from "@/config"
import { ProductsDbConnectionMap } from "@/shared/utils/db-connection.map"

@Module({
  imports: [
    EntityModule.forRoot(
      config.PRODUCTS_DATABASE_URI,
      ProductsDbConnectionMap.WealthGoal
    ),
    GoalModule,
  ],
})
export class WealthGoalModule {}
