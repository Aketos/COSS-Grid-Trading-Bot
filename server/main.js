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

    async fetchCossOrders(pairAToken, pairBToken) {
        config = ApiConfig.find().fetch()[0];
        Bot.addApiConfiguration(config);

        var registeredOrder = await Bot.resolvePromise(
            Bot.fetchOpenOrders(pairAToken, pairBToken)
        );
        var openOrders = Orders.find().fetch();

        if (registeredOrder.success) {
            registeredOrder.result.forEach((order) => {
                for (var i = openOrders.length - 1; i >= 0; i--) {
                    if (openOrders[i].cossId === order.id) {
                        openOrders.splice(i, 1);
                    }
                }
            });

            openOrders.forEach((orderFilled) => {
                // Create oposite order @config.basePrice
                if (orderFilled.order == 'BUY') {
                    createLimitOrder('SELL', pairAToken, pairBToken, baseOrder.quantity, config.basePrice);
                } else {
                    createLimitOrder('BUY', pairAToken, pairBToken, baseOrder.quantity, config.basePrice);
                }

                // CLOSE order
                Orders.update({ cossId: orderFilled.cossId }, { $set: { status: 'CLOSED' } });
            })
           
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
        createLimitOrder(baseOrder.order, pairAToken, pairBToken, baseOrder.quantity, baseOrder.orderPrice);

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
    },

    async createLimitOrder(order, pairAToken, pairBToken ,quantity, price) {
        var registeredOrder = await Bot.resolvePromise(
            Bot.createLimitOrder(order, pairAToken, pairBToken, quantity, price)
        );

        if (registeredOrder.success) {
            registeredOrder.push();
            Orders.insert({
                pair: pairAToken + '/' + pairBToken,
                order: baseOrder.order,
                quantity: baseOrder.quantity,
                value: baseOrder.orderPrice,
                status: 'OPEN',
                cossId: registeredOrder.result.id
            })
        } else {
            console.log(registeredOrder.error);
        }
    }
});