
class UiEventHandler
{
	static body_Loaded(): void
	{
		var d = document;

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

		var sequence = SoundSequence.fromDurationVoiceAndStringsForPitchesAndDurations
		(
			durationInSeconds,
			voice,
			pitchesBySegmentAsString,
			volumesBySegmentAsString
		);

		sequence.play();
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
