import { styles, Element, Draggable } from "./UIUtils";
import Config from "./Config";
//import dat from "./datGUIConsole";


var current = undefined,
    onFocus = [],
    onFocusLost = [];


class Smart {
    constructor(target, label){
        this.target = target;
        this.label = label;

        var scope = this;
        
        this.gui = new (window.dat || require("./datGUIConsole").default).GUI({autoPlace: false});
        this.draggable = new Draggable(this.label, 250);
        this.draggable.Add(this.gui.domElement);
        this.draggable.closeBtn.onclick = function(){
            scope.Hide();
        };

        var ui = Element.Add(this.draggable);
        this.draggable.Hide();

        this.onFocus = [];
        this.onFocusLost = [];
    }

    Delete(){
        this.Hide();
        this.draggable.Delete();
        this.gui.destroy();
        this.onFocus.length = this.onFocusLost.length = 0;
    }

    UpdateGUI(){
        Smart.UpdateGUI(this.gui);
    }

    Hide(){
        this.draggable.Hide();
        Smart.SetCurrent(undefined);
    }

    Show(){
        if(current !== undefined){
            if(current === this) return;

            var oldPos = current.draggable.GetPosition();
            this.draggable.SetPosition(oldPos.x, oldPos.y);

            current.Hide();
        }
        this.draggable.Show();
        Element.AddStyle(this.draggable.domElement, styles.UIWiggleAnim);
        Smart.SetCurrent(this);

        this.UpdateGUI();
    }
    
    Config(folderName, target, guiChanged, ...args){
        this.config = new Config(target);
        this.config.Track(...args);
        this.config.Edit(guiChanged, folderName, this.gui, {save: false});
        return this.config.gui;
    }

    static SetCurrent(current){
        var iFocus;
        if(current !== undefined){
            for(iFocus = 0; iFocus < onFocusLost.length; iFocus++){
                onFocusLost[iFocus](current);
            }
            for(iFocus = 0; iFocus < current.onFocusLost.length; iFocus++){
                current.onFocusLost[iFocus]();
            }
        }

        current = current;

        if(current !== undefined){
            for(iFocus = 0; iFocus < onFocus.length; iFocus++){
                onFocus[iFocus](current);
            }
            for(iFocus = 0; iFocus < current.onFocus.length; iFocus++){
                current.onFocus[iFocus]();
            }
        }
    }

    static UpdateGUI(gui){
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }

        var folders = Object.values(gui.__folders);
        for(i = 0; i < folders.length; i++){
            this.UpdateGUI(folders[i]);
        }
    }
}

export default Smart;