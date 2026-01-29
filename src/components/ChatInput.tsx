import { useState, useRef } from "react";
import "./ChatInput.css";
import { Button } from "./Button";
import { Send, FileText, Mic, MicOff, Loader2 } from "lucide-react";
import { AudioRecorder } from "../lib/audioRecorder";
import { transcribeAudio } from "../lib/transcription";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onGenerateSummary?: () => void;
}

export function ChatInput({
  onSendMessage,
  onGenerateSummary,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSupported] = useState(AudioRecorder.isSupported());
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording and transcribe
      try {
        setIsRecording(false);
        setIsTranscribing(true);

        if (!audioRecorderRef.current) {
          throw new Error("No audio recorder instance");
        }

        // Stop recording and get audio blob
        const audioBlob = await audioRecorderRef.current.stopRecording();

        // Send to transcription service
        const result = await transcribeAudio(audioBlob);

        // Add transcribed text to message field
        if (result.text) {
          setMessage((prev) => (prev ? prev + " " + result.text : result.text));
        }
      } catch (error) {
        console.error("Error during transcription:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Error al transcribir el audio. Por favor, inténtalo de nuevo.",
        );
      } finally {
        setIsTranscribing(false);
        audioRecorderRef.current = null;
      }
    } else {
      // Start recording
      try {
        audioRecorderRef.current = new AudioRecorder();
        await audioRecorderRef.current.startRecording();
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recording:", error);
        alert(
          error instanceof Error
            ? error.message
            : "No se pudo acceder al micrófono. Por favor, verifica los permisos.",
        );
        audioRecorderRef.current = null;
      }
    }
  };

  // Get microphone button icon
  const getMicIcon = () => {
    if (isTranscribing) {
      return <Loader2 size={20} className="animate-spin" />;
    }
    return isRecording ? <MicOff size={20} /> : <Mic size={20} />;
  };

  // Get microphone button title
  const getMicTitle = () => {
    if (isTranscribing) {
      return "Transcribiendo...";
    }
    return isRecording ? "Detener grabación" : "Grabar audio";
  };

  return (
    <div className="chat-input animate-fade-in">
      <div className="chat-input__container">
        <form onSubmit={handleSubmit} className="chat-input__form">
          <div className="chat-input__wrapper">
            <textarea
              ref={textareaRef}
              className="chat-input__field"
              placeholder="Hazme cualquier consulta jurídica..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              disabled={isTranscribing}
              rows={1}
            />

            {/* Schema Button - Icon style like microphone */}
            <button
              type="button"
              onClick={onGenerateSummary}
              className="chat-input__icon-btn chat-input__schema-icon-btn"
              title="Generar esquema de estudio"
            >
              <FileText size={20} />
            </button>

            {/* Microphone Button */}
            {isSupported && (
              <button
                type="button"
                onClick={toggleRecording}
                className={`chat-input__mic-btn ${isRecording ? "recording" : ""} ${isTranscribing ? "transcribing" : ""}`}
                title={getMicTitle()}
                disabled={isTranscribing}
              >
                {getMicIcon()}
              </button>
            )}

            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Send size={18} />}
              disabled={!message.trim() || isTranscribing}
            >
              Consultar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
