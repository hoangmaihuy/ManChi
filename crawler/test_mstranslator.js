'use strict'

const MsTranslator = require('mstranslator');
const fs = require('fs');

fs.readFile('./config.json', (err, data) => {
  if (err) throw err;
  var config = JSON.parse(data);
  var client = new MsTranslator({
    client_id: config.translatorId,
    client_secret: config.translatorSecret
  }, true);

  var paramsTranslate = {
    text: '你好',
    from: 'zh-CHS',
    to: 'en'
  }
  client.translate(paramsTranslate, (err, data) => {
    if (err) throw err;
    console.log(data);
  })

  var paramsSpeak = {
    text: '你好',
    language: 'zh-CHS',
    format: 'audio/mp3',
    options: 'MaxQuality'
  }
  client.speak(paramsSpeak, (err, data) => {
    if (err) throw err;
    console.log(data);
    var filePath = "./audio.mp3";
    fs.writeFile(filePath, data, (err) => {
      if (err) throw err;
      console.log('Check out new audio');
    })
  })

})
