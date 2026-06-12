import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    const syncedMessages = [];

    for (const msg of messages) {
      const { chatId, senderPhone, receiverPhone, messageText, localId } = msg;

      if (!chatId || !senderPhone || !receiverPhone || !messageText) {
        continue;
      }

      const result = await sql`
        INSERT INTO messages (chat_id, sender_phone, receiver_phone, message_text, status)
        VALUES (${chatId}, ${senderPhone}, ${receiverPhone}, ${messageText}, 'delivered')
        RETURNING id, chat_id, sender_phone, receiver_phone, message_text, status, created_at
      `;

      syncedMessages.push({
        localId,
        serverMessage: result[0],
      });
    }

    return Response.json({ syncedMessages });
  } catch (error) {
    console.error("Error syncing messages:", error);
    return Response.json({ error: "Failed to sync messages" }, { status: 500 });
  }
}
