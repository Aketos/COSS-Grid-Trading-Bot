import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.main.onCreated(function helloOnCreated() {
    // counter starts at 0
    this.counter = new ReactiveVar(0);
});


Template.main.helpers({
    isApiConfigSet() {
        return ApiConfig.find().count() != 0;
    },
});

Template.botConfig.helpers({
    config() {
        return BotConfig.find().fetch()[0];
    },
});

Template.testT.helpers({
    show() {
        botConfig = BotConfig.find().fetch()[0];
        apiConfig = ApiConfig.find().fetch()[0];
        if (typeof botConfig != 'undefined') {
            Bot.addApiConfiguration(apiConfig);
            Meteor.call('fetchCossBalance', (error, result) => { console.log(result); });
            return botConfig.test();
        }
    }
});

Template.main.events({
    'click .toggler-private-conf'(event, instance) {
        $('.privateConf').toggle();
    },
    'click .toggler-bot-conf'(event, instance) {
        $('.botConf').toggle();
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
            minPriceExpected: event.target.minPriceExpected.value,
            maxPriceExpected: event.target.maxPriceExpected.value,
            orderSize: event.target.orderSize.value,
            grids: event.target.grids.value
        })
    },
});