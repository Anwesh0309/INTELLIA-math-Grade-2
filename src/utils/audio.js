// src/utils/audio.js
import { audioMap } from './audioMap.js';

let audioEnabled = true;
let currentQueueSymbol = null;
let currentAudioElement = null;
let currentPlaybackResolver = null;
let currentUtterance = null;
let activeFetchControllers = new Set();

// In-memory cache for fetched audio blob URLs
const audioCache = new Map();

// Audio context for sound effects
let audioCtx = null;

// ElevenLabs — fixed voice and credentials (remote TTS voice)
const ELEVENLABS_API_KEY = 'sk_8635b825c246e6afc8e8fca4602dfb6521c288da7f124266';
const ELEVENLABS_VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2';
const ELEVENLABS_TTS_ENDPOINT = `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`;

function getVoiceSettings(style) {
  let voiceSettings = { stability: 0.2, similarity_boost: 0.55, style: 0.5, use_speaker_boost: true };
  if (style === 'celebration') voiceSettings = { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
  if (style === 'encouragement') voiceSettings = { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true };
  if (style === 'question') voiceSettings = { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
  if (style === 'emphasis') voiceSettings = { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
  if (style === 'thinking') voiceSettings = { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true };
  return voiceSettings;
}

function isValidMpegBlob(blob, contentType) {
  if (!blob || blob.size < 64) return false;
  const type = (contentType || blob.type || '').toLowerCase();
  if (!type) return true;
  return type.includes('mpeg') || type.includes('mp3');
}

export const setAudioEnabled = (enabled) => {
  audioEnabled = enabled;
  if (!enabled) stopNarration();
};

export const isAudioEnabled = () => audioEnabled;

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const encourage = (text) => ({ text, style: 'encouragement' });
export const instruct  = (text) => ({ text, style: 'instruction' });

async function fetchFromElevenLabs(text, style) {
  const cacheKey = `${style}:${text}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey);
  }

  const controller = new AbortController();
  activeFetchControllers.add(controller);

  const payload = {
    text,
    model_id: ELEVENLABS_MODEL_ID,
    voice_settings: getVoiceSettings(style),
  };

  console.log('[TTS] request sent', {
    endpoint: ELEVENLABS_TTS_ENDPOINT,
    voiceId: ELEVENLABS_VOICE_ID,
    modelId: ELEVENLABS_MODEL_ID,
    text,
    style,
  });

  try {
    const res = await fetch(ELEVENLABS_TTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const contentType = res.headers.get('content-type') || '';

    if (!res.ok) {
      const errorText = await res.text();
      const apiError = new Error(
        `ElevenLabs TTS failed (${res.status}): ${errorText || res.statusText}`
      );
      console.error('[TTS] response error', apiError);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });

    if (!isValidMpegBlob(blob, contentType)) {
      const invalidError = new Error(
        `Invalid audio/mpeg response (content-type: ${contentType || 'unknown'}, size: ${blob.size})`
      );
      console.error('[TTS] response error', invalidError);
      return null;
    }

    const blobUrl = URL.createObjectURL(blob);
    audioCache.set(cacheKey, blobUrl);

    console.log('[TTS] response success', {
      voiceId: ELEVENLABS_VOICE_ID,
      contentType: contentType || 'audio/mpeg',
      bytes: blob.size,
      blobUrl,
    });

    return blobUrl;
  } catch (err) {
    if (err.name === 'AbortError') {
      return { isCancelled: true };
    }
    console.error('[TTS] response error', err);
    return null;
  } finally {
    activeFetchControllers.delete(controller);
  }
}

export async function getAudioUrl(text, style) {
  if (audioMap[text]) return audioMap[text];
  return await fetchFromElevenLabs(text, style);
}

export function stopNarration() {
  currentQueueSymbol = null;

  activeFetchControllers.forEach((ctrl) => ctrl.abort());
  activeFetchControllers.clear();
  cancelSpeechSynthesis();

  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.src = '';
    } catch (e) {
      console.warn('Error pausing audio:', e);
    }
    currentAudioElement = null;
  }

  if (currentPlaybackResolver) {
    currentPlaybackResolver({ isCancelled: true });
    currentPlaybackResolver = null;
  }
}

function cancelSpeechSynthesis() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn('SpeechSynthesis cancel failed:', e);
    }
  }
  currentUtterance = null;
}

function speakText(text) {
  return new Promise((resolve) => {
    if (
      typeof window === 'undefined' ||
      !window.speechSynthesis ||
      !window.SpeechSynthesisUtterance
    ) {
      resolve(false);
      return;
    }

    cancelSpeechSynthesis();

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.05;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    currentUtterance = utterance;

    utterance.onend = () => {
      if (currentUtterance === utterance) {
        currentUtterance = null;
      }
      resolve(true);
    };

    utterance.onerror = () => {
      if (currentUtterance === utterance) {
        currentUtterance = null;
      }
      resolve(false);
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis speak failed:', err);
      currentUtterance = null;
      resolve(false);
    }
  });
}

function playAudio(audioSource) {
  return new Promise((resolve) => {
    if (!audioEnabled) {
      resolve({ isCancelled: true });
      return;
    }

    if (!audioSource) {
      const err = new Error('No audio source — ElevenLabs did not return playable audio');
      console.error('[TTS] playback failed', err);
      resolve();
      return;
    }

    if (audioSource.isCancelled) {
      resolve({ isCancelled: true });
      return;
    }

    currentPlaybackResolver = resolve;

    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = audioSource;
    currentAudioElement = audio;

    audio.onended = () => {
      if (currentPlaybackResolver === resolve) {
        currentPlaybackResolver = null;
        currentAudioElement = null;
        resolve();
      }
    };

    audio.onerror = () => {
      const mediaError = audio.error;
      const err = new Error(
        mediaError
          ? `Audio element error (code ${mediaError.code}): ${mediaError.message || 'unknown'}`
          : 'Audio element failed to load'
      );
      console.error('[TTS] playback failed', err);
      if (currentPlaybackResolver === resolve) {
        currentPlaybackResolver = null;
        currentAudioElement = null;
        resolve();
      }
    };

    audio
      .play()
      .then(() => {
        console.log('[TTS] playback started', { source: audioSource });
      })
      .catch((err) => {
        console.error('[TTS] playback failed', err);
        if (currentPlaybackResolver === resolve) {
          currentPlaybackResolver = null;
          currentAudioElement = null;
          resolve();
        }
      });
  });
}

export async function narrate(segments, interrupt = false) {
  if (!audioEnabled) return;
  if (interrupt) stopNarration();

  const queueSymbol = Symbol('narrationQueue');
  currentQueueSymbol = queueSymbol;

  const canUseLocalSpeech =
    typeof window !== 'undefined' &&
    window.speechSynthesis &&
    window.SpeechSynthesisUtterance;

  for (let i = 0; i < segments.length; i++) {
    if (currentQueueSymbol !== queueSymbol) return;

    const segment = segments[i];
    const source = await getAudioUrl(segment.text, segment.style);

    if (currentQueueSymbol !== queueSymbol) return;
    if (source && source.isCancelled) return;

    if (source) {
      if (i + 1 < segments.length) {
        getAudioUrl(segments[i + 1].text, segments[i + 1].style);
      }

      const playResult = await playAudio(source);
      if (playResult && playResult.isCancelled) return;
      continue;
    }

    if (canUseLocalSpeech) {
      const spoken = await speakText(segment.text);
      if (currentQueueSymbol !== queueSymbol) return;
      if (spoken) continue;
    }
  }
}

export function playSoundEffect(type) {
  if (!audioEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }
  } catch (err) {
    console.warn('AudioContext sound effect failed:', err);
  }
}
