"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var SoundEffectSynthesizer;
    (function (SoundEffectSynthesizer) {
        class SoundSequence {
            constructor(name, durationInSeconds, voice, notes) {
                this.name = name;
                this.durationInSeconds = durationInSeconds;
                this.voice = voice;
                this.notes = notes;
            }
            static byName(name) {
                return SoundSequence.Instances().byName(name);
            }
            static fromNameDurationVoiceAndNotes(name, durationInSeconds, voice, notes) {
                return new SoundSequence(name, durationInSeconds, voice, notes);
            }
            static fromNameDurationVoiceAndStringsForPitchesAndDurations(name, durationInSeconds, voice, pitchesBySegmentAsString, volumesBySegmentAsString) {
                var delimiter = "\n";
                var pitchesAsStrings = pitchesBySegmentAsString.split(delimiter);
                var pitches = pitchesAsStrings.map(x => parseFloat(x));
                var volumesAsStrings = volumesBySegmentAsString.split(delimiter);
                var volumes = volumesAsStrings.map(x => parseFloat(x) / 100);
                var pitchCount = pitches.length;
                var volumeCount = volumes.length;
                var segmentCount = Math.max(pitchCount, volumeCount);
                var segmentDurationInSeconds = durationInSeconds / segmentCount;
                var notes = [];
                var noteOffsetInSeconds = 0;
                for (var s = 0; s < segmentCount; s++) {
                    var pitch = pitches[s] || pitches[pitches.length - 1];
                    var volume = volumes[s] || volumes[volumes.length - 1];
                    var note = SoundEffectSynthesizer.SoundSequenceNote.fromOffsetPitchVolumeAndDuration(noteOffsetInSeconds, pitch, volume, segmentDurationInSeconds);
                    notes.push(note);
                    noteOffsetInSeconds += segmentDurationInSeconds;
                }
                var sequence = new SoundSequence(name, durationInSeconds, voice, notes);
                return sequence;
            }
            static Instances() {
                if (this._instances == null) {
                    this._instances = new SoundSequence_Instances();
                }
                return this._instances;
            }
            play() {
                var audio = new AudioContext();
                var gain = audio.createGain();
                var oscillator = this.voice.oscillatorBuild(audio);
                this.notes.forEach(note => note.setGainAndOscillator(gain, oscillator));
                gain.connect(audio.destination);
                oscillator.connect(gain);
                if (oscillator.start == null) {
                    oscillator = oscillator.input;
                }
                oscillator.start();
                oscillator.stop(this.durationInSeconds);
                this.oscillator = oscillator;
            }
            stop() {
                if (this.oscillator != null) {
                    this.oscillator.stop(0);
                }
            }
            pitchesInHertzBySegmentAsString() {
                return this.notes.map(x => x.pitchInHertz).join("\n");
            }
            volumesAsPercentagesBySegmentAsString() {
                return this.notes.map(x => x.volumeAsFractionOfMax * 100).join("\n");
            }
            // WavFile.
            toSamples(samplesPerSecond, durationInSamples) {
                var notesAsSamplesNormalized = this.notes.map(x => x.toSamples(this.voice, samplesPerSecond));
                var sequenceAsSamplesNormalized = [];
                notesAsSamplesNormalized.forEach(x => sequenceAsSamplesNormalized.push(...x));
                return sequenceAsSamplesNormalized;
            }
            toWavFile() {
                var wfv = ThisCouldBeBetter.WavFileViewer;
                var WavFileSamplingInfo = wfv.WavFileSamplingInfo;
                var WavFile = wfv.WavFile;
                var samplingInfo = WavFileSamplingInfo.default(); // todo
                var samplesPerSecond = samplingInfo.samplesPerSecond;
                var durationInSamples = this.durationInSeconds * samplesPerSecond;
                var samplesNormalized = this.toSamples(samplesPerSecond, durationInSamples);
                var samplesDenormalized = samplingInfo.samplesDenormalize(samplesNormalized);
                var samplesForChannels = [samplesDenormalized];
                var wavFile = WavFile.fromSamplingInfoAndSamplesForChannels(samplingInfo, samplesForChannels);
                return wavFile;
            }
        }
        SoundEffectSynthesizer.SoundSequence = SoundSequence;
        class SoundSequence_Instances {
            constructor() {
                var vs = SoundEffectSynthesizer.SoundSequenceVoice.Instances();
                var comma = ",";
                var newline = "\n";
                var ss = (n, dis, v, pas, das) => SoundSequence.fromNameDurationVoiceAndStringsForPitchesAndDurations(n, dis, v, pas.split(comma).join(newline), das.split(comma).join(newline));
                var pitchesFalling = [];
                for (var i = 0; i < 41; i++) {
                    var pitch = 800 - i * 10;
                    pitchesFalling.push(pitch);
                }
                var pitchesRising = [];
                for (var i = 0; i < 41; i++) {
                    var pitch = 400 + i * 10;
                    pitchesRising.push(pitch);
                }
                this.Bahding = ss("Bahding", 1, vs.Harmonics, "880,1760", "10,10,5,3,1,1,1");
                this.Chop = ss("Chop", 0.25, vs.Noise, "1760,880", "10,10,5,3,1,1,1");
                this.Falling = ss("Falling", 0.25, vs.TriangleWave, pitchesFalling.join(","), "10");
                this.Dahbing = ss("Dahbing", 1, vs.Harmonics, "1760,880", "10,10,5,3,1,1,1");
                this.Rising = ss("Rising", 0.25, vs.TriangleWave, pitchesRising.join(","), "10");
                this.Slash = ss("Slash", 0.25, vs.Noise, "880,1760", "10,10,5,3,1,1,1");
                this.WaveCrash = ss("WaveCrash", 1, vs.Noise, "880,1760", "10,10,5,3,1,1,1");
                this._All =
                    [
                        this.Bahding,
                        this.Chop,
                        this.Dahbing,
                        this.Falling,
                        this.Rising,
                        this.Slash,
                        this.WaveCrash
                    ];
            }
            byName(name) {
                return this._All.find(x => x.name == name);
            }
        }
    })(SoundEffectSynthesizer = ThisCouldBeBetter.SoundEffectSynthesizer || (ThisCouldBeBetter.SoundEffectSynthesizer = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
