import { Module, DynamicModule } from "@nestjs/common"
import {
  AppsDbConnectionMap,
  GeneralDbConnectionMap,
} from "@/shared/constants/db-connection.map"
import { ModelDefinition, MongooseModule } from "@nestjs/mongoose"

@Module({})
export class EntityModule {
  static forRoot(
    uri: string,
    dbConnectionName: AppsDbConnectionMap | GeneralDbConnectionMap
  ): DynamicModule {
    return MongooseModule.forRootAsync({
      useFactory: () => ({
        uri,
        dbName: dbConnectionName,
      }),
      connectionName: dbConnectionName,
    })
  }

  static forFeature(
    models: ModelDefinition[],
    dbConnectionName: AppsDbConnectionMap | GeneralDbConnectionMap
  ): DynamicModule {
    return MongooseModule.forFeature(models, dbConnectionName)
  }
}
