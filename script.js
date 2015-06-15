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
        },
        bindAutoSuggest : function(){
            function AutoSuggestControl(oTextbox, oProvider) {
                this.provider = oProvider;
                this.textbox = oTextbox;
                this.init();
            }
            AutoSuggestControl.prototype.selectRange = function (iStart, iLength) {
                if (this.textbox.createTextRange) {
                    var oRange = this.textbox.createTextRange();
                    oRange.moveStart("character", iStart);
                    oRange.moveEnd("character", iLength - this.textbox.value.length);
                    oRange.select();
                } else if (this.textbox.setSelectionRange) {
                    this.textbox.setSelectionRange(iStart, iLength);
                }

                this.textbox.focus();
            };
            AutoSuggestControl.prototype.typeAhead = function (sSuggestion) {
                if (this.textbox.createTextRange || this.textbox.setSelectionRange) {
                    var iLen = this.textbox.value.length;
                    this.textbox.value = sSuggestion;
                    this.selectRange(iLen, sSuggestion.length);
                }
            };
            AutoSuggestControl.prototype.autosuggest = function (aSuggestions) {

                if (aSuggestions.length > 0) {
                    this.typeAhead(aSuggestions[0]);
                }
            };
            AutoSuggestControl.prototype.handleKeyUp = function (oEvent) {
                var iKeyCode = oEvent.keyCode;

                if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode <= 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {
                    //ignore
                } else {
                    this.provider.requestSuggestions(this);
                }
            };
            AutoSuggestControl.prototype.init = function () {
                var oThis = this;
                this.textbox.onkeyup = function (oEvent) {
                    if (!oEvent) {
                        oEvent = window.event;
                    }
                    oThis.handleKeyUp(oEvent);
                };
            };
            function Suggestions() {
                this.suggestions = [];
                for(var i in window){
                    this.suggestions.push(i);
                }
            }
            Suggestions.prototype.requestSuggestions = function (oAutoSuggestControl) {
                var aSuggestions = [];
                var sTextboxValue = oAutoSuggestControl.textbox.value;

                if (sTextboxValue.length > 0){
                    for (var i=0; i < this.suggestions.length; i++) {
                        if (this.suggestions[i].indexOf(sTextboxValue) == 0) {
                            aSuggestions.push(this.suggestions[i]);
                        }
                    }
                    oAutoSuggestControl.autosuggest(aSuggestions);
                }
            };
            new AutoSuggestControl(pVars.cache.userInputBox, new Suggestions());

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
            pFuncs.bindAutoSuggest();
        }
    }
})();

window.onload=function(){
    jsconsole.init();
};