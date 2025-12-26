import { DynamicModule, Global, Module } from "@nestjs/common"
import { LLMService } from "./llm.service"

@Global()
@Module({})
export class LLMModule {
  static forRoot(): DynamicModule {
    return {
      module: LLMModule,
      providers: [LLMService],
      exports: [LLMService],
    }
  }
}
