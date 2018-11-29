const express = require('express');
const router = express.Router();
const Slack = require('slack-node');

webhookUri = "https://hooks.slack.com/services/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";
slack = new Slack();
slack.setWebhook(webhookUri);

const Device = require('../models/qrcode');

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
        slack.webhook({
          channel: "aws-iot-fundacion",
          text: "El identificador " + id + " se ha registrado en la base de datos.",
        }, function(err, response) {
          console.log(response);
        });
        console.log(out);
      });
    } else{
      slack.webhook({
        channel: "aws-iot-fundacion",
        text: "El identificador " + id + " se ha rechazado ya que existe en la base de datos.",
      }, function(err, response) {
        console.log(response);
      });
    }
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  } else {
      //req.flash('error_msg', 'No estás logeado');
      res.redirect('/users/login');
  }
}

module.exports = router;



