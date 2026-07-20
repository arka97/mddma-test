import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";
import type { Database } from "@/integrations/supabase/types";

export type DealContextType = "general" | "rfq" | "quotation" | "product";
export type DealRoomStatus = "open" | "archived";

type DealRoomDbRow = Database["public"]["Tables"]["deal_rooms"]["Row"];
type DealMessageDbRow = Database["public"]["Tables"]["deal_messages"]["Row"];

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

const CONTEXT_TYPES: readonly DealContextType[] = ["general", "rfq", "quotation", "product"];
const ROOM_STATUSES: readonly DealRoomStatus[] = ["open", "archived"];

function toContextType(value: string): DealContextType {
  return (CONTEXT_TYPES as readonly string[]).includes(value)
    ? (value as DealContextType)
    : "general";
}

function toRoomStatus(value: string): DealRoomStatus {
  return (ROOM_STATUSES as readonly string[]).includes(value)
    ? (value as DealRoomStatus)
    : "open";
}

function mapRoom(row: DealRoomDbRow): DealRoomRow {
  return {
    id: row.id,
    created_by: row.created_by,
    initiator_company_id: row.initiator_company_id,
    counterparty_company_id: row.counterparty_company_id,
    subject: row.subject,
    context_type: toContextType(row.context_type),
    rfq_id: row.rfq_id,
    quotation_id: row.quotation_id,
    product_id: row.product_id,
    status: toRoomStatus(row.status),
    last_message_at: row.last_message_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapMessage(row: DealMessageDbRow): DealMessageRow {
  return {
    id: row.id,
    room_id: row.room_id,
    sender_user_id: row.sender_user_id,
    sender_company_id: row.sender_company_id,
    body: row.body,
    created_at: row.created_at,
  };
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
  const { data, error } = await supabase
    .from("deal_rooms")
    .select("*")
    .order("last_message_at", { ascending: false });

  if (error) throw new Error(friendlyErrorMessage(error));
  const rooms = (data ?? []).map(mapRoom);
  const companies = await loadCompanies(
    rooms.flatMap((room) => [room.initiator_company_id, room.counterparty_company_id]),
  );
  return { rooms, companies };
}

export async function getDealRoom(
  id: string,
): Promise<{ room: DealRoomRow; companies: Record<string, DealCompanySummary> } | null> {
  const { data, error } = await supabase
    .from("deal_rooms")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(friendlyErrorMessage(error));
  if (!data) return null;

  const room = mapRoom(data);
  const companies = await loadCompanies([room.initiator_company_id, room.counterparty_company_id]);
  return { room, companies };
}

export async function listDealMessages(roomId: string): Promise<DealMessageRow[]> {
  const { data, error } = await supabase
    .from("deal_messages")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []).map(mapMessage);
}

export async function startDealRoom(input: StartDealRoomInput): Promise<string> {
  const { data, error } = await supabase.rpc("start_deal_room", {
    _counterparty_company_id: input.counterpartyCompanyId,
    _subject: input.subject,
    _context_type: input.contextType ?? "general",
    _rfq_id: input.rfqId ?? undefined,
    _quotation_id: input.quotationId ?? undefined,
    _product_id: input.productId ?? undefined,
  });

  if (error) throw new Error(friendlyErrorMessage(error));
  if (!data) throw new Error("The deal room could not be created.");
  return data;
}

export async function sendDealMessage(roomId: string, body: string): Promise<string> {
  const { data, error } = await supabase.rpc("send_deal_message", {
    _room_id: roomId,
    _body: body,
  });

  if (error) throw new Error(friendlyErrorMessage(error));
  if (!data) throw new Error("The message could not be sent.");
  return data;
}
