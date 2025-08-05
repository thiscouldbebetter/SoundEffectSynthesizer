
class SoundSequenceNote
{
	constructor(offsetInSeconds, pitchInHertz, volumeAsFractionOfMax, durationInSeconds)
	{
		this.offsetInSeconds = offsetInSeconds;
		this.pitchInHertz = pitchInHertz;
		this.volumeAsFractionOfMax = volumeAsFractionOfMax;
		this.durationInSeconds = durationInSeconds;
	}

	static fromOffsetPitchVolumeAndDuration
	(
		offsetInSeconds, pitchInHertz, volumeAsFractionOfMax, durationInSeconds
	)
	{
		return new SoundSequenceNote
		(
			offsetInSeconds, pitchInHertz, volumeAsFractionOfMax, durationInSeconds
		);
	}

	setGainAndOscillator(gain, oscillator)
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
}
