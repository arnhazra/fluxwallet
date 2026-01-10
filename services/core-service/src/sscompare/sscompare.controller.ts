import {
  Controller,
  Post,
  BadRequestException,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common"
import { AnyFilesInterceptor } from "@nestjs/platform-express"
type MulterFile = Express.Multer.File
import { TaxAdvisorService } from "./sscompare.service"

@Controller("sscompare")
export class TaxAdvisorController {
  constructor(private readonly service: TaxAdvisorService) {}

  @Post("upload")
  @UseInterceptors(AnyFilesInterceptor())
  async uploadScreenshots(@UploadedFiles() files: MulterFile[]) {
    const base = files.find((f) => f.fieldname === "base")
    const actual = files.find((f) => f.fieldname === "actual")
    if (!base || !actual) {
      throw new BadRequestException(
        "Both base and actual screenshots are required."
      )
    }
    return await this.service.compareScreenshots(base, actual)
  }
}
