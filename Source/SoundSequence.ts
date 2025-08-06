
namespace ThisCouldBeBetter.SoundEffectSynthesizer
{

export class SoundSequence
{
	durationInSeconds: number;
	voice: SoundSequenceVoice;
	notes: SoundSequenceNote[];

	constructor
	(
		durationInSeconds: number,
		voice: SoundSequenceVoice,
		notes: SoundSequenceNote[]
	)
	{
		this.durationInSeconds = durationInSeconds;
		this.voice = voice;
		this.notes = notes;
	}

	static fromDurationVoiceAndNotes
	(
		durationInSeconds: number,
		voice: SoundSequenceVoice,
		notes: SoundSequenceNote[]
	)
	{
		return new SoundSequence(durationInSeconds, voice, notes);
	}

	static fromDurationVoiceAndStringsForPitchesAndDurations
	(
		durationInSeconds: number,
		voice: SoundSequenceVoice,
		pitchesBySegmentAsString: string,
		volumesBySegmentAsString: string
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
			var note = SoundSequenceNote.fromOffsetPitchVolumeAndDuration
			(
				noteOffsetInSeconds, pitch, volume, segmentDurationInSeconds
			);
			notes.push(note);

			noteOffsetInSeconds += segmentDurationInSeconds;
		}

		var sequence = new SoundSequence(durationInSeconds, voice, notes);
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

}