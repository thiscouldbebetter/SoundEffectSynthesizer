
namespace ThisCouldBeBetter.SoundEffectSynthesizer
{

export class SoundSequenceVoice
{
	name: string;
	parametersDefault: string;
	_oscillatorBuild: (voice: SoundSequenceVoice, audio: any) => any;
	_sampleForFrequencyAndTime:
		(frequencyInHertz: number, timeInSeconds: number) => number;

	parameters: string;

	constructor
	(
		name: string,
		parametersDefault: string,
		oscillatorBuild: (voice: SoundSequenceVoice, audio: any) => any,
		sampleForFrequencyAndTime: (frequencyInHertz: number, timeInSeconds: number) => number
	)
	{
		this.name = name;
		this.parametersDefault = parametersDefault || "";
		this._oscillatorBuild = oscillatorBuild;
		this._sampleForFrequencyAndTime = sampleForFrequencyAndTime;

		this.parameters = parametersDefault;
	}

	static fromNameParametersDefaultOscillatorBuildAndSampleForFrequencyAndTime
	(
		name: string,
		parametersDefault: string,
		oscillatorBuild: (voice: SoundSequenceVoice, audio: any) => any,
		sampleForFrequencyAndTime: (frequencyInHertz: number, timeInSeconds: number) => number
	)
	{
		return new SoundSequenceVoice
		(
			name, parametersDefault, oscillatorBuild, sampleForFrequencyAndTime
		);
	}

	static _instances: SoundSequenceVoice_Instances;
	static Instances(): SoundSequenceVoice_Instances
	{
		if (this._instances == null)
		{
			this._instances = new SoundSequenceVoice_Instances();
		}
		return this._instances;
	}

	static byName(name: string): SoundSequenceVoice
	{
		return this.Instances().byName(name);
	}

	// AudioContext.

	oscillatorBuild(audio: any): any
	{
		return this._oscillatorBuild(this, audio);
	}

	// Samples.

	static RadiansPerCycle = 2 * Math.PI;

	sampleForFrequencyAndTime
	(
		frequencyInHertz: number, timeInSeconds: number
	): number
	{
		return this._sampleForFrequencyAndTime(frequencyInHertz, timeInSeconds);
	}

	samplesForNote
	(
		samplesPerSecond: number,
		durationInSamples: number,
		frequencyInHertz: number,
		volumeAsFraction: number
	): number[]
	{
		var noteAsSamples = [];

		for (var s = 0; s < durationInSamples; s++)
		{
			var timeInSeconds = s / samplesPerSecond;
			var sample = this.sampleForFrequencyAndTime
			(
				frequencyInHertz, timeInSeconds
			);
			sample *= volumeAsFraction;
			noteAsSamples.push(sample);
		}

		return noteAsSamples;
	}

}

class SoundSequenceVoice_Instances
{
	Harmonics: SoundSequenceVoice;
	Noise: SoundSequenceVoice;
	SawtoothWave: SoundSequenceVoice;
	SineWave: SoundSequenceVoice;
	SquareWave: SoundSequenceVoice;
	TriangleWave: SoundSequenceVoice;

	_All: SoundSequenceVoice[];

	constructor()
	{
		var v =
			(
				n: string,
				pd: string,
				ob: (v: SoundSequenceVoice, x: any) => any,
				sffat: (fih: number, tis: number) => number
			) =>
				SoundSequenceVoice
					.fromNameParametersDefaultOscillatorBuildAndSampleForFrequencyAndTime
					(
						n, pd, ob, sffat
					);

		this.Harmonics = v
		(
			"Harmonics",
			"0,40,40,100,100,100,30,70,60,50,90,80",
			this.oscillatorBuild_Harmonics,
			this.sampleForFrequencyAndTime_Harmonics // todo
		);
		this.Noise = v
		(
			"Noise",
			null,
			this.oscillatorBuild_Noise,
			this.sampleForFrequencyAndTime_Noise
		);
		this.SawtoothWave = v
		(
			"Sawtooth Wave",
			null,
			this.oscillatorBuild_SawtoothWave,
			this.sampleForFrequencyAndTime_SawtoothWave
		);
		this.SineWave = v
		(
			"Sine Wave",
			null,
			this.oscillatorBuild_SineWave,
			this.sampleForFrequencyAndTime_SineWave
		);
		this.SquareWave = v
		(
			"Square Wave",
			null,
			this.oscillatorBuild_SquareWave,
			this.sampleForFrequencyAndTime_SquareWave
		);
		this.TriangleWave = v
		(
			"Triangle Wave",
			null,
			this.oscillatorBuild_TriangleWave,
			this.sampleForFrequencyAndTime_TriangleWave
		);

		this._All =
		[
			this.Harmonics,
			this.Noise,
			this.SawtoothWave,
			this.SineWave,
			this.SquareWave,
			this.TriangleWave
		];
	}

	byName(name: string): SoundSequenceVoice
	{
		return this._All.find(x => x.name == name);
	}

	// Oscillators.

	oscillatorBuild_Harmonics(voice: SoundSequenceVoice, audio: any): any
	{
		var oscillator = audio.createOscillator();

		// Adapted from tutorial code found at the URL:
		// "https://www.sitepoint.com/using-fourier-transforms-web-audio-api/".

		var harmonicAmplitudesAsPercentagesAsStrings =
			voice.parameters.split(",");
		var harmonicAmplitudesAsFractions =
			harmonicAmplitudesAsPercentagesAsStrings.map(x => parseInt(x) / 100 );
		var real = new Float32Array(harmonicAmplitudesAsFractions);
		var imaginary = new Float32Array(real.length); // For phasing?
		var hornTable = audio.createPeriodicWave(real, imaginary);
		oscillator.setPeriodicWave(hornTable);

		return oscillator;
	}

	oscillatorBuild_Noise(voice: SoundSequenceVoice, audio: any): any
	{
		var oscillator = audio.createOscillator();

		// Adapted from tutorial code found at the URL:
		// "https://noisehack.com/generate-noise-web-audio-api/".

		var bufferSize = 2 * audio.sampleRate;
		var noiseBuffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
		var output = noiseBuffer.getChannelData(0);
		for (var i = 0; i < bufferSize; i++)
		{
			output[i] = Math.random() * 2 - 1;
		}

		var noise = audio.createBufferSource();
		noise.buffer = noiseBuffer;
		noise.loop = true;

		// Adapted from tutorial code found at the URL:
		// "https://developer.cdn.mozilla.net/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques#The_noise_%E2%80%94_random_noise_buffer_with_biquad_filter";
		var filter = audio.createBiquadFilter();
		filter.type = "bandpass";
		noise.connect(filter);
		filter.input = noise; // hack - Because there's no .start() on the filter.

		oscillator = filter;

		return oscillator;
	}

	oscillatorBuild_SawtoothWave(voice: SoundSequenceVoice, audio: any): any
	{
		var oscillator = audio.createOscillator();
		oscillator.type = "sawtooth";
		return oscillator;
	}

	oscillatorBuild_SineWave(voice: SoundSequenceVoice, audio: any): any
	{
		var oscillator = audio.createOscillator();
		oscillator.type = "sine";
		return oscillator;
	}

	oscillatorBuild_SquareWave(voice: SoundSequenceVoice, audio: any): any
	{
		var oscillator = audio.createOscillator();
		oscillator.type = "square";
		return oscillator;
	}

	oscillatorBuild_TriangleWave(voice: SoundSequenceVoice, audio: any): any
	{
		var oscillator = audio.createOscillator();
		oscillator.type = "triangle";
		return oscillator;
	}

	// Samples.

	sampleForFrequencyAndTime_Harmonics
	(
		frequencyInHertz: number, timeInSeconds: number
	): number
	{
		throw new Error("Not yet implemented!");

		var returnValue = 0;

		var absoluteAmplitudesOfHarmonics: number[] = []; // todo

		for (var i = 0; i < absoluteAmplitudesOfHarmonics.length; i++)
		{
			var amplitudeOfHarmonic = absoluteAmplitudesOfHarmonics[i];
			var frequencyOfHarmonic = frequencyInHertz * (i + 1);
			var sampleForHarmonic = this.sampleForFrequencyAndTime_SineWave
			(
				frequencyOfHarmonic, timeInSeconds
			);
			sampleForHarmonic *= amplitudeOfHarmonic;
			returnValue += sampleForHarmonic;
		}

		return returnValue;
	}

	sampleForFrequencyAndTime_Noise
	(
		frequencyInHertz: number, timeInSeconds: number
	): number
	{
		return Math.random() * 2 - 1;
	}


	sampleForFrequencyAndTime_SawtoothWave(frequencyInHertz: number, timeInSeconds: number): number
	{
		var secondsPerCycle = 1 / frequencyInHertz;
		var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
		var fractionOfCycleComplete =
			secondsSinceCycleStarted / secondsPerCycle;
		var sample = fractionOfCycleComplete;
		sample = sample * 2 - 1;
		return sample;
	}

	sampleForFrequencyAndTime_SineWave(frequencyInHertz: number, timeInSeconds: number): number
	{
		var secondsPerCycle = 1 / frequencyInHertz;
		var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
		var fractionOfCycleComplete =
			secondsSinceCycleStarted / secondsPerCycle;
		var radiansSinceCycleStarted =
			SoundSequenceVoice.RadiansPerCycle * fractionOfCycleComplete;
		var sample = Math.sin(radiansSinceCycleStarted);
		return sample;
	}

	sampleForFrequencyAndTime_SquareWave
	(
		frequencyInHertz: number, timeInSeconds: number
	): number
	{
		var secondsPerCycle = 1 / frequencyInHertz;
		var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
		var fractionOfCycleComplete =
			secondsSinceCycleStarted / secondsPerCycle;
		var sample = (fractionOfCycleComplete <= .5 ? 1 : -1);
		return sample;
	}

	sampleForFrequencyAndTime_TriangleWave
	(
		frequencyInHertz: number, timeInSeconds: number
	): number
	{
		var secondsPerCycle = 1 / frequencyInHertz;
		var secondsSinceCycleStarted = timeInSeconds % secondsPerCycle;
		var fractionOfCycleComplete =
			secondsSinceCycleStarted / secondsPerCycle;
		var sample;
		if (fractionOfCycleComplete <= .5)
		{
			sample = fractionOfCycleComplete;
		}
		else
		{
			sample = 1 - fractionOfCycleComplete;
		}
		sample = sample * 4 - 1;

		return sample;
	}


}

}