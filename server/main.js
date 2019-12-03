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

    generateGridOrders(baseOrder, pairAToken, pairBToken) {
        Bot.addApiConfiguration(ApiConfig.find().fetch()[0]);
        Bot.createLimitOrder(baseOrder.order, pairAToken, pairBToken, baseOrder.quantity, baseOrder.orderPrice);
        Orders.insert({
            pair: pairAToken + '/' + pairBToken,
            order: baseOrder.order.toUpperCase(),
            quantity: baseOrder.quantity,
            value: baseOrder.orderPrice,
            status: 'OPEN'
        })
        //const sellOrder = await tryCatch(placeSellOrderWithRetry(currentSellPrice, amount));
        //if (sellOrder.success) {
        //    sellOrders.push(sellOrder.result.id);
        //    db.set('sellOrders', sellOrders).write();
        //    console.log('Placed sell order with price: ' + currentSellPrice + ' and amount: ' + amount);
        //} else {
        //    console.log(sellOrder.error);
        //}
        return true;
    },

    cancelAllOrders() {
        Orders.remove({});
    }
});