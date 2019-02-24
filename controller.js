var colors = require ('colors')
const mqtt = require ('mqtt')
const client = mqtt.connect('mqtt://127.0.0.1')

var state = '' //state of the coffe maker not known
var connected = false //Coffee maker is assumed not to be connected

client.on('connect', ()=>{
    console.log('Controller connected'.green)
    client.subscribe('coffeemaker/connected')
    client.subscribe('coffeemaker/state')
})

client.on('message', (topic, message)=>{
    if (topic=='coffeemaker/connected'){
        if(message=='true'){
        connected=true
        console.log("Controller Connected")}
        else connected=false
    }
    else if(topic=='coffeemaker/state'){
        state=message
    }else
        console.log('No message handler for that' + topic)
})

function turnOnCoffeemaker(){
    if (connected && state!='on'){
        client.publish('controller','turn on')
    }
}

function turnOffCoffeemaker(){
    if (connected && state!=='off')
    client.publish('controller', 'turn off')
}

setTimeout(()=>{
    console.log('sending request to turn on coffeemaker')
    turnOnCoffeemaker
}, 2000)

setTimeout(()=>{
    console.log('sending request to turn off coffeemaker')
    turnOffCoffeemaker
}, 4000)

process.on('exit',()=>console.log('Bye'))

//setTimeout(()=>process.exit(), 6000)


