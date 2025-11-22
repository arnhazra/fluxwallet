import { Controller, Get, Redirect } from "@nestjs/common"
import { config } from "@/config"

@Controller()
export class MainController {
  @Get("/")
  @Redirect(config.UI_URL, 302)
  redirectToUI() {
    return
  }
}
