import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return Response.json({ error: "Chat ID is required" }, { status: 400 });
    }

    const messages = await sql`
      SELECT id, chat_id, sender_phone, receiver_phone, message_text, status, created_at, delivered_at, read_at
      FROM messages
      WHERE chat_id = ${chatId}
      ORDER BY created_at ASC
    `;

    return Response.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { chatId, senderPhone, receiverPhone, messageText } = body;

    if (!chatId || !senderPhone || !receiverPhone || !messageText) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO messages (chat_id, sender_phone, receiver_phone, message_text, status)
      VALUES (${chatId}, ${senderPhone}, ${receiverPhone}, ${messageText}, 'queued')
      RETURNING id, chat_id, sender_phone, receiver_phone, message_text, status, created_at
    `;

    return Response.json({ message: result[0] });
  } catch (error) {
    console.error("Error creating message:", error);
    return Response.json(
      { error: "Failed to create message" },
      { status: 500 },
    );
  }
}
