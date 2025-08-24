import { Module } from "@nestjs/common"
import { IntelligenceModule } from "./intelligence/intelligence.module"
import { WealthAnalyzerModule } from "./wealthanalyzer/wealthanalyzer.module"
import { DebtTrackModule } from "./debttrack/debttrack.module"
import { AdvisorXModule } from "./advisorx/advisorx.module"

@Module({
  imports: [
    AdvisorXModule,
    WealthAnalyzerModule,
    DebtTrackModule,
    IntelligenceModule,
  ],
})
export class ProductsModule {}
