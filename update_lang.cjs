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
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.json')) {
        results.push(file);
      }
    }
  });
  return results;
}
const files = walk('src');
files.push('index.html', 'vercel.json');
files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/getEsSlugs\(\)\.has\(location\.pathname\) \? 'es' : 'en'/g, "'en'");
  content = content.replace(/location\.pathname\.startsWith\('\/en'\) \? 'en' : 'es'/g, "'en'");
  content = content.replace(/lang: 'es'/g, "lang: 'en'");
  content = content.replace(/lang=\"es\"/g, "lang=\"en\"");
  content = content.replace(/lang === 'en' \? '\/en' : '\/'/g, "'/'");
  content = content.replace(/lang === 'en' \? '\/business-os-for-airtable' : '\/business-os-para-airtable'/g, "'/business-os-for-airtable'");
  content = content.replace(/lang === 'en' \? '\/ai-agent-jacobo' : '\/agente-ia-jacobo'/g, "'/ai-agent-jacobo'");
  content = content.replace(/lang === 'en' \? '\/programmatic-seo' : '\/seo-programatico'/g, "'/programmatic-seo'");
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
