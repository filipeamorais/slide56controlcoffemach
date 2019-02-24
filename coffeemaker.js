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

client.on('message', (topic, message)=>{
    console.log((""+message).red)
    if (topic == 'controller'){
        if(message=='turn on')
            turnOnRequest()
        else if(message=='turn off')
            turnOffRequest()
    }
})

function turnOnRequest(){
    if (state=='on'||state=='starting up')return
    else{
        state='starting up'
        console.log(('Starting up').yellow)
        client.publish('coffeemaker/state', state)

        setTimeout(()=>{
            state = 'on'
            console.log(('ON').yellow);
            client.publish('coffeemaker/state', state)
        }, 3000)
    }
}

function turnOffRequest(){
    if (state=='off'||state=='shutting-down')return
    else{
        state='shutting-down'
        console.log(('Shutting Down').yellow);
        client.publish('coffeemaker/state',state)

        setTimeout(()=>{
            state = 'off'
            console.log(('OFF').yellow)
            client.publish('coffeemaker/state',state)
        },3000)
    }
}

//Check for exceptions
process.on('exit',handleAppExit.bind(null,{cleanup:true}))
process.on('SIGINT',handleAppExit.bind(null, {exit:true}))
process.on('uncaughtException', handleAppExit.bind(null,{exit:true}))

//Notify controller
function handleAppExit(options, err){
    if (err){console.log(err.stack)}
    if (options.cleanup)
        {client.publish('coffeemaker/connected','false')}
    if(options.exit){process.exit()}
}