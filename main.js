const axios = require('axios');
var TelegramBot = require('telegrambot');
var api = new TelegramBot('5107359630:AAEMt2AJq3MwJjWtHuWzdDhXie56FSVu-JM');

function handle429Status() {
    // Recibimos codigo de respuesta "Too many requests". Para 3 minutos
    console.log("Esperando 1 minuto");
    timeNow = Math.round((new Date()).getTime() / 1000);
    while ((timeNow + 60) >= Math.round((new Date()).getTime() / 1000)) {
        // Esperar 1 minuto
    }
}

async function requestKucoin (startAt, endAt) {
    var listaPares = ["MKR-BTC", "AAVE-BTC", "KDA-BTC", "TOKO-KCS", "LINK-USDC", "BTC-USDT", "SHIB-USDT", "APE-USDT", "AVAX-USDT", "NEAR-USDT", "BNB-USDT", "LUNA-BTC", "SAND-USDT", "ELON-USDT", "LTC-USDT", "CRO-USDT", "THETA-USDT", "VR-USDT", "ROSE-USDT", "KOK-USDT", "WIN-USDT", "USDC-USDT", "ALGO-USDT", "HBAR-USDT", "FLUX-USDT", "ZEC-USDT", "DASH-USDT", "SOS-USDT", "PAXG-USDT" ];
    var arrayLength = listaPares.length;
    var contadorDe30PorMinuto = 0;
    for (var i = 0; i < arrayLength; i++) {
        var request = 'https://api.kucoin.com/api/v1/market/candles?type=1min&symbol='+listaPares[i]+'&startAt='+startAt+'&endAt='+endAt;
        try {
            resp = await axios.get(request);
        } catch (error) {
            console.error(error.message);
            handle429Status();
            return 1;
        }
        if(typeof resp.data.data[0] !== "undefined")
        {
            console.log("Fecha: ", new Date(resp.data.data[0][0]*1000));
            console.log("Par: ",listaPares[i]);
            console.log("Apertura: ",resp.data.data[0][1]);
            console.log("Cierre: ",resp.data.data[0][2]);
            console.log("Maximo: ",resp.data.data[0][3]);
            console.log("Minimo: ",resp.data.data[0][4]);
            console.log("Volumen: ",resp.data.data[0][5]);
            console.log("");
            apertura = resp.data.data[0][1];
            cierre = resp.data.data[0][2];
            tamanyoVela = 100*(cierre-apertura)/cierre;
            if(Math.abs(tamanyoVela) >= 5) {
                // Mandar mensaje de telegram solo con una vela mayor que el 5%
                console.log("Enviando mensaje de telegram");
                var mensaje = 'Vela del ' + tamanyoVela + '% en el par ' + listaPares[i]; 
                api.invoke('sendMessage', { chat_id: 1718966202, text: mensaje }, function (err, message) {
                    if (err) throw err;
                    console.log(message);
                });
                console.log("Mensaje enviado");
            }
        } else {
            console.log("Fallo en la request. Probablemente temporal.");
            console.log("Request fallida: ", request);
            console.log("");
        }
        timeNow = Math.round((new Date()).getTime() / 1000);
        while ((timeNow + 1) >= ((new Date()).getTime() / 1000)) {
            // Esperar un poquito a la siguiente request
        }
        contadorDe30PorMinuto++;
        if(contadorDe30PorMinuto==30 || i==(arrayLength-1)) {
            contadorDe30PorMinuto = 0;
            while ((timeNow + (60-contadorDe30PorMinuto)) >= Math.round((new Date()).getTime() / 1000)) {
                // Esperar el resto del minuto para poder volver a hacer otras 30 requests
            }
        }
    }
    //while ((endAt + 60) >= Math.round((new Date()).getTime() / 1000)) {
    //    // Esperar un minuto
    //}
    return 1;
}

async function mainLoop() {
    while(true){
        var unixCurrentTime = Math.round((new Date()).getTime() / 1000);
        var unixCurrentTimeMinus128Min = unixCurrentTime-9700;
        retorno = await requestKucoin(unixCurrentTimeMinus128Min, unixCurrentTime);
    }
}

mainLoop()