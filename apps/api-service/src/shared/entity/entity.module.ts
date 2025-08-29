import { Module, DynamicModule } from "@nestjs/common"
import {
  ProductsDbConnectionMap,
  GeneralDbConnectionMap,
} from "src/shared/utils/db-connection.map"
import * as mongooseEncryption from "mongoose-encryption"
import { ModelDefinition, MongooseModule } from "@nestjs/mongoose"
import { Schema } from "mongoose"
import { ENC32_B64, SIG64_B64 } from "../utils/encryption"

type MaybeEncryptedModel = ModelDefinition & { encryptedFields?: string[] }

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

  static forFeatureAsync(
    models: MaybeEncryptedModel[],
    dbConnectionName: ProductsDbConnectionMap | GeneralDbConnectionMap
  ): DynamicModule {
    return MongooseModule.forFeatureAsync(
      models.map((m) => ({
        name: m.name,
        useFactory: () => {
          const base = m.schema as Schema
          if (m.encryptedFields?.length) {
            const s = base.clone()
            s.plugin(mongooseEncryption, {
              encryptionKey: ENC32_B64,
              signingKey: SIG64_B64,
              encryptedFields: m.encryptedFields,
            })
            return s
          }
          return base
        },
      })),
      dbConnectionName
    )
  }
}
