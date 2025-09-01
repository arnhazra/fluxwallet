import { Module } from "@nestjs/common"
import { IntelligenceModule } from "./intelligence/intelligence.module"
import { WealthAnalyzerModule } from "./wealthanalyzer/wealthanalyzer.module"
import { DebtTrackModule } from "./debttrack/debttrack.module"
import { TaxAdvisorModule } from "./taxadvisor/taxadvisor.module"
import { WealthGoalModule } from "./wealthgoal/wealthgoal.module"

@Module({
  imports: [
    TaxAdvisorModule,
    WealthAnalyzerModule,
    DebtTrackModule,
    IntelligenceModule,
    WealthGoalModule,
  ],
})
export class ProductsModule {}
