let express = require('express');
let app = express();

let BestCharge = require('./core/best-charge');
let translateCode = new BestCharge();

app.use(express.static('./', {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['html', 'js', 'css'],
  index: ['index.html'], // or `false`
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
}));

const beginMenu = `1. Translate zip code to bar code
2. Translate bar code to zip code
3. Quit
Please input your choices(1~3)`;

const functionMaping = {
  '1': 'Please input zip code:',
  '2': 'Please input bar code:',
  '*': 'Please give right input:'
};

app.get('/main-menu', function (req, res) {
  res.send(beginMenu);
});

app.get('/chose/:zipcode', function(req, res) {
  let zipcode = req.params.zipcode;
  res.send(functionMaping[zipcode] || functionMaping['*']);
});

app.get('/zipcode-to-barcode/:zipcode', function(req, res) {
  let zipcode = req.params.zipcode;
  res.send(translateCode.zipcodeChangeToBarcode(zipcode));
});

app.get('/barcode-to-zipcode/:barcode', function(req, res) {
  let barcode = req.params.barcode;
  res.send(translateCode.barcodeChangeToZipcode(barcode));
});

app.listen(3000, function() {
  console.log('server is listening on 3000');
})