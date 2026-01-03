import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/layers/[layerId]/features - List all features for a layer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ layerId: string }> }
) {
  try {
    const { layerId } = await params;
    const db = getDb();
    const features = db.listFeatures(layerId);
    return NextResponse.json(features);
  } catch (error) {
    console.error("Error listing features:", error);
    return NextResponse.json(
      { error: "Failed to list features" },
      { status: 500 }
    );
  }
}

// POST /api/layers/[layerId]/features - Create a new feature
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ layerId: string }> }
) {
  try {
    const { layerId } = await params;
    const body = await request.json();
    const db = getDb();
    const feature = db.createFeature(layerId, body);
    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    console.error("Error creating feature:", error);
    return NextResponse.json(
      { error: "Failed to create feature" },
      { status: 500 }
    );
  }
}
