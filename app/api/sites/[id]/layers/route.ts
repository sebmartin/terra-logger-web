import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/sites/[id]/layers - List all layers for a site
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const layers = db.listLayersForSite(id);
    return NextResponse.json(layers);
  } catch (error) {
    console.error("Error listing site layers:", error);
    return NextResponse.json(
      { error: "Failed to list site layers" },
      { status: 500 }
    );
  }
}
