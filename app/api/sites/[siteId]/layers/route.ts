import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/sites/[siteId]/layers - List all layers for a site
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params;
    const db = getDb();
    const layers = db.listLayersForSite(siteId);
    return NextResponse.json(layers);
  } catch (error) {
    console.error("Error listing site layers:", error);
    return NextResponse.json(
      { error: "Failed to list site layers" },
      { status: 500 }
    );
  }
}
