class BotConfigurator {
    basePrice;
    step;
    amountPerBuy;

    constructor(botConfig) {
        $.extend(this, botConfig);
        this.basePrice = this.calculateBasePrice();
        this.step = this.calculateStepValue();
        this.amountPerBuy = this.calculateAmountPerBuy();
    }

    // Calculate steps between two orders
    calculateStepValue() {
        return (this.maxPriceExpected - this.minPriceExpected) / this.calculateNumberOfOrders();
    }

    // Calculate the basic price of the token according to the range set
    calculateBasePrice() {
        return (parseFloat(this.minPriceExpected) + parseFloat((this.maxPriceExpected - this.minPriceExpected) / 2))
    }

    // Calculate the price to use on every buy order
    calculateAmountPerBuy() {
        return this.calculateBasePrice() * parseFloat(this.orderSize);

    }

    // Calculate the number of order of the same type (BUY/SELL) to generate
    calculateNumberOfOrders() {
        return this.grids / 2;
    }

	// Define all buys and sell orders
    defineOrdersList() {
        return this.defineGridBuyOrders().concat(this.defineGridSellOrders());
        //if (this.areValidOrders(orders)) {
        //    return orders;
        //}
    }

    // Define the list of buy orders to generate
    defineGridBuyOrders() {
        var buyOrders = [];

        for (let i = this.minPriceExpected; i < this.basePrice; i = parseFloat(i) + parseFloat(this.step)) {
            var order = new Object();
            order['quantity'] = this.amountPerBuy;
            order['orderPrice'] = i;
            order['order'] = 'BUY';
            buyOrders.push(order);
        }

        return buyOrders;
    }

    // Define the list of sell orders to generate
    defineGridSellOrders() {
        var sellOrders = [];

        for (let i = this.maxPriceExpected; i > this.basePrice; i = i - this.step) {
            var order = new Object();
            order['quantity'] = this.orderSize;
            order['orderPrice'] = i;
            order['order'] = 'SELL';
            sellOrders.push(order);
        }

        return sellOrders;
    }

	// Check if balances are big enough
    //areValidOrders(orders) {
    //    if ((orders.buy.length * this.amountPerBuy) > this.pairBBalance) {
    //        return false;
    //    }

    //    if ((orders.sell.length * this.orderSize) > this.pairABalance) {
    //        return false;
    //    }

    //    return true;
    //}

    test() {
        console.log(this.defineOrdersList());

        return '';


        var o = new Object();
        o['quantity'] = '546';
        var orders = new Object();
        orders['buy'] = o;
        return orders;
        //return this.defineOrdersList();
    }
}

BotConfig = new Mongo.Collection('bot_configuration', {
    transform: (doc) => new BotConfigurator(doc)
});
