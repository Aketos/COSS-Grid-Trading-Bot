import { Meteor } from 'meteor/meteor';
import 'ccxt';

Meteor.startup(() => {
    // code to run on server at startup
    
    //WebApp.rawConnectHandlers.use(function (req, res, next) {
    //    res.setHeader("Access-Control-Allow-Origin", "*");
    //    res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
    //    return next();
    //});

});


Meteor.methods({
    fetchCossBalance() {
        apiConfig = ApiConfig.find().fetch()[0];
        Bot.addApiConfiguration(apiConfig);

        return Bot.fetchBalance();
    },

    fetchCossOrders(pairAToken, pairBToken) {
        Bot.addApiConfiguration(ApiConfig.find().fetch()[0]);
        
        return Bot.fetchOpenOrders(pairAToken, pairBToken);     
    },

    async generateGridOrders(baseOrder, pairAToken, pairBToken) {
        Bot.addApiConfiguration(ApiConfig.find().fetch()[0]);

        var registeredOrder = await Bot.resolvePromise(Bot.createLimitOrder(baseOrder.order, pairAToken, pairBToken, baseOrder.quantity, baseOrder.orderPrice));

        if (registeredOrder.success) {
            registeredOrder.push();
            Orders.insert({
                pair: pairAToken + '/' + pairBToken,
                order: baseOrder.order.toUpperCase(),
                quantity: baseOrder.quantity,
                value: baseOrder.orderPrice,
                status: 'OPEN',
                cossId: registeredOrder.result.id
            })
        } else {
            console.log(registeredOrder.error);
        }

        return true;
    },

    cancelAllOrders() {
        Orders.remove({});
    }
});