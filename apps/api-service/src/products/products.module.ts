import { Module } from "@nestjs/common"
import { IntelligenceModule } from "./intelligence/intelligence.module"
import { AssetManagerModule } from "./assetmanager/assetmanager.module"
import { DebtTrackModule } from "./debttrack/debttrack.module"
import { AdvisorXModule } from "./advisorx/advisorx.module"

@Module({
  imports: [
    AdvisorXModule,
    AssetManagerModule,
    DebtTrackModule,
    IntelligenceModule,
  ],
})
export class ProductsModule {}
