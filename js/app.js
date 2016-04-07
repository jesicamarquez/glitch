$(document).foundation()

$(function() { 

  /**************
  /*Set-up Video
  /*************/

  window.addEventListener("DOMContentLoaded", function() {
    // Grab elements, create settings, etc.
    var canvas = document.getElementById("c"),
    context = canvas.getContext("2d"),
    video = document.getElementById("video"),
    videoObj = { "video": true },
    errBack = function(error) {
        console.log("Video capture error: ", error.code); 
    };

    // Put video listeners into place
    if(navigator.getUserMedia) { // Standard
      navigator.getUserMedia(videoObj, function(stream) {
        video.src = stream;
        video.play();
      }, errBack);
    } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
      navigator.webkitGetUserMedia(videoObj, function(stream){
        video.src = window.URL.createObjectURL(stream);
        video.play();
      }, errBack);
    }

    /**************
    /*Grab Photos
    /*************/
    document.getElementById("snap").addEventListener("click", function() {
      
      takePicture('1');
      setTimeout(function() {
          takePicture('2');
      }, 1000);
      setTimeout(function() {
          takePicture('3');
      }, 2000);
    });

    function takePicture(name) {
      var imageName = "assets/temp/" + name;
      context.drawImage(video, 0, 0);
      var canvasData = canvas.toDataURL();

      $.ajax({
        type: "POST",
        url: "saveImage.php",
        data: {image: canvasData, name: imageName}
      }).done(function( respond ) {
        console.log(respond);
        if (name == '3') {
          editImage();
        }
      });
    }

    /*****************
    /*Manipulate Photo
    /****************/
    function editImage() {
      var canvasEdit = new fabric.Canvas('canvas');
      canvasEdit.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      canvasEdit.setHeight(480);
      canvasEdit.setWidth(640);

      var purple = new fabric.Image.filters.Tint({
        color: '#58316b',
        opacity: '0.4'
      });

      var pink = new fabric.Image.filters.Tint({
        color: '#f06673',
        opacity: '0.5'
      });

      var green = new fabric.Image.filters.Tint({
        color: '#5d9a8e',
        opacity: '0.4'
      });   

      var blue = new fabric.Image.filters.Tint({
        color: '#02587c',
        opacity: '0.4'
      });     

      var transparency = new fabric.Image.filters.RemoveWhite({
          threshold: '25',
          distance: '100'
      });

      var grayScale = new fabric.Image.filters.Grayscale();
      fabric.Image.fromURL('assets/temp/1.png', function(purpleImg) {

        purpleImg.filters.push(grayScale);
        purpleImg.filters.push(transparency);
        purpleImg.filters.push(pink);
        purpleImg.set({ opacity: 0.7 });
        purpleImg.applyFilters(canvasEdit.renderAll.bind(canvasEdit));

        canvasEdit.add(purpleImg);

      },{crossOrigin: ''});

      fabric.Image.fromURL('assets/temp/2.png', function(greenImg) {

        greenImg.filters.push(grayScale);
        greenImg.set({left: 105, angle: 10});
        greenImg.filters.push(transparency);
          greenImg.filters.push(green);
          greenImg.set({ opacity: 0.4 });
          greenImg.applyFilters(canvasEdit.renderAll.bind(canvasEdit));

          canvasEdit.add(greenImg);

      },{crossOrigin: ''});

      fabric.Image.fromURL('assets/temp/3.png', function(blueImg) {

        blueImg.filters.push(grayScale);
        blueImg.set({left: 165, angle: 25});
        blueImg.filters.push(transparency);
        blueImg.filters.push(blue);
        blueImg.set({ opacity: 0.55 });
        blueImg.applyFilters(canvasEdit.renderAll.bind(canvasEdit));

        canvasEdit.add(blueImg);

      },{crossOrigin: ''});

      canvasEdit.renderAll();

      var currentdate = new Date();
      var uniqueName = "assets/img/" + currentdate.getHours() + currentdate.getMinutes() + currentdate.getSeconds();
      setTimeout(function() {
          saveImage(uniqueName);
      }, 500);

      function saveImage(uniqueName) {
    
        var canvasData = canvasEdit.toDataURL();

        $.ajax({
          type: "POST",
          url: "saveImage.php",
          data: {image: canvasData, name: uniqueName}
        }).done(function( respond ) {
          console.log(respond);
        });
      }
    }
  }, false);
}); 

  /**************
  /*Functions
  /*************/

function launchFullScreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}