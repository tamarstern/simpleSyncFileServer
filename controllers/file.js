const fs = require('fs');

const mkdirp = require('mkdirp');

const path = require('path');

const sep = path.sep;

exports.uploadFile = function (req, res) {

  let dirPath = req.body.dirPath;
  let filename = req.body.filename;
  let fileContent = req.body.fileContent;

  mkdirp(dirPath, (err) => {
    if (err) {
      return res.send(err);
    } else {
      let fullFilePath = dirPath + sep + filename;
      try {
        fs.writeFileSync(fullFilePath, fileContent, 'utf8');
        return res.json({ message: 'file saved' });
      } catch (err) {
        return res.json({ message: 'error on file save', error: err });
      }
    }
  });
};

exports.getFile = function (req, res) {
  let dirPath = req.query.dirPath;
  let filename = req.query.filename;
  let fullPath = dirPath + sep + filename;
  try {
    let contents = fs.readFileSync(fullPath, 'utf8');
    return res.json({ fileContent: contents });
  } catch (err) {
    return res.json({ message: 'error on file get content', error: err });
  }
};

var walkSync = function (dir, filelist) {
  var files = fs.readdirSync(dir);
  files.forEach((file) => {
    var newFile = dir + sep + file;
    filelist.push(newFile);
    if (fs.statSync(newFile).isDirectory()) {
      filelist = walkSync(newFile + sep, filelist);
    }
  });
};


exports.listFiles = function (req, res) {
  let dirPath = req.query.dirPath;
  let filesLst = [];
  walkSync(dirPath, filesLst);
  return res.json({ message: 'return file lst', data: filesLst })
};

exports.deleteFile = function (req, res) {
  let filePath = req.query.filePath;
  if (fs.statSync(filePath).isDirectory()) {
    let files = fs.readdirSync(filePath);
    if (files.length > 0) {
      let msg = "unable to delete " + dirPath + " folder not empty";
      res.status(500);
      return res.json({ 'message': msg });
    }
  }
  try {
    fs.unlinkSync(filePath);
    return res.json({ message: 'return file lst', data: fileslLst });
  } catch (err) {
    return res.json({ message: 'error on file delete', error: err });
  }
};