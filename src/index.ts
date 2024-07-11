import { Elysia } from "elysia";
import axios from "axios";
import type { WebhookPayload, TextMessage } from './types';

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;

const app = new Elysia()
  .post("/hooks", async ({ body }: {body: WebhookPayload<TextMessage>}) => {
    // log incoming messages
    console.log("Incoming webhook message:", JSON.stringify(body, null, 2));

    // check if the webhook request contains a message
    // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    const message = body.entry?.[0]?.changes[0]?.value?.messages?.[0];

    // check if the incoming message contains text
    if (message?.type === "text") {
      // extract the business number to send the reply from it
      const business_phone_number_id =
        body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

      // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/${process.env.API_VERSION}/${process.env.BUSINESS_PHONE_NUMBER_ID}/messages`,
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          to: message.from,
          text: { body: "Echo: " + message.text.body },
          context: {
            message_id: message.id, // shows the message as a reply to the original user message
          },
        },
      });

      // mark incoming message as read
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        },
        data: {
          messaging_product: "whatsapp",
          status: "read",
          message_id: message.id,
        },
      });
    }

  })
  // info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
  .get("/hooks", ({query, set}) => {
    const mode = query["hub.mode"];
    const token = query["hub.verify_token"];
    const challenge = query["hub.challenge"];
    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      set.status = 'OK';
      return challenge;
    } else {
      set.status = 'Forbidden';
    }
  })
  .onError(({ redirect }) => redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 302))
  .listen(process.env.PORT ?? 3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
