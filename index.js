const webpush = require('web-push');
const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');

const config = require('./config.json');

var subscriptions = [];

Array.prototype.inArray = function(criteria) {
    for(var i=0; i < this.length; i++) {
        if(criteria(this[i])) return true;
    }
    return false;
};

Array.prototype.pushIfNotExist = function(element, criteria) {
    if (!this.inArray(criteria)) {
        this.push(element);
    }
};

// SERVER CONFIG

const app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('statics'));
app.use(bodyParser.json());

// ENDPOINTS

app.get('/', (request, response) => {
  console.info("Calling [GET] /");
  response.render('home', {publicKey: config.vapid.publicKey});
});

app.post('/subscribe', function(request, response) {
  let subscription = request.body;
  subscriptions.pushIfNotExist(subscription, (sub) => {
    return sub.endpoint === subscription.endpoint;
  });

  console.info(subscriptions);
});

app.post('/push', (request, response) => {
  console.info("Calling [POST] /push");

  const message = request.param('message');

  webpush.setGCMAPIKey(config.gcmApiKey);

  setTimeout(() => {
    const options = {
      TTL: 24 * 60 * 60,
      vapidDetails: {
        subject: 'mailto:info@mejoratuciudad.org',
        publicKey: config.vapid.publicKey,
        privateKey: config.vapid.privateKey
      },
    }

    subscriptions.forEach(function(subscription) {
      webpush.sendNotification(
        subscription,
        message,
        options
      );
    });
  }, 0);

  response.send('OK');
});

app.listen(config.server.port);
