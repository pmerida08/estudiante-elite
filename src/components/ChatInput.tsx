import { useState, useEffect, useRef } from "react";
import "./ChatInput.css";
import { Button } from "./Button";
import { Send, FileText, Mic, MicOff } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onGenerateSummary?: () => void;
}

// Check if browser supports Speech Recognition
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export function ChatInput({
  onSendMessage,
  onGenerateSummary,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>(""); // Track final transcript

  useEffect(() => {
    // Check if Speech Recognition is supported
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Enable continuous recognition
      recognition.interimResults = true;
      recognition.lang = "es-ES"; // Spanish language
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        // Process only new results starting from resultIndex
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        // Update the message field
        if (finalTranscript) {
          // Add final transcript to our reference
          finalTranscriptRef.current += finalTranscript;
          setMessage(finalTranscriptRef.current);
        } else if (interimTranscript) {
          // Show interim results without saving them
          setMessage(finalTranscriptRef.current + interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        // Only stop recording on actual errors, not on 'no-speech' or 'aborted'
        if (event.error !== "no-speech" && event.error !== "aborted") {
          setIsRecording(false);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      finalTranscriptRef.current = ""; // Reset transcript
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      // Don't reset here - keep the transcript for user to review/edit
    } else {
      try {
        // Reset transcript when starting new recording
        finalTranscriptRef.current = message; // Keep existing text
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    }
  };

  return (
    <div className="chat-input animate-fade-in">
      <div className="chat-input__container">
        <form onSubmit={handleSubmit} className="chat-input__form">
          <div className="chat-input__wrapper">
            <input
              type="text"
              className="chat-input__field"
              placeholder="Hazme cualquier consulta jurídica..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
                className={`chat-input__mic-btn ${isRecording ? "recording" : ""}`}
                title={isRecording ? "Detener grabación" : "Grabar audio"}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
            )}

            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Send size={18} />}
              disabled={!message.trim()}
            >
              Consultar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
