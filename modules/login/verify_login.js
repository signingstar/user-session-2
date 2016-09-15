const fs = require('fs');
const path = require('path');

let pathString = './config/user_info.json';

const readFileAsync = function(path, cb) {
  fs.readFile(path, function(err, data) {
    if(err) {
      console.log(err);
      return;
    }

    cb(JSON.parse(data));
  });
}

const verifyUser = (userId, password, cb) => {
  let validUser = false;

  readFileAsync(pathString, function(data) {
    let exactData = data[userId];
    if(exactData) {
      if(exactData.id === userId && password === exactData.password) {
        validUser = true;
      }
    }
    cb(validUser);
  });

  return validUser;
}

export default verifyUser;
