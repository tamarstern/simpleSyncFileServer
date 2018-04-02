
process.env.NODE_ENV = 'test';
const chai = require('chai');
const fs = require('fs');
const chaiHttp = require('chai-http');
const server = require('../server.js');
const should = chai.should();
const path = require('path');
const sep = path.sep;
const uuidv1 = require('uuid/v1');
const { URL, URLSearchParams } = require('url');
var testDirFullPath;
chai.use(chaiHttp);

describe('File Server', () => {
    before((done) => {
        var testDirName = uuidv1();
        testDirFullPath = __dirname + sep + testDirName;
        fs.mkdir(testDirFullPath, (err) => {
            if (err) {
                console.info('test dir not cretaed ' + err);
                done();
            } else {
                console.info('test dir cretaed ');
                done();
            }
        });
    });
    describe('/POST new file', () => {
        it('it should POST a file', (done) => {
            let filename = 'testCreate.txt';
            let contentToWrite = 'hello world';
            let myUrl = '/api/files';
            let queryParams = {
                dirPath : testDirFullPath,
                filename : filename,
                fileContent : contentToWrite
            }
            chai.request(server)
                .post(myUrl)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(queryParams)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

    });

    describe('/GET/:path file', () => {
        it('it should GET a file by the given path', (done) => {
            let filename = 'testCreateWithGet.txt';
            let contentToWrite = 'hello world';
            const myUrl = '/api/files';
            let queryParams = {
                dirPath : testDirFullPath,
                filename : filename,
                fileContent : contentToWrite
            }
            chai.request(server)
                .post(myUrl)
                .set('content-type', 'application/x-www-form-urlencoded')
                .send(queryParams)
                .end((err, res) => {
                    var queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
                    chai.request(server)
                        .get(myUrl + '?' + queryString)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('fileContent').eql(contentToWrite);
                            done();
                        });
                });

        });
    });
});

describe('/GET/:path list files', () => {
    it('it should get list of files by path', (done) => {
        let queryParams = {
            dirPath : testDirFullPath
        }
        var queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
        chai.request(server)
            .get('/api/listFiles' + '?' +  queryString)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('data');
                res.body.data.should.be.a('array');
                res.body.data.length.should.be.eql(2);
                done();
            });
    });
});

describe('/DELETE/:path file', () => {
    it('it should DELETE a file given the id', (done) => {
        var filename = 'testCreateWithGet.txt';
        var deleteFilePath = testDirFullPath + path.sep + filename;
        let queryParams = {
            filePath : deleteFilePath
        }
        var queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
        chai.request(server)
            .delete('/api/deleteFile/' + '?' + queryString)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                let queryParams = {
                    dirPath : testDirFullPath
                }
                var queryString = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');                
                chai.request(server)
                    .get('/api/listFiles' + '?' + queryString)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('data');
                        res.body.data.should.be.a('array');
                        res.body.data.length.should.be.eql(1);
                        done();
                    });
            });
    });
});

