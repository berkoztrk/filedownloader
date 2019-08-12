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
        return `${this.outputDirectory}/${fileName}`
    }


    async download(opts) {
        this._init(opts);
        this.axiosInstance.get(this.url).then(response => {
            const fileName = this._getFileName(response);
            response.data.pipe(fs.createWriteStream(fileName))
        });
    }

}
module.exports = FileDownloader.getInstance();