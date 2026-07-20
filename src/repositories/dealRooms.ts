import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

export type DealContextType = "general" | "rfq" | "quotation" | "product";
export type DealRoomStatus = "open" | "archived";

export interface DealRoomRow {
  id: string;
  created_by: string | null;
  initiator_company_id: string;
  counterparty_company_id: string;
  subject: string;
  context_type: DealContextType;
  rfq_id: string | null;
  quotation_id: string | null;
  product_id: string | null;
  status: DealRoomStatus;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface DealMessageRow {
  id: string;
  room_id: string;
  sender_user_id: string | null;
  sender_company_id: string;
  body: string;
  created_at: string;
}

export interface DealCompanySummary {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  country: string | null;
  is_verified: boolean;
}

export interface DealRoomBoard {
  rooms: DealRoomRow[];
  companies: Record<string, DealCompanySummary>;
}

export interface StartDealRoomInput {
  counterpartyCompanyId: string;
  subject: string;
  contextType?: DealContextType;
  rfqId?: string | null;
  quotationId?: string | null;
  productId?: string | null;
}

// The migration in this branch introduces these relations and RPCs. Lovable will
// regenerate Supabase types after applying it; these narrow adapters keep the
// branch buildable before the generated file is refreshed.
function dealRoomsTable() {
  return supabase.from("deal_rooms" as never) as any;
}

function dealMessagesTable() {
  return supabase.from("deal_messages" as never) as any;
}

type RpcError = { message?: string; code?: string } | null;
type RpcResult<T> = Promise<{ data: T | null; error: RpcError }>;

function callUntypedRpc<T>(name: string, args: Record<string, unknown>) {
  return (supabase.rpc as unknown as (fn: string, params: Record<string, unknown>) => RpcResult<T>)(name, args);
}

async function loadCompanies(companyIds: string[]) {
  const ids = Array.from(new Set(companyIds.filter(Boolean)));
  if (!ids.length) return {} as Record<string, DealCompanySummary>;

  const { data, error } = await supabase
    .from("companies_public")
    .select("id,name,slug,logo_url,country,is_verified")
    .in("id", ids);

  if (error) throw new Error(friendlyErrorMessage(error));

  return (data ?? []).reduce<Record<string, DealCompanySummary>>((map, row) => {
    if (!row.id || !row.name || !row.slug) return map;
    map[row.id] = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      logo_url: row.logo_url,
      country: row.country,
      is_verified: Boolean(row.is_verified),
    };
    return map;
  }, {});
}

export async function listDealRooms(): Promise<DealRoomBoard> {
  const { data, error } = await dealRoomsTable()
    .select("*")
    .order("last_message_at", { ascending: false });

  if (error) throw new Error(friendlyErrorMessage(error));
  const rooms = (data ?? []) as DealRoomRow[];
  const companies = await loadCompanies(
    rooms.flatMap((room) => [room.initiator_company_id, room.counterparty_company_id]),
  );
  return { rooms, companies };
}

export async function getDealRoom(id: string): Promise<{ room: DealRoomRow; companies: Record<string, DealCompanySummary> } | null> {
  const { data, error } = await dealRoomsTable().select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(friendlyErrorMessage(error));
  if (!data) return null;

  const room = data as DealRoomRow;
  const companies = await loadCompanies([room.initiator_company_id, room.counterparty_company_id]);
  return { room, companies };
}

export async function listDealMessages(roomId: string): Promise<DealMessageRow[]> {
  const { data, error } = await dealMessagesTable()
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as DealMessageRow[];
}

export async function startDealRoom(input: StartDealRoomInput): Promise<string> {
  const { data, error } = await callUntypedRpc<string>("start_deal_room", {
    _counterparty_company_id: input.counterpartyCompanyId,
    _subject: input.subject,
    _context_type: input.contextType ?? "general",
    _rfq_id: input.rfqId ?? null,
    _quotation_id: input.quotationId ?? null,
    _product_id: input.productId ?? null,
  });

  if (error) throw new Error(friendlyErrorMessage(error));
  if (!data) throw new Error("The deal room could not be created.");
  return data;
}

export async function sendDealMessage(roomId: string, body: string): Promise<string> {
  const { data, error } = await callUntypedRpc<string>("send_deal_message", {
    _room_id: roomId,
    _body: body,
  });

  if (error) throw new Error(friendlyErrorMessage(error));
  if (!data) throw new Error("The message could not be sent.");
  return data;
}