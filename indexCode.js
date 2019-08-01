"use strict";

//import {validateVin} from './vin-generator.js';
//import * as lib from './vin-generator.js';
//var vinGenerate = require('./vin-generator.js');

var app = new function() {
	
	function initialize() {
		var elems = document.querySelectorAll("input[type=number], textarea");
		for (var i = 0; i < elems.length; i++) {
			if (elems[i].id.indexOf("version-") != 0)
				elems[i].oninput = redrawQrCode;
		}
		elems = document.querySelectorAll("input[type=radio], input[type=checkbox]");
		for (var i = 0; i < elems.length; i++)
			elems[i].onchange = redrawQrCode;
        
//         document.getElementById("vinInput").onkeyup = testVinValidation;
        
		redrawQrCode();
	}
	
	function testVinValidation() {
        
        var input = document.getElementById("vinInput").value;
        console.log(validateVin(input));
        
    }
    
	function redrawQrCode() {
		// Show/hide rows based on bitmap/vector image output

		
        var bitmapOutput = true; // Set bitmap as the default, Vector image is the other option
        if (bitmapOutput) {
		} else {
			scaleRow.style.display = "none";
		}
		

		// Reset output images in case of early termination
		var canvas = document.getElementById("qrcode-canvas");
		
		// Returns a QrCode.Ecc object based on the radio buttons in the HTML form.
		function getInputErrorCorrectionLevel() {
            return qrcodegen.QrCode.Ecc.MEDIUM;
		}
		
        // Get form inputs and compute QR Code
        var ecl = getInputErrorCorrectionLevel();

//placeholder for text
        //var text = document.getElementById("text-input").value;
        var text = "My Test String";
        
        var segs = qrcodegen.QrSegment.makeSegments(text);
        
// sets default for version		
        var minVer = 1
        var maxVer = 40
// sets default for mask. "-1" is automatic, 0-7 is manual control for mask pattern        
		var mask = -1

// sets defualt status of boosting the ECC to TRUE
        var boostEcc = true
		
        var qr = qrcodegen.QrCode.encodeSegments(segs, ecl, minVer, maxVer, mask, boostEcc);
		
		// Draw image output
		//var border = parseInt(document.getElementById("border-input").value, 10);
// set default border size		
        var border = (3)
                
        if (border < 0 || border > 100)
			return;
		if (bitmapOutput) {
// !!! set default scale (will be set with slider later )            
			//var scale = parseInt(document.getElementById("scale-input").value, 10);
			var scale = (10)
            
            if (scale <= 0 || scale > 30)
				return;
			qr.drawCanvas(scale, border, canvas);
			canvas.style.removeProperty("display");
		} else {
//            Does nothing
		}
		
		// Returns a string to describe the given list of segments.
		function describeSegments(segs) {
			if (segs.length == 0)
				return "none";
			else if (segs.length == 1) {
				var mode = segs[0].mode;
				var Mode = qrcodegen.QrSegment.Mode;
				if (mode == Mode.NUMERIC     )  return "numeric";
				if (mode == Mode.ALPHANUMERIC)  return "alphanumeric";
				if (mode == Mode.BYTE        )  return "byte";
				if (mode == Mode.KANJI       )  return "kanji";
				return "unknown";
			} else
				return "multiple";
		}
		
		// Returns the number of Unicode code points in the given UTF-16 string.
		function countUnicodeChars(str) {
			var result = 0;
			for (var i = 0; i < str.length; i++, result++) {
				var c = str.charCodeAt(i);
				if (c < 0xD800 || c >= 0xE000)
					continue;
				else if (0xD800 <= c && c < 0xDC00 && i + 1 < str.length) {  // High surrogate
					i++;
					var d = str.charCodeAt(i);
					if (0xDC00 <= d && d < 0xE000)  // Low surrogate
						continue;
				}
				throw "Invalid UTF-16 string";
			}
			return result;
		}
	}
	
	
	this.handleVersionMinMax = function(which) {
        var minElem = 1
        var maxElem = 40
		var minVal = parseInt(minElem.value, 10);
		var maxVal = parseInt(maxElem.value, 10);
		minVal = Math.max(Math.min(minVal, qrcodegen.QrCode.MAX_VERSION), qrcodegen.QrCode.MIN_VERSION);
		maxVal = Math.max(Math.min(maxVal, qrcodegen.QrCode.MAX_VERSION), qrcodegen.QrCode.MIN_VERSION);
		if (which == "min" && minVal > maxVal)
			maxVal = minVal;
		else if (which == "max" && maxVal < minVal)
			minVal = maxVal;
		minElem.value = minVal.toString();
		maxElem.value = maxVal.toString();
		redrawQrCode();
	}
	
	
	initialize();
}
