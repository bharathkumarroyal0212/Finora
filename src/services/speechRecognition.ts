// Web Speech API interface declarations for TypeScript
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export type SpeechState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

export interface SpeechRecognitionHandlers {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (errorMessage: string) => void;
  onStateChange: (state: SpeechState) => void;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentLanguage: string = 'en-IN';
  private handlers: SpeechRecognitionHandlers | null = null;

  constructor() {
    const win = window as unknown as IWindow;
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRec) {
      try {
        this.recognition = new SpeechRec();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.currentLanguage;

        this.recognition.onstart = () => {
          this.isListening = true;
          this.handlers?.onStateChange('listening');
        };

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const combined = (finalTranscript || interimTranscript).trim();
          if (combined && this.handlers) {
            this.handlers.onResult(combined, Boolean(finalTranscript));
          }
        };

        this.recognition.onerror = (event: any) => {
          this.isListening = false;
          let userMessage = 'Microphone recognition error.';

          switch (event.error) {
            case 'not-allowed':
              userMessage = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
              break;
            case 'no-speech':
              userMessage = 'No speech was detected. Please try speaking again.';
              break;
            case 'audio-capture':
              userMessage = 'No microphone was found or audio capture failed.';
              break;
            case 'network':
              userMessage = 'Network error during voice recognition.';
              break;
            default:
              userMessage = `Voice recognition error: ${event.error || 'Unknown error'}`;
          }

          this.handlers?.onError(userMessage);
          this.handlers?.onStateChange('error');
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.handlers?.onStateChange('idle');
        };
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }
  }

  static isSupported(): boolean {
    const win = window as unknown as IWindow;
    return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
  }

  setLanguage(lang: 'English' | 'Telugu'): void {
    this.currentLanguage = lang === 'Telugu' ? 'te-IN' : 'en-IN';
    if (this.recognition) {
      this.recognition.lang = this.currentLanguage;
    }
  }

  startListening(handlers: SpeechRecognitionHandlers): boolean {
    this.handlers = handlers;

    if (!this.recognition) {
      handlers.onError('Voice recognition is not supported in this browser. Please use Google Chrome, Edge, or use text fallback.');
      handlers.onStateChange('error');
      return false;
    }

    try {
      this.recognition.lang = this.currentLanguage;
      this.recognition.start();
      return true;
    } catch (err: any) {
      // If already started, stop and restart
      try {
        this.recognition.stop();
        setTimeout(() => {
          this.recognition.start();
        }, 150);
        return true;
      } catch (e: any) {
        handlers.onError(e?.message || 'Could not start microphone');
        handlers.onStateChange('error');
        return false;
      }
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        // ignore
      }
    }
    this.isListening = false;
    this.handlers?.onStateChange('idle');
  }
}
