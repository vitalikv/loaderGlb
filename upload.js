iBytesUploaded = 0;
iBytesTotal = 0;
iPreviousBytesLoaded = 0;
oTimer = 0;
sResultFileSize = '';

secondsToTime = function(secs) { // we will use this function to convert seconds in normal time format
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600))/60);
    var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

    if(hr < 10) {hr = "0" + hr; }
    if(min < 10) {min = "0" + min;}
    if(sec < 10) {sec = "0" + sec;}
    if(hr) {hr = "00";}
    return hr + ':' + min + ':' + sec;
};

bytesToSize = function(bytes) {
    var sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

function fileSelected() {

    // hide different warnings
    document.getElementById('upload_response').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('abort').style.display = 'none';
    document.getElementById('warnsize').style.display = 'none';

    // get selected file element
    var oFile = document.getElementById('model_file').files[0];

    // get preview element
    var oImage = document.getElementById('preview');

    // prepare HTML5 FileReader
    var oReader = new FileReader();
        oReader.onload = function(e){

        // e.target.result contains the DataURL which we will use as a source of the image
        oImage.src = e.target.result;

        oImage.onload = function () { // binding onload event

            // we are going to display some custom image information here
            sResultFileSize = bytesToSize(oFile.size);
            document.getElementById('fileinfo').style.display = 'block';
            document.getElementById('filename').innerHTML = 'Name: ' + oFile.name;
            document.getElementById('filesize').innerHTML = 'Size: ' + sResultFileSize;
            document.getElementById('filetype').innerHTML = 'Type: ' + oFile.type;
            document.getElementById('filedim').innerHTML = 'Dimension: ' + oImage.naturalWidth + ' x ' + oImage.naturalHeight;
        };
    };

    // read selected file as DataURL
    oReader.readAsDataURL(oFile);
}

function startUploading() {
    // cleanup all temp states
    iPreviousBytesLoaded = 0;
    document.getElementById('upload_response').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('abort').style.display = 'none';
    document.getElementById('warnsize').style.display = 'none';
    document.getElementById('progress_percent').innerHTML = '';
    var oProgress = document.getElementById('progress');
    oProgress.style.display = 'block';
    oProgress.style.width = '0px';

    // get form data for POSTing
    //var vFD = document.getElementById('upload_form').getFormData(); // for FF3
    //var vFD = new FormData(document.getElementById('upload_form'));
    var vForm = document.getElementById('upload_form');
    var vFD = new FormData();
    for(var i = 0; i < vForm.elements.length; i++)
        if('model_file' === vForm.elements[i].id)
            vFD.append('model_file', vForm.elements[i].files[0]);

    // create XMLHttpRequest object, adding few event listeners, and POSTing our data
    var oXHR = new XMLHttpRequest();
    oXHR.upload.addEventListener('progress', uploadProgress, false);
    oXHR.addEventListener('load', uploadFinish, false);
    oXHR.addEventListener('error', uploadError, false);
    oXHR.addEventListener('abort', uploadAbort, false);
    oXHR.open('POST', '/placer/model/upload');
    oXHR.send(vFD);

    // set inner timer
    oTimer = setInterval(doInnerUpdates, 300);
}

function doInnerUpdates() { // we will use this function to display upload speed
    var iCB = iBytesUploaded;
    var iDiff = iCB - iPreviousBytesLoaded;

    // if nothing new loaded - exit
    if (iDiff == 0)
        return;

    iPreviousBytesLoaded = iCB;
    iDiff = iDiff * 2;
    var iBytesRem = iBytesTotal - iPreviousBytesLoaded;
    var secondsRemaining = iBytesRem / iDiff;

    // update speed info
    var iSpeed = iDiff.toString() + 'B/s';
    if (iDiff > 1024 * 1024) {
        iSpeed = (Math.round(iDiff * 100/(1024*1024))/100).toString() + 'MB/s';
    } else if (iDiff > 1024) {
        iSpeed =  (Math.round(iDiff * 100/1024)/100).toString() + 'KB/s';
    }

    document.getElementById('speed').innerHTML = iSpeed;
    document.getElementById('remaining').innerHTML = '| ' + secondsToTime(secondsRemaining);
}

function uploadProgress(e) { // upload process in progress
    if (e.lengthComputable) {
        iBytesUploaded = e.loaded;
        iBytesTotal = e.total;
        var iPercentComplete = Math.round(e.loaded * 100 / e.total);
        var iBytesTransfered = bytesToSize(iBytesUploaded);

        document.getElementById('progress_percent').innerHTML = iPercentComplete.toString() + '%';
        document.getElementById('progress').style.width = (iPercentComplete).toString() + '%';
        document.getElementById('b_transfered').innerHTML = iBytesTransfered;
        if (iPercentComplete == 100) {
            var oUploadResponse = document.getElementById('upload_response');
            oUploadResponse.innerHTML = '<h1>Please wait...processing</h1>';
            oUploadResponse.style.display = 'block';
        }
    } else {
        document.getElementById('progress').innerHTML = 'unable to compute';
    }
}

function uploadFinish(e) { // upload successfully finished
    var oUploadResponse = document.getElementById('upload_response');
    oUploadResponse.innerHTML = e.target.responseText;
    oUploadResponse.style.display = 'block';

    document.getElementById('progress_percent').innerHTML = '100%';
    document.getElementById('progress').style.width = '100%';
    document.getElementById('filesize').innerHTML = sResultFileSize;
    document.getElementById('remaining').innerHTML = '| 00:00:00';

    clearInterval(oTimer);

    var oXHR = new XMLHttpRequest();
    oXHR.addEventListener('load', postPost, false);
    oXHR.addEventListener('error', postPost, false);
    oXHR.open('POST', '/placer/api/ae/furniture');
    oXHR.setRequestHeader('Content-Type', 'application/json');
    var vForm = document.getElementById('upload_form');
    var vObj = {};
    var width = null;
    var length = null;
    for(var i = 0; i < vForm.elements.length; i++) {
        var elem = vForm.elements[i];
        if(elem.id.startsWith('meta_')) {
            var metaid = elem.id.substring(5);
            if('width' === metaid)
                width = elem.value;
            else if('length' === metaid)
                length = elem.value;
            else if(!(typeof elem.value === 'null' || typeof elem.value === 'undefined' || '' === elem.value || 'null' === elem.value))
                vObj[metaid] = elem.value;
        }
    }
    if(width != null && length != null) {
            // spot is projection of model onto floor plane.
            // dummy spot generation as bounding box computed from length & width.
            // real spot should be computed as simplified union of all polygons from 3d model
            // with vertical axis ordinate ("Z" in placer/spatial terms, "Y" in front/editor terms) zeroed
        vObj['spot'] = {
            "type":"Polygon",
            "coordinates":[[
                [0-width/2,0],
                [0-width/2,length/1],
                [0+width/2,length/1],
                [0+width/2,0],
                [0-width/2,0]
            ]]
        }
    }
    oXHR.send(JSON.stringify(vObj));
}

function uploadError(e) { // upload error
    document.getElementById('error').style.display = 'block';
    clearInterval(oTimer);
}

function uploadAbort(e) { // upload abort
    document.getElementById('abort').style.display = 'block';
    clearInterval(oTimer);
}

function postPost(e) { // for both post error and success
    var oPostResponse = document.getElementById('post_response');
    oPostResponse.innerHTML = e.target.responseText;
    oPostResponse.style.display = 'block';
}

function loadOptionsStart(name) { // used to initiate async load of various select's options
    var oXHR = new XMLHttpRequest();
    var aeURI = '/placer/api/ae/';
    if('type' === name)
        aeURI += 'furniture.';
    aeURI += name + '/list';
    oXHR.addEventListener('load', function(e) { loadOptionsComplete(e, name); }, false);
    oXHR.open('GET', aeURI);
    oXHR.send();
}

function loadOptionsComplete(e, name) { // used to populate select's when their options loaded via XHRs
    var rpOpts = '<option value="null">------</option>';
    var ra = JSON.parse(e.target.responseText);
    for(var i = 0; i < ra.length; i++)
        rpOpts += '<option value="' + ra[i].id + '">' + ra[i].title + '</option>';
    document.getElementById('meta_' + name).innerHTML = rpOpts;
}

window.addEventListener('DOMContentLoaded', (e) => {
    loadOptionsStart('type');
    loadOptionsStart('vendor');
    loadOptionsStart('style');
    loadOptionsStart('facing');
});

