let scanner = new Instascan.Scanner({
    video: document.getElementById('preview')
});

scanner.addListener('scan',function(content){
    //console.log('' + content);
    alert('Escaneo de código QR realizado');

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/qrcodes/'+content, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
    };
    xhr.send();
});

Instascan.Camera.getCameras().then(cameras =>
{
    if(cameras.length > 0){
        scanner.start(cameras[0]);
    } else{
        /*var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/qrcodes/Tlaxcala-01', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
        };
        xhr.send();*/
        console.log("No existe dispositivo de cámara");
    }
});
