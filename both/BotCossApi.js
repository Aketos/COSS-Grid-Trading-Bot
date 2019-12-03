class BotCossApi {
    ccxt = require('ccxt');
    cossApi;
    botConfig;

    constructor() { }

    addApiConfiguration(apiConfig) {
        this.cossApi = new this.ccxt.coss({
            apiKey: apiConfig.publicKey,
            secret: apiConfig.privateKey
        });
    }

    getCossApi() {
        return this.cossApi;
    }

    async fetchBalance() {
        return await this.cossApi.fetchBalance();
    }

    async fetchOpenOrders(pairAToken, pairBToken) {
        return await this.cossApi.fetchOpenOrders(pairAToken + '/' + pairBToken);
    }

    async createLimitOrder(order, pairAToken, pairBToken, quantity, price) {
        var pair = pairAToken + '/' + pairBToken;
        console.log(order, pairAToken, pairBToken, quantity, price);
        if (order == 'buy') {
            return await createLimitBuyOrder(pair, quantity, price);
        } else {
            return await this.cossApi.createLimitSellOrder(pair, quantity, price);
        }
    }

    test() {
        var exchange = new this.ccxt['coss']();
        console.log(exchange.has)
    }
}

Bot = new BotCossApi();
