import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { asOfDate } from "@/lib/receipt-shopping/asOfDate";
import { addCalendarDays, calculateExpirationStatus } from "@/utils/inventory/expiration";

/**
 * GET /api/inventory/expiring
 * Get inventory items that are expiring soon
 *
 * Query params:
 * - days: number of days to check (default: 7)
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse query parameters
  const { searchParams } = new URL(request.url);
  const daysParam = searchParams.get("days");
  const days = daysParam ? parseInt(daysParam, 10) : 7;

  if (isNaN(days) || days < 0) {
    return NextResponse.json({ error: "Invalid days parameter" }, { status: 400 });
  }

  // Calendar dates in the shared zone, so the window matches the badges.
  const cutoff = addCalendarDays(asOfDate(), days);

  // Fetch items expiring within the specified days (including already expired)
  const { data: items, error } = await supabase
    .from("user_inventory")
    .select(
      `
      *,
      ingredient:Ingredient (id, name)
    `
    )
    .eq("user_id", user.id)
    .not("expiration_date", "is", null)
    .lte("expiration_date", cutoff)
    .order("expiration_date", { ascending: true });

  if (error) {
    console.error("Error fetching expiring items:", error);
    return NextResponse.json({ error: "Failed to fetch expiring items" }, { status: 500 });
  }

  // Transform items with computed properties
  const itemsWithDetails = (items || []).map((item) => {
    const { status, daysUntil } = calculateExpirationStatus(item.expiration_date);
    return {
      id: item.id,
      user_id: item.user_id,
      ingredient_id: item.ingredient_id,
      quantity: item.quantity,
      unit: item.unit,
      location: item.location,
      expiration_date: item.expiration_date,
      min_quantity: item.min_quantity,
      notes: item.notes,
      created_at: item.created_at,
      updated_at: item.updated_at,
      ingredient: item.ingredient,
      expiration_status: status,
      days_until_expiration: daysUntil,
      is_low_stock: item.min_quantity !== null && item.quantity <= item.min_quantity,
    };
  });

  // Group by status
  const expired = itemsWithDetails.filter((i) => i.expiration_status === "expired");
  const critical = itemsWithDetails.filter((i) => i.expiration_status === "critical");
  const warning = itemsWithDetails.filter((i) => i.expiration_status === "warning");

  return NextResponse.json({
    items: itemsWithDetails,
    summary: {
      total: itemsWithDetails.length,
      expired: expired.length,
      critical: critical.length,
      warning: warning.length,
    },
    grouped: {
      expired,
      critical,
      warning,
    },
  });
}
