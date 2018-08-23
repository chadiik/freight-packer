
if(window.dat && !window.dat.guiExtensions){

    window.dat.guiExtensions = true;

    var stylesheet;

    function createCSS(css){
        if(stylesheet === undefined){
            stylesheet = document.createElement('style');
            stylesheet.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(stylesheet);
        }
        if(css instanceof Array)
            css = css.join('\n');
        
        stylesheet.innerHTML += css + '\n';
    }

    createCSS([
        '.tooltip .tooltiptext {',
        '    visibility: hidden;',
        '    position: absolute;',
        '    width: 120px;',
        '    background-color: #111;',
        '    color: #fff;',
        '    text-align: center;',
        '    padding: 2px 0;',
        '    border-radius: 2px;',
        '    z-index: 1;',
        '    opacity: 0;',
        '    transition: opacity .6s;',
        '}',

        '.tooltip-top {',
        '    bottom: 125%;',
        '    left: 50%;',
        '    margin-left: -60px;',
        '}',
        
        '.tooltip:hover .tooltiptext {',
        '    visibility: visible;',
        '    opacity: 1;',
        '}'
    ]);

    const styles = {
        datDisabled: 'color: #606060 !important; cursor: not-allowed !important;'
    };

    Object.defineProperty(window.dat.GUI.prototype, 'onGUIEvent', {
        get: function(){
            if(!this._onGUIEvent)
                this._onGUIEvent = [];
            return this._onGUIEvent;
        }
    });

    // update all

    window.dat.GUI.prototype.updateAll = function(){
        var gui = this;
        for (var i in gui.__controllers) {
            var controller = gui.__controllers[i];
            controller.updateDisplay();
        }

        var folders = Object.values(gui.__folders);
        for(i = 0; i < folders.length; i++){
            folders[i].updateAll();
        }
    };

    // find

    window.dat.GUI.prototype.find = function(object, property){
        var gui = this, controller, i;

        if(property){ // 2 arguments
            for (i = 0; i < gui.__controllers.length; i++){
                controller = gui.__controllers[i];
                if (controller.object == object && controller.property == property)
                    return controller;
            }

            var folders = Object.values(gui.__folders);
            for(i = 0; i < folders.length; i++){
                controller = folders[i].find(object, property);
                if(controller) return controller;
            }
        }
        else{
            property = object; // 1 argument

            var folderKeys = Object.keys(gui.__folders);
            for(i = 0; i < folderKeys.length; i++){
                var folderName = folderKeys[i];
                var folder = gui.__folders[folderName];
                if(folderName === property)
                    return folder;
            }
        }
        return undefined;
    };

    // On open event
    //if(_this.opening !== undefined) _this.opening = _this.closed; // chadiik
    Object.defineProperty(window.dat.GUI.prototype, 'opening', {
        get: function(){
            return !this.closed;
        },

        set: function(value){
            for(var i = 0; i < this.onGUIEvent.length; i++){
                this.onGUIEvent[i](value ? 'open' : 'close');
            }
        }
    });

    // Disabled
    function blockEvent(event){
        event.stopPropagation();
    }

    Object.defineProperty(window.dat.controllers.Controller.prototype, "disabled", {
        get: function(){
            return this.domElement.hasAttribute("disabled");
        },

        set: function(value){
            if (value){
                this.domElement.setAttribute("disabled", "disabled");
                this.domElement.addEventListener("click", blockEvent, true);
                Element.AddStyle(this.domElement.parentElement.parentElement, styles.datDisabled);
            }
            else{
                this.domElement.removeAttribute("disabled");
                this.domElement.removeEventListener("click", blockEvent, true);
                Element.RemoveStyle(this.domElement.parentElement.parentElement, styles.datDisabled);
            }
        },

        enumerable: true
    });

    window.dat.GUI.prototype.enable = function(object, property, value){
        var controller = this.find(object, property);
        controller.disabled = !value;
    };

    // Tooltip

    Object.defineProperty(window.dat.controllers.Controller.prototype, "tooltip", {
        get: function(){
            return this._tooltip.innerHTML;
        },

        set: function(value){
            if (value){
                if(this._tooltip === undefined) {
                    this._tooltip = crel('span', {class: 'tooltiptext'});

                    /**
                     * @type {HTMLElement}
                     */
                    var container = this.domElement.parentElement.parentElement;
                    container.classList.add('tooltip');
                    container.appendChild(this._tooltip);
                }
                this._tooltip.innerHTML = value;
            }
        },

        enumerable: true
    });

    window.dat.GUI.prototype.setTooltip = function(object, property, value){
        var controller = this.find(object, property);
        controller.tooltip = value;
    };
}