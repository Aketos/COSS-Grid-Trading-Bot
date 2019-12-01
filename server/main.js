import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
    // code to run on server at startup
    
    WebApp.rawConnectHandlers.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
        return next();
    });

});


Meteor.methods({
    fetchCossBalance() {
        apiConfig = ApiConfig.find().fetch()[0];
        Bot.addApiConfiguration(apiConfig);

        return Bot.fetchBalance();
    }
});