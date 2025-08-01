
class Sequence
{
	constructor(durationInSeconds, voice, notes)
	{
		this.durationInSeconds = durationInSeconds;
		this.voice = voice;
		this.notes = notes;
	}

	static fromDurationVoiceAndStringsForPitchesAndDurations
	(
		durationInSeconds,
		voice,
		pitchesBySegmentAsString,
		volumesBySegmentAsString
	)
	{
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
		for (var s = 0; s < segmentCount; s++)
		{
			var pitch = pitches[s] || pitches[pitches.length - 1];
			var volume = volumes[s] || volumes[volumes.length - 1];
			var note = new Note
			(
				noteOffsetInSeconds, pitch, volume, segmentDurationInSeconds
			);
			notes.push(note);

			noteOffsetInSeconds += segmentDurationInSeconds;
		}

		var sequence = new Sequence(durationInSeconds, voice, notes);
		return sequence;
	}

	play()
	{
		var audio = new AudioContext();
		var gain = audio.createGain();
		var oscillator = this.voice.oscillatorBuild(audio);

		this.notes.forEach
		(
			note => note.setGainAndOscillator(gain, oscillator)
		);

		gain.connect(audio.destination);
		oscillator.connect(gain);

		if (oscillator.start == null)
		{
			oscillator = oscillator.input;
		}

		oscillator.start();
		oscillator.stop(this.durationInSeconds);
	}
}