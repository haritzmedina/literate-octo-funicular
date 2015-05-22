/**
 * Created by Haritz on 5/12/2015.
 */

Visualization = function(){
    this.initialize();
};


Visualization.prototype.initialize = function(){
    // Create the canvas where the visualization will be
    this.createVisualizationCanvas();
    this.test();
};

Visualization.prototype.createVisualizationCanvas = function () {
    var canvas = document.getElementById("visualization");
    var context = canvas.getContext("2d");
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

};

Visualization.prototype.test = function(){

};

Visualization.prototype.start = function () {
    // Create the audio analyser
    var context = new AudioContext();
    var audio = document.getElementById('audio');
    var audioSrc = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    audioSrc.connect(analyser);
    analyser.connect(context.destination);
    var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    //
    var me = this;
    //
    function renderFrame() {
        window.requestAnimationFrame(renderFrame);
        // Stop if the song is stopped
        if (audio.paused == true) {

            return;
        }
        // Update data in frequencyData
        analyser.getByteFrequencyData(frequencyData);
        // Render frame based on values in frequencyData
        me.render(frequencyData);
    }
    audio.play();
    renderFrame();
};

Visualization.prototype.render = function(frequencyData){
    var canvas = document.getElementById("visualization");
    var context = canvas.getContext("2d");
    var imageData = context.getImageData(0, 0, window.innerWidth/2, window.innerHeight/2);
    var data = imageData.data;
    // Rows
    for(var i=0; i<window.innerHeight;i++){
        // Columns
        for(var j=0;j<window.innerWidth;j++){
            var pos = ((i*window.innerWidth)+j)*4;
            data[pos] = frequencyData[i];// Red
            data[pos+1] = frequencyData[i+100];// Green
            data[pos+2] = frequencyData[i+200];// Blue
            data[pos+3] = 255;// Alpha
        }
    }
    context.putImageData(imageData, 0, 0);
};