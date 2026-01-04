import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/sites/[id] - Get a specific site
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const site = db.getSite(id);

    if (!site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(site);
  } catch (error) {
    console.error("Error getting site:", error);
    return NextResponse.json(
      { error: "Failed to get site" },
      { status: 500 }
    );
  }
}

// PATCH /api/sites/[id] - Update a specific site
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();
    const site = db.updateSite(id, body);
    return NextResponse.json(site);
  } catch (error) {
    console.error("Error updating site:", error);
    return NextResponse.json(
      { error: "Failed to update site" },
      { status: 500 }
    );
  }
}

// DELETE /api/sites/[id] - Delete a specific site
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    db.deleteSite(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting site:", error);
    return NextResponse.json(
      { error: "Failed to delete site" },
      { status: 500 }
    );
  }
}
