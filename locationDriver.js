var currentSet = 'Any';

var gridImageNameToImage = Object();
var gridSize = 37.5;
var gridImageToShow = null;
var gridLastImageShown = null;
var gridShow = null;

function setSet(name){
    currentSet = name; 
    canvasAtGridXY(gridShow[1],gridShow[0]);
    renderGrid();
}

/* call this with imageToShow set and it'll show the image */
function renderGrid(){
    for(var i=0;i<gridHandSets.length; i++){
        var el = document.getElementById("datasetButton"+gridHandSets[i]);
        el.style.backgroundColor = (currentSet == gridHandSets[i]) ? colorActive : colorInactive;
    } 

    // renders the canvas
    if(gridImageToShow === null){ return; } //don't show if we have nothing to show
    if(gridImageToShow == gridLastImageShown){ return; } // don't show if nothing's changed
    if(!gridImageNameToImage.hasOwnProperty(gridImageToShow)){ return; } // don't show if we don't haven an image
    if(!gridImageNameToImage[gridImageToShow].complete){ return; }  // don't show if it hasn't loaded

    img = gridImageNameToImage[gridImageToShow];

    var can = document.getElementById('visualizer');
    var ctx = can.getContext('2d');

    ctx.beginPath();
    ctx.clearRect(0,0,can.width,can.height);
    ctx.drawImage(img,0,0,can.width,can.height);
    ctx.globalAlpha = 0.5; 
    ctx.fillStyle = "red"; ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc((gridShow[1]+0.5)*gridSize,(gridShow[0]+0.5)*gridSize,gridSize/4,0,Math.PI*2,true); //, true);
    ctx.closePath();
    ctx.fill(); ctx.stroke(); 
    ctx.globalAlpha = 1;

    gridLastImageShown = gridImageToShow;
}


function canvasAtGridXY(gridX,gridY){
    if(gridBinShow[currentSet][gridY][gridX] != 'None'){
        /* then try to load the image, set it to be the thing to render, and then set an onload call */
        var img = new Image;
        var imgSrc = "https://epicwidget.s3.amazonaws.com/images/"+gridBinShow[currentSet][gridY][gridX];
        img.src = imgSrc;
        gridImageNameToImage[imgSrc] = img;
        gridImageToShow = imgSrc;
        gridShow = new Array(); gridShow.push(gridY); gridShow.push(gridX);
        img.onload = renderGrid;
    }
}


function canvasMouseMove(e){
    var can = document.getElementById('visualizer');
    var rect = this.getBoundingClientRect();
    var x = e.clientX - rect.left; var y = e.clientY - rect.top;

    if((x >= can.width) || (y >= can.height)){ return; } 

    var gridX = Math.floor(x/gridSize); 
    var gridY = Math.floor(y/gridSize);
    canvasAtGridXY(gridX,gridY);

    renderGrid();
}

function setupHandMove(){
    document.getElementById('visualizer').onmousemove = canvasMouseMove;
    var s = "";
    for(var i=0;i<gridHandSets.length;i++){
        s += "<span style='margin:1px;padding:1px;background-color:#ddd;border:3px solid black;display:inline;'";
        s += " id='datasetButton"+gridHandSets[i]+"'";
        s += " onClick=\"setSet('"+gridHandSets[i]+"');\""; 
        s += ">"+gridHandSetNames[i]+"</span> &nbsp; ";
        if((i != 0) && (i % 5 == 0)){ s += "<br/><br/> "; }
    }
    document.getElementById("dselectors").innerHTML = s;
    canvasAtGridXY(0,0);
    renderGrid();
}

