import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/features/[id] - Get a specific feature
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const feature = db.getFeature(id);

    if (!feature) {
      return NextResponse.json(
        { error: "Feature not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(feature);
  } catch (error) {
    console.error("Error getting feature:", error);
    return NextResponse.json(
      { error: "Failed to get feature" },
      { status: 500 }
    );
  }
}

// PATCH /api/features/[id] - Update a specific feature
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();
    const feature = db.updateFeature(id, body);
    return NextResponse.json(feature);
  } catch (error) {
    console.error("Error updating feature:", error);
    return NextResponse.json(
      { error: "Failed to update feature" },
      { status: 500 }
    );
  }
}

// DELETE /api/features/[id] - Delete a specific feature
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    db.deleteFeature(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting feature:", error);
    return NextResponse.json(
      { error: "Failed to delete feature" },
      { status: 500 }
    );
  }
}
