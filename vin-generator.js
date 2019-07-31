'use strict';
var _ = require('lodash'),
    prefixes = require('./prefixes.js');
var weights = [ 8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2 ];

var vinDigitValues = { 'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':6, 'G':7, 'H':8, 'J':1, 'K':2, 'L':3, 'M':4, 'N':5, 'P':7, 'R':9, 'S':2, 'T':3, 'U':4, 'V':5,'W':6, 'X':7, 'Y':8, 'Z':9, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '0':0};

var prefixKeys = _.keys(prefixes);
var vinDigitValueKeys = _.keys(vinDigitValues);

function getCheckSum (vin) {
    
    var weights = [ 8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2 ];
    var vinDigitValues = { 'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':6, 'G':7, 'H':8, 'J':1, 'K':2, 'L':3, 'M':4, 'N':5, 'P':7, 'R':9, 'S':2, 'T':3, 'U':4, 'V':5,'W':6, 'X':7, 'Y':8, 'Z':9, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '0':0};
    
    var checkSumTotal = 0,
        remainder;

    if (vin.length < 17) {
        throw new Error('Invalid VIN Length: ' + vin.length);
    }
    _.each(vin, function (char, index) {
        if (vinDigitValues[char] !== undefined) {
            checkSumTotal += vinDigitValues[char] * weights[index];
        } else {
            throw new Error('Illegal Character: ' + char);
        }
    });

    remainder = checkSumTotal % 11;

    if (remainder === 10) {
        return 'X';
    }

    return remainder;
}

function generateVin() {
    var prefix = _.sample(prefixKeys),
        code = prefixes[prefix],
        char = _.sample(vinDigitValueKeys),
        chars = _.times(7,_.partial(_.sample, vinDigitValueKeys)).join(''),
        vinPart = prefix + char + code + chars,
        check = getCheckSum(vinPart);

    return vinPart.substring(0,8) + check + vinPart.substring(9,17);
}

function validateVin(input) {
    var weights = [ 8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2 ];
    var vinDigitValues = { 'A':1, 'B':2, 'C':3, 'D':4, 'E':5, 'F':6, 'G':7, 'H':8, 'J':1, 'K':2, 'L':3, 'M':4, 'N':5, 'P':7, 'R':9, 'S':2, 'T':3, 'U':4, 'V':5,'W':6, 'X':7, 'Y':8, 'Z':9, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '0':0};
    
    var vin = input.toUpperCase();
    
    if(vin.length != 17){
       console.log("Vin not 17 chars");
       return false;
    }
    
    var badChars = ["I", "O", "Q"];
    
    var sum = 0;
    for(var i = 0; i < vin.length; i++){
        
        for(var j = 0; j < badChars.length; j++){
            if(vin[i] == badChars[j]){
               console.log("Bad Character found at index " + i);
               return false;
            }
        }
        
        var weightVal = weights[i];
        var sChar = vin[i];
        var charVal = vinDigitValues[sChar];
        
        sum += weightVal * charVal;
        
    }
    
    var checkSumDigits = "0123456789X";
    console.log("checkSumDigit: " + checkSumDigits[sum % 11]);
    console.log("checkDigit: " + vin[8]);

    return checkSumDigits[sum % 11] == vin[8];
    
}

module.exports = {
    generateVin: generateVin
}