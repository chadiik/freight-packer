
function download(data, filename, type) {
    // https://stackoverflow.com/a/30832210/1712403
    var file = new Blob([data], {type: (type || 'text/plain')});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

const IO = {

    FileInfo: function(file){
        return this.Filename(file.name);
    },

    Filename: function(name){
        var trailStartIndex = name.lastIndexOf('/');
        var trail = name.slice(trailStartIndex + 1);

        var extStartIndex = trail.lastIndexOf('.');
        var nameOnly = trail.slice(0, extStartIndex);
        var extension = trail.slice(extStartIndex + 1);

        return {
            name: nameOnly,
            extension: extension
        }
    },

    SaveUTF: function(text, filename){
        download(text, filename, 'text/plain');
    },
    
    JSON: function(object, filename){
        var blob = new Blob([JSON.stringify(object)], {type: 'text/plain;charset=utf-8'});
        if(filename === undefined && object.hasOwnProperty('name')) filename = object.name + '.json';
        saveAs(blob, filename);
    },

    FileInput: crel('input', {type:'file', style:'display: none'}),

    GetFile: function(callback, binary){
        var onFileChange = function(){
            var file = this.files.length > 0 ? this.files[0] : undefined;
            if(file !== undefined){
                if(binary){
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        callback(e.target.result);
                    };
                    reader.readAsArrayBuffer(file);
                }
                else{
                    var reader = new FileReader();
                    reader.onload = function(e){
                        callback(e.target.result);
                    };
                    reader.readAsText(file);
                }
            }
            IO.FileInput.removeEventListener('change', onFileChange);
            IO.FileInput = crel('input', {type:'file', style:'display: none'});
        };
        IO.FileInput.addEventListener('change', onFileChange, false);
        IO.FileInput.click();
    },

    UploadFile: function(path, callback, failure){
        var filename;
        var success = function(response){
            callback(filename);
        };
        var failure = failure || function(response){
            console.log('Filename:', filename, ' - Failed to upload\n', response);
        };
        var onFile = function(file){
            filename = file.name;
            IO.PHPFileUpload(file, path, success, failure);
        };
        IO.GetFile(onFile);
    },

    XHRequest: function(success, failure){
        var req = false;
        try
        {
            // most browsers
            req = new XMLHttpRequest();
        }
        catch (e)
        {
            // IE
            try
            {
                req = new ActiveXObject('Msxml2.XMLHTTP');
            }
            catch(e)
            {
                // try an older version
                try
                {
                    req = new ActiveXObject('Microsoft.XMLHTTP');
                }
                catch(e)
                {
                    return false;
                }
            }
        }
        if (!req) return false;
        if (typeof success != 'function') success = function () {};
        if (typeof failure != 'function') failure = function () {};
        req.onreadystatechange = function()
        {
            if(req.readyState == 4)
            {
                return req.status === 200 ?
                    success(req.responseText) : failure(req.status);
            }
        };
        return req;
    },

    PHPClear: function(dir, success, failure){
        var vars = 'dir=' + encodeURIComponent(dir);

        var req = this.XHRequest(success, failure);
        req.open('POST', 'php/Clear.php', true);
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.send(vars);
        return req;
    },

    PHPZipExtract: function(file, path, success, failure){
        var formData = new FormData();
        formData.append('path', path);
        formData.append('zip_file', file);

        var req = this.XHRequest(success, failure);
        req.open('POST', 'php/Zipper.php', true);
        req.send(formData);
        return req;
    },

    PHPFileUpload: function(file, path, success, failure){
        var formData = new FormData();
        formData.append("path", path);
        formData.append("file", file);

        var req = this.XHRequest(success, failure);
        req.open("POST", "php/FileUploader.php", true);
        req.setRequestHeader("enctype", "multipart/form-data");
        req.send(formData);
        return req;
    }
};

export default IO;