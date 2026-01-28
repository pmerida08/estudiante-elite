/**
 * Audio Recorder Utility
 * Cross-browser audio recording using MediaRecorder API
 */

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  /**
   * Check if the browser supports audio recording
   */
  static isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * Start recording audio from the user's microphone
   */
  async startRecording(): Promise<void> {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      // Determine the best MIME type for this browser
      const mimeType = this.getSupportedMimeType();

      // Create MediaRecorder instance
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
      });

      // Reset chunks
      this.audioChunks = [];

      // Collect audio data
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      throw new Error(
        "No se pudo acceder al micrófono. Por favor, verifica los permisos.",
      );
    }
  }

  /**
   * Stop recording and return the audio blob
   */
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No hay grabación activa"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        // Create blob from chunks
        const mimeType = this.mediaRecorder?.mimeType || "audio/webm";
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });

        // Clean up
        this.cleanup();

        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Cancel recording without returning audio
   */
  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    this.cleanup();
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }

  /**
   * Clean up resources
   */
  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  /**
   * Get the best supported MIME type for this browser
   */
  private getSupportedMimeType(): string {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    // Fallback
    return "audio/webm";
  }
}
