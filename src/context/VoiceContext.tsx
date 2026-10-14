import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SpeechRecognitionService, SpeechState } from '../services/speechRecognition';
import { VoiceParserService } from '../services/voiceParserService';
import { ParsedShopItemDraft, ParsedTransactionDraft } from '../types/speech';
import { useFinance } from './FinanceContext';

interface VoiceContextType {
  isListening: boolean;
  speechState: SpeechState;
  transcript: string;
  errorMessage: string | null;
  activeLanguage: 'English' | 'Telugu';
  setLanguage: (lang: 'English' | 'Telugu') => void;
  startListening: () => void;
  stopListening: () => void;
  processTextInput: (text: string) => void;
  clearDrafts: () => void;
  personalDrafts: ParsedTransactionDraft[];
  setPersonalDrafts: React.Dispatch<React.SetStateAction<ParsedTransactionDraft[]>>;
  shopDrafts: ParsedShopItemDraft[];
  setShopDrafts: React.Dispatch<React.SetStateAction<ParsedShopItemDraft[]>>;
  hasMissingAmount: boolean;
  clarificationPrompt?: string;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode, products } = useFinance();
  const [speechState, setSpeechState] = useState<SpeechState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<'English' | 'Telugu'>('English');

  const [personalDrafts, setPersonalDrafts] = useState<ParsedTransactionDraft[]>([]);
  const [shopDrafts, setShopDrafts] = useState<ParsedShopItemDraft[]>([]);
  const [hasMissingAmount, setHasMissingAmount] = useState<boolean>(false);
  const [clarificationPrompt, setClarificationPrompt] = useState<string | undefined>(undefined);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  const speechServiceRef = useRef<SpeechRecognitionService | null>(null);

  useEffect(() => {
    speechServiceRef.current = new SpeechRecognitionService();
  }, []);

  const setLanguage = (lang: 'English' | 'Telugu') => {
    setActiveLanguage(lang);
    speechServiceRef.current?.setLanguage(lang);
  };

  const processText = (text: string) => {
    setSpeechState('processing');
    const result = VoiceParserService.parseVoiceInput(text, products, mode);

    setPersonalDrafts(result.personalTransactions);
    setShopDrafts(result.shopTransactions);
    setHasMissingAmount(result.hasMissingAmount);
    setClarificationPrompt(result.clarificationPrompt);

    if (result.personalTransactions.length > 0 || result.shopTransactions.length > 0 || result.hasMissingAmount) {
      setIsReviewModalOpen(true);
      setSpeechState('success');
    } else {
      setSpeechState('idle');
    }
  };

  const startListening = () => {
    setErrorMessage(null);
    setTranscript('');
    setHasMissingAmount(false);
    setClarificationPrompt(undefined);

    if (!speechServiceRef.current) {
      speechServiceRef.current = new SpeechRecognitionService();
    }

    const started = speechServiceRef.current.startListening({
      onResult: (text: string, isFinal: boolean) => {
        setTranscript(text);
        if (isFinal) {
          speechServiceRef.current?.stopListening();
          processText(text);
        }
      },
      onError: (msg: string) => {
        setErrorMessage(msg);
        setSpeechState('error');
      },
      onStateChange: (state: SpeechState) => {
        setSpeechState(state);
      }
    });

    if (!started) {
      // Not supported or permission issue
    }
  };

  const stopListening = () => {
    speechServiceRef.current?.stopListening();
    if (transcript.trim()) {
      processText(transcript);
    }
  };

  const processTextInput = (text: string) => {
    setTranscript(text);
    processText(text);
  };

  const clearDrafts = () => {
    setPersonalDrafts([]);
    setShopDrafts([]);
    setTranscript('');
    setHasMissingAmount(false);
    setClarificationPrompt(undefined);
    setIsReviewModalOpen(false);
    setSpeechState('idle');
    setErrorMessage(null);
  };

  return (
    <VoiceContext.Provider
      value={{
        isListening: speechState === 'listening',
        speechState,
        transcript,
        errorMessage,
        activeLanguage,
        setLanguage,
        startListening,
        stopListening,
        processTextInput,
        clearDrafts,
        personalDrafts,
        setPersonalDrafts,
        shopDrafts,
        setShopDrafts,
        hasMissingAmount,
        clarificationPrompt,
        isReviewModalOpen,
        setIsReviewModalOpen
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
