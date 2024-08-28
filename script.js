content = document.querySelector("#content");
intake = document.querySelector("#intake");

let lines = [];
curr_line = 0

indentlevel = 0

function setline(line, text){
  while (lines.length < line) lines.push('')
  lines[line] = text
  content.innerHTML = ''
  lines.forEach((line) => {
    let p = document.createElement("p")
    p.innerHTML = line || '&nbsp;'
    content.appendChild(p)
  })
}

commands = {
  'enter': ()=>{
    if((lines[curr_line]||'').trim().endsWith(':')){
      indentlevel+=1
    }
    curr_line+=1
  },
  'clear': ()=>setline(curr_line, ''),
  'delete' : ()=>setline(curr_line, lines[curr_line].slice(0,-1)),
  'back': () =>setline(curr_line, lines[curr_line].split(' ').slice(0,-1).join(' ')),
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
  setline(curr_line, (lines[curr_line]||'&nbsp;&nbsp;'.repeat(indentlevel)) + ' ' + content)
}
function pushBuffer(){

  if (buffer in commands){
    commands[buffer]()
  }else if (buffer in specials){
    push(specials[buffer])
  }else if (buffer in python){
    push(buffer)
  }else{
    push(buffer)
  }

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

