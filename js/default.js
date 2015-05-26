/**
 * Created by Haritz on 5/12/2015.
 */

Analyzer = function(){};
Analyzer.prototype.initialize = function(audio, visualization){
    this.visualization = visualization;
    // Create the analyzer context
    this.createAnalyzer(audio);
    // Testing purposes
    this.test();
};

Analyzer.prototype.updateVisualization = function(visualization){
    this.visualization = visualization;
};

Analyzer.prototype.test = function(){

};

Analyzer.prototype.createAnalyzer = function(audio){
    // Create the audio analyser
    var context = new AudioContext();
    var audioSrc = context.createMediaElementSource(audio);
    var analyzer = context.createAnalyser();
    audioSrc.connect(analyzer);
    analyzer.connect(context.destination);
    //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
    var frequencyData = new Float32Array(analyzer.frequencyBinCount);
    var me = this;
    function renderFrame() {
        window.requestAnimationFrame(renderFrame);
        // Stop if the song is stopped
        if (audio.paused == true) {
            return;
        }
        // Update data in frequencyData
        analyzer.getFloatFrequencyData(frequencyData);
        console.log(frequencyData);
        // Render frame based on values in frequencyData
        me.visualization.render(frequencyData);
    }
    renderFrame();
};

Visualization = function(){};
Visualization.prototype.initialize = function(){
    // Create the canvas where the visualization will be
    this.createVisualizationCanvas();
    // Testing purposes
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


Visualization.prototype.clear = function(){
    var canvas = document.getElementById("visualization");
    var context = canvas.getContext("2d");
    context.clearRect ( 0 , 0 , canvas.width, canvas.height);
};

Visualization.prototype.play = function(){
    var audio = document.getElementById('audio');
    audio.play();
};

Visualization.prototype.render = function(frequencyData){
    var canvas = document.getElementById("visualization");
    var context = canvas.getContext("2d");
    // Clear previous draw
    this.clear();
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    // Columns
    for(var i=0; i<canvas.width;i++){
        var val = (frequencyData[i]+100)*4;
        var j;
        // First 30% rows blue
        for(j=0;j<val*0.3;j++){
            var pos = ((canvas.height-j)*canvas.width+i)*4;
            data[pos] = 100;// Red
            data[pos+1] = 100;// Green
            data[pos+2] = 200;// Blue
            data[pos+3] = 255;// Alpha
        }
        for(j;j<val*0.6;j++){
            var pos = ((canvas.height-j)*canvas.width+i)*4;
            data[pos] = 175;// Red
            data[pos+1] = 100;// Green
            data[pos+2] = 150;// Blue
            data[pos+3] = 255;// Alpha
        }
        for(j;j<val;j++){
            var pos = ((canvas.height-j)*canvas.width+i)*4;
            data[pos] = 255;// Red
            data[pos+1] = 100;// Green
            data[pos+2] = 100;// Blue
            data[pos+3] = 255;// Alpha
        }
    }
    context.putImageData(imageData, 0, 0);
};

var MusicVisualization = MusicVisualization || {
        analyzer : new Analyzer(),
        visualization : new Visualization(),
        initialize : function(){
            var audio = document.getElementById('audio');
            this.visualization.initialize();
            this.analyzer.initialize(audio, this.visualization);

        },
        play : function(){
            var audio = document.getElementById('audio');
            audio.load();
            audio.play();
        },
        pause : function(){
            var audio = document.getElementById('audio');
            audio.pause();
        },
        nextVisualization : function(){

        },
        previousVisualization : function(){

        }
    };

MusicVisualization.initialize();