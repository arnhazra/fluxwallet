import { Module } from "@nestjs/common"
import { WealthAnalyzerModule } from "./wealthanalyzer/wealthanalyzer.module"
import { DebtTrackModule } from "./debttrack/debttrack.module"
import { TaxAdvisorModule } from "./taxadvisor/taxadvisor.module"
import { WealthGoalModule } from "./wealthgoal/wealthgoal.module"
import { FinanceNewsModule } from "./financenews/financenews.module"

@Module({
  imports: [
    TaxAdvisorModule,
    WealthAnalyzerModule,
    DebtTrackModule,
    WealthGoalModule,
    FinanceNewsModule,
  ],
})
export class ProductsModule {}
