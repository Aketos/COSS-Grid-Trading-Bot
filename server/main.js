import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'
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

    async sleepFct() {
        return 'sleep';
    },
    async fetchCossOrders(pairAToken, pairBToken) {
        console.log('loop'); return true;
        Bot.addApiConfiguration(ApiConfig.find().fetch()[0]);

        var registeredOrder = await Bot.resolvePromise(
            Bot.fetchOpenOrders(pairAToken, pairBToken)
        );

        if (registeredOrder.success) {
            //registeredOrder.push();
            //Orders.insert({
            //    pair: pairAToken + '/' + pairBToken,
            //    order: baseOrder.order.toUpperCase(),
            //    quantity: baseOrder.quantity,
            //    value: baseOrder.orderPrice,
            //    status: 'OPEN',
            //    cossId: registeredOrder.result.id
            //})
        } else {
            console.log(registeredOrder.error);
        }
    },

    async fetchCMC(quote, asset) {
        HTTP.call(
            'GET',
            'https://web-api.coinmarketcap.com/v1/tools/price-conversion',
            {
                params: { amount: parseInt(1), convert_id: parseInt(1), id: parseInt(1027) }
            }
            , (error, response, body) => {
                if (error) {
                    console.log('couldn´t fetch price from cmc');
                    console.log(error);
                    return;
                }
                return response;
            });
    },

    async generateGridOrders(baseOrder, pairAToken, pairBToken) {
        Bot.addApiConfiguration(ApiConfig.find().fetch()[0]);

        var registeredOrder = await Bot.resolvePromise(
            Bot.createLimitOrder(baseOrder.order, pairAToken, pairBToken, baseOrder.quantity, baseOrder.orderPrice)
        );

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

    async cacnelAllOpenOrders() {
        var orders = Orders.find().fetch();

        orders.forEach(async (order) => {
            if (order.status == 'OPEN') {
                var registeredOrder = await Bot.resolvePromise(
                    Bot.createCancellationOrder(order.cossId, order.pair)
                );

                if (registeredOrder.success) {
                    Orders.remove(order._id);
                }
            } else {
                console.log(registeredOrder.error);
            }
        });
    }
});