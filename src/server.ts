import expo from './ExpoClient';

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var morgan = require('morgan');
var schedule = require('node-schedule');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.route('/notification').post(async function (req: any, res: any) {
  const data = {
    title: req.body.title,
    body: req.body.body,
    timer: req.body.timer,
    token: req.body.token,
    token2: req.body.token2,
    _displayInForeground: true,
    sound: req.body.sound,
    test: req.body.test,
    name: req.body.name,
    data: req.body.data,
  };
  console.log(data);
  const startTime = new Date(Date.now());
  const endTime = new Date(startTime.getTime() + Number(data.timer));
  console.log('Fecha terminacion', endTime);
  console.log('time enviado', Number(data.timer));
  if (data.test === false && data.token !== '') {
    console.log('se programo la notificacion');
    schedule.scheduleJob(endTime, async function () {
      await new expo().sendPushNotificationsAsync([
        {
          title: data.title,
          body: data.body,
          to: data.token,
          sound: data.sound,
          data: data.data,
        },
      ]);
      console.log('notification send!!', data.token);
    });
  }
  res.json({ message: 'notification ok!' });
});

app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);
