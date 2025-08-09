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
                var pitchesAsStrings = pitchesBySegmentAsString.split(",");
                var pitches = pitchesAsStrings.map(x => parseFloat(x));
                var volumesAsStrings = volumesBySegmentAsString.split(",");
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
                return this.notes.map(x => x.pitchInHertz).join(",");
            }
            volumesAsPercentagesBySegmentAsString() {
                return this.notes.map(x => x.volumeAsFractionOfMax * 100).join(",");
            }
        }
        SoundEffectSynthesizer.SoundSequence = SoundSequence;
        class SoundSequence_Instances {
            constructor() {
                var voices = SoundEffectSynthesizer.SoundSequenceVoice.Instances();
                var ss = (n, dis, v, pas, das) => SoundSequence.fromNameDurationVoiceAndStringsForPitchesAndDurations(n, dis, v, pas, das);
                this.Bahding = ss("Bahding", 1, voices.Harmonics, "880,1760", "10,10,5,3,1,1,1");
                this.Dahbing = ss("Dahbing", 1, voices.Harmonics, "1760,880", "10,10,5,3,1,1,1");
                this._All =
                    [
                        this.Bahding,
                        this.Dahbing
                    ];
            }
            byName(name) {
                return this._All.find(x => x.name == name);
            }
        }
    })(SoundEffectSynthesizer = ThisCouldBeBetter.SoundEffectSynthesizer || (ThisCouldBeBetter.SoundEffectSynthesizer = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
