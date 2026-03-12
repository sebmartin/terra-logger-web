import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/layers - List all layers
export async function GET() {
  try {
    const db = getDb();
    const layers = db.listLayers();
    return NextResponse.json(layers);
  } catch (error) {
    console.error("Error listing layers:", error);
    return NextResponse.json(
      { error: "Failed to list layers" },
      { status: 500 }
    );
  }
}

// POST /api/layers - Create a new layer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();
    const layer = db.createLayer(body);
    return NextResponse.json(layer, { status: 201 });
  } catch (error) {
    console.error("Error creating layer:", error);
    return NextResponse.json(
      { error: "Failed to create layer" },
      { status: 500 }
    );
  }
}
