// Play an audio file, and visualize it with a VU meter in a div with ID "vumeter". << I wrote this line myself (Nick)
// The audio file is played in a loop, and the VU meter is updated every time the
// audio buffer is updated.
//
// The audio file is played using the Web Audio API, and the VU meter is drawn
// using the HTML5 canvas element.
function playAudio(audioFile) {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var audioSrc = audioCtx.createMediaElementSource(audioFile);
    var analyser = audioCtx.createAnalyser();
    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);
    audioFile.play();
    var vumeter = document.getElementById("vumeter");
    var canvas = document.createElement("canvas");
    canvas.width = vumeter.offsetWidth;
    canvas.height = vumeter.offsetHeight;
    vumeter.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;
    function renderFrame() {
        requestAnimationFrame(renderFrame);
        x = 0;
        analyser.getByteFrequencyData(dataArray);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            ctx.fillStyle = "#FFF";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
    renderFrame();

    // Continuously update the VU meter. << I wrote this line myself (Nick)
    function updateVUMeter() {
        requestAnimationFrame(updateVUMeter);
        analyser.getByteFrequencyData(dataArray);
        var sum = 0;
        for (var i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        var average = sum / bufferLength;
        var vumeter = document.getElementById("vumeter");
        vumeter.style.height = average + "px";

        // Colorize the VU meter. << I wrote this line myself (Nick)
        if (average < 50) {
            vumeter.style.backgroundColor = "#00FF00";
        } else if (average < 100) {
            vumeter.style.backgroundColor = "#FFFF00";
        } else if (average < 150) {
            vumeter.style.backgroundColor = "#FFA500";
        } else if (average < 200) {
            vumeter.style.backgroundColor = "#FF0000";
        } else {
            vumeter.style.backgroundColor = "#800000";
        }
    }
    updateVUMeter();
}

// Import the audio file << I wrote this line myself (Nick)
var audioFile = new Audio("audio/audio.mp3");
// Play the audio file
playAudio(audioFile);

// Dark theme for the page << I wrote this line myself (Nick)
document.body.style.backgroundColor = "#000";
document.body.style.color = "#FFF";
document.body.style.fontFamily = "Arial";
document.body.style.fontSize = "16px";
document.body.style.fontWeight = "bold";
document.body.style.textAlign = "center";

// Add button to the bottom of the screen to toggle playing the audio file << I wrote this line myself (Nick)
var button = document.createElement("button");
button.innerHTML = "Play Audio";
button.style.position = "fixed";
button.style.bottom = "0";
button.style.left = "0";
button.style.width = "100%";
button.style.height = "50px";
button.style.backgroundColor = "#FFF";
button.style.color = "#000";
button.style.fontFamily = "Arial";
button.style.fontSize = "16px";
button.style.fontWeight = "bold";
button.style.textAlign = "center";
button.style.cursor = "pointer";
button.onclick = function() {
    if (audioFile.paused) {
        audioFile.play();
        button.innerHTML = "Pause Audio";
    } else {
        audioFile.pause();
        button.innerHTML = "Play Audio";
    }
}
document.body.appendChild(button);
