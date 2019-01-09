/*let scanner = new Instascan.Scanner({
    video: document.getElementById('preview')
});

scanner.addListener('scan', function(content) {
    //console.log('' + content);
    alert('Escaneo de código QR realizado');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://cadena-de-frio.fcs-dev.net/qrcodes' + content, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {};
    xhr.send();
});

Instascan.Camera.getCameras().then(cameras => {
    if (cameras.length > 0) {
        scanner.start(cameras[0]);
    } else {
        console.log("No existe dispositivo de cámara");
    }
});*/

window.addEventListener('load', function () {
    let selectedDeviceId;
    const codeReader = new ZXing.BrowserQRCodeReader()
    console.log('ZXing code reader initialized')
    codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
            const sourceSelect = document.getElementById('sourceSelect')
            selectedDeviceId = videoInputDevices[0].deviceId
            if (videoInputDevices.length >= 1) {
                videoInputDevices.forEach((element) => {
                    const sourceOption = document.createElement('option')
                    sourceOption.text = element.label
                    sourceOption.value = element.deviceId
                    sourceSelect.appendChild(sourceOption)
                })

                sourceSelect.onchange = () => {
                    selectedDeviceId = sourceSelect.value;
                };

                const sourceSelectPanel = document.getElementById('sourceSelectPanel')
                sourceSelectPanel.style.display = 'block'
            }

            document.getElementById('startButton').addEventListener('click', () => {
                codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video').then((result) => {
                    console.log(result)
                    document.getElementById('result').textContent = result.text

		    alert('Escaneo de código QR realizado');
		  
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', 'https://cadena-de-frio.fcs-dev.net/qrcodes/' + result, true);
                    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    xhr.onload = function() {};
                    xhr.send();
                }).catch((err) => {
                    console.error(err)
                    document.getElementById('result').textContent = err
                })
                console.log(`Started continous decode from camera with id ${selectedDeviceId}`)
            })

            document.getElementById('resetButton').addEventListener('click', () => {
                codeReader.reset()
                console.log('Reset.')
            })

        })
        .catch((err) => {
            console.error(err)
        })
})
