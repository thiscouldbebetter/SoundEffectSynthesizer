"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var SoundEffectSynthesizer;
    (function (SoundEffectSynthesizer) {
        class SoundSequenceVoice {
            constructor(name, parametersDefault, oscillatorBuild) {
                this.name = name;
                this.parametersDefault = parametersDefault || "";
                this._oscillatorBuild = oscillatorBuild;
                this.parameters = parametersDefault;
            }
            static fromNameParametersDefaultAndOscillatorBuild(name, parametersDefault, oscillatorBuild) {
                return new SoundSequenceVoice(name, parametersDefault, oscillatorBuild);
            }
            static Instances() {
                if (this._instances == null) {
                    this._instances = new SoundSequenceVoice_Instances();
                }
                return this._instances;
            }
            static byName(name) {
                return this.Instances().byName(name);
            }
            // AudioContext.
            oscillatorBuild(audio) {
                return this._oscillatorBuild(this, audio);
            }
            sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds) {
                // hack - Sine wave.
                var secondsPerCycle = 1 / frequencyInHertz;
                var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
                var fractionOfCycleComplete = secondsSinceCycleStarted / secondsPerCycle;
                var radiansSinceCycleStarted = SoundSequenceVoice.RadiansPerCycle * fractionOfCycleComplete;
                var sample = Math.sin(radiansSinceCycleStarted);
                return sample;
            }
            samplesForNote(samplesPerSecond, durationInSamples, frequencyInHertz, volumeAsFraction) {
                var noteAsSamples = [];
                for (var s = 0; s < durationInSamples; s++) {
                    var timeInSeconds = s / samplesPerSecond;
                    var sample = this.sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds);
                    sample *= volumeAsFraction;
                    noteAsSamples.push(sample);
                }
                return noteAsSamples;
            }
        }
        // Samples.
        SoundSequenceVoice.RadiansPerCycle = 2 * Math.PI;
        SoundEffectSynthesizer.SoundSequenceVoice = SoundSequenceVoice;
        class SoundSequenceVoice_Instances {
            constructor() {
                var v = (n, pd, ob) => SoundSequenceVoice.fromNameParametersDefaultAndOscillatorBuild(n, pd, ob);
                this.Harmonics = v("Harmonics", "0,40,40,100,100,100,30,70,60,50,90,80", this.oscillatorBuild_Harmonics);
                this.Noise = v("Noise", null, this.oscillatorBuild_Noise);
                this.SawtoothWave = v("Sawtooth Wave", null, this.oscillatorBuild_SawtoothWave);
                this.SineWave = v("Sine Wave", null, this.oscillatorBuild_SineWave);
                this.SquareWave = v("Square Wave", null, this.oscillatorBuild_SquareWave);
                this.TriangleWave = v("Triangle Wave", null, this.oscillatorBuild_TriangleWave);
                this._All =
                    [
                        this.Harmonics,
                        this.Noise,
                        this.SawtoothWave,
                        this.SineWave,
                        this.SquareWave,
                        this.TriangleWave
                    ];
            }
            byName(name) {
                return this._All.find(x => x.name == name);
            }
            // Oscillators.
            oscillatorBuild_Harmonics(voice, audio) {
                var oscillator = audio.createOscillator();
                // Adapted from tutorial code found at the URL:
                // "https://www.sitepoint.com/using-fourier-transforms-web-audio-api/".
                var harmonicAmplitudesAsPercentagesAsStrings = voice.parameters.split(",");
                var harmonicAmplitudesAsFractions = harmonicAmplitudesAsPercentagesAsStrings.map(x => parseInt(x) / 100);
                var real = new Float32Array(harmonicAmplitudesAsFractions);
                var imaginary = new Float32Array(real.length); // For phasing?
                var hornTable = audio.createPeriodicWave(real, imaginary);
                oscillator.setPeriodicWave(hornTable);
                return oscillator;
            }
            oscillatorBuild_Noise(voice, audio) {
                var oscillator = audio.createOscillator();
                // Adapted from tutorial code found at the URL:
                // "https://noisehack.com/generate-noise-web-audio-api/".
                var bufferSize = 2 * audio.sampleRate;
                var noiseBuffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
                var output = noiseBuffer.getChannelData(0);
                for (var i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                var noise = audio.createBufferSource();
                noise.buffer = noiseBuffer;
                noise.loop = true;
                // Adapted from tutorial code found at the URL:
                // "https://developer.cdn.mozilla.net/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques#The_noise_%E2%80%94_random_noise_buffer_with_biquad_filter";
                var filter = audio.createBiquadFilter();
                filter.type = "bandpass";
                noise.connect(filter);
                filter.input = noise; // hack - Because there's no .start() on the filter.
                oscillator = filter;
                return oscillator;
            }
            oscillatorBuild_SawtoothWave(voice, audio) {
                var oscillator = audio.createOscillator();
                oscillator.type = "sawtooth";
                return oscillator;
            }
            oscillatorBuild_SineWave(voice, audio) {
                var oscillator = audio.createOscillator();
                oscillator.type = "sine";
                return oscillator;
            }
            oscillatorBuild_SquareWave(voice, audio) {
                var oscillator = audio.createOscillator();
                oscillator.type = "square";
                return oscillator;
            }
            oscillatorBuild_TriangleWave(voice, audio) {
                var oscillator = audio.createOscillator();
                oscillator.type = "triangle";
                return oscillator;
            }
        }
    })(SoundEffectSynthesizer = ThisCouldBeBetter.SoundEffectSynthesizer || (ThisCouldBeBetter.SoundEffectSynthesizer = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
