const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
const SUMMARY_URL = import.meta.env.VITE_N8N_SUMMARY_WEBHOOK_URL;

export async function sendMessageToTutor(
  message: string,
  userId: string,
  userName: string,
) {
  if (!N8N_WEBHOOK_URL) {
    throw new Error("n8n Webhook URL is not configured");
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        userId: userId,
        userName: userName,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Error en la comunicación con el tutor: ${response.statusText}`,
      );
    }

    const data = await response.json();

    return typeof data === "string"
      ? data
      : data.output || data.response || JSON.stringify(data);
  } catch (error) {
    console.error("error sending message to n8n:", error);
    throw error;
  }
}

export async function generateSchema(conversationId: string) {
  if (!SUMMARY_URL) {
    throw new Error("n8n Summary Webhook URL is not configured");
  }

  try {
    const response = await fetch(SUMMARY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ conversationId }),
    });

    if (!response.ok) {
      throw new Error(`Error generando esquema: ${response.statusText}`);
    }

    const data = await response.json();
    return data.schema || data.output || data.response || JSON.stringify(data);
  } catch (error) {
    console.error("error generating schema in n8n:", error);
    throw error;
  }
}
