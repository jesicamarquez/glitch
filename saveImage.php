<?php

// make sure the image-data exists and is not empty
// php is particularly sensitive to empty image-data 
if ( isset($_POST["image"]) && !empty($_POST["image"]) ) {    

    // get the dataURL
    $dataURL = $_POST["image"];
    $dataName = $_POST["name"];   

    // the dataURL has a prefix (mimetype+datatype) 
    // that we don't want, so strip that prefix off
    $parts = explode(',', $dataURL);  
    $data = $parts[1];  

    // Decode base64 data, resulting in an image
    $data = base64_decode($data);  

    // create a temporary unique file name
    $file =  $dataName . '.png';

    // write the file to the upload directory
    $success = file_put_contents($file, $data);

    // return the temp file name (success)
    print $success ? $file : 'Unable to save this image.';

}