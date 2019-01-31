const express = require('express');
const router = express.Router();
const Slack = require('slack-node');

webhookUri = "<Webhook de slack>";
slack = new Slack();
slack.setWebhook(webhookUri);

const Device = require('../models/device');

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('qrcode');
});

// Página principal
router.get('/:id', ensureAuthenticated, (req, res) => {
  var id = req.params.id;
  console.log(id);
  
  const newDevice = new Device({
    codigo: id
  });

  Device.getDeviceByCode(newDevice, (err, device) => {
    if (err) throw err;
    console.log(device);
    if(device === null){
      Device.insertDevice(newDevice, (err, out) => {
       console.log(out);
       slack.webhook({
          channel: "aws-iot-fundacion",
          text: "El identificador " + id + " se ha registrado en la base de datos.",
        }, function(err, response) {
          console.log(response);
          console.log(err);
        });
      });

    } else{
      slack.webhook({
        channel: "aws-iot-fundacion",
        text: "El identificador " + id + " se ha rechazado ya que existe en la base de datos.",
      }, function(err, response) {
        console.log(response);
	      console.log(err);
      });
    }
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.redirect('/users/login');
  }
}

module.exports = router;



