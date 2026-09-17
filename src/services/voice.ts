/**
 * Voice Interaction & Text-to-Speech Controller
 */

export class VoiceController {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static activeUtterance: SpeechSynthesisUtterance | null = null;
  private static recognition: any = null;

  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public static isSpeechSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(window.speechSynthesis);
  }

  public static speak(text: string, lang: 'en' | 'hi' = 'en', onEnd?: () => void): void {
    if (!this.synth) return;
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      this.activeUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.activeUtterance = null;
      if (onEnd) onEnd();
    };

    this.activeUtterance = utterance;
    this.synth.speak(utterance);
  }

  public static stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.activeUtterance = null;
    }
  }

  public static isSpeaking(): boolean {
    return Boolean(this.synth && this.synth.speaking);
  }

  public static startListening(
    lang: 'en' | 'hi' = 'en',
    onResult: (transcript: string) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ): () => void {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      onError(new Error('Speech recognition not supported in this browser.'));
      return () => {};
    }

    try {
      const rec = new SpeechRec();
      rec.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript) onResult(transcript);
      };

      rec.onerror = (event: any) => {
        onError(event.error);
      };

      rec.onend = () => {
        onEnd();
      };

      rec.start();
      this.recognition = rec;

      return () => {
        try {
          rec.stop();
        } catch {
          // ignore
        }
      };
    } catch (e) {
      onError(e);
      return () => {};
    }
  }
}
