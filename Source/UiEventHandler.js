"use strict";
class UiEventHandler {
    static body_Loaded() {
        var d = document;
        var selectSampleEffect = d.getElementById("selectSampleEffect");
        var sampleEffects = SoundSequence.Instances()._All;
        var sampleEffectsAsOptions = sampleEffects.map(sampleEffect => {
            var sampleEffectAsOption = d.createElement("option");
            sampleEffectAsOption.innerHTML = sampleEffect.name;
            return sampleEffectAsOption;
        });
        sampleEffectsAsOptions.forEach(x => selectSampleEffect.appendChild(x));
        var selectVoice = d.getElementById("selectVoice");
        var voices = SoundSequenceVoice.Instances()._All;
        var voicesAsOptions = voices.map(voice => {
            var voiceAsOption = d.createElement("option");
            voiceAsOption.innerHTML = voice.name;
            return voiceAsOption;
        });
        voicesAsOptions.forEach(x => selectVoice.appendChild(x));
        this.selectVoice_Changed(selectVoice);
    }
    static buttonPlay_Clicked() {
        var d = document;
        var inputName = d.getElementById("inputName");
        var name = inputName.value;
        var inputDurationInSeconds = d.getElementById("inputDurationInSeconds");
        var durationInSeconds = parseFloat(inputDurationInSeconds.value);
        var selectVoice = d.getElementById("selectVoice");
        var voiceName = selectVoice.value;
        var voice = SoundSequenceVoice.byName(voiceName);
        var inputPitchesBySegment = d.getElementById("inputPitchesBySegmentInHertz");
        var pitchesBySegmentAsString = inputPitchesBySegment.value;
        var inputVolumesBySegment = d.getElementById("inputVolumesBySegmentAsPercentages");
        var volumesBySegmentAsString = inputVolumesBySegment.value;
        var sequence = SoundSequence.fromNameDurationVoiceAndStringsForPitchesAndDurations(name, durationInSeconds, voice, pitchesBySegmentAsString, volumesBySegmentAsString);
        sequence.play();
    }
    static selectSampleEffect_Changed(selectSampleEffect) {
        var soundSequenceName = selectSampleEffect.value;
        var soundSequence = SoundSequence.byName(soundSequenceName);
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
        var voice = SoundSequenceVoice.byName(voiceName);
        var inputVoiceParameters = d.getElementById("inputVoiceParameters");
        inputVoiceParameters.value = voice.parametersDefault;
    }
}
