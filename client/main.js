import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.main.onCreated(function ini() {
    this.botState = new ReactiveVar('Stoped');
    this.loop = new ReactiveVar();
});

Template.orders.onCreated(function iniOrders() {
    this.orders = new ReactiveVar([]);
});

Template.main.helpers({
    isApiConfigSet() {
        return ApiConfig.find().count() != 0;
    },
    botState() {
        return Template.instance().botState.get();
    }
});

Template.orders.helpers({
    orders() {
        return Orders.find().fetch();
    }
});

Template.botConfig.helpers({
    config() {
        return BotConfig.find().fetch()[0];
    },
});

Template.testT.helpers({
    show() {
        botConfig = BotConfig.find().fetch()[0];
        Meteor.call('fetchCMC', botConfig.pairAToken, botConfig.pairBToken, (error, result) => {
            console.log(result);
            console.log(error);
        });
    }
});

Template.main.events({
    'click .toggler-private-conf'(event, instance) {
        $('.privateConf').toggle();
    },
    'click .toggler-bot-conf'(event, instance) {
        $('.botConf').toggle();
    },
    'click .start-stop'(event, instance) {
        if (Template.instance().botState.get() == 'Stoped') {
            Template.instance().botState.set('Started');

            //botConfig = BotConfig.find().fetch()[0];
            //orders = botConfig.defineOrdersList();

            //orders.forEach((newOrder) => {
            //    Meteor.call(
            //        'generateGridOrders',
            //        newOrder,
            //        botConfig.pairAToken,
            //        botConfig.pairBToken,
            //        (error, result) => { });
            //});

            Template.instance().loop.set(
                Meteor.setInterval(
                    () => {
                        Meteor.call(
                            'fetchCossOrders',
                            botConfig.pairAToken,
                            botConfig.pairBToken,
                            (error, result) => { }), 1000
                    })
            );
        } else {
            Meteor.clearTimeout(Template.instance().loop.get());
            Meteor.call('cancelAllOpenOrders', (error, result) => { });
            Template.instance().botState.set('Stoped');
        }
    },
});

Template.privateConfig.events({
    'submit .save-api-config'(event, instance) {
        ApiConfig.insert({
            privateKey: event.target.privateKey.value,
            publicKey: event.target.publicKey.value
        })
    },
});

Template.botConfig.events({
    'submit .save-bot-config'(event, instance) {
        if (BotConfig.find().count() != 0) {
            BotConfig.remove(
                BotConfig.find().fetch()[0]._id
            );
        }

        BotConfig.insert({
            pairAToken: event.target.pairAToken.value,
            pairABalance: event.target.pairABalance.value,
            pairBToken: event.target.pairBToken.value,
            pairBBalance: event.target.pairBBalance.value,
            minPriceExpected: parseInt(event.target.minPriceExpected.value),
            maxPriceExpected: parseInt(event.target.maxPriceExpected.value),
            orderSize: parseInt(event.target.orderSize.value),
            grids: parseInt(event.target.grids.value)
        })
    },
});