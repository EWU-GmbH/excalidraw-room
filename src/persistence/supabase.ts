import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: SupabaseClient | null = null;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "⚠️  Supabase-Integration deaktiviert: SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY nicht gesetzt"
  );
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

/**
 * Speichert Whiteboard-Daten in Supabase
 * @param roomId - Die Room-ID (Hash, 20 Zeichen)
 * @param roomKey - Der Room-Key (22 Zeichen)
 * @param content - Die Excalidraw-Daten (verschlüsselt als ArrayBuffer oder als Objekt)
 */
export async function saveToSupabase(
  roomId: string,
  roomKey: string,
  content: unknown
): Promise<void> {
  if (!supabase) {
    return; // Supabase nicht konfiguriert, überspringen
  }

  try {
    // Konvertiere ArrayBuffer zu JSON-formatierbarem Objekt, falls nötig
    let jsonContent: unknown = content;
    if (content instanceof ArrayBuffer) {
      // Für verschlüsselte Daten: Speichere als Base64-String
      const base64 = Buffer.from(content).toString("base64");
      jsonContent = { encrypted: base64, format: "arraybuffer" };
    }

    const { error } = await supabase
      .from("excalidraw_whiteboards")
      .upsert(
        {
          room_id: roomId,
          room_key: roomKey,
          content: jsonContent,
          last_updated: new Date().toISOString(),
        },
        {
          onConflict: "room_id",
        }
      );

    if (error) {
      console.error("❌ Fehler beim Speichern in Supabase:", error);
    } else {
      console.log(`✅ Whiteboard ${roomId} in Supabase gespeichert`);
    }
  } catch (error) {
    console.error("❌ Exception beim Supabase-Save:", error);
  }
}

/**
 * Lädt Whiteboard-Daten aus Supabase
 * @param roomId - Die Room-ID (Hash, 20 Zeichen)
 * @returns Die Whiteboard-Daten oder null
 */
export async function loadFromSupabase(roomId: string): Promise<{
  content: unknown;
  room_key: string;
} | null> {
  if (!supabase) {
    return null; // Supabase nicht konfiguriert
  }

  try {
    const { data, error } = await supabase
      .from("excalidraw_whiteboards")
      .select("content, room_key")
      .eq("room_id", roomId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Keine Daten gefunden (normal für neue Whiteboards)
        return null;
      }
      console.error("❌ Fehler beim Laden aus Supabase:", error);
      return null;
    }

    console.log(`✅ Whiteboard ${roomId} aus Supabase geladen`);
    return data;
  } catch (error) {
    console.error("❌ Exception beim Supabase-Load:", error);
    return null;
  }
}
