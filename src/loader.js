const api = require('../build/FreightPacker').default;

window.FreightPacker = api;
console.log('FreightPacker:', FreightPacker.prototype);

const Loader = {
    OnDocumentReady: function(fn) {
        if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading'){
            fn();
        } 
        else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    },

    LoadScript: function(url, callback){
        var script = document.createElement('script');
        var ext = url.slice(url.lastIndexOf('.') + 1);
    
        if(ext !== 'js'){
            script.type = ext === 'glsl' ? 'x-shader' : 'text';
    
            var request = new XMLHttpRequest();
            request.responseType = 'text';
            request.open('GET', url, true);
            
            request.onload = function() {
                if (request.status >= 200 && request.status < 400) {
                    script.textContent = request.responseText;
                    callback(true);
                } else {
                    callback(false);
                    console.log('Get error', script.id);
                }
            };
            
            request.onerror = function() {
                console.log('Get error', script.id);
                callback(false);
            };
            
            request.send();
        }
        else {
            script.type = 'text/javascript';
    
            if (script.readyState){  //IE
                script.onreadystatechange = function(){
                    if (script.readyState == 'loaded' || script.readyState == 'complete'){
                        script.onreadystatechange = null;
                        callback(true);
                    }
                };
            } else { 
                script.onload = function(){
                    callback(true);
                };
            }

            script.onerror = function() {
                console.log('JS script loading error', script.id);
                callback(false);
            };
    
            script.src = url;
        }
        
        script.id = url.slice(url.lastIndexOf('/') + 1);
        document.getElementsByTagName('head')[0].appendChild(script);
        return script.id;
    },

    Load: function(scripts, callback){
        var numScriptsToLoad = scripts.length;
        var current = 0;
        var OnScriptLoaded = function(){
            if(current === numScriptsToLoad){
                console.log(scripts.length , ' scripts loaded...');
                callback();
            }
            else{
                Loader.LoadScript(scripts[current++], OnScriptLoaded);
            }
        }
        
        OnScriptLoaded();
    }

};

const scripts = [
    './mockup/ExampleUI.js',
    './Example.js'
];

Loader.Load(scripts, function(){
    new Example();
});