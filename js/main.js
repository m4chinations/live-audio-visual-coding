
/* constants */
var editor1, editor2, draw, canvas,
    width, height, rms, waveform, spectrum,
    analyser, setup, audio, fft, preload, amplitude;

/* audio source */
var _radio = './moonlight_reprise.mp3';

/* like $(document).ready */
document.addEventListener("DOMContentLoaded", function() {
    var init = function() {

        editor1 = ace.edit('editor1');
        editor1.setTheme('ace/theme/monokai');
        editor1.getSession().setMode('ace/mode/javascript');

        editor2 = ace.edit('editor2');
        editor2.setTheme('ace/theme/monokai');
        editor2.getSession().setMode('ace/mode/javascript');

        if (getQueryParams(document.location.search)['e1'] || getQueryParams(document.location.search)['e2']) {
            if (getQueryParams(document.location.search)['e1']) {
                var str = getQueryParams(document.location.search)['e1'];
                str = window.atob(str);
                editor1.setValue(str, -1);
            }

            if (getQueryParams(document.location.search)['e2']) {
                var str = getQueryParams(document.location.search)['e2'];
                str = window.atob(str);
                editor2.setValue(str, -1);
            }
        } else {
            if (getQueryParams(document.location.search)['webgl']) {
                editor1.setValue(example3d1, -1);
                editor2.setValue(example3d2, -1);
            } else {
                editor1.setValue(example2d, -1);
            }
        }

        Split(['#screen', '#edit'], {
            sizes: [75, 25],
            minSize: 200,
            onDrag: function() { resize(); }
        });

        Split(['#editor1', '#editor2'], {
            sizes: [75, 25],
            direction: 'vertical',
            minSize: 200,
        });

        function updateURL () {
            var url = UpdateQueryString('e1', window.btoa(editor1.getValue()));
            var url = UpdateQueryString('e2', window.btoa(editor2.getValue()), url);
            if (history.pushState) {
                window.history.replaceState({path:url},'',url);
            }
        } updateURL();

        var lastChange = Date.now();
        editor1.getSession().on('change', function(e) {
            updateURL();
            if (Date.now() - 1000 > lastChange) {
                lastChange = Date.now();
                try {
                    update();
                } catch (e) {
                    console.log(e);
                    lastChange = Date.now() - 1000;
                }
            }
        });

        editor2.getSession().on('change', function(e) {
            updateURL();
            if (Date.now() - 1000 > lastChange) {
                lastChange = Date.now();
                try {
                    update();
                } catch (e) {
                    console.log(e);
                    lastChange = Date.now() - 1000;
                }
            }
        });
    }; init();

    preload = function() {
        audio = loadSound(_radio);
    };

    setup = function() {
        if (getQueryParams(document.location.search)['webgl'])
            canvas = createCanvas(width, height, WEBGL);
        else
            canvas = createCanvas(width, height);

        canvas.parent('screen');

        audio.loop();
        fft = new p5.FFT(0.5);
        amplitude = new p5.Amplitude(0.5);

        fft.setInput(audio);
        resize = function () {
            width = document.querySelector('#screen').clientWidth;
            height = document.querySelector('#screen').clientHeight;
            canvas.resize(width, height);
        }; resize(); window.addEventListener('resize', resize, false);
        update();
    }

    function update() {
        eval(editor2.getValue());
        draw = function () {
            spectrum = fft.analyze();
            rms = amplitude.getLevel();
            waveform = fft.waveform();
            try {
                eval(editor1.getValue());
            } catch (e) {

            }
        };
    }
});

/* from https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters */
function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

/* from https://stackoverflow.com/questions/5999118/add-or-update-query-string-parameter */
function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}

function enter() {
    if (getQueryParams(document.location.search)['webgl']) {
        window.location.href = '/';
    }
}

function hide () {
    document.querySelector('.pane').style = 'display: none';
}


var example2d = `/* waveform viewer */
background(0);

noFill();
beginShape();
stroke(frameCount % 256 + 50,frameCount % 256 + 150,frameCount % 256 + 250); // waveform is red
strokeWeight(1);
for (var i = 0; i< waveform.length; i++){
    var x = map(i, 0, waveform.length, 0, width);
    var y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
}
endShape();

/* spectrum viewer */
var barSize = width / spectrum.length * 5;
var x = 0;

for (var i = 0; i < spectrum.length; i++) {
    var y = map(spectrum[i], 0, 256, 0, height);
    rect(x, 0, barSize, spectrum[i]);
    x += barSize + 5;
}
`;

var example3d1 = `

background(18, 18, 18);

stroke(255);

var targX = rms * 10;
var dx = targX - rotX;
rotX += dx * 0.05;

var targY = rms * 10;
var dy = targY - rotY;
rotY += dy * 0.05;

var targZ = rms * 10;
var dz = targZ - rotZ;
rotZ += dz * 0.05;

rotateX(rotX);
rotateY(rotY / 2.0);
rotateZ(rotZ);

push();
 stroke(rms, 20.0);
 rotateX(rms);
 translate(30.0, 0, 0);
 box(map(rms, 0, 5, 50, 150));
 translate(-60.0, 0, 0);
 box(map(rms, 0, 5, 50, 150));
pop();

push();
 stroke(255, 20.0);
 rotateY(rms);
 translate(0, 30.0, 0);
 box(map(rms, 0, 5, 50, 150));
 translate(0, -60.0, 0);
 box(map(rms, 0, 5, 50, 150));
pop();



box(map(rms, 0, 5, 50, 150));
`;

var example3d2 = `var rotX = 0, rotY = 0, rotZ = 0;`;
