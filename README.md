# filedownloaderutility
File download utility for nodejs

## Installation
``
    npm i filedownloadutility
``

## Example Usage

```
    const fdu = require("filedownloadutility");

    (async() => {
        const result = await fdu.download({
            url: "DOWNLOAD URL",                             // Download URL of the file
            fileName : "dummy.txt",                          // Output file name
            outputDirectory: "dummy/dummy_s",                // Output directory
        });
        console.log(`File successfully downloaded to ${result}`)
    })();

```