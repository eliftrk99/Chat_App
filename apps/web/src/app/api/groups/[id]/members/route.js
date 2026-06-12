import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const members = await sql`
      SELECT gm.id, gm.phone_number, gm.is_admin, gm.joined_at,
             c.name, c.avatar_url, c.avatar_bg
      FROM group_members gm
      LEFT JOIN contacts c ON gm.phone_number = c.phone_number
      WHERE gm.group_id = ${id}
      ORDER BY gm.is_admin DESC, gm.joined_at ASC
    `;

    return Response.json({ members });
  } catch (error) {
    console.error("Error fetching group members:", error);
    return Response.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { phoneNumber, isAdmin } = body;

    if (!phoneNumber) {
      return Response.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO group_members (group_id, phone_number, is_admin)
      VALUES (${id}, ${phoneNumber}, ${isAdmin || false})
      RETURNING id, phone_number, is_admin, joined_at
    `;

    return Response.json({ member: result[0] });
  } catch (error) {
    console.error("Error adding member:", error);
    return Response.json({ error: "Failed to add member" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get("phoneNumber");

    if (!phoneNumber) {
      return Response.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    await sql`
      DELETE FROM group_members
      WHERE group_id = ${id} AND phone_number = ${phoneNumber}
    `;

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error removing member:", error);
    return Response.json({ error: "Failed to remove member" }, { status: 500 });
  }
}
