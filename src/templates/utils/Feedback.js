
var log = '';

class Feedback {

    static Clear(){
        log = '';
    }

    static AddLine(line, isList){
        var prepend = isList ? ' - ' : '';
        log += prepend + line + '\n';
    }

    static Notify(message){
        if(message === undefined){
            message = log;
            log = '';
        }

        if(InfoBar)
            InfoBar.Add(message);
        
        alert(message);
    }

    static Prompt(message, defaultValue){
        var result = prompt(message, defaultValue ? defaultValue : '');
        return new Promise((resolve, reject) => {
            if (result == null || result == '') {
                reject();
            } else {
                resolve(result);
            }
        });
    }

    static Confirm(message){
        return new Promise((resolve, reject) => {
            if (confirm(message)) {
                resolve();
            } else {
                reject();
            }
        });
    }

    static Reload(){
        location.reload(false);
    }
}

export default Feedback;