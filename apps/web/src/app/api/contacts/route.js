import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const contacts = await sql`
      SELECT id, name, phone_number, avatar_url, avatar_bg, created_at
      FROM contacts
      ORDER BY name ASC
    `;

    return Response.json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return Response.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phoneNumber, avatarBg } = body;

    if (!name || !phoneNumber) {
      return Response.json(
        { error: "Name and phone number are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO contacts (name, phone_number, avatar_bg)
      VALUES (${name}, ${phoneNumber}, ${avatarBg || "#E8E4FF"})
      RETURNING id, name, phone_number, avatar_url, avatar_bg, created_at
    `;

    return Response.json({ contact: result[0] });
  } catch (error) {
    console.error("Error creating contact:", error);
    if (error.message.includes("duplicate key")) {
      return Response.json(
        { error: "Contact with this phone number already exists" },
        { status: 409 },
      );
    }
    return Response.json(
      { error: "Failed to create contact" },
      { status: 500 },
    );
  }
}
