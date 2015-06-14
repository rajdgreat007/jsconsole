jsconsole = (function(){
    var pVars = {
        cache : {
            commandHistory : []
        },
        keyMappings : {
            ENTERKEY : 13,
            KEYUP : 38,
            KEYDOWN : 40
        },
        commandHistoryPointer : 0
    };
    var pFuncs = {
        addListener : function(elem,action,handler){
            if(elem.addEventListener){
                elem.addEventListener(action,handler,false);
            }else{
                elem.attachEvent('on'+action, function(){
                    return handler.call(elem,window.event);
                });
            }
        },
        createDomElem : function(elemString,elemAttrs,elemContent,parentElem){
            var elem = document.createElement(elemString);
            for(var key in elemAttrs){
                if(elemAttrs.hasOwnProperty(key)){
                    elem.setAttribute(key,elemAttrs[key])
                }
            }
            elem.innerHTML = elemContent;
            parentElem.appendChild(elem);
        },
        eventHandlers : {
            userInputBoxHandler : function(evt){
                if(evt.which == pVars.keyMappings.ENTERKEY && pVars.cache.userInputBox.value!==''){
                    var li = document.createElement('li');
                    var command = pVars.cache.userInputBox.value;
                    pFuncs.createDomElem('div',{'class':'command'},command,li);

                    var response = {};
                    try{
                        response.content = eval.call(window,command);
                        response.attr = {'class':'info'}
                    }catch(e){
                        response.content = e.message;
                        response.attr = {'class':'error'}
                    }
                    pFuncs.createDomElem('div',response.attr,response.content,li);
                    pVars.cache.outputBox.appendChild(li);
                    pVars.cache.commandHistory.push(command);
                    pVars.cache.userInputBox.value = '';
                    pVars.commandHistoryPointer = pVars.cache.commandHistory.length-1;
                    pVars.cache.outputBox.scrollTop = pVars.cache.outputBox.scrollHeight;
                }else if(evt.which == pVars.keyMappings.KEYUP){
                    if(pVars.commandHistoryPointer>=0 && pVars.commandHistoryPointer < pVars.cache.commandHistory.length){
                        if(pVars.commandHistoryPointer<pVars.cache.commandHistory.length-1) pVars.commandHistoryPointer++;
                        pVars.cache.userInputBox.value = pVars.cache.commandHistory[pVars.commandHistoryPointer];
                    }
                }else if(evt.which == pVars.keyMappings.KEYDOWN){
                    if(pVars.commandHistoryPointer>=0 && pVars.commandHistoryPointer < pVars.cache.commandHistory.length){
                        pVars.cache.userInputBox.value = pVars.cache.commandHistory[pVars.commandHistoryPointer];
                        if(pVars.commandHistoryPointer>0) pVars.commandHistoryPointer--;
                    }
                }

            }
        },
        bindEvents : function(){
            this.addListener(pVars.cache.userInputBox, 'keyup', this.eventHandlers.userInputBoxHandler)
        }
    };
    return {
        init : function(){
            if(!pVars.cache.userInputBox){
                pVars.cache.userInputBox = document.getElementById('userInput');
            }
            if(!pVars.cache.outputBox){
                pVars.cache.outputBox = document.getElementById('output');
            }
            pVars.cache.userInputBox.focus();
            pFuncs.bindEvents();
        }
    }
})();

window.onload=function(){
    jsconsole.init();
};