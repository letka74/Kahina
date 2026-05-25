/**
 * Web Speech API text-to-speech utility for Arabic phonemes and words.
 * This runs fully client-side and requires no keys or network servers.
 */

let speechTimeout: any = null;

export function speakText(text: string): Promise<boolean> {
  // Dispatch event immediately so visual subtitles render synchronously with user's tap
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app-speech-text', { detail: { text } }));
  }

  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      // If client-side SpeechSynthesis is not supported, let subtitles show, then clear after 3.5 seconds
      if (speechTimeout) clearTimeout(speechTimeout);
      speechTimeout = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('app-speech-text', { detail: { text: null } }));
        resolve(false);
      }, 3500);
      return;
    }

    try {
      // In Chromium/Chrome, canceling and immediately speaking can cause deadlocks.
      // We cancel running voice and give a safe tiny delay of 80ms before starting some sound
      window.speechSynthesis.cancel();

      // We clear any existing screen-timeout
      if (speechTimeout) clearTimeout(speechTimeout);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA'; // Specific Arabic (Saudi Arabia) locale
      utterance.rate = 0.75;    // Slightly slower rate for perfect phoneme separation
      utterance.pitch = 1.05;   // Child-friendly high pitch

      // Ensure speech synthesis ends correctly, or clears after a hard limit
      const cleanup = () => {
        if (speechTimeout) clearTimeout(speechTimeout);
        window.dispatchEvent(new CustomEvent('app-speech-text', { detail: { text: null } }));
      };

      utterance.onend = () => {
        cleanup();
        resolve(true);
      };

      utterance.onerror = () => {
        cleanup();
        resolve(false);
      };

      // Find the best available Arabic voice on the current device (pre-loaded list)
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').includes('ar-sa')) ||
                          voices.find(v => v.lang.toLowerCase().includes('ar')) ||
                          voices.find(v => v.lang.toLowerCase().includes('ar-'));
                        
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      // Safe trigger with a 80ms gap to evade Chrome Speech choke bug
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error("Speech Synthesis call error:", err);
          speechTimeout = setTimeout(() => {
            window.dispatchEvent(new CustomEvent('app-speech-text', { detail: { text: null } }));
            resolve(false);
          }, 3500);
        }
      }, 80);

      // Hard timeout protective safeguard so subtitles show for a reasonable minimum duration
      speechTimeout = setTimeout(() => {
        cleanup();
        resolve(true);
      }, Math.max(3000, text.length * 150)); // Proportional to string length with 3s floor

    } catch (e) {
      console.error("Audio error:", e);
      speechTimeout = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('app-speech-text', { detail: { text: null } }));
        resolve(false);
      }, 3500);
    }
  });
}

// Warm up and pre-load voices immediately (iOS / WebKit compatibility)
if (typeof window !== 'undefined' && window.speechSynthesis) {
  try {
    window.speechSynthesis.getVoices();
  } catch {}
  
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      try {
        window.speechSynthesis.getVoices();
      } catch {}
    };
  }
}

