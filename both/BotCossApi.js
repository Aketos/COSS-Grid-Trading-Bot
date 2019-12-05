class BotCossApi {
    ccxt = require('ccxt');
    cossApi;
    botConfig;

    constructor() {
    }

    addApiConfiguration(apiConfig) {
        this.cossApi = new this.ccxt.coss({
            apiKey: apiConfig.publicKey,
            secret: apiConfig.privateKey
        });
    }

    getCossApi() {
        return this.cossApi;
    }

    async resolvePromise(promise) {
        return promise
            .then(result => ({ success: true, result }))
            .catch(error => ({ success: false, error }))
    }

    async fetchBalance() {
        return await this.cossApi.fetchBalance();
    }

    async fetchOpenOrders(pairAToken, pairBToken) {
        return await this.cossApi.fetchOpenOrders(pairAToken + '/' + pairBToken);
    }

    async createLimitOrder(order, pairAToken, pairBToken, quantity, price) {
        var pair = pairAToken + '_' + pairBToken;

        return new Promise(async (resolve, reject) => {
            for (let i = 1; i <= 3; i++) {
                if (order == 'buy') {
                    var newOrder = await this.resolvePromise(this.cossApi.createLimitBuyOrder(pair, quantity, price));
                } else {
                    var newOrder = await this.resolvePromise(this.cossApi.createLimitSellOrder(pair, quantity, price));
                }
               
                if (
                    newOrder.success
                    && newOrder.result['id']
                ) {
                    resolve(newOrder.result);
                    return;
                }
            }
            reject(new Error('Fail to ' + order + ' ' + quantity + ' of ' + pair + ' at ' + price));
        });
    }


    async createCancellationOrder(id, pair) {
        return new Promise(async (resolve, reject) => {
            for (let i = 1; i <= 3; i++) {
                var cancelledOrder = await this.resolvePromise(this.cossApi.cancelOrder(id, pair));

                if (
                    cancelledOrder.success
                    && cancelledOrder.result['id']
                ) {
                    resolve(cancelledOrder.result);
                    return;
                }
            }
            reject(new Error('Fail to cancel order ' + id + ' on token pair ' + pair));
        });
    }

    test() {
        var exchange = new this.ccxt['coss']();
        console.log(exchange.has)
    }
}

Bot = new BotCossApi();
