const fs = require('fs');
const path = require('path');

// var pathString = path.join(__dirname, './config', 'user_info.json');
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


const updateUserList = ({userid, userName, password, telephone}, callback) => {
  let userExists = false;

  readFileAsync(pathString, (data) => {
    if(data[userid]) {
      callback(false);
    }

    data[userid] = {
      id: userid,
      password: password,
      phone: telephone,
      fullName: userName
    }

    fs.writeFile(pathString, JSON.stringify(data, null, 2), () => {
      callback(true);
    });
  });
}

export default updateUserList;
