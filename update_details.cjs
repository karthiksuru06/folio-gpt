const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
        results = results.concat(walk(file));
      }
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.json') || file.endsWith('.txt')) {
        results.push(file);
      }
    }
  });
  return results;
}

let files = [];
if (fs.existsSync('src')) files = files.concat(walk('src'));
if (fs.existsSync('api')) files = files.concat(walk('api'));
files.push('index.html', 'chatbot-prompt.txt');

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace Email
  content = content.replace(/hola@foliogpt\.com/g, 'karthik939075@gmail.com');
  content = content.replace(/karthik@example\.com/g, 'karthik939075@gmail.com');
  
  // Replace GitHub
  content = content.replace(/github\.com\/foliogpt/g, 'github.com/karthiksuru06');
  content = content.replace(/github\.com\/karthik(?!suru06)/g, 'github.com/karthiksuru06');
  
  // Replace LinkedIn
  content = content.replace(/linkedin\.com\/in\/foliogpt/g, 'linkedin.com/in/suru-karthik-923766321');
  content = content.replace(/linkedin\.com\/in\/karthik(?!suru06|-)/g, 'linkedin.com/in/suru-karthik-923766321');
  
  // Replace name variations if any remain? No, the user just asked for these three links.
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated details in', file);
  }
});
