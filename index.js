const axios = require('axios').default;
var fs = require('fs');


let instance = null;

const DEFAULTS = {
    DEFAULT_FILE_NAME: "dummy.txt",
    DEFAULT_DIRECTORY: "."
}

class FileDownloader {
    constructor() {}
    static getInstance() {
        if (instance === null)
            instance = new FileDownloader();
        return instance;
    }

    _init(opts) {
        this._validate(opts);
        this.url = opts.url;
        this.fileName = opts.fileName || DEFAULTS.DEFAULT_FILE_NAME;
        this.outputDirectory = opts.outputDirectory || DEFAULTS.DEFAULT_DIRECTORY;
        this.onComplete = opts.onComplete;
        this.onError = opts.onError;
        this.axiosInstance = axios.create({
            responseType: "stream",
        });
    }

    _validate(opts) {
        if (!opts.url) {
            throw `url option is required.`;
        }
    }

    _getFileNameFromHeader(response) {
        try {
            return response.headers["content-disposition"].split("=")[1];
        } catch (error) {
            return null;
        }
    }

    _getFileNameFromURL() {
        try {
            const splittedURL = this.url.split("/");
            return splittedURL[splittedURL.length - 1];
        } catch (error) {
            return null;
        }
    }

    _getFileName(response) {
        if (this.fileName && this.fileName !== DEFAULTS.DEFAULT_FILE_NAME)
            return this._getCombinedOutputPath(this.fileName);
        let fileName = this._getFileNameFromHeader(response);
        if (!fileName) {
            fileName = this._getFileNameFromURL();
        }

        fileName = fileName || DEFAULTS.DEFAULT_FILE_NAME;


        return this._getCombinedOutputPath(fileName);
    }

    _getCombinedOutputPath(fileName) {
        if(!fs.existsSync(this.outputDirectory))
            throw `Directory does not exists`;
        let i = 0;
        let outPath = `${this.outputDirectory}/${fileName}`; 
        while(fs.existsSync(outPath)){
            const extIndex = outPath.lastIndexOf(".");
            const sub = outPath.substring(extIndex);
            outPath = outPath.replace(sub,i.toString() + sub);
        }
        
        return outPath;
    }


    async download(opts) {
        this._init(opts);
        return new Promise((resolve,reject) => {
            this.axiosInstance.get(this.url).then(response => {
                const fileName = this._getFileName(response);
                response.data.pipe(fs.createWriteStream(fileName));
                resolve(fileName)
            }).catch(err => {
                reject(err);
            });
        });
    }

}
module.exports = FileDownloader.getInstance();
