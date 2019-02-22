var colors = require ('colors')
const mqtt = require ('mqtt')
const client = mqtt.client('mqtt://127.0.0.1')

var state = 'off'
console.log(state.yellow)

client.on('connect', ()=>{
    console.log('Coffee Maker connected'.green)
    client.subscribe('controller')
    client.publish('coffeemaker/connected', 'true')
    client.publish('coffeemaker/state', state)
})