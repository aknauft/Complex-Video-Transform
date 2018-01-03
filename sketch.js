const scale = function (value, start1, stop1, start2, stop2) {
  return start2 + (value - start1) * ((stop2 - start2) / (stop1 - start1));
}

function coordToPixelIndex (coord) {
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
    x: Math.min(w, Math.max(0, Math.floor(scale(complex.real,realRange[0], realRange[1], 0, w)))),
    y: Math.min(h, Math.max(0, Math.floor(scale(complex.imaginary,imagRange[1], imagRange[0], 0, h))))
  }
}

function drawOutputImage(targetContext, backgroundContext){
  let bgImageData = backgroundContext.getImageData(0,0, w,h);
  let bgPixels = bgImageData.data;
  
  let targetImageData = backgroundContext.getImageData(0,0, w,h);
  let targetPixels = targetImageData.data.fill(0);

  for (let x_ = 0; x_ < bgImageData.width; x_++) {
    for (let y_ = 0; y_ < bgImageData.height; y_++) {
      const i = coordToPixelIndex({x:x_, y:y_});
      const r = bgPixels[i];
      const g = bgPixels[i + 1];
      const b = bgPixels[i + 2];
      const a = bgPixels[i + 3];
      
      
      const i_ = coordToPixelIndex(complexNumberToCoord(FancyComplexMath(coordToComplexNumber({x:x_, y:y_}))));
      targetPixels[i_ + 0] = r;
      targetPixels[i_ + 1] = g;
      targetPixels[i_ + 2] = b;
      targetPixels[i_ + 3] += a;
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

      drawOutputImage(ctxOut, backgroundContext);
      });
  })
  .catch(function (err) {
    console.log("There's a problem, Boss!", err);
  });