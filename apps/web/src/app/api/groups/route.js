import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get("phoneNumber");

    if (!phoneNumber) {
      return Response.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    // Get all groups where the user is a member
    const groups = await sql`
      SELECT DISTINCT g.id, g.name, g.avatar_url, g.avatar_bg, g.created_at,
             (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count
      FROM groups g
      JOIN group_members gm ON g.id = gm.group_id
      WHERE gm.phone_number = ${phoneNumber}
      ORDER BY g.created_at DESC
    `;

    return Response.json({ groups });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return Response.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, members, createdBy, avatarBg } = body;

    if (!name || !members || !Array.isArray(members) || members.length === 0) {
      return Response.json(
        { error: "Group name and members are required" },
        { status: 400 },
      );
    }

    // Create group
    const groupResult = await sql`
      INSERT INTO groups (name, created_by, avatar_bg)
      VALUES (${name}, ${createdBy || null}, ${avatarBg || "#E8E4FF"})
      RETURNING id, name, avatar_url, avatar_bg, created_at
    `;

    const group = groupResult[0];

    // Add members
    for (const member of members) {
      const isAdmin = member.phoneNumber === createdBy;
      await sql`
        INSERT INTO group_members (group_id, phone_number, is_admin)
        VALUES (${group.id}, ${member.phoneNumber}, ${isAdmin})
      `;
    }

    // Get member count
    const memberCount = await sql`
      SELECT COUNT(*) as count FROM group_members WHERE group_id = ${group.id}
    `;

    return Response.json({
      group: {
        ...group,
        member_count: parseInt(memberCount[0].count),
      },
    });
  } catch (error) {
    console.error("Error creating group:", error);
    return Response.json({ error: "Failed to create group" }, { status: 500 });
  }
}
