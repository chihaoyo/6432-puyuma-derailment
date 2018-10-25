const fs = require('fs')
let lines = fs.readFileSync('record.txt', 'utf8').split('\n').filter(line => !!line)

const bracketL = '（'
const bracketR = '）'
const locationConnector = '-'
const locationKeyword = '地點'
const statusKeyword = '車況'
const noteKeyword = '註'
const colon = '：'
const driver = '司機員'
const coordinator = '調度員'
const inspector = '檢查員'

let currentTime
let currentLocation

let entries = lines.map(line => {
  let person
  let content = line.replace(bracketL, '').replace(bracketR, '')
  if(content.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)) {
    currentTime = content
    return
  } else if(content.indexOf(locationKeyword) > -1) {
    let [trash, locationString] = content.split(colon)
    let [from, to] = locationString.split(locationConnector)
    currentLocation = to ? { type: 'between', from, to } : { type: 'around', at: from }
    return
  } else if(content.indexOf(statusKeyword) === 0) {
    let [trash, status] = content.split(colon)
    person = 'system'
    content = status
  } else if(content.indexOf(colon) > -1) {
    [person, content] = content.split(colon)
    if(person === noteKeyword) {
      person = 'system'
    }
  }
  return {
    time: currentTime,
    location: currentLocation,
    person,
    content
  }
}).filter(entry => !!entry)

fs.writeFileSync('record.json', JSON.stringify(entries, null, 2))
fs.writeFileSync('record.js', 'let record = ' + JSON.stringify(entries, null, 2))
