"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var SoundEffectSynthesizer;
    (function (SoundEffectSynthesizer) {
        class UiEventHandler {
            static body_Loaded() {
                var d = document;
                var selectSampleEffect = d.getElementById("selectSampleEffect");
                var sampleEffects = SoundEffectSynthesizer.SoundSequence.Instances()._All;
                var sampleEffectsAsOptions = sampleEffects.map(sampleEffect => {
                    var sampleEffectAsOption = d.createElement("option");
                    sampleEffectAsOption.innerHTML = sampleEffect.name;
                    return sampleEffectAsOption;
                });
                sampleEffectsAsOptions.forEach(x => selectSampleEffect.appendChild(x));
                var selectVoice = d.getElementById("selectVoice");
                var voices = SoundEffectSynthesizer.SoundSequenceVoice.Instances()._All;
                var voicesAsOptions = voices.map(voice => {
                    var voiceAsOption = d.createElement("option");
                    voiceAsOption.innerHTML = voice.name;
                    return voiceAsOption;
                });
                voicesAsOptions.forEach(x => selectVoice.appendChild(x));
                this.selectVoice_Changed(selectVoice);
            }
            static buttonPlayAsAudioContext_Clicked() {
                var sequence = UiEventHandler.soundSequenceFromDom();
                sequence.play();
            }
            static buttonPlayAsWavFile_Clicked() {
                var sequence = UiEventHandler.soundSequenceFromDom();
                var sequenceAsWavFile = sequence.toWavFile();
                var wfv = ThisCouldBeBetter.WavFileViewer;
                var SoundFromWavFile = wfv.SoundFromWavFile;
                var sequenceAsSound = SoundFromWavFile.fromWavFile(sequenceAsWavFile);
                sequenceAsSound.play();
            }
            static selectSampleEffect_Changed(selectSampleEffect) {
                var soundSequenceName = selectSampleEffect.value;
                var soundSequence = SoundEffectSynthesizer.SoundSequence.byName(soundSequenceName);
                var d = document;
                var inputName = d.getElementById("inputName");
                inputName.value = soundSequence.name;
                var inputDurationInSeconds = d.getElementById("inputDurationInSeconds");
                inputDurationInSeconds.value = soundSequence.durationInSeconds;
                var selectVoice = d.getElementById("selectVoice");
                selectVoice.value = soundSequence.voice.name;
                var inputPitchesBySegment = d.getElementById("inputPitchesBySegmentInHertz");
                inputPitchesBySegment.value = soundSequence.pitchesInHertzBySegmentAsString();
                var inputVolumesBySegment = d.getElementById("inputVolumesBySegmentAsPercentages");
                inputVolumesBySegment.value =
                    soundSequence.volumesAsPercentagesBySegmentAsString();
            }
            static selectVoice_Changed(selectVoice) {
                var d = document;
                var voiceName = selectVoice.value;
                var voice = SoundEffectSynthesizer.SoundSequenceVoice.byName(voiceName);
                var inputVoiceParameters = d.getElementById("inputVoiceParameters");
                inputVoiceParameters.value = voice.parametersDefault;
            }
            // Helpers.
            static soundSequenceFromDom() {
                var d = document;
                var inputName = d.getElementById("inputName");
                var name = inputName.value;
                var inputDurationInSeconds = d.getElementById("inputDurationInSeconds");
                var durationInSeconds = parseFloat(inputDurationInSeconds.value);
                var selectVoice = d.getElementById("selectVoice");
                var voiceName = selectVoice.value;
                var voice = SoundEffectSynthesizer.SoundSequenceVoice.byName(voiceName);
                var inputPitchesBySegment = d.getElementById("inputPitchesBySegmentInHertz");
                var pitchesBySegmentAsString = inputPitchesBySegment.value;
                var inputVolumesBySegment = d.getElementById("inputVolumesBySegmentAsPercentages");
                var volumesBySegmentAsString = inputVolumesBySegment.value;
                var sequence = SoundEffectSynthesizer.SoundSequence.fromNameDurationVoiceAndStringsForPitchesAndDurations(name, durationInSeconds, voice, pitchesBySegmentAsString, volumesBySegmentAsString);
                return sequence;
            }
        }
        SoundEffectSynthesizer.UiEventHandler = UiEventHandler;
    })(SoundEffectSynthesizer = ThisCouldBeBetter.SoundEffectSynthesizer || (ThisCouldBeBetter.SoundEffectSynthesizer = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
