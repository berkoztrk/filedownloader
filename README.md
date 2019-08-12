# filedownloaderutility
File download utility for nodejs

## Installation
`
    npm i filedownloadutility
`

## Example Usage

`
    const fdu = require("filedownloadutility");
    fdu.download({
        url: "DOWNLOAD URL",                             // Download URL of the file
        fileName : "dummy.txt",                          // Output file name
        directory: "dummy/dummy_s",                      // Output directory
        onComplete: () => {console.log("finished")},     // Success function after file downloaded successfully
        onError: (error) => {console.error(error)}       // Error function if file download fails
    })
`