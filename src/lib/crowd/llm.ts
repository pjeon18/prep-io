/**
 * Optional LLM-driven crowd chatter via the Vite dev proxy (/api/crowd).
 * The API key lives server-side in the proxy; this module never sees it.
 * Any failure returns null and the engine silently falls back to the
 * scripted pools — on the static Pages build there is no proxy, so the
 * crowd is always scripted there.
 */

let llmDead = false;

export async function fetchCrowdLines(
  sessionTitle: string,
  hostHeadline: string,
  count: number,
): Promise<string[] | null> {
  if (llmDead) return null;
  try {
    const res = await fetch("/api/crowd", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        system:
          "You generate chat messages for a live career office-hours stream on Prep.io " +
          "(think Twitch chat, but college students asking about careers). " +
          "Messages are short (under 15 words), lowercase-casual, sincere, varied. " +
          "No emoji. Respond ONLY with a JSON array of strings.",
        messages: [
          {
            role: "user",
            content: `Session: "${sessionTitle}" hosted by ${hostHeadline}. Generate ${count} distinct viewer chat messages.`,
          },
        ],
      }),
    });
    if (!res.ok) {
      llmDead = true;
      return null;
    }
    const data = await res.json();
    const text: string = data?.content?.[0]?.text ?? "";
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");
    if (start === -1 || end === -1) return null;
    const arr = JSON.parse(text.slice(start, end + 1));
    if (!Array.isArray(arr)) return null;
    return arr.filter((x): x is string => typeof x === "string" && x.length > 0);
  } catch {
    llmDead = true;
    return null;
  }
}
