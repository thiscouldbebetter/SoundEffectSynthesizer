
namespace ThisCouldBeBetter.SoundEffectSynthesizer
{

export class SoundSequence
{
	name: string;
	durationInSeconds: number;
	voice: SoundSequenceVoice;
	notes: SoundSequenceNote[];

	oscillator: any;

	constructor
	(
		name: string,
		durationInSeconds: number,
		voice: SoundSequenceVoice,
		notes: SoundSequenceNote[]
	)
	{
		this.name = name;
		this.durationInSeconds = durationInSeconds;
		this.voice = voice;
		this.notes = notes;
	}

	static byName(name: string): SoundSequence
	{
		return SoundSequence.Instances().byName(name);
	}

	static fromNameDurationVoiceAndNotes
	(
		name: string,
		durationInSeconds: number,
		voice: SoundSequenceVoice,
		notes: SoundSequenceNote[]
	): SoundSequence
	{
		return new SoundSequence(name, durationInSeconds, voice, notes);
	}

	static fromNameDurationVoiceAndStringsForPitchesAndDurations
	(
		name: string,
		durationInSeconds: number,
		voice: SoundSequenceVoice,
		pitchesBySegmentAsString: string,
		volumesBySegmentAsString: string
	): SoundSequence
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

		var sequence = new SoundSequence(name, durationInSeconds, voice, notes);
		return sequence;
	}

	static _instances: SoundSequence_Instances;
	static Instances(): SoundSequence_Instances
	{
		if (this._instances == null)
		{
			this._instances = new SoundSequence_Instances();
		}
		return this._instances;
	}

	play(): void
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

		this.oscillator = oscillator;
	}

	stop(): void
	{
		if (this.oscillator != null)
		{
			this.oscillator.stop(0);
		}
	}

	pitchesInHertzBySegmentAsString(): string
	{
		return this.notes.map(x => x.pitchInHertz).join(",");
	}

	volumesAsPercentagesBySegmentAsString(): string
	{
		return this.notes.map(x => x.volumeAsFractionOfMax * 100).join(",");
	}

}

class SoundSequence_Instances
{
	Bahding: SoundSequence;
	Dahbing: SoundSequence;

	_All: SoundSequence[];

	constructor()
	{
		var voices = SoundSequenceVoice.Instances();

		var ss =
			(n: string, dis: number, v: SoundSequenceVoice, pas: string, das: string) =>
				SoundSequence.fromNameDurationVoiceAndStringsForPitchesAndDurations(n, dis, v, pas, das);

		this.Bahding = ss("Bahding", 1, voices.Harmonics, "880,1760", "10,10,5,3,1,1,1" );
		this.Dahbing = ss("Dahbing", 1, voices.Harmonics, "1760,880", "10,10,5,3,1,1,1" );

		this._All =
		[
			this.Bahding,
			this.Dahbing
		];
	}

	byName(name: string): SoundSequence
	{
		return this._All.find(x => x.name == name);
	}
}

}