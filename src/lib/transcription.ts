/**
 * Audio Transcription Service
 * Sends audio to n8n webhook for transcription using OpenAI Whisper
 */

const TRANSCRIBE_WEBHOOK_URL =
  import.meta.env.VITE_N8N_TRANSCRIBE_WEBHOOK_URL ||
  "https://n8n-pmv-playground.up.railway.app/webhook/transcribe-audio";

interface TranscriptionResponse {
  text: string;
  success: boolean;
  error?: string;
}

/**
 * Transcribe audio blob using OpenAI Whisper via n8n webhook
 */
export async function transcribeAudio(
  audioBlob: Blob,
): Promise<TranscriptionResponse> {
  try {
    // Create FormData to send audio file
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    // Send to n8n webhook
    const response = await fetch(TRANSCRIBE_WEBHOOK_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Error en la transcripción");
    }

    return data;
  } catch (error) {
    console.error("Transcription error:", error);
    throw new Error(
      "No se pudo transcribir el audio. Por favor, inténtalo de nuevo.",
    );
  }
}
