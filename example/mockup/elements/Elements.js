
const styles = {
    UIOrigin: 'position: absolute; left: 0px; top: 0px;',
    UIDropDown: 'display: inline-block;',
    UIDropDownItem: 'display: block; width: 100%;',
    UIDropDownMenu: 'list-style:none; padding-left:4px; margin:0;'
}

class Elements {
    
    static DropDown(items, absolutePositioning){
        absolutePositioning = absolutePositioning || absolutePositioning === undefined;
    
        var numItems = items.length;
        var menu = crel('ul', {style: styles.UIDropDownMenu});
        for(var i = 0; i < numItems; i++){
            if(items[i] instanceof Element){
                items[i].style += styles.UIDropDownItem;
                menu.appendChild(items[i]);
            }
        }
    
        if(absolutePositioning) menu.style = styles.UIOrigin;
        menu.style += styles.UIDropDown;
        return menu;
    }
}