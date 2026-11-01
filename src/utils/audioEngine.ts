/**
 * Real-time Ambient Focus Audio Synthesizer via Web Audio API.
 * Generates White Noise, Rain, Lo-fi Beats, Binaural Beats, and Clock Ticks.
 * 100% Client-side synthesized, zero external audio dependency.
 */

export type AmbientSoundType = 'none' | 'whitenoise' | 'rain' | 'lofi' | 'binaural' | 'clock';

class FocusAudioEngine {
  private ctx: AudioContext | null = null;
  private currentType: AmbientSoundType = 'none';
  private gainNode: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public stop() {
    this.activeNodes.forEach(item => {
      if (typeof item === 'number') {
        window.clearInterval(item);
      } else {
        try {
          if ('stop' in item && typeof (item as AudioScheduledSourceNode).stop === 'function') {
            (item as AudioScheduledSourceNode).stop();
          }
          item.disconnect();
        } catch {
          // ignore
        }
      }
    });
    this.activeNodes = [];
    this.currentType = 'none';
  }

  public play(type: AmbientSoundType, volume = 0.5) {
    if (type === 'none') {
      this.stop();
      return;
    }

    this.initContext();
    if (!this.ctx) return;
    this.stop();
    this.currentType = type;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    if (type === 'whitenoise') {
      this.playWhiteNoise();
    } else if (type === 'rain') {
      this.playRain();
    } else if (type === 'lofi') {
      this.playLofiBeats();
    } else if (type === 'binaural') {
      this.playBinaural();
    } else if (type === 'clock') {
      this.playClockTick();
    }
  }

  // 1. Warm White / Brown Noise for Deep Focus
  private playWhiteNoise() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    // Pink/Brown filtering algorithm for comfortable, soothing studying
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();

    this.activeNodes.push(whiteNoise, filter);
  }

  // 2. Soothing Rain Sound with atmospheric filtering
  private playRain() {
    if (!this.ctx || !this.gainNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    // Dual bandpass filters to simulate rain on windowpane
    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(900, this.ctx.currentTime);
    filter1.Q.setValueAtTime(1.0, this.ctx.currentTime);

    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(1400, this.ctx.currentTime);

    noise.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(this.gainNode);
    noise.start();

    this.activeNodes.push(noise, filter1, filter2);
  }

  // 3. Relaxing Lo-Fi Beats: Warm Rhodes Piano 7th Chords + Subtle Vinyl Atmosphere + Mellow Kick/Snare
  private playLofiBeats() {
    if (!this.ctx || !this.gainNode) return;

    // Vinyl crackle generator
    const vinylBufferSize = this.ctx.sampleRate;
    const vinylBuffer = this.ctx.createBuffer(1, vinylBufferSize, this.ctx.sampleRate);
    const vinylOut = vinylBuffer.getChannelData(0);
    for (let i = 0; i < vinylBufferSize; i++) {
      if (Math.random() < 0.003) {
        vinylOut[i] = (Math.random() * 2 - 1) * 0.15;
      } else {
        vinylOut[i] = (Math.random() * 2 - 1) * 0.005;
      }
    }
    const vinylSource = this.ctx.createBufferSource();
    vinylSource.buffer = vinylBuffer;
    vinylSource.loop = true;

    const vinylFilter = this.ctx.createBiquadFilter();
    vinylFilter.type = 'highpass';
    vinylFilter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const vinylGain = this.ctx.createGain();
    vinylGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    vinylSource.connect(vinylFilter);
    vinylFilter.connect(vinylGain);
    vinylGain.connect(this.gainNode);
    vinylSource.start();

    this.activeNodes.push(vinylSource, vinylFilter, vinylGain);

    // Lo-Fi Progression Chords (Chill Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
    // Fmaj7: F3 (174.6), A3 (220), C4 (261.6), E4 (329.6)
    // Em7:   E3 (164.8), G3 (196), B3 (246.9), D4 (293.7)
    // Dm7:   D3 (146.8), F3 (174.6), A3 (220), C4 (261.6)
    // Cmaj7: C3 (130.8), E3 (164.8), G3 (196), B3 (246.9)
    const chords = [
      [174.61, 220.00, 261.63, 329.63],
      [164.81, 196.00, 246.94, 293.66],
      [146.83, 174.61, 220.00, 261.63],
      [130.81, 164.81, 196.00, 246.94],
    ];

    let step = 0;
    const playChordStep = () => {
      if (!this.ctx || !this.gainNode) return;
      const currentChord = chords[step % chords.length];
      const now = this.ctx.currentTime;

      // Play soft warm electric piano chord notes
      currentChord.forEach((freq, noteIdx) => {
        if (!this.ctx || !this.gainNode) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Mellow triangle wave with lowpass filtering
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + noteIdx * 0.04);

        const chordFilter = this.ctx.createBiquadFilter();
        chordFilter.type = 'lowpass';
        chordFilter.frequency.setValueAtTime(700, now);

        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.12, now + 0.15 + noteIdx * 0.04);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(chordFilter);
        chordFilter.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now + noteIdx * 0.04);
        osc.stop(now + 4.0);
      });

      // Mellow soft lo-fi sub-kick on beat 1
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(100, now);
      kickOsc.frequency.exponentialRampToValueAtTime(38, now + 0.28);
      kickGain.gain.setValueAtTime(0.2, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      kickOsc.connect(kickGain);
      kickGain.connect(this.gainNode);
      kickOsc.start(now);
      kickOsc.stop(now + 0.36);

      // Soft rim/snare on beat 3 (after 2 seconds)
      const snareNoise = this.ctx.createOscillator();
      const snareGain = this.ctx.createGain();
      snareNoise.type = 'triangle';
      snareNoise.frequency.setValueAtTime(220, now + 2.0);
      snareGain.gain.setValueAtTime(0.001, now + 1.99);
      snareGain.gain.linearRampToValueAtTime(0.06, now + 2.02);
      snareGain.gain.exponentialRampToValueAtTime(0.001, now + 2.25);

      snareNoise.connect(snareGain);
      snareGain.connect(this.gainNode);
      snareNoise.start(now + 2.0);
      snareNoise.stop(now + 2.26);

      step++;
    };

    // Trigger immediate first chord
    playChordStep();
    // Schedule repeating every 4 seconds (slow chill 60 BPM)
    const lofiInterval = window.setInterval(playChordStep, 4000);
    this.activeNodes.push(lofiInterval);
  }

  // 4. Alpha 40Hz Binaural Beats
  private playBinaural() {
    if (!this.ctx || !this.gainNode) return;
    const merger = this.ctx.createChannelMerger(2);

    const oscL = this.ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(200, this.ctx.currentTime);

    const oscR = this.ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(240, this.ctx.currentTime);

    oscL.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);
    merger.connect(this.gainNode);

    oscL.start();
    oscR.start();

    this.activeNodes.push(oscL, oscR, merger);
  }

  // 5. Lo-Fi Study Clock Tick
  private playClockTick() {
    if (!this.ctx || !this.gainNode) return;
    const tickInterval = window.setInterval(() => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const tickGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      tickGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      tickGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(tickGain);
      tickGain.connect(this.gainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }, 1000);

    this.activeNodes.push(tickInterval);
  }

  public getCurrentType(): AmbientSoundType {
    return this.currentType;
  }
}

export const focusAudio = new FocusAudioEngine();
