import { Module, DynamicModule } from "@nestjs/common"
import {
  ProductsDbConnectionMap,
  GeneralDbConnectionMap,
} from "src/shared/utils/db-connection.map"
import { ModelDefinition, MongooseModule } from "@nestjs/mongoose"

@Module({})
export class EntityModule {
  static forRoot(
    uri: string,
    dbConnectionName: ProductsDbConnectionMap | GeneralDbConnectionMap
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
    dbConnectionName: ProductsDbConnectionMap | GeneralDbConnectionMap
  ): DynamicModule {
    return MongooseModule.forFeature(models, dbConnectionName)
  }
}
