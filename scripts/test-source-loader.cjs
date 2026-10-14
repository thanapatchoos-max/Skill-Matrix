const fs=require('node:fs');
const path=require('node:path');
const ts=require('typescript');
const cache=new Map();
function load(filename) {
  filename=path.resolve(filename);
  if(cache.has(filename))return cache.get(filename).exports;
  const module={exports:{}};cache.set(filename,module);
  const source=fs.readFileSync(filename,'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2023,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  const localRequire=name=>{
    if(!name.startsWith('.'))return require(name);
    if(name.endsWith('.ttf?inline')){
      const asset=path.resolve(path.dirname(filename),name.slice(0,-'?inline'.length));
      return `data:font/ttf;base64,${fs.readFileSync(asset).toString('base64')}`;
    }
    const base=path.resolve(path.dirname(filename),name);
    const candidate=[base+'.ts',base+'.tsx',base].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
    if(!candidate)throw new Error(`Test import not found: ${name}`);
    return load(candidate);
  };
  new Function('require','exports','module',compiled)(localRequire,module.exports,module);
  return module.exports;
}
module.exports={load};
