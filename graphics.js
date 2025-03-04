class wordDisplay{
  constructor(ranges) {
    this.length = ranges.length    
    this.sliders = []    
    
    for(let i = 0; i<ranges.length; i++){
      this.sliders.push({
        range: ranges[i].split("").sort(),
        value: 0,
        speed: 0
      })    
    }
  }
  set(target, x, y) {
    if(typeof(target) == "number"){
      target = String(target).padStart(this.length, "0")
    }
    target = target.padEnd(this.length, " ")
    
    for(let i = 0; i<this.length; i++){
      let stats = this.sliders[i]
      let targetValue = target[i]
      
      let targetId = stats.range.indexOf(targetValue)
      
      stats.speed += limit(-maxAccel, (targetId-stats.value)*speedMult, maxAccel)
      
      if(Math.abs(stats.speed)>0.01){
        stats.speed = limit(-maxSpeed, stats.speed, maxSpeed)
        stats.value += stats.speed
      
        stats.speed *= frictionMult
      }  
      
      display(stats.value, x+(i*fontWidth), y, stats.range, 50+Math.abs(stats.speed)*50, i)
    }
    //ctx.strokeRect(x, y-fontHeight, fontWidth*this.length, fontHeight)  
  }
}

function display(value, x, y, range, falloff, position) {
  let target = range[Math.round(value)]
  
  let offset = -value*fontHeight
  let targetFocus = Math.round(value)
  let focusOffset = 1-Math.abs(targetFocus-value)/0.5
  for(let i = 0; i<range.length; i++){
    let opacity = unfocusedOpacity-Math.abs(value-i)/falloff   
    if(range[i] == target){
      opacity += (1-opacity)*focusOffset
    }            
    
    if(opacity>0){
      let character = range[i]
      if(character == " "){character="-"}
      ctx.globalAlpha = opacity      
      ctx.fillText(character, x, y+offset+fontHeight*i)      
    } 
  }
  ctx.globalAlpha = 1  
}

function newStringRotator(text) {
  let ranges = []
  
  let words = text.split(" ")
  
  for(let word of words){
    for(let i = 0; i<word.length; i++){
      let chr = word[i]
      if(ranges[i] == undefined){ranges.push(" ")}
      if(!ranges[i].includes(chr)){ranges[i] += chr}
    }
  }
    
  return {
    counter: new wordDisplay(ranges), 
    words: words,
    set: function(index, x, y) {
      this.counter.set(this.words[index%this.words.length], x, y)
    }  
  }
}

function drawClock(x, y) {
  let curOff = 0
  
  let displayHour = hours%12
  if(displayHour == "0"){displayHour = "12"}
  hourCounter.set(displayHour, x+curOff, y)
  curOff += fontWidth*(2-0.3)
  ctx.fillText(":", x+curOff, y)
  curOff += fontWidth*(1-0.3)
  minCounter.set(minutes, x+curOff, y)
  curOff += fontWidth*(2-0.3)
  ctx.fillText(":", x+curOff, y)
  curOff += fontWidth*(1-0.3)
  secCounter.set(seconds, x+curOff, y)
  curOff += fontWidth*(2)
  
  if(frame == 0){
    console.log(Math.round((curOff/fontWidth)*1000)/1000, "clock")
  }
}
