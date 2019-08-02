"use strict";

//import {validateVin} from './vin-generator.js';
//import * as lib from './vin-generator.js';
//var vinGenerate = require('./vin-generator.js');

var plainVIN = "";
var currentVIN = "";

function wrapVIN() {
    currentVIN = plainVIN;
    console.log("vin wrap called");
    redrawQrCode();
    return currentVIN;
}

function wrapURL() {
    currentVIN = "cpht.io/inv/" + plainVIN;
    console.log("url wrap called");
    redrawQrCode();
    return currentVIN;
}



function toggleCustomVIN() {
      var x = document.getElementById("randomVINdiv");
      var c = document.getElementById("customVINdiv")
      if (x.style.display === "flex") {
        x.style.display = "none";
        c.style.display = "flex"
      } else {
        x.style.display = "flex";
        c.style.display = "none";            
      }
}

function toggleCustomVINoff() {
    
    var x = document.getElementById("randomVINdiv");
    if (x.style.display == "none"){
        x.style.display = "flex";
        var c = document.getElementById("customVINdiv")
        c.style.display = "none"
    }
}

	
	function initialize() {
		var elems = document.querySelectorAll("input[type=number], textarea");
		for (var i = 0; i < elems.length; i++) {
			if (elems[i].id.indexOf("version-") != 0)
				elems[i].oninput = redrawQrCode;
		}
		elems = document.querySelectorAll("input[type=radio], input[type=checkbox]");
		for (var i = 0; i < elems.length; i++)
			elems[i].onchange = redrawQrCode;
                
        HTTPrequest();
        console.log("intializing");
//      randomVIN();        
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

////placeholder for text
//        //var text = document.getElementById("text-input").value;
//        var text = document.getElementById("randomVIN").innerHTML;
//        
//placeholder for text
        //var text = document.getElementById("text-input").value;
        var text = currentVIN;
        console.log("custom func text val " + text);
//        
        document.getElementById("QRcontents").innerHTML = text;
//        
        
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
        var border = (1)
                
        if (border < 0 || border > 100)
			return;
		if (bitmapOutput) {
// !!! set default scale (will be set with slider later )            
			//var scale = parseInt(document.getElementById("scale-input").value, 10);
            var sliderScaleValue = document.getElementById("sizeSlider").value;
            if (sliderScaleValue == 3) {
                sliderScaleValue = 9;
            } else if (sliderScaleValue == 1) {
                sliderScaleValue = 4;
            } else {
                sliderScaleValue = 7;
            }
            var scale = sliderScaleValue;
            if (scale <= 0 || scale > 30)
				return;
			qr.drawCanvas(scale, border, canvas);
			canvas.style.removeProperty("display");
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
	
    function randomVIN() {
        var vinTable = ["1G2WK52J23F117432","1D3HW42J47S174285","3FALP1280TR120909","3FDXF46F93MB65140","5HD1FR4197Y750994","2B3ED56F0PH615299", "1G4PP5SK4D4116575","5FNYF48899B029451","1GKGK26K17R269857","1B3ES47C8VD241443","1FDWK74P3MVA48097","1GKGR26J8KF563527","1GDJ7D1F1LV589931","1HD1BEK16BY026526","1GTEK24CXGF728299","1GTEC19C48Z151124","1FTRF12WX6KD18346","1HTMPAFN66H209973","1GTR1TEA5BZ214732","4T1BF1FK7DU575633","JYARJ18EX9A000892","WB1048806P0284362"]
        var tableLength = vinTable.length - 1;
        var i = Math.floor(Math.random() * tableLength);
        var wildVIN = vinTable[i];
        document.getElementById("randomVIN").innerHTML = wildVIN;
        currentVIN = wildVIN;
        plainVIN = wildVIN;
        redrawQrCode();
}

function HTTPrequest() {
    const Http = new XMLHttpRequest();
    const url='https://c2czfl4mzf.execute-api.us-east-1.amazonaws.com/test/randomVINgen';
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange =function(){
      if(this.readyState==4 && this.status==200){
        var heckYeah = Http.responseText; 
          console.log(heckYeah);  
      let parsedVIN = JSON.parse(heckYeah);
      parsedVIN = parsedVIN.body;
      parsedVIN = parsedVIN.replace(/['"]+/g, '');
      console.log(parsedVIN);
      var wildVIN = parsedVIN;
      document.getElementById("randomVIN").innerHTML = wildVIN;
      currentVIN = wildVIN;
      plainVIN = wildVIN;
      redrawQrCode();      
      }
        
    }

}

//function HTTPrequest() {
////    var param = {"long_url": "https://www.google.com/search?q=justatestms"};
//
//    const Http = new XMLHttpRequest();
//    const url='https://twv547c421.execute-api.us-east-1.amazonaws.com/test/create';
//    Http.open("POST", url);
//    Http.send('{"long_url": "https://www.google.com/search?q=justatestms"}');
//    Http.onreadystatechange =function(){
//      if(this.readyState==4 && this.status==200){
//        var heckYeah = Http.responseText; 
//          console.log(heckYeah);  
////      let parsedVIN = JSON.parse(heckYeah);
////      parsedVIN = parsedVIN.body;
////      parsedVIN = parsedVIN.replace(/['"]+/g, '');
////      console.log(parsedVIN);
////      var wildVIN = parsedVIN;
////      document.getElementById("randomVIN").innerHTML = wildVIN;
////      currentVIN = wildVIN;
////      plainVIN = wildVIN;
////      redrawQrCode();      
//      }
//        
//    }
//
//}


//helper function for PrintImage
    function ImagetoPrint(source) {
    return "<html><head><script>function step1(){\n" +
            "setTimeout('step2()', 10);}\n" +
            "function step2(){window.print();window.close()}\n" +
            "</scri" + "pt></head><body onload='step1()'>\n" +
            "<img src='" + source + "' /></body></html>";
            
    }
    
//The boi that does the printing
    function PrintImage() {
        var Pagelink = "about:blank";
        var pwa = window.open(Pagelink, "_new");
        pwa.document.open();
        pwa.document.write(ImagetoPrint(document.getElementById('qrcode-canvas').toDataURL("image/png")));
        pwa.document.close();
    }




    function customVIN() {
        var inputVin = document.getElementById("VINinput").value;
        console.log("the custom fucntion was called" + inputVin);
        currentVIN = inputVin;
        plainVIN = inputVin;
        redrawQrCode();
    }

    // vin
    // cpht.io/inv/{vin}
    // shurl.cphtest.net/t/{shortURL}
    
	
	initialize();








