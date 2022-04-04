const axios = require('axios');
var TelegramBot = require('telegrambot');
var api = new TelegramBot(bot_id); //TODO: introduce bot_id
var candleSizeInPercent = 5;

function handle429Status() {
    // Got response code "Too many requests". Stop 1 minute
    console.log("Waiting 1 minute");
    timeNow = Math.round((new Date()).getTime() / 1000);
    while ((timeNow + 60) >= Math.round((new Date()).getTime() / 1000)) {
        // Waiting 1 minute
    }
}

async function requestKucoin (startAt, endAt) {
    var pairList = ["MKR-BTC", "AAVE-BTC", "KDA-BTC", "TOKO-KCS", "LINK-USDC", "BTC-USDT", "SHIB-USDT", "APE-USDT", "AVAX-USDT", "NEAR-USDT", "BNB-USDT", "LUNA-BTC", "SAND-USDT", "ELON-USDT", "LTC-USDT", "CRO-USDT", "THETA-USDT", "VR-USDT", "ROSE-USDT", "KOK-USDT", "WIN-USDT", "USDC-USDT", "ALGO-USDT", "HBAR-USDT", "FLUX-USDT", "ZEC-USDT", "DASH-USDT", "SOS-USDT", "PAXG-USDT" ];
    var arrayLength = pairList.length;
    var counter30PerMin = 0;
    for (var i = 0; i < arrayLength; i++) {
        var request = 'https://api.kucoin.com/api/v1/market/candles?type=1min&symbol='+pairList[i]+'&startAt='+startAt+'&endAt='+endAt;
        try {
            resp = await axios.get(request);
        } catch (error) {
            console.error(error.message);
            handle429Status();
            return 1;
        }
        if(typeof resp.data.data[0] !== "undefined")
        {
            console.log("Date: ", new Date(resp.data.data[0][0]*1000));
            console.log("Pair: ",pairList[i]);
            console.log("Open: ",resp.data.data[0][1]);
            console.log("Close: ",resp.data.data[0][2]);
            console.log("Maximum: ",resp.data.data[0][3]);
            console.log("Minimum: ",resp.data.data[0][4]);
            console.log("Volume: ",resp.data.data[0][5]);
            console.log("");
            openPrice = resp.data.data[0][1];
            closePrice = resp.data.data[0][2];
            candleSize = 100*(closePrice-openPrice)/closePrice;
            if(Math.abs(candleSize) >= candleSizeInPercent) {
                // Mandar message de telegram solo con una vela mayor que el 5%
                console.log("Sending Telegram message");
                var message = 'Candle of ' + candleSize + '% in the pair ' + pairList[i]; 
                api.invoke('sendMessage', { chat_id: /*TODO: introduce chat_id*/, text: message }, function (err, message) {
                    if (err) throw err;
                    console.log(message);
                });
                console.log("Message sent");
            }
        } else {
            console.log("Failed request:");
            console.log(request);
            console.log("");
        }
        timeNow = Math.round((new Date()).getTime() / 1000);
        while ((timeNow + 1) >= ((new Date()).getTime() / 1000)) {
            // Small wait till next request
        }
        counter30PerMin++;
        if(counter30PerMin==30 || i==(arrayLength-1)) {
            counter30PerMin = 0;
            while ((timeNow + 60) >= Math.round((new Date()).getTime() / 1000)) {
                // Waiting 1 minute to be able to have another 30 requests
            }
        }
    }
    return 1;
}

async function mainLoop() {
    while(true){
        var unixCurrentTime = Math.round((new Date()).getTime() / 1000);
        var unixCurrentTimeMinus161Min = unixCurrentTime-9700;
        returnValue = await requestKucoin(unixCurrentTimeMinus161Min, unixCurrentTime);
    }
}

mainLoop()