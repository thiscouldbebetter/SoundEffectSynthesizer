
class UiEventHandler
{
	static body_Loaded(): void
	{
		var d = document;

		var selectSampleEffect =
			d.getElementById("selectSampleEffect");
		var sampleEffects = SoundSequence.Instances()._All;
		var sampleEffectsAsOptions = sampleEffects.map
		(
			sampleEffect =>
			{
				var sampleEffectAsOption = d.createElement("option");
				sampleEffectAsOption.innerHTML = sampleEffect.name;
				return sampleEffectAsOption
			}
		);
		sampleEffectsAsOptions.forEach( x => selectSampleEffect.appendChild(x) );

		var selectVoice = d.getElementById("selectVoice");
		var voices = SoundSequenceVoice.Instances()._All;
		var voicesAsOptions = voices.map
		(
			voice =>
			{
				var voiceAsOption = d.createElement("option");
				voiceAsOption.innerHTML = voice.name;
				return voiceAsOption;
			}
		);
		voicesAsOptions.forEach(x => selectVoice.appendChild(x) );

		this.selectVoice_Changed(selectVoice);
	}

	static buttonPlay_Clicked(): void
	{
		var d = document;

		var inputName: any =
			d.getElementById("inputName");
		var name = inputName.value;

		var inputDurationInSeconds: any =
			d.getElementById("inputDurationInSeconds");
		var durationInSeconds = parseFloat(inputDurationInSeconds.value);

		var selectVoice: any = d.getElementById("selectVoice");
		var voiceName = selectVoice.value;
		var voice = SoundSequenceVoice.byName(voiceName);

		var inputPitchesBySegment: any =
			d.getElementById("inputPitchesBySegmentInHertz");
		var pitchesBySegmentAsString = inputPitchesBySegment.value;

		var inputVolumesBySegment: any =
			d.getElementById("inputVolumesBySegmentAsPercentages");
		var volumesBySegmentAsString = inputVolumesBySegment.value;

		var sequence = SoundSequence.fromNameDurationVoiceAndStringsForPitchesAndDurations
		(
			name,
			durationInSeconds,
			voice,
			pitchesBySegmentAsString,
			volumesBySegmentAsString
		);

		sequence.play();
	}

	static selectSampleEffect_Changed(selectSampleEffect: any): void
	{
		var soundSequenceName = selectSampleEffect.value;

		var soundSequence = SoundSequence.byName(soundSequenceName);

		var d = document;

		var inputName: any =
			d.getElementById("inputName");
		inputName.value = soundSequence.name;

		var inputDurationInSeconds: any =
			d.getElementById("inputDurationInSeconds");
		inputDurationInSeconds.value = soundSequence.durationInSeconds;

		var selectVoice: any = d.getElementById("selectVoice");
		selectVoice.value = soundSequence.voice.name;

		var inputPitchesBySegment: any =
			d.getElementById("inputPitchesBySegmentInHertz");
		inputPitchesBySegment.value = soundSequence.pitchesInHertzBySegmentAsString();

		var inputVolumesBySegment: any =
			d.getElementById("inputVolumesBySegmentAsPercentages");
		inputVolumesBySegment.value =
			soundSequence.volumesAsPercentagesBySegmentAsString();

	}

	static selectVoice_Changed(selectVoice: any): void
	{
		var d = document;

		var voiceName = selectVoice.value;
		var voice = SoundSequenceVoice.byName(voiceName);

		var inputVoiceParameters: any =
			d.getElementById("inputVoiceParameters");

		inputVoiceParameters.value = voice.parametersDefault;
	}
}
