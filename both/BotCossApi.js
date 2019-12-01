class BotCossApi {
    ccxt = require('ccxt');
    cossApi;
    configurator;

    
    constructor() {}

    addApiConfiguration(configurator) {
        //this.configurator = configurator;
        this.cossApi = new this.ccxt.coss({
            apiKey: configurator.publicKey,
            secret: configurator.privateKey
        });
    }

    getCossApi() {
        return this.cossApi;
    }

    async fetchBalance() {
        return await this.cossApi.fetchBalance();
    }
}

Bot = new BotCossApi();
