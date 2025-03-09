let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
let screenScale = 2

let width = screen.width * screenScale
let height = screen.height * screenScale

let rect = ctx.measureText("0")
let fontWidth = rect.width
let fontHeight = rect.actualBoundingBoxAscent + rect.actualBoundingBoxDescent
  
let centerX = width/2
let centerY = height/2

let fontSize = 32//64
let maxSpeed = 0.3
let maxAccel = 0.1
let speedMult = 0.05
let frictionMult = 0.75//0.7//0.7
let unfocusedOpacity = 0.1//.3

let frame = 0

let daySecs = 0//23*3600 + 59*60 + 40
let timeDeviation = 0
let timePoints = 0

let seconds = 0
let secCounter = new wordDisplay(["012345", "0123456789"])
       
let minutes = 0
let minCounter = new wordDisplay(["012345", "0123456789"])

let hours = 0
let hourCounter = new wordDisplay(["01", "0123456789"])

let testDisplay = newStringRotator("Made by Laurence Ian M. Moreno Designed by Laur")

function updateTime(first = false) {
  let today = new Date()
  
  seconds = today.getSeconds() 
  minutes = today.getMinutes() 
  hours = today.getHours() 
 
  let realTime = (hours*3600 + minutes*60 + seconds)
  
  if(!first){
    timeDeviation += realTime - daySecs
    timePoints++
  }
  
  daySecs = realTime
  
  console.log("time updated!!", minutes+":"+seconds, Math.round(timeDeviation/timePoints*1000)/1000, `${timeDeviation}/${timePoints}`)
}

function resize(changeFont = false) {
  if(!changeFont){
    width = window.innerWidth * screenScale
    height = window.innerHeight * screenScale

    canvas.width = width
    canvas.height = height
  }
  
  ctx.font = `${fontSize*screenScale}px 'Space Mono'`
  if(changeFont){return}
  
  ctx.fillStyle = "#000"
  
  ctx.lineWidth = 2
  
  rect = ctx.measureText("0")
  fontWidth = rect.width
  fontHeight = rect.actualBoundingBoxAscent + rect.actualBoundingBoxDescent
  
  centerX = width/2
  centerY = height/2
}

screen.orientation.addEventListener("change", ()=>{resize()})

resize()
updateTime(true)

loop()
function loop() {  
  ctx.clearRect(0, 0, width, height)
  
  if(daySecs%15 == 0 && frame%60 == 0){updateTime(frame==0)}
  
  seconds = Math.floor(daySecs%60)
  minutes = Math.floor(daySecs/60)%60
  hours = Math.floor((daySecs/60)/60)%24
  
  drawClock(centerX-(6.8*fontWidth)/2, (height/2)+fontHeight/2)
  
  //testDisplay.set(Math.floor(frame/30), 10, 100)
  
  frame++
  if(frame%60==0){daySecs++}
  window.requestAnimationFrame(loop)
}
function limit(min, value, max) {
  return Math.min(Math.max(value, min), max)
}
