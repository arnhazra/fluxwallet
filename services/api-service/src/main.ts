import { NestFactory } from "@nestjs/core"
import { MainModule } from "./main.module"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { config } from "./config"

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(MainModule)
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({ origin: config.UI_URL })
  await app.listen(8000)
}

bootstrap()
