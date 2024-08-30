
console.log("Hello World");
content = document.querySelector("#content");

console.log(content);
intake = document.querySelector("#intake");

let lines = [];
curr_line = 0

function setline(line, text){
  while (lines.length < line) lines.push('')
  lines[line] = text
  draw()
}
function draw(){
  content.innerHTML = ''
  lines.forEach((line, i) => {
    let p = document.createElement("p")
    p.innerHTML = line || '&nbsp;'
    content.appendChild(p)
    if (i == curr_line){
      p.classList.add('focus')
      p.textContent += '|'
    }
  })
  save()
}

function save(){
  localStorage['content'] = JSON.stringify(lines)
}
if (localStorage['content']){
  lines = JSON.parse(localStorage['content'])
  setline(0, lines[0])
}

function getline(){return lines[curr_line]||''}

commands = {
  enter: ()=>{
    indentlevel = (lines[curr_line] || '').match(/^\s*/)[0].length;
    if ((lines[curr_line] || '').trim().endsWith(':')) {
      indentlevel += 2;
    }
    curr_line+=1
    lines = lines.slice(0, curr_line).concat(['']).concat(lines.slice(curr_line))
    setline(curr_line, ' '.repeat(indentlevel))
  },
  clear: ()=>{
    if (getline()){setline(curr_line, '')}
    else {
      lines = lines.slice(0, curr_line).concat(lines.slice(curr_line+1))
      curr_line = Math.max(0, curr_line-1)
      draw()
    }
  },
  delete : ()=>setline(curr_line, lines[curr_line].slice(0,-1)),
  back: () =>{
    if (getline()){
      setline(curr_line, getline().split(' ').slice(0,-1).join(' '))
    }else{
      lines = lines.slice(0, curr_line).concat(lines.slice(curr_line+1))
      curr_line = Math.max(0, curr_line-1)
    }
    draw()
  },
  comment: ()=>{
    let newline = '# ' + getline()
    if (getline().trim().startsWith('#')){
      newline = getline().trim().slice(1)
      if (newline.startsWith(' ')) newline = newline.slice(1)
    }
    setline(curr_line, newline)
  },
  up: () => {
    curr_line = Math.max(0, curr_line-1)
    draw()
  },
  down: () => {
    curr_line = Math.min(lines.length-1, curr_line+1)
    draw()
  },
}

  specials = {'colon': ':','semicolon': ';','comma': ',','period': '.','bracket': '[','brace': '{','parenthesis': '(','debracket': ']',
  'debrace': '}','deparenthesis': ')','quote': '"','apostrophe': "'",'backslash': '\\','slash': '/','dash': '-','underscore': '_',
  'equals': '=','plus': '+','times': '*','divide': '/','percent': '%','exclamation': '!', 'hashtag': '#','dollar': '$','at': '@',
  
  'zero': '0','one': '1','two': '2','three': '3','four': '4','five': '5','six': '6','seven': '7','eight': '8','nine': '9',

  'space': ' ',
}

python = ['for', 'while', 'if', 'else', 'elif', 'def', 'class', 'return', 'import', 'from', 'as', 'in', 'is', 'not', 'and', 'or', 'True', 'False', 'None',
  'break', 'continue', 'pass', 'assert', 'try', 'except', 'finally', 'raise', 'with', 'yield', 'lambda', 'global', 'nonlocal', 'del']


function push(content){
  setline(curr_line, (lines[curr_line]||'') + (getline().trim()?' ':'') + content)
  console.log(lines)
}
function pushBuffer(){

  if (buffer in commands){
    commands[buffer]()
  }else if (buffer in specials){
    push(specials[buffer])
  }else if (buffer in python) push(buffer)
  else push(buffer)
  buffer = ''
}

buffer = '';

document.addEventListener("keydown", function(event){
  // console.log(event.code)

  if (event.code.startsWith("Key")){
    let char = event.code.slice(3).toLowerCase();
    buffer += char;
    intake.textContent = (intake.textContent + char).slice(-100);

  }else if (event.code == "Space"){
    pushBuffer()
    intake.textContent += ' ';
  }

})

