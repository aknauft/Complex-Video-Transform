const scale = function (value, start1, stop1, start2, stop2) {
  return start2 + (value - start1) * ((stop2 - start2) / (stop1 - start1));
}

function coordToPixelIndex (coord) {
  // Yikes! What if coord.x > w? That won't have a pixel index...
  if(!(coord.x < w && coord.y < h)){
    return -1; // Really I want to throw a BadCoordinate error
  }
  return (coord.x + coord.y * w) * 4;
}

function coordToComplexNumber(coord){
  return {
    real: scale(coord.x, 0, w, realRange[0], realRange[1]),
    imaginary: scale(coord.y, 0, h, imagRange[1], imagRange[0])
  }
}
function complexNumberToCoord(complex){
  
  return {
    x: Math.floor(scale(complex.real,realRange[0], realRange[1], 0, w)), // consider clamping to [0, w]
    y: Math.floor(scale(complex.imaginary,imagRange[1], imagRange[0], 0, h))
  }
}

function drawOutputImage(targetContext, backgroundContext){
  let bgImageData = backgroundContext.getImageData(0,0, w,h);
  let bgPixels = bgImageData.data;
  
  let targetImageData = backgroundContext.getImageData(0,0, w,h);
  let targetPixels = targetImageData.data.fill(0);
//   targetImageData.data.forEach((e,i) => {targetImageData[i] = i%4==3? 255: 0});

  for (let x_ = 0; x_ < bgImageData.width; x_++) {
    for (let y_ = 0; y_ < bgImageData.height; y_++) {
      const i = coordToPixelIndex({x:x_, y:y_});
      const r = bgPixels[i];
      const g = bgPixels[i + 1];
      const b = bgPixels[i + 2];
      const a = bgPixels[i + 3];
      
      const i_ = coordToPixelIndex(complexNumberToCoord(FancyComplexMath(coordToComplexNumber({x:x_, y:y_}))));
      if(i_ < 0 || i_ > targetPixels.length) // No need to plot what we can't see. Just move on.
        continue;
      // If there is already a point mapped to i_, we should try to show both.
      targetPixels[i_ + 0] = targetPixels[i_ + 0] == 0? r : 0.5*(targetPixels[i_ + 0] + r);
      targetPixels[i_ + 1] = targetPixels[i_ + 1] == 0? g : 0.5*(targetPixels[i_ + 1] + g);
      targetPixels[i_ + 2] = targetPixels[i_ + 2] == 0? b : 0.5*(targetPixels[i_ + 2] + b);
      targetPixels[i_ + 3] = 255;
    }
  }
  
  targetContext.putImageData(targetImageData, 0,0);
  
  
}

navigator.mediaDevices.getUserMedia({
    video: true
  })
  .then(function (stream) {
    let rawVideo = document.createElement("video");
    rawVideo.srcObject = stream;
    let backgroundCanvas = document.createElement("canvas");
    backgroundCanvas.width = w;    backgroundCanvas.height = h;
    let backgroundContext = backgroundCanvas.getContext("2d");

    let videoIn = document.querySelector("#input-video");
    videoIn.width = w;    videoIn.height = h;
    let ctxIn = videoIn.getContext("2d");

    let videoOut = document.querySelector("#output-video");
    videoOut.width = w;    videoOut.height = h;
    let ctxOut = videoOut.getContext("2d");

  window.setInterval(function() {
      backgroundContext.drawImage(rawVideo, 0, 0, w, h);
      ctxIn.drawImage(rawVideo, 0,0, w,h);
//      ctxIn.font = '12px serif';ctxIn.fillStyle = "#fff";
//      ctxIn.fillText(imagRange[0], 0, h);
//      ctxIn.fillText(imagRange[1], 0, 12);
//      ctxIn.fillText(realRange[0], 12, h+12);
//      ctxIn.fillText(realRange[1], w, h+12);

      drawOutputImage(ctxOut, backgroundContext);
      });
  })
  .catch(function (err) {
    console.log("There's a problem, Boss!", err);
  });