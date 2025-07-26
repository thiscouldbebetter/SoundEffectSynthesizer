
class UiEventHandler
{
	static body_Loaded()
	{
		var d = document;

		var selectVoice = d.getElementById("selectVoice");
		var voices = Voice.Instances()._All;
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

	static buttonPlay_Clicked()
	{
		var d = document;

		var inputDurationInSeconds =
			d.getElementById("inputDurationInSeconds");
		var durationInSeconds = parseFloat(inputDurationInSeconds.value);

		var selectVoice = d.getElementById("selectVoice");
		var voiceName = selectVoice.value;
		var voice = Voice.byName(voiceName);

		var inputPitchesBySegment =
			d.getElementById("inputPitchesBySegmentInHertz");
		var pitchesBySegmentAsString = inputPitchesBySegment.value;

		var inputVolumesBySegment =
			d.getElementById("inputVolumesBySegmentAsPercentages");
		var volumesBySegmentAsString = inputVolumesBySegment.value;

		var sequence = Sequence.fromDurationVoiceAndStringsForPitchesAndDurations
		(
			durationInSeconds,
			voice,
			pitchesBySegmentAsString,
			volumesBySegmentAsString
		);

		sequence.play();
	}

	static selectVoice_Changed(selectVoice)
	{
		var d = document;

		var voiceName = selectVoice.value;
		var voice = Voice.byName(voiceName);

		var inputVoiceParameters =
			d.getElementById("inputVoiceParameters");

		inputVoiceParameters.value = voice.parametersDefault;
	}
}
