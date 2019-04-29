var preview = document.getElementById('video-preview');
var res = document.getElementById('res');

// window.onload = function () {
   //  /* Ask for "environnement" (rear) camera if available (mobile), will fallback to only available otherwise (desktop).
   // * User will be prompted if (s)he allows camera to be started */
   //  navigator.mediaDevices.getUserMedia({
   //      video: {
   //          facingMode: "enviroment",
   //          // facingMode: { exact: "environment" }
   //      },
   //      audio: false,
   //  }).then(function (stream) {
   //      var video = document.getElementById("video-preview");
   //
   //      video.srcObject = stream;
   //      video.setAttribute('playsinline', true); /* otherwise iOS safari starts fullscreen */
   //      video.play();
   //
   //      setTimeout(tick, 1); /* We launch the tick function 100ms later (see next step) */
   //  }).catch(function (err) {
   //      console.log(err); /* User probably refused to grant access*/
   //  });
// };

navigator.mediaDevices
	.getUserMedia({ 
		video: true,
	})
    .then((stream) => {
        preview.srcObject = stream;

        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                devices
                	.filter((device) => device.kind === 'videoinput')
                	.forEach((device) => {
                    	let btn = document.createElement('button');

                    	btn.textContent = device.label;
                    	btn.dataset.deviceId = device.deviceId;

                    	btn.onclick = function () {
                        	changeDdevice(this.dataset.deviceId);
                    	};

                		btnDeviceIdContainer.appendChild(btn);
            		});

            	res.textContent = JSON.stringify(devices, null, 2);
            });

        // var video = document.getElementById("video-preview");

         preview.srcObject = stream;
         // preview.setAttribute('playsinline', true); /* otherwise iOS safari starts fullscreen */
         // preview.play();

         setTimeout(tick, 1); /* We launch the tick function 100ms later (see next step) */
    });

function changeDdevice(deviceId) {
    if (preview.srcObject) {
        preview.srcObject.getTracks().forEach(track => track.stop());
        preview.srcObject = null;
    }

    navigator.mediaDevices
    	.getUserMedia({
	        video: {
	            deviceId: deviceId
	        }
	    })
    	.then((stream) => preview.srcObject = stream);
}

function tick() {
    var video = document.getElementById('video-preview');
    var qrCanvasElement = document.getElementById('qr-canvas');
    var qrCanvas = qrCanvasElement.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        qrCanvasElement.height = video.videoHeight;
        qrCanvasElement.width = video.videoWidth;
        qrCanvas.drawImage(video, 0, 0, qrCanvasElement.width, qrCanvasElement.height);

        try {
            var result = qrcode.decode();

            console.log(result);
            document.getElementById('result').value = result;

            /* Video can now be stopped */
            video.pause();
            video.src = "";
            video.srcObject.getVideoTracks().forEach(track => track.stop());

            /* Display Canvas and hide video stream */
            qrCanvasElement.classList.remove('hidden');
            video.classList.add('hidden');
        }catch (e) {

        }
    }

    /* If no QR could be decoded from image copied in canvas */
    if (!video.classList.contains('hidden')) setTimeout(tick, 1);
}