const axios = require('axios');
const pairs = require('./pairs');
var TelegramBot = require('telegrambot');

const thresholdPercentage = process.env.KUCOIN_CANDLES_THRESHOLD_PERCENTAGE;
const thresholdVolume = process.env.KUCOIN_CANDLES_THRESHOLD_VOLUME;
const bot_id = process.env.KUCOIN_CANDLES_BOT_ID;
const chatid = process.env.KUCOIN_CANDLES_CHAT_ID;
if (!thresholdPercentage || !thresholdVolume || !bot_id || !chatid) {
    throw new Error('One or more required environment variables are missing a value');
}

var api = new TelegramBot(bot_id);

async function sendTelegram(pair, percentage, vol) {
    console.log(`Pair: ${pair}, Percentage change: ${percentage}%, Volume: ${vol} USD.`);
    var message = 'Candle of ' + percentage + '% in the pair ' + pair + ' with volume ' + vol + 'USD.';
    api.invoke('sendMessage', { chat_id: chatid, text: message }, function (err, message) {
        if (err) throw err;
    });
}

async function fetchCandles(pair) {
    try {
        const response = await axios.get(`https://api.kucoin.com/api/v1/market/candles?type=1min&symbol=${pair}`);
        const { data } = response;
        const [lastCandle] = data.data.slice(-1);
        const [ timestamp, open, close, maximum, minimum, vol, turnover ] = lastCandle;
        const percentageChange = parseFloat((((maximum - minimum) / minimum) * 100).toFixed(2));
        if (percentageChange > thresholdPercentage && turnover > thresholdVolume) {
            sendTelegram(pair, percentageChange, Math.trunc(turnover));
        }
    } catch (error) {
        if (error.response && error.response.data && error.response.data.code === '429000') {
          console.log('Server is overloaded, pausing for 1 minute...');
          await new Promise(resolve => setTimeout(resolve, 60000)); // Pause for 1 minute
          console.log('Resuming requests...');
          await fetchCandles(pair); // Retry request
        } else {
          console.error(`Error fetching candles for ${pair}: ${error.message}`);
        }
    }
}

function start() {
    for(const pair of pairs) {
        fetchCandles(pair); // call getCandles once before starting the interval
        setInterval(async () => {
            await fetchCandles(pair);
        }, 60000);
    }
}

start();