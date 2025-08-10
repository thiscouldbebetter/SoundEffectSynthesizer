
namespace ThisCouldBeBetter.SoundEffectSynthesizer
{

export class SoundSequenceNote
{
	offsetInSeconds: number;
	pitchInHertz: number;
	volumeAsFractionOfMax: number;
	durationInSeconds: number;

	constructor
	(
		offsetInSeconds: number,
		pitchInHertz: number,
		volumeAsFractionOfMax: number,
		durationInSeconds: number
	)
	{
		this.offsetInSeconds = offsetInSeconds;
		this.pitchInHertz = pitchInHertz;
		this.volumeAsFractionOfMax = volumeAsFractionOfMax;
		this.durationInSeconds = durationInSeconds;
	}

	static fromOffsetPitchVolumeAndDuration
	(
		offsetInSeconds: number,
		pitchInHertz: number,
		volumeAsFractionOfMax: number,
		durationInSeconds: number
	)
	{
		return new SoundSequenceNote
		(
			offsetInSeconds, pitchInHertz, volumeAsFractionOfMax, durationInSeconds
		);
	}

	setGainAndOscillator(gain: any, oscillator: any): void
	{
		gain.gain.setValueAtTime
		(
			this.volumeAsFractionOfMax, this.offsetInSeconds
		);

		oscillator.frequency.setValueAtTime
		(
			this.pitchInHertz, this.offsetInSeconds
		);
	}

	toSamples
	(
		voice: SoundSequenceVoice,
		samplesPerSecond: number
	): number[]
	{
		var durationInSamples =
			samplesPerSecond * this.durationInSeconds;
		var noteAsSamples = voice.samplesForNote
		(
			samplesPerSecond,
			durationInSamples,
			this.pitchInHertz,
			this.volumeAsFractionOfMax
		);
		return noteAsSamples;
	}
}

}