
class Voice
{
	constructor(name, oscillatorBuild)
	{
		this.name = name;
		this._oscillatorBuild = oscillatorBuild;
	}

	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new Voice_Instances();
		}
		return this._instances;
	}

	static byName(name)
	{
		return this.Instances().byName(name);
	}

	oscillatorBuild(audio)
	{
		return this._oscillatorBuild.call(this, audio);
	}
}

class Voice_Instances
{
	constructor()
	{
		this.Horn = new Voice("Horn", this.oscillatorBuild_Horn);
		this.Noise = new Voice("Noise", this.oscillatorBuild_Noise);
		this.SawtoothWave = new Voice("Sawtooth Wave", this.oscillatorBuild_SawtoothWave);
		this.SineWave = new Voice("Sine Wave", this.oscillatorBuild_SineWave);
		this.SquareWave = new Voice("Square Wave", this.oscillatorBuild_SquareWave);
		this.TriangleWave = new Voice("Triangle Wave", this.oscillatorBuild_TriangleWave);

		this._All =
		[
			this.Horn,
			this.Noise,
			this.SawtoothWave,
			this.SineWave,
			this.SquareWave,
			this.TriangleWave
		];
	}

	byName(name) { return this._All.find(x => x.name == name); }

	// Oscillators.

	oscillatorBuild_Horn(audio)
	{
		var oscillator = audio.createOscillator();

		// Adapted from tutorial code found at the URL:
		// "https://www.sitepoint.com/using-fourier-transforms-web-audio-api/".
		var real = new Float32Array([0,0.4,0.4,1,1,1,0.3,0.7,0.6,0.5,0.9,0.8]);
		var imaginary = new Float32Array(real.length); // For phasing?
		var hornTable = audio.createPeriodicWave(real, imaginary);
		oscillator.setPeriodicWave(hornTable);

		return oscillator;
	}

	oscillatorBuild_Noise(audio)
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

	oscillatorBuild_SawtoothWave(audio)
	{
		var oscillator = audio.createOscillator();
		oscillator.type = "sawtooth";
		return oscillator;
	}

	oscillatorBuild_SineWave(audio)
	{
		var oscillator = audio.createOscillator();
		oscillator.type = "sine";
		return oscillator;
	}

	oscillatorBuild_SquareWave(audio)
	{
		var oscillator = audio.createOscillator();
		oscillator.type = "square";
		return oscillator;
	}

	oscillatorBuild_TriangleWave(audio)
	{
		var oscillator = audio.createOscillator();
		oscillator.type = "triangle";
		return oscillator;
	}

}
