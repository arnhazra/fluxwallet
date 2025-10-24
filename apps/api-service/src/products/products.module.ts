import { Module } from "@nestjs/common"
import { OneAgentModule } from "./oneagent/oneagent.module"
import { WealthAnalyzerModule } from "./wealthanalyzer/wealthanalyzer.module"
import { DebtTrackModule } from "./debttrack/debttrack.module"
import { TaxAdvisorModule } from "./taxadvisor/taxadvisor.module"
import { WealthGoalModule } from "./wealthgoal/wealthgoal.module"
import { FinNewsModule } from "./finnews/finnews.module"

@Module({
  imports: [
    TaxAdvisorModule,
    WealthAnalyzerModule,
    DebtTrackModule,
    OneAgentModule,
    WealthGoalModule,
    FinNewsModule,
  ],
})
export class ProductsModule {}
