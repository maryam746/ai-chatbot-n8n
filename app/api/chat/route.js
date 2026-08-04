export async function POST(req) {
    try {
      const { message, sessionId } = await req.json();
  
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      if (!webhookUrl) {
        throw new Error("N8N_WEBHOOK_URL not set");
      }
  
      const n8nResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId }),
      });
  
      if (!n8nResponse.ok) {
        const errorText = await n8nResponse.text();
        throw new Error(`n8n error ${n8nResponse.status}: ${errorText}`);
      }
  
      const data = await n8nResponse.json();
      return Response.json({ reply: data.output || "No reply from AI." });
    } catch (err) {
      console.error("Chat API error:", err);
      return Response.json({ reply: `Error: ${err.message}` }, { status: 500 });
    }
  }