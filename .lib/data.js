/*
* library for storing and editing data
*
*/

// dependencies
const fs = require('fs');
const path = require('path');

// constainer for file to be exported
const lib = {};

// base directory for the library
lib.baseDir = path.join(__dirname, '../.data');

// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for editing
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    console.log(fileDescriptor, err, 'from create library');
    if(!err && fileDescriptor){
      // convert data to a string
      const stringData = JSON.stringify(data)

      // write to file and close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if(!err){
          fs.close(fileDescriptor, (err) => {
            if(!err) {
              callback(false);
            } else {
              callback('Error closing file')
            } 
          })
        }else{
          callback('Error writing to new file');
        }
      })
    }else {
      callback('Error: could not create new file, It may already exist.')
    }
  })
}


// read file contents
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, 'utf8', (err, data) => {
    if(!err && data){
      callback(null, data);
    }else {
      callback('Error reading existing file', data);
    }
  })
}


// update fle content 
lib.update = (dir, file, data, callback) => {
  // open the file
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if(!err && fileDescriptor){
       // convert data to a string
       const stringData = JSON.stringify(data)
      console.log(fileDescriptor, 'from updated library')
      //  truncate the file before writing to it
      fs.ftruncate(fileDescriptor, (err) => {
        if(!err) {
          // write to the file and close it
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if(!err){
              fs.close(fileDescriptor, err => {
                if(!err) {
                  callback(false)
                }else {
                  callback('Error: closing existing file')
                }
                })
            }else {
              callback('Error: could not write to existing file');
            }
          })
        }else{
          callback('Error: Could not truncate')
        }
      })

    }else{
      callback('Error: could not create new file, It may already exist.')
    }
  })
}


// delete file
lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, err => {
    if(!err){
      callback('file deleted successfully')
    }else{
      callback('Error: could not delete file')
    }
  })
}

module.exports = lib

