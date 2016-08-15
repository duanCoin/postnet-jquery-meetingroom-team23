let _ = require('lodash');
let loadAllCodes = require('./items');

let allCodes = loadAllCodes();

class BestCharge {
    splitStringBy5(barcode) {
        return _.chunk(barcode, 5).map((array) => {
            return array.join('');
        });
    }

    checkBarcode(barcode) {
        let length = barcode.length;
        let isTrueBarcode = false;

        if ((length === 32 || length === 52) && barcode[0] === '|' && barcode[length - 1] === '|') {
            let temp = barcode.substr(1, length - 2);
            temp = this.splitStringBy5(temp);
            let result = temp.map((code) => {
                return allCodes.indexOf(code);
            });

            if (result.includes(-1) === false) {
                isTrueBarcode = true;
            }
        }

        return {
            isTrueBarcode,
            barcode
        };
    }

    formatBarcode({isTrueBarcode, barcode}) {
        let trueBarcode = false;
        let codes = [];
        if (isTrueBarcode === true) {
            barcode = barcode.substr(1, barcode.length - 2);
            codes = this.splitStringBy5(barcode);

            let temp = codes.map((code) => {
                return allCodes.indexOf(code);
            });

            if (!temp.includes(-1))
                trueBarcode = true;
        }
        return {
            isTrueBarcode: trueBarcode,
            barcode: codes
        };
    }

    checkBarcodeCd({isTrueBarcode, barcode}) {
        let trueBarcode = false;
        let codes = [];
        if (isTrueBarcode === true) {
            codes = barcode.map((element) => {
                return allCodes.indexOf(element);
            });
            if (_.sum(codes) % 10 === 0)
                trueBarcode = true;
            codes = _.dropRight(codes);
        }
        return {
            isTrueBarcode: trueBarcode,
            barcode: codes
        }
    }

    changeToZipcode({isTrueBarcode, barcode}) {
        if (isTrueBarcode === true) {
            if (barcode.length === 9)
                barcode.splice(5, 0, '-');
            return barcode.join('');
        }
        return false;
    }

    barcodeChangeToZipcode(barcode) {
        let checkedBarcode = this.checkBarcode(barcode);
        let formatedBarcode = this.formatBarcode(checkedBarcode);
        let checkedBarcodeCd = this.checkBarcodeCd(formatedBarcode);

        return this.changeToZipcode(checkedBarcodeCd);
    }

    checkZipcode(zipcode) {
        let isTrueZipcode = false;

        if ((zipcode.length === 5 || zipcode.length === 9 ) || (zipcode.length === 10 && zipcode[5] === '-')) {
            zipcode = zipcode.length === 10 ? zipcode.substr(0, 5) + zipcode.substr(6) : zipcode;

            let re = /^[0-9]*$/;
            if (zipcode.match(re) && zipcode === zipcode.match(re)[0])
                isTrueZipcode = true;
        }

        return {
            isTrueZipcode,
            zipcode
        };
    }

    chageToBarcode({isTrueZipcode, zipcode}) {
        if (isTrueZipcode === true) {
            zipcode = zipcode.length === 10 ? zipcode.substr(0, 5) + zipcode.substr(6) : zipcode;
            let temp = zipcode.split('');
            let sum = temp.reduce((result, element) => {
                result += parseInt(element);
                return result;
            }, 0);

            let cd = sum % 10 === 0 ? 0 : 10 - sum % 10;
            temp.push(cd);
            zipcode = temp.map((element) => {
                return allCodes[parseInt(element)];
            });

            return '|' + zipcode.join('') + '|';
        }
        return false;
    }

    zipcodeChangeToBarcode(zipcode) {
        let chckedZipcode = this.checkZipcode(zipcode);

        return this.chageToBarcode(chckedZipcode);
    }
}

module.exports = BestCharge;