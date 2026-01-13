# Supabase-Integration für Excalidraw-Room

## ⚠️ Wichtige Erkenntnis

Das `excalidraw-room` Backend ist ein **reiner Relay-Server** - es speichert **KEINE Daten** selbst. Es leitet nur verschlüsselte Daten (ArrayBuffer) zwischen Clients weiter.

Das bedeutet:
- ❌ Das Backend sieht die unverschlüsselten Daten **nie**
- ❌ Es gibt keine Persistenz-Schicht im Backend
- ❌ Die Daten sind Client-seitig verschlüsselt

## Warum die Supabase-Integration komplex ist

Die ursprüngliche Dokumentation (`EXCALIDRAW_SUPABASE_INTEGRATION.md`) geht davon aus, dass das Backend:
1. Daten in Redis speichert (für Live-Collaboration)
2. Daten in Supabase synchronisiert (für Langzeit-Persistenz)

**Aber**: Das aktuelle `excalidraw-room` Backend hat:
- ❌ Keine Redis-Integration
- ❌ Keine Speicherung von Daten
- ✅ Nur Socket.IO Relay-Funktionalität

## Optionen für die Persistenz

### Option 1: Client-seitige Persistenz (Nicht empfohlen)
- Die Clients müssten die Daten selbst in Supabase speichern
- Problem: Jeder Client müsste Supabase-Credentials haben (Sicherheitsrisiko)
- Problem: Synchronisation zwischen Clients ist kompliziert

### Option 2: Backend erweitern (Komplex, aber möglich)
Das Backend müsste erweitert werden, um:
1. Daten zu speichern (Redis oder Memory)
2. Die Daten nach Supabase zu synchronisieren

**Aber**: Die Daten sind verschlüsselt, daher müssten wir:
- Die verschlüsselten Daten speichern (weniger nützlich)
- ODER: Die Clients müssten unverschlüsselte Daten senden (Sicherheitsrisiko)

### Option 3: Excalidraw selbst hosten (Alternative)
Statt `excalidraw-room` zu verwenden, könnte man:
- Das vollständige Excalidraw-Frontend selbst hosten
- Eine eigene Persistenz-Schicht implementieren
- Direkte Kontrolle über die Daten

## Aktueller Status

Die Datei `src/persistence/supabase.ts` wurde erstellt, aber:
- ⚠️ Sie kann derzeit **nicht verwendet werden**, da das Backend keine Daten speichert
- ✅ Die Struktur ist vorhanden, falls das Backend erweitert wird

## Empfehlung

Für die **deterministische URL-Generierung** (Phase 1) ist alles fertig:
- ✅ MiroTalk Frontend generiert deterministische URLs
- ✅ Jeder Room hat ein festes Whiteboard

Für die **Langzeit-Persistenz** (Phase 2):
- ⚠️ Die Supabase-Tabelle ist erstellt
- ⚠️ Der Cleanup-Job läuft automatisch
- ❌ Die Backend-Integration ist **nicht möglich** ohne Backend-Erweiterung

## Nächste Schritte

1. **Kurzfristig**: Die deterministische URL-Generierung nutzen (Phase 1 funktioniert)
2. **Mittelfristig**: Überlegen, ob eine Backend-Erweiterung sinnvoll ist
3. **Alternativ**: Excalidraw selbst hosten für vollständige Kontrolle
