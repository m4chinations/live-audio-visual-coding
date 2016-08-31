# Live Audio Visualization Playground

This is a live 2d/3d audio visualization playground, using p5.js!

The following libraries were used:

* [pure css](http://purecss.io/)
* [ace js editor](https://ace.c9.io/#nav=about)
* [split js](https://github.com/nathancahill/Split.js)
* [p5.js and p5.sound.js](https://p5js.org/)


## Usage

The upper editor is run every frame, and is referred to as the "draw loop." This code should clear the canvas, and draw something to it.

The lower editor is run once, before the draw loop. This is a good place to put variables that change over time, and cannot be held in the draw loop.

The variables `rms`, `waveform`, and `spectrum` all hold the audio analysis data. For more information on these values, please visit [this tutorial on mdn](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API). The rms value is more or less a loudness, or volume value.

You can find all the available functions at your disposal at the [p5 reference](https://p5js.org/reference/).

## License

The MIT License (MIT)
Copyright (c) 2016 Tennyson Holloway

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
