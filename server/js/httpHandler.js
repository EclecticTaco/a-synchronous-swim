const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const keypressHandler = require('./keypressHandler');
const messages = require('./messageQueue')
// keypressHandler.initialize(message => console.log(`Message received: ${message}`));


// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

var command = '';
keypressHandler.initialize(message => {
  command = message;
});

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.writeHead(200, headers);
  if (req.method === 'POST') {
    var body = []
    req.on('data', chunk => {
      body.push(chunk)
    })
    req.on('end', () => {
      body = Buffer.concat(body).toString()
      console.log(body)
      fs.writeFile('image.jpg', body, err => {
        if (err) {
          console.log(err)
        }
      })
      console.log('image saved')
      res.end(body)

    })
    console.log('POSTED')



  } else if (req.method === 'GET') {
    console.log('GET')

    res.end(messages.dequeue())
    // command = '';
  }
  // res.writeHead(200, headers);


  // res.end(command.toString())
  // command = '';
  next();
}
  // fs.readFile('command.txt', function(error, fileContents) {
  //   if (error) {
  //     console.log(error.toString());
  //   }

  //   res.end(fileContents.toString()))
  //   next();
  // })

