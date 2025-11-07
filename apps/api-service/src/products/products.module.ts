import { Module } from "@nestjs/common"
import { WealthAnalyzerModule } from "./wealthanalyzer/wealthanalyzer.module"
import { DebtTrackModule } from "./debttrack/debttrack.module"
import { TaxAdvisorModule } from "./taxadvisor/taxadvisor.module"
import { WealthGoalModule } from "./wealthgoal/wealthgoal.module"
import { DiscoverModule } from "./discover/discover.module"

@Module({
  imports: [
    TaxAdvisorModule,
    WealthAnalyzerModule,
    DebtTrackModule,
    WealthGoalModule,
    DiscoverModule,
  ],
})
export class ProductsModule {}
