import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/layers/[id] - Get a specific layer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const layer = db.getLayer(id);
    
    if (!layer) {
      return NextResponse.json(
        { error: "Layer not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(layer);
  } catch (error) {
    console.error("Error getting layer:", error);
    return NextResponse.json(
      { error: "Failed to get layer" },
      { status: 500 }
    );
  }
}

// PATCH /api/layers/[id] - Update a specific layer
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDb();
    const layer = db.updateLayer(id, body);
    return NextResponse.json(layer);
  } catch (error) {
    console.error("Error updating layer:", error);
    return NextResponse.json(
      { error: "Failed to update layer" },
      { status: 500 }
    );
  }
}

// DELETE /api/layers/[id] - Delete a specific layer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    db.deleteLayer(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting layer:", error);
    return NextResponse.json(
      { error: "Failed to delete layer" },
      { status: 500 }
    );
  }
}
