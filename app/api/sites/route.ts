import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// GET /api/sites - List all sites
export async function GET() {
  try {
    const db = getDb();
    const sites = db.listSites();
    return NextResponse.json(sites);
  } catch (error) {
    console.error("Error listing sites:", error);
    return NextResponse.json(
      { error: "Failed to list sites" },
      { status: 500 }
    );
  }
}

// POST /api/sites - Create a new site
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = getDb();
    const site = db.createSite(body);
    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    console.error("Error creating site:", error);
    return NextResponse.json(
      { error: "Failed to create site" },
      { status: 500 }
    );
  }
}
