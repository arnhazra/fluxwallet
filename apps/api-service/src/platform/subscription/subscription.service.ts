import Stripe from "stripe"
import { Injectable } from "@nestjs/common"
import { statusMessages } from "@/shared/constants/status-messages"
import { config } from "src/config"
import { OnEvent } from "@nestjs/event-emitter"
import { EventMap } from "@/shared/constants/event.map"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { CreateSubscriptionCommand } from "./commands/impl/create-subscription.command"
import { FindSubscriptionByUserIdQuery } from "./queries/impl/find-subscription-by-user-id.query"
import { getRediretURIAPI } from "./utils/redirect-uri"
import { Subscription } from "./schemas/subscription.schema"

@Injectable()
export class SubscriptionService {
  private readonly stripe: Stripe

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {
    this.stripe = new Stripe(config.STRIPE_SECRET_KEY)
  }

  async createCheckoutSession(
    userId: string
  ): Promise<Stripe.Checkout.Session> {
    try {
      const price = 50
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${config.APP_NAME} Subscription`,
              },
              unit_amount: Number(price) * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${getRediretURIAPI(true)}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: getRediretURIAPI(false),
        metadata: {
          userId,
          price,
        },
      })

      return session
    } catch (error) {
      throw new Error()
    }
  }

  async handleSubscribe(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId)
      const { userId, price } = session.metadata

      await this.commandBus.execute(
        new CreateSubscriptionCommand(userId, Number(price))
      )
      return { success: true }
    } catch (error) {
      throw new Error()
    }
  }

  @OnEvent(EventMap.ActivateTrial)
  async activateTrial(userId: string) {
    try {
      await this.commandBus.execute(new CreateSubscriptionCommand(userId, 0))
      return { success: true }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }

  @OnEvent(EventMap.GetSubscriptionDetails)
  async getMySubscription(userId: string) {
    try {
      const subscription: Subscription | null | undefined =
        await this.queryBus.execute(new FindSubscriptionByUserIdQuery(userId))

      if (!subscription) {
        return null
      }

      const { _id, price, endsAt } = subscription
      const isActive = subscription && new Date(endsAt) > new Date()

      return {
        _id,
        userId,
        price,
        createdAt: (subscription as any).createdAt,
        endsAt,
        isActive,
      }
    } catch (error) {
      throw new Error(statusMessages.connectionError)
    }
  }
}
