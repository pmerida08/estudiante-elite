import { supabase } from "./supabase";

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  topic?: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export async function getConversations() {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Conversation[];
}

export async function createConversation(
  title: string = "Nueva sesión de estudio",
) {
  const { data, error } = await supabase
    .from("conversations")
    .insert([{ title }])
    .select()
    .single();

  if (error) throw error;
  return data as Conversation;
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Message[];
}

export async function saveMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string,
) {
  const { data, error } = await supabase
    .from("messages")
    .insert([{ conversation_id: conversationId, role, content }])
    .select()
    .single();

  if (error) throw error;

  // Update the conversation's updated_at timestamp
  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return data as Message;
}
