import { Module } from "@nestjs/common"
import { WealthAnalyzerModule } from "./wealthanalyzer/wealthanalyzer.module"
import { DebtTrackModule } from "./debttrack/debttrack.module"
import { WealthGoalModule } from "./wealthgoal/wealthgoal.module"
import { DiscoverModule } from "./discover/discover.module"
import { ExpenseTrackModule } from "./expensetrack/expensetrack.module"

@Module({
  imports: [
    WealthAnalyzerModule,
    DebtTrackModule,
    ExpenseTrackModule,
    WealthGoalModule,
    DiscoverModule,
  ],
})
export class AppsModule {}
