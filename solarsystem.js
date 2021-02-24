
/* File: PlanetMaker.js */
/**
 * PlanetMaker JavaScript Library
 * http://planetmaker.wthr.us
 * 
 * Copyright 2013 Kevin M. Gill <kmsmgill@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */


if (!window.KMG) { window.KMG = {}; };
KMG.Util = {};


self.console = self.console || {

	info: function () {},
	log: function () {},
	debug: function () {},
	warn: function () {},
	error: function () {}

};

KMG.RAD_360 = 360 * (Math.PI / 180);
KMG.RAD_270 = 270 * (Math.PI / 180);
KMG.RAD_180 = 180 * (Math.PI / 180);
KMG.RAD_90 = 90 * (Math.PI / 180);
KMG.RAD_45 = 45 * (Math.PI / 180);
KMG.AU_TO_KM = 149597870.700;
KMG.PI_BY_180 = (Math.PI / 180);
KMG._180_BY_PI = (180 / Math.PI);


/* File: Math.js */
KMG.Math = {};


KMG.Math.sinh = function(a) {
	return (Math.exp(a) - Math.exp(-a)) / 2;
}

KMG.Math.cosh = function(a) {
	return (Math.pow(Math.E, a) + Math.pow(Math.E, -a)) / 2;
}

KMG.Math.sign = function(a) {
	return (a >= 0.0) ? 1 : -1;
}

KMG.Math.radians = function(d) {
	return d * (Math.PI / 180);
}

KMG.Math.degrees = function(r) {
	return r * (180 / Math.PI);
}

KMG.Math.sqr = function(v) {
	return v * v;
};

KMG.Math.clamp = function(v, within) {
	if (!within) {
		within = 360;
	}
	return v - within * Math.floor(v / within);
};




KMG.Math.dsin = function(v) {
	return Math.sin(v * Math.PI / 180);
};

KMG.Math.dcos = function(v) {
	return Math.cos(v * Math.PI / 180);
};

KMG.Math.dtan = function(v) {
	return Math.tan(v * Math.PI / 180);
};


KMG.Math.dasin = function(v) {
	return Math.asin(v) * 180 / Math.PI;
};

KMG.Math.dacos = function(v) {
	return Math.acos(v) * 180 / Math.PI;
};

KMG.Math.datan2 = function(y, x) {
	return Math.atan2(y, x) * 180 / Math.PI;
};

KMG.Math.datan = function(v) {
	return KMG.Math.dasin(v / Math.sqrt(Math.pow(v, 2) + 1));
};

KMG.Math.degToRad = function(v) {
	return v * KMG.PI_BY_180;
};

KMG.Math.radToDeg = function(v) {
	return v * KMG._180_BY_PI;
};

KMG.Math.round = function(v, factor) {
	if (!factor) {
		factor = 1000;
	}
	
	return Math.floor(v * factor) / factor;
};

KMG.Math.trimTo360Radians = function(x) {	
	if( x > 0.0 ) {
		while( x > KMG.RAD_360 )
			x = x-KMG.RAD_360;
	} else {
		while( x< 0.0 )
			x =x+ KMG.RAD_360;
	}
	return x;
}

KMG.Math.trimTo360 = function(x) {	
	if( x > 0.0 ) {
		while( x > 360.0 )
			x = x-360.0;
	} else {
		while( x< 0.0 )
			x =x+ 360.0;
	}
	return x;
}


KMG.Math.fixThetaDegrees = function(degrees){
	var limited;
    degrees /= 360.0;
    limited = 360.0 * (degrees - Math.floor(degrees));
    if (limited < 0)
		limited += 360.0;
	return limited;
}
        
KMG.Math.fixPhiDegrees = function(degrees) {
	degrees += 90.0;
	var limited;
	degrees /= 180.0;
	limited = 180.0 * (degrees - Math.floor(degrees));
	if (limited < 0)
			limited += 180.0;
	return limited - 90.0;
}




KMG.Math.getPoint3D = function(theta, // Longitude, in degrees
                               phi, // Latitude, in degrees
                               radius) {

	//theta += 90.0;
	theta = KMG.Math.fixThetaDegrees(theta) * KMG.PI_BY_180;
    phi = KMG.Math.fixPhiDegrees(phi) * KMG.PI_BY_180;

                
	var _y = Math.sqrt(KMG.Math.sqr(radius) - KMG.Math.sqr(radius * Math.cos(phi)));
    var r0 = Math.sqrt(KMG.Math.sqr(radius) - KMG.Math.sqr(_y));

    var _b = r0 * Math.cos(theta );
    var _z = Math.sqrt(KMG.Math.sqr(r0) - KMG.Math.sqr(_b));
    var _x = Math.sqrt(KMG.Math.sqr(r0) - KMG.Math.sqr(_z));

                
    if (theta <= KMG.RAD_90) {
		_z *= -1.0;
	} else if (theta  <= KMG.RAD_180) {
		_x *= -1.0;
		_z *= -1.0;
	} else if (theta  <= KMG.RAD_270) {
		_x *= -1.0;
	}

	if (phi >= 0) { 
		_y = Math.abs(_y);
	} else {
		_y = Math.abs(_y) * -1;
	}
	return new THREE.Vector3(_x, _y, _z);
}


// http://www.mathworks.com/help/aeroblks/radiusatgeocentriclatitude.html
KMG.Math.radiusAtGeocentricLatitude = function(equatorialRadius, latitude, flattening) {
	
	var R = equatorialRadius;
	var l = latitude;
	var f = flattening;
	
	var r = Math.sqrt(KMG.Math.sqr(R, 2) / (1 + (1 / KMG.Math.sqr(1 - f) - 1) * KMG.Math.sqr(Math.sin(l))));
	return r;
};





/* File: Util.js */

KMG.Util = {};

KMG.Util.isUserMobile = function()
{
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
}

KMG.Util.cardinalDirectionByValue = function(value, ifPos, ifNeg) {
	return (value >= 0) ? ifPos : ifNeg;
}

KMG.Util.formatDegrees = function(value, ifPos, ifNeg) {
	
	value = KMG.Math.round(value, 1000);
	
	var fmt = Math.abs(value) + "&deg;";
	if (ifPos && ifNeg) {
		fmt += KMG.Util.cardinalDirectionByValue(value, ifPos, ifNeg);
	}
	return fmt;
}

KMG.Util.formatDegreesToHours = function(value, ifPos, ifNeg) {
	
	var h = Math.floor(Math.abs(value));
	var m = Math.floor((Math.abs(value) - h) * 60);
	var s = KMG.Math.round(((Math.abs(value) - h) * 60 - m) * 60, 100);
	
	if (h < 10) {
		h = "0" + h;
	}
	
	if (m < 10) {
		m = "0" + m;
	}
	
	var fmt = h + "h " + m + "m " + s + "s";
	if (ifPos && ifNeg) {
		fmt += KMG.Util.cardinalDirectionByValue(value, ifPos, ifNeg);
	}
	return fmt;
}

KMG.Util.formatDegreesToMinutes = function(value, ifPos, ifNeg, skipSeconds) {
	
	var d = Math.floor(Math.abs(value));
	var m = Math.floor((Math.abs(value) - d) * 60);
	var s = KMG.Math.round(((Math.abs(value) - d) * 60 - m) * 60, 100);
	
	var sign = (value < 0) ? "-" : " ";
	
	var fmt = sign + d + "&deg; " + m + "\' " + ((!skipSeconds) ? (s + "\"") : "");
	if (ifPos && ifNeg) {
		fmt += KMG.Util.cardinalDirectionByValue(value, ifPos, ifNeg);
	}
	return fmt;
}


KMG.Util.intensityToWhiteColor = function(intensity)
{
	intensity = parseInt(intensity);
	var rgb = "rgb("+intensity+","+intensity+","+intensity+")";
	return new THREE.Color(rgb);
};

KMG.Util.arrayToColor = function(array)
{
	var r = parseInt(array[0]);
	var g = parseInt(array[1]);
	var b = parseInt(array[2]);
	var a = (array.length >= 4) ? parseInt(array[3]) : 255.0;
	var rgb = "rgb("+r+","+g+","+b+")";
	return new THREE.Color(rgb);
};

KMG.Util.rgbToArray = function(rgb)
{
	var c = new THREE.Color(rgb);
	return new THREE.Vector3(c.r, c.g, c.b);
}


KMG.Util.eyePosition = function(context)
{
	return context.camera.position;
};
	
KMG.Util.eyeDistanceToCenter = function(context)
{
	return context.primaryScene.position.distanceTo(KMG.Util.eyePosition(context));
};
	
KMG.Util.surfaceDistance = function(context, radius)
{
	return KMG.Util.eyeDistanceToCenter(context) - radius;
};


//farClipDistance
KMG.Util.horizonDistance = function(context, radius)
{
	var r = radius;
	var e = KMG.Util.surfaceDistance(context, radius);
	var f = Math.sqrt(e * (2 * r + e));
	return f;
};

// TODO: Strengthen this...
KMG.Util.clone = function(object) 
{
	if (typeof object !== "object") {
		return object;
	}

	var cloned;
	
	if (object instanceof Array) {
		cloned = new Array();
		for (var i = 0; i < object.length; i++) {
			cloned.push(KMG.Util.clone(object[i]));
		}
	} else {
		cloned = {};
		for(var key in object) {
			cloned[key] = KMG.Util.clone(object[key]);
		};
	}
	
	return cloned;
};

// TODO: Strengthen this...
KMG.Util.extend = function(target, source) {

	//var extended = KMG.Util.clone(target);
	var extended = target;
	for(var key in source) {
		if (key === "displayClouds") {
			var snoofle;
		}
		if (extended[key] === undefined) {
			extended[key] = KMG.Util.clone(source[key]);
		}
		
		if (extended[key] && typeof extended[key] === "object") {
			extended[key] = KMG.Util.extend(extended[key], source[key]);
		}
	
	}
	
	return extended;
};

//http://stackoverflow.com/questions/1714786/querystring-encoding-of-a-javascript-object
KMG.Util.serialize = function(obj, prefix) {
	var str = [];
	for(var p in obj) {
		var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
		str.push(typeof v == "object" ? KMG.Util.serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
	}
	return str.join("&");
};

/*
KMG.Util.getTimezoneOffset = function() {
	return (new Date()).getTimezoneOffset() * 1000;
};

KMG.Util.getTimezoneOffsetJulians = function() {
	return (new Date()).getTimezoneOffset() / 60 / 24;
};
*/


KMG.Util.replaceWithGreekLetters = function(str) {
	
	str = str.replace(/alpha/g, 'α');
	str = str.replace(/beta/g, 'β');
	
	str = str.replace(/gamma/g, 'γ');
	str = str.replace(/delta/g, 'δ');
	str = str.replace(/epsilon/g, 'ε');
	str = str.replace(/zeta/g, 'ζ');
	str = str.replace(/eta/g, 'η');
	str = str.replace(/theta/g, 'θ');
	str = str.replace(/iota/g, 'ι');
	str = str.replace(/kappa/g, 'κ');
	str = str.replace(/lambda/g, 'λ');
	str = str.replace(/mu/g, 'μ');
	str = str.replace(/nu/g, 'ν');
	str = str.replace(/xi/g, 'ξ');
	str = str.replace(/omicron/g, 'ο');
	str = str.replace(/pi/g, 'π');
	str = str.replace(/rho/g, 'ρ');
	str = str.replace(/sigma/g, 'σ');
	str = str.replace(/tau/g, 'τ');
	str = str.replace(/upsilon/g, 'υ');
	str = str.replace(/phi/g, 'φ');
	str = str.replace(/chi/g, 'χ');
	str = str.replace(/psi/g, 'ψ');
	str = str.replace(/omega/g, 'ω');
	
	
	
	return str;
};

KMG.Util.replaceWithGreekLettersAbbreviated = function(str) {
	
	str = str.replace(/Alp/g, 'α');
	str = str.replace(/Bet/g, 'β');
	
	str = str.replace(/Gam/g, 'γ');
	str = str.replace(/Del/g, 'δ');
	str = str.replace(/Eps/g, 'ε');
	str = str.replace(/Zet/g, 'ζ');
	str = str.replace(/Eta/g, 'η');
	str = str.replace(/The/g, 'θ');
	str = str.replace(/Iot/g, 'ι');
	str = str.replace(/Kap/g, 'κ');
	str = str.replace(/Lam/g, 'λ');
	str = str.replace(/Mu/g, 'μ');
	str = str.replace(/Nu/g, 'ν');
	str = str.replace(/Xi/g, 'ξ');
	str = str.replace(/Omi/g, 'ο');
	str = str.replace(/Pi/g, 'π');
	str = str.replace(/Rho/g, 'ρ');
	str = str.replace(/Sig/g, 'σ');
	str = str.replace(/Tau/g, 'τ');
	str = str.replace(/Ups/g, 'υ');
	str = str.replace(/Phi/g, 'φ');
	str = str.replace(/Chi/g, 'χ');
	str = str.replace(/Psi/g, 'ψ');
	str = str.replace(/Ome/g, 'ω');
	
	
	
	return str;
};

/** A best-effort attempt to convert a string to an intended data type when the intended type may not be known.
 * Returns the supplied parameter as-is if the type cannot be determined as anything other than a string.
 * 
 */ 
KMG.Util.stringToDataType = function(v) {
	if (/^true$/.test(v))
		return true;
	else if (/^false$/.test(v))
		return false;
	else if (/^-?\d+\.?\d*$/.test(v)) 
		return parseFloat(v);
	else if (/\,/.test(v)) {
		var a = v.split(",");
		var list = [];
		for (var i = 0; i < a.length; i++) {
			list.push(KMG.Util.stringToDataType(a[i]));
		}
		return list;
	} else {
		v = v.replace(/%20/g, " ");
		return v;
	}
}

/* File: tle.js */


KMG.tle = {};

KMG.tle.parseTle = function(tleString) {
	
	var data = {};
	
	var lines = tleString.split("\n");
	if (lines.length < 2 || lines.length > 3) {
		throw "Invalid TLE";
	}
	
	data.name = (lines.length == 3) ? lines[0] : "foo";
	var tleLine1 = (lines.length == 3) ? lines[1] : lines[0];
	var tleLine2 = (lines.length == 3) ? lines[2] : lines[1];
	
	KMG.tle.parseTleLine1(tleLine1, data);
	KMG.tle.parseTleLine2(tleLine2, data);
	KMG.tle.computeAdditionalData(data);
	
	return data;
}

KMG.tle.computeAdditionalData = function(data) {
	data.epochStart = KMG.tle.dayNumberTle(2000 + data.epochYear, data.epochDay);
	data.epochNow = KMG.tle.dayNumberNow();
	data.epoch = data.epochStart + 2451545 - 1.5;
	data.periodHours = (1440/((1*data.meanMotion)+(data.derivativeOfMeanMotion*(data.epochNow-data.epochStart )))) /60;
	data.semiMajorAxis = Math.pow((6028.9* (data.periodHours*60)), 2.0 / 3.0) / 149597870.700;
	data.period = data.periodHours / 24;
	data.longitudeOfPerihelion = 0;
}

KMG.tle.parseTleLine1 = function(tleLine1, data) {

	data.satelliteNumber = tleLine1.substring(2, 7);
	data.classification = tleLine1.substring(7, 8);
	data.internationalDesignator = tleLine1.substring(9, 17);
	data.launchYear = data.internationalDesignator.substring(0, 2);
	data.launchNumberForYear = data.internationalDesignator.substring(2, 5);
	data.launchPieceNumber = data.internationalDesignator.substring(5, 8);
	data.epochYear = parseFloat(tleLine1.substring(18, 20));
	data.epochDay = parseFloat(tleLine1.substring(20, 32));
	data.derivativeOfMeanMotion = parseFloat(tleLine1.substring(33, 43)); // first_derative_mean_motion
	data.dragTerm = parseFloat("0." + tleLine1.substring(53, 61)); // Is fractional, prefix with 0.
	data.ephemerisType = tleLine1.substring(62, 63);
	data.elementNumber = tleLine1.substring(64, 68);
	data.checksum = tleLine1.substring(68, 69);
}

KMG.tle.parseTleLine2 = function(tleLine2, data) {

	data.inclination = parseFloat(tleLine2.substring(8, 16));
	data.rightAscension = parseFloat(tleLine2.substring(17, 25)); // of the ascending node
	data.ascendingNode = data.rightAscension;
	data.eccentricity = parseFloat("0." + tleLine2.substring(26, 33)); // Is fractional, prefix with 0.
	data.argOfPeriapsis = parseFloat(tleLine2.substring(34, 42));
	data.meanAnomalyAtEpoch = parseFloat(tleLine2.substring(43, 51));
	data.meanMotion = parseFloat(tleLine2.substring(52, 63));
	data.revolutionNumber = tleLine2.substring(63, 68);

}

KMG.tle.div = function(a, b) {
	return ((a - a % b) / b);
}

KMG.tle.dayNumber = function(dd,mm,yyyy,hh,min,sec) {
	var d=367.0*yyyy - KMG.tle.div(  (7.0*(yyyy+(KMG.tle.div((mm+9.0),12.0)))),4.0 ) + KMG.tle.div((275.0*mm),9.0) + dd - 730530.0 ;
	d=d+ hh/24.0 + min/(60.0*24.0) + sec/(24.0*60.0*60.0);
	return d;
}

KMG.tle.dayNumberTle = function(year, day) {
	var d = KMG.tle.dayNumber(1,1,year,0,0,0)+day-1;
	return d
}

KMG.tle.dayNumberNow = function() {
	var dt = new Date();
	return KMG.tle.dayNumber(dt.getUTCDate(), dt.getUTCMonth() + 1, dt.getUTCFullYear(), dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds());
}

/*

var tle0 = "2015-020D  \n" +              
"1 40555U 15020D   15092.11961771  .00000009  00000-0  00000+0 0  9995\n" + 
"2 40555  82.4855  61.9592 0216449 266.9285  90.7024 12.80861395   194";


console.log(tle0);
var data = KMG.tle.parseTle(tle0, KMG.tle.THREE_LINE);
console.log(data);
*/

/* File: AstroDate.js */

KMG.J2000 = 2451545.0;
KMG.J1900 = 2415020.0;

KMG.AstroDate = function(millis, jd, epoch) {
	
	if (!epoch) {
		epoch = KMG.J2000;
	}
	
	if (!millis && !jd) {
		jd = KMG.Util.julianNow();
	}
	
	if (millis != undefined && millis != null) {
		jd = KMG.Util.millisToJulian(millis);
	}
	
	// Julian day overrides millis
	if (jd != undefined && jd != null) {
		millis = KMG.Util.julianToDate(jd).getTime();
	}

	function getMillis() {
		return millis;
	}
	
	function getJulianDay() {
		return jd;
	}
	
	function getJulianCentury(_epoch) {
		if (!_epoch) {
			_epoch = epoch;
		}
		return (jd - _epoch) / 36525.0;
	}
	
	function getDayNumberNow() {
		return KMG.Astro.getDayNumberNow();
	}
	
	function getDayNumber(_jd) {
		if (!_jd) {
			_jd = jd;
		}
		return KMG.Astro.getDayNumber(_jd);
	}
	
	function getGMST(clampTo) {
		return KMG.Astro.getGMST(jd, clampTo);
	}
	
	function getLMST(lon) {
		return KMG.Astro.getLMST(jd, lon);
	}
	
	//http://www.satellite-calculations.com/TLETracker/scripts/tletracker.online.sat.calc
	function getGMST2(lon, _jd) {
		if (!_jd) {
			_jd = jd;
		}
		return KMG.Astro.getGMST2(lon, _jd);
	}
	
	function getDate(_jd) {
		if (!_jd) {
			_jd = jd;
		}
		return KMG.Util.julianToDate(_jd);
	}
	
	function getDayOfYear() {
		return KMG.Astro.getDayOfYear(jd);
	}
	
	function toString(format) {
		var d = getDate();
		return d.toString();
	}
		
	function toJSON() {
		return {
			millis : millis,
			jd : jd,
			date : toString() + " UTC"
		};
	}
	return {
		getMillis : getMillis,
		getJulianDay : getJulianDay,
		getGMST : getGMST,
		getLMST : getLMST,
		getGMST2 : getGMST2,
		getJulianCentury : getJulianCentury,
		getDayOfYear : getDayOfYear,
		getDayNumberNow : getDayNumberNow,
		getDayNumber : getDayNumber,
		getDate : getDate,
		toString : toString,
		toJSON : toJSON
	
	};
	
};
/* File: Astronomy.js */
/**
 * Astronomy Algorithms
 * http://www.apoapsys.com
 * 
 * Copyright 2014 Kevin M. Gill <kmsmgill@gmail.com>
 *
 * Uses algorithms from:
 *
 * 
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

KMG.Astro = {};
 
KMG.Astro.J2000 = 2451545.0;
KMG.Astro.J1900 = 2415020.0;
 
// http://www.csgnetwork.com/juliangregcalconv.html
KMG.Astro.julianToDate = function(jd) {
	var _jd = jd;
		
	jd += 0.5;
	var z = Math.floor(jd);
	var f = jd - z;
	if (z < 2299161) {
		var A = z;
	} else {
		var omega = Math.floor((z-1867216.25)/36524.25);
		var A = z + 1 + omega - Math.floor(omega/4);
	}
	var B = A + 1524;
	var C = Math.floor((B-122.1)/365.25);
	var D = Math.floor(365.25*C);
	var Epsilon = Math.floor((B-D)/30.6001);
	var dayGreg = B - D - Math.floor(30.6001*Epsilon) + f;
	var monthGreg, yearGreg;
	if (Epsilon < 14) {
		monthGreg = Epsilon - 1;
	} else {
		monthGreg = Epsilon - 13;
	}
	if (monthGreg > 2) {
		yearGreg = C - 4716;
	} else {
		yearGreg = C - 4715;
	}
	
	var year = yearGreg;
	var month = monthGreg;
	var day = Math.floor(dayGreg);
	
	var dayMinutes = ((dayGreg - day) * 1440.0);
	var hour = Math.floor(dayMinutes / 60.0);
	var minute = Math.floor(dayMinutes - (hour * 60.0));
	var second = Math.floor(60.0 * (dayMinutes - (hour * 60.0) -minute));
	var millisecond =  (1000.0 * (60.0 * (dayMinutes - (hour * 60.0) -minute)- second) );
	
	return new Date(year, month - 1, day, hour, minute, second, millisecond);
};
KMG.Util.julianToDate = KMG.Astro.julianToDate;

// http://www.csgnetwork.com/juliandatetime.html
KMG.Astro.dateToJulian = function(year, month, day, hour, minute, second, millisecond, tz) {

	/*
	var extra = 100.0*year + month - 190002.5;
	var rjd = 367.0*year;
	rjd -= Math.floor(7.0*(year+Math.floor((month+9.0)/12.0))/4.0);
	rjd += Math.floor(275.0*month/9.0) ;
	rjd += day;
	rjd += (hour + (minute + second/60.0)/60.)/24.0;
	rjd += 1721013.5;
	rjd -= 0.5*extra/Math.abs(extra);
	rjd += 0.5;
	
	return rjd;*/
	if (!tz) {
		tz = 0;
	}
	if (!millisecond) {
		millisecond = 0;
	}
	var day_decimal, julian_day, a;

	day_decimal = day + (hour - tz + (minute + second / 60.0 + millisecond / 1000 / 60) / 60.0) / 24.0;

	if (month < 3) {
		month += 12;
		year--;
	}

	julian_day = Math.floor(365.25 * (year + 4716.0)) + Math.floor(30.6001 * (month + 1)) + day_decimal - 1524.5;
	if (julian_day > 2299160.0) {
		a = Math.floor(year / 100);
		julian_day += (2 - a + Math.floor(a / 4));
	}
	
	return julian_day;
};
KMG.Util.dateToJulian = KMG.Astro.dateToJulian;

KMG.Astro.millisToJulian = function(millis) {
	var d = new Date(millis);
	var jd =  KMG.Util.dateToJulian(d.getFullYear(),
							d.getMonth() + 1,
							d.getDate(),
							d.getHours(),
							d.getMinutes(),
							d.getSeconds(),
							d.getMilliseconds());
	return jd;
};
KMG.Util.millisToJulian = KMG.Astro.millisToJulian;

KMG.Astro.julianNow = function() {
	var d = new Date();
	return KMG.Util.dateToJulian(d.getUTCFullYear(),
						d.getUTCMonth() + 1,
						d.getUTCDate(),
						d.getUTCHours(),
						d.getUTCMinutes(),
						d.getUTCSeconds(),
						d.getUTCMilliseconds());
	
}
KMG.Util.julianNow = KMG.Astro.julianNow;

KMG.Astro.formatJulianDay = function(jd, isUtc, format) {
	if (!format) {
		format = "LLL";
	}
	var dt = KMG.Util.julianToDate(jd);
	if (isUtc) 
		return moment(dt).format(format);
	else 
		return moment(dt).utc().format(format);
};
KMG.Util.formatJulianDay = KMG.Astro.formatJulianDay;




KMG.Astro.convertCartesianEquatorialToEcliptic = function(equatorial) {
	var e = 23.4 * KMG.PI_BY_180;
	
	var m = new THREE.Matrix3();
	m.set(1, 0, 0, 
		  0, Math.cos(e), Math.sin(e), 
		  0, -Math.sin(e), Math.cos(e));
	
	var ecliptic = equatorial.clone().applyMatrix3(m);
	return ecliptic;
};
KMG.Math.convertCartesianEquatorialToEcliptic = KMG.Astro.convertCartesianEquatorialToEcliptic;



// Duffet-Smith, Peter: Practical Astronomy with Your Calculator, page 42
KMG.Astro.convertEquatorialToEcliptic = function(ra, dec) {
	var e = 23.4;
	
	var Y = KMG.Math.dsin(ra) * KMG.Math.dcos(e) + KMG.Math.dtan(dec) * KMG.Math.dsin(e);
	var X = KMG.Math.dcos(ra);
	
	var l = KMG.Math.datan2(Y, X);
	var b = KMG.Math.dasin(KMG.Math.dsin(dec) * KMG.Math.dcos(e) - KMG.Math.dcos(dec) * KMG.Math.dsin(e) * KMG.Math.dsin(ra));
	
	return {
		l : l,
		b : b
	};
};
KMG.Math.convertEquatorialToEcliptic = KMG.Astro.convertEquatorialToEcliptic;

// Adapted from Celestia customorbits.cpp:
// static double Obliquity(double t)
KMG.Astro.obliquity = function(t)
{
    // Parameter t represents the Julian centuries elapsed since 1900.
    // In other words, t = (jd - 2415020.0) / 36525.0

    return (2.345229444E1 - ((((-1.81E-3*t)+5.9E-3)*t+4.6845E1)*t)/3600.0) * KMG.PI_BY_180;
}
KMG.Math.obliquity = KMG.Astro.obliquity;

// Adapted from Celestia customorbits.cpp:
// static void Nutation(double t, double &deps, double& dpsi)
KMG.Astro.nutation = function(t)
{
    // Parameter t represents the Julian centuries elapsed since 1900.
    // In other words, t = (jd - 2415020.0) / 36525.0

    var ls, ld;	// sun's mean longitude, moon's mean longitude
    var ms, md;	// sun's mean anomaly, moon's mean anomaly
    var nm;	    // longitude of moon's ascending node
    var t2;
    var tls, tnm, tld;	// twice above
    var a, b;

    t2 = t*t;

    a = 100.0021358*t;
    b = 360.*(a-Math.floor(a));
    ls = 279.697+.000303*t2+b;

    a = 1336.855231*t;
    b = 360.*(a-Math.floor(a));
    ld = 270.434-.001133*t2+b;

    a = 99.99736056000026*t;
    b = 360.*(a-Math.floor(a));
    ms = 358.476-.00015*t2+b;

    a = 13255523.59*t;
    b = 360.*(a-Math.floor(a));
    md = 296.105+.009192*t2+b;

    a = 5.372616667*t;
    b = 360.*(a-Math.floor(a));
    nm = 259.183+.002078*t2-b;

    //convert to radian forms for use with trig functions.
    tls = 2*KMG.Math.degToRad(ls);
    nm = KMG.Math.degToRad(nm);
    tnm = 2*KMG.Math.degToRad(nm);
    ms = KMG.Math.degToRad(ms);
    tld = 2*KMG.Math.degToRad(ld);
    md = KMG.Math.degToRad(md);

    // find delta psi and eps, in arcseconds.
    var dpsi = (-17.2327-.01737*t)*Math.sin(nm)+(-1.2729-.00013*t)*Math.sin(tls)
        +.2088*Math.sin(tnm)-.2037*Math.sin(tld)+(.1261-.00031*t)*Math.sin(ms)
        +.0675*Math.sin(md)-(.0497-.00012*t)*Math.sin(tls+ms)
        -.0342*Math.sin(tld-nm)-.0261*Math.sin(tld+md)+.0214*Math.sin(tls-ms)
        -.0149*Math.sin(tls-tld+md)+.0124*Math.sin(tls-nm)+.0114*Math.sin(tld-md);
    var deps = (9.21+.00091*t)*Math.cos(nm)+(.5522-.00029*t)*Math.cos(tls)
        -.0904*Math.cos(tnm)+.0884*Math.cos(tld)+.0216*Math.cos(tls+ms)
        +.0183*Math.cos(tld-nm)+.0113*Math.cos(tld+md)-.0093*Math.cos(tls-ms)
        -.0066*Math.cos(tls-nm);

    // convert to radians.
    dpsi = (dpsi/3600) * KMG.PI_BY_180;
    deps = (deps/3600) * KMG.PI_BY_180;
    
    //double &deps, double& dpsi
    return {
		deps : deps,
		dpsi : dpsi
	};
}
KMG.Math.nutation = KMG.Astro.nutation;


// Adapted from Celestia customorbits.cpp:
// static void EclipticToEquatorial(double t, double fEclLat, double fEclLon,
//                                 double& RA, double& dec) 
KMG.Astro.convertEclipticToEquatorial = function(jd, fEclLat, fEclLon)
{
    // Parameter t represents the Julian centuries elapsed since 1900.
    // In other words, t = (jd - 2415020.0) / 36525.0

    var seps, ceps;	// sin and cos of mean obliquity
    var sx, cx, sy, cy, ty;
    var eps;
	var dec, ra;
	
	
	var t = (jd - 2415020.0) / 36525.0;
   // t = (2451545.0 - 2415020.0) / 36525.0;
   // t = 0;
    eps = KMG.Math.obliquity(t);		// mean obliquity for date
    var nut = KMG.Math.nutation(t);
    var deps = nut.deps;
    var dpsi = nut.dpsi;
    
    eps += deps;
    seps = Math.sin(eps);
    ceps = Math.cos(eps);

    sy = Math.sin(fEclLat);
    cy = Math.cos(fEclLat);				// always non-negative
    if (Math.abs(cy)<1e-20)
        cy = 1e-20;		// insure > 0
    ty = sy/cy;
    cx = Math.cos(fEclLon);
    sx = Math.sin(fEclLon);
    dec = Math.asin((sy*ceps)+(cy*seps*sx));
    
  //  ra = Math.atan(((sx*ceps)-(ty*seps))/cx);
	ra = Math.atan2(((sx*ceps)-(ty*seps)), cx);
    //if (cx<0)
   //     ra += Math.PI;		// account for atan quad ambiguity
	ra = KMG.Math.clamp(ra, 2 * Math.PI);
    
    
    return {
		ra : ra,
		dec : dec
	};
};
KMG.Math.convertEclipticToEquatorial = KMG.Astro.convertEclipticToEquatorial;

// Convert equatorial coordinates from one epoch to another.  Method is from
// Chapter 21 of Meeus's _Astronomical Algorithms_
// Actuall adapted from Celestia customorbits.cpp:
//void EpochConvert(double jdFrom, double jdTo,
//                  double a0, double d0,
//                  double& a, double& d)
KMG.Astro.epochConvert = function(jdFrom, jdTo, a0, d0)
{
	var a, d;
	
    var T = (jdFrom - 2451545.0) / 36525.0;
    var t = (jdTo - jdFrom) / 36525.0;

    var zeta = (2306.2181 + 1.39656 * T - 0.000139 * T * T) * t +
        (0.30188 - 0.000344 * T) * t * t + 0.017998 * t * t * t;
    var z = (2306.2181 + 1.39656 * T - 0.000139 * T * T) * t +
        (1.09468 + 0.000066 * T) * t * t + 0.018203 * t * t * t;
    var theta = (2004.3109 - 0.85330 * T - 0.000217 * T * T) * t -
        (0.42665 + 0.000217 * T) * t * t - 0.041833 * t * t * t;
    zeta  = KMG.Math.degToRad(zeta / 3600.0);
    z     = KMG.Math.degToRad(z / 3600.0);
    theta = KMG.Math.degToRad(theta / 3600.0);

    var A = Math.cos(d0) * Math.sin(a0 + zeta);
    var B = Math.cos(theta) * Math.cos(d0) * Math.cos(a0 + zeta) -
        Math.sin(theta) * Math.sin(d0);
    var C = Math.sin(theta) * Math.cos(d0) * Math.cos(a0 + zeta) +
        Math.cos(theta) * Math.sin(d0);

    a = Math.atan2(A, B) + z;
    d = Math.asin(C);
    
    return {
		ra : a,
		dec : d
	};
};
KMG.Math.epochConvert = KMG.Astro.epochConvert;



//http://www.satellite-calculations.com/TLETracker/scripts/tletracker.online.sat.calc
KMG.Astro.getGMST2 = function(lon, _jd) {
	if (!lon) {
		lon = 0.0; // Handle null or undefined
	}
	if (!_jd) {
		_jd = KMG.Astro.julianNow();
	}
	
	var dt = KMG.Astro.julianToDate(_jd);
	var day = dt.getDate();
	var month = dt.getMonth() + 1;
	var year = dt.getFullYear();
	var hour = dt.getHours();
	var minute  = dt.getMinutes();
	var second = dt.getSeconds();
	var ms = dt.getMilliseconds();
	if( month == 1 || month == 2 )
	{
	year = year - 1;
	month = month + 12;
	}

	var a = Math.floor( year/100 );
	var b = 2 - a + Math.floor( a/4 );

	var c = Math.floor(365.25 * year);
	var d = Math.floor(30.6001 * (month + 1));

	// days since J2000.0   
	var jd = b + c + d - 730550.5 + day + (hour + minute/60.0 + second/3600.0)/24.0;
	
	var jt   = (jd)/36525.0;                   // julian centuries since J2000.0         
	var GMST = 280.46061837 + 360.98564736629*jd + 0.000387933*jt*jt - jt*jt*jt/38710000 + lon;           
	if( GMST > 0.0 )
	{
		while( GMST > 360.0 )
			GMST -= 360.0;
	}
	else
	{
		while( GMST < 0.0 )
			GMST += 360.0;
	}
		
	return GMST;
};


KMG.Astro.div = function(a, b) {
	return ((a-a%b)/b);
};


KMG.Astro.getDayNumber = function(_jd) {
	var dt = KMG.Astro.julianToDate(_jd);
	var dd = dt.getDate();
	var mm = dt.getMonth() + 1;
	var yyyy = dt.getFullYear();
	var hh = dt.getHours();
	var min  = dt.getMinutes();
	var sec = dt.getSeconds();
	var ms = dt.getMilliseconds();

	var d=367.0*yyyy - KMG.Astro.div(  (7.0*(yyyy+(KMG.Astro.div((mm+9.0),12.0)))),4.0 ) + KMG.Astro.div((275.0*mm),9.0) + dd - 730530.0 ;
	d=d+ hh/24.0 + min/(60.0*24.0) + sec/(24.0*60.0*60.0);

	return d;
};

KMG.Astro.getDayNumberNow = function() {
	return KMG.Astro.getDayNumber(KMG.Astro.julianNow());
};


KMG.Astro.getGMST = function(jd, clampTo) {
	if (!clampTo) {
		clampTo = 24;
	}
	var jd0 = Math.floor(jd + 0.5) - .5;
	var H = (jd - jd0) * 24;
	var D = jd - 2451545.0;
	var D0 = jd0 - 2451545.0;
	var T = D / 36525.0;
	var gmst = (6.697374558 + 0.06570982441908 * D0 + 1.00273790935 * H + 0.000026 * Math.pow(T, 2));
	gmst = KMG.Math.clamp(gmst, clampTo);
	return gmst;
};

KMG.Astro.getLMST = function(jd, lon) {
	var gst = KMG.Astro.getGMST(jd);
	return gst + (lon / 15);
};

KMG.Astro.getDayOfYear = function(jd) {
	var date = KMG.Astro.julianToDate(jd);
	var start = new Date(date.getFullYear(), 0, 0);
	var diff = date - start;
	var oneDay = 1000 * 60 * 60 * 24;
	var day = Math.floor(diff / oneDay);
	return day;
};


KMG.Astro.vectorToHeliocentricLatitudeLongitude = function(vec, skipRotation) {
	/* Opposite of
	var x = Math.cos(l) * Math.sin(b) * r;
	var y = Math.cos(b) * r;
	var z = -Math.sin(l) * Math.sin(b) * r;
	*/
	
	var x, y, z;

	x = vec.x;
	y = vec.y;
	z = vec.z;
	
	var r = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2) + Math.pow(vec.z, 2));
	b = Math.abs(Math.acos(y / r)) * ((z < 0) ? -1 : 1);
	l = 2 * Math.PI - Math.acos((vec.x * (1 / Math.sin(b))) / r); 

	var rotB = (skipRotation) ? 0 : Math.PI / 2;
	var rotL = (skipRotation) ? 0 : -Math.PI;
	
	return {
		 r : r,
		 b : (b + rotB) * KMG._180_BY_PI,
		 l : (l + rotL) * KMG._180_BY_PI,
	 };
	
};



KMG.Astro.calculatePositionVector = function(date, orbit) {
	var position = orbit.positionAtTime(date.getJulianDay(), false);
	var E = position.E;
	var M = position.M;
	var trueAnomaly = position.trueAnomaly;
	
	return {
		x : position.x,
		y : position.y,
		z : position.z,
		E : position.E,
		M : position.M,
		trueAnomaly : position.trueAnomaly
	};
};

/**
 *
 * @param date
 * @param 
 */
//KMG.Astro.calculateSatellitePosition = function(date, p, E, M) {
KMG.Astro.calculateSatellitePosition = function(date, orbit) {

	var position = orbit.positionAtTime(date.getJulianDay(), false);
	var E = position.E;
	var M = position.M;
	var trueAnomaly = position.trueAnomaly;

	
	
	var semiMajorAxis = orbit.orbitProperties.semiMajorAxis;
	var arg_per = orbit.orbitProperties.argOfPeriapsis;
	var RAAN = orbit.orbitProperties.rightAscension;
	var i = orbit.orbitProperties.inclination * KMG.PI_BY_180;
	var e = orbit.orbitProperties.eccentricity;
	
	//var Epoch_now = date.getJulianDay() - apoapsys.J2000;
	var Epoch_now = date.getDayNumber();
	var Epoch_start = orbit.orbitProperties.epochStart;
	var Earth_equatorial_radius = 6378.135;
	

	var first_derative_mean_motion = orbit.orbitProperties.derivativeOfMeanMotion;
	var Satellite_rev_sidereal_day = orbit.orbitProperties.meanMotion;
	
	var TCdecimal=(1440/((1*Satellite_rev_sidereal_day)+(first_derative_mean_motion*(Epoch_now-Epoch_start )))) /60;   // Period in hours


	// bug here ?
	var RangeA=Math.pow(    (6028.9* (TCdecimal*60)), (2/3)   );
	
	
	var apogee =RangeA*(1+e*1);   // apogee
	var perigee=RangeA*(1-e*1);  //perigee
	var semimajoraxsis=(1*apogee+1*perigee)/2;  // semimajoraxsis
	

	
	perigee_perturbation=(Epoch_now-Epoch_start)*4.97*Math.pow((Earth_equatorial_radius/(1*semimajoraxsis)) , 3.5   )* (  5*Math.cos(i)*Math.cos(i) -1)/((1-e*e)*(1-e*e));

	// perturbation of ascending node

	ascending_node_perturbation=(Epoch_now-Epoch_start)*9.95*Math.pow((Earth_equatorial_radius/(1*semimajoraxsis)) , 3.5   )*   Math.cos(i)/((1-e*e)*(1-e*e));


	// perbutation of perigee
	arg_per=arg_per +perigee_perturbation;
	RAAN=RAAN-ascending_node_perturbation;

	arg_per *= KMG.PI_BY_180;
	RAAN *= KMG.PI_BY_180;

	var X0=1.0*semiMajorAxis*(Math.cos(E)-e);  //  = r*Cos(trueanomaly)
	var Y0=1.0*semiMajorAxis*Math.sqrt(1-e*e)*Math.sin(E);  // = r*sin (trueanomaly)
	var r=Math.sqrt(X0*X0+Y0*Y0); // distance
	
	X0 *= KMG.AU_TO_KM;
	Y0 *= KMG.AU_TO_KM;
	r *= KMG.AU_TO_KM;
	
	var Px = Math.cos(arg_per)*Math.cos(RAAN) - Math.sin(arg_per)*Math.sin(RAAN)*Math.cos(i);
	var Py = Math.cos(arg_per)*Math.sin(RAAN) + Math.sin(arg_per)*Math.cos(RAAN)*Math.cos(i);
	var Pz = Math.sin(arg_per)*Math.sin(i);

	var Qx=-Math.sin(arg_per)*Math.cos(RAAN)-Math.cos(arg_per)*Math.sin(RAAN)*Math.cos(i);
	var Qy=-Math.sin(arg_per)*Math.sin(RAAN)+Math.cos(arg_per)*Math.cos(RAAN)*Math.cos(i);
	var Qz=Math.cos(arg_per)*Math.sin(i);
	
	x=Px*X0+Qx*Y0;
	y=Py*X0+Qy*Y0;
	z=Pz*X0+Qz*Y0;

	
	var dec = Math.atan2(  z,Math.sqrt(x*x+y*y)  );
	var ra = Math.atan2(  y,x );

	
	ra = ra%(2 * Math.PI);

	var gmst = date.getGMST2(0);
	
	var lon = Math.atan2( y,x ) - (gmst * KMG.PI_BY_180);
	lon = KMG.Math.clamp(lon, 2 * Math.PI);
	
	if (lon > Math.PI) {
		lon = -1 * (2 * Math.PI - lon);
	}
	
	var lat = Math.atan2(  z,Math.sqrt(x*x+y*y)  );

	var radius = KMG.Math.radiusAtGeocentricLatitude(Earth_equatorial_radius, lat, 0.0033528);
	
	var altitude = Math.sqrt(x*x+y*y+z*z) - radius;
	var rh = (radius + altitude);
	var theta = Math.acos(radius / rh);
	var t = (6.284*rh)*(Math.sqrt(rh/398600))/60;
	
	var angularRange = radius * Math.tan(theta);
	var surfaceRange = 220 * (theta * KMG._180_BY_PI);
	var vis = ((2*theta*KMG._180_BY_PI)/360)*t;
	
	var maxAngularRange = .5 * Math.PI * 6378.135;
	if (angularRange > maxAngularRange) {
		angularRange = maxAngularRange;
	}
	
	//pos.ra_hms = apoapsys.Util.formatDegreesToHours(pos.ra / 15);
	//	pos.dec_dms = apoapsys.Util.formatDegreesToMinutes(pos.dec);
	return {
		ra : ra * KMG._180_BY_PI,
		ra_hms : KMG.Util.formatDegreesToHours(ra * KMG._180_BY_PI / 15),
		dec : dec * KMG._180_BY_PI,
		dec_dms : KMG.Util.formatDegreesToMinutes(dec * KMG._180_BY_PI),
		lat : lat * KMG._180_BY_PI,
		lon : lon * KMG._180_BY_PI,
		altitude : altitude,
		angularRange : angularRange,
		surfaceRange : surfaceRange,
		visibilityTimeMinutes : vis,
		eccentricAnomaly : E,
		meanAnomaly : M,
		trueAnomaly : trueAnomaly,
		
		xyz : {
			x : x, 
			y : y,
			z : z
		}
	};
};



KMG.Astro.getPositionAzimuthalSatellite = function(date, orbit, lat, lon) {
	//var equatorial = getPositionEquatorial(date, fromObject);
	//lat = 42.76537;
	//lon = -71.46757;
	
	var equatorial = KMG.Astro.calculateSatellitePosition(date, orbit);
	
	var dlon = lon;
	var dlat = lat;
	lat = lat * KMG.PI_BY_180;
	lon = lon * KMG.PI_BY_180;
	var ra = equatorial.ra * KMG.PI_BY_180;
	var dec = equatorial.dec * KMG.PI_BY_180;


	var gmst = date.getGMST2(0);
	var lst = gmst + (dlon / 15);
	
	var ha = lst - (((ra * KMG._180_BY_PI) / 15));
	var f = 0.0033528;
	var e2 = 2 * f - f * f;
	var C=1/Math.sqrt(1+0.0033528*(0.0033528-2)*Math.sin(lat)*Math.sin(lat)             );
	var omega=(1*gmst+1*dlon) * KMG.PI_BY_180;

	var Re = 6378.135;
	var C = 1 / Math.sqrt(1 - e2 * Math.pow(Math.sin(lat), 2));
	var S=(1-0.0033528)*(1-0.0033528)*C;
	var R =  Re * Math.cos(lat);
	var a = Re;
	
	/*
	console.info("omega: " + (omega * KMG._180_BY_PI));
	console.info("C: " + C);
	console.info("S: " + S);
	console.info("R: " + R);
	console.info("lat: " + (lat * KMG._180_BY_PI));
	console.info("lon: " + (lon * KMG._180_BY_PI));
	console.info("GMST: " + gmst);
	*/
	
	var x_ = a * C * Math.cos(lat) * Math.cos(omega);
	var y_ = a * C * Math.cos(lat) * Math.sin(omega);
	var z_=6378.135*S*Math.sin(lat);
	//console.info([x_, y_, z_]);

	var xs = equatorial.xyz.x;
	var ys = equatorial.xyz.y;
	var zs = equatorial.xyz.z;
	
	
	
	var xo = x_;
	var yo = y_;
	var zo = z_;
	
	//console.info(["sat", xs, ys, zs]);
	//console.info(["Obs", xo, yo, zo]);
	
	var rx=xs-xo;
	var ry=ys-yo;
	var rz=zs-zo;
	
	//console.info(["rxyz", rx, ry, rz]); 
	
	fi=(1*gmst+1*dlon)*KMG.PI_BY_180;
	var rS=Math.sin(lat)*Math.cos(fi)*rx+Math.sin(lat)*Math.sin(fi)*ry-Math.cos(lat)*rz;
	var rE=-Math.sin(fi)*rx+Math.cos(fi)*ry;
	var rZ=Math.cos(lat)*Math.cos(fi)*rx+Math.cos(lat)*Math.sin(fi)*ry+Math.sin(lat)*rz;
	//console.info("fi: " + (fi * KMG._180_BY_PI));
	//console.info(["rSEZ", rS, rE, rZ]);

	var range=Math.sqrt(rS*rS+rE*rE+rZ*rZ);
	//console.info("range: " + range);
	var Elevation=Math.asin(rZ/range);
	var Azimuth=Math.atan(-rE/rS);

	if (rS>0) Azimuth=Azimuth+Math.PI;
	if (Azimuth<0) Azimuth=Azimuth+ 2*Math.PI;

	var alt = Elevation;
	var az = Azimuth;

	if (az < 0) {
		az += 2 * Math.PI;
	}
	
	//console.info("Azimuth: " + (az * KMG._180_BY_PI));
	//console.info("Elevation: " + (alt * KMG._180_BY_PI));
	
	return {
		alt : alt * KMG._180_BY_PI,
		az : KMG.Math.clamp(az * KMG._180_BY_PI, 360),
		ha : ha,
		lst : lst,
		lst_hms : KMG.Util.formatDegreesToHours(lst),
		range : range,
		gmst : gmst
	};

};


KMG.Astro.getHeliocentricPosition = function(date, orbit) {

	var position = orbit.positionAtTime(date.getJulianDay(), false);
	var parentPosition, heliocentricPosition;

	if (orbit.parentOrbit) {
		parentPosition = orbit.parentOrbit.positionAtTime(date.getJulianDay(), false);
		heliocentricPosition = parentPosition.clone().add(position);
	} else {
		heliocentricPosition = position;
	}
	
	return heliocentricPosition;
}

KMG.Astro.getHeliocentricPositionEquatorial = function(date, orbit, fromObjectOrbit) {
	
	var heliocentricPosition = KMG.Astro.getHeliocentricPosition(date, orbit);
		
	// fromObject is assumed to be Earth
	if (fromObjectOrbit) {
		var fromHeliocentricPosition = KMG.Astro.getHeliocentricPosition(date, fromObjectOrbit);
		heliocentricPosition.sub(fromHeliocentricPosition);
	}
	
	var pos;
	
	var eclipticPos = KMG.Astro.vectorToHeliocentricLatitudeLongitude(heliocentricPosition);
	pos = KMG.Math.convertEclipticToEquatorial(date.getJulianDay(), eclipticPos.b *KMG.PI_BY_180, eclipticPos.l *KMG.PI_BY_180);
	pos = KMG.Math.epochConvert(date.getJulianDay(), 2451545.0, pos.ra, pos.dec);
	pos.ra *= KMG._180_BY_PI;
	pos.dec *= KMG._180_BY_PI;
	if (pos.dec < 0) {
		pos.ra += 180;
	}

	if (!pos.ra_hms) {
		pos.ra_hms = KMG.Util.formatDegreesToHours(pos.ra / 15);
	}
	if (!pos.dec_dms) {
		pos.dec_dms = KMG.Util.formatDegreesToMinutes(pos.dec);
	}

	return pos;
};
	
	
KMG.Astro.getPositionAzimuthalHeliocentricBody = function(date, orbit, fromObjectOrbit, lat, lon) {

	var equatorial = KMG.Astro.getHeliocentricPositionEquatorial(date, orbit, fromObjectOrbit);

	var dlon = lon;
	var dlat = lat;
	lat = lat * KMG.PI_BY_180;
	lon = lon * KMG.PI_BY_180;
	var ra = equatorial.ra * KMG.PI_BY_180;
	var dec = equatorial.dec * KMG.PI_BY_180;

	var lst = date.getLMST(dlon);

	var ha = lst - (((ra * KMG._180_BY_PI) / 15));

	var H = ha * 15 * KMG.PI_BY_180;
	var alt = Math.asin(Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(H));
	var az = Math.asin(-Math.sin(H) * Math.cos(dec) / Math.cos(alt));
	//alt += (h * KMG.PI_BY_180);
	
	var Y = -Math.sin(H);
	var X = Math.cos(lat) * Math.tan(dec) - Math.sin(lat) * Math.cos(H);
	var az = Math.atan2(Y, X);

	if (az < 0) {
		az += 2 * Math.PI;
	}

	return {
		alt : alt * KMG._180_BY_PI,
		az : KMG.Math.clamp(az * KMG._180_BY_PI, 360),
		ha : ha,
		lst : lst,
		lst_hms : KMG.Util.formatDegreesToHours(lst)
	};

};

KMG.Astro.geocentricToECI = function(date, lat, lon, alt) {

	var F = 0.0033528;
	var mfactor = 2 * Math.PI * (1.00273790934 / 86400.0); 

	theta = KMG.Astro.getGMST2(0.0, date.getJulianDay());
	theta = KMG.Math.clamp(theta + lon, 360) * KMG.PI_BY_180;
	
	
	lat *= KMG.PI_BY_180;
	lon *= KMG.PI_BY_180;
	
	var c = 1.0 / Math.sqrt(1.0 + (1.0 / 298.26) * (F - 2.0) * KMG.Math.sqr(Math.sin(lat)));   
	var s = KMG.Math.sqr(1.0 - F) * c;   
	var achcp = (KMG.AU_TO_KM * c + alt) * Math.cos(lat);   
	
	var x = achcp * Math.cos(theta);
	var y = achcp * Math.sin(theta);
	var z = (KMG.AU_TO_KM * s + alt) * Math.sin(lat);
	var w = Math.sqrt(x*x + y*y + z*z);
	
	return {
		x : x,
		y : y,
		z : z,
		w : w
	};
};


/** A work in progress
 *
 */
KMG.Astro.isSatelliteInSunlight = function(jd, satVecEci, sunVecEci) {
	if (!satVecEci || !satVecEci.x) {
		return;
	}
	
	var date = new KMG.AstroDate(undefined, jd);
	var sunPos = new THREE.Vector3(sunVecEci.x, sunVecEci.y, sunVecEci.z);
	var sat = new THREE.Vector3(satVecEci.x, satVecEci.y, satVecEci.z);
	sat.divideScalar(KMG.AU_TO_KM);
	earthPos = sat.negate();
	sat = new THREE.Vector3(0, 0, 0);

	sunPos.add(earthPos);

	var RE = 6378.135;
	var RS = 696342;
	var pE = sat.distanceTo(earthPos)* KMG.AU_TO_KM;
	var pS = sat.distanceTo(sunPos)* KMG.AU_TO_KM;
	var rS = earthPos.distanceTo(sunPos)* KMG.AU_TO_KM;

	var thetaE = Math.asin(RE / pE);
	var thetaS = Math.asin(RS / pS);
	
	var sunAngularSemiDiameter = thetaS * KMG._180_BY_PI;
	var earthAngularSemiDiameter = thetaE * KMG._180_BY_PI;
	

	earthPos.normalize();
	sunPos.normalize();
	sat.normalize();
	
	var dot = earthPos.dot(sunPos);
	var angleOfSeperation = sunPos.clone().sub(sat).angleTo(earthPos.clone().sub(sat));
	

	var theta = Math.acos(dot / (pE * pS));

	
	var isEclipsed = (angleOfSeperation * KMG._180_BY_PI < (earthAngularSemiDiameter - sunAngularSemiDiameter));
	
	if (isEclipsed) {
	//	return false;
	}
	
	
	// Umbral eclipse
	if (thetaE > thetaS && theta  < (thetaE - thetaS)) {
		isEclipsed = true;
	}
	
	// Penumbral eclipse
	if (Math.abs(thetaE - thetaS) < theta && theta < (thetaE + thetaS)) {
		isEclipsed = true;
	}
	
	// Annular eclipse
	if (thetaS > thetaE && theta < (thetaS - thetaE)) {
		isEclipsed = true;
	}
	
	//console.info([ dot, angleOfSeperation * KMG._180_BY_PI, earthAngularSemiDiameter, sunAngularSemiDiameter, isEclipsed]); 
	return !isEclipsed;

}
/* File: UserLocationController.js */


KMG.Location = {};



	
KMG.Location.isPreciseLocationSupported = function() {
	if (navigator.geolocation)
		return true;
	else
		return false;
};
	
KMG.Location.getPreciseLocation = function(onLocation) {
	if (!KMG.Location.isPreciseLocationSupported()) {
		return false;
	}
	
	navigator.geolocation.getCurrentPosition(onLocation);
	return true;
};
	
	

/* File: StarFlares.js */



KMG.starFlares = [
	{
		name : "Yellow Star",
		texture : "/img/lensflare0.png"
	},
	{
		name : "Aura",
		texture : "/img/aura.png"
	},
	{
		name : "Corona",
		texture : "/img/corona.png"
	},
	{
		name : "i0",
		texture : "/img/i0.png"
	},
	{
		name : "Nova",
		texture : "/img/nova.png"
	},
	{
		name : "Sparkle",
		texture : "/img/sparkle.png"
	},
	{
		name : "Star",
		texture : "/img/star.png"
	},
	{
		name : "Sun",
		texture : "/img/sun.png"
	},/*
	{
		name : "Sun (Actual)",
		texture : "/img/sun_actual.png"
	},*/
	{
		name : "Solar Corona SDO/AIA 3/12/2012 17:30:01 UT",
		texture : "/img/latest_2048_0171.png"
	}
];
/* File: Backgrounds.js */


KMG.backgrounds = [
	{
		name : "Starfield",
		
		// I'm not sure the exact origin of this image. If you know, or you made it, 
		// please let me know at kevin@wthr.us so I can provide proper credit.
		texture : "/img/starfield2_1900x1250.jpg",
		enabled : true
	},
	{
		name : "Tycho Star Map",
		texture : "/img/tycho8-2048x1024.jpg",
		enabled : true
	},
	{
		name : "Hipparcos Star Map",
		texture : "/img/hipp8-2048x1024.jpg",
		enabled : true
	},
	{
		name : "Yale Bright Star Map",
		texture : "/img/yale8-2048x1024.jpg",
		enabled : true
	},
	{   // http://apod.nasa.gov/apod/ap110224.html
		name : "NGC 1999: South of Orion",
		texture : "/img/n1999_block.jpg",
		enabled : true
	},
	{   // http://apod.nasa.gov/apod/ap110219.html
		name : "Spiral Galaxy NGC 2841",
		texture : "/img/ngc2841c_hst_lg.jpg",
		enabled : true
	},
	{   // http://apod.nasa.gov/apod/ap110215.html
		name : "North America Nebula in Infrared",
		texture : "/img/northamerica_spitzer_3000.jpg",
		enabled : true
	},
	{   // http://apod.nasa.gov/apod/ap110215.html
		name : "North America Nebula (Optical Light)",
		texture : "/img/northamerica_v_900.jpg",
		enabled : true
	},
	{   // http://apod.nasa.gov/apod/ap110214.html
		name : "The Rosette Nebula ",
		texture : "/img/rosette_lula_1700.jpg",
		enabled : true
	},
	{ // http://photojournal.jpl.nasa.gov/catalog/PIA07745
		name : "Icy Crescent of Dione",
		texture : "/img/PIA07745_dione.jpg",
		enabled : true
	},
	{
		name : "Custom",
		texture : null,
		enabled : true
	},
	{
		name : "Webcam",
		texture : null,
		enabled : false
	}
];
/* File: Clouds.js */

KMG.clouds = [
	{
		name : "xPlanet Daily Global Cloud Map",
		texture : "/img/xplanet/0/clouds_xplanet_texture_2048x1024.png",
		bumpMap : "/img/xplanet/0/clouds_2048.jpg",
		aoMap : "/img/xplanet/0/clouds_ao_2048.jpg",
		normalMap : null
	},
	{
		name : "NASA Blue Marble Global Composite Clouds",
		texture : "/img/clouds_texture_#resolution#.png",
		bumpMap : "/img/clouds_bumpmap_#resolution#.jpg",
		normalMap : "/img/clouds_normalmap_#resolution#.jpg",
		aoMap : "/img/clouds_ao_#resolution#.jpg"
	},
	{
		name : "Gas Giant Banded Clouds",
		texture : "/img/gasgiant-clouds-#resolution#.png",
		bumpMap : "/img/gasgiant-clouds-bumpmap-#resolution#.jpg",
		normalMap : "/img/gasgiant-clouds-normalmap-#resolution#.jpg",
		aoMap : "/img/gasgiant-clouds-ao-#resolution#.jpg"
	}
];

/* File: Textures.js */

KMG.textures = [
	{
		name : "Earth - Blue Marble",
		texture : "/img/earth_bluemarble_#resolution#.jpg",
		bumpMap : "/img/earth_bumpmap_flat_#resolution#.jpg",
		normalMap : "/img/earth_normalmap_flat_#resolution#.jpg",
		specularMap : "/img/earth_specularmap_flat_#resolution#.jpg",
		enabled : true
	},
	{
		name : "Earth - Blue Marble / Oceans & Ice",
		texture : "/img/earth_bluemarble_land_ocean_ice_texture_#resolution#.jpg",
		bumpMap : "/img/earth_bumpmap_flat_#resolution#.jpg",
		normalMap : "/img/earth_normalmap_flat_#resolution#.jpg",
		specularMap : "/img/earth_specularmap_flat_#resolution#.jpg",
		enabled : true
	},
	{
		name : "Earth - Blue Marble w/ Bathy",
		texture : "/img/earth.topo.bathy.200407.3x#resolution#.jpg",
		bumpMap : "/img/earth_bumpmap_#resolution#.jpg",
		normalMap : "/img/earth_normalmap_#resolution#.jpg",
		specularMap : "/img/earth_specularmap_flat_#resolution#.jpg",
		enabled : true
	},
	{
		name : "Earth - Blue Marble w/ Bathy (Flat Ocean Shading)",
		texture : "/img/earth.topo.bathy.200407.3x#resolution#.jpg",
		bumpMap : "/img/earth_bumpmap_flat_#resolution#.jpg",
		normalMap :  "/img/earth_normalmap_flat_#resolution#.jpg",
		specularMap : "/img/earth_specularmap_flat_#resolution#.jpg",
		enabled : true
	},
	{
		name : "Earth - GEBCO8 Altimetry & Bathy",
		texture : "/img/earth_gebco8_texture_#resolution#.jpg",
		bumpMap : "/img/earth_bumpmap_#resolution#.jpg",
		normalMap : "/img/earth_normalmap_#resolution#.jpg",
		specularMap : "/img/earth_specularmap_flat_#resolution#.jpg",
		enabled : true
	},
	{
		name : "Earth - Blue Marble Night Lights",
		texture : "/img/earth_nightlights_#resolution#.jpg",
		bumpMap : "/img/earth_bumpmap_flat_#resolution#.jpg",
		normalMap : "/img/earth_normalmap_flat_#resolution#.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Earth - Vegetation as Seen by Suomi NPP",
		texture : "/img/SMNDVI-2012-week25_#resolution#.jpg",
		bumpMap : "/img/earth_bumpmap_flat_#resolution#.jpg",
		normalMap : "/img/earth_normalmap_flat_#resolution#.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Earth - City Lights as Seen by Suomi NPP",
		texture : "/img/blackmarble-suomi-npp-texture-#resolution#.jpg",
		bumpMap : "/img/earth_bumpmap_flat_#resolution#.jpg",
		normalMap : "/img/earth_normalmap_flat_#resolution#.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Earth - True Color by Suomi NPP",
		texture : "/img/TRUE.daily.20150328.color_#resolution#.jpg",
		bumpMap : "/img/earth_bumpmap_flat_#resolution#.jpg",
		normalMap : "/img/earth_normalmap_flat_#resolution#.jpg",
		specularMap : "/img/earth_specularmap_flat_#resolution#.jpg",
		enabled : true
	},
	{
		name : "Mars",
		texture : "/img/tx_composite.adjusted.#resolution#.jpg",
		bumpMap : "/img/mars_mola_bumpmap_#resolution#.jpg",
		normalMap : "/img/mars_mola_normalmap_#resolution#.jpg",
		specularMap :"/img/flat_black_texture.jpg",
		enabled : true
	},
	
	{
		name : "Mars - Viking Composite",
		texture : "/img/viking_merged_color_mosaic_#resolution#.jpg",
		bumpMap : "/img/mars_mola_bumpmap_#resolution#.jpg",
		normalMap : "/img/mars_mola_normalmap_#resolution#.jpg",
		specularMap :"/img/flat_black_texture.jpg",
		enabled : true
	},
	
	{
		name : "Mars - MOLA Altimetry",
		texture : "/img/mars_mola_hypsometric_#resolution#.jpg",
		bumpMap : "/img/mars_mola_bumpmap_#resolution#.jpg",
		normalMap : "/img/mars_mola_normalmap_#resolution#.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Mars with Oceans",
		texture : "/img/mars_wetred_texture_#resolution#.jpg",
		bumpMap : "/img/mars_mola_bumpmap_sealevel_#resolution#.jpg",
		normalMap : "/img/mars_mola_normalmap_flat_#resolution#.jpg",
		specularMap : "/img/mars_mola_specularmap_#resolution#.jpg",
		enabled : true
	},
	{
		name : "Living Mars",
		texture : "/img/mars-wet-flora-layer-v3-#resolution#.jpg",
		bumpMap : "/img/mars_mola_bumpmap_sealevel_#resolution#.jpg",
		normalMap : "/img/mars_mola_normalmap_flat_#resolution#.jpg",
		specularMap : "/img/mars_mola_specularmap_#resolution#.jpg",
		enabled : true
	},
	{
		name : "Moon",
		texture : "/img/moon_8k_color_brim16_revhemi_#resolution#.jpg",
		bumpMap : "/img/moon_lro_bumpmap_#resolution#.jpg",
		normalMap : "/img/moon_lro_normalmap_#resolution#.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Moon - LRO Altimetry",
		texture : "/img/moon_lro_hypsometric_#resolution#.jpg",
		bumpMap : "/img/moon_lro_bumpmap_#resolution#.jpg",
		normalMap : "/img/moon_lro_normalmap_#resolution#.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Mercury",
		texture : "/img/mdis_v9_mono_1000mpp_eqc_#resolution#.jpg",
		bumpMap :  "/img/mercury_hdem_64_#resolution#.jpg",
		normalMap :  "/img/mercury_hdem_64_normals_#resolution#.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Jupiter",
		texture : "/img/jupiter_johnw_texture_#resolution#.jpg",
		bumpMap :  null,
		normalMap : "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Saturn",
		texture : "/img/th_saturn_texture_#resolution#.jpg",
		bumpMap :  null,
		normalMap : "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Venus",
		texture : "/img/ven0mss2_jpl_mariner10_#resolution#.jpg",
		bumpMap :  null,
		normalMap : "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Venus - Magellan RADAR",
		texture : "/img/venmap_jpl_magellan_#resolution#.jpg",
		bumpMap :  null,
		normalMap : "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Terrestrial Planet X.0",
		texture : "/img/libnoise_0/terrainsurface_#resolution#.jpg",
		bumpMap :  "/img/libnoise_0/terrainbump_#resolution#.jpg",
		normalMap : "/img/libnoise_0/terrainnormal_#resolution#.jpg",
		specularMap : "/img/libnoise_0/terrainspec_#resolution#.jpg",
		enabled : true
	},
	{
		name : "Terrestrial Planet X.1",
		texture : "/img/libnoise_1/terrainsurface_#resolution#.jpg",
		bumpMap :  "/img/libnoise_1/terrainbump_#resolution#.jpg",
		normalMap : "/img/libnoise_1/terrainnormal_#resolution#.jpg",
		specularMap : "/img/libnoise_1/terrainspec_#resolution#.jpg",
		enabled : true
	},
	{
		name : "Terrestrial Planet X.2",
		texture : "/img/libnoise_2/terrainsurface_#resolution#.jpg",
		bumpMap :  "/img/libnoise_2/terrainbump_#resolution#.jpg",
		normalMap : "/img/libnoise_2/terrainnormal_#resolution#.jpg",
		specularMap : "/img/libnoise_2/terrainspec_#resolution#.jpg",
		enabled : true
	},
	{
		name : "Terrestrial Planet X.3",
		texture : "/img/libnoise_3/terrainsurface_#resolution#.jpg",
		bumpMap :  "/img/libnoise_3/terrainbump_#resolution#.jpg",
		normalMap : "/img/libnoise_3/terrainnormal_#resolution#.jpg",
		specularMap : "/img/libnoise_3/terrainspec_#resolution#.jpg",
		enabled : true
	},
	{
		name : "Terrestrial Planet X.3 (Gray)",
		texture : "/img/libnoise_3/terrainsurface_gray_#resolution#.jpg",
		bumpMap :  "/img/libnoise_3/terrainbump_#resolution#.jpg",
		normalMap : "/img/libnoise_3/terrainnormal_#resolution#.jpg",
		specularMap : "/img/libnoise_3/terrainspec_#resolution#.jpg",
		enabled : true
	},
	{
		name : "Gas Giant (Browns)",
		texture : "/img/gas_0/orange_and_browns_#resolution#.jpg",
		bumpMap :  null,
		normalMap : "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Gas Giant (Purples)",
		texture : "/img/gas_1/purples_texture_#resolution#.jpg",
		bumpMap :  null,
		normalMap : "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Gas Giant 3 (Grey)",
		texture : "/img/gas_2/gas_giant_texture_grey_#resolution#.jpg",
		bumpMap :  "/img/gas_2/gas_giant_texture_grey_#resolution#.jpg",
		normalMap : "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Gas Giant 3 (Grey, Inverted)",
		texture : "/img/gas_2/gas_giant_texture_grey_inverted_#resolution#.jpg",
		bumpMap :  "/img/gas_2/gas_giant_texture_grey_inverted_#resolution#.jpg",
		normalMap : "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Gas Giant 4",
		texture : "/img/gasgiant-4-texture-#resolution#.jpg",
		bumpMap :  null,
		normalMap : "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Sun",
		texture : "/img/th_sun_basetexture_#resolution#.jpg",
		bumpMap :  null,
		normalMap :  "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Dione",
		texture : "/img/PIA18434_Dione_#resolution#.jpg",
		bumpMap :  null,
		normalMap :  "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Enceladus",
		texture : "/img/PIA18435_Enceladus_#resolution#.jpg",
		bumpMap :  null,
		normalMap :  "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Iapetus",
		texture : "/img/PIA18436_Iapetus_#resolution#.jpg",
		bumpMap :  null,
		normalMap :  "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Mimas",
		texture : "/img/PIA18437_Mimas_#resolution#.jpg",
		bumpMap :  null,
		normalMap :  "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Rhea",
		texture : "/img/PIA18438_Rhea_#resolution#.jpg",
		bumpMap :  null,
		normalMap :  "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Tethys",
		texture : "/img/PIA18439_Tethys_#resolution#.jpg",
		bumpMap :  null,
		normalMap :  "/img/flat_normalmap_128x64.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Ceres - Dawn Altimetry",
		texture : "/img/20150319_ceres_opnav5HIPASS_hypso_#resolution#.jpg",
		bumpMap :  "/img/20150319_ceres_opnav5HIPASS_#resolution#.jpg",
		normalMap :  "/img/20150319_ceres_opnav5HIPASS_normals_#resolution#.jpg",
		specularMap : "/img/flat_black_texture.jpg",
		enabled : true
	},
	{
		name : "Custom",
		texture : "",
		bumpMap : "",
		normalMap : "",
		specularMap : "",
		enabled : true,
		sourceProperties : {
			texture : {},
			bumpMap : {},
			normalMap : {},
			specularMap : {}
		}
	},
	{
		name : "Webcam",
		texture : null,
		bumpMap : "",
		normalMap : "",
		specularMap : "",
		enabled : false
	}
];

/* File: Rings.js */

/**
 * Some rings from Celestia plus others based on stock GIMP (www.gimp.org) gradiants.
 */
KMG.rings = [
	{
		name : "Saturn",
		texture : "/img/saturn-rings.png"
	},
	{
		name : "Saturn - Dark Side",
		texture : "/img/saturn-rings-iss-new.png"
	},
	{
		name : "Uranus",
		texture : "/img/uranus-rings.png"
	},
	{
		name : "Neptune",
		texture : "/img/neptune-rings.png"
	},
	{
		name : "Grays",
		texture : "/img/grays-ring.png"
	},
	{
		name : "Abstract3",
		texture : "/img/abstract3-ring.png"
	},
	{
		name : "Anuerism",
		texture : "/img/anuerism-ring.png"
	},
	{
		name : "Browns",
		texture : "/img/browns-ring.png"
	},
	{
		name : "Brushed Aluminum",
		texture : "/img/brushed-aluminum-ring.png"
	},
	{
		name : "Flare Glow Angular 1",
		texture : "/img/flare-glow-angular-1-ring.png"
	},
	{
		name : "Golden",
		texture : "/img/golden-ring.png"
	},
	{
		name : "Greens",
		texture : "/img/greens-ring.png"
	},
	{
		name : "Red Tube",
		texture : "/img/red-tube-ring.png"
	},
	{
		name : "Yellow Contrast",
		texture : "/img/yellow-contrast-ring.png"
	},
	{
		name : "Yellow Orange",
		texture : "/img/yellow-orange-ring.png"
	}
];
/* File: TextureMap.js */

KMG.TextureMap = {

	map : {},
	textureResolution : "2048x1024",
	texturesLoading : 0,
	sceneReadyCallback : null,
	resourceLoadingStart : null,
	resourceLoadingFinish : null,
	renderCallback : null,
	
	onResourceLoaded : function()
	{
		KMG.TextureMap.texturesLoading--;
		if (KMG.TextureMap.sceneReadyCallback && KMG.TextureMap.texturesLoading === 0) {
			KMG.TextureMap.sceneReadyCallback();
		}
		
		if (KMG.TextureMap.resourceLoadingFinish) {
			KMG.TextureMap.resourceLoadingFinish(true, KMG.TextureMap.texturesLoading);
		}
	},
	
	setupEncodedTexture : function(dat) {
		var img = new Image();
		var t = new THREE.Texture(img);
		t.wrapS = THREE.RepeatWrapping;

		img.onload = function() {
			t.needsUpdate = true;
			KMG.TextureMap.onResourceLoaded();
			if (KMG.TextureMap.renderCallback !== null) {
				KMG.TextureMap.renderCallback();
			}
		};
		img.src = dat;
		return t;
	},

	
	loadTexture : function(url, onload, noCache)
	{

		if (!url || url.length === 0) {
			return null;
		}
		
		if (!onload) {
			onload = KMG.TextureMap.onResourceLoaded;
		} else {
			var origOnload = onload;
			onload = function() {
				origOnload();
				KMG.TextureMap.onResourceLoaded();
			};
		}
		
		url = url.replace("#resolution#", KMG.TextureMap.textureResolution);
		
		if (KMG.TextureMap.map[url] !== undefined && !noCache) {
			return KMG.TextureMap.map[url];
		}
		
		if (KMG.TextureMap.resourceLoadingStart) {
			KMG.TextureMap.resourceLoadingStart(url);
		}
		
		KMG.TextureMap.texturesLoading++;
		
		var tex = null;
		if (/^data:/i.test(url)) {
			tex = KMG.TextureMap.setupEncodedTexture(url);
			onload();
		} else {
			tex = THREE.ImageUtils.loadTexture( url, {}, onload, onload );
		}
		
		tex.repeat.set( 0.998, 0.998 );
		tex.offset.set( 0.001, 0.001 )
		tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
		tex.format = THREE.RGBFormat;
		//KMG.TextureMap.map[url].anisotropy = 4;
		
		if (!noCache) {
			KMG.TextureMap.map[url] = tex;
		} 
		
		return tex;
	},
	
	getDefinitionByName : function(list, name) 
	{
		for (var i = 0; i < list.length; i++) {
			if (list[i].name == name) {
				return list[i];
			}
		}
		return null;
	},
	
	getCloudDefinitionByName : function( name )
	{
		return KMG.TextureMap.getDefinitionByName(KMG.clouds, name);
	},
	
	getRingDefinitionByName : function( name )
	{
		return KMG.TextureMap.getDefinitionByName(KMG.rings, name);
	},
	
	getTextureDefinitionByName : function( name )
	{
		return KMG.TextureMap.getDefinitionByName(KMG.textures, name);
	},
	
	getBackgroundDefinitionByName : function( name )
	{
		return KMG.TextureMap.getDefinitionByName(KMG.backgrounds, name);
	},
	
	getFlareDefinitionByName : function( name )
	{
		return KMG.TextureMap.getDefinitionByName(KMG.starFlares, name);
	}

};

/* File: MoonCalc.js */
/**
 * Lunar Algorithms
 * http://www.apoapsys.com
 * 
 * Copyright 2014 Kevin M. Gill <kmsmgill@gmail.com>
 *
 * Uses algorithms from:
 * Meeus, Jean: Astronomical Algorithms.
 * Richmond, Virg.: Willmann-Bell, 2009.
 * ISBN: 978-0943396613
 * http://amzn.com/0943396611
 * Chapter 13: Transformation of Coordinates
 * Chapter 22: Nutation and the Obliquity of the Ecliptic
 * Chapter 25: Solar Coordinates
 * Chapter 47: Position of the Moon
 * Chapter 48: Illuminated Fraction of the Moon's Disk
 * Chapter 49: Phases of the Moon
 * 
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

if (!window.KMG) { window.KMG = {}; };

KMG.MoonCalc = function() {

	function sin(v) {
		return Math.sin(v * Math.PI / 180);
	}

	function cos(v) {
		return Math.cos(v * Math.PI / 180);
	}

	function tan(v) {
		return Math.tan(v * Math.PI / 180);
	}


	function cramp(v, within) {
		return v - within * Math.floor(v / within);
	}

	function deg(v) {
		return cramp(v, 360);
	}

	function asin(v) {
		return Math.asin(v) * 180 / Math.PI;
	}

	function acos(v) {
		return Math.acos(v) * 180 / Math.PI;
	}

	function atan2(y, x) {
		return Math.atan2(y, x) * 180 / Math.PI;
	}

	function atan(v) {
		return asin(v / Math.sqrt(pow(v, 2) + 1));
	}

	function sqrt(v) {
		return Math.sqrt(v);
	}

	function pow(v, e) {
		return Math.pow(v, e);
	}

	function degToDecimal(degrees, minutes, seconds) {
		return degrees + (minutes / 60) + (seconds / 60 / 60);
	}

	function secToDecimal(seconds) {
		return degToDecimal(0, 0, seconds);
	}

	function minToDecimal(minutes, seconds) {
		if (!seconds) // Checking for undefined or null
			seconds = 0;
		return degToDecimal(0, minutes, seconds);
	}


	function positionOfTheSun(T, lunarContext) {
		
		var obliquity;
		if (!lunarContext || !lunarContext.obliquity || lunarContext.obliquity.T != T) {
			obliquity = nutationAndObliquity(T, lunarContext);
		} else {
			obliquity = lunarContext.obliquity;
		}
		
		// Geometric mean longitude of the Sun
		var L0 = 280.46646 + 36000.76983 * T + 0.0003032 * pow(T, 2);
		L0 = deg(L0);
		
		// Mean anomaly of the Sun
		var M = 357.52911 + 35999.05029 * T - 0.0001537 * pow(T, 2);
		M = deg(M);
		
		// Eccentricity of the Earth's orbit
		var e = 0.016708634 - 0.000042037 * T - 0.0000001267 * pow(T, 2);
		
		// Sun's equation of the center
		var C = (1.914602 - 0.004817 * T - 0.000014 * pow(T, 2)) * sin(M)
				+ (0.019993 - 0.000101 * T) * sin(2 * M)
				+ 0.000289 * sin(3 * M);
		
		// True longitude of the Sun
		var O = L0 + C;
		
		// True anomaly of the Sun
		var v = M + C;
		
		// Sun's radius vector (distance between the centers of
		// the Sun and the Earth, in AU)
		var R = (1.000001018 * (1 - pow(e, 2))) / (1 + e * cos(v));
		
		// Something important...
		var Ω = 125.04 - 1934.136 * T;
		
		// Apparent longitude of the Sun
		var λ = O - 0.00569 - 0.00478 * sin(Ω);
		
		var ε = obliquity.ε;
		
		var X = cos(ε) * sin(O);
		var Y = cos(O);
		
		// Right Ascension of the Sun
		var α = atan2(Y, X);
		α = deg(α);
		
		// Declination of the Sun
		var δ = asin(sin(ε) * sin(O));
		
		Y = cos(ε) * sin(λ);
		X = cos(λ);
		
		// Apparent Right Ascension of the Sun
		var αApp = atan2(Y, X);
		αApp = deg(αApp);
		
		// Apparent Declination of the Sun
		var δApp = asin(sin(ε + 0.00256 * cos(Ω)) * sin(λ));
		
		var sunPosition = {
			Ω : Ω,
			λ : λ,
			α : α,
			δ : δ,
			αApp : αApp,
			δApp : δApp,
			L0 : L0,
			M : M,
			e : e,
			C : C,
			O : O,
			v : v,
			R : R,
			T : T
		};
		
		if (lunarContext) {
			lunarContext.sunPosition = sunPosition;
		}
		
		return sunPosition;
	}


	// Periodic terms for the longitude (sigmaI) and distance (sigmaR) of the Moon. 
	// Unit is 0.000001 degree for sigmaI, and 0.001 kilometer for sigmaR
	// Table 47.A, Chapter 47, Page 339
	var table47A = [
		[0,  0,  1,  0,  6288774, -20905355],
		[2,  0, -1,  0,  1274027,  -3699111],
		[2,  0,  0,  0,   658314,  -2955968],
		[0,  0,  2,  0,   213618,   -569925],
		[0,  1,  0,  0,  -185116,     48888],
		[0,  0,  0,  2,  -114332,     -3149],
		[2,  0, -2,  0,    58793,    246158],
		[2, -1, -1,  0,    57066,   -152138],
		[2,  0,  1,  0,    53322,   -170733],
		[2, -1,  0,  0,    45758,   -204586],
		[0,  1, -1,  0,   -40923,   -129620],
		[1,  0,  0,  0,   -34720,    108743],
		[0,  1,  1,  0,   -30383,    104755],
		[2,  0,  0, -2,    15327,     10321], 
		[0,  0,  1,  2,   -12528,         0],
		[0,  0,  1, -2,    10980,     79661],
		[4,  0, -1,  0,    10675,    -34728],
		[0,  0,  3,  0,    10034,    -23210],
		[4,  0, -2,  0,     8548,    -21636],
		[2,  1, -1,  0,    -7888,     24208],
		[2,  1,  0,  0,    -6766,     30824],
		[1,  0, -1,  0,    -5163,     -8379],
		[1,  1,  0,  0,     4987,    -16675],
		[2, -1,  1,  0,     4036,    -12831],
		[2,  0,  2,  0,     3994,    -10445],
		[4,  0,  0,  0,     3861,    -11650],
		[2,  0, -3,  0,     3665,     14403],
		[0,  1, -2,  0,    -2689,     -7003],
		[2,  0, -1,  2,    -2602,         0],
		[2, -1, -2,  0,     2390,     10056],
		[1,  0,  1,  0,    -2348,      6322],
		[2, -2,  0,  0,     2236,     -9884],
		[0,  1,  2,  0,    -2120,      5751],
		[0,  2,  0,  0,    -2069,         0],
		[2, -2, -1,  0,     2048,     -4950],
		[2,  0,  1, -2,    -1773,      4130],
		[2,  0,  0,  2,    -1595,         0],
		[4, -1, -1,  0,     1215,     -3958],
		[0,  0,  2,  2,    -1110,         0],
		[3,  0, -1,  0,     -892,      3258],
		[2,  1,  1,  0,     -810,      2616],
		[4, -1, -2,  0,      759,     -1897],
		[0,  2, -1,  0,     -713,     -2117],
		[2,  2, -1,  0,     -700,      2354],
		[2,  1, -2,  0,      691,         0],
		[2, -1,  0, -2,      596,         0],
		[4,  0,  1,  0,      549,     -1423],
		[0,  0,  4,  0,      537,     -1117],
		[4, -1,  0,  0,      520,     -1571],
		[1,  0, -2,  0,     -487,     -1739],
		[2,  1,  0, -2,     -399,         0],
		[0,  0,  2, -2,     -381,     -4421],
		[1,  1,  1,  0,      351,         0],
		[3,  0, -2,  0,     -340,         0],
		[4,  0, -3,  0,      330,         0],
		[2, -1,  2,  0,      327,         0],
		[0,  2,  1,  0,     -323,      1165],
		[1,  1, -1,  0,      299,         0],
		[2,  0,  3,  0,      294,         0],
		[2,  0, -1, -2,        0,      8752]];

	// Periodic terms for the latitude of the Moon (sigmaB)
	// The unit is 0.000001 degree
	var table47B = [
		[0,  0,  0,  1,  5128122],
		[0,  0,  1,  1,   280602],
		[0,  0,  1, -1,   277693],
		[2,  0,  0, -1,   173237],
		[2,  0, -1,  1,    55413],
		[2,  0, -1, -1,    46271],
		[2,  0,  0,  1,    32573],
		[0,  0,  2,  1,    17198],
		[2,  0,  1, -1,     9266],
		[0,  0,  2, -1,     8822],
		[2, -1,  0, -1,     8216],
		[2,  0, -2, -1,     4324],
		[2,  0,  1,  1,     4200],
		[2,  1,  0, -1,    -3359],
		[2, -1, -1,  1,     2463],
		[2, -1,  0,  1,     2211],
		[2, -1, -1, -1,     2065],
		[0,  1, -1, -1,    -1870],
		[4,  0, -1, -1,     1828],
		[0,  1,  0,  1,    -1794],
		[0,  0,  0,  3,    -1749],
		[0,  1, -1,  1,    -1565],
		[1,  0,  0,  1,    -1491],
		[0,  1,  1,  1,    -1475],
		[0,  1,  1, -1,    -1410],
		[0,  1,  0, -1,    -1344],
		[1,  0,  0, -1,    -1335],
		[0,  0,  3,  1,     1107],
		[4,  0,  0, -1,     1021],
		[4,  0, -1,  1,      833],
		[0,  0,  1, -3,      777],
		[4,  0, -2,  1,      671],
		[2,  0,  0, -3,      607],
		[2,  0,  2, -1,      596],
		[2, -1,  1, -1,      491],
		[2,  0, -2,  1,     -451],
		[0,  0,  3, -1,      439],
		[2,  0,  2,  1,      422],
		[2,  0, -3, -1,      421],
		[2,  1, -1,  1,     -366],
		[2,  1,  0,  1,     -351],
		[4,  0,  0,  1,      331],
		[2, -1,  1,  1,      315],
		[2, -2,  0, -1,      302],
		[0,  0,  1,  3,     -283],
		[2,  1,  1, -1,     -229],
		[1,  1,  0, -1,      223],
		[1,  1,  0,  1,      223],
		[0,  1, -2, -1,     -220],
		[2,  1, -1, -1,     -220],
		[1,  0,  1,  1,     -185],
		[2, -1, -2, -1,      181],
		[0,  1,  2,  1,     -177],
		[4,  0, -2, -1,      176],
		[4, -1, -1, -1,      166],
		[1,  0,  1, -1,     -164],
		[4,  0,  1, -1,      132],
		[1,  0, -1, -1,     -119],
		[4, -1,  0, -1,      115],
		[2, -2,  0,  1,      107]];

	// Periodic terms for the nutation in longitude and in obliquity.
	// Units is 0.0001
	var table22A = [
		[ 0,  0,  0,  0,  1, -171996, -174.2, 92025,  8.9],
		[-2,  0,  0,  2,  2,  -13187,   -1.6,  5736, -3.1],
		[ 0,  0,  0,  2,  2,   -2274,   -0.2,   977, -0.5],
		[ 0,  0,  0,  0,  0,    2062,    0.2,  -895,  0.5],
		[ 0,  1,  0,  0,  0,    1426,   -3.4,    54, -0.1],
		[ 0,  0,  1,  0,  0,     712,    0.1,    -7,  0.0],
		[-2,  1,  0,  2,  2,    -517,    1.2,   224, -0.6],
		[ 0,  0,  0,  2,  1,    -386,   -0.4,   200,  0.0],
		[ 0,  0,  1,  2,  2,    -301,    0.0,   129, -0.1],
		[-2, -1,  0,  2,  2,     217,   -0.5,   -95,  0.3],
		[-2,  0,  1,  0,  0,    -158,    0.0,     0,  0.0],
		[-2,  0,  0,  2,  1,     129,    0.1,   -70,  0.0],
		[ 0,  0, -1,  2,  2,     123,    0.0,   -53,  0.0],
		[ 2,  0,  0,  0,  0,      63,    0.0,     0,  0.0],
		[ 0,  0,  1,  0,  1,      63,    0.1,   -33,  0.0],
		[ 2,  0, -1,  2,  2,     -59,    0.0,    26,  0.0],
		[ 0,  0, -1,  0,  1,     -58,   -0.1,    32,  0.0],
		[ 0,  0,  1,  2,  1,     -51,    0.0,    27,  0.0],
		[-2,  0,  2,  0,  0,      48,    0.0,     0,  0.0],
		[ 0,  0, -2,  2,  1,      46,    0.0,   -24,  0.0],
		[ 2,  0,  0,  2,  2,     -38,    0.0,    16,  0.0],
		[ 0,  0,  2,  2,  2,     -31,    0.0,    13,  0.0],
		[ 0,  0,  2,  0,  0,      29,    0.0,     0,  0.0],
		[-2,  0,  1,  2,  2,      29,    0.0,   -12,  0.0],
		[ 0,  0,  0,  2,  0,      26,    0.0,     0,  0.0],
		[-2,  0,  0,  2,  0,     -22,    0.0,     0,  0.0],
		[ 0,  0, -1,  2,  1,      21,    0.0,   -10,  0.0],
		[ 0,  2,  0,  0,  0,      17,   -0.1,     0,  0.0],
		[ 2,  0, -1,  0,  1,      16,    0.0,     8,  0.0],
		[-2,  2,  0,  2,  2,     -16,    0.1,     7,  0.0],
		[ 0,  1,  0,  0,  1,     -15,    0.0,     9,  0.0],
		[-2,  0,  1,  0,  1,     -13,    0.0,     7,  0.0],
		[ 0, -1,  0,  0,  1,     -12,    0.0,     6,  0.0],
		[ 0,  0,  2, -2,  0,      11,    0.0,     0,  0.0],
		[ 2,  0, -1,  2,  1,     -10,    0.0,     5,  0.0],
		[ 2,  0,  1,  2,  2,      -8,    0.0,     3,  0.0],
		[ 0,  1,  0,  2,  2,       7,    0.0,    -3,  0.0],
		[-2,  1,  1,  0,  0,      -7,    0.0,     0,  0.0],
		[ 0, -1,  0,  2,  0,      -7,    0.0,     3,  0.0],
		[ 2,  0,  0,  2,  1,      -7,    0.0,     3,  0.0],
		[ 2,  0,  1,  0,  0,       6,    0.0,     0,  0.0],
		[-2,  0,  2,  2,  2,       6,    0.0,    -3,  0.0],
		[-2,  0,  1,  2,  1,       6,    0.0,    -3,  0.0],
		[ 2,  0, -2,  0,  1,      -6,    0.0,     3,  0.0],
		[ 2,  0,  0,  0,  1,      -6,    0.0,     3,  0.0],
		[ 0, -1,  1,  0,  0,       5,    0.0,     0,  0.0],
		[-2, -1,  0,  2,  1,      -5,    0.0,     3,  0.0],
		[-2,  0,  0,  0,  1,      -5,    0.0,     3,  0.0],
		[ 0,  0,  2,  2,  1,      -5,    0.0,     3,  0.0],
		[-2,  0,  2,  0,  1,       4,    0.0,     0,  0.0],
		[-2,  1,  0, -2,  1,       4,    0.0,     0,  0.0],
		[ 0,  0,  1, -2,  0,       4,    0.0,     0,  0.0],
		[-1,  0,  1,  0,  0,      -4,    0.0,     0,  0.0],
		[-2,  1,  0,  0,  0,      -4,    0.0,     0,  0.0],
		[ 1,  0,  0,  0,  0,      -4,    0.0,     0,  0.0],
		[ 0,  0,  1,  2,  0,       3,    0.0,     0,  0.0],
		[ 0,  0, -2,  2,  2,      -3,    0.0,     0,  0.0],
		[-1, -1,  1,  0,  0,      -3,    0.0,     0,  0.0],
		[ 0,  1,  1,  0,  0,      -3,    0.0,     0,  0.0],
		[ 0, -1,  1,  2,  2,      -3,    0.0,     0,  0.0],
		[ 2, -1, -1,  2,  2,      -3,    0.0,     0,  0.0],
		[ 0,  0,  3,  2,  2,      -3,    0.0,     0,  0.0],
		[ 2, -1,  0,  2,  2,      -3,    0.0,     0,  0.0]];

	// Chapter 22
	function nutationAndObliquity(T, lunarContext) {
		
		// Mean Elongation Of The Moon From The Sun
		var D = 297.85036 + 445267.111480 * T - 0.0019142 * (T * T) + (T * T * T) / 189474;

		// Mean Anomaly of the Sun (Earth)
		var M = 357.52772 + 35999.050340 * T - 0.0001603 * (T * T) - (T * T * T) / 300000;



		// Mean Anomaly of the Moon
		var M_ = 134.96298 + 477198.867398 * T + 0.0086972 * (T * T) + (T * T * T) / 56250;



		// Moon's Argument of Latitude (ch. 22)
		var F = 93.27191 + 483202.017538 * T - 0.0036825 * (T * T) + (T * T * T) / 327270;



		// Longitude of teh ascending node of the Moon's mean orbit on the ecliptic
		// Measured from the mean equinox of the date (ch. 22)
		var Ω = 125.04452 - 1934.136261 * T + 0.0020708 * (T * T) + (T * T * T) / 450000;




		// Mean Longitude of the Sun
		var L = 280.4665 + 36000.7698 * T;

		// Mean Longitude of the Moon
		var L_ = 218.3165 + 481267.8813 * T;

		// Time measured in units of 10000 Julian years since J2000.0
		var U = T / 100;
		
		// Mean obliquity of the ecliptic
		var ε0 = degToDecimal(23, 26, 21.448)
						-degToDecimal(0, 0, 46.8150) * T
						-1.55 * pow(U, 2)
						+ 1999.25 * pow(U, 3)
						- 51.38 * pow(U, 4)
						- 249.67 * pow(U, 5)
						- 39.05 * pow(U, 6)
						+ 7.12 * pow(U, 7)
						+ 27.87 * pow(U, 8)
						+ 5.79 * pow(U, 9)
						+ 2.45 * pow(U, 10);
		
		D = deg(D);
		M = deg(M);
		M_ = deg(M_);
		F = deg(F);
		Ω = deg(Ω);


		// Nutation in Longitude Limited accuracy:
		var Δψ = -17.20 * sin(Ω) - 1.32 * sin(2 * L) - 0.23 * sin(2 * L_) + 0.21 * sin(2 * Ω);
		
		// Nutation in Obliquity Limited accuracy:
		var Δε = 9.20 * cos(Ω) + 0.57 * cos(2 * L) + 0.10 * cos(2 * L_) - 0.09 * cos(2 * Ω);
		
		// True obliquity of the ecliptic
		var ε = ε0 + Δε / 60 / 60;
		
		/*
		// Nutation in Longitude
		var deltaPsi = 0
		
		// Nutation in Obliquity
		var deltaEpsilon = 0;
		
		for (var i = 0; i < table22A.length; i++) {
			var row = table22A[i];
			
			var arg = row[0] * D + row[1] * M + row[2] * M_ + row[3] * F + row[4] * omega;
			
			var v0 = (row[5]) ? row[5] : 1;
			var v1 = (row[6]) ? row[6]  * T : 1;
			
			var v2 = (row[7]) ? row[7] : 1;
			var v3 = (row[8]) ? row[8] * T : 1;
			
			deltaPsi += v0 * sin(arg) + v1 * sin(arg);
			deltaEpsilon += v2 * cos(arg) + v3 * cos(arg);
		}
		*/
		
		

		var obliquity = {
			T : T,
			D : D,
			M : M,
			M_ : M_,
			F : F,
			Ω : Ω,
			Δψ : Δψ,
			Δε : deg(Δε),
			ε0 : ε0,
			ε : ε
		};
		
		if (lunarContext) {
			lunarContext.obliquity = obliquity;
		}
		
		return obliquity;

	}




	// Chapter 47
	function positionOfTheMoon(T, lunarContext) {
		
		var nutation;
		if (!lunarContext || !lunarContext.nutation || lunarContext.nutation.T != T) {
			nutation = nutationAndObliquity(T, lunarContext);
		} else {
			nutation = lunarContext.nutation;
		}
		
		// Mean Longitude of the Sun (ch. 22)
		var L = 280.4665 + 36000.7698 * T;
		
		// Mean Longitude of the Moon (ch. 47.1), or Mean Equinox of the Date, including the constant term of the 
		// effect of the light time (-0.70)
		var L_ = 218.3164477 + 481267.88123421 * T - 0.0015786 * (T * T) + (T * T * T) / 538841 - (T * T * T * T) / 65194000;
		
		// Mean Elongation of the Moon (ch. 47.2)
		var D = 297.8501921 + 445267.1114034 * T - 0.0018819 * (T * T) + (T * T * T) / 545868 - (T * T * T * T) / 113065000;

		// Mean Anomaly of the Sun (ch. 47.3)
		var M = 357.5291092 + 35999.0502909 * T - 0.0001536 * (T * T) + (T * T * T) / 24490000;
		
		// Mean Anomaly of the Moon (ch. 47.4)
		var M_ = 134.9633964 + 477198.8675005 * T + 0.0087414 * (T * T) + (T * T * T) / 69699 - (T * T * T *T) / 14712000;
		
		// Moon's Argument of Latitude (mean distance of the Moon from it's ascending node) (ch. 47.5)
		var F = 93.2720950 + 483202.0175233 * T - 0.0036539 * (T * T) - (T * T * T) / 3526000 + (T * T * T * T) / 863310000;
		
		// Longitude of the Mean Ascending Node (ch. 47.7)
		var Ω = 125.0445479 - 1934.1362891 * T + 0.0020754 * (T * T) + (T * T * T) / 467441 - (T * T * T * T) / 60616000;
		
		var A1 = 119.75 + 131.849 * T;
		var A2 = 53.09 + 479264.290 * T;
		var A3 = 313.45 + 481266.484 * T;
		
		// Eccentricity of the Earth's orbit around the Sun
		var E = 1 - 0.002516 * T - 0.0000074 * (T * T);
		
		L = deg(L);
		L_ = deg(L_);
		D = deg(D);
		M = deg(M);
		M_ = deg(M_);
		F = deg(F);
		A1 = deg(A1);
		A2 = deg(A2);
		A3 = deg(A3);
		
		// Longitude of the Moon, unit is 0.000001 degrees
		var Σl = 0;
		var Σr = 0;
		var Σb = 0;
		
		for (var i = 0; i < table47A.length; i++) {
			var row = table47A[i];
			var e;
			if (row[1] == 1 || row[1] == -1) {
				e = E;
			} else if (row[1] == 2 || row[1] == -2) {
				e = E * E;
			} else {
				e = 1;
			}
			
			Σl += row[4] * e * sin(row[0] * D + row[1] * M + row[2] * M_ + row[3] * F);
			Σr += row[5] * e * cos(row[0] * D + row[1] * M + row[2] * M_ + row[3] * F);		
			
		}
		
		Σl += 3958 * sin(A1)
				+ 1962 * sin(L_ - F)
				+ 318 * sin(A2);
		
		
		for (var i = 0; i < table47B.length; i++) {
			var row = table47B[i];
			var e;
			if (row[1] == 1 || row[1] == -1) {
				e = E;
			} else if (row[1] == 2 || row[1] == -2) {
				e = E * E;
			} else {
				e = 1;
			}
			
			Σb += row[4] * e * sin(row[0] * D + row[1] * M + row[2] * M_ + row[3] * F);
		}
		
		Σb += -2235 * sin(L_)
				+ 382 * sin(A3)
				+ 175 * sin(A1 - F)
				+ 175 * sin(A1 + F)
				+ 127 * sin(L_ - M_)
				- 115 * sin(L_ + M_);
		
		// Geocentric longitude of the center of the Moon
		var λ = L_ + Σl / 1000000;
		
		
		
		
		// Geocentric latitude of the center of the Moon
		var β = Σb / 1000000;
		
		// Distance in kilometers between the centers of the Earth and Moon.
		var Δ = 385000.56 + Σr / 1000;
		
		// Equatorial horizontal parallax
		var π = asin(6378.14 / Δ);

		
		
		// Nutation in Longitude
		var Δψ = nutation.Δψ / 60 / 60;
		
		// Nutation in Obliquity
		var Δε = nutation.Δε;

		

		// Time measured in units of 10000 Julian years since J2000.0
		var U = T / 100;

		
		var apparentλ = λ + Δψ;

		// Mean obliquity of the ecliptic
		var ε0 = nutation.ε0;
		
		// True obliquity of the ecliptic
		var ε = nutation.ε;
		
		// Apparent right ascension (ch. 13.3)
		var X = cos(λ);
		var Y = (sin(λ) * cos(ε) - tan(β) * sin(ε));
		var α = deg(atan2(Y, X));
		//var α = atan((sin(λ) * cos(ε) - tan(β) * sin(ε)) / cos(λ));
		
		// Apparent declination (ch. 13.4)
		var δ = asin(sin(β) * cos(ε) + cos(β) * sin(ε) * sin(λ));
		
		// Mean perigee of the lunar orbit
		var Π = 83.3532465 
					+ 4096.0137287 * T 
					- 0.0103200 * pow(T, 2)
					- pow(T, 3) / 80053
					+ pow(T, 4) / 18999000;

		var position = {
			T : T,
			Σl : Σl, 
			Σr : Σr, 
			Σb : Σb,
			λ : λ,
			apparentλ : apparentλ,
			β   : β,
			Δ  : Δ,
			Ω  : Ω,
			Δψ : Δψ,
			Δε : Δε,
			ε0 : ε0,
			ε : ε,
			α  : α,
			αBy15 : α / 15,
			δ : δ,
			Π : Π,
			π     : π,
			E      : E,
			L      : L,
			L_     : L_,
			D      : D,
			M      : M,
			M_     : M_,
			F      : F,
			A1     : A1,
			A2     : A2,
			A3     : A3
		};
		
		if (lunarContext) {
			lunarContext.position = position;
		}
		
		return position;
	}





	function opticalLibrationsOfTheMoon(T, lunarContext) {
		
		var position;
		if (!lunarContext || !lunarContext.position || lunarContext.position.T != T) {
			position = positionOfTheMoon(T, lunarContext);
		} else {
			position = lunarContext.position;
		}

		var nutation;
		if (!lunarContext || !lunarContext.obliquity || lunarContext.obliquity.T != T) {
			nutation = nutationAndObliquity(T, lunarContext);
		} else {
			nutation = lunarContext.obliquity;
		}

		// Inclination of the mean lunar equator to the ecliptic
		var I = 1.54242; 	
		
		
		var W = position.λ - secToDecimal(nutation.Δψ) - nutation.Ω;
		W = deg(W);
		
		var X = (sin(W) * cos(position.β) * cos(I) - sin(position.β) * sin(I));
		var Y = cos(W) * cos(position.β);
		var A = deg(atan2(X, Y), 360);
		//var A = atan((sin(W) * cos(position.β) * cos(I) - sin(position.β) * sin(I)) / (cos(W) * cos(position.β)))
		
		// Optical libration in longitude
		var l_ = A - position.F;
		
		// Optical libration in latitude
		var b_ = asin(-sin(W) * cos(position.β) * sin(I) - sin(position.β) * cos(I));
		
		var optLibr = {
			T : T,
			I : I,
			W : W,
			A : A,
			l_ : l_,
			b_ : b_
		};
		
		if (lunarContext) {
			lunarContext.optLibr = optLibr;
		}
		
		return optLibr;
	}




	function physicalLibrationsOfTheMoon(T, lunarContext) {
		
		var optLibr, position, nutation;
		
		if (!lunarContext || !lunarContext.optLibr || lunarContext.optLibr.T != T) {
			optLibr = opticalLibrationsOfTheMoon(T, lunarContext);
		} else {
			optLibr = lunarContext.optLibr;
		}
		
		if (!lunarContext || !lunarContext.position || lunarContext.position.T != T) {
			position = positionOfTheMoon(T, lunarContext);
		} else {
			position = lunarContext.position;
		}
		
		if (!lunarContext || !lunarContext.obliquity || lunarContext.obliquity.T != T) {
			nutation = nutationAndObliquity(T, lunarContext);
		} else {
			nutation = lunarContext.obliquity;
		}
		
		
		var A = optLibr.A;
		var M_ = position.M_;
		var M = position.M;
		var F = position.F;
		var D = position.D;
		var E = position.E;
		var Ω = nutation.Ω;
		
		var b_ = optLibr.b_;
		
		var K1 = 119.75 + 131.849 * T;
		var K2 = 72.56 + 20.186 * T;
		
		var ρ = - 0.02752 * cos(M_)
				- 0.02245 * sin(F)
				+ 0.00684 * cos(M_ - 2 * F)
				- 0.00293 * cos(2 * F)
				- 0.00085 * cos(2 * F - 2 * D)
				- 0.00054 * cos(M_ - 2 * D)
				- 0.00020 * sin(M_ + F)
				- 0.00020 * cos(M_ + 2 * F)
				- 0.00020 * cos(M_ - F)
				+ 0.00014 * cos(M_ + 2 * F - 2 * D);
				
		
		var σ = - 0.02816 * sin(M_)
				+ 0.02244 * cos(F)
				- 0.00682 * sin(M_ - 2 * F)
				- 0.00279 * sin(2 * F)
				- 0.00083 * sin(2 * F - 2 * D)
				+ 0.00069 * sin(M_ - 2 * D)
				+ 0.00040 * cos(M_ + F)
				- 0.00025 * sin(2 * M_)
				- 0.00023 * sin(M_ + 2 * F)
				+ 0.00020 * cos(M_ - F)
				+ 0.00019 * sin(M_ - F)
				+ 0.00013 * sin(M_ + 2 * F - 2 * D)
				- 0.00010 * cos(M_ - 3 * F);
		
		var τ = + 0.02520 * E * sin(M)
				+ 0.00473 * sin(2 * M_ - 2 * F)
				- 0.00467 * sin(M_)
				+ 0.00396 * sin(K1)
				+ 0.00276 * sin(2 * M_ - 2 * D)
				+ 0.00196 * sin(Ω)
				- 0.00183 * cos(M_ - F)
				+ 0.00115 * sin(M_ - 2 * D)
				- 0.00096 * sin(M_ - D)
				+ 0.00046 * sin(2 * F - 2 * D)
				- 0.00039 * sin(M_ - F)
				- 0.00032 * sin(M_ - M - D)
				+ 0.00027 * sin(2 * M_ - M - 2 * D)
				+ 0.00023 * sin(K2)
				- 0.00014 * sin(2 * D)
				+ 0.00014 * cos(2 * M_ - 2 * F)
				- 0.00012 * sin(M_ - 2 * F)
				- 0.00012 * sin(2 * M_)
				+ 0.00011 * sin(2 * M_ - 2 * M - 2 * D);
		
		var l__ = -τ + (ρ * cos(A) + σ * sin(A)) * tan(b_);
		var b__ = σ * cos(A) - ρ * sin(A);
		
		
		var physLibr = {
			M : M,
			M_ : M_,
			F : F,
			D : D,
			E : E,
			A : A,
			ρ : ρ,
			σ : σ,
			τ : τ,
			K1 : K1,
			K2 : K2,
			l__ : l__,
			b__ : b__
		};
		
		if (lunarContext) {
			lunarContext.physLibr = physLibr;
		}
		
		return physLibr;
		
	}



	function totalLibrationsOfTheMoon(T, lunarContext) {
		
		var optLibr, physLibr;
		
		if (!lunarContext || !lunarContext.optLibr || lunarContext.optLibr.T != T) {
			optLibr = opticalLibrationsOfTheMoon(T, lunarContext);
		} else {
			optLibr = lunarContext.optLibr;
		}
		
		if (!lunarContext || !lunarContext.physLibr || lunarContext.physLibr.T != T) {
			physLibr = physicalLibrationsOfTheMoon(T, lunarContext);
		} else {
			physLibr = lunarContext.physLibr;
		}
		
		var l = optLibr.l_ + physLibr.l__;
		var b = optLibr.b_ + physLibr.b__;
		
		
		var ttlLibr = {
			T : T,
			l : l,
			b : b
		};
		
		if (lunarContext) {
			lunarContext.ttlLibr = ttlLibr;
		}
		
		return ttlLibr;
		
	}

	function selenographicPositionOfTheSun(T, lunarContext) {
		
		var position, sunPos, nutation, physLibr;
		
		if (!lunarContext || !lunarContext.position || lunarContext.position.T != T) {
			position = positionOfTheMoon(T, lunarContext);
		} else {
			position = lunarContext.position;
		}
		
		if (!lunarContext || !lunarContext.sunPosition || lunarContext.sunPosition.T != T) {
			sunPos = positionOfTheSun(T, lunarContext);
		} else {
			sunPos = lunarContext.sunPosition;
		}
		
		if (!lunarContext || !lunarContext.obliquity || lunarContext.obliquity.T != T) {
			nutation = nutationAndObliquity(T, lunarContext);
		} else {
			nutation = lunarContext.obliquity;
		}
		
		if (!lunarContext || !lunarContext.physLibr || lunarContext.physLibr.T != T) {
			physLibr = physicalLibrationsOfTheMoon(T, lunarContext);
		} else {
			physLibr = lunarContext.physLibr;
		}
		
		
		// Geocentric right ascension of the Sun
		var α0 = sunPos.α;
		
		// Geocentric declination of the Sun
		var δ0 = sunPos.δ;
		
		// Geocentric longitude of Sun
		var λ0 = sunPos.O;

		// Geocentric right ascension of the Moon
		var α = position.α;
		
		// Geocentric declination of the Moon
		var δ = position.δ;
		
		// Geocentric longitude of Moon
		var λ = position.λ;
		
		
		// Distance from the Earth to the Sun
		var R = sunPos.R * 149597870.700;
		
		// Distance from the Earth to the Moon
		var Δ = position.Δ;
		
		// Geocentric latitude of the center of the Moon
		var β = position.β;
		
		
		
		var λH = λ0 + 180 + (Δ/R) * 57.296 * cos(β) * sin(λ0 - λ);
		
		var βH =  Δ / R * β;
		
		
		
		
		// Inclination of the mean lunar equator to the ecliptic
		var I = 1.54242; 	
		
		var W = λH - secToDecimal(nutation.Δψ) - nutation.Ω;
		W = deg(W);
		
		var X = (sin(W) * cos(βH) * cos(I) - sin(βH) * sin(I));
		var Y = cos(W) * cos(βH);
		var A = deg(atan2(X, Y), 360);

		// Optical libration in longitude
		var l_0 = A - position.F;
		
		// Optical libration in latitude
		var b_0 = asin(-sin(W) * cos(βH) * sin(I) - sin(βH) * cos(I));
		
		
		var l__0 = -physLibr.τ + (physLibr.ρ * cos(A) + physLibr.σ * sin(A)) * tan(b_0);
		var b__0 = physLibr.σ * cos(A) - physLibr.ρ * sin(A)
		
		var l0 = l_0 + l__0;
		var b0 = b_0 + b__0;;
		
		// Selenographic colongitude of the Sun
		var c0;
		
		if (l0 < 90) {
			c0 = 90 - l0;
		} else {
			c0 = 450 - l0;
		}

		
		var seleSunPosition = {
			T : T,
			λH : λH,
			βH : βH,
			l0 : l0,
			b0 : b0,
			c0 : c0,
			l_0 : l_0,
			b_0 : b_0,
			l__0 : l__0,
			b__0 : b__0,
			W : W,
			A : A,
			R : R,
			Δ : Δ
		};
		
		if (lunarContext) {
			lunarContext.seleSunPosition = seleSunPosition;
		}
		
		return seleSunPosition;
		
	}
	
	function phaseOfTheMoon(T, lunarContext) {
			
		var seleSunPosition;
		
		if (!lunarContext || !lunarContext.seleSunPosition || lunarContext.seleSunPosition.T != T) {
			seleSunPosition = selenographicPositionOfTheSun(T, lunarContext);
		} else {
			seleSunPosition = lunarContext.seleSunPosition;
		}
		
		
		
		var p = "";
		
		
		var c0 = seleSunPosition.c0;
		
		if (c0 >= 355 || c0 < 5) {
			p = "First Quarter";
		} else if (c0 < 85) {
			p = "Waxing Gibbous";
		} else if (c0 >= 85 && c0 < 95) {
			p = "Full Moon";
		} else if (c0 < 175) {
			p = "Waning Gibbous";
		} else if (c0 >= 175 && c0 < 185) {
			p = "Last Quarter";
		} else if (c0 < 265) {
			p = "Waning Crescent";
		} else if (c0 >= 265 && c0 < 275) {
			p = "New Moon";
		} else if (c0 < 355) {
			p = "Waxing Crescent";
		}
		
		
		var phase = {
			phase : p
		};
		
		if (lunarContext) {
			lunarContext.phase = phase;
		}
		
		return phase;
	}


	function positionAngleOfTheMoon(T, lunarContext) {
		
		var nutation, position, physLibr, ttlLibr;
		
		if (!lunarContext || !lunarContext.obliquity || lunarContext.obliquity.T != T) {
			nutation = nutationAndObliquity(T, lunarContext);
		} else {
			nutation = lunarContext.obliquity;
		}
		
		if (!lunarContext || !lunarContext.position || lunarContext.position.T != T) {
			position = positionOfTheMoon(T, lunarContext);
		} else {
			position = lunarContext.position;
		}
		
		if (!lunarContext || !lunarContext.physLibr || lunarContext.physLibr.T != T) {
			physLibr = physicalLibrationsOfTheMoon(T, lunarContext);
		} else {
			physLibr = lunarContext.physLibr;
		}
		
		if (!lunarContext || !lunarContext.ttlLibr || lunarContext.ttlLibr.T != T) {
			ttlLibr = totalLibrationsOfTheMoon(T, lunarContext);
		} else {
			ttlLibr = lunarContext.ttlLibr;
		}
		
		var b = ttlLibr.b;
		
		var Ω = nutation.Ω;
		
		// Inclination of the mean lunar equator to the ecliptic
		var I = 1.54242
		
		var Δψ = nutation.Δψ;
		
		var ρ = physLibr.ρ;
		
		var ε = position.ε;
		
		var α = position.α;
		
		var σ = physLibr.σ;
		
		var V = Ω + Δψ + σ / sin(I);
		
		var Y = sin(I + ρ) * sin(V);
		
		var X = sin(I + ρ) * cos(V) * cos(ε) - cos(I + ρ) * sin(ε);
		
		var ω = atan2(Y, X);
		
		var P = asin((sqrt(pow(X, 2) + pow(Y, 2)) * cos(α - ω)) / cos(b));
		
		var posAngle = {
			P : P
		};
		
		if (lunarContext) {
			lunarContext.posAngle = posAngle;
		}
		
		return posAngle;
		
	}



	function illuminatedFractionOfTheMoonsDisk(T, lunarContext) {
		
		var position, sunPos;
		
		if (!lunarContext || !lunarContext.position || lunarContext.position.T != T) {
			position = positionOfTheMoon(T, lunarContext);
		} else {
			position = lunarContext.position;
		}
		
		if (!lunarContext || !lunarContext.sunPosition || lunarContext.sunPosition.T != T) {
			sunPos = positionOfTheSun(T, lunarContext);
		} else {
			sunPos = lunarContext.sunPosition;
		}
		
		
		// Geocentric right ascension of the Sun
		var α0 = sunPos.αApp;
		
		// Geocentric declination of the Sun
		var δ0 = sunPos.δApp;
		
		// Geocentric longitude of Sun
		var λ0 = sunPos.O;
		
		// Geocentric right ascension of the Moon
		var α = position.α;
		
		// Geocentric declination of the Moon
		var δ = position.δ;
		
		// Geocentric longitude of Moon
		var λ = position.λ;
		
		// Geocentric elongation of the Moon from the Sun
		var ψ = acos(sin(δ0) * sin(δ) + cos(δ0) * cos(δ) * cos(α0 - α));
		
		// Distance from the Earth to the Sun
		var R = sunPos.R * 149597870.700;
		
		// Distance from the Earth to the Moon
		var Δ = position.Δ ;
		
		var Y = R * sin(ψ);
		var X =  Δ - R * cos(ψ)
		
		// Phase angle (Selenocentric elongation of the Earth from the Sun)
		var i = atan2(Y, X) ;
		
		
		var D = position.D;
		
		var M = position.M;
		
		var M_ = position.M_;
		
		
		// Phase angle (Selenocentric elongation of the Earth from the Sun)
		// Less accurate method
		/*
		var i = 180 - D
				- 6.289 * sin(M_)
				+ 2.100 * sin(M)
				- 1.274 * sin(2 * D - M_)
				- 0.658 * sin(2 * D)
				- 0.214 * sin(2 * M_)
				- 0.110 * sin(D);
		*/
		
		// Illuminated fraction of the Moon's disk
		var k = (1 + cos(i)) / 2;
		
		var Y = cos(δ0) * sin(α0 - α);
		var X = sin(δ0) * cos(δ) - cos(δ0) * sin(δ) * cos(α0 - α);
		
		// Position angle of the Moon's bright limb
		var χ = atan2(Y, X);
		
		
		var illumFrac = {
			T : T,
			k : k,
			i : i,
			χ : χ
		};
		
		if (lunarContext) {
			lunarContext.illumFrac = illumFrac;
		}
		
		return illumFrac;
	}



	function calculateAll(jd) {
		var T = (jd - 2451545) / 36525; // Julian Centuries since Epoch JD2000.0
		
		var context = {T : T};
		
		positionOfTheSun(T, context);
		nutationAndObliquity(T, context);
		positionOfTheMoon(T, context);
		opticalLibrationsOfTheMoon(T, context);
		physicalLibrationsOfTheMoon(T, context);
		totalLibrationsOfTheMoon(T, context);
		positionAngleOfTheMoon(T, context);
		illuminatedFractionOfTheMoonsDisk(T, context);
		selenographicPositionOfTheSun(T, context);
		phaseOfTheMoon(T, context);
		
		return context;
	}

	return {
		degToDecimal : degToDecimal,
		secToDecimal : secToDecimal,
		positionOfTheSun : positionOfTheSun,
		nutationAndObliquity : nutationAndObliquity,
		positionOfTheMoon : positionOfTheMoon,
		opticalLibrationsOfTheMoon : opticalLibrationsOfTheMoon,
		physicalLibrationsOfTheMoon : physicalLibrationsOfTheMoon,
		totalLibrationsOfTheMoon : totalLibrationsOfTheMoon,
		positionAngleOfTheMoon : positionAngleOfTheMoon,
		illuminatedFractionOfTheMoonsDisk : illuminatedFractionOfTheMoonsDisk,
		selenographicPositionOfTheSun : selenographicPositionOfTheSun,
		phaseOfTheMoon : phaseOfTheMoon,
		calculateAll : calculateAll
	};
};

/* File: Procession.js */


KMG.Procession = {};

/*
0 Pc;
1 Qc;
2 Ps;
3 Qs;
4 period;
*/
KMG.Procession.EclipticPrecessionTerms =
[
    [   486.230527, 2559.065245, -2578.462809,   485.116645, 2308.98 ],
    [  -963.825784,  247.582718,  -237.405076,  -971.375498, 1831.25 ],
    [ -1868.737098, -957.399054,  1007.593090, -1930.464338,  687.52 ],
    [ -1589.172175,  493.021354,  -423.035168, -1634.905683,  729.97 ],
    [   429.442489, -328.301413,   337.266785,   429.594383,  492.21 ],
    [ -2244.742029, -339.969833,   221.240093, -2131.745072,  708.13 ]
];

/*
0 pc;
1 epsc;
2 ps;
3 epss;
4 period;
*/
KMG.Procession.PrecessionTerms =
[
    [ -6180.062400,   807.904635, -2434.845716, -2056.455197,  409.90 ],
    [ -2721.869299,  -177.959383,   538.034071,  -912.727303,  396.15 ],
    [  1460.746498,   371.942696, -1245.689351,   447.710000,  536.91 ],
    [ -1838.488899,  -176.029134,   529.220775,  -611.297411,  402.90 ],
    [   949.518077,   -89.154030,   277.195375,   315.900626,  417.15 ],
    [    32.701460,  -336.048179,   945.979710,    12.390157,  288.92 ],
    [   598.054819,   -17.415730,  -955.163661,   -15.922155, 4042.97 ],
    [  -293.145284,   -28.084479,    93.894079,  -102.870153,  304.90 ],
    [    66.354942,    21.456146,     0.671968,    24.123484,  281.46 ],
    [    18.894136,    30.917011,  -184.663935,     2.512708,  204.38 ]
];


KMG.Procession.EclipticPrecession_P03LP = function(T)
{

    var T2 = T * T;
    var T3 = T2 * T;

	var PA = (5750.804069
               +  0.1948311 * T
               -  0.00016739 * T2
               -  4.8e-8 * T3);
    var QA = (-1673.999018
               +   0.3474459 * T
               +   0.00011243 * T2
               -   6.4e-8 * T3);


    var nTerms = KMG.Procession.EclipticPrecessionTerms.length / KMG.Procession.EclipticPrecessionTerms[0].length;
		
    for (var i = 0; i < nTerms; i++) {
        var p = KMG.Procession.EclipticPrecessionTerms[i];
        var theta = 2.0 * Math.PI * T / p[4];
        var s = Math.sin(theta);
        var c = Math.cos(theta);
        PA += p[0] * c + p[2] * s;
        QA += p[1] * c + p[3] * s;
    }

    return {
		PA : PA,
		QA : QA
	};
};




KMG.Procession.PrecObliquity_P03LP = function(T)
{

    var T2 = T * T;
    var T3 = T2 * T;

    var pA   = (  7907.295950
                   + 5044.374034 * T
                   -    0.00713473 * T2
                   +    6e-9 * T3);
    var epsA = (  83973.876448
                   -     0.0425899 * T
                   -     0.00000113 * T2);

    var nTerms = KMG.Procession.PrecessionTerms.length / KMG.Procession.PrecessionTerms[0].length;
    

    for (var i = 0; i < nTerms; i++) {
		var p = KMG.Procession.PrecessionTerms[i];
        
        var theta = 2.0 * Math.PI * T / p[4];
        var s = Math.sin(theta);
        var c = Math.cos(theta);
        pA   += p[0] * c   + p[2] * s;
        epsA += p[1] * c + p[3] * s;
    }

    return {
		pA : pA,
		epsA : epsA
	};
};


KMG.Procession.EquatorialPrecessionAngles_P03 = function(T)
{
    var T2 = T * T;
    var T3 = T2 * T;
    var T4 = T3 * T;
    var T5 = T4 * T;
    
    var zetaA =  (     2.650545
                   + 2306.083227 * T
                   +    0.2988499 * T2
                   +    0.01801828 * T3
                   -    0.000005971 * T4
                   -    0.0000003173 * T5);
    var zA =     ( -    2.650545 
                    + 2306.077181 * T
                    +    1.0927348 * T2
                    +    0.01826837 * T3
                    -    0.000028596 * T4
                    -    0.0000002904 * T5);
    var thetaA = (   2004.191903 * T
                   -     0.4294934 * T2
                   -     0.04182264 * T3
                   -     0.000007089 * T4
                   -     0.0000001274 * T5);
    
    return {
		zetaA : zetaA,
		zA : zA,
		thetaA : thetaA
	};
};

KMG.Procession.EclipticPrecession_P03 = function(T)
{
    var T2 = T * T;
    var T3 = T2 * T;
    var T4 = T3 * T;
    var T5 = T4 * T;
    
    var PA = (  4.199094 * T
              + 0.1939873 * T2
              - 0.00022466 * T3
              - 0.000000912 * T4
              + 0.0000000120 * T5);
    var QA = (-46.811015 * T
              + 0.0510283 * T2
              + 0.00052413 * T3
              - 0.00000646 * T4
              - 0.0000000172 * T5);
    
    return {
		PA : PA,
		QA : QA
	};
};


KMG.Procession.EclipticPrecessionAngles_P03 = function(T)
{
    var T2 = T * T;
    var T3 = T2 * T;
    var T4 = T3 * T;
    var T5 = T4 * T;
    
    var piA = ( 46.998973 * T
               - 0.0334926 * T2
               - 0.00012559 * T3
               + 0.000000113 * T4
               - 0.0000000022 * T5);
    var PiA = (629546.7936
                - 867.95758 * T
                +   0.157992 * T2
                -   0.0005371 * T3
                -   0.00004797 * T4
                +   0.000000072 * T5);
    
    return {
		piA : piA,
		PiA : PiA
	};
};

KMG.Procession.eps0 = 84381.40889;

KMG.Procession.PrecObliquity_P03 = function(T)
{
    var T2 = T * T;
    var T3 = T2 * T;
    var T4 = T3 * T;
    var T5 = T4 * T;
    
    var epsA = (KMG.Procession.eps0
                - 46.836769 * T
                -  0.0001831 * T2
                +  0.00200340 * T3
                -  0.000000576 * T4
                -  0.0000000434 * T5);
    var pA   = ( 5028.796195 * T
                +   1.1054348 * T2
                +   0.00007964 * T3
                -   0.000023857 * T4
                -   0.0000000383 * T5);

    return {
		epsA : epsA,
		pA : pA
	};
};

/* File: Orbit.js */



KMG.SolveKeplerFunc1 = function(ecc, M) {
	this.solve = function(x) {
		return M + ecc * Math.sin(x);
	};
};

KMG.SolveKeplerFunc2 = function(ecc, M) {
	this.solve = function(x) {
		return x + (M + ecc * Math.sin(x) - x) / (1 - ecc * Math.cos(x));
	};
};

KMG.SolveKeplerLaguerreConway = function(ecc, M) {
	this.solve = function(x) {
		var s = ecc * Math.sin(x);
		var c = ecc * Math.cos(x);
		var f = x - s - M;
		var f1 = 1 - c;
		var f2 = s;

		x += -5 * f / (f1 + KMG.Math.sign(f1) * Math.sqrt(Math.abs(16 * f1 * f1 - 20 * f * f2)));
		return x;
	};
};

KMG.SolveKeplerLaguerreConwayHyp = function(ecc, M) {
	this.solve = function(x) {
		var s = ecc * KMG.Math.sinh(x);
		var c = ecc * KMG.Math.cosh(x);
		var f = x - s - M;
		var f1 = c - 1;
		var f2 = s;

		x += -5 * f / (f1 + KMG.Math.sign(f1) * Math.sqrt(Math.abs(16 * f1 * f1 - 20 * f * f2)));
		return x;
	};
};

KMG.Orbit = function() 
{



};

// Values valid from 1800 AD through 2050 AD
// See http://iau-comm4.jpl.nasa.gov/keplerformulae/kepform.pdf
KMG.OrbitDefinitions = {
	
	template : {
		semiMajorAxis : 0,
		longitudeOfPerihelion : 0,
		eccentricity : 0,
		inclination : 0,
		ascendingNode : 0, 
		argOfPeriapsis : 0,
		meanAnomalyAtEpoch : 0,
		period : 0
	},
	
	mercury : {
		semiMajorAxis : 0.38709927,
		longitudeOfPerihelion : 77.45779628, //longitudeOfPerihelion
		eccentricity : 0.20563593, //eccentricity
		inclination : 7.00497902, // inclination
		ascendingNode : 48.33076593, //longitudeOfAscendingNode
		argOfPeriapsis : 29.124, // = longitudeOfPerihelion - longitudeOfAscendingNode
		meanAnomalyAtEpoch : 174.796,
		period : 0.240876 * 365.25
	},
	
	venus : {
		semiMajorAxis : 0.72333566,
		longitudeOfPerihelion : 131.60246718,
		eccentricity : 0.00677672,
		inclination : 3.39467605,
		ascendingNode : 76.67984255, 
		argOfPeriapsis : 55.186,
		meanAnomalyAtEpoch : 50.115,
		period : 0.615198 * 365.25
	},
	
	earth : {
		semiMajorAxis : 1.00000261,
		longitudeOfPerihelion : 102.947,
		eccentricity : 0.0167,
		inclination : 0.0001,
		ascendingNode : 348.73936,
		argOfPeriapsis : 114.20783,
		meanAnomalyAtEpoch : 357.51716,
		period : 1.000017421 * 365.25
	},

	mars : {
		semiMajorAxis : 1.52371034,
		longitudeOfPerihelion : -23.94362959,
		eccentricity : 0.09339410,
		inclination : 1.84969142,
		ascendingNode : 49.55953891, 
		argOfPeriapsis : 286.537,
		meanAnomalyAtEpoch : 19.3564,
		period : 1.8808 * 365.25
	},

	ceres : {
		semiMajorAxis : 2.7654,
		longitudeOfPerihelion : 0,
		eccentricity : 0.079138,
		inclination : 10.587,
		ascendingNode : 80.3932, 
		argOfPeriapsis : 72.5898,
		meanAnomalyAtEpoch : 113.410,
		period : 4.60 * 365.25
	},
	vesta : {
		semiMajorAxis : 2.361534940452743E+00,
		longitudeOfPerihelion : 149.84,
		eccentricity : 9.002246842706077E-02,
		inclination : 7.133937445524650E+00,
		ascendingNode : 1.039514249511780E+02, 
		argOfPeriapsis : 1.495866622389732E+02,
		meanAnomalyAtEpoch : 3.410238523604547E+02,
		period : 1.325531309325364E+03
	},
	
	jupiter : {
		semiMajorAxis : 5.20288700,
		longitudeOfPerihelion : 14.72847983,
		eccentricity : 0.04838624,
		inclination : 1.30439695,
		ascendingNode : 100.47390909, 
		argOfPeriapsis : 275.066, 
		meanAnomalyAtEpoch : 18.818,
		period : 11.8618 * 365.25
	},
	
	saturn : {
		semiMajorAxis : 9.53667594,
		longitudeOfPerihelion : 92.59887831,
		eccentricity : 0.05386179,
		inclination : 2.48599187,
		ascendingNode : 113.66242448, 
		argOfPeriapsis : 336.013862, //-21.063546169999995
		meanAnomalyAtEpoch : 320.349750,
		period : 29.4571 * 365.25
	},
	
	uranus : {
		semiMajorAxis : 19.18916464,
		longitudeOfPerihelion : 170.95427630,
		eccentricity : 0.04725744,
		inclination : 0.77263783,
		ascendingNode : 74.01692503, 
		argOfPeriapsis : 96.93735127000001,
		meanAnomalyAtEpoch : 142.955717,
		period : 84.323326 * 365.25
	},
	
	neptune : {
		semiMajorAxis : 30.06992276,
		longitudeOfPerihelion : 44.96476227,
		eccentricity : 0.00859048,
		inclination : 1.77004347,
		ascendingNode : 131.78422574, 
		argOfPeriapsis : 265.646853,
		meanAnomalyAtEpoch : 267.767281,
		period : 164.79 * 365.25
	},
	
	pluto : {
		semiMajorAxis : 39.48211675,
		longitudeOfPerihelion : 224.06891629,
		eccentricity : 0.24882730,
		inclination : 17.14001206,
		ascendingNode : 110.30393684,
		argOfPeriapsis : 113.76498945, 
		meanAnomalyAtEpoch : 14.86012204,
		period : 247.68 * 365.25
	},
	
	sedna : {
		semiMajorAxis : 518.57,
		longitudeOfPerihelion : 0,
		eccentricity : 0.8527,
		inclination : 11.927,
		ascendingNode : 144.26, 
		argOfPeriapsis : 311.02,
		meanAnomalyAtEpoch : 358.01,
		period : 11400 * 365.25
	},
	makemake : {
		semiMajorAxis : 4.537149503754902E+01,
		longitudeOfPerihelion : 0,
		eccentricity : 1.645302661137667E-01,
		inclination : 2.900018092674307E+01,
		ascendingNode : 7.927479351325880E+01, 
		argOfPeriapsis : 2.962796702827131E+02,
		meanAnomalyAtEpoch : 1.397247535166562E+02,
		period : 1.116279789467439E+05
	},
	haumea : {
		semiMajorAxis : 4.290900504570640E+01,
		longitudeOfPerihelion : 0,
		eccentricity : 1.999240087754753E-01,
		inclination : 2.820613695665376E+01,
		ascendingNode : 1.219331357048411E+02, 
		argOfPeriapsis : 2.405918328387456E+02,
		meanAnomalyAtEpoch : 1.895938765545494E+02,
		period : 1.026646884377227E+05
	},
	eris : {
		semiMajorAxis : 6.814528383022676E+01,
		longitudeOfPerihelion : 0,
		eccentricity : 4.324547411204651E-01,
		inclination : 4.374037864588535E+01,
		ascendingNode : 3.612861006165989E+01, 
		argOfPeriapsis : 1.508355993252542E+02,
		meanAnomalyAtEpoch : 1.943095415904719E+02,
		period : 2.054717566990577E+05
	},
	
	
	
	/*
	moon : {
		semiMajorAxis : 2.552673530695038E-03,
		longitudeOfPerihelion : 0,
		eccentricity : 6.314721694601848E-02,
		inclination : 2.094230382118301E+01,
		ascendingNode : 1.223643870385490E+01, 
		argOfPeriapsis : 6.154181757216567E+01,
		meanAnomalyAtEpoch : 1.466732745658298E+02,
		period : 0.07396621937613547, 
		epoch : 2451545
	}*/
	
	moon : {
		moon : true,
		semiMajorAxis : 0.00256955529,
		longitudeOfPerihelion : 0,
		eccentricity : 0.0549,
		inclination : 5.145,
		ascendingNode : 1.239580563903234E+02, 
		argOfPeriapsis : 3.089226717609726E+02,
		meanAnomalyAtEpoch : 260.5603266810552,
		period : 2.701616162713348E+01//27.321582//0.07396621937613547 * 365.25
	},
	titan : {
		semiMajorAxis : 8.168127483657287E-03,
		longitudeOfPerihelion : 0,
		eccentricity : 2.860074434716717E-02,
		inclination : 2.771833743784899E+01,
		ascendingNode : 1.692391586820226E+02, 
		argOfPeriapsis : 1.644078851778261E+02,
		meanAnomalyAtEpoch : 1.643780911447081E+02,
		period : 1.594734092046106E+01//27.321582//0.07396621937613547 * 365.25
	}

};





/**
 * Adapted from http://sourceforge.net/p/celestia/code/5229/tree/trunk/celestia/src/celephem/orbit.cpp
 */
KMG.EllipticalOrbit = function(orbitProperties)
{
	KMG.Orbit.call( this );
	
	this.semiMajorAxis = orbitProperties.semiMajorAxis;
	this.eccentricity = orbitProperties.eccentricity;
	this.inclination = orbitProperties.inclination * (Math.PI / 180.0);
	this.ascendingNode = orbitProperties.ascendingNode * (Math.PI / 180.0);
	this.argOfPeriapsis = orbitProperties.argOfPeriapsis * (Math.PI / 180.0);
	this.meanAnomalyAtEpoch = orbitProperties.meanAnomalyAtEpoch;
	this.period = orbitProperties.period ;
	
	this.orbitProperties = orbitProperties;
	
	this.epoch = (orbitProperties.epoch) ? orbitProperties.epoch : 2451545;
	this.derivativeOfMeanMotion = (orbitProperties.derivativeOfMeanMotion) ? orbitProperties.derivativeOfMeanMotion : 0;
	
	//this.pericenterDistance = (orbitProperties.pericenterDistance) ? orbitProperties.pericenterDistance : this.semiMajorAxis * (1 - this.eccentricity);
	this.pericenterDistance = this.semiMajorAxis * (1 - this.eccentricity);
	//this.meanMotion = (orbitProperties.meanMotion) ? (orbitProperties.meanMotion) : (2.0 * Math.PI) / this.period;
	//this.meanMotion = 1 / this.period;
	this.meanMotion = (orbitProperties.meanMotion) ? (orbitProperties.meanMotion) : 1 / this.period;
	
	var ascendingNodeRotation = new THREE.Matrix4();
	ascendingNodeRotation.makeRotationZ(this.ascendingNode);
	
	var inclinationRotation = new THREE.Matrix4();
	inclinationRotation.makeRotationX(this.inclination);
	
	var argOfPeriapsisRotation = new THREE.Matrix4();
	argOfPeriapsisRotation.makeRotationZ(this.argOfPeriapsis );
	
	this.orbitPlaneRotation = new THREE.Matrix4();
	this.orbitPlaneRotation.identity();
	
	this.orbitPlaneRotation.multiplyMatrices( ascendingNodeRotation, inclinationRotation );
	this.orbitPlaneRotation.multiply( argOfPeriapsisRotation );
	
	
	var scope = this;
	
	function solveIterationFixed(f, x0, maxIter) {
		
		var x = 0;
		var x2 = x0;
		
		for (var i = 0; i < maxIter; i++) {
			x = x2;
			x2 = f.solve(x);
		}
		
		return [x2, x2 - x];
	}
	
	

	
	function eccentricAnomaly(M) {
		if (scope.eccentricity == 0.0) {
			return M;
		} else if (scope.eccentricity < 0.2) {
		
			var sol = solveIterationFixed(new KMG.SolveKeplerFunc1(scope.eccentricity, M), M, 5);

			return sol[0];
		
		} else if (scope.eccentricity < 0.9) {
		
			var sol = solveIterationFixed(new KMG.SolveKeplerFunc2(scope.eccentricity, M), M, 6);
			return sol[0];
		
		} else if (scope.eccentricity < 1.0) {
			var E = M + 0.85 * scope.eccentricity * ((Math.sin(M) >= 0.0) ? 1 : -1);
			
			var sol = solveIterationFixed(new KMG.SolveKeplerLaguerreConway(scope.eccentricity, M), E, 8);
			return sol[0];
			
		} else if (scope.eccentricity == 1.0) {
			return M;
		} else {
			var E = Math.log(2 * M / scope.eccentricity + 1.85);
			
			var sol = solveIterationFixed(new KMG.SolveKeplerLaguerreConwayHyp(scope.eccentricity, M), E, 30);
			return sol[0];
		}
	}
	
	this.positionAtE = function(E) {
		var x, y;
		
		if (this.eccentricity < 1.0) {
			var a = this.pericenterDistance / (1.0 - this.eccentricity);
			x = a * (Math.cos(E) - this.eccentricity);
			y = a * Math.sqrt(1 - this.eccentricity * this.eccentricity) * Math.sin(E);
		} else if (this.eccentricity > 1.0) {
			var a = this.pericenterDistance / (1.0 - this.eccentricity);
			x = -a * (this.eccentricity - KMG.Math.cosh(E));
			y = -a * Math.sqrt(this.eccentricity * this.eccentricity - 1) * KMG.Math.sinh(E);
		} else {
			x = 0.0;
			y = 0.0;
		}
		
		var pos = new THREE.Vector3(x, y, 0);
		pos.applyMatrix4(this.orbitPlaneRotation);
		
		return pos;
	};
	
	
	this.velocityAtE = function(E) {
		var x, y;

		if (this.eccentricity < 1.0) {
			var a = this.pericenterDistance / (1.0 - this.eccentricity);
			var sinE = Math.sin(E);
			var cosE = Math.cos(E);
        
			x = -a * sinE;
			y =  a * Math.sqrt(1 - KMG.Math.sqr(this.eccentricity)) * cosE;
		
			var meanMotion = 2.0 * Math.PI / this.period;
			var edot = meanMotion / (1 - this.eccentricity * cosE);
			x *= edot;
			y *= edot;
		} else if (this.eccentricity > 1.0) {
			var a = this.pericenterDistance / (1.0 - this.eccentricity);
			x = -a * (this.eccentricity - KMG.Math.cosh(E));
			y = -a * Math.sqrt(KMG.Math.sqr(this.eccentricity) - 1) * KMG.Math.sinh(E);
		} else {
			// TODO: Handle parabolic orbits
			x = 0.0;
			y = 0.0;
		}
		
		var v = new THREE.Vector3(x, y, 0);
		v.applyMatrix4(this.orbitPlaneRotation);
		
		return new THREE.Vector3(v.x, v.z, -v.y);
	};
	
	function trimTo360(x) {	
		if( x > 0.0 ) {
			while( x > 360.0 )
				x = x-360.0;
		} else {
			while( x< 0.0 )
				x =x+ 360.0;
		}
		return(x)
	}
	
	this.meanAnomalyAtTime = function(t) {
		var timeSinceEpoch = (t - this.epoch);
		var meanAnomaly = this.meanAnomalyAtEpoch*1+(360*(this.meanMotion*(timeSinceEpoch)+0.5*this.derivativeOfMeanMotion*(timeSinceEpoch)*(timeSinceEpoch))) ; 
		meanAnomaly = trimTo360(meanAnomaly) * (Math.PI / 180);
		return meanAnomaly; // in radians
	};
	
	this.trueAnomalyAtTime = function(t, meanAnomaly, E) {
		if (!meanAnomaly) {
			meanAnomaly = this.meanAnomalyAtTime(t);
		}
		if (!E) {
			E = eccentricAnomaly(meanAnomaly);
		}
		
		var true_anomaly=Math.acos((  Math.cos(E)-this.eccentricity)/(1-this.eccentricity*Math.cos(E))  ) ;
		return true_anomaly; // In radians
	};
	
	this.eccentricAnomalyAtTime = function(t) {
		var meanAnomaly = this.meanAnomalyAtTime(t);
		var E = eccentricAnomaly(meanAnomaly);
		return E;
	};
	
	this.velocityAtTime = function(t) {
		var E = this.eccentricAnomalyAtTime(t);
		var v = this.velocityAtE(E);
		v.multiplyScalar(1.0 / 86400.0);
		v.magnitude = Math.sqrt(KMG.Math.sqr(v.x) + KMG.Math.sqr(v.y) + KMG.Math.sqr(v.z));
		return v;
	};
	
	this.positionAtTime = function(t) {
		var meanAnomaly = this.meanAnomalyAtTime(t);
		var E = eccentricAnomaly(meanAnomaly);
		var pos = this.positionAtE(E);
		var v = new THREE.Vector3(pos.x, pos.z, -pos.y);
		v.E = E;
		v.M = meanAnomaly;
		v.trueAnomaly = this.trueAnomalyAtTime(t, meanAnomaly, E);
		return v;
		//return new THREE.Vector3(pos.x, pos.y, pos.z);
	};
	
	this.distanceAtTime = function(t) {
		var trueAnomaly = this.trueAnomalyAtTime(t);
		var p = this.semiMajorAxis * (1 - KMG.Math.sqr(this.eccentricity));
		var r = p / (1 + this.eccentricity * Math.cos(trueAnomaly));
		return r;
	
	};
	
	this.propertiesAtTime = function(t) {
		var timeSinceEpoch = (t - this.epoch);
		
		var meanAnomalyAtTime = this.meanAnomalyAtTime(t);
		meanAnomalyAtTime = KMG.Math.trimTo360Radians(meanAnomalyAtTime * (Math.PI / 180));
		
		var distanceAtTime = this.distanceAtTime(t);
		var velocityAtTime = this.velocityAtTime(t);
		var trueAnomalyAtTime = this.trueAnomalyAtTime(t);
		
		var eccentricAnomalyAtTime = this.eccentricAnomalyAtTime(meanAnomalyAtTime);
		var positionAtTime = this.positionAtE(eccentricAnomalyAtTime);
		var coordinatesAtTime = new THREE.Vector3(positionAtTime.x, positionAtTime.z, -positionAtTime.y);
		
		
		
		var props = {
			time : t,
			epoch : this.epoch,
			timeSinceEpoch : timeSinceEpoch,
			meanAnomalyAtEpoch : this.meanAnomalyAtEpoch,
			meanAnomalyAtTime : meanAnomalyAtTime,
			distanceAtTime : distanceAtTime, // To center of orbit
			velocityAtTime : velocityAtTime, // km per second
			velocityMagnitudeAtTime : velocityAtTime.magnitude, // km per second
			trueAnomalyAtTime : trueAnomalyAtTime,
			eccentricAnomalyAtTime : eccentricAnomalyAtTime,
			positionAtTime : positionAtTime,
			coordinatesAtTime : coordinatesAtTime,
			meanMotion : this.meanMotion,
			ephemeris : this.orbitProperties
		};
		return props;
	};
	
};
KMG.EllipticalOrbit.prototype = Object.create( KMG.Orbit.prototype );







/* File: VSOP87Orbits.js */
/** VSOP87 Implementation
 * Lunar Algorithms
 * http://www.apoapsys.com
 * 
 * Copyright 2014 Kevin M. Gill <kmsmgill@gmail.com>
 *
 * Uses algorithms from the VSOP87 theory for the orbits
 * of major planets.
 * ftp://ftp.bdl.fr/pub/ephem/planets/vsop87/
 * 
 * Code is also adapted from Celestia source
 * vsop87.cpp
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */




KMG.VSOPTerms = {};




KMG.VSOPTerms.mercury_L0 = [
    [ 4.40250710144, 0, 0 ],
    [ 0.40989414977, 1.48302034195, 26087.9031416 ],
    [ 0.050462942, 4.47785489551, 52175.8062831 ],
    [ 0.00855346844, 1.16520322459, 78263.7094247 ],
    [ 0.00165590362, 4.11969163423, 104351.612566 ],
    [ 0.00034561897, 0.77930768443, 130439.515708 ],
    [ 7.583476e-05, 3.71348404924, 156527.418849 ],
    [ 3.559745e-05, 1.51202675145, 1109.37855209 ],
    [ 1.726011e-05, 0.35832267096, 182615.321991 ],
    [ 1.803464e-05, 4.10333184211, 5661.33204915 ],
    [ 1.364681e-05, 4.59918328256, 27197.2816937 ],
    [ 1.589923e-05, 2.9951042356, 25028.5212114 ],
    [ 1.017332e-05, 0.88031393824, 31749.2351907 ],
    [ 7.14182e-06, 1.54144862493, 24978.5245895 ],
    [ 6.43759e-06, 5.30266166599, 21535.9496445 ],
    [ 4.042e-06, 3.28228953196, 208703.225133 ],
    [ 3.52442e-06, 5.24156372447, 20426.5710924 ],
    [ 3.43312e-06, 5.7653170387, 955.599741609 ],
    [ 3.39215e-06, 5.86327825226, 25558.2121765 ],
    [ 4.51137e-06, 6.04989282259, 51116.424353 ],
    [ 3.25329e-06, 1.33674488758, 53285.1848352 ],
    [ 2.59588e-06, 0.98732774234, 4551.95349706 ],
    [ 3.45213e-06, 2.79211954198, 15874.6175954 ],
    [ 2.72948e-06, 2.49451165014, 529.690965095 ],
    [ 2.34831e-06, 0.26672019191, 11322.6640983 ],
    [ 2.38793e-06, 0.113439144, 1059.38193019 ],
    [ 2.64336e-06, 3.91705105199, 57837.1383323 ],
    [ 2.16645e-06, 0.65987085507, 13521.7514416 ],
    [ 1.83358e-06, 2.62878694178, 27043.5028832 ],
    [ 1.75965e-06, 4.53636943501, 51066.4277311 ],
    [ 1.81629e-06, 2.43413603252, 25661.3049507 ],
    [ 2.08996e-06, 2.09178645677, 47623.8527861 ],
    [ 1.72642e-06, 2.45200139206, 24498.8302463 ],
    [ 1.42317e-06, 3.36004060149, 37410.5672399 ],
    [ 1.37943e-06, 0.29098540695, 10213.2855462 ],
    [ 1.18233e-06, 2.78149967294, 77204.3274945 ],
    [ 9.686e-07, 6.20398934398, 234791.128274 ],
    [ 1.25219e-06, 3.72079967668, 39609.6545832 ],
    [ 8.6819e-07, 2.64218953915, 51646.1153181 ],
    [ 8.6723e-07, 1.95952945936, 46514.474234 ],
    [ 8.833e-07, 5.41338287192, 26617.5941067 ],
    [ 1.06422e-06, 4.20572143374, 19804.8272916 ],
    [ 8.9987e-07, 5.85243663953, 41962.5207369 ],
    [ 8.497e-07, 4.33100839394, 79373.0879768 ],
    [ 6.9247e-07, 4.19446500577, 19.6697608998 ],
    [ 6.3462e-07, 3.14700988911, 7238.6755916 ],
    [ 6.8493e-07, 0.63424913908, 83925.0414739 ],
    [ 6.9728e-07, 3.57201999194, 25132.3034 ],
    [ 5.9481e-07, 2.74692562834, 16983.9961475 ],
    [ 6.483e-07, 0.04762450218, 33326.5787332 ],
    [ 5.5377e-07, 4.05313774098, 30639.8566386 ],
    [ 5.4443e-07, 3.14332489827, 27147.2850718 ],
    [ 4.756e-07, 5.49722123456, 3.881335358 ],
    [ 4.9567e-07, 3.98985799218, 6770.71060125 ],
    [ 5.6532e-07, 5.11921332252, 73711.7559277 ],
    [ 4.1764e-07, 5.64184020485, 53131.4060248 ],
    [ 5.1459e-07, 5.4778679109, 50586.7333879 ],
    [ 4.4745e-07, 1.22367821919, 77154.3308726 ],
    [ 4.1882e-07, 5.19309331936, 6283.07584999 ],
    [ 3.8045e-07, 2.43118010131, 12566.1517 ],
    [ 3.5627e-07, 0.81389896255, 32858.6137428 ],
    [ 4.8008e-07, 5.49260945754, 51749.2080923 ],
    [ 3.5393e-07, 3.36964017301, 36301.1886878 ],
    [ 3.3952e-07, 2.786179563, 14765.2390433 ]
    // 64 terms retained
];

KMG.VSOPTerms.mercury_L1 = [
    [ 26087.9031369, 0, 0 ],
    [ 0.01131199811, 6.21874197797, 26087.9031416 ],
    [ 0.00292242298, 3.04449355541, 52175.8062831 ],
    [ 0.00075775081, 6.08568821653, 78263.7094247 ],
    [ 0.00019676525, 2.80965111777, 104351.612566 ],
    [ 5.119883e-05, 5.79432353574, 130439.515708 ],
    [ 1.336324e-05, 2.47909947012, 156527.418849 ],
    [ 3.5223e-06, 3.05246348628, 1109.37855209 ],
    [ 3.50236e-06, 5.43397743985, 182615.321991 ],
    [ 9.3444e-07, 6.11761855456, 27197.2816937 ],
    [ 9.0588e-07, 0.00053733031, 24978.5245895 ],
    [ 9.2259e-07, 2.09530377053, 208703.225133 ],
    [ 5.1943e-07, 5.62157845897, 5661.33204915 ],
    [ 4.4343e-07, 4.57417248957, 25028.5212114 ],
    [ 2.7651e-07, 3.03660330131, 51066.4277311 ],
    [ 2.1994e-07, 0.8647518216, 955.599741609 ],
    [ 2.0378e-07, 3.71392682666, 20426.5710924 ],
    [ 2.0226e-07, 0.52020649631, 21535.9496445 ],
    [ 2.4445e-07, 5.03171884876, 234791.128274 ],
    [ 1.7507e-07, 5.72782246025, 4551.95349706 ],
    [ 1.6673e-07, 1.34980149127, 529.690965095 ],
    [ 1.5305e-07, 1.79227510901, 11322.6640983 ],
    [ 1.5398e-07, 5.7425911966, 19.6697608998 ],
    [ 1.396e-07, 3.59440619771, 24498.8302463 ],
    [ 1.3163e-07, 2.71002769534, 53285.1848352 ],
    [ 1.2621e-07, 3.89533871193, 3.881335358 ],
    [ 1.2503e-07, 4.7013355234, 1059.38193019 ],
    [ 7.967e-08, 4.1717547088, 26617.5941067 ],
    [ 8.012e-08, 3.92669813128, 27043.5028832 ],
    [ 7.703e-08, 0.4960922418, 46514.474234 ],
    [ 7.496e-08, 2.4777465217, 57837.1383323 ],
    [ 8.388e-08, 6.05157476676, 77154.3308726 ],
    [ 6.84e-08, 2.7739372243, 7.1135470008 ],
    [ 6.554e-08, 5.5349960828, 6770.71060125 ],
    [ 5.846e-08, 4.28173811514, 16983.9961475 ],
    [ 7.178e-08, 2.97769079034, 2218.75710419 ],
    [ 6.358e-08, 2.13820928214, 25132.3034 ],
    [ 5.879e-08, 2.19602452599, 13521.7514416 ],
    [ 5.065e-08, 2.48292263185, 30639.8566386 ],
    [ 6.517e-08, 1.67892400042, 260879.031416 ],
    [ 4.85e-08, 4.84628981357, 37410.5672399 ],
    [ 5.019e-08, 3.94203732877, 25661.3049507 ],
    [ 4.392e-08, 1.54280887262, 27147.2850718 ],
    [ 4.382e-08, 4.94443288387, 213.299095438 ],
    [ 4.017e-08, 5.52771226937, 83925.0414739 ],
    [ 4.299e-08, 5.08757395593, 10213.2855462 ],
    [ 4.588e-08, 0.82044096381, 25558.2121765 ]
    // 47 terms retained
];

KMG.VSOPTerms.mercury_L2 = [
    [ 0.00016395129, 4.67759555504, 26087.9031416 ],
    [ 8.123865e-05, 1.40305644134, 52175.8062831 ],
    [ 3.20817e-05, 4.49577853102, 78263.7094247 ],
    [ 1.128209e-05, 1.27901273779, 104351.612566 ],
    [ 8.77186e-06, 3.14159265359, 0 ],
    [ 3.71058e-06, 4.31735787338, 130439.515708 ],
    [ 1.16931e-06, 1.04943307731, 156527.418849 ],
    [ 3.5802e-07, 4.0458725739, 182615.321991 ],
    [ 1.4897e-07, 4.63345988506, 1109.37855209 ],
    [ 1.0747e-07, 0.74352925179, 208703.225133 ],
    [ 5.244e-08, 4.71804553686, 24978.5245895 ],
    [ 3.182e-08, 3.71128464182, 234791.128274 ],
    [ 2.547e-08, 1.43801901419, 27197.2816937 ],
    [ 2.033e-08, 1.49538090708, 51066.4277311 ]
    // 14 terms retained
];

KMG.VSOPTerms.mercury_L3 = [
    [ 1.69496e-06, 3.20221586818, 26087.9031416 ],
    [ 1.55725e-06, 6.23814315369, 52175.8062831 ],
    [ 9.0555e-07, 2.96712953186, 78263.7094247 ],
    [ 4.2769e-07, 6.01870391709, 104351.612566 ],
    [ 1.776e-07, 2.78750960026, 130439.515708 ],
    [ 6.774e-08, 5.82756176337, 156527.418849 ],
    [ 3.486e-08, 0, 0 ],
    [ 2.435e-08, 2.56963684564, 182615.321991 ],
    [ 8.38e-09, 5.58026725886, 208703.225133 ]
    // 9 terms retained
];

KMG.VSOPTerms.mercury_L4 = [
    [ 2.671e-08, 4.76418299344, 52175.8062831 ],
    [ 2.079e-08, 2.01782765964, 26087.9031416 ],
    [ 2.071e-08, 1.47603650163, 78263.7094247 ]
    // 3 terms retained
];

KMG.VSOPTerms.mercury_L5 = [
    [ 0, 0, 0 ]
    // 0 terms retained
];

KMG.VSOPTerms.mercury_B0 = [
    [ 0.11737528961, 1.98357498767, 26087.9031416 ],
    [ 0.02388076996, 5.03738959686, 52175.8062831 ],
    [ 0.01222839532, 3.14159265359, 0 ],
    [ 0.0054325181, 1.79644363964, 78263.7094247 ],
    [ 0.0012977877, 4.83232503958, 104351.612566 ],
    [ 0.00031866927, 1.58088495658, 130439.515708 ],
    [ 7.963301e-05, 4.60972126127, 156527.418849 ],
    [ 2.014189e-05, 1.35324164377, 182615.321991 ],
    [ 5.13953e-06, 4.37835406663, 208703.225133 ],
    [ 2.07674e-06, 4.91772567908, 27197.2816937 ],
    [ 2.08584e-06, 2.02020295489, 24978.5245895 ],
    [ 1.32013e-06, 1.11908482553, 234791.128274 ],
    [ 1.00454e-06, 5.65684757892, 20426.5710924 ],
    [ 1.21395e-06, 1.81271747279, 53285.1848352 ],
    [ 9.1566e-07, 2.28163127292, 25028.5212114 ],
    [ 9.9214e-07, 0.09391887897, 51116.424353 ],
    [ 9.4574e-07, 1.2418492092, 31749.2351907 ],
    [ 7.8785e-07, 4.40725881159, 57837.1383323 ],
    [ 7.7747e-07, 0.52557074433, 1059.38193019 ],
    [ 8.4264e-07, 5.08510405853, 51066.4277311 ]
    // 20 terms retained
];

KMG.VSOPTerms.mercury_B1 = [
    [ 0.00274646065, 3.95008450011, 26087.9031416 ],
    [ 0.00099737713, 3.14159265359, 0 ],
    [ 0.00018772047, 0.05141288887, 78263.7094247 ],
    [ 0.00023970726, 2.53272082947, 52175.8062831 ],
    [ 8.097508e-05, 3.20946389315, 104351.612566 ],
    [ 2.890729e-05, 0.00943621371, 130439.515708 ],
    [ 9.49669e-06, 3.06780459575, 156527.418849 ],
    [ 2.98013e-06, 6.11414444304, 182615.321991 ],
    [ 9.0863e-07, 2.87023913203, 208703.225133 ],
    [ 2.7163e-07, 5.90488705529, 234791.128274 ],
    [ 2.4677e-07, 0.37210176608, 27197.2816937 ],
    [ 1.6001e-07, 0.37499685422, 24978.5245895 ],
    [ 1.1035e-07, 3.4885532911, 53285.1848352 ],
    [ 8.004e-08, 2.65315026358, 260879.031416 ],
    [ 8.817e-08, 3.46732763537, 51066.4277311 ]
    // 15 terms retained
];

KMG.VSOPTerms.mercury_B2 = [
    [ 2.747165e-05, 5.24567337999, 26087.9031416 ],
    [ 2.047257e-05, 0, 0 ],
    [ 5.1603e-06, 0.49321133154, 52175.8062831 ],
    [ 4.07309e-06, 4.32215500849, 78263.7094247 ],
    [ 2.66936e-06, 1.42744634495, 104351.612566 ],
    [ 1.33544e-06, 4.61055165903, 130439.515708 ],
    [ 5.6956e-07, 1.44017544018, 156527.418849 ],
    [ 2.2049e-07, 4.52127237069, 182615.321991 ],
    [ 8.008e-08, 1.30182043008, 208703.225133 ],
    [ 2.781e-08, 4.35468456951, 234791.128274 ]
    // 10 terms retained
];

KMG.VSOPTerms.mercury_B3 = [
    [ 6.468e-07, 2.16518315874, 26087.9031416 ],
    [ 3.0733e-07, 0, 0 ],
    [ 1.8929e-07, 5.40870348072, 52175.8062831 ],
    [ 9.797e-08, 2.41402344018, 78263.7094247 ],
    [ 6.861e-08, 5.88312096876, 104351.612566 ],
    [ 4.367e-08, 2.88362764626, 130439.515708 ],
    [ 2.344e-08, 6.0558166462, 156527.418849 ],
    [ 1.105e-08, 2.89178837278, 182615.321991 ]
    // 8 terms retained
];

KMG.VSOPTerms.mercury_B4 = [
    [ 0, 0, 0 ]
    // 0 terms retained
];

KMG.VSOPTerms.mercury_B5 = [
    [ 0, 0, 0 ]
    // 0 terms retained
];

KMG.VSOPTerms.mercury_R0 = [
    [ 0.39528271651, 0, 0 ],
    [ 0.07834131818, 6.19233722598, 26087.9031416 ],
    [ 0.00795525558, 2.95989690104, 52175.8062831 ],
    [ 0.00121281764, 6.01064153797, 78263.7094247 ],
    [ 0.00021921969, 2.77820093972, 104351.612566 ],
    [ 4.354065e-05, 5.82894543774, 130439.515708 ],
    [ 9.18228e-06, 2.59650562845, 156527.418849 ],
    [ 2.60033e-06, 3.02817753901, 27197.2816937 ],
    [ 2.89955e-06, 1.42441937278, 25028.5212114 ],
    [ 2.01855e-06, 5.64725040577, 182615.321991 ],
    [ 2.01498e-06, 5.59227727403, 31749.2351907 ],
    [ 1.4198e-06, 6.25264206514, 24978.5245895 ],
    [ 1.00144e-06, 3.73435615066, 21535.9496445 ],
    [ 7.7561e-07, 3.66972523786, 20426.5710924 ],
    [ 6.3277e-07, 4.29905566028, 25558.2121765 ],
    [ 6.2951e-07, 4.76588960835, 1059.38193019 ],
    [ 6.6753e-07, 2.52520325806, 5661.33204915 ],
    [ 7.55e-07, 4.47428643135, 51116.424353 ],
    [ 4.8265e-07, 6.06824353565, 53285.1848352 ],
    [ 4.5748e-07, 2.41480951848, 208703.225133 ],
    [ 3.5224e-07, 1.05917819542, 27043.5028832 ],
    [ 4.0815e-07, 2.35882025197, 57837.1383323 ],
    [ 4.4235e-07, 1.21957279824, 15874.6175954 ],
    [ 3.3873e-07, 0.86381554218, 25661.3049507 ],
    [ 3.7203e-07, 0.51733923686, 47623.8527861 ],
    [ 3.0092e-07, 1.79500457353, 37410.5672399 ],
    [ 2.8417e-07, 3.02063623857, 51066.4277311 ],
    [ 3.0903e-07, 0.88366672292, 24498.8302463 ],
    [ 2.6105e-07, 2.15021962878, 39609.6545832 ],
    [ 1.8699e-07, 4.96496134509, 11322.6640983 ],
    [ 2.127e-07, 5.36857147632, 13521.7514416 ],
    [ 1.9422e-07, 4.98378705281, 10213.2855462 ],
    [ 1.6941e-07, 3.8876429506, 26617.5941067 ],
    [ 1.5109e-07, 0.44510551618, 46514.474234 ],
    [ 1.7087e-07, 1.24077744063, 77204.3274945 ],
    [ 1.394e-07, 1.62574000931, 27147.2850718 ],
    [ 1.3383e-07, 1.07656603755, 51646.1153181 ],
    [ 1.5011e-07, 4.28173416255, 41962.5207369 ],
    [ 1.3977e-07, 4.77056852962, 33326.5787332 ],
    [ 1.2794e-07, 6.06436868672, 1109.37855209 ],
    [ 1.3938e-07, 1.99984923769, 25132.3034 ],
    [ 1.6297e-07, 2.63293566917, 19804.8272916 ],
    [ 1.1932e-07, 2.36500445252, 4551.95349706 ],
    [ 1.0612e-07, 5.46555459994, 234791.128274 ],
    [ 1.2754e-07, 2.0761125081, 529.690965095 ],
    [ 1.2068e-07, 2.84997457341, 79373.0879768 ],
    [ 9.069e-08, 1.21263578152, 14765.2390433 ],
    [ 9.491e-08, 0.83697019037, 12566.1517 ],
    [ 9.38e-08, 5.41195321678, 83925.0414739 ],
    [ 7.499e-08, 2.44636675464, 30639.8566386 ],
    [ 7.463e-08, 5.53233826081, 32858.6137428 ],
    [ 7.216e-08, 1.17101761775, 16983.9961475 ],
    [ 8.492e-08, 3.56622963752, 73711.7559277 ],
    [ 7.109e-08, 5.32625250539, 426.598190876 ],
    [ 6.862e-08, 1.82314316379, 36301.1886878 ]
    // 55 terms retained
];

KMG.VSOPTerms.mercury_R1 = [
    [ 0.0021734774, 4.65617158665, 26087.9031416 ],
    [ 0.00044141826, 1.42385544001, 52175.8062831 ],
    [ 0.00010094479, 4.47466326327, 78263.7094247 ],
    [ 2.432805e-05, 1.24226083323, 104351.612566 ],
    [ 1.624367e-05, 0, 0 ],
    [ 6.03996e-06, 4.29303116468, 130439.515708 ],
    [ 1.52851e-06, 1.06060778072, 156527.418849 ],
    [ 3.9202e-07, 4.11136733071, 182615.321991 ],
    [ 1.776e-07, 4.54424729034, 27197.2816937 ],
    [ 1.7999e-07, 4.71193597233, 24978.5245895 ],
    [ 1.0154e-07, 0.87893540982, 208703.225133 ],
    [ 8.086e-08, 3.00540629863, 25028.5212114 ]
    // 12 terms retained
];

KMG.VSOPTerms.mercury_R2 = [
    [ 3.117867e-05, 3.08231840294, 26087.9031416 ],
    [ 1.245397e-05, 6.1518331681, 52175.8062831 ],
    [ 4.24822e-06, 2.92583350003, 78263.7094247 ],
    [ 1.3613e-06, 5.97983927257, 104351.612566 ],
    [ 4.2176e-07, 2.74936984182, 130439.515708 ],
    [ 2.1759e-07, 3.14159265359, 0 ],
    [ 1.2794e-07, 5.80143158303, 156527.418849 ],
    [ 3.825e-08, 2.56993470104, 182615.321991 ]
    // 8 terms retained
];

KMG.VSOPTerms.mercury_R3 = [
    [ 3.2676e-07, 1.67971641967, 26087.9031416 ],
    [ 2.4166e-07, 4.63403168878, 52175.8062831 ],
    [ 1.2133e-07, 1.38983777816, 78263.7094247 ],
    [ 5.141e-08, 4.43915486864, 104351.612566 ],
    [ 1.981e-08, 1.20734065292, 130439.515708 ],
    [ 1.46e-08, 3.14159265359, 0 ]
    // 6 terms retained
];

KMG.VSOPTerms.mercury_R4 = [
    [ 0, 0, 0 ]
    // 0 terms retained
];












KMG.VSOPTerms.venus_L0 = [
    [ 3.17614666774, 0, 0 ],
    [ 0.01353968419, 5.59313319619, 10213.2855462 ],
    [ 0.00089891645, 5.30650047764, 20426.5710924 ],
    [ 5.477194e-05, 4.41630661466, 7860.41939244 ],
    [ 3.455741e-05, 2.6996444782, 11790.6290887 ],
    [ 2.372061e-05, 2.99377542079, 3930.20969622 ],
    [ 1.317168e-05, 5.18668228402, 26.2983197998 ],
    [ 1.664146e-05, 4.25018630147, 1577.34354245 ],
    [ 1.438387e-05, 4.15745084182, 9683.59458112 ],
    [ 1.200521e-05, 6.15357116043, 30639.8566386 ],
    [ 7.6138e-06, 1.95014701047, 529.690965095 ],
    [ 7.07676e-06, 1.06466702668, 775.522611324 ],
    [ 5.84836e-06, 3.9983988823, 191.448266112 ],
    [ 7.69314e-06, 0.81629615196, 9437.76293489 ],
    [ 4.99915e-06, 4.1234021282, 15720.8387849 ],
    [ 3.26221e-06, 4.59056477038, 10404.7338123 ],
    [ 4.29498e-06, 3.58642858577, 19367.1891622 ],
    [ 3.26967e-06, 5.67736584311, 5507.55323867 ],
    [ 2.31937e-06, 3.16251059356, 9153.90361602 ],
    [ 1.79695e-06, 4.65337908917, 1109.37855209 ],
    [ 1.28263e-06, 4.22604490814, 20.7753954924 ],
    [ 1.55464e-06, 5.5704389169, 19651.0484811 ],
    [ 1.27907e-06, 0.96209781904, 5661.33204915 ],
    [ 1.05547e-06, 1.53721203088, 801.820931124 ],
    [ 8.5722e-07, 0.3558924772, 3154.6870849 ],
    [ 9.9121e-07, 0.83288208931, 213.299095438 ],
    [ 9.8804e-07, 5.39389623302, 13367.9726311 ],
    [ 8.2094e-07, 3.21597037872, 18837.4981971 ],
    [ 8.8031e-07, 3.88868864136, 9999.98645077 ],
    [ 7.1577e-07, 0.11145736657, 11015.1064773 ],
    [ 5.6122e-07, 4.24039842051, 7.1135470008 ],
    [ 7.0239e-07, 0.67458825333, 23581.2581773 ],
    [ 5.0796e-07, 0.24531639097, 11322.6640983 ],
    [ 4.6111e-07, 5.31576442737, 18073.7049387 ],
    [ 4.4576e-07, 6.06281108312, 40853.1421848 ],
    [ 4.2594e-07, 5.32873395426, 2352.86615377 ],
    [ 4.2635e-07, 1.79955442721, 7084.89678112 ],
    [ 4.1177e-07, 0.362410122, 382.896532223 ]
    // 38 terms retained
];

KMG.VSOPTerms.venus_L1 = [
    [ 10213.2855462, 0, 0 ],
    [ 0.00095617813, 2.4640651111, 10213.2855462 ],
    [ 7.787201e-05, 0.6247848222, 20426.5710924 ],
    [ 1.51666e-06, 6.10638559291, 1577.34354245 ],
    [ 1.41694e-06, 2.12362986036, 30639.8566386 ],
    [ 1.73908e-06, 2.65539499463, 26.2983197998 ],
    [ 8.2235e-07, 5.70231469551, 191.448266112 ],
    [ 6.9732e-07, 2.68128549229, 9437.76293489 ],
    [ 5.2292e-07, 3.60270736876, 775.522611324 ],
    [ 3.8313e-07, 1.03371309443, 529.690965095 ],
    [ 2.963e-07, 1.25050823203, 5507.55323867 ],
    [ 2.5056e-07, 6.1065063866, 10404.7338123 ],
    [ 1.7772e-07, 6.19369679929, 1109.37855209 ],
    [ 1.651e-07, 2.64360813203, 7.1135470008 ],
    [ 1.4231e-07, 5.45125927817, 9153.90361602 ],
    [ 1.1627e-07, 4.97604433638, 213.299095438 ],
    [ 1.2563e-07, 1.88122194951, 382.896532223 ],
    [ 8.877e-08, 0.95245393457, 13367.9726311 ],
    [ 7.374e-08, 4.3947635255, 10206.1719992 ],
    [ 6.55e-08, 2.28168331756, 2352.86615377 ],
    [ 6.444e-08, 1.41156299643, 40853.1421848 ],
    [ 6.269e-08, 4.08365791523, 3154.6870849 ],
    [ 6.702e-08, 5.05916048534, 801.820931124 ]
    // 23 terms retained
];

KMG.VSOPTerms.venus_L2 = [
    [ 3.894209e-05, 0.34823650721, 10213.2855462 ],
    [ 5.95403e-06, 2.01456107998, 20426.5710924 ],
    [ 2.87868e-06, 0, 0 ],
    [ 2.3838e-07, 2.04588223604, 26.2983197998 ],
    [ 9.964e-08, 3.97089333901, 775.522611324 ],
    [ 7.196e-08, 3.65730119531, 30639.8566386 ],
    [ 7.043e-08, 1.52107808192, 1577.34354245 ],
    [ 6.014e-08, 1.00039990357, 191.448266112 ],
    [ 3.167e-08, 4.36138169912, 9437.76293489 ],
    [ 1.934e-08, 3.39260216059, 382.896532223 ]
    // 10 terms retained
];

KMG.VSOPTerms.venus_L3 = [
    [ 1.36328e-06, 4.79698723753, 10213.2855462 ],
    [ 3.0661e-07, 3.71663788064, 20426.5710924 ],
    [ 3.041e-08, 3.14159265359, 0 ]
    // 3 terms retained
];

KMG.VSOPTerms.venus_L4 = [
    [ 0, 0, 0 ]
    // 0 terms retained
];

KMG.VSOPTerms.venus_L5 = [
    [ 0, 0, 0 ]
    // 0 terms retained
];

KMG.VSOPTerms.venus_B0 = [
    [ 0.05923638472, 0.26702775812, 10213.2855462 ],
    [ 0.00040107978, 1.14737178112, 20426.5710924 ],
    [ 0.00032814918, 3.14159265359, 0 ],
    [ 1.011392e-05, 1.0894611973, 30639.8566386 ],
    [ 1.49458e-06, 6.25390268112, 18073.7049387 ],
    [ 1.37788e-06, 0.86020095586, 1577.34354245 ],
    [ 1.29973e-06, 3.67152480061, 9437.76293489 ],
    [ 1.19507e-06, 3.70468787104, 2352.86615377 ],
    [ 1.07971e-06, 4.53903678347, 22003.9146349 ],
    [ 9.2029e-07, 1.53954519783, 9153.90361602 ]
    // 10 terms retained
];

KMG.VSOPTerms.venus_B1 = [
    [ 0.00287821243, 1.88964962838, 10213.2855462 ],
    [ 3.499578e-05, 3.71117560516, 20426.5710924 ],
    [ 1.257844e-05, 0, 0 ],
    [ 9.6152e-07, 2.74240664188, 30639.8566386 ],
    [ 1.3051e-07, 2.27549606211, 9437.76293489 ]
    // 5 terms retained
];

KMG.VSOPTerms.venus_B2 = [
    [ 0.00012657745, 3.34796457029, 10213.2855462 ],
    [ 1.51225e-06, 0, 0 ],
    [ 3.7476e-07, 5.34638962141, 20426.5710924 ],
    [ 1.0627e-07, 3.81894300538, 30639.8566386 ]
    // 4 terms retained
];

KMG.VSOPTerms.venus_B3 = [
    [ 3.76505e-06, 4.87650249694, 10213.2855462 ],
    [ 1.2587e-07, 3.14159265359, 0 ],
    [ 4.809e-08, 0.43423918018, 20426.5710924 ]
    // 3 terms retained
];

KMG.VSOPTerms.venus_B4 = [
    [ 8.558e-08, 0.17181972054, 10213.2855462 ]
    // 1 terms retained
];

KMG.VSOPTerms.venus_B5 = [
    [ 0, 0, 0 ]
    // 0 terms retained
];

KMG.VSOPTerms.venus_R0 = [
    [ 0.72334820891, 0, 0 ],
    [ 0.00489824182, 4.02151831717, 10213.2855462 ],
    [ 1.658058e-05, 4.90206728031, 20426.5710924 ],
    [ 1.632096e-05, 2.84548795207, 7860.41939244 ],
    [ 1.378043e-05, 1.12846591367, 11790.6290887 ],
    [ 4.98395e-06, 2.58682193892, 9683.59458112 ],
    [ 3.73958e-06, 1.42314832858, 3930.20969622 ],
    [ 2.63615e-06, 5.52938716941, 9437.76293489 ],
    [ 2.37454e-06, 2.55136053886, 15720.8387849 ],
    [ 2.21985e-06, 2.01346696541, 19367.1891622 ],
    [ 1.19466e-06, 3.01975080538, 10404.7338123 ],
    [ 1.25896e-06, 2.72769850819, 1577.34354245 ],
    [ 7.6176e-07, 1.59574968674, 9153.90361602 ],
    [ 8.5337e-07, 3.98598666191, 19651.0484811 ],
    [ 7.4347e-07, 4.11957779786, 5507.55323867 ],
    [ 4.1902e-07, 1.64282225331, 18837.4981971 ],
    [ 4.2494e-07, 3.81864493274, 13367.9726311 ],
    [ 3.9437e-07, 5.39018702243, 23581.2581773 ],
    [ 2.9042e-07, 5.67739528728, 5661.33204915 ],
    [ 2.7555e-07, 5.72392434415, 775.522611324 ],
    [ 2.7288e-07, 4.8214049462, 11015.1064773 ],
    [ 3.1274e-07, 2.31806719544, 9999.98645077 ],
    [ 1.97e-07, 4.96157560246, 11322.6640983 ],
    [ 1.9811e-07, 0.53189302682, 27511.4678735 ],
    [ 1.3569e-07, 3.75536825122, 18073.7049387 ],
    [ 1.2921e-07, 1.13381083556, 10206.1719992 ],
    [ 1.6214e-07, 0.56446585474, 529.690965095 ],
    [ 1.1828e-07, 5.0903796656, 3154.6870849 ],
    [ 1.1729e-07, 0.23450811362, 7084.89678112 ],
    [ 1.3066e-07, 5.24354222739, 17298.1823273 ],
    [ 1.318e-07, 3.37207825651, 13745.346239 ],
    [ 9.097e-08, 3.07004839111, 1109.37855209 ],
    [ 1.0818e-07, 2.45024714924, 10239.583866 ],
    [ 1.1434e-07, 4.56780914249, 29050.7837433 ]
    // 34 terms retained
];

KMG.VSOPTerms.venus_R1 = [
    [ 0.00034551041, 0.89198706276, 10213.2855462 ],
    [ 2.34203e-06, 1.77224942363, 20426.5710924 ],
    [ 2.33998e-06, 3.14159265359, 0 ],
    [ 2.3867e-07, 1.11270233944, 9437.76293489 ]
    // 4 terms retained
];

KMG.VSOPTerms.venus_R2 = [
    [ 1.406587e-05, 5.06366395112, 10213.2855462 ],
    [ 1.5529e-07, 5.47321056992, 20426.5710924 ],
    [ 1.3059e-07, 0, 0 ]
    // 3 terms retained
];

KMG.VSOPTerms.venus_R3 = [
    [ 4.9582e-07, 3.22264415899, 10213.2855462 ]
    // 1 terms retained
];

KMG.VSOPTerms.venus_R4 = [
    [ 5.73e-09, 0.92253525592, 10213.2855462 ]
    // 1 terms retained
];
















KMG.VSOPTerms.earth_L0 = [
    [ 1.75347045673, 0, 0 ],
    [ 0.03341656453, 4.66925680415, 6283.07584999 ],
    [ 0.00034894275, 4.62610242189, 12566.1517 ],
    [ 3.417572e-05, 2.82886579754, 3.523118349 ],
    [ 3.497056e-05, 2.74411783405, 5753.3848849 ],
    [ 3.135899e-05, 3.62767041756, 77713.7714681 ],
    [ 2.676218e-05, 4.41808345438, 7860.41939244 ],
    [ 2.342691e-05, 6.13516214446, 3930.20969622 ],
    [ 1.273165e-05, 2.03709657878, 529.690965095 ],
    [ 1.324294e-05, 0.74246341673, 11506.7697698 ],
    [ 9.01854e-06, 2.04505446477, 26.2983197998 ],
    [ 1.199167e-05, 1.10962946234, 1577.34354245 ],
    [ 8.57223e-06, 3.50849152283, 398.149003408 ],
    [ 7.79786e-06, 1.17882681962, 5223.6939198 ],
    [ 9.9025e-06, 5.23268072088, 5884.92684658 ],
    [ 7.53141e-06, 2.53339052847, 5507.55323867 ],
    [ 5.05267e-06, 4.58292599973, 18849.22755 ],
    [ 4.92392e-06, 4.20505711826, 775.522611324 ],
    [ 3.56672e-06, 2.91954114478, 0.0673103028 ],
    [ 2.84125e-06, 1.89869240932, 796.298006816 ],
    [ 2.42879e-06, 0.34481445893, 5486.77784318 ],
    [ 3.17087e-06, 5.84901948512, 11790.6290887 ],
    [ 2.71112e-06, 0.31486255375, 10977.0788047 ],
    [ 2.06217e-06, 4.80646631478, 2544.31441988 ],
    [ 2.05478e-06, 1.86953770281, 5573.14280143 ],
    [ 2.02318e-06, 2.45767790232, 6069.77675455 ],
    [ 1.26225e-06, 1.08295459501, 20.7753954924 ],
    [ 1.55516e-06, 0.83306084617, 213.299095438 ],
    [ 1.15132e-06, 0.64544911683, 0.9803210682 ],
    [ 1.02851e-06, 0.63599845579, 4694.00295471 ],
    [ 1.01724e-06, 4.2667980198, 7.1135470008 ],
    [ 9.9206e-07, 6.20992926918, 2146.16541648 ],
    [ 1.32212e-06, 3.41118292683, 2942.46342329 ],
    [ 9.7607e-07, 0.68101342359, 155.420399434 ],
    [ 8.5128e-07, 1.29870764804, 6275.96230299 ],
    [ 7.4651e-07, 1.755089133, 5088.62883977 ],
    [ 1.01895e-06, 0.97569280312, 15720.8387849 ],
    [ 8.4711e-07, 3.67080093031, 71430.6956181 ],
    [ 7.3547e-07, 4.67926633877, 801.820931124 ],
    [ 7.3874e-07, 3.50319414955, 3154.6870849 ],
    [ 7.8757e-07, 3.03697458703, 12036.4607349 ],
    [ 7.9637e-07, 1.80791287082, 17260.1546547 ],
    [ 8.5803e-07, 5.9832263126, 161000.685738 ],
    [ 5.6963e-07, 2.78430458592, 6286.59896834 ],
    [ 6.1148e-07, 1.81839892984, 7084.89678112 ],
    [ 6.9627e-07, 0.83297621398, 9437.76293489 ],
    [ 5.6116e-07, 4.38694865354, 14143.4952424 ],
    [ 6.2449e-07, 3.97763912806, 8827.39026987 ],
    [ 5.1145e-07, 0.28306832879, 5856.47765912 ],
    [ 5.5577e-07, 3.47006059924, 6279.55273164 ],
    [ 4.1036e-07, 5.36817592855, 8429.24126647 ],
    [ 5.1605e-07, 1.33282739866, 1748.01641307 ],
    [ 5.1992e-07, 0.18914947184, 12139.5535091 ],
    [ 4.9e-07, 0.48735014197, 1194.44701022 ],
    [ 3.92e-07, 6.16833020996, 10447.3878396 ],
    [ 3.557e-07, 1.775968892, 6812.76681509 ],
    [ 3.677e-07, 6.04133863162, 10213.2855462 ],
    [ 3.6596e-07, 2.56957481827, 1059.38193019 ],
    [ 3.3296e-07, 0.59310278598, 17789.8456198 ],
    [ 3.5954e-07, 1.70875808777, 2352.86615377 ],
    [ 4.0938e-07, 2.39850938714, 19651.0484811 ]
    // 61 terms retained
];

KMG.VSOPTerms.earth_L1 = [
    [ 6283.07584999, 0, 0 ],
    [ 0.00206058863, 2.67823455808, 6283.07584999 ],
    [ 4.303419e-05, 2.63512233481, 12566.1517 ],
    [ 4.25264e-06, 1.59046982018, 3.523118349 ],
    [ 1.09017e-06, 2.96631010675, 1577.34354245 ],
    [ 9.3479e-07, 2.59211109542, 18849.22755 ],
    [ 1.19305e-06, 5.79555765566, 26.2983197998 ],
    [ 7.2121e-07, 1.13840581212, 529.690965095 ],
    [ 6.7784e-07, 1.87453300345, 398.149003408 ],
    [ 6.735e-07, 4.40932832004, 5507.55323867 ],
    [ 5.9045e-07, 2.88815790631, 5223.6939198 ],
    [ 5.5976e-07, 2.17471740035, 155.420399434 ],
    [ 4.5411e-07, 0.39799502896, 796.298006816 ],
    [ 3.6298e-07, 0.46875437227, 775.522611324 ],
    [ 2.8962e-07, 2.64732254645, 7.1135470008 ],
    [ 1.9097e-07, 1.84628376049, 5486.77784318 ],
    [ 2.0844e-07, 5.34138275149, 0.9803210682 ],
    [ 1.8508e-07, 4.96855179468, 213.299095438 ],
    [ 1.6233e-07, 0.03216587315, 2544.31441988 ],
    [ 1.7293e-07, 2.9911676063, 6275.96230299 ],
    [ 1.5832e-07, 1.43049301283, 2146.16541648 ],
    [ 1.4608e-07, 1.2046979369, 10977.0788047 ],
    [ 1.1877e-07, 3.25805082007, 5088.62883977 ],
    [ 1.1514e-07, 2.07502080082, 4694.00295471 ],
    [ 9.721e-08, 4.2392586526, 1349.86740966 ],
    [ 9.969e-08, 1.30263423409, 6286.59896834 ],
    [ 9.452e-08, 2.69956827011, 242.728603974 ],
    [ 1.2461e-07, 2.83432282119, 1748.01641307 ],
    [ 1.1808e-07, 5.27379760438, 1194.44701022 ],
    [ 8.577e-08, 5.6447608598, 951.718406251 ],
    [ 1.0641e-07, 0.76614722966, 553.569402842 ],
    [ 7.576e-08, 5.30056172859, 2352.86615377 ],
    [ 5.764e-08, 1.77228445837, 1059.38193019 ],
    [ 6.385e-08, 2.65034514038, 9437.76293489 ],
    [ 5.223e-08, 5.66135782131, 71430.6956181 ],
    [ 5.315e-08, 0.91110018969, 3154.6870849 ],
    [ 6.101e-08, 4.66633726278, 4690.47983636 ],
    [ 4.335e-08, 0.23934560382, 6812.76681509 ],
    [ 5.041e-08, 1.42489704722, 6438.49624943 ],
    [ 4.259e-08, 0.77355543889, 10447.3878396 ],
    [ 5.2e-08, 1.85528830215, 801.820931124 ]
    // 41 terms retained
];

KMG.VSOPTerms.earth_L2 = [
    [ 8.721859e-05, 1.07253635559, 6283.07584999 ],
    [ 9.9099e-06, 3.14159265359, 0 ],
    [ 2.94833e-06, 0.43717350256, 12566.1517 ],
    [ 2.7338e-07, 0.05295636147, 3.523118349 ],
    [ 1.6333e-07, 5.18820215724, 26.2983197998 ],
    [ 1.5745e-07, 3.68504712183, 155.420399434 ],
    [ 9.425e-08, 0.29667114694, 18849.22755 ],
    [ 8.938e-08, 2.05706319592, 77713.7714681 ],
    [ 6.94e-08, 0.82691541038, 775.522611324 ],
    [ 5.061e-08, 4.6624323168, 1577.34354245 ],
    [ 4.06e-08, 1.03067032318, 7.1135470008 ],
    [ 3.464e-08, 5.14021224609, 796.298006816 ],
    [ 3.172e-08, 6.05479318507, 5507.55323867 ],
    [ 3.02e-08, 1.19240008524, 242.728603974 ],
    [ 2.885e-08, 6.11705865396, 529.690965095 ],
    [ 3.809e-08, 3.44043369494, 5573.14280143 ],
    [ 2.719e-08, 0.30363248164, 398.149003408 ],
    [ 2.365e-08, 4.37666117992, 5223.6939198 ],
    [ 2.538e-08, 2.27966434314, 553.569402842 ],
    [ 2.078e-08, 3.75435095487, 0.9803210682 ],
    [ 1.675e-08, 0.90149951436, 951.718406251 ],
    [ 1.534e-08, 5.75895831192, 1349.86740966 ],
    [ 1.224e-08, 2.97285792195, 2146.16541648 ],
    [ 1.449e-08, 4.36401639552, 1748.01641307 ],
    [ 1.341e-08, 3.72019379666, 1194.44701022 ],
    [ 1.253e-08, 2.9488872631, 6438.49624943 ],
    [ 9.99e-09, 5.98665341008, 6286.59896834 ]
    // 27 terms retained
];

KMG.VSOPTerms.earth_L3 = [
    [ 2.89058e-06, 5.84173149732, 6283.07584999 ],
    [ 2.0712e-07, 6.0498393902, 12566.1517 ],
    [ 2.962e-08, 5.1956057957, 155.420399434 ],
    [ 2.527e-08, 3.14159265359, 0 ],
    [ 1.288e-08, 4.7219761197, 3.523118349 ]
    // 5 terms retained
];

KMG.VSOPTerms.earth_L4 = [
    [ 7.714e-08, 4.14117321449, 6283.07584999 ]
    // 1 terms retained
];

KMG.VSOPTerms.earth_L5 = [
    [ 0, 0, 0 ]
    // 0 terms retained
];

KMG.VSOPTerms.earth_B0 = [
    [ 2.7962e-06, 3.19870156017, 84334.6615813 ]
    // 1 terms retained
];

KMG.VSOPTerms.earth_B1 = [
    [ 0.00227777722, 3.4137662053, 6283.07584999 ],
    [ 3.805678e-05, 3.37063423795, 12566.1517 ],
    [ 3.619589e-05, 0, 0 ],
    [ 7.1542e-07, 3.32777549735, 18849.22755 ]
    // 4 terms retained
];

KMG.VSOPTerms.earth_B2 = [
    [ 9.721424e-05, 5.1519280992, 6283.07584999 ],
    [ 2.33002e-06, 3.14159265359, 0 ],
    [ 1.34188e-06, 0.64406212977, 12566.1517 ],
    [ 6.504e-08, 1.07333397797, 18849.22755 ]
    // 4 terms retained
];


KMG.VSOPTerms.earth_R0 = [
    [ 1.00013988784, 0, 0 ],
    [ 0.01670699632, 3.09846350258, 6283.07584999 ],
    [ 0.00013956024, 3.05524609456, 12566.1517 ],
    [ 3.08372e-05, 5.19846674381, 77713.7714681 ],
    [ 1.628463e-05, 1.17387558054, 5753.3848849 ],
    [ 1.575572e-05, 2.84685214877, 7860.41939244 ],
    [ 9.24799e-06, 5.45292236722, 11506.7697698 ],
    [ 5.42439e-06, 4.56409151453, 3930.20969622 ],
    [ 4.7211e-06, 3.66100022149, 5884.92684658 ],
    [ 3.2878e-06, 5.89983686142, 5223.6939198 ],
    [ 3.45969e-06, 0.96368627272, 5507.55323867 ],
    [ 3.06784e-06, 0.29867139512, 5573.14280143 ],
    [ 1.74844e-06, 3.01193636733, 18849.22755 ],
    [ 2.43181e-06, 4.2734953079, 11790.6290887 ],
    [ 2.11836e-06, 5.84714461348, 1577.34354245 ],
    [ 1.8574e-06, 5.02199710705, 10977.0788047 ],
    [ 1.09835e-06, 5.0551063586, 5486.77784318 ],
    [ 9.8316e-07, 0.88681311278, 6069.77675455 ],
    [ 8.65e-07, 5.68956418946, 15720.8387849 ],
    [ 8.5831e-07, 1.27079125277, 161000.685738 ],
    [ 6.2917e-07, 0.92177053978, 529.690965095 ],
    [ 5.7056e-07, 2.01374292245, 83996.8473181 ],
    [ 6.4908e-07, 0.27251341435, 17260.1546547 ],
    [ 4.9384e-07, 3.24501240359, 2544.31441988 ],
    [ 5.5736e-07, 5.2415979917, 71430.6956181 ],
    [ 4.252e-07, 6.01110257982, 6275.96230299 ],
    [ 4.6966e-07, 2.57799853213, 775.522611324 ],
    [ 3.8963e-07, 5.36063832897, 4694.00295471 ],
    [ 4.4666e-07, 5.53715663816, 9437.76293489 ],
    [ 3.5661e-07, 1.67447135798, 12036.4607349 ],
    [ 3.1922e-07, 0.18368299942, 5088.62883977 ],
    [ 3.1846e-07, 1.77775642078, 398.149003408 ],
    [ 3.3193e-07, 0.24370221704, 7084.89678112 ],
    [ 3.8245e-07, 2.39255343973, 8827.39026987 ],
    [ 2.8468e-07, 1.21344887533, 6286.59896834 ],
    [ 3.7486e-07, 0.82961281844, 19651.0484811 ],
    [ 3.6957e-07, 4.90107587287, 12139.5535091 ],
    [ 3.4537e-07, 1.84270693281, 2942.46342329 ],
    [ 2.6275e-07, 4.58896863104, 10447.3878396 ],
    [ 2.4596e-07, 3.78660838036, 8429.24126647 ],
    [ 2.3587e-07, 0.26866098169, 796.298006816 ],
    [ 2.7795e-07, 1.89934427832, 6279.55273164 ],
    [ 2.3927e-07, 4.99598548145, 5856.47765912 ],
    [ 2.0345e-07, 4.65282190725, 2146.16541648 ],
    [ 2.3287e-07, 2.80783632869, 14143.4952424 ],
    [ 2.2099e-07, 1.95002636847, 3154.6870849 ],
    [ 1.9509e-07, 5.38233922479, 2352.86615377 ],
    [ 1.7958e-07, 0.1987136996, 6812.76681509 ],
    [ 1.7178e-07, 4.43322156854, 10213.2855462 ],
    [ 1.619e-07, 5.23159323213, 17789.8456198 ],
    [ 1.7315e-07, 6.15224075188, 16730.4636896 ],
    [ 1.3814e-07, 5.18962074032, 8031.09226306 ],
    [ 1.8834e-07, 0.67280058021, 149854.400135 ],
    [ 1.833e-07, 2.25348717053, 23581.2581773 ],
    [ 1.3639e-07, 3.68511810757, 4705.73230754 ],
    [ 1.3142e-07, 0.65267698994, 13367.9726311 ],
    [ 1.0414e-07, 4.33285688501, 11769.8536932 ],
    [ 9.978e-08, 4.20126336356, 6309.37416979 ],
    [ 1.017e-07, 1.59366684542, 4690.47983636 ],
    [ 7.564e-08, 2.62560597391, 6256.77753019 ],
    [ 9.654e-08, 3.67583728703, 27511.4678735 ],
    [ 6.743e-08, 0.56269927047, 3340.6124267 ],
    [ 8.743e-08, 6.06359123461, 1748.01641307 ],
    [ 7.786e-08, 3.67371235367, 12168.0026966 ],
    [ 6.633e-08, 5.66149277789, 11371.7046898 ],
    [ 7.712e-08, 0.31242577788, 7632.94325965 ],
    [ 6.586e-08, 3.13580054586, 801.820931124 ],
    [ 7.46e-08, 5.6475806666, 11926.2544137 ],
    [ 6.933e-08, 2.92384586372, 6681.2248534 ],
    [ 6.805e-08, 1.42327153767, 23013.5395396 ],
    [ 6.118e-08, 5.13395999022, 1194.44701022 ],
    [ 6.477e-08, 2.64986648493, 19804.8272916 ]
    // 72 terms retained
];

KMG.VSOPTerms.earth_R1 = [
    [ 0.00103018607, 1.10748968172, 6283.07584999 ],
    [ 1.721238e-05, 1.06442300386, 12566.1517 ],
    [ 7.02217e-06, 3.14159265359, 0 ],
    [ 3.2345e-07, 1.02168583254, 18849.22755 ],
    [ 3.0801e-07, 2.84358443952, 5507.55323867 ],
    [ 2.4978e-07, 1.31906570344, 5223.6939198 ],
    [ 1.8487e-07, 1.42428709076, 1577.34354245 ],
    [ 1.0077e-07, 5.91385248388, 10977.0788047 ],
    [ 8.635e-08, 0.27158192945, 5486.77784318 ],
    [ 8.654e-08, 1.42046854427, 6275.96230299 ]
    // 10 terms retained
];

KMG.VSOPTerms.earth_R2 = [
    [ 4.359385e-05, 5.78455133808, 6283.07584999 ],
    [ 1.23633e-06, 5.57935427994, 12566.1517 ],
    [ 1.2342e-07, 3.14159265359, 0 ],
    [ 8.792e-08, 3.62777893099, 77713.7714681 ],
    [ 5.689e-08, 1.86958905084, 5573.14280143 ],
    [ 3.302e-08, 5.47034879713, 18849.22755 ]
    // 6 terms retained
];

KMG.VSOPTerms.earth_R3 = [
    [ 1.44595e-06, 4.27319433901, 6283.07584999 ],
    [ 6.729e-08, 3.91706261708, 12566.1517 ]
    // 2 terms retained
];

KMG.VSOPTerms.earth_R4 = [
    [ 3.858e-08, 2.56389016346, 6283.07584999 ]
    // 1 terms retained
];

KMG.VSOPTerms.earth_R5 = [
    [ 0, 0, 0 ]
    // 0 terms retained
];














KMG.VSOPTerms.mars_L0 = [
    [ 6.20347711581, 0, 0 ],
    [ 0.18656368093, 5.0503710027, 3340.6124267 ],
    [ 0.01108216816, 5.40099836344, 6681.2248534 ],
    [ 0.00091798406, 5.75478744667, 10021.8372801 ],
    [ 0.00027744987, 5.97049513147, 3.523118349 ],
    [ 0.00010610235, 2.93958560338, 2281.23049651 ],
    [ 0.00012315897, 0.84956094002, 2810.92146161 ],
    [ 8.926784e-05, 4.15697846427, 0.0172536522 ],
    [ 8.715691e-05, 6.11005153139, 13362.4497068 ],
    [ 6.797556e-05, 0.36462229657, 398.149003408 ],
    [ 7.774872e-05, 3.33968761376, 5621.84292321 ],
    [ 3.575078e-05, 1.6618650571, 2544.31441988 ],
    [ 4.161108e-05, 0.22814971327, 2942.46342329 ],
    [ 3.075252e-05, 0.85696614132, 191.448266112 ],
    [ 2.628117e-05, 0.64806124465, 3337.08930835 ],
    [ 2.937546e-05, 6.07893711402, 0.0673103028 ],
    [ 2.389414e-05, 5.03896442664, 796.298006816 ],
    [ 2.579844e-05, 0.02996736156, 3344.13554505 ],
    [ 1.528141e-05, 1.14979301996, 6151.5338883 ],
    [ 1.798806e-05, 0.65634057445, 529.690965095 ],
    [ 1.264357e-05, 3.62275122593, 5092.15195812 ],
    [ 1.286228e-05, 3.06796065034, 2146.16541648 ],
    [ 1.546404e-05, 2.91579701718, 1751.53953142 ],
    [ 1.024902e-05, 3.69334099279, 8962.45534991 ],
    [ 8.91566e-06, 0.18293837498, 16703.0621335 ],
    [ 8.58759e-06, 2.4009381194, 2914.01423582 ],
    [ 8.32715e-06, 2.46418619474, 3340.59517305 ],
    [ 8.3272e-06, 4.49495782139, 3340.62968035 ],
    [ 7.12902e-06, 3.66335473479, 1059.38193019 ],
    [ 7.48723e-06, 3.82248614017, 155.420399434 ],
    [ 7.23861e-06, 0.67497311481, 3738.76143011 ],
    [ 6.35548e-06, 2.92182225127, 8432.76438482 ],
    [ 6.55162e-06, 0.48864064125, 3127.31333126 ],
    [ 5.50474e-06, 3.81001042328, 0.9803210682 ],
    [ 5.5275e-06, 4.47479317037, 1748.01641307 ],
    [ 4.25966e-06, 0.55364317304, 6283.07584999 ],
    [ 4.15131e-06, 0.49662285038, 213.299095438 ],
    [ 4.72167e-06, 3.62547124025, 1194.44701022 ],
    [ 3.06551e-06, 0.38052848348, 6684.74797175 ],
    [ 3.12141e-06, 0.99853944405, 6677.70173505 ],
    [ 2.93198e-06, 4.22131299634, 20.7753954924 ],
    [ 3.02375e-06, 4.48618007156, 3532.06069281 ],
    [ 2.74027e-06, 0.54222167059, 3340.5451164 ],
    [ 2.81079e-06, 5.88163521788, 1349.86740966 ],
    [ 2.31183e-06, 1.28242156993, 3870.30339179 ],
    [ 2.83602e-06, 5.7688543494, 3149.16416059 ],
    [ 2.36117e-06, 5.75503217933, 3333.4988797 ],
    [ 2.74033e-06, 0.13372524985, 3340.679737 ],
    [ 2.99395e-06, 2.78323740866, 6254.62666252 ],
    [ 2.04162e-06, 2.82133445874, 1221.84856632 ],
    [ 2.38866e-06, 5.37153646326, 4136.91043352 ],
    [ 1.88648e-06, 1.4910406604, 9492.146315 ],
    [ 2.21228e-06, 3.50466812198, 382.896532223 ],
    [ 1.79196e-06, 1.00561962003, 951.718406251 ],
    [ 1.72117e-06, 0.43943649536, 5486.77784318 ],
    [ 1.93118e-06, 3.35716641911, 3.5904286518 ],
    [ 1.44304e-06, 1.41874112114, 135.065080035 ],
    [ 1.60016e-06, 3.94857092451, 4562.46099302 ],
    [ 1.74072e-06, 2.41361337725, 553.569402842 ],
    [ 1.30989e-06, 4.04491134956, 12303.0677766 ],
    [ 1.38243e-06, 4.30145122848, 7.1135470008 ],
    [ 1.28062e-06, 1.8066581622, 5088.62883977 ],
    [ 1.39898e-06, 3.32595559208, 2700.71514039 ],
    [ 1.28105e-06, 2.20807538189, 1592.59601363 ],
    [ 1.16944e-06, 3.12806863456, 7903.07341972 ],
    [ 1.10378e-06, 1.05194545948, 242.728603974 ],
    [ 1.13481e-06, 3.70070432339, 1589.07289528 ],
    [ 1.00099e-06, 3.24340223714, 11773.3768115 ],
    [ 9.5594e-07, 0.53950648295, 20043.6745602 ],
    [ 9.8947e-07, 4.84558326403, 6681.24210705 ],
    [ 1.04542e-06, 0.78532737699, 8827.39026987 ],
    [ 8.4186e-07, 3.98971116025, 4399.99435689 ],
    [ 8.6928e-07, 2.20183965407, 11243.6858464 ],
    [ 7.1438e-07, 2.80307223477, 3185.19202727 ],
    [ 7.2095e-07, 5.84669532401, 5884.92684658 ],
    [ 7.3482e-07, 2.18421190324, 8429.24126647 ],
    [ 9.8946e-07, 2.81481171439, 6681.20759975 ],
    [ 6.8413e-07, 2.73834597183, 2288.34404351 ],
    [ 8.6747e-07, 1.02091867465, 7079.37385681 ],
    [ 6.5316e-07, 2.68114882713, 28.4491874678 ],
    [ 8.3745e-07, 3.20254912006, 4690.47983636 ],
    [ 7.5031e-07, 0.76647765061, 6467.92575796 ],
    [ 6.8983e-07, 3.76403440528, 6041.32756709 ],
    [ 6.6706e-07, 0.73630288873, 3723.50895892 ],
    [ 6.3313e-07, 4.5277185022, 426.598190876 ],
    [ 6.1684e-07, 6.16831461502, 2274.11694951 ],
    [ 5.226e-07, 0.89938935091, 9623.68827669 ],
    [ 5.5485e-07, 4.60622447136, 4292.33083295 ],
    [ 5.1331e-07, 4.14823934301, 3341.59274777 ],
    [ 5.6633e-07, 5.06250402329, 15.252471185 ],
    [ 6.3376e-07, 0.91293637746, 3553.91152214 ],
    [ 4.5822e-07, 0.78790300125, 1990.74501704 ],
    [ 4.8553e-07, 3.95677994023, 4535.05943692 ],
    [ 4.1223e-07, 6.02013764154, 3894.18182954 ],
    [ 4.1941e-07, 3.58309124437, 8031.09226306 ],
    [ 5.6395e-07, 1.68727941626, 6872.67311951 ],
    [ 5.5907e-07, 3.46261441099, 263.083923373 ],
    [ 5.1677e-07, 2.81307639242, 3339.63210563 ],
    [ 4.0669e-07, 3.13838566327, 9595.23908922 ],
    [ 3.8111e-07, 0.73396370751, 10025.3603984 ],
    [ 3.9498e-07, 5.6322574136, 3097.88382273 ],
    [ 4.4175e-07, 3.19530118759, 5628.95647021 ],
    [ 3.6718e-07, 2.63750919104, 692.157601227 ],
    [ 4.5905e-07, 0.28717581576, 5614.72937621 ],
    [ 3.8351e-07, 5.82880639987, 3191.04922957 ],
    [ 3.8198e-07, 2.34832438823, 162.466636132 ],
    [ 3.2561e-07, 0.48401318272, 6681.2921637 ],
    [ 3.7135e-07, 0.68510839331, 2818.03500861 ],
    [ 3.1169e-07, 3.98160436995, 20.3553193988 ],
    [ 3.2561e-07, 0.89250965753, 6681.1575431 ],
    [ 3.7749e-07, 4.15481250779, 2803.8079146 ],
    [ 3.3626e-07, 6.11997987693, 6489.77658729 ],
    [ 2.9007e-07, 2.42707198395, 3319.83703121 ],
    [ 3.8794e-07, 1.35194224244, 10018.3141618 ],
    [ 3.3149e-07, 1.140241952, 5.5229243074 ],
    [ 2.7583e-07, 1.59721760699, 7210.91581849 ],
    [ 2.8699e-07, 5.7204755094, 7477.52286022 ],
    [ 3.4039e-07, 2.59525636978, 11769.8536932 ],
    [ 2.538e-07, 0.52092092633, 10.6366653498 ],
    [ 2.6355e-07, 1.34519007001, 3496.03282613 ],
    [ 2.4555e-07, 4.00321315879, 11371.7046898 ],
    [ 2.5637e-07, 0.24963503109, 522.577418094 ],
    [ 2.7275e-07, 4.55649766071, 3361.38782219 ],
    [ 2.3766e-07, 1.84063759173, 12832.7587417 ],
    [ 2.2814e-07, 3.52628452806, 1648.4467572 ],
    [ 2.2272e-07, 0.72111173236, 266.607041722 ]
    // 126 terms retained
];

KMG.VSOPTerms.mars_L1 = [
    [ 3340.61242701, 0, 0 ],
    [ 0.01457554523, 3.60433733236, 3340.6124267 ],
    [ 0.00168414711, 3.92318567804, 6681.2248534 ],
    [ 0.00020622975, 4.26108844583, 10021.8372801 ],
    [ 3.452392e-05, 4.7321039319, 3.523118349 ],
    [ 2.586332e-05, 4.60670058555, 13362.4497068 ],
    [ 8.41535e-06, 4.45864030426, 2281.23049651 ],
    [ 5.37567e-06, 5.01581256923, 398.149003408 ],
    [ 5.20948e-06, 4.99428054039, 3344.13554505 ],
    [ 4.32635e-06, 2.56070853083, 191.448266112 ],
    [ 4.29655e-06, 5.31645299471, 155.420399434 ],
    [ 3.81751e-06, 3.53878166043, 796.298006816 ],
    [ 3.2853e-06, 4.95632685192, 16703.0621335 ],
    [ 2.82795e-06, 3.15966768785, 2544.31441988 ],
    [ 2.05657e-06, 4.56889279932, 2146.16541648 ],
    [ 1.68866e-06, 1.3293655906, 3337.08930835 ],
    [ 1.57593e-06, 4.18519540728, 1751.53953142 ],
    [ 1.33686e-06, 2.23327245555, 0.9803210682 ],
    [ 1.16965e-06, 2.21414273762, 1059.38193019 ],
    [ 1.17503e-06, 6.02411290806, 6151.5338883 ],
    [ 1.13718e-06, 5.42753341019, 3738.76143011 ],
    [ 1.33565e-06, 5.97420357518, 1748.01641307 ],
    [ 9.1099e-07, 1.09626613064, 1349.86740966 ],
    [ 8.4256e-07, 5.29330740437, 6684.74797175 ],
    [ 1.13886e-06, 2.12863726524, 1194.44701022 ],
    [ 8.0823e-07, 4.42818326716, 529.690965095 ],
    [ 7.9847e-07, 2.24822372859, 8962.45534991 ],
    [ 7.2505e-07, 5.84203374239, 242.728603974 ],
    [ 7.2945e-07, 2.50193599662, 951.718406251 ],
    [ 7.149e-07, 3.85645759558, 2914.01423582 ],
    [ 8.534e-07, 3.90856932983, 553.569402842 ],
    [ 6.758e-07, 5.0233489507, 382.896532223 ],
    [ 6.506e-07, 1.01810963274, 3340.59517305 ],
    [ 6.5061e-07, 3.04888114328, 3340.62968035 ],
    [ 6.1478e-07, 4.15185188249, 3149.16416059 ],
    [ 4.8482e-07, 4.87339233007, 213.299095438 ],
    [ 4.6581e-07, 1.31461442691, 3185.19202727 ],
    [ 5.6642e-07, 3.88772102421, 4136.91043352 ],
    [ 4.7615e-07, 1.18228660215, 3333.4988797 ],
    [ 4.2052e-07, 5.30826745759, 20043.6745602 ],
    [ 4.133e-07, 0.71392238704, 1592.59601363 ],
    [ 4.028e-07, 2.72571311592, 7.1135470008 ],
    [ 3.304e-07, 5.40823104809, 6283.07584999 ],
    [ 2.8676e-07, 0.04305323493, 9492.146315 ],
    [ 2.2322e-07, 5.86718681699, 3870.30339179 ],
    [ 2.2432e-07, 5.46596961275, 20.3553193988 ],
    [ 2.2606e-07, 0.83782540818, 3097.88382273 ],
    [ 2.1416e-07, 5.37936489667, 3340.5451164 ],
    [ 2.3347e-07, 6.167744339, 3532.06069281 ],
    [ 2.6573e-07, 3.8900063113, 1221.84856632 ],
    [ 2.28e-07, 1.54501542908, 2274.11694951 ],
    [ 2.0474e-07, 2.3623686167, 1589.07289528 ],
    [ 2.0179e-07, 3.36390759347, 5088.62883977 ],
    [ 2.0013e-07, 2.57546546037, 12303.0677766 ],
    [ 1.992e-07, 0.44761063096, 6677.70173505 ],
    [ 2.655e-07, 5.11303525089, 2700.71514039 ],
    [ 2.1104e-07, 3.52541056271, 15.252471185 ],
    [ 2.1424e-07, 4.97083417225, 3340.679737 ],
    [ 1.8502e-07, 5.57854926842, 1990.74501704 ],
    [ 1.7805e-07, 6.12513609945, 4292.33083295 ],
    [ 1.6463e-07, 2.60307709195, 3341.59274777 ],
    [ 1.6592e-07, 1.25515357212, 3894.18182954 ],
    [ 1.9864e-07, 2.52765519587, 4399.99435689 ],
    [ 1.5002e-07, 1.03518790208, 2288.34404351 ],
    [ 2.0011e-07, 4.73112374598, 4690.47983636 ],
    [ 1.5431e-07, 2.46932776517, 4535.05943692 ],
    [ 2.0193e-07, 5.78561467842, 7079.37385681 ],
    [ 1.5298e-07, 2.26504738206, 3723.50895892 ],
    [ 1.5019e-07, 3.36690751539, 6681.24210705 ],
    [ 1.3219e-07, 5.61412860968, 10025.3603984 ],
    [ 1.3517e-07, 2.12392880454, 5486.77784318 ],
    [ 1.5019e-07, 1.33613594479, 6681.20759975 ],
    [ 1.2676e-07, 2.95036175206, 3496.03282613 ],
    [ 1.3644e-07, 1.97710249337, 5614.72937621 ],
    [ 1.3011e-07, 1.51458564766, 5628.95647021 ],
    [ 1.1353e-07, 6.23411904718, 135.065080035 ],
    [ 1.3508e-07, 3.42721826602, 5621.84292321 ],
    [ 1.0866e-07, 5.28165480979, 2818.03500861 ],
    [ 1.188e-07, 3.12847055823, 426.598190876 ],
    [ 1.0467e-07, 2.7359860705, 2787.04302386 ],
    [ 1.1131e-07, 5.84122566289, 2803.8079146 ],
    [ 1.177e-07, 2.58277425311, 8432.76438482 ],
    [ 1.1861e-07, 5.47552055459, 3553.91152214 ],
    [ 8.54e-08, 1.91739325491, 11773.3768115 ],
    [ 9.819e-08, 4.52958330672, 6489.77658729 ],
    [ 8.552e-08, 3.16147568714, 162.466636132 ],
    [ 1.0957e-07, 4.15775327007, 2388.89402045 ],
    [ 8.948e-08, 4.23164385777, 7477.52286022 ],
    [ 8.131e-08, 1.61308074119, 2957.71589448 ],
    [ 8.352e-08, 2.18475645206, 23.8784377478 ],
    [ 8.03e-08, 5.69889507906, 6041.32756709 ],
    [ 7.878e-08, 5.71359767892, 9623.68827669 ],
    [ 8.713e-08, 4.43300582398, 5092.15195812 ],
    [ 8.421e-08, 3.1635506725, 3347.7259737 ],
    [ 6.67e-08, 5.07423317095, 8031.09226306 ],
    [ 8.656e-08, 4.33239148117, 3339.63210563 ],
    [ 7.354e-08, 6.17934256606, 3583.34103067 ],
    [ 5.749e-08, 3.67719823582, 8429.24126647 ],
    [ 6.235e-08, 3.54003325209, 692.157601227 ],
    [ 5.458e-08, 1.05139431657, 4933.20844033 ],
    [ 6.132e-08, 1.66182646558, 6525.80445397 ],
    [ 5.197e-08, 1.14841109166, 28.4491874678 ],
    [ 4.95e-08, 5.28919125231, 6681.2921637 ],
    [ 5.516e-08, 6.12492946392, 2487.41604495 ],
    [ 4.89e-08, 3.10255139433, 5.5229243074 ],
    [ 5.354e-08, 0.37154896863, 12832.7587417 ],
    [ 4.751e-08, 0.2337468155, 36.0278666774 ],
    [ 6.362e-08, 2.11339432269, 5884.92684658 ],
    [ 4.996e-08, 2.44835744792, 5099.26550512 ],
    [ 4.952e-08, 5.69770765577, 6681.1575431 ],
    [ 4.678e-08, 0.27799012787, 10018.3141618 ],
    [ 4.746e-08, 0.00950199989, 7210.91581849 ],
    [ 4.862e-08, 5.60331599025, 6467.92575796 ],
    [ 5.544e-08, 2.00929051393, 522.577418094 ],
    [ 4.998e-08, 1.51094959078, 1744.42598442 ],
    [ 5.397e-08, 0.1884215497, 2942.46342329 ],
    [ 4.098e-08, 3.95776844736, 3.881335358 ],
    [ 5.414e-08, 5.66147396313, 23384.2869869 ],
    [ 5.467e-08, 0.19258681316, 7632.94325965 ],
    [ 4.305e-08, 2.8945229483, 2810.92146161 ],
    [ 4.118e-08, 1.59475420886, 7234.79425624 ],
    [ 4.489e-08, 4.16951490492, 2906.90068882 ],
    [ 5.277e-08, 2.22681020305, 3127.31333126 ],
    [ 3.882e-08, 2.26433789475, 2699.73481932 ],
    [ 3.544e-08, 1.76658498504, 1758.65307842 ],
    [ 3.408e-08, 2.65743533541, 4929.68532198 ],
    [ 4.336e-08, 4.43081904792, 640.877607382 ],
    [ 3.804e-08, 2.91373968131, 15643.6802033 ],
    [ 3.176e-08, 1.75893480952, 9595.23908922 ],
    [ 3.309e-08, 6.13831291678, 10419.9862835 ],
    [ 3.077e-08, 2.56194751001, 7064.12138562 ],
    [ 3.236e-08, 2.32387839882, 5085.03841111 ],
    [ 3.284e-08, 2.8621647971, 7740.60678359 ],
    [ 2.958e-08, 1.27767445188, 574.344798335 ],
    [ 2.805e-08, 0.43144651568, 5828.02847165 ],
    [ 2.851e-08, 0.98625869565, 3191.04922957 ],
    [ 3.324e-08, 2.5901098785, 2118.76386038 ],
    [ 3.039e-08, 1.86739127757, 7.046236698 ],
    [ 2.738e-08, 1.76460911547, 639.897286314 ],
    [ 2.757e-08, 3.70511041849, 10021.8545338 ],
    [ 3.376e-08, 1.53123149565, 6674.1113064 ],
    [ 2.757e-08, 1.67433972403, 10021.8200264 ],
    [ 2.67e-08, 3.11556212899, 6836.64525283 ],
    [ 2.583e-08, 3.77302627584, 2921.12778282 ],
    [ 2.51e-08, 0.30461555756, 3475.67750674 ],
    [ 2.288e-08, 2.81266012379, 7875.67186362 ],
    [ 2.411e-08, 0.97123911611, 3319.83703121 ],
    [ 2.41e-08, 2.95969382172, 6682.20517447 ],
    [ 2.211e-08, 0.61268074323, 10973.5556864 ],
    [ 2.246e-08, 4.12573972297, 59.3738619136 ],
    [ 2.183e-08, 2.17530786579, 15113.9892382 ],
    [ 2.445e-08, 5.91435376684, 5331.35744374 ]
    // 152 terms retained
];

KMG.VSOPTerms.mars_L2 = [
    [ 0.00058152577, 2.04961712429, 3340.6124267 ],
    [ 0.00013459579, 2.45738706163, 6681.2248534 ],
    [ 2.432575e-05, 2.79737979284, 10021.8372801 ],
    [ 4.01065e-06, 3.13581149963, 13362.4497068 ],
    [ 4.51384e-06, 0, 0 ],
    [ 2.22025e-06, 3.19437046607, 3.523118349 ],
    [ 1.20954e-06, 0.54327128607, 155.420399434 ],
    [ 6.2971e-07, 3.47765178989, 16703.0621335 ],
    [ 5.3644e-07, 3.54171478781, 3344.13554505 ],
    [ 3.4273e-07, 6.00208464365, 2281.23049651 ],
    [ 3.1659e-07, 4.14001980084, 191.448266112 ],
    [ 2.9839e-07, 1.9983873938, 796.298006816 ],
    [ 2.3172e-07, 4.33401932281, 242.728603974 ],
    [ 2.1663e-07, 3.44500841809, 398.149003408 ],
    [ 1.605e-07, 6.11000263211, 2146.16541648 ],
    [ 2.0369e-07, 5.42202383442, 553.569402842 ],
    [ 1.4924e-07, 6.09549588012, 3185.19202727 ],
    [ 1.6229e-07, 0.65685105422, 0.9803210682 ],
    [ 1.4317e-07, 2.61898820749, 1349.86740966 ],
    [ 1.4411e-07, 4.01941740099, 951.718406251 ],
    [ 1.1944e-07, 3.86196758615, 6684.74797175 ],
    [ 1.5655e-07, 1.22093822826, 1748.01641307 ],
    [ 1.1261e-07, 4.71857181601, 2544.31441988 ],
    [ 1.336e-07, 0.60151621438, 1194.44701022 ],
    [ 1.0395e-07, 0.25075540193, 382.896532223 ],
    [ 9.415e-08, 0.68050215057, 1059.38193019 ],
    [ 9.58e-08, 3.82256319681, 20043.6745602 ],
    [ 8.996e-08, 3.88272784458, 3738.76143011 ],
    [ 7.498e-08, 5.46428174266, 1751.53953142 ],
    [ 6.499e-08, 5.47802397833, 1592.59601363 ],
    [ 6.307e-08, 2.34134269478, 3097.88382273 ],
    [ 6.864e-08, 2.57523762859, 3149.16416059 ],
    [ 5.871e-08, 1.1486285578, 7.1135470008 ],
    [ 6.675e-08, 2.37862627319, 4136.91043352 ],
    [ 4.655e-08, 4.4310225149, 6151.5338883 ],
    [ 4.201e-08, 3.68638044545, 5614.72937621 ],
    [ 4.796e-08, 2.89378142432, 3333.4988797 ],
    [ 4.074e-08, 6.12610105396, 5628.95647021 ],
    [ 3.66e-08, 4.06581319964, 1990.74501704 ],
    [ 3.284e-08, 2.79214099721, 3894.18182954 ],
    [ 3.615e-08, 2.46526861067, 529.690965095 ],
    [ 3.214e-08, 0.68469193035, 8962.45534991 ],
    [ 3.087e-08, 4.56932030502, 3496.03282613 ],
    [ 2.918e-08, 5.41494777349, 2914.01423582 ],
    [ 2.925e-08, 1.23098223044, 2787.04302386 ],
    [ 2.808e-08, 1.38431632694, 4292.33083295 ],
    [ 2.652e-08, 1.05282528913, 3341.59274777 ],
    [ 2.92e-08, 3.41297158184, 3337.08930835 ],
    [ 2.423e-08, 0.9648433024, 4535.05943692 ],
    [ 2.311e-08, 4.84742235872, 9492.146315 ],
    [ 2.597e-08, 5.74792546254, 3340.59517305 ],
    [ 2.19e-08, 3.26596280325, 213.299095438 ],
    [ 2.598e-08, 1.49506860128, 3340.62968035 ],
    [ 2.365e-08, 4.1830384242, 10025.3603984 ],
    [ 2.63e-08, 4.67732434694, 3583.34103067 ],
    [ 2.606e-08, 2.64976204169, 2388.89402045 ],
    [ 1.822e-08, 0.97105743952, 1589.07289528 ],
    [ 2.397e-08, 1.04493547179, 4399.99435689 ],
    [ 2.203e-08, 0.16281603659, 6525.80445397 ],
    [ 2.373e-08, 4.26885534124, 7079.37385681 ],
    [ 2.366e-08, 0.00564620006, 4690.47983636 ],
    [ 1.623e-08, 4.95374152644, 5088.62883977 ],
    [ 2.143e-08, 0.47993241836, 2700.71514039 ],
    [ 1.646e-08, 4.94105214632, 1221.84856632 ],
    [ 1.588e-08, 1.11405721408, 12303.0677766 ],
    [ 1.518e-08, 0.11076145171, 2957.71589448 ],
    [ 1.774e-08, 3.80344931471, 3723.50895892 ],
    [ 1.364e-08, 3.86744855408, 6283.07584999 ],
    [ 1.764e-08, 2.51992889432, 2810.92146161 ],
    [ 1.394e-08, 2.7360876673, 7477.52286022 ],
    [ 1.28e-08, 5.47285286548, 6677.70173505 ],
    [ 1.447e-08, 2.97506973239, 6489.77658729 ],
    [ 1.248e-08, 3.77100223369, 2699.73481932 ],
    [ 1.527e-08, 2.92629955117, 640.877607382 ],
    [ 1.197e-08, 1.89205359446, 6681.24210705 ],
    [ 1.418e-08, 1.54599865534, 3347.7259737 ],
    [ 1.423e-08, 4.17063094406, 23384.2869869 ],
    [ 1.042e-08, 5.83283345776, 4933.20844033 ],
    [ 1.196e-08, 6.14479114175, 6681.20759975 ],
    [ 1.153e-08, 1.50265359557, 426.598190876 ],
    [ 1.099e-08, 3.80358943061, 3870.30339179 ],
    [ 9.09e-09, 3.81838122072, 5092.15195812 ],
    [ 1.071e-08, 5.04949161471, 5621.84292321 ],
    [ 8.46e-09, 3.82219998207, 3340.5451164 ],
    [ 1.075e-08, 3.81844135104, 3553.91152214 ],
    [ 8.56e-09, 3.42045045625, 3340.679737 ],
    [ 9.16e-09, 1.91472787569, 3532.06069281 ],
    [ 7.14e-09, 4.26169501052, 9623.68827669 ],
    [ 9.07e-09, 4.12943952579, 162.466636132 ],
    [ 6.53e-09, 3.10816357251, 7234.79425624 ],
    [ 7.92e-09, 5.20659969594, 87.3082045398 ],
    [ 6.54e-09, 1.57331630734, 2487.41604495 ],
    [ 6.49e-09, 2.78892909992, 574.344798335 ],
    [ 6.48e-09, 5.181110771, 12832.7587417 ],
    [ 7.07e-09, 5.8319586932, 3339.63210563 ],
    [ 5.2e-09, 4.64660657418, 6836.64525283 ],
    [ 6.6e-09, 0.24998045706, 8969.56889691 ],
    [ 6.4e-09, 1.70935421799, 7632.94325965 ],
    [ 5.28e-09, 0.3110540935, 8031.09226306 ],
    [ 5.1e-09, 4.63676288319, 10419.9862835 ],
    [ 6.04e-09, 3.85002715377, 5486.77784318 ],
    [ 5.14e-09, 1.38796992796, 7740.60678359 ]
    // 102 terms retained
];

KMG.VSOPTerms.mars_L3 = [
    [ 1.467867e-05, 0.4442983946, 3340.6124267 ],
    [ 6.92668e-06, 0.88679887123, 6681.2248534 ],
    [ 1.89478e-06, 1.28336839921, 10021.8372801 ],
    [ 4.1615e-07, 1.64210455567, 13362.4497068 ],
    [ 2.266e-07, 2.05278956965, 155.420399434 ],
    [ 8.126e-08, 1.99049724299, 16703.0621335 ],
    [ 1.0455e-07, 1.57992093693, 3.523118349 ],
    [ 4.902e-08, 2.8251687501, 242.728603974 ],
    [ 5.379e-08, 3.14159265359, 0 ],
    [ 3.782e-08, 2.01848153986, 3344.13554505 ],
    [ 3.181e-08, 4.59108786647, 3185.19202727 ],
    [ 3.133e-08, 0.65141319517, 553.569402842 ],
    [ 1.698e-08, 5.53803382831, 951.718406251 ],
    [ 1.525e-08, 5.71698515888, 191.448266112 ],
    [ 1.451e-08, 0.4606849022, 796.298006816 ],
    [ 1.473e-08, 2.33727441522, 20043.6745602 ],
    [ 1.314e-08, 5.36403056955, 0.9803210682 ],
    [ 1.178e-08, 4.14644990348, 1349.86740966 ],
    [ 1.138e-08, 2.37914351932, 6684.74797175 ],
    [ 1.046e-08, 1.76915268602, 382.896532223 ],
    [ 9.02e-09, 5.35475854699, 1194.44701022 ],
    [ 8.13e-09, 2.74852234414, 1748.01641307 ],
    [ 6.29e-09, 6.08292992203, 3496.03282613 ],
    [ 5.64e-09, 1.87914711325, 398.149003408 ],
    [ 5.66e-09, 5.8543921654, 7.1135470008 ],
    [ 6.46e-09, 3.17980126471, 3583.34103067 ]
    // 26 terms retained
];

KMG.VSOPTerms.mars_L4 = [
    [ 2.7242e-07, 5.6399774232, 6681.2248534 ],
    [ 2.5511e-07, 5.13956279086, 3340.6124267 ],
    [ 1.1147e-07, 6.03556608878, 10021.8372801 ],
    [ 3.19e-08, 3.56206901204, 155.420399434 ],
    [ 3.251e-08, 0.1291561646, 13362.4497068 ]
    // 5 terms retained
];

KMG.VSOPTerms.mars_L5 = [
    [ 7.62e-09, 4.03556368806, 6681.2248534 ],
    [ 5.11e-09, 4.4877039364, 10021.8372801 ],
    [ 3.6e-09, 5.07296615717, 155.420399434 ]
    // 3 terms retained
];

KMG.VSOPTerms.mars_B0 = [
    [ 0.03197134986, 3.76832042431, 3340.6124267 ],
    [ 0.00298033234, 4.10616996305, 6681.2248534 ],
    [ 0.00289104742, 0, 0 ],
    [ 0.00031365539, 4.4465105309, 10021.8372801 ],
    [ 3.4841e-05, 4.7881254926, 13362.4497068 ],
    [ 4.42999e-06, 5.65233014206, 3337.08930835 ],
    [ 4.43401e-06, 5.02642622964, 3344.13554505 ],
    [ 3.99109e-06, 5.13056816928, 16703.0621335 ],
    [ 2.92506e-06, 3.79290674178, 2281.23049651 ],
    [ 1.81982e-06, 6.13648041445, 6151.5338883 ],
    [ 1.63159e-06, 4.26399640691, 529.690965095 ],
    [ 1.59678e-06, 2.23194572851, 1059.38193019 ],
    [ 1.39323e-06, 2.41796458896, 8962.45534991 ],
    [ 1.49297e-06, 2.16501221175, 5621.84292321 ],
    [ 1.42686e-06, 1.18215016908, 3340.59517305 ],
    [ 1.42685e-06, 3.21292181638, 3340.62968035 ],
    [ 8.2544e-07, 5.36667920373, 6684.74797175 ],
    [ 7.3639e-07, 5.0918769577, 398.149003408 ],
    [ 7.266e-07, 5.53775735826, 6283.07584999 ],
    [ 8.6377e-07, 5.74429749104, 3738.76143011 ],
    [ 8.3276e-07, 5.98866355811, 6677.70173505 ],
    [ 6.0116e-07, 3.67960801961, 796.298006816 ],
    [ 6.3111e-07, 0.73049101791, 5884.92684658 ],
    [ 6.2338e-07, 4.8507212869, 2942.46342329 ]
    // 24 terms retained
];

KMG.VSOPTerms.mars_B1 = [
    [ 0.00217310991, 6.04472194776, 3340.6124267 ],
    [ 0.00020976948, 3.14159265359, 0 ],
    [ 0.00012834709, 1.60810667915, 6681.2248534 ],
    [ 3.320981e-05, 2.62947004077, 10021.8372801 ],
    [ 6.272e-06, 3.11898601248, 13362.4497068 ],
    [ 1.0199e-06, 3.52113557592, 16703.0621335 ],
    [ 7.5107e-07, 0.95983758515, 3337.08930835 ],
    [ 2.9264e-07, 3.4030768271, 3344.13554505 ],
    [ 2.3251e-07, 3.69342549027, 5621.84292321 ],
    [ 2.219e-07, 2.21703408598, 2281.23049651 ],
    [ 1.5454e-07, 3.89610159362, 20043.6745602 ],
    [ 1.1867e-07, 3.83861019788, 6684.74797175 ],
    [ 1.2038e-07, 2.13866775328, 6151.5338883 ],
    [ 9.697e-08, 5.48941186798, 3340.62968035 ],
    [ 9.697e-08, 3.45863925102, 3340.59517305 ],
    [ 1.1537e-07, 1.90395033905, 3532.06069281 ],
    [ 9.276e-08, 0.71941312462, 2942.46342329 ],
    [ 9.24e-08, 2.51747952408, 5884.92684658 ],
    [ 9.876e-08, 6.13507416822, 1059.38193019 ],
    [ 9.265e-08, 4.55759125226, 8962.45534991 ],
    [ 7.822e-08, 6.10932267009, 2810.92146161 ],
    [ 1.0369e-07, 0.60195347181, 529.690965095 ],
    [ 8.522e-08, 4.40106741096, 3496.03282613 ],
    [ 7.683e-08, 1.21169696624, 6677.70173505 ],
    [ 7.134e-08, 1.93610705535, 2544.31441988 ],
    [ 6.512e-08, 3.11636422105, 3738.76143011 ],
    [ 6.278e-08, 6.23176923902, 3185.19202727 ],
    [ 5.833e-08, 0.74324094343, 398.149003408 ],
    [ 5.033e-08, 2.28727456802, 3149.16416059 ],
    [ 4.958e-08, 1.54200127913, 6283.07584999 ]
    // 30 terms retained
];

KMG.VSOPTerms.mars_B2 = [
    [ 8.888446e-05, 1.06196052751, 3340.6124267 ],
    [ 2.595393e-05, 3.14159265359, 0 ],
    [ 9.18914e-06, 0.1153843119, 6681.2248534 ],
    [ 2.67883e-06, 0.78837893063, 10021.8372801 ],
    [ 6.6911e-07, 1.39435595847, 13362.4497068 ],
    [ 1.4267e-07, 1.87268116087, 16703.0621335 ],
    [ 7.948e-08, 2.58819177832, 3337.08930835 ],
    [ 2.709e-08, 2.29241371893, 20043.6745602 ],
    [ 2.911e-08, 1.36634316448, 3344.13554505 ],
    [ 2.528e-08, 6.00423798411, 3496.03282613 ],
    [ 1.617e-08, 5.72212771018, 5621.84292321 ],
    [ 1.625e-08, 4.63140305669, 3185.19202727 ]
    // 12 terms retained
];

KMG.VSOPTerms.mars_B3 = [
    [ 3.30418e-06, 2.04215300484, 3340.6124267 ],
    [ 9.3057e-07, 0, 0 ],
    [ 1.4546e-07, 5.38525967237, 10021.8372801 ],
    [ 8.731e-08, 4.90252313032, 6681.2248534 ],
    [ 5.215e-08, 5.97441462813, 13362.4497068 ],
    [ 1.422e-08, 0.21283650226, 16703.0621335 ]
    // 6 terms retained
];

KMG.VSOPTerms.mars_B4 = [
    [ 6.007e-08, 3.37637101191, 3340.6124267 ],
    [ 6.625e-08, 0, 0 ]
    // 2 terms retained
];

KMG.VSOPTerms.mars_B5 = [
    [ 0, 0, 0 ]
    // 0 terms retained
];

KMG.VSOPTerms.mars_R0 = [
    [ 1.53033488271, 0, 0 ],
    [ 0.1418495316, 3.47971283528, 3340.6124267 ],
    [ 0.00660776362, 3.81783443019, 6681.2248534 ],
    [ 0.00046179117, 4.15595316782, 10021.8372801 ],
    [ 8.109733e-05, 5.55958416318, 2810.92146161 ],
    [ 7.485318e-05, 1.77239078402, 5621.84292321 ],
    [ 5.523191e-05, 1.3643630377, 2281.23049651 ],
    [ 3.82516e-05, 4.49407183687, 13362.4497068 ],
    [ 2.306537e-05, 0.09081579001, 2544.31441988 ],
    [ 1.999396e-05, 5.36059617709, 3337.08930835 ],
    [ 2.484394e-05, 4.9254563992, 2942.46342329 ],
    [ 1.960195e-05, 4.74249437639, 3344.13554505 ],
    [ 1.167119e-05, 2.11260868341, 5092.15195812 ],
    [ 1.102816e-05, 5.00908403998, 398.149003408 ],
    [ 8.99066e-06, 4.40791133207, 529.690965095 ],
    [ 9.92252e-06, 5.83861961952, 6151.5338883 ],
    [ 8.07354e-06, 2.10217065501, 1059.38193019 ],
    [ 7.97915e-06, 3.44839203899, 796.298006816 ],
    [ 7.40975e-06, 1.49906336885, 2146.16541648 ],
    [ 6.92339e-06, 2.13378874689, 8962.45534991 ],
    [ 6.33144e-06, 0.89353283242, 3340.59517305 ],
    [ 7.25583e-06, 1.24516810723, 8432.76438482 ],
    [ 6.3314e-06, 2.92430446399, 3340.62968035 ],
    [ 5.74355e-06, 0.82896244455, 2914.01423582 ],
    [ 5.26166e-06, 5.38292991236, 3738.76143011 ],
    [ 6.29978e-06, 1.28737486495, 1751.53953142 ],
    [ 4.72775e-06, 5.19850522346, 3127.31333126 ],
    [ 3.48095e-06, 4.83219199976, 16703.0621335 ],
    [ 2.83713e-06, 2.90692064724, 3532.06069281 ],
    [ 2.79543e-06, 5.2574968538, 6283.07584999 ],
    [ 2.33857e-06, 5.10545987572, 5486.77784318 ],
    [ 2.19427e-06, 5.58340231744, 191.448266112 ],
    [ 2.69896e-06, 3.76393625127, 5884.92684658 ],
    [ 2.08335e-06, 5.25476078693, 3340.5451164 ],
    [ 2.75217e-06, 2.90817482492, 1748.01641307 ],
    [ 2.75506e-06, 1.21767950614, 6254.62666252 ],
    [ 2.39119e-06, 2.03669934656, 1194.44701022 ],
    [ 2.23189e-06, 4.19861535147, 3149.16416059 ],
    [ 1.82689e-06, 5.08062725665, 6684.74797175 ],
    [ 1.86207e-06, 5.6987157241, 6677.70173505 ],
    [ 1.76e-06, 5.95341919657, 3870.30339179 ],
    [ 1.78617e-06, 4.18423004741, 3333.4988797 ],
    [ 2.0833e-06, 4.84626439637, 3340.679737 ],
    [ 2.28126e-06, 3.25526555588, 6872.67311951 ],
    [ 1.44312e-06, 0.2130621946, 5088.62883977 ],
    [ 1.63527e-06, 3.79888811958, 4136.91043352 ],
    [ 1.33126e-06, 1.53906679361, 7903.07341972 ],
    [ 1.41755e-06, 2.47792380112, 4562.46099302 ],
    [ 1.14927e-06, 4.31748869065, 1349.86740966 ],
    [ 1.18789e-06, 2.12168482244, 1589.07289528 ],
    [ 1.02094e-06, 6.18145185708, 9492.146315 ],
    [ 1.2857e-06, 5.49884728795, 8827.39026987 ],
    [ 1.11546e-06, 0.55346108403, 11243.6858464 ],
    [ 8.2498e-07, 1.62220096558, 11773.3768115 ],
    [ 8.3204e-07, 0.61551135046, 8429.24126647 ],
    [ 8.4463e-07, 0.62274409931, 1592.59601363 ],
    [ 8.6666e-07, 1.74984525176, 2700.71514039 ],
    [ 7.1813e-07, 2.4749406548, 12303.0677766 ],
    [ 8.5321e-07, 1.61634750496, 4690.47983636 ],
    [ 6.3641e-07, 2.67334163937, 426.598190876 ],
    [ 6.8601e-07, 2.40188234283, 4399.99435689 ],
    [ 5.8559e-07, 4.7205283999, 213.299095438 ],
    [ 6.2009e-07, 1.10068565926, 1221.84856632 ],
    [ 6.6499e-07, 2.21296335919, 6041.32756709 ],
    [ 5.581e-07, 1.2328806632, 3185.19202727 ],
    [ 5.4969e-07, 5.72695354791, 951.718406251 ],
    [ 5.243e-07, 3.0236809553, 4292.33083295 ],
    [ 5.5688e-07, 5.44688671707, 3723.50895892 ],
    [ 5.8959e-07, 3.26242460622, 6681.24210705 ],
    [ 4.4638e-07, 2.01459444131, 8031.09226306 ],
    [ 5.8959e-07, 1.2316529679, 6681.20759975 ],
    [ 4.2439e-07, 2.26554261514, 155.420399434 ],
    [ 3.8955e-07, 2.57760417339, 3341.59274777 ],
    [ 5.155e-07, 5.72324451485, 7079.37385681 ],
    [ 4.894e-07, 5.61613493545, 3553.91152214 ],
    [ 4.5406e-07, 5.43303278149, 6467.92575796 ],
    [ 3.6438e-07, 4.43922435395, 3894.18182954 ],
    [ 3.598e-07, 1.15972378713, 2288.34404351 ],
    [ 3.5268e-07, 5.49032233898, 1990.74501704 ],
    [ 4.2192e-07, 1.63254827838, 5628.95647021 ],
    [ 4.4292e-07, 5.00344221303, 5614.72937621 ],
    [ 3.3616e-07, 5.17029030468, 20043.6745602 ],
    [ 4.3256e-07, 1.03722397198, 11769.8536932 ],
    [ 3.9237e-07, 1.24237030858, 3339.63210563 ],
    [ 3.1949e-07, 4.59259676953, 2274.11694951 ],
    [ 3.0352e-07, 2.44163963455, 11371.7046898 ],
    [ 3.2269e-07, 2.38222363233, 4535.05943692 ],
    [ 3.1855e-07, 4.37536980289, 3.523118349 ],
    [ 2.9342e-07, 4.06035002188, 3097.88382273 ],
    [ 3.1967e-07, 1.93969979134, 382.896532223 ],
    [ 2.6164e-07, 5.58463559826, 9623.68827669 ],
    [ 2.7903e-07, 4.25809486053, 3191.04922957 ],
    [ 3.3044e-07, 0.85475620169, 553.569402842 ],
    [ 2.7544e-07, 1.5766864517, 9595.23908922 ],
    [ 2.5163e-07, 0.81337734264, 10713.9948813 ],
    [ 2.2045e-07, 0.85711201558, 3319.83703121 ],
    [ 2.4759e-07, 5.38993953923, 2818.03500861 ],
    [ 2.3352e-07, 6.0145897459, 3496.03282613 ],
    [ 2.4723e-07, 2.58025225634, 2803.8079146 ],
    [ 1.9361e-07, 5.18528881954, 6681.2921637 ],
    [ 1.9118e-07, 5.419693554, 10025.3603984 ],
    [ 1.9361e-07, 5.59378511334, 6681.1575431 ],
    [ 1.8331e-07, 5.7956572331, 7064.12138562 ],
    [ 1.8188e-07, 5.61299105522, 7.1135470008 ],
    [ 2.0393e-07, 4.53615443964, 6489.77658729 ],
    [ 2.1258e-07, 6.19174428363, 14054.607308 ],
    [ 1.7094e-07, 1.54988538094, 2957.71589448 ],
    [ 2.2794e-07, 3.41719468533, 7632.94325965 ],
    [ 2.0561e-07, 2.98654120324, 3361.38782219 ],
    [ 1.705e-07, 6.15529583629, 10404.7338123 ],
    [ 1.8007e-07, 2.81505100996, 4032.77002793 ],
    [ 1.6487e-07, 3.84534133372, 10973.5556864 ],
    [ 1.6056e-07, 0.92819026247, 14584.2982731 ],
    [ 2.1008e-07, 2.38506850221, 4989.0591839 ],
    [ 1.6291e-07, 1.92190075688, 7373.38245463 ],
    [ 1.6286e-07, 6.28252184173, 7210.91581849 ],
    [ 1.8575e-07, 4.07319565284, 2388.89402045 ],
    [ 1.5976e-07, 4.58379703739, 3264.34635542 ],
    [ 1.9909e-07, 2.73523951203, 5099.26550512 ],
    [ 1.9667e-07, 1.86294734899, 3443.70520092 ],
    [ 1.65e-07, 4.1406165717, 7477.52286022 ],
    [ 1.9492e-07, 6.03778625701, 10018.3141618 ],
    [ 1.5097e-07, 2.65433832872, 2787.04302386 ],
    [ 1.9099e-07, 0.22623513076, 13745.346239 ],
    [ 1.7164e-07, 3.1882629935, 3347.7259737 ],
    [ 1.3407e-07, 2.12775612449, 3344.20285535 ],
    [ 1.5407e-07, 2.20766468871, 2118.76386038 ],
    [ 1.7246e-07, 3.67064642858, 3205.54734666 ],
    [ 1.3091e-07, 4.27475419816, 14314.168113 ],
    [ 1.6437e-07, 2.86612474805, 14712.3171165 ],
    [ 1.6648e-07, 4.521351492, 6674.1113064 ],
    [ 1.3718e-07, 1.68586111426, 3337.02199805 ],
    [ 1.1824e-07, 0.19675650045, 3475.67750674 ],
    [ 1.1757e-07, 3.23020638064, 5828.02847165 ],
    [ 1.1884e-07, 4.82075035433, 7234.79425624 ],
    [ 1.0608e-07, 1.73995972784, 639.897286314 ],
    [ 1.1143e-07, 0.23833349966, 12832.7587417 ],
    [ 1.1028e-07, 0.4455568729, 10213.2855462 ],
    [ 1.0238e-07, 5.74731032428, 242.728603974 ],
    [ 1.0052e-07, 2.45096419672, 4929.68532198 ],
    [ 1.0061e-07, 0.78904152333, 9381.93999379 ],
    [ 1.0065e-07, 5.37509927353, 5085.03841111 ],
    [ 1.1897e-07, 0.79890074455, 3265.83082813 ],
    [ 8.983e-08, 0.96474320941, 4933.20844033 ],
    [ 8.976e-08, 4.18310051894, 9225.53927328 ],
    [ 8.982e-08, 1.98499607259, 15113.9892382 ],
    [ 8.325e-08, 1.93706224943, 1648.4467572 ],
    [ 7.832e-08, 2.04997038646, 1758.65307842 ],
    [ 7.964e-08, 3.92258783522, 2921.12778282 ],
    [ 1.0223e-07, 2.66509814753, 2487.41604495 ],
    [ 8.277e-08, 0.94860765545, 2906.90068882 ],
    [ 7.371e-08, 0.84436508721, 692.157601227 ],
    [ 7.529e-08, 5.68043313811, 13916.0191096 ],
    [ 7.907e-08, 2.81314645975, 15643.6802033 ],
    [ 6.956e-08, 3.32212696002, 3230.40610548 ],
    [ 7.426e-08, 6.09654676653, 3583.34103067 ],
    [ 6.402e-08, 4.19806999276, 5202.35827934 ],
    [ 6.523e-08, 6.11927838278, 135.065080035 ],
    [ 6.127e-08, 0.00122595969, 6836.64525283 ],
    [ 6.223e-08, 6.1065313699, 17256.6315363 ],
    [ 8.161e-08, 5.24822786208, 10575.4066829 ],
    [ 6.163e-08, 3.60026818309, 10021.8545338 ],
    [ 6.163e-08, 1.56949585888, 10021.8200264 ],
    [ 5.673e-08, 0.13638905291, 13524.9163429 ],
    [ 6.257e-08, 4.50450316951, 8425.65083781 ],
    [ 5.249e-08, 2.70116504868, 4459.3682188 ],
    [ 6.47e-08, 2.74232480124, 7740.60678359 ],
    [ 5.523e-08, 6.06378363783, 10419.9862835 ],
    [ 5.548e-08, 5.75002125481, 12168.0026966 ],
    [ 6.827e-08, 4.69340338938, 17654.7805397 ],
    [ 4.993e-08, 4.68464837021, 522.577418094 ],
    [ 6.32e-08, 3.3193809127, 3767.21061758 ],
    [ 4.735e-08, 0.00770324607, 3325.35995551 ],
    [ 5.025e-08, 2.33675441772, 1052.26838319 ],
    [ 4.656e-08, 5.15033151106, 1066.49547719 ],
    [ 4.728e-08, 5.77993082374, 9808.53818466 ],
    [ 5.128e-08, 1.57178942294, 6525.80445397 ],
    [ 4.523e-08, 1.44233177206, 3369.06161417 ],
    [ 6.205e-08, 4.48163731718, 22747.2907149 ],
    [ 6.169e-08, 4.59085555242, 6531.66165626 ],
    [ 5.329e-08, 4.55141789349, 1744.42598442 ],
    [ 4.514e-08, 5.94508421612, 6894.52394884 ],
    [ 4.33e-08, 3.10899106071, 4569.57454002 ],
    [ 5.367e-08, 5.08071026709, 2707.82868739 ],
    [ 5.138e-08, 1.28584065229, 8439.87793182 ],
    [ 4.12e-08, 5.48544036931, 2699.73481932 ],
    [ 5.398e-08, 5.21710209952, 5305.45105355 ],
    [ 4.45e-08, 5.56771154217, 16865.5287696 ],
    [ 3.898e-08, 1.48753002285, 9168.64089835 ],
    [ 3.858e-08, 1.23056079731, 16858.4825329 ],
    [ 3.764e-08, 0.27080818668, 17395.2197347 ],
    [ 4.687e-08, 3.0570907584, 5518.75014899 ],
    [ 4.264e-08, 2.79046663043, 3503.07906283 ],
    [ 3.864e-08, 0.37957786186, 10177.2576795 ],
    [ 3.992e-08, 1.84425142473, 3134.42687826 ],
    [ 3.658e-08, 2.95544843123, 6144.4203413 ],
    [ 3.65e-08, 1.58041651396, 6680.24453233 ],
    [ 3.945e-08, 1.98631850445, 8969.56889691 ]
    // 198 terms retained
];

KMG.VSOPTerms.mars_R1 = [
    [ 0.01107433345, 2.03250524857, 3340.6124267 ],
    [ 0.00103175887, 2.37071847807, 6681.2248534 ],
    [ 0.000128772, 0, 0 ],
    [ 0.0001081588, 2.70888095665, 10021.8372801 ],
    [ 1.19455e-05, 3.04702256206, 13362.4497068 ],
    [ 4.38582e-06, 2.88835054603, 2281.23049651 ],
    [ 3.957e-06, 3.42323670971, 3344.13554505 ],
    [ 1.82576e-06, 1.58427562964, 2544.31441988 ],
    [ 1.35851e-06, 3.38507063082, 16703.0621335 ],
    [ 1.28199e-06, 0.62991771813, 1059.38193019 ],
    [ 1.27059e-06, 1.95391155885, 796.298006816 ],
    [ 1.18443e-06, 2.99762091382, 2146.16541648 ],
    [ 1.28362e-06, 6.04343227063, 3337.08930835 ],
    [ 8.7534e-07, 3.42053385867, 398.149003408 ],
    [ 8.3021e-07, 3.85575072018, 3738.76143011 ],
    [ 7.5604e-07, 4.45097659377, 6151.5338883 ],
    [ 7.2002e-07, 2.76443992447, 529.690965095 ],
    [ 6.6545e-07, 2.5487838147, 1751.53953142 ],
    [ 5.4305e-07, 0.67754203387, 8962.45534991 ],
    [ 5.1043e-07, 3.72584855417, 6684.74797175 ],
    [ 6.6413e-07, 4.40596377334, 1748.01641307 ],
    [ 4.786e-07, 2.28524521788, 2914.01423582 ],
    [ 4.942e-07, 5.72961379219, 3340.59517305 ],
    [ 4.942e-07, 1.47720011103, 3340.62968035 ],
    [ 5.7519e-07, 0.5435613312, 1194.44701022 ],
    [ 4.832e-07, 2.58061402348, 3149.16416059 ],
    [ 3.6383e-07, 6.02729341698, 3185.19202727 ],
    [ 3.7161e-07, 5.81436290851, 1349.86740966 ],
    [ 3.6035e-07, 5.89515829011, 3333.4988797 ],
    [ 3.1111e-07, 0.97820401887, 191.448266112 ],
    [ 3.8957e-07, 2.31902442004, 4136.91043352 ],
    [ 2.7256e-07, 5.41369838171, 1592.59601363 ],
    [ 2.4302e-07, 3.75838444077, 155.420399434 ],
    [ 2.2808e-07, 1.74818178182, 5088.62883977 ],
    [ 2.2322e-07, 0.93941901193, 951.718406251 ],
    [ 2.1712e-07, 3.83569490817, 6283.07584999 ],
    [ 2.1302e-07, 0.78030571909, 1589.07289528 ],
    [ 2.1631e-07, 4.56903942095, 3532.06069281 ],
    [ 1.7957e-07, 4.21923537063, 3870.30339179 ],
    [ 1.8241e-07, 0.41334220202, 5486.77784318 ],
    [ 1.625e-07, 3.80772429678, 3340.5451164 ],
    [ 1.6803e-07, 5.54855432911, 3097.88382273 ],
    [ 1.6852e-07, 4.53696884484, 4292.33083295 ],
    [ 1.5749e-07, 4.75766175289, 9492.146315 ],
    [ 1.5747e-07, 3.72356261757, 20043.6745602 ],
    [ 2.0429e-07, 3.13541604634, 4690.47983636 ],
    [ 1.4699e-07, 5.95340513928, 3894.18182954 ],
    [ 1.6251e-07, 3.39910570757, 3340.679737 ],
    [ 1.4256e-07, 3.99914527335, 1990.74501704 ],
    [ 1.6529e-07, 0.96740368703, 4399.99435689 ],
    [ 1.3011e-07, 5.14215010082, 6677.70173505 ],
    [ 1.2482e-07, 1.03238555854, 3341.59274777 ],
    [ 1.6454e-07, 3.53827765951, 2700.71514039 ],
    [ 1.6167e-07, 2.3489111087, 553.569402842 ],
    [ 1.3169e-07, 0.41462220221, 5614.72937621 ],
    [ 1.127e-07, 1.02387117266, 12303.0677766 ],
    [ 1.241e-07, 6.23139144626, 5628.95647021 ],
    [ 1.2747e-07, 0.69046237163, 3723.50895892 ],
    [ 1.1828e-07, 6.25270937134, 2274.11694951 ],
    [ 1.0382e-07, 1.23229650709, 426.598190876 ],
    [ 1.1207e-07, 1.31732435116, 3496.03282613 ],
    [ 1.0345e-07, 0.90062869301, 4535.05943692 ],
    [ 1.2214e-07, 4.22347837212, 7079.37385681 ],
    [ 9.764e-08, 3.45310129694, 382.896532223 ],
    [ 8.583e-08, 1.1647889051, 2787.04302386 ],
    [ 7.879e-08, 5.73808303461, 2288.34404351 ],
    [ 9.192e-08, 1.81719352796, 6681.24210705 ],
    [ 7.752e-08, 4.15038634174, 6041.32756709 ],
    [ 9.192e-08, 6.06960723129, 6681.20759975 ],
    [ 9.008e-08, 2.58179552398, 2388.89402045 ],
    [ 6.77e-08, 0.240118807, 11773.3768115 ],
    [ 7.088e-08, 3.51428380287, 8031.09226306 ],
    [ 9.159e-08, 3.90203365989, 3553.91152214 ],
    [ 7.233e-08, 3.70260535699, 2818.03500861 ],
    [ 6.701e-08, 4.25537421062, 242.728603974 ],
    [ 6.534e-08, 0.04317593308, 2957.71589448 ],
    [ 8.783e-08, 2.19764346848, 1221.84856632 ],
    [ 6.54e-08, 2.11811131682, 8429.24126647 ],
    [ 6.835e-08, 4.04527289029, 10025.3603984 ],
    [ 7.279e-08, 4.26969778292, 2803.8079146 ],
    [ 7.679e-08, 1.00816125095, 8432.76438482 ],
    [ 5.736e-08, 3.13988802339, 213.299095438 ],
    [ 5.343e-08, 3.7818416468, 5092.15195812 ],
    [ 5.985e-08, 2.96429619989, 6489.77658729 ],
    [ 5.132e-08, 3.98288020531, 7.1135470008 ],
    [ 6.264e-08, 1.90345600186, 5621.84292321 ],
    [ 5.238e-08, 2.67050910776, 7477.52286022 ],
    [ 6.264e-08, 1.60046198142, 3347.7259737 ],
    [ 6.527e-08, 2.76220386403, 3339.63210563 ],
    [ 4.594e-08, 1.82031785094, 2810.92146161 ],
    [ 5.46e-08, 4.60869963415, 3583.34103067 ],
    [ 4.73e-08, 0.90611934427, 5099.26550512 ],
    [ 5.484e-08, 4.91405753832, 7632.94325965 ],
    [ 4.002e-08, 4.1410000521, 9623.68827669 ],
    [ 3.836e-08, 0.03411499404, 7234.79425624 ],
    [ 3.618e-08, 5.76553319747, 4933.20844033 ],
    [ 3.747e-08, 0.08776717073, 6525.80445397 ],
    [ 3.016e-08, 3.73804058695, 6681.2921637 ],
    [ 3.975e-08, 4.91286826343, 2942.46342329 ],
    [ 3.911e-08, 0.67457174687, 3127.31333126 ],
    [ 3.923e-08, 3.07698893109, 3.523118349 ],
    [ 3.943e-08, 0.53936955267, 5884.92684658 ],
    [ 2.902e-08, 4.66228680082, 7210.91581849 ],
    [ 2.803e-08, 1.00505054832, 7064.12138562 ],
    [ 3.152e-08, 4.54611126545, 2487.41604495 ],
    [ 2.797e-08, 0.05226680768, 639.897286314 ],
    [ 2.758e-08, 5.17057629399, 5828.02847165 ],
    [ 3.02e-08, 4.14658810846, 6681.1575431 ],
    [ 3e-08, 0.82762095066, 5085.03841111 ],
    [ 3.022e-08, 2.59437829291, 2906.90068882 ],
    [ 2.673e-08, 0.69433657973, 2699.73481932 ],
    [ 2.593e-08, 1.08691889359, 4929.68532198 ],
    [ 3.127e-08, 0.99947199034, 2118.76386038 ],
    [ 2.597e-08, 5.01157388627, 10018.3141618 ],
    [ 2.606e-08, 5.34395258978, 10973.5556864 ],
    [ 2.779e-08, 3.98360727591, 6467.92575796 ],
    [ 2.457e-08, 1.52659064342, 6836.64525283 ],
    [ 2.381e-08, 3.93615187831, 11371.7046898 ],
    [ 2.584e-08, 5.08907827632, 12832.7587417 ]
    // 119 terms retained
];

KMG.VSOPTerms.mars_R2 = [
    [ 0.00044242249, 0.47930604954, 3340.6124267 ],
    [ 8.138042e-05, 0.86998389204, 6681.2248534 ],
    [ 1.274915e-05, 1.22593985222, 10021.8372801 ],
    [ 1.87388e-06, 1.57298976045, 13362.4497068 ],
    [ 4.0745e-07, 1.97082077028, 3344.13554505 ],
    [ 5.2395e-07, 3.14159265359, 0 ],
    [ 2.6617e-07, 1.91665337822, 16703.0621335 ],
    [ 1.7828e-07, 4.43491476419, 2281.23049651 ],
    [ 1.1713e-07, 4.52509926559, 3185.19202727 ],
    [ 1.021e-07, 5.3914732206, 1059.38193019 ],
    [ 9.95e-08, 0.41865678448, 796.298006816 ],
    [ 9.236e-08, 4.53559625376, 2146.16541648 ],
    [ 7.299e-08, 3.1421451312, 2544.31441988 ],
    [ 7.214e-08, 2.29302335628, 6684.74797175 ],
    [ 6.81e-08, 5.26707245601, 155.420399434 ],
    [ 6.526e-08, 2.307724561, 3738.76143011 ],
    [ 7.783e-08, 5.93373461009, 1748.01641307 ],
    [ 5.84e-08, 1.0519182029, 1349.86740966 ],
    [ 6.75e-08, 5.30191763402, 1194.44701022 ],
    [ 4.695e-08, 0.76881032874, 3097.88382273 ],
    [ 5.39e-08, 1.0020006836, 3149.16416059 ],
    [ 4.406e-08, 2.45557331437, 951.718406251 ],
    [ 4.286e-08, 3.89642578846, 1592.59601363 ],
    [ 3.516e-08, 1.84991934524, 398.149003408 ],
    [ 3.699e-08, 2.26016989021, 20043.6745602 ],
    [ 3.378e-08, 3.81703201748, 1751.53953142 ],
    [ 4.585e-08, 0.80785643853, 4136.91043352 ],
    [ 3.201e-08, 2.11661594157, 5614.72937621 ],
    [ 3.62e-08, 1.32428600053, 3333.4988797 ],
    [ 2.915e-08, 1.19342490174, 529.690965095 ],
    [ 2.979e-08, 2.86468474914, 6151.5338883 ],
    [ 3.057e-08, 4.55288594507, 5628.95647021 ],
    [ 2.906e-08, 1.20300479533, 3894.18182954 ],
    [ 3.848e-08, 3.86071515455, 553.569402842 ],
    [ 2.819e-08, 2.48714583532, 1990.74501704 ],
    [ 2.657e-08, 6.07409846258, 4292.33083295 ],
    [ 2.698e-08, 2.92100135189, 3496.03282613 ],
    [ 2.396e-08, 5.94193484091, 2787.04302386 ],
    [ 2.263e-08, 2.56188049651, 191.448266112 ],
    [ 2.169e-08, 5.36834559071, 8962.45534991 ],
    [ 2.149e-08, 2.74919289456, 242.728603974 ],
    [ 2.218e-08, 1.85260509629, 3337.08930835 ],
    [ 1.998e-08, 5.76396921426, 3341.59274777 ],
    [ 1.999e-08, 3.82347205028, 2914.01423582 ],
    [ 1.835e-08, 5.68648448195, 1589.07289528 ],
    [ 1.81e-08, 3.32122811143, 5088.62883977 ],
    [ 1.968e-08, 4.17404480033, 3340.59517305 ],
    [ 2.411e-08, 4.68376177281, 4690.47983636 ],
    [ 1.967e-08, 6.2057036343, 3340.62968035 ],
    [ 1.626e-08, 5.67648778513, 4535.05943692 ],
    [ 2.161e-08, 1.07446445419, 2388.89402045 ],
    [ 1.965e-08, 3.10811453974, 3583.34103067 ],
    [ 1.985e-08, 5.75867975763, 4399.99435689 ],
    [ 1.504e-08, 4.95929390466, 382.896532223 ],
    [ 1.276e-08, 4.82147500391, 2957.71589448 ],
    [ 1.475e-08, 2.22614544794, 3723.50895892 ],
    [ 1.196e-08, 3.26743061042, 9492.146315 ],
    [ 1.349e-08, 4.87558985925, 6525.80445397 ],
    [ 1.436e-08, 2.6975402327, 7079.37385681 ],
    [ 1.223e-08, 2.61880227353, 10025.3603984 ],
    [ 1.402e-08, 5.19177439326, 2700.71514039 ],
    [ 1.202e-08, 0.93436294282, 2810.92146161 ],
    [ 8.7e-09, 5.81258009514, 12303.0677766 ],
    [ 8.67e-09, 2.20048756217, 2699.73481932 ],
    [ 8.31e-09, 2.01782919511, 5092.15195812 ],
    [ 8.56e-09, 5.96129932558, 426.598190876 ],
    [ 8.47e-09, 2.26415579047, 6283.07584999 ],
    [ 9.17e-09, 1.4025908126, 6489.77658729 ],
    [ 8.33e-09, 1.17376008822, 7477.52286022 ],
    [ 1.041e-08, 6.27097603149, 3347.7259737 ],
    [ 9.65e-09, 3.40293030184, 5621.84292321 ],
    [ 7.23e-09, 4.26276570887, 4933.20844033 ],
    [ 7.7e-09, 2.06490049164, 5486.77784318 ],
    [ 7.06e-09, 2.34080074294, 7.1135470008 ],
    [ 9.54e-09, 2.11093711712, 3870.30339179 ],
    [ 8.44e-09, 2.2379157639, 3553.91152214 ],
    [ 6.47e-09, 2.24565892529, 3340.5451164 ],
    [ 6.53e-09, 3.98464883505, 6677.70173505 ],
    [ 7.17e-09, 0.29523050971, 6681.24210705 ],
    [ 8.28e-09, 0.22887694811, 3532.06069281 ],
    [ 6.12e-09, 1.56040446304, 7234.79425624 ],
    [ 7.17e-09, 4.54583138124, 6681.20759975 ],
    [ 5.85e-09, 3.29614213819, 1221.84856632 ],
    [ 6.46e-09, 1.8361516834, 3340.679737 ],
    [ 5.6e-09, 5.05995427063, 8031.09226306 ],
    [ 6.51e-09, 0.16211451692, 7632.94325965 ]
    // 86 terms retained
];

KMG.VSOPTerms.mars_R3 = [
    [ 1.113108e-05, 5.14987305093, 3340.6124267 ],
    [ 4.24447e-06, 5.61343952053, 6681.2248534 ],
    [ 1.00044e-06, 5.99727457548, 10021.8372801 ],
    [ 1.9606e-07, 0.07631453783, 13362.4497068 ],
    [ 3.478e-08, 0.42912010211, 16703.0621335 ],
    [ 4.693e-08, 3.14159265359, 0 ],
    [ 2.87e-08, 0.44692002393, 3344.13554505 ],
    [ 2.428e-08, 3.02114808809, 3185.19202727 ]
    // 8 terms retained
];

KMG.VSOPTerms.mars_R4 = [
    [ 1.9551e-07, 3.58210746512, 3340.6124267 ],
    [ 1.6322e-07, 4.05115851142, 6681.2248534 ],
    [ 5.848e-08, 4.4638164658, 10021.8372801 ],
    [ 1.533e-08, 4.84332951095, 13362.4497068 ],
    [ 3.75e-09, 1.50951652931, 3185.19202727 ],
    [ 3.4e-09, 5.20519444932, 16703.0621335 ]
    // 6 terms retained
];

KMG.VSOPTerms.mars_R5 = [
    [ 4.75e-09, 2.47621038205, 6681.2248534 ],
    [ 2.7e-09, 2.90961348988, 10021.8372801 ]
    // 2 terms retained
];













KMG.VSOPTerms.jupiter_L0 = [
    [ 0.59954691494, 0, 0 ],
    [ 0.09695898719, 5.06191793158, 529.690965095 ],
    [ 0.00573610142, 1.44406205629, 7.1135470008 ],
    [ 0.00306389205, 5.41734730184, 1059.38193019 ],
    [ 0.00097178296, 4.14264726552, 632.783739313 ],
    [ 0.00072903078, 3.64042916389, 522.577418094 ],
    [ 0.00064263975, 3.41145165351, 103.092774219 ],
    [ 0.00039806064, 2.29376740788, 419.484643875 ],
    [ 0.00038857767, 1.27231755835, 316.391869657 ],
    [ 0.00027964629, 1.7845459182, 536.804512095 ],
    [ 0.0001358973, 5.7748104079, 1589.07289528 ],
    [ 8.246349e-05, 3.5822792584, 206.185548437 ],
    [ 8.768704e-05, 3.63000308199, 949.17560897 ],
    [ 7.368042e-05, 5.0810119427, 735.876513532 ],
    [ 6.26315e-05, 0.02497628807, 213.299095438 ],
    [ 6.114062e-05, 4.51319998626, 1162.47470441 ],
    [ 4.905396e-05, 1.32084470588, 110.206321219 ],
    [ 5.305285e-05, 1.30671216791, 14.2270940016 ],
    [ 5.305441e-05, 4.18625634012, 1052.26838319 ],
    [ 4.647248e-05, 4.69958103684, 3.9321532631 ],
    [ 3.045023e-05, 4.31676431084, 426.598190876 ],
    [ 2.609999e-05, 1.56667394063, 846.082834751 ],
    [ 2.028191e-05, 1.06376530715, 3.1813937377 ],
    [ 1.764763e-05, 2.14148655117, 1066.49547719 ],
    [ 1.722972e-05, 3.88036268267, 1265.56747863 ],
    [ 1.920945e-05, 0.97168196472, 639.897286314 ],
    [ 1.633223e-05, 3.58201833555, 515.463871093 ],
    [ 1.431999e-05, 4.29685556046, 625.670192312 ],
    [ 9.73272e-06, 4.09764549134, 95.9792272178 ],
    [ 8.84457e-06, 2.43700227469, 412.371096874 ],
    [ 7.32853e-06, 6.08535124451, 838.96928775 ],
    [ 7.31094e-06, 3.80592308125, 1581.95934828 ],
    [ 6.91971e-06, 6.13365277914, 2118.76386038 ],
    [ 7.09166e-06, 1.2927476033, 742.990060533 ],
    [ 6.14482e-06, 4.10850580886, 1478.86657406 ],
    [ 4.95219e-06, 3.75564106217, 323.505416657 ],
    [ 5.81903e-06, 4.53969579398, 309.278322656 ],
    [ 3.75664e-06, 4.70304250208, 1368.66025285 ],
    [ 3.89876e-06, 4.89706786539, 1692.1656695 ],
    [ 3.41016e-06, 5.7145237931, 533.623118358 ],
    [ 3.30458e-06, 4.74049819491, 0.0481841098 ],
    [ 4.40853e-06, 2.95818598959, 454.909366527 ],
    [ 4.17267e-06, 1.03554397138, 2.4476805548 ],
    [ 2.44174e-06, 5.22024286247, 728.762966531 ],
    [ 2.61541e-06, 1.87652515753, 0.9632078465 ],
    [ 2.56589e-06, 3.72410394286, 199.072001436 ],
    [ 2.61005e-06, 0.82048379203, 380.12776796 ],
    [ 2.20381e-06, 1.65114584814, 543.918059096 ],
    [ 2.01991e-06, 1.80692992449, 1375.77379985 ],
    [ 2.07336e-06, 1.85463683689, 525.758811831 ],
    [ 1.97061e-06, 5.29255821015, 1155.36115741 ],
    [ 2.35139e-06, 1.22694468346, 909.818733055 ],
    [ 1.74827e-06, 5.90974976879, 956.289155971 ],
    [ 1.49385e-06, 4.37744775359, 1685.0521225 ],
    [ 1.75197e-06, 3.22647697998, 1898.35121794 ],
    [ 1.75172e-06, 3.7297744122, 942.062061969 ],
    [ 1.57917e-06, 4.36478445901, 1795.25844372 ],
    [ 1.37898e-06, 1.31800455202, 1169.58825141 ],
    [ 1.17498e-06, 2.50021486074, 1596.18644228 ],
    [ 1.50504e-06, 3.90624455135, 74.7815985673 ],
    [ 1.16786e-06, 3.3892092106, 0.5212648618 ],
    [ 1.05894e-06, 4.55439354032, 526.509571357 ],
    [ 1.3054e-06, 4.16876671917, 1045.15483619 ],
    [ 1.41388e-06, 3.13579930728, 491.557929457 ],
    [ 9.9524e-07, 1.4211262227, 532.872358832 ],
    [ 9.6143e-07, 1.18143253105, 117.31986822 ],
    [ 9.1732e-07, 0.85722451006, 1272.68102563 ],
    [ 8.7704e-07, 1.2173050435, 453.424893819 ],
    [ 6.8531e-07, 2.3520190589, 2.9207613068 ],
    [ 6.6111e-07, 5.3438096704, 1471.75302706 ],
    [ 7.7401e-07, 4.42676354183, 39.3568759152 ],
    [ 7.2028e-07, 4.23856425835, 2111.65031338 ],
    [ 6.3345e-07, 4.97658360088, 0.7507595254 ],
    [ 5.9423e-07, 4.11122034593, 2001.44399216 ],
    [ 6.2471e-07, 0.51213142347, 220.412642439 ],
    [ 6.654e-07, 2.98844410276, 2214.7430876 ],
    [ 6.0295e-07, 4.1263361942, 4.192785694 ],
    [ 5.6014e-07, 1.15477785231, 21.3406410024 ],
    [ 5.2954e-07, 0.91283039851, 10.2949407385 ],
    [ 7.0461e-07, 5.14178006023, 835.037134487 ],
    [ 5.1903e-07, 4.10065404719, 1258.45393163 ],
    [ 4.6583e-07, 4.66599487054, 5.6290742925 ],
    [ 5.8261e-07, 5.86719898935, 5753.3848849 ],
    [ 4.0103e-07, 4.68801114087, 0.1600586944 ],
    [ 4.6785e-07, 4.79414027278, 305.346169393 ],
    [ 3.9306e-07, 4.2549933801, 853.196381752 ],
    [ 4.6153e-07, 5.10982849847, 4.665866446 ],
    [ 5.4583e-07, 1.5707166354, 983.115858914 ],
    [ 3.8921e-07, 6.07598407822, 518.645264831 ],
    [ 3.846e-07, 2.43832240008, 433.711737877 ],
    [ 4.691e-07, 3.54638837922, 5.4166259714 ],
    [ 4.1834e-07, 4.67980756775, 302.164775655 ],
    [ 3.5921e-07, 2.45088327353, 430.530344139 ],
    [ 3.9307e-07, 1.71678059616, 11.0457002639 ],
    [ 3.7895e-07, 0.21140086073, 2648.45482547 ],
    [ 3.7566e-07, 6.19479786035, 831.85574075 ],
    [ 3.5845e-07, 4.61505536309, 2008.55753916 ],
    [ 4.3402e-07, 0.14992219581, 528.206492386 ],
    [ 3.1581e-07, 5.14178165108, 1788.14489672 ],
    [ 2.986e-07, 5.34424466576, 2221.8566346 ],
    [ 3.2959e-07, 5.2895264038, 88.865680217 ],
    [ 2.7686e-07, 1.85227036207, 0.2124483211 ],
    [ 2.5821e-07, 3.85920335036, 2317.83586181 ],
    [ 2.4705e-07, 2.63498818, 114.138474483 ],
    [ 3.3844e-07, 1.00563073311, 9683.59458112 ]
    // 105 terms retained
];

KMG.VSOPTerms.jupiter_L1 = [
    [ 529.690965088, 0, 0 ],
    [ 0.00489503243, 4.2208293947, 529.690965095 ],
    [ 0.00228917222, 6.02646855621, 7.1135470008 ],
    [ 0.00030099479, 4.54540782858, 1059.38193019 ],
    [ 0.0002072092, 5.45943156902, 522.577418094 ],
    [ 0.00012103653, 0.16994816098, 536.804512095 ],
    [ 6.067987e-05, 4.42422292017, 103.092774219 ],
    [ 5.433968e-05, 3.98480737746, 419.484643875 ],
    [ 4.237744e-05, 5.89008707199, 14.2270940016 ],
    [ 2.211974e-05, 5.26766687382, 206.185548437 ],
    [ 1.983502e-05, 4.88600705699, 1589.07289528 ],
    [ 1.295769e-05, 5.55132752171, 3.1813937377 ],
    [ 1.163416e-05, 0.51450634873, 3.9321532631 ],
    [ 1.007167e-05, 0.46474690033, 735.876513532 ],
    [ 1.174094e-05, 5.84238857133, 1052.26838319 ],
    [ 8.47762e-06, 5.75765726863, 110.206321219 ],
    [ 8.2725e-06, 4.80311857692, 213.299095438 ],
    [ 8.29822e-06, 0.59345481695, 1066.49547719 ],
    [ 1.003864e-05, 3.14841622246, 426.598190876 ],
    [ 1.09873e-05, 5.30705242117, 515.463871093 ],
    [ 7.24923e-06, 5.51690038433, 639.897286314 ],
    [ 5.67826e-06, 5.98865760444, 625.670192312 ],
    [ 4.74197e-06, 4.1324371636, 412.371096874 ],
    [ 4.12936e-06, 5.73653788228, 95.9792272178 ],
    [ 3.3682e-06, 3.72892266066, 1162.47470441 ],
    [ 3.45412e-06, 4.24128387922, 632.783739313 ],
    [ 2.34071e-06, 6.24295755869, 309.278322656 ],
    [ 1.94827e-06, 2.21824346028, 323.505416657 ],
    [ 2.34805e-06, 4.03315571261, 949.17560897 ],
    [ 1.83904e-06, 6.2797391951, 543.918059096 ],
    [ 1.98512e-06, 1.50446971008, 838.96928775 ],
    [ 1.86807e-06, 6.07956275814, 742.990060533 ],
    [ 1.71405e-06, 5.41658811525, 199.072001436 ],
    [ 1.30777e-06, 0.62641588161, 728.762966531 ],
    [ 1.34095e-06, 5.23702273624, 2118.76386038 ],
    [ 1.15444e-06, 0.6778374723, 846.082834751 ],
    [ 1.06501e-06, 4.4767172424, 956.289155971 ],
    [ 6.6832e-07, 5.73362353275, 21.3406410024 ],
    [ 6.9619e-07, 5.9725637809, 532.872358832 ],
    [ 5.995e-07, 1.0065747379, 1596.18644228 ],
    [ 6.3366e-07, 6.05635396519, 1581.95934828 ],
    [ 7.9718e-07, 5.821567337, 1045.15483619 ],
    [ 6.5635e-07, 0.12938321631, 526.509571357 ],
    [ 5.8519e-07, 0.58687309667, 1155.36115741 ],
    [ 5.661e-07, 1.41183572003, 533.623118358 ],
    [ 7.1631e-07, 5.34149334443, 942.062061969 ],
    [ 5.7343e-07, 5.9687033662, 1169.58825141 ],
    [ 5.5048e-07, 5.42871116938, 10.2949407385 ],
    [ 5.2026e-07, 0.22999191591, 1368.66025285 ],
    [ 5.2295e-07, 5.72636754267, 117.31986822 ],
    [ 5.0427e-07, 6.08258832558, 525.758811831 ],
    [ 4.7278e-07, 3.60428393787, 1478.86657406 ],
    [ 4.2199e-07, 4.13113112919, 1692.1656695 ],
    [ 4.6566e-07, 0.51168261375, 1265.56747863 ],
    [ 3.2801e-07, 5.03520269183, 220.412642439 ],
    [ 3.3556e-07, 0.09960615979, 302.164775655 ],
    [ 2.9379e-07, 3.35927110207, 4.665866446 ],
    [ 2.9311e-07, 0.75894050642, 88.865680217 ],
    [ 3.2449e-07, 5.37487176787, 508.350324092 ],
    [ 2.9741e-07, 5.42345191096, 1272.68102563 ],
    [ 2.1789e-07, 6.14949766217, 1685.0521225 ],
    [ 2.5194e-07, 1.60716361937, 831.85574075 ],
    [ 2.1133e-07, 5.86310776376, 1258.45393163 ],
    [ 1.9668e-07, 2.18904500387, 316.391869657 ],
    [ 1.7878e-07, 0.82813691085, 433.711737877 ],
    [ 1.7409e-07, 2.75647882058, 853.196381752 ],
    [ 1.7703e-07, 5.95527033658, 5.4166259714 ],
    [ 1.8586e-07, 0.51459954175, 1375.77379985 ],
    [ 1.7469e-07, 0.7085516406, 1471.75302706 ],
    [ 1.4369e-07, 0.91459684737, 18.1592472647 ],
    [ 1.4107e-07, 0.63031131929, 2.9207613068 ],
    [ 1.1728e-07, 1.76421689491, 380.12776796 ],
    [ 1.1042e-07, 5.56386292919, 1574.84580128 ],
    [ 1.1422e-07, 4.30273286555, 405.257549874 ],
    [ 1.0407e-07, 0.30595619562, 1361.54670584 ],
    [ 9.894e-08, 0.38972478935, 1073.60902419 ],
    [ 9.808e-08, 5.90342059427, 519.396024356 ],
    [ 9.287e-08, 3.23717178839, 1795.25844372 ],
    [ 9.079e-08, 5.59391515894, 2648.45482547 ],
    [ 8.83e-08, 0.53669085248, 1788.14489672 ],
    [ 8.238e-08, 5.88621877345, 2001.44399216 ],
    [ 8.058e-08, 5.07394631539, 1485.98012107 ],
    [ 6.69e-08, 2.41093500491, 4.192785694 ],
    [ 5.917e-08, 4.17942020818, 2008.55753916 ],
    [ 7.256e-08, 6.19390446816, 11.0457002639 ],
    [ 6.272e-08, 1.36131578474, 1148.24761041 ],
    [ 5.142e-08, 5.23124680535, 628.85158605 ],
    [ 5.141e-08, 2.92956226336, 518.645264831 ],
    [ 4.764e-08, 0.16833299921, 629.602345575 ],
    [ 4.603e-08, 0.78535347104, 721.64941953 ],
    [ 4.573e-08, 6.24771751154, 1677.9385755 ],
    [ 4.536e-08, 4.9510938869, 635.965133051 ],
    [ 4.434e-08, 1.45220762308, 2125.87740738 ],
    [ 4.518e-08, 2.06522259381, 453.424893819 ],
    [ 4.428e-08, 0.15677546362, 1699.2792165 ],
    [ 5.594e-08, 5.5747124137, 191.958454436 ],
    [ 5.405e-08, 1.46221153779, 330.618963658 ],
    [ 5.776e-08, 4.37575545399, 2221.8566346 ],
    [ 4.265e-08, 0.24198200812, 2104.53676638 ],
    [ 4.1e-08, 6.19338226411, 636.715892576 ],
    [ 4.432e-08, 4.35787390405, 423.416797138 ],
    [ 4.102e-08, 0.4919546148, 1056.20053645 ],
    [ 4.527e-08, 0.09244775677, 1062.56332393 ],
    [ 4.397e-08, 4.14273244974, 511.53171783 ],
    [ 3.567e-08, 5.66550104255, 2317.83586181 ],
    [ 3.585e-08, 0.28040162482, 1055.44977693 ],
    [ 4.009e-08, 2.54842404074, 74.7815985673 ],
    [ 3.686e-08, 2.9336784999, 32.2433289144 ],
    [ 2.969e-08, 5.50022776972, 107.024927482 ],
    [ 2.856e-08, 5.73809418496, 99.9113804809 ],
    [ 2.718e-08, 1.25246874516, 540.736665358 ],
    [ 2.808e-08, 3.30714906571, 0.7507595254 ],
    [ 2.669e-08, 1.6339853139, 1063.31408345 ],
    [ 2.667e-08, 4.28683044077, 106.274167956 ],
    [ 2.705e-08, 3.03568370231, 422.666037613 ],
    [ 3.271e-08, 5.89438924876, 1802.37199072 ],
    [ 2.654e-08, 0.35475530647, 1898.35121794 ],
    [ 2.574e-08, 3.59809745049, 750.103607533 ],
    [ 2.486e-08, 5.28928577587, 1891.23767094 ],
    [ 3.221e-08, 4.58424996327, 416.303250138 ],
    [ 2.936e-08, 1.09054035208, 1464.63948006 ],
    [ 2.398e-08, 6.02106328658, 551.031606097 ]
    // 122 terms retained
];

KMG.VSOPTerms.jupiter_L2 = [
    [ 0.00047233601, 4.32148536482, 7.1135470008 ],
    [ 0.00030649436, 2.929777887, 529.690965095 ],
    [ 0.00014837605, 3.14159265359, 0 ],
    [ 3.189359e-05, 1.05515491122, 522.577418094 ],
    [ 2.728901e-05, 4.84555421873, 536.804512095 ],
    [ 2.54744e-05, 3.42720888976, 1059.38193019 ],
    [ 1.721046e-05, 4.18734600902, 14.2270940016 ],
    [ 3.83277e-06, 5.76794364868, 419.484643875 ],
    [ 3.67514e-06, 6.05520169517, 103.092774219 ],
    [ 3.77503e-06, 0.7605083906, 515.463871093 ],
    [ 3.37386e-06, 3.78644856157, 3.1813937377 ],
    [ 3.08194e-06, 0.6936828379, 206.185548437 ],
    [ 2.14121e-06, 3.8295818143, 1589.07289528 ],
    [ 2.03945e-06, 5.34259263233, 1066.49547719 ],
    [ 1.97456e-06, 2.4835107179, 3.9321532631 ],
    [ 1.46156e-06, 3.81335105293, 639.897286314 ],
    [ 1.56209e-06, 1.36162315686, 1052.26838319 ],
    [ 1.29577e-06, 5.83745710707, 412.371096874 ],
    [ 1.41825e-06, 1.63491733107, 426.598190876 ],
    [ 1.17324e-06, 1.41441723025, 625.670192312 ],
    [ 9.6673e-07, 4.03472268105, 110.206321219 ],
    [ 9.0824e-07, 1.10616181082, 95.9792272178 ],
    [ 7.8757e-07, 4.63773672633, 543.918059096 ],
    [ 7.2393e-07, 2.21660922294, 735.876513532 ],
    [ 8.732e-07, 2.52152838765, 632.783739313 ],
    [ 5.6885e-07, 3.12193937495, 213.299095438 ],
    [ 4.8615e-07, 1.67250930065, 309.278322656 ],
    [ 5.8472e-07, 0.83261136328, 199.072001436 ],
    [ 4.0161e-07, 4.02477739294, 21.3406410024 ],
    [ 3.9773e-07, 0.62346681537, 323.505416657 ],
    [ 3.5738e-07, 2.32587552001, 728.762966531 ],
    [ 2.561e-07, 2.52090555309, 1162.47470441 ],
    [ 2.9257e-07, 3.60827234952, 10.2949407385 ],
    [ 2.3621e-07, 3.00418693282, 956.289155971 ],
    [ 2.779e-07, 3.24029772587, 838.96928775 ],
    [ 2.5988e-07, 4.50541789846, 742.990060533 ],
    [ 2.5259e-07, 1.21368179972, 1045.15483619 ],
    [ 1.9456e-07, 4.29184444888, 532.872358832 ],
    [ 1.616e-07, 5.81618778562, 1596.18644228 ],
    [ 1.7655e-07, 0.8091545878, 508.350324092 ],
    [ 1.7714e-07, 4.21087482222, 2118.76386038 ],
    [ 1.695e-07, 1.83162996779, 526.509571357 ],
    [ 1.4656e-07, 3.99869563261, 117.31986822 ],
    [ 1.3717e-07, 1.80293013315, 302.164775655 ],
    [ 1.3232e-07, 2.51839383442, 88.865680217 ],
    [ 1.2771e-07, 4.3696527712, 1169.58825141 ],
    [ 1.5311e-07, 0.68283508612, 942.062061969 ],
    [ 1.0924e-07, 4.44465911708, 525.758811831 ],
    [ 1.3902e-07, 5.9586109821, 316.391869657 ],
    [ 9.462e-08, 2.17903550202, 1155.36115741 ],
    [ 8.792e-08, 3.29010679292, 220.412642439 ],
    [ 7.851e-08, 5.76115179798, 846.082834751 ],
    [ 7.64e-08, 2.7204502155, 533.623118358 ],
    [ 9.055e-08, 1.63552089571, 1581.95934828 ],
    [ 8.687e-08, 3.31770180816, 831.85574075 ],
    [ 6.355e-08, 0.49733352086, 949.17560897 ],
    [ 6.615e-08, 2.18391508427, 1265.56747863 ],
    [ 5.38e-08, 6.00496610446, 405.257549874 ],
    [ 4.562e-08, 1.38462817429, 1258.45393163 ],
    [ 4.367e-08, 5.07489817646, 1073.60902419 ],
    [ 4.28e-08, 3.04118697325, 1692.1656695 ],
    [ 4.371e-08, 5.474919646, 433.711737877 ],
    [ 4.201e-08, 5.28578420235, 18.1592472647 ],
    [ 3.95e-08, 1.25151054185, 853.196381752 ],
    [ 5.302e-08, 3.65714557917, 1272.68102563 ],
    [ 4.368e-08, 2.27494144993, 1368.66025285 ],
    [ 3.462e-08, 1.50340907962, 519.396024356 ],
    [ 2.757e-08, 2.16577371531, 1478.86657406 ],
    [ 2.704e-08, 1.04777971186, 1574.84580128 ],
    [ 2.891e-08, 2.04866759038, 1361.54670584 ],
    [ 3.075e-08, 0.9910538683, 191.958454436 ],
    [ 2.437e-08, 2.36815291342, 1471.75302706 ],
    [ 2.201e-08, 2.47797001828, 721.64941953 ],
    [ 2.093e-08, 3.72335003599, 1485.98012107 ],
    [ 2.273e-08, 3.03212449012, 1148.24761041 ],
    [ 1.947e-08, 1.8876418002, 1685.0521225 ],
    [ 2.057e-08, 6.18001258073, 330.618963658 ],
    [ 1.451e-08, 4.72055072637, 32.2433289144 ],
    [ 1.449e-08, 3.1879914905, 635.965133051 ],
    [ 1.377e-08, 5.12507193192, 1375.77379985 ],
    [ 1.421e-08, 1.9924918846, 629.602345575 ],
    [ 1.401e-08, 4.26834108454, 551.031606097 ],
    [ 1.265e-08, 0.00691519565, 2125.87740738 ],
    [ 1.272e-08, 2.25106018556, 1788.14489672 ],
    [ 1.238e-08, 1.75660677516, 1677.9385755 ],
    [ 1.206e-08, 2.18559244687, 1795.25844372 ],
    [ 1.493e-08, 4.02813570061, 539.985905833 ],
    [ 1.314e-08, 4.76481710487, 1062.56332393 ],
    [ 1.11e-08, 2.97713206981, 81.7521332162 ],
    [ 1.027e-08, 1.99159218429, 295.051228654 ],
    [ 1.368e-08, 4.63088532557, 2648.45482547 ],
    [ 1.025e-08, 3.75336759986, 28.4541880032 ],
    [ 9.78e-09, 3.01394148632, 124.433415221 ],
    [ 1.227e-08, 1.22879053363, 1038.04128919 ],
    [ 9.65e-09, 1.17674106025, 99.9113804809 ],
    [ 1.015e-08, 1.8592221639, 750.103607533 ],
    [ 9.24e-09, 3.53294521831, 227.52618944 ],
    [ 9.88e-09, 5.05622576252, 1699.2792165 ],
    [ 1.059e-08, 0.13477400877, 416.303250138 ],
    [ 8.19e-09, 2.0194816163, 1056.20053645 ],
    [ 8.88e-09, 1.75920995401, 1898.35121794 ],
    [ 1.013e-08, 2.80784883642, 1464.63948006 ],
    [ 7.91e-09, 4.92419444433, 1055.44977693 ],
    [ 7.74e-09, 1.91132974373, 2111.65031338 ],
    [ 7.29e-09, 3.2901665697, 628.85158605 ],
    [ 7.43e-09, 2.65216075794, 106.274167956 ],
    [ 7.19e-09, 2.95858266157, 2008.55753916 ],
    [ 6.93e-09, 0.10835603179, 963.402702971 ],
    [ 8.28e-09, 2.72900314719, 618.556645312 ],
    [ 7.77e-09, 1.63387777696, 2001.44399216 ],
    [ 6.51e-09, 1.1926797813, 422.666037613 ],
    [ 6.81e-09, 5.47481858348, 5760.4984319 ],
    [ 6.81e-09, 3.11621018972, 5746.2713379 ],
    [ 6.44e-09, 4.68534695662, 611.443098311 ],
    [ 6.65e-09, 1.86713865983, 2104.53676638 ],
    [ 6.29e-09, 3.05748834184, 380.12776796 ],
    [ 6.37e-09, 1.8573150656, 636.715892576 ],
    [ 7.15e-09, 3.04974505007, 2221.8566346 ],
    [ 6.35e-09, 4.53916560604, 9676.48103412 ],
    [ 6.35e-09, 0.61458920732, 9690.70812812 ],
    [ 8.21e-09, 6.24663887828, 423.416797138 ],
    [ 7.64e-09, 4.32616763486, 1802.37199072 ],
    [ 5.81e-09, 0.83633087877, 1891.23767094 ],
    [ 6.38e-09, 2.83653046158, 1905.46476494 ],
    [ 5.58e-09, 3.96114629751, 440.825284878 ],
    [ 6.23e-09, 1.2271148801, 1382.88734685 ],
    [ 7.11e-09, 3.43507379865, 824.742193749 ],
    [ 5.16e-09, 1.10671630111, 107.024927482 ],
    [ 5.35e-09, 1.5591428253, 1994.33044516 ],
    [ 5.48e-09, 4.39997113815, 647.010833315 ]
    // 130 terms retained
];

KMG.VSOPTerms.jupiter_L3 = [
    [ 6.501673e-05, 2.5986292365, 7.1135470008 ],
    [ 1.355012e-05, 1.34692775915, 529.690965095 ],
    [ 4.70691e-06, 2.47502798748, 14.2270940016 ],
    [ 4.16933e-06, 3.24456258569, 536.804512095 ],
    [ 3.5287e-06, 2.97380410245, 522.577418094 ],
    [ 1.65699e-06, 2.09182221854, 1059.38193019 ],
    [ 8.6769e-07, 2.51454300081, 515.463871093 ],
    [ 3.4458e-07, 3.82181443085, 1066.49547719 ],
    [ 2.2671e-07, 2.98178645046, 543.918059096 ],
    [ 2.376e-07, 1.27416115958, 412.371096874 ],
    [ 2.8501e-07, 2.44538595164, 206.185548437 ],
    [ 1.9722e-07, 2.10936654685, 639.897286314 ],
    [ 1.7778e-07, 2.59019838502, 1589.07289528 ],
    [ 1.9709e-07, 1.40149363982, 419.484643875 ],
    [ 1.8767e-07, 1.58683219668, 103.092774219 ],
    [ 1.7015e-07, 2.29975384867, 21.3406410024 ],
    [ 1.6179e-07, 3.1543828742, 625.670192312 ],
    [ 1.5902e-07, 3.25713655347, 1052.26838319 ],
    [ 1.3421e-07, 2.76078519881, 95.9792272178 ],
    [ 1.3233e-07, 2.53761666317, 199.072001436 ],
    [ 1.2676e-07, 6.26512955217, 426.598190876 ],
    [ 8.633e-08, 2.26532712763, 110.206321219 ],
    [ 6.718e-08, 3.42006598208, 309.278322656 ],
    [ 8.703e-08, 1.76298942412, 10.2949407385 ],
    [ 6.529e-08, 4.03744539112, 728.762966531 ],
    [ 5.397e-08, 5.2643257077, 323.505416657 ],
    [ 5.685e-08, 2.51772778746, 508.350324092 ],
    [ 7.504e-08, 0, 0 ],
    [ 5.431e-08, 2.90223114269, 1045.15483619 ],
    [ 3.997e-08, 4.30231913648, 88.865680217 ],
    [ 3.855e-08, 3.52241347275, 302.164775655 ],
    [ 3.811e-08, 4.08897954122, 735.876513532 ],
    [ 3.232e-08, 1.4797215105, 956.289155971 ],
    [ 2.931e-08, 4.35694383564, 1596.18644228 ],
    [ 2.657e-08, 1.27257961451, 213.299095438 ],
    [ 2.556e-08, 2.23303484585, 117.31986822 ],
    [ 2.414e-08, 2.9182867642, 742.990060533 ],
    [ 2.657e-08, 5.0155101339, 838.96928775 ],
    [ 1.935e-08, 2.79590256973, 1169.58825141 ],
    [ 2.222e-08, 2.39310688825, 942.062061969 ],
    [ 1.605e-08, 3.09964511466, 2118.76386038 ],
    [ 1.491e-08, 1.55001725357, 220.412642439 ],
    [ 1.934e-08, 5.0082360231, 831.85574075 ],
    [ 1.584e-08, 1.40103448632, 405.257549874 ],
    [ 1.286e-08, 3.46966168288, 1073.60902419 ],
    [ 1.21e-08, 4.05719633951, 1155.36115741 ],
    [ 9.95e-09, 3.40755481322, 532.872358832 ],
    [ 8.95e-09, 1.6408692176, 632.783739313 ],
    [ 9.42e-09, 2.70150730852, 191.958454436 ],
    [ 8.17e-09, 3.29435640763, 1258.45393163 ],
    [ 7.21e-09, 1.62926029676, 949.17560897 ],
    [ 7.45e-09, 1.14787945018, 1162.47470441 ],
    [ 7.19e-09, 3.7399276487, 433.711737877 ],
    [ 6.58e-09, 2.90980216736, 1574.84580128 ],
    [ 6.11e-09, 5.95148659718, 853.196381752 ],
    [ 6.65e-09, 3.54820168197, 525.758811831 ],
    [ 6.09e-09, 4.14925115671, 721.64941953 ],
    [ 5.98e-09, 4.69470159905, 81.7521332162 ],
    [ 6.69e-09, 1.94668551888, 1272.68102563 ],
    [ 6.43e-09, 2.02118053595, 526.509571357 ],
    [ 5.08e-09, 4.3523913142, 1368.66025285 ],
    [ 5.09e-09, 4.95261621008, 1148.24761041 ],
    [ 5.64e-09, 3.418796288, 1581.95934828 ],
    [ 5.12e-09, 4.39016117028, 330.618963658 ],
    [ 5.48e-09, 2.25796919785, 551.031606097 ],
    [ 4.78e-09, 3.8601569376, 1361.54670584 ],
    [ 3.83e-09, 0.24286568335, 611.443098311 ],
    [ 4.34e-09, 2.94972316227, 1038.04128919 ],
    [ 3.76e-09, 1.42987791517, 124.433415221 ],
    [ 3.9e-09, 4.06059870551, 1471.75302706 ],
    [ 3.85e-09, 4.70313900114, 519.396024356 ],
    [ 4.28e-09, 2.22447290956, 539.985905833 ],
    [ 3.94e-09, 4.52891996323, 1464.63948006 ],
    [ 3.06e-09, 2.0201596447, 1485.98012107 ]
    // 74 terms retained
];

KMG.VSOPTerms.jupiter_L4 = [
    [ 6.69505e-06, 0.85280378158, 7.1135470008 ],
    [ 9.9965e-07, 0.74243651986, 14.2270940016 ],
    [ 5.003e-07, 1.65383477095, 536.804512095 ],
    [ 4.369e-07, 5.81923759985, 529.690965095 ],
    [ 3.1794e-07, 4.85865051639, 522.577418094 ],
    [ 1.4735e-07, 4.29065528652, 515.463871093 ],
    [ 8.408e-08, 0.68386181768, 1059.38193019 ],
    [ 4.926e-08, 1.29899425511, 543.918059096 ],
    [ 4.563e-08, 2.31453670801, 1066.49547719 ],
    [ 4.254e-08, 0.48193363691, 21.3406410024 ],
    [ 3.1e-08, 3.00251285081, 412.371096874 ],
    [ 2.053e-08, 0.39854167561, 639.897286314 ],
    [ 1.764e-08, 4.90551864257, 625.670192312 ],
    [ 1.901e-08, 4.2566097793, 199.072001436 ],
    [ 1.69e-08, 4.25228443627, 206.185548437 ],
    [ 1.345e-08, 5.06309624095, 1052.26838319 ],
    [ 1.211e-08, 4.7143259874, 95.9792272178 ],
    [ 1.091e-08, 1.32037613765, 1589.07289528 ],
    [ 9.71e-09, 5.67505418481, 728.762966531 ],
    [ 9.35e-09, 6.05626917469, 88.865680217 ],
    [ 9.41e-09, 4.66216576341, 1045.15483619 ],
    [ 9.07e-09, 4.56755235537, 426.598190876 ],
    [ 7.83e-09, 3.39826306476, 419.484643875 ],
    [ 7.63e-09, 3.509082399, 103.092774219 ],
    [ 7.37e-09, 0.53486231851, 110.206321219 ]
    // 25 terms retained
];

KMG.VSOPTerms.jupiter_L5 = [
    [ 4.9639e-07, 5.2576992477, 7.1135470008 ],
    [ 1.5775e-07, 5.24859620238, 14.2270940016 ],
    [ 4.326e-08, 0.02660738929, 536.804512095 ],
    [ 1.573e-08, 1.18411087933, 522.577418094 ],
    [ 8.19e-09, 5.86582284529, 543.918059096 ],
    [ 7.24e-09, 0.88277941285, 515.463871093 ],
    [ 3.6e-09, 0.78335749573, 1066.49547719 ],
    [ 3.19e-09, 5.73095137303, 1059.38193019 ],
    [ 1.98e-09, 0.04372566049, 1589.07289528 ]
    // 9 terms retained
];

KMG.VSOPTerms.jupiter_B0 = [
    [ 0.02268615702, 3.55852606721, 529.690965095 ],
    [ 0.00109971634, 3.90809347197, 1059.38193019 ],
    [ 0.00110090358, 0, 0 ],
    [ 8.101428e-05, 3.60509572885, 522.577418094 ],
    [ 6.043996e-05, 4.25883108339, 1589.07289528 ],
    [ 6.437782e-05, 0.30627119215, 536.804512095 ],
    [ 1.10688e-05, 2.9853440952, 1162.47470441 ],
    [ 9.41651e-06, 2.93619073963, 1052.26838319 ],
    [ 8.94088e-06, 1.75447402715, 7.1135470008 ],
    [ 7.6728e-06, 2.15473604461, 632.783739313 ],
    [ 9.44328e-06, 1.67522315024, 426.598190876 ],
    [ 6.84219e-06, 3.67808774854, 213.299095438 ],
    [ 6.29223e-06, 0.6434329002, 1066.49547719 ],
    [ 8.35861e-06, 5.1788197781, 103.092774219 ],
    [ 5.31671e-06, 2.70305944444, 110.206321219 ],
    [ 5.58524e-06, 0.01354838161, 846.082834751 ],
    [ 4.64449e-06, 1.17337267936, 949.17560897 ],
    [ 4.31072e-06, 2.6082502278, 419.484643875 ],
    [ 3.51433e-06, 4.61062966359, 2118.76386038 ],
    [ 1.23148e-06, 3.34968047337, 1692.1656695 ],
    [ 1.15038e-06, 5.04892367391, 316.391869657 ],
    [ 1.32159e-06, 4.7781694038, 742.990060533 ],
    [ 1.03402e-06, 2.31878940535, 1478.86657406 ],
    [ 1.16379e-06, 1.38688268881, 323.505416657 ],
    [ 1.0242e-06, 3.15294025567, 1581.95934828 ],
    [ 1.03762e-06, 3.70104530617, 515.463871093 ],
    [ 7.865e-07, 3.98318863271, 1265.56747863 ],
    [ 6.9935e-07, 2.56006243114, 956.289155971 ],
    [ 5.5597e-07, 0.37501076637, 1375.77379985 ],
    [ 5.1986e-07, 0.99006936413, 1596.18644228 ],
    [ 5.5194e-07, 0.4017664106, 525.758811831 ],
    [ 6.3456e-07, 4.50073545366, 735.876513532 ],
    [ 4.9691e-07, 0.18650769854, 543.918059096 ],
    [ 4.8831e-07, 3.57260516733, 533.623118358 ]
    // 34 terms retained
];

KMG.VSOPTerms.jupiter_B1 = [
    [ 0.00078203446, 1.52377859742, 529.690965095 ],
    [ 7.789905e-05, 2.59734071843, 1059.38193019 ],
    [ 2.788602e-05, 4.85622679819, 536.804512095 ],
    [ 2.429728e-05, 5.45947255041, 522.577418094 ],
    [ 1.985777e-05, 0, 0 ],
    [ 7.11633e-06, 3.13688338277, 1589.07289528 ],
    [ 2.92916e-06, 5.27960297214, 1066.49547719 ],
    [ 2.57804e-06, 4.76667796123, 1052.26838319 ],
    [ 2.71233e-06, 0.10154920958, 7.1135470008 ],
    [ 8.6261e-07, 1.08347893125, 103.092774219 ],
    [ 7.9683e-07, 1.04738628033, 110.206321219 ],
    [ 8.1369e-07, 0.63901209639, 419.484643875 ],
    [ 8.1666e-07, 0.49217368092, 426.598190876 ],
    [ 7.0613e-07, 2.82219329635, 632.783739313 ],
    [ 6.6992e-07, 5.48215719084, 515.463871093 ],
    [ 5.8497e-07, 3.56648086507, 2118.76386038 ],
    [ 5.1976e-07, 2.85910965609, 949.17560897 ],
    [ 4.1188e-07, 4.75217333048, 543.918059096 ],
    [ 3.9924e-07, 3.9243378711, 735.876513532 ],
    [ 4.0237e-07, 1.1356429014, 1162.47470441 ],
    [ 2.6065e-07, 5.69856804584, 1596.18644228 ],
    [ 3.1305e-07, 6.03167547323, 323.505416657 ],
    [ 3.0485e-07, 5.98342688371, 316.391869657 ],
    [ 2.1243e-07, 4.88358142951, 213.299095438 ],
    [ 1.7336e-07, 1.63355193402, 956.289155971 ],
    [ 1.6318e-07, 1.68217979523, 206.185548437 ],
    [ 2.1612e-07, 4.90561988011, 1581.95934828 ],
    [ 1.505e-07, 4.621848587, 525.758811831 ],
    [ 1.5354e-07, 4.38535188227, 532.872358832 ],
    [ 1.4194e-07, 5.89751177643, 526.509571357 ],
    [ 1.2259e-07, 5.76584367807, 533.623118358 ],
    [ 1.3752e-07, 4.43118193299, 1045.15483619 ],
    [ 1.0998e-07, 3.66464772481, 742.990060533 ],
    [ 1.0324e-07, 4.35223675725, 1169.58825141 ],
    [ 1.202e-07, 6.22841485051, 14.2270940016 ],
    [ 8.201e-08, 5.61044388483, 1265.56747863 ],
    [ 9.125e-08, 2.07963809004, 1692.1656695 ],
    [ 6.995e-08, 3.68757029433, 625.670192312 ],
    [ 6.623e-08, 2.95794554141, 942.062061969 ],
    [ 6.854e-08, 4.8689970084, 1155.36115741 ],
    [ 5.392e-08, 0.92120894811, 117.31986822 ],
    [ 4.948e-08, 5.58428784853, 433.711737877 ],
    [ 5.907e-08, 4.00891325053, 639.897286314 ],
    [ 4.904e-08, 0.79623393478, 95.9792272178 ],
    [ 4.849e-08, 0.77150458453, 853.196381752 ],
    [ 4.554e-08, 3.96028178465, 2648.45482547 ]
    // 46 terms retained
];

KMG.VSOPTerms.jupiter_B2 = [
    [ 5.49832e-05, 3.01596270062, 529.690965095 ],
    [ 6.02076e-06, 3.13358939436, 536.804512095 ],
    [ 5.02174e-06, 2.05202111599, 1059.38193019 ],
    [ 4.53862e-06, 0.95912416388, 522.577418094 ],
    [ 1.15043e-06, 0, 0 ],
    [ 6.8911e-07, 3.65515676096, 1066.49547719 ],
    [ 6.7052e-07, 2.23363751256, 1589.07289528 ],
    [ 4.2555e-07, 0.52143365809, 1052.26838319 ],
    [ 3.9396e-07, 4.65314230657, 7.1135470008 ],
    [ 2.3438e-07, 0.96725852073, 515.463871093 ],
    [ 1.7383e-07, 3.0311625189, 543.918059096 ],
    [ 6.651e-08, 4.14899100562, 1596.18644228 ],
    [ 7.013e-08, 2.58268666095, 2118.76386038 ],
    [ 5.389e-08, 5.43989474079, 110.206321219 ],
    [ 4.578e-08, 6.21390672967, 1045.15483619 ],
    [ 4.226e-08, 2.60174767485, 532.872358832 ],
    [ 3.653e-08, 5.49147329377, 426.598190876 ],
    [ 4.208e-08, 4.53565061928, 14.2270940016 ],
    [ 3.62e-08, 2.16725398015, 1162.47470441 ],
    [ 4.347e-08, 4.3461097602, 323.505416657 ],
    [ 3.449e-08, 1.44287034922, 526.509571357 ],
    [ 3.25e-08, 4.99793920041, 632.783739313 ],
    [ 3.549e-08, 5.47945408971, 103.092774219 ],
    [ 3.031e-08, 0.65632340107, 1581.95934828 ],
    [ 3.252e-08, 5.38360789595, 949.17560897 ],
    [ 2.464e-08, 0.29383438152, 956.289155971 ],
    [ 2.59e-08, 2.61624183669, 525.758811831 ],
    [ 2.414e-08, 6.08828067002, 419.484643875 ],
    [ 2.206e-08, 2.62381175358, 1169.58825141 ],
    [ 1.991e-08, 1.5660645161, 533.623118358 ],
    [ 1.868e-08, 2.0356422949, 316.391869657 ],
    [ 2.225e-08, 6.11348450922, 735.876513532 ],
    [ 1.512e-08, 4.74989508185, 942.062061969 ],
    [ 1.458e-08, 3.53705002363, 1073.60902419 ],
    [ 1.473e-08, 3.61629070367, 206.185548437 ],
    [ 1.467e-08, 5.52885404945, 117.31986822 ],
    [ 1.373e-08, 0.3687588483, 1155.36115741 ],
    [ 1.237e-08, 2.65571662403, 95.9792272178 ],
    [ 1.124e-08, 3.90568585311, 433.711737877 ],
    [ 1.348e-08, 5.54306182308, 625.670192312 ],
    [ 9.64e-09, 5.49710119494, 853.196381752 ],
    [ 9.47e-09, 2.34829918409, 639.897286314 ],
    [ 7.98e-09, 3.3790937024, 220.412642439 ]
    // 43 terms retained
];

KMG.VSOPTerms.jupiter_B3 = [
    [ 1.85332e-06, 4.7927676149, 529.690965095 ],
    [ 8.5668e-07, 1.40023038638, 536.804512095 ],
    [ 5.6359e-07, 2.81574766965, 522.577418094 ],
    [ 1.9435e-07, 6.25741008684, 1059.38193019 ],
    [ 1.0858e-07, 2.04333735353, 1066.49547719 ],
    [ 1.4477e-07, 0, 0 ],
    [ 5.535e-08, 2.75732372347, 515.463871093 ],
    [ 4.939e-08, 1.29727834284, 543.918059096 ],
    [ 4.97e-08, 2.56009290021, 1052.26838319 ],
    [ 4.112e-08, 0.86840480428, 1589.07289528 ],
    [ 3.798e-08, 2.86619114773, 7.1135470008 ],
    [ 1.107e-08, 2.66033381472, 1596.18644228 ],
    [ 1.093e-08, 1.82485496219, 1045.15483619 ],
    [ 1.031e-08, 2.82866669066, 14.2270940016 ]
    // 14 terms retained
];

KMG.VSOPTerms.jupiter_B4 = [
    [ 8.963e-08, 5.9388723238, 536.804512095 ],
    [ 5.28e-08, 4.80778878768, 522.577418094 ]
    // 2 terms retained
];

KMG.VSOPTerms.jupiter_B5 = [
    [ 6.62e-09, 4.10413626462, 536.804512095 ],
    [ 4.31e-09, 0.82614663721, 522.577418094 ]
    // 2 terms retained
];

KMG.VSOPTerms.jupiter_R0 = [
    [ 5.20887429326, 0, 0 ],
    [ 0.25209327119, 3.49108639871, 529.690965095 ],
    [ 0.00610599976, 3.84115365948, 1059.38193019 ],
    [ 0.00282029458, 2.57419881293, 632.783739313 ],
    [ 0.00187647346, 2.07590383214, 522.577418094 ],
    [ 0.00086792905, 0.71001145545, 419.484643875 ],
    [ 0.00072062974, 0.21465724607, 536.804512095 ],
    [ 0.00065517248, 5.9799588479, 316.391869657 ],
    [ 0.00029134542, 1.67759379655, 103.092774219 ],
    [ 0.00030135335, 2.16132003734, 949.17560897 ],
    [ 0.00023453271, 3.54023522184, 735.876513532 ],
    [ 0.00022283743, 4.19362594399, 1589.07289528 ],
    [ 0.00023947298, 0.2745803748, 7.1135470008 ],
    [ 0.00013032614, 2.96042965363, 1162.47470441 ],
    [ 9.70336e-05, 1.90669633585, 206.185548437 ],
    [ 0.00012749023, 2.71550286592, 1052.26838319 ],
    [ 9.161393e-05, 4.41352953117, 213.299095438 ],
    [ 7.894511e-05, 2.47907592482, 426.598190876 ],
    [ 7.057931e-05, 2.18184839926, 1265.56747863 ],
    [ 6.137703e-05, 6.26418240033, 846.082834751 ],
    [ 5.477001e-05, 5.65729989857, 639.897286314 ],
    [ 3.502493e-05, 0.56532365822, 1066.49547719 ],
    [ 4.136822e-05, 2.722208724, 625.670192312 ],
    [ 4.169954e-05, 2.01603822251, 515.463871093 ],
    [ 2.499967e-05, 4.55181655381, 838.96928775 ],
    [ 2.616976e-05, 2.00994012876, 1581.95934828 ],
    [ 1.912009e-05, 0.85621128851, 412.371096874 ],
    [ 2.127681e-05, 6.12755221002, 742.990060533 ],
    [ 1.610567e-05, 3.08871452594, 1368.66025285 ],
    [ 1.479513e-05, 2.68021307468, 1478.86657406 ],
    [ 1.23063e-05, 1.89052048109, 323.505416657 ],
    [ 1.216895e-05, 1.80176263029, 110.206321219 ],
    [ 9.61113e-06, 4.54876995367, 2118.76386038 ],
    [ 8.85764e-06, 4.14783869943, 533.623118358 ],
    [ 7.76583e-06, 3.67710828843, 728.762966531 ],
    [ 9.98591e-06, 2.87205397992, 309.278322656 ],
    [ 1.014733e-05, 1.38675822271, 454.909366527 ],
    [ 7.27156e-06, 3.98827252563, 1155.36115741 ],
    [ 6.55334e-06, 2.7907259691, 1685.0521225 ],
    [ 8.21383e-06, 1.59351544602, 1898.35121794 ],
    [ 6.20818e-06, 4.82275194351, 956.289155971 ],
    [ 6.54071e-06, 3.38140746852, 1692.1656695 ],
    [ 8.11993e-06, 5.94093410097, 909.818733055 ],
    [ 5.62092e-06, 0.08114877791, 543.918059096 ],
    [ 5.42222e-06, 0.28357235311, 525.758811831 ],
    [ 4.57841e-06, 0.12720499202, 1375.77379985 ],
    [ 6.1474e-06, 2.27633681284, 942.062061969 ],
    [ 4.35816e-06, 2.60279250213, 95.9792272178 ],
    [ 4.96009e-06, 5.53020241869, 380.12776796 ],
    [ 4.69974e-06, 2.81883756859, 1795.25844372 ],
    [ 4.45057e-06, 0.14648640292, 14.2270940016 ],
    [ 2.90917e-06, 3.89373030829, 1471.75302706 ],
    [ 2.76581e-06, 2.52188912681, 2001.44399216 ],
    [ 2.7501e-06, 2.98827073289, 526.509571357 ],
    [ 2.93746e-06, 2.04945754349, 199.072001436 ],
    [ 2.9101e-06, 6.03128127682, 1169.58825141 ],
    [ 3.38146e-06, 2.79887096517, 1045.15483619 ],
    [ 2.57472e-06, 6.13406653083, 532.872358832 ],
    [ 3.19036e-06, 1.34818583641, 2214.7430876 ],
    [ 3.09305e-06, 5.36839401116, 1272.68102563 ],
    [ 3.45803e-06, 1.56404960644, 491.557929457 ],
    [ 3.03364e-06, 1.15407454389, 5753.3848849 ],
    [ 1.92308e-06, 0.91996013364, 1596.18644228 ],
    [ 2.15435e-06, 2.63589770012, 2111.65031338 ],
    [ 2.00591e-06, 2.37332227687, 1258.45393163 ],
    [ 2.39039e-06, 3.57396895042, 835.037134487 ],
    [ 1.97072e-06, 5.92862098187, 453.424893819 ],
    [ 1.39406e-06, 3.63978241621, 1788.14489672 ],
    [ 1.91351e-06, 8.947898e-05, 983.115858914 ],
    [ 1.76442e-06, 2.57642803889, 9683.59458112 ],
    [ 1.23523e-06, 2.26101680855, 2317.83586181 ],
    [ 1.28191e-06, 4.66615733627, 831.85574075 ],
    [ 1.12538e-06, 0.85603677104, 433.711737877 ],
    [ 1.28822e-06, 1.10499202918, 2531.13495725 ],
    [ 9.9327e-07, 4.50365769161, 518.645264831 ],
    [ 9.3945e-07, 2.72470156299, 853.196381752 ],
    [ 1.06425e-06, 5.81491645745, 220.412642439 ],
    [ 1.20294e-06, 2.9520444051, 3.9321532631 ],
    [ 8.1685e-07, 3.23399956574, 1361.54670584 ],
    [ 1.03994e-06, 2.22277966661, 74.7815985673 ],
    [ 1.12513e-06, 4.86217051434, 528.206492386 ],
    [ 7.9631e-07, 0.88529543139, 430.530344139 ],
    [ 8.5789e-07, 2.11469709334, 1574.84580128 ],
    [ 8.5635e-07, 2.33825806277, 2428.04218303 ],
    [ 6.8348e-07, 3.35769613854, 2104.53676638 ],
    [ 6.9535e-07, 3.04092499583, 302.164775655 ],
    [ 6.9854e-07, 3.22383407236, 305.346169393 ],
    [ 6.9498e-07, 0.20470467419, 532.138645649 ],
    [ 5.7002e-07, 2.0027840307, 2634.22773147 ],
    [ 7.7019e-07, 2.09814823113, 508.350324092 ],
    [ 5.6672e-07, 3.9163533075, 2221.8566346 ],
    [ 5.8366e-07, 5.72512642459, 628.85158605 ],
    [ 5.2433e-07, 4.0250857458, 527.24328454 ],
    [ 6.3628e-07, 1.10008717069, 1364.72809958 ],
    [ 5.3607e-07, 0.87404483378, 2847.52682691 ],
    [ 5.9639e-07, 0.95858565273, 494.266242443 ],
    [ 5.8002e-07, 3.45633892143, 2008.55753916 ],
    [ 4.153e-07, 3.51955496522, 529.739149204 ],
    [ 4.4717e-07, 1.62318067555, 984.600331622 ],
    [ 4.4943e-07, 4.90105773635, 2648.45482547 ],
    [ 5.3154e-07, 1.19752849531, 760.25553592 ],
    [ 4.4532e-07, 4.42376920441, 1063.31408345 ],
    [ 3.7511e-07, 2.93024338067, 1677.9385755 ],
    [ 4.1535e-07, 0.3217437907, 529.642780985 ],
    [ 4.2886e-07, 0.03097825861, 1439.50969815 ],
    [ 4.601e-07, 2.54409504187, 636.715892576 ],
    [ 4.0307e-07, 4.39482471634, 1148.24761041 ],
    [ 3.8818e-07, 4.31684853535, 149.563197135 ],
    [ 4.0357e-07, 2.10207822074, 2744.43405269 ],
    [ 4.8851e-07, 5.60297823445, 2810.92146161 ],
    [ 3.703e-07, 5.07904223157, 1905.46476494 ],
    [ 4.3876e-07, 1.24634677337, 621.738039049 ],
    [ 3.4015e-07, 3.09481058565, 2420.92863603 ],
    [ 3.6829e-07, 0.84237174099, 530.654172941 ],
    [ 3.1256e-07, 5.35795807657, 1485.98012107 ],
    [ 3.9276e-07, 4.70909591065, 569.04784101 ],
    [ 3.979e-07, 2.46062195592, 355.748745572 ],
    [ 3.153e-07, 6.19283211825, 3.1813937377 ],
    [ 2.8366e-07, 2.48520234303, 519.396024356 ],
    [ 3.2409e-07, 2.73383239343, 604.472563662 ],
    [ 2.7094e-07, 3.92463420595, 2324.94940882 ],
    [ 2.9014e-07, 1.83523374921, 1891.23767094 ],
    [ 2.6731e-07, 1.74874273361, 2950.61960113 ],
    [ 2.6453e-07, 0.60429095482, 1055.44977693 ],
    [ 3.3475e-07, 0.7646317035, 643.829439577 ],
    [ 2.6499e-07, 1.03248824966, 405.257549874 ],
    [ 2.5634e-07, 3.46480952342, 458.84151979 ],
    [ 2.445e-07, 0.88074669554, 423.416797138 ],
    [ 3.2957e-07, 3.18606309728, 528.727757248 ],
    [ 2.2463e-07, 0.43478364259, 1073.60902419 ],
    [ 2.1623e-07, 1.42192729492, 540.736665358 ],
    [ 2.564e-07, 0.52452881258, 511.53171783 ],
    [ 2.1016e-07, 3.08217890882, 629.602345575 ],
    [ 2.2666e-07, 0.65441785872, 3163.91869657 ],
    [ 1.9316e-07, 5.17023800333, 635.965133051 ],
    [ 2.6139e-07, 1.33354028131, 330.618963658 ],
    [ 1.8303e-07, 3.5997376613, 746.922213796 ],
    [ 1.8225e-07, 2.66424699243, 1994.33044516 ],
    [ 1.9775e-07, 4.13615184912, 1464.63948006 ],
    [ 1.9466e-07, 1.85632162779, 3060.82592235 ],
    [ 2.393e-07, 4.99825426891, 1289.94650101 ],
    [ 2.1865e-07, 5.91688197848, 1802.37199072 ],
    [ 1.7423e-07, 2.81999126875, 2737.32050569 ],
    [ 1.6669e-07, 5.67299018075, 408.438943611 ],
    [ 2.294e-07, 5.2676048026, 672.140615228 ],
    [ 1.8349e-07, 1.89870628722, 1021.24889455 ],
    [ 1.9065e-07, 3.66520144826, 415.552490612 ],
    [ 1.5733e-07, 3.34757176872, 1056.20053645 ],
    [ 1.6361e-07, 0.18155522601, 1699.2792165 ],
    [ 1.8718e-07, 1.97821694809, 38.1330356378 ],
    [ 1.8769e-07, 3.69167351769, 88.865680217 ],
    [ 1.553e-07, 3.82369172511, 721.64941953 ],
    [ 1.5401e-07, 1.06319902793, 114.138474483 ],
    [ 1.6809e-07, 1.91000618622, 217.231248701 ],
    [ 1.5253e-07, 1.31927244263, 117.31986822 ],
    [ 1.5115e-07, 3.74899964992, 2641.34127847 ],
    [ 1.9654e-07, 2.7339106561, 39.3568759152 ],
    [ 1.4669e-07, 1.67269531093, 529.169700233 ],
    [ 1.4116e-07, 3.55112673348, 142.449650134 ],
    [ 1.3001e-07, 1.48488755301, 3267.01147078 ],
    [ 1.4924e-07, 1.32583007552, 490.334089179 ],
    [ 1.4753e-07, 4.64530618099, 6283.07584999 ],
    [ 1.4666e-07, 0.80451966905, 5223.6939198 ],
    [ 1.2149e-07, 3.667552208, 750.103607533 ],
    [ 1.1954e-07, 2.97127390765, 505.311942706 ],
    [ 1.4697e-07, 2.16792533244, 530.212229956 ],
    [ 1.2272e-07, 0.20695687447, 1062.56332393 ],
    [ 1.1491e-07, 1.11749661877, 561.934294009 ],
    [ 1.1727e-07, 1.6592279015, 2207.6295406 ],
    [ 1.1081e-07, 3.22060243425, 535.107591066 ],
    [ 1.1566e-07, 5.23036903534, 524.061890802 ],
    [ 1.1187e-07, 3.8384242505, 76.2660712756 ],
    [ 1.2702e-07, 3.96823187752, 2538.24850425 ],
    [ 1.0918e-07, 1.27796360308, 2125.87740738 ],
    [ 1.1242e-07, 3.23197763125, 422.666037613 ],
    [ 1.264e-07, 0.73683423677, 908.334260346 ],
    [ 1.131e-07, 5.55879589444, 531.175437803 ],
    [ 9.584e-08, 5.01019903321, 597.359016661 ],
    [ 1.031e-07, 3.83872758066, 1781.03134972 ],
    [ 1.0762e-07, 4.91380719453, 525.025098649 ],
    [ 1.1756e-07, 5.11238523418, 685.473937353 ],
    [ 1.1958e-07, 1.72875918561, 911.303205763 ],
    [ 9.511e-08, 2.95053004168, 1382.88734685 ],
    [ 8.902e-08, 2.40357723787, 2310.72231481 ],
    [ 9.215e-08, 2.57853098079, 3053.71237535 ],
    [ 9.92e-08, 0.43817210648, 3480.31056622 ],
    [ 8.714e-08, 3.67018202505, 739.808666795 ],
    [ 8.664e-08, 2.70398612383, 526.770203788 ],
    [ 9.435e-08, 1.61939988249, 3377.217792 ],
    [ 1.1544e-07, 1.59031375667, 1474.67378837 ],
    [ 9.532e-08, 0.35524234217, 1512.80682401 ],
    [ 9.993e-08, 4.80140922781, 558.002140746 ],
    [ 7.969e-08, 0.08480602718, 528.940205569 ],
    [ 7.929e-08, 1.46877435816, 963.402702971 ],
    [ 8.877e-08, 1.21758319481, 416.303250138 ],
    [ 8.738e-08, 5.29236760592, 945.243455707 ],
    [ 8.611e-08, 1.13232641062, 532.611726401 ],
    [ 7.852e-08, 6.26908468547, 647.010833315 ],
    [ 7.581e-08, 2.90608705953, 533.883750789 ],
    [ 8.585e-08, 6.06648047796, 10213.2855462 ],
    [ 1.015e-07, 2.49061363606, 1819.63746611 ],
    [ 8.534e-08, 2.22687140541, 9153.90361602 ],
    [ 7.968e-08, 3.75535355212, 530.44172462 ],
    [ 9.742e-08, 6.15792553288, 593.426863398 ],
    [ 7.137e-08, 3.59005542659, 2957.73314813 ],
    [ 7.176e-08, 0.12508174554, 224.344795702 ],
    [ 8.727e-08, 0.75644622066, 960.221309234 ],
    [ 7.073e-08, 2.17418036839, 724.830813268 ],
    [ 7.193e-08, 2.30068915654, 520.129737539 ],
    [ 6.555e-08, 4.75218205387, 202.253395174 ],
    [ 6.417e-08, 1.25043809621, 3583.40334044 ],
    [ 8.27e-08, 1.24822326308, 495.750715151 ],
    [ 7.123e-08, 3.84780072799, 618.556645312 ],
    [ 8.145e-08, 0.73137862078, 230.564570825 ],
    [ 6.151e-08, 5.50130756047, 11.0457002639 ],
    [ 7.972e-08, 2.08176164007, 953.107762233 ],
    [ 7.652e-08, 0.92748230521, 525.498179401 ],
    [ 7.432e-08, 0.31435666835, 378.643295252 ],
    [ 6.222e-08, 1.46220596893, 483.220542179 ],
    [ 7.153e-08, 0.18772230606, 731.944360269 ],
    [ 6.706e-08, 2.92078077444, 1038.04128919 ],
    [ 7.309e-08, 6.27084750121, 21.3406410024 ],
    [ 6.129e-08, 2.68322633435, 312.459716394 ],
    [ 7.541e-08, 0.73440261131, 457.617679513 ],
    [ 5.558e-08, 3.83419160288, 534.356831541 ],
    [ 5.343e-08, 5.25360544458, 1048.33622993 ],
    [ 5.341e-08, 6.22288713664, 551.031606097 ],
    [ 5.613e-08, 1.51210605952, 524.274339123 ],
    [ 5.478e-08, 5.95887338334, 539.985905833 ],
    [ 5.216e-08, 2.20381924871, 280.967147005 ],
    [ 5.056e-08, 0.37387972537, 529.5309064 ],
    [ 6.202e-08, 5.53800819472, 2.4476805548 ],
    [ 6.261e-08, 0.75330485783, 938.129908706 ],
    [ 5.419e-08, 5.96993331731, 227.52618944 ],
    [ 5.71e-08, 2.12868548085, 191.958454436 ],
    [ 5.218e-08, 4.69335266854, 560.710453732 ],
    [ 4.84e-08, 1.51601288645, 2524.02141025 ],
    [ 5.738e-08, 0.34249718209, 535.910740218 ],
    [ 5.056e-08, 3.46671669992, 529.851023789 ],
    [ 5.409e-08, 5.21471277042, 1057.89745748 ],
    [ 4.734e-08, 2.2773307717, 3370.104245 ],
    [ 5.22e-08, 3.61280797725, 2097.42321938 ],
    [ 4.861e-08, 1.38856203056, 3693.60966166 ],
    [ 5.738e-08, 4.79777823324, 598.843489369 ],
    [ 5.69e-08, 3.93800591227, 2854.64037391 ],
    [ 4.988e-08, 4.87228166876, 1.4844727083 ],
    [ 5.424e-08, 3.53268613904, 456.393839236 ],
    [ 4.289e-08, 4.84380640711, 70.8494453042 ],
    [ 5.944e-08, 3.79180483544, 25558.2121765 ],
    [ 4.189e-08, 2.08145249041, 2627.11418447 ],
    [ 4.549e-08, 5.64074512699, 2435.15573004 ],
    [ 4.268e-08, 6.20250525407, 775.233389447 ],
    [ 5.405e-08, 4.66492781581, 833.552661779 ],
    [ 5.607e-08, 3.30270139804, 535.320039387 ],
    [ 4.171e-08, 3.14858229862, 944.982823276 ],
    [ 4.128e-08, 5.84804741359, 440.825284878 ],
    [ 4.387e-08, 4.69677892021, 327.43756992 ],
    [ 4.468e-08, 0.2134804442, 92.0470739547 ],
    [ 4.052e-08, 3.3136700605, 3274.12501779 ],
    [ 4.375e-08, 0.20464725158, 3796.70243588 ],
    [ 4.301e-08, 0.99845168304, 387.241314961 ],
    [ 4.703e-08, 1.96435195092, 107.024927482 ],
    [ 4.213e-08, 3.21377867882, 696.519637617 ],
    [ 4.014e-08, 4.62540459805, 2751.54759969 ],
    [ 3.824e-08, 3.60290168808, 437.64389114 ],
    [ 4.183e-08, 4.74495457566, 988.532484885 ],
    [ 3.687e-08, 1.57511269436, 381.612240668 ],
    [ 3.808e-08, 3.97513732318, 732.695119794 ],
    [ 4.134e-08, 2.59512563472, 916.932280055 ],
    [ 4.905e-08, 2.67946228179, 1215.16490245 ],
    [ 4.34e-08, 1.514325863, 1894.41906468 ],
    [ 3.49e-08, 0.63097592112, 529.903413416 ],
    [ 4.179e-08, 4.79066440364, 824.742193749 ],
    [ 4.126e-08, 3.63856052239, 810.658112099 ],
    [ 3.701e-08, 6.1767641288, 537.767719942 ],
    [ 4.355e-08, 3.13180489048, 630.336058758 ],
    [ 3.315e-08, 1.52493374102, 547.850212359 ],
    [ 3.49e-08, 3.20962050417, 529.478516774 ],
    [ 3.555e-08, 6.03691345521, 739.057907269 ],
    [ 4.099e-08, 6.00401453177, 902.705186054 ],
    [ 4.004e-08, 2.13540836634, 210.1177017 ],
    [ 3.295e-08, 2.58083202302, 945.994215232 ],
    [ 3.27e-08, 3.49304887352, 1166.40685767 ],
    [ 3.994e-08, 4.78250942681, 850.014988014 ],
    [ 4.24e-08, 0.11161358607, 1744.85586754 ],
    [ 4.002e-08, 5.20683965697, 635.231419868 ],
    [ 3.115e-08, 4.61995541904, 952.357002707 ],
    [ 3.003e-08, 0.92689294845, 3899.7952101 ],
    [ 3.241e-08, 6.13636496944, 10.2949407385 ],
    [ 3.219e-08, 1.83595567094, 18.1592472647 ],
    [ 2.983e-08, 2.60087913786, 632.831923423 ],
    [ 2.967e-08, 5.69894599757, 632.735555203 ],
    [ 3.168e-08, 6.13783090971, 1158.54255114 ],
    [ 3.226e-08, 5.5995770736, 608.404716925 ],
    [ 3.122e-08, 5.6507150217, 99.1606209555 ],
    [ 3.761e-08, 2.09239982789, 282.451619713 ],
    [ 3.356e-08, 1.79147113193, 521.614210247 ]
    // 297 terms retained
];

KMG.VSOPTerms.jupiter_R1 = [
    [ 0.0127180152, 2.64937512894, 529.690965095 ],
    [ 0.00061661816, 3.00076460387, 1059.38193019 ],
    [ 0.00053443713, 3.89717383175, 522.577418094 ],
    [ 0.00031185171, 4.88276958012, 536.804512095 ],
    [ 0.00041390269, 0, 0 ],
    [ 0.00011847263, 2.41328764459, 419.484643875 ],
    [ 9.166454e-05, 4.75978553741, 7.1135470008 ],
    [ 3.175595e-05, 2.79298354393, 103.092774219 ],
    [ 3.203481e-05, 5.21084121495, 735.876513532 ],
    [ 3.403577e-05, 3.34689633223, 1589.07289528 ],
    [ 2.599925e-05, 3.63439058628, 206.185548437 ],
    [ 2.412127e-05, 1.46948314626, 426.598190876 ],
    [ 2.80607e-05, 3.74227009702, 515.463871093 ],
    [ 2.676611e-05, 4.33051702874, 1052.26838319 ],
    [ 2.100392e-05, 3.92772817188, 639.897286314 ],
    [ 1.64616e-05, 5.30947626153, 1066.49547719 ],
    [ 1.641093e-05, 4.41628521235, 625.670192312 ],
    [ 1.049766e-05, 3.16115576687, 213.299095438 ],
    [ 1.024703e-05, 2.55437897122, 412.371096874 ],
    [ 7.40834e-06, 2.17089042827, 1162.47470441 ],
    [ 8.0643e-06, 2.67747285932, 632.783739313 ],
    [ 6.76729e-06, 6.2497969066, 838.96928775 ],
    [ 4.68918e-06, 4.70985711091, 543.918059096 ],
    [ 4.44628e-06, 0.40306241278, 323.505416657 ],
    [ 5.67074e-06, 4.57671527249, 742.990060533 ],
    [ 4.1584e-06, 5.36847472493, 728.762966531 ],
    [ 4.8481e-06, 2.46907968946, 949.17560897 ],
    [ 3.37576e-06, 3.16751996354, 956.289155971 ],
    [ 4.01711e-06, 4.60509281258, 309.278322656 ],
    [ 3.4733e-06, 4.68154619204, 14.2270940016 ],
    [ 2.60727e-06, 5.34286862943, 846.082834751 ],
    [ 2.2002e-06, 4.84195212656, 1368.66025285 ],
    [ 2.03233e-06, 5.60019394971, 1155.36115741 ],
    [ 2.46438e-06, 3.92373109496, 942.062061969 ],
    [ 1.83575e-06, 4.26454732757, 95.9792272178 ],
    [ 1.97119e-06, 3.70582665656, 2118.76386038 ],
    [ 1.79982e-06, 4.4021361484, 532.872358832 ],
    [ 1.95844e-06, 3.75886519686, 199.072001436 ],
    [ 2.0014e-06, 4.43930806722, 1045.15483619 ],
    [ 1.70248e-06, 4.84663902529, 526.509571357 ],
    [ 1.46328e-06, 6.12953407685, 533.623118358 ],
    [ 1.33441e-06, 1.32112984738, 110.206321219 ],
    [ 1.3203e-06, 4.5111176854, 525.758811831 ],
    [ 1.23776e-06, 2.0423359166, 1478.86657406 ],
    [ 1.21876e-06, 4.40555373903, 1169.58825141 ],
    [ 1.15354e-06, 4.4675233641, 1581.95934828 ],
    [ 9.8559e-07, 5.72824115387, 1596.18644228 ],
    [ 9.1744e-07, 4.53147949989, 1685.0521225 ],
    [ 1.10685e-06, 3.62539004538, 1272.68102563 ],
    [ 8.0515e-07, 4.11374100758, 1258.45393163 ],
    [ 7.9518e-07, 2.71923662078, 1692.1656695 ],
    [ 1.00157e-06, 5.24639992412, 1265.56747863 ],
    [ 7.7866e-07, 5.56575552496, 1471.75302706 ],
    [ 8.584e-07, 0.07984103333, 831.85574075 ],
    [ 8.2132e-07, 3.8076306513, 508.350324092 ],
    [ 5.5296e-07, 0.35136399335, 316.391869657 ],
    [ 5.2289e-07, 5.53069765044, 433.711737877 ],
    [ 5.5809e-07, 4.75224156118, 302.164775655 ],
    [ 5.0625e-07, 4.85603624371, 1375.77379985 ],
    [ 4.3539e-07, 4.94471526157, 1361.54670584 ],
    [ 4.2146e-07, 1.22819828957, 853.196381752 ],
    [ 3.7653e-07, 4.26849585975, 2001.44399216 ],
    [ 4.9301e-07, 4.01704532497, 220.412642439 ],
    [ 3.8248e-07, 5.33256180883, 1788.14489672 ],
    [ 3.5653e-07, 1.7630023504, 1795.25844372 ],
    [ 3.6185e-07, 3.85316960087, 1574.84580128 ],
    [ 2.9178e-07, 5.1681765418, 3.9321532631 ],
    [ 2.5113e-07, 4.3388976689, 519.396024356 ],
    [ 2.4766e-07, 2.72782261862, 405.257549874 ],
    [ 2.7102e-07, 6.09843304423, 1148.24761041 ],
    [ 2.2665e-07, 0.19350039559, 380.12776796 ],
    [ 2.0538e-07, 4.32862762591, 3.1813937377 ],
    [ 1.9941e-07, 4.6343584991, 1677.9385755 ],
    [ 1.9522e-07, 5.1072829713, 1073.60902419 ],
    [ 1.85e-07, 3.76514376541, 1485.98012107 ],
    [ 1.8845e-07, 5.0570337283, 2104.53676638 ],
    [ 1.6987e-07, 4.02069213446, 2317.83586181 ],
    [ 1.668e-07, 5.4330287961, 88.865680217 ],
    [ 1.5372e-07, 2.91841323048, 2008.55753916 ],
    [ 1.4419e-07, 3.63960739927, 628.85158605 ],
    [ 1.463e-07, 5.51305730294, 721.64941953 ],
    [ 1.854e-07, 6.02594081104, 330.618963658 ],
    [ 1.3638e-07, 4.88575627207, 629.602345575 ],
    [ 1.3472e-07, 1.38742780013, 518.645264831 ],
    [ 1.5538e-07, 2.93208280366, 1905.46476494 ],
    [ 1.2405e-07, 1.58727793866, 2111.65031338 ],
    [ 1.2168e-07, 3.37798229468, 635.965133051 ],
    [ 1.1835e-07, 4.08484570984, 2648.45482547 ],
    [ 1.1259e-07, 4.62303293007, 636.715892576 ],
    [ 1.4286e-07, 2.74041502983, 2221.8566346 ],
    [ 1.1157e-07, 3.54867395941, 1891.23767094 ],
    [ 1.3131e-07, 5.83476507713, 1464.63948006 ],
    [ 1.1346e-07, 2.57830184286, 511.53171783 ],
    [ 1.0484e-07, 0.49631744855, 453.424893819 ],
    [ 9.712e-08, 4.39039807014, 1994.33044516 ],
    [ 1.0072e-07, 2.75854126409, 423.416797138 ],
    [ 8.973e-08, 4.79620568259, 2420.92863603 ],
    [ 8.487e-08, 5.15862241737, 1056.20053645 ],
    [ 8.037e-08, 3.72684449392, 2634.22773147 ],
    [ 8.036e-08, 1.28481352995, 2428.04218303 ],
    [ 8.823e-08, 1.84296748834, 750.103607533 ],
    [ 8.976e-08, 4.81284969227, 1062.56332393 ],
    [ 8.608e-08, 4.53451403086, 21.3406410024 ],
    [ 9.412e-08, 4.34166457358, 1802.37199072 ],
    [ 6.904e-08, 5.96626034536, 540.736665358 ],
    [ 7.268e-08, 4.98087083693, 1699.2792165 ],
    [ 7.068e-08, 4.99227057771, 1055.44977693 ],
    [ 7.244e-08, 4.97266787687, 1898.35121794 ],
    [ 6.479e-08, 1.40223433818, 422.666037613 ],
    [ 6.28e-08, 3.64802738608, 621.738039049 ],
    [ 6.231e-08, 4.45749513375, 551.031606097 ],
    [ 6.271e-08, 6.13813110445, 2125.87740738 ],
    [ 6.801e-08, 2.92013819097, 2324.94940882 ],
    [ 5.898e-08, 2.58873003212, 569.04784101 ],
    [ 6.481e-08, 4.58107849781, 1038.04128919 ],
    [ 6.653e-08, 5.54500062883, 1781.03134972 ],
    [ 7.187e-08, 3.02482572051, 416.303250138 ],
    [ 5.141e-08, 6.21519498122, 963.402702971 ],
    [ 5.878e-08, 4.23185657623, 539.985905833 ],
    [ 5.119e-08, 0.06958852255, 1063.31408345 ],
    [ 5.247e-08, 0.16792912472, 117.31986822 ],
    [ 5.423e-08, 4.93524030417, 835.037134487 ],
    [ 6.217e-08, 3.87980766892, 191.958454436 ],
    [ 4.967e-08, 1.34452103048, 1382.88734685 ],
    [ 4.635e-08, 4.63642027299, 643.829439577 ],
    [ 4.561e-08, 3.37093181163, 2207.6295406 ],
    [ 4.474e-08, 4.07436890901, 2310.72231481 ],
    [ 4.703e-08, 4.55179426438, 2737.32050569 ],
    [ 4.487e-08, 1.48312334127, 408.438943611 ],
    [ 4.087e-08, 1.12906821675, 415.552490612 ],
    [ 5.489e-08, 5.62261637529, 618.556645312 ],
    [ 4.323e-08, 4.60454457547, 647.010833315 ],
    [ 3.882e-08, 4.09352825462, 430.530344139 ],
    [ 3.747e-08, 3.41170997719, 2950.61960113 ],
    [ 3.803e-08, 2.19632996017, 534.356831541 ],
    [ 3.634e-08, 1.03495466077, 2744.43405269 ],
    [ 4.549e-08, 4.21325324482, 227.52618944 ],
    [ 3.565e-08, 4.1124002973, 440.825284878 ],
    [ 3.852e-08, 1.1493781578, 74.7815985673 ],
    [ 3.525e-08, 4.27662025409, 10.2949407385 ],
    [ 3.488e-08, 5.33792561596, 458.84151979 ],
    [ 4.208e-08, 2.38049728614, 2538.24850425 ],
    [ 4.465e-08, 0.18617267547, 824.742193749 ],
    [ 3.327e-08, 5.51323389248, 739.808666795 ],
    [ 3.252e-08, 2.68329422796, 561.934294009 ],
    [ 3.247e-08, 4.88392621669, 295.051228654 ],
    [ 3.571e-08, 4.64017933384, 2214.7430876 ],
    [ 3.469e-08, 4.3426692436, 305.346169393 ],
    [ 3.43e-08, 3.34792668508, 149.563197135 ],
    [ 3.474e-08, 2.75054677372, 2641.34127847 ],
    [ 3.618e-08, 5.30205670433, 2097.42321938 ],
    [ 2.963e-08, 1.32779700914, 611.443098311 ],
    [ 2.826e-08, 0.91971516521, 984.600331622 ],
    [ 3.445e-08, 1.63289286159, 525.025098649 ],
    [ 2.635e-08, 5.25522783247, 532.138645649 ],
    [ 2.682e-08, 4.24680441193, 3053.71237535 ],
    [ 2.655e-08, 3.18365951037, 527.24328454 ],
    [ 2.418e-08, 4.23791881124, 217.231248701 ],
    [ 2.231e-08, 4.23923472684, 739.057907269 ],
    [ 2.268e-08, 5.5224811056, 524.274339123 ],
    [ 2.095e-08, 4.85943251945, 1049.08698945 ],
    [ 2.054e-08, 5.38759557118, 142.449650134 ],
    [ 2.058e-08, 3.79500539044, 2627.11418447 ],
    [ 2.536e-08, 3.95352520357, 210.1177017 ],
    [ 2.095e-08, 5.76269812349, 529.642780985 ],
    [ 2.533e-08, 5.82849252925, 732.695119794 ],
    [ 2.025e-08, 4.20638434497, 945.994215232 ],
    [ 2.248e-08, 1.61218306133, 604.472563662 ]
    // 168 terms retained
];

KMG.VSOPTerms.jupiter_R2 = [
    [ 0.00079644957, 1.35865949884, 529.690965095 ],
    [ 8.251645e-05, 5.777744604, 522.577418094 ],
    [ 7.02994e-05, 3.27477392111, 536.804512095 ],
    [ 5.314031e-05, 1.83835031247, 1059.38193019 ],
    [ 1.861184e-05, 2.97686957956, 7.1135470008 ],
    [ 8.36256e-06, 4.19892740368, 419.484643875 ],
    [ 9.6442e-06, 5.48029587251, 515.463871093 ],
    [ 4.06408e-06, 3.78248932836, 1066.49547719 ],
    [ 4.26544e-06, 2.22743958182, 639.897286314 ],
    [ 3.77334e-06, 2.24232535935, 1589.07289528 ],
    [ 4.97914e-06, 3.14159265359, 0 ],
    [ 3.39124e-06, 6.12690872435, 625.670192312 ],
    [ 3.62961e-06, 5.36776401268, 206.185548437 ],
    [ 3.42139e-06, 6.09909325177, 1052.26838319 ],
    [ 2.7994e-06, 4.26158071104, 412.371096874 ],
    [ 3.32558e-06, 0.00332561805, 426.598190876 ],
    [ 2.29775e-06, 0.70510840437, 735.876513532 ],
    [ 2.00884e-06, 3.06805028347, 543.918059096 ],
    [ 1.9966e-06, 4.42869041267, 103.092774219 ],
    [ 2.57306e-06, 0.962674825, 632.783739313 ],
    [ 1.38577e-06, 2.93153004432, 14.2270940016 ],
    [ 1.1338e-06, 0.78831018317, 728.762966531 ],
    [ 8.5848e-07, 5.14257631438, 323.505416657 ],
    [ 9.4695e-07, 1.70378030966, 838.96928775 ],
    [ 8.3674e-07, 0.05892269245, 309.278322656 ],
    [ 7.5194e-07, 1.60633621497, 956.289155971 ],
    [ 7.0197e-07, 1.50916343132, 213.299095438 ],
    [ 8.0209e-07, 2.98293613006, 742.990060533 ],
    [ 5.6365e-07, 0.95014515126, 1162.47470441 ],
    [ 6.1758e-07, 6.10246926546, 1045.15483619 ],
    [ 6.6425e-07, 5.47411271821, 199.072001436 ],
    [ 5.0128e-07, 2.72034786035, 532.872358832 ],
    [ 5.1793e-07, 5.58477632168, 942.062061969 ],
    [ 3.9925e-07, 5.94843040319, 95.9792272178 ],
    [ 4.4584e-07, 5.52437023269, 508.350324092 ],
    [ 4.4215e-07, 0.26965913924, 526.509571357 ],
    [ 3.013e-07, 0.93896301926, 1155.36115741 ],
    [ 2.8433e-07, 2.87743261296, 525.758811831 ],
    [ 2.6377e-07, 4.26907277677, 1596.18644228 ],
    [ 2.7064e-07, 2.80927398799, 1169.58825141 ],
    [ 2.7531e-07, 2.64852579481, 2118.76386038 ],
    [ 2.2695e-07, 0.18097965354, 302.164775655 ],
    [ 2.9439e-07, 1.78672212056, 831.85574075 ],
    [ 2.0007e-07, 0.03856532918, 949.17560897 ],
    [ 1.9915e-07, 1.1579233154, 533.623118358 ],
    [ 2.1698e-07, 1.8898695033, 1272.68102563 ],
    [ 1.7678e-07, 4.14815218724, 846.082834751 ],
    [ 1.7064e-07, 5.88794387217, 1258.45393163 ],
    [ 2.1474e-07, 4.34579246643, 316.391869657 ],
    [ 2.1174e-07, 0.54776446005, 1265.56747863 ],
    [ 1.9878e-07, 0.06616288602, 1581.95934828 ],
    [ 1.7028e-07, 0.53404092917, 1368.66025285 ],
    [ 1.2874e-07, 3.89924775426, 433.711737877 ],
    [ 1.2887e-07, 0.81112211137, 110.206321219 ],
    [ 1.1716e-07, 0.40420153376, 1361.54670584 ],
    [ 1.1655e-07, 4.43864372476, 405.257549874 ],
    [ 1.2042e-07, 2.22601252935, 220.412642439 ],
    [ 9.62e-08, 6.01003863537, 853.196381752 ],
    [ 1.0252e-07, 0.99356542172, 1471.75302706 ],
    [ 9.102e-08, 1.61635845262, 1692.1656695 ],
    [ 8.722e-08, 3.51382233353, 1073.60902419 ],
    [ 8.283e-08, 5.61696036887, 1574.84580128 ],
    [ 8.917e-08, 6.26263765188, 519.396024356 ],
    [ 7.962e-08, 0.6424558275, 1478.86657406 ],
    [ 7.722e-08, 0.17138136003, 1685.0521225 ],
    [ 7.445e-08, 0.9053742871, 88.865680217 ],
    [ 7.337e-08, 0.8899628257, 721.64941953 ],
    [ 9.118e-08, 1.51639567636, 1148.24761041 ],
    [ 6.139e-08, 2.49651421842, 3.1813937377 ],
    [ 7.001e-08, 4.44209624915, 330.618963658 ],
    [ 5.235e-08, 2.79243270986, 21.3406410024 ],
    [ 5.041e-08, 2.97840393432, 1375.77379985 ],
    [ 4.937e-08, 0.04442899397, 1677.9385755 ],
    [ 4.633e-08, 2.26661974645, 1485.98012107 ],
    [ 4.667e-08, 0.84935842035, 3.9321532631 ],
    [ 5.341e-08, 0.86294969395, 1788.14489672 ],
    [ 4.248e-08, 0.41663016954, 629.602345575 ],
    [ 4.187e-08, 1.6219871556, 635.965133051 ],
    [ 3.629e-08, 2.71174024514, 551.031606097 ],
    [ 4.453e-08, 1.27731121245, 1464.63948006 ],
    [ 3.266e-08, 0.54602174256, 1795.25844372 ],
    [ 3.409e-08, 1.20638860556, 1905.46476494 ],
    [ 3.164e-08, 6.20189662302, 1038.04128919 ],
    [ 3.096e-08, 6.21099164255, 2001.44399216 ],
    [ 3.404e-08, 2.44670518809, 539.985905833 ],
    [ 3.168e-08, 5.58075929197, 191.958454436 ],
    [ 2.201e-08, 5.33344494715, 1891.23767094 ],
    [ 2.553e-08, 3.20949626593, 1062.56332393 ],
    [ 2.386e-08, 4.29199230828, 963.402702971 ],
    [ 2.597e-08, 0.57986674442, 2104.53676638 ],
    [ 2.547e-08, 0.14627545776, 750.103607533 ],
    [ 2.609e-08, 4.82665360488, 416.303250138 ],
    [ 2.187e-08, 1.71707514653, 628.85158605 ],
    [ 2.258e-08, 6.17429279705, 1994.33044516 ],
    [ 2.624e-08, 2.36922205485, 227.52618944 ],
    [ 2.097e-08, 3.31460321409, 1699.2792165 ],
    [ 2.027e-08, 3.15533834136, 611.443098311 ],
    [ 2.081e-08, 0.31057710726, 2111.65031338 ],
    [ 2.484e-08, 0.04731413707, 1898.35121794 ],
    [ 1.963e-08, 0.29583638556, 636.715892576 ],
    [ 2.279e-08, 1.96058124545, 824.742193749 ],
    [ 1.829e-08, 4.69907372627, 2125.87740738 ],
    [ 1.829e-08, 0.33004933298, 295.051228654 ],
    [ 2.553e-08, 1.24739305569, 2221.8566346 ],
    [ 1.785e-08, 3.5100927402, 647.010833315 ],
    [ 1.786e-08, 3.46994340828, 1055.44977693 ],
    [ 1.742e-08, 2.43853510157, 10.2949407385 ],
    [ 1.85e-08, 1.60578508516, 2008.55753916 ],
    [ 1.971e-08, 1.15435477931, 618.556645312 ],
    [ 1.611e-08, 5.83466560322, 422.666037613 ],
    [ 1.639e-08, 0.45469643466, 1056.20053645 ],
    [ 1.628e-08, 5.86754764931, 2317.83586181 ],
    [ 2.099e-08, 1.05944599014, 1781.03134972 ],
    [ 1.57e-08, 2.39516560987, 440.825284878 ],
    [ 1.999e-08, 4.62828691526, 423.416797138 ],
    [ 1.48e-08, 0.02394813605, 1382.88734685 ],
    [ 1.502e-08, 5.74598263477, 117.31986822 ],
    [ 1.881e-08, 2.76425929784, 1802.37199072 ],
    [ 1.983e-08, 2.99080832362, 2648.45482547 ],
    [ 1.402e-08, 0.15904673895, 2420.92863603 ],
    [ 1.174e-08, 1.55354182426, 380.12776796 ],
    [ 1.321e-08, 1.26221998203, 1063.31408345 ],
    [ 1.15e-08, 4.12219328847, 547.850212359 ],
    [ 1.08e-08, 4.41192013439, 934.948514968 ],
    [ 1.138e-08, 5.93242605811, 2310.72231481 ],
    [ 1.033e-08, 5.63854408052, 99.9113804809 ],
    [ 9.49e-09, 6.07298626146, 511.53171783 ],
    [ 1.012e-08, 3.80744305824, 1603.29998929 ],
    [ 9.22e-09, 6.16494528393, 945.994215232 ],
    [ 9.15e-09, 5.22425774632, 2207.6295406 ],
    [ 8.6e-09, 2.48740591818, 6283.07584999 ],
    [ 8.36e-09, 1.08651799806, 81.7521332162 ],
    [ 1.165e-08, 0.72510519647, 2097.42321938 ],
    [ 8.51e-09, 4.69371733745, 5746.2713379 ],
    [ 7.89e-09, 3.91035208173, 10213.2855462 ],
    [ 8.46e-09, 0.77030801324, 5760.4984319 ],
    [ 9.24e-09, 1.4342324986, 732.695119794 ],
    [ 8.05e-09, 6.11630827296, 9676.48103412 ],
    [ 8e-09, 2.1928953416, 9690.70812812 ],
    [ 8.12e-09, 5.00490295474, 319.573263394 ],
    [ 8.41e-09, 1.22483116811, 952.357002707 ],
    [ 7.2e-09, 3.95975713584, 337.732510659 ],
    [ 7.11e-09, 1.23970970528, 106.274167956 ],
    [ 8.89e-09, 0.10251260092, 2737.32050569 ],
    [ 8.58e-09, 1.51763095265, 2324.94940882 ],
    [ 8.68e-09, 2.67598866406, 3370.104245 ],
    [ 7.1e-09, 0.65180853077, 2538.24850425 ],
    [ 7.43e-09, 0.60536479474, 1354.43315884 ],
    [ 6.33e-09, 1.37719198152, 124.433415221 ],
    [ 8.66e-09, 3.02831268213, 3046.59882835 ],
    [ 7.33e-09, 5.84583969196, 2634.22773147 ],
    [ 6.91e-09, 1.14062641255, 2641.34127847 ],
    [ 5.93e-09, 1.80277592426, 453.424893819 ],
    [ 6.6e-09, 6.01207640959, 1049.08698945 ],
    [ 7.71e-09, 6.01059588645, 2214.7430876 ],
    [ 5.86e-09, 5.6814901946, 107.024927482 ],
    [ 6.39e-09, 4.77149952374, 860.309928753 ],
    [ 7.82e-09, 2.52401202862, 3679.38256766 ],
    [ 6.31e-09, 2.27765412816, 2015.67108616 ],
    [ 7.79e-09, 2.38608991574, 3267.01147078 ],
    [ 5.84e-09, 3.00542907219, 1262.38608489 ],
    [ 5.43e-09, 3.09924086245, 3281.23856479 ],
    [ 5.35e-09, 2.42171003067, 739.057907269 ],
    [ 6.81e-09, 1.18831331541, 739.808666795 ],
    [ 6.21e-09, 1.2446288744, 3803.81598288 ],
    [ 7.17e-09, 4.14222389339, 9683.59458112 ],
    [ 5.46e-09, 3.43095520503, 18.1592472647 ],
    [ 5.45e-09, 5.65426574985, 2627.11418447 ],
    [ 5.38e-09, 4.92334194042, 447.795819526 ],
    [ 5.34e-09, 0.99911551571, 462.022913528 ],
    [ 5.41e-09, 6.19275150397, 1987.21689816 ],
    [ 5.11e-09, 3.2855327837, 4.665866446 ],
    [ 5.37e-09, 5.33205206604, 2751.54759969 ],
    [ 6.51e-09, 5.12199308959, 3156.80514957 ],
    [ 5.1e-09, 5.35664230912, 9.5612275556 ],
    [ 5.44e-09, 1.81488805078, 1251.34038462 ],
    [ 4.26e-09, 2.10841334313, 149.563197135 ],
    [ 5.16e-09, 3.89424540015, 2516.90786325 ],
    [ 5.43e-09, 5.56620814561, 2524.02141025 ],
    [ 5.19e-09, 2.43126348834, 3686.49611466 ],
    [ 4.04e-09, 2.77840802846, 7.1617311106 ],
    [ 5.33e-09, 4.77083438961, 3473.19701922 ],
    [ 3.86e-09, 6.06244501785, 203.004154699 ],
    [ 4.82e-09, 0.38718011166, 2428.04218303 ],
    [ 4.34e-09, 5.36713537673, 2531.13495725 ],
    [ 3.7e-09, 6.04174787347, 1670.8250285 ]
];

KMG.VSOPTerms.jupiter_R3 = [
    [ 3.519277e-05, 6.05800355513, 529.690965095 ],
    [ 1.073281e-05, 1.67319166156, 536.804512095 ],
    [ 9.1563e-06, 1.41326157617, 522.577418094 ],
    [ 3.41654e-06, 0.52294532787, 1059.38193019 ],
    [ 2.54881e-06, 1.19631092831, 7.1135470008 ],
    [ 2.21477e-06, 0.95234304351, 515.463871093 ],
    [ 6.902e-07, 2.26889455907, 1066.49547719 ],
    [ 8.9777e-07, 3.14159265359, 0 ],
    [ 5.7885e-07, 1.41227055539, 543.918059096 ],
    [ 5.77e-07, 0.52564805704, 639.897286314 ],
    [ 5.1213e-07, 5.97994255422, 412.371096874 ],
    [ 4.6968e-07, 1.57861666908, 625.670192312 ],
    [ 4.2744e-07, 6.11814173992, 419.484643875 ],
    [ 3.7444e-07, 1.18048940249, 14.2270940016 ],
    [ 3.3816e-07, 1.66573652907, 1052.26838319 ],
    [ 3.1166e-07, 1.0446807262, 1589.07289528 ],
    [ 2.9943e-07, 4.63498871771, 426.598190876 ],
    [ 3.3558e-07, 0.8485387917, 206.185548437 ],
    [ 2.0709e-07, 2.50340319894, 728.762966531 ],
    [ 1.447e-07, 0.96111460506, 508.350324092 ],
    [ 1.2974e-07, 1.50391478213, 1045.15483619 ],
    [ 1.1596e-07, 3.55299164531, 323.505416657 ],
    [ 1.2357e-07, 2.6079739865, 735.876513532 ],
    [ 1.5065e-07, 0.8796121409, 199.072001436 ],
    [ 1.1062e-07, 1.78854133467, 309.278322656 ],
    [ 1.0576e-07, 0.00265970762, 956.289155971 ],
    [ 9.798e-08, 6.24533081819, 103.092774219 ],
    [ 6.725e-08, 1.86312777034, 302.164775655 ],
    [ 9.133e-08, 3.46071465629, 838.96928775 ],
    [ 7.338e-08, 1.28438797074, 742.990060533 ],
    [ 7.182e-08, 0.91717952341, 942.062061969 ],
    [ 5.482e-08, 1.35541254124, 95.9792272178 ],
    [ 6.754e-08, 3.45186268696, 831.85574075 ],
    [ 4.626e-08, 2.83572146596, 1596.18644228 ],
    [ 4.106e-08, 6.01730779864, 213.299095438 ],
    [ 3.942e-08, 1.19384143223, 1169.58825141 ],
    [ 3.469e-08, 6.10664206989, 405.257549874 ],
    [ 2.861e-08, 2.32367020387, 1155.36115741 ],
    [ 2.519e-08, 0.42500820125, 220.412642439 ],
    [ 2.468e-08, 1.84219414782, 532.872358832 ],
    [ 2.322e-08, 1.57653167974, 2118.76386038 ],
    [ 2.283e-08, 0.13415259559, 632.783739313 ],
    [ 2.243e-08, 1.9175122913, 1073.60902419 ],
    [ 2.285e-08, 5.94194291108, 1162.47470441 ],
    [ 2.137e-08, 1.06953434212, 21.3406410024 ],
    [ 2.515e-08, 0.33520672477, 1272.68102563 ],
    [ 2.042e-08, 5.9277991653, 110.206321219 ],
    [ 1.927e-08, 2.58542297225, 88.865680217 ],
    [ 2.021e-08, 2.2176111383, 433.711737877 ],
    [ 1.943e-08, 1.46376661665, 1258.45393163 ],
    [ 1.7e-08, 1.88459425041, 525.758811831 ],
    [ 1.815e-08, 2.6762655865, 330.618963658 ],
    [ 1.821e-08, 2.75572507789, 721.64941953 ],
    [ 2.068e-08, 3.17049523925, 1148.24761041 ],
    [ 1.866e-08, 2.28678298902, 1361.54670584 ],
    [ 1.526e-08, 4.47646904898, 853.196381752 ],
    [ 1.508e-08, 0.11633951449, 949.17560897 ],
    [ 1.655e-08, 0.44340210808, 533.623118358 ],
    [ 1.572e-08, 0.45863923926, 526.509571357 ],
    [ 1.161e-08, 3.10471097791, 963.402702971 ],
    [ 1.162e-08, 1.19270352887, 1574.84580128 ],
    [ 1.14e-08, 2.4632410666, 846.082834751 ],
    [ 1.259e-08, 1.24988357144, 1038.04128919 ],
    [ 1.396e-08, 0.69581007586, 551.031606097 ],
    [ 1.182e-08, 1.93125671013, 1581.95934828 ],
    [ 8.94e-09, 2.85762385272, 519.396024356 ],
    [ 9.83e-09, 4.17198081351, 2627.11418447 ],
    [ 1.061e-08, 0.66716890315, 539.985905833 ],
    [ 8.59e-09, 4.91931457958, 611.443098311 ],
    [ 9.18e-09, 4.89690742057, 1670.8250285 ],
    [ 8.66e-09, 3.00153408458, 1368.66025285 ],
    [ 1.115e-08, 0.97017156126, 227.52618944 ],
    [ 8.87e-09, 3.68665606145, 824.742193749 ],
    [ 7.37e-09, 3.20041743453, 2125.87740738 ],
    [ 7.3e-09, 2.32845485663, 2317.83586181 ],
    [ 8.28e-09, 1.01037712742, 191.958454436 ],
    [ 7.78e-09, 0.25303611679, 1141.13406341 ],
    [ 7.57e-09, 2.24232615954, 2538.24850425 ],
    [ 7.2e-09, 0.55787809007, 440.825284878 ],
    [ 6.72e-09, 4.17028096565, 1692.1656695 ],
    [ 6.91e-09, 5.78026436421, 1485.98012107 ],
    [ 6.11e-09, 2.66934999696, 1265.56747863 ],
    [ 5.92e-09, 2.26781665598, 1471.75302706 ],
    [ 5.61e-09, 6.11300561068, 1279.79457263 ],
    [ 5.66e-09, 1.93294355027, 2634.22773147 ],
    [ 5.45e-09, 2.21244108948, 1062.56332393 ],
    [ 6.4e-09, 2.47352731748, 1699.2792165 ],
    [ 6.94e-09, 4.71564977334, 750.103607533 ],
    [ 6.04e-09, 1.97421641416, 1677.9385755 ],
    [ 5.01e-09, 2.45269887786, 81.7521332162 ],
    [ 5.52e-09, 4.37775459043, 1382.88734685 ],
    [ 5.56e-09, 5.31872445991, 2413.81508903 ],
    [ 5.89e-09, 0.19759573714, 10.2949407385 ],
    [ 4.97e-09, 2.52744546318, 2207.6295406 ],
    [ 4.16e-09, 6.19072120624, 934.948514968 ],
    [ 4.33e-09, 5.80559659477, 1478.86657406 ],
    [ 3.95e-09, 2.34556406839, 295.051228654 ]
];

KMG.VSOPTerms.jupiter_R4 = [
    [ 1.28623e-06, 0.08347608895, 536.804512095 ],
    [ 1.13458e-06, 4.2481893818, 529.690965095 ],
    [ 8.2704e-07, 3.29801136583, 522.577418094 ],
    [ 3.7897e-07, 2.7340266556, 515.463871093 ],
    [ 2.6713e-07, 5.68996992467, 7.1135470008 ],
    [ 1.7808e-07, 5.40366594364, 1059.38193019 ],
    [ 1.2564e-07, 6.00543529469, 543.918059096 ],
    [ 9.272e-08, 0.75619260404, 1066.49547719 ],
    [ 8.141e-08, 5.68230705037, 14.2270940016 ],
    [ 6.174e-08, 5.10190413726, 639.897286314 ],
    [ 6.92e-08, 1.42214334807, 412.371096874 ],
    [ 5.327e-08, 3.33829390777, 625.670192312 ],
    [ 2.895e-08, 3.38407751603, 1052.26838319 ],
    [ 2.696e-08, 4.18310762577, 728.762966531 ],
    [ 2.435e-08, 2.96139551556, 426.598190876 ],
    [ 2.176e-08, 6.21232313303, 1589.07289528 ],
    [ 2.008e-08, 3.13891134942, 1045.15483619 ],
    [ 1.817e-08, 2.74670205576, 206.185548437 ],
    [ 1.883e-08, 1.87835568033, 419.484643875 ],
    [ 1.501e-08, 1.26929907808, 1596.18644228 ],
    [ 1.701e-08, 2.5890147944, 199.072001436 ],
    [ 1.689e-08, 0, 0 ],
    [ 1.148e-08, 5.18914327333, 831.85574075 ],
    [ 1.033e-08, 5.3570223871, 220.412642439 ],
    [ 8.74e-09, 5.79483644819, 1169.58825141 ],
    [ 8.54e-09, 4.55476058022, 956.289155971 ],
    [ 9.13e-09, 1.89622509837, 1148.24761041 ],
    [ 9.49e-09, 0.68597092334, 1361.54670584 ],
    [ 7.88e-09, 1.44319075028, 1272.68102563 ],
    [ 7.74e-09, 3.21426219962, 508.350324092 ],
    [ 9.21e-09, 5.33422516215, 551.031606097 ],
    [ 6.81e-09, 0.44800059149, 1073.60902419 ],
    [ 6.81e-09, 5.21435913114, 21.3406410024 ],
    [ 5.87e-09, 4.57539103016, 110.206321219 ],
    [ 5.78e-09, 1.97098995055, 647.010833315 ],
    [ 5.96e-09, 2.85043907413, 191.958454436 ],
    [ 5.99e-09, 2.43146933611, 117.31986822 ],
    [ 5.44e-09, 0.53039419311, 330.618963658 ],
    [ 5.45e-09, 3.50461220615, 302.164775655 ],
    [ 5.38e-09, 4.22160404735, 88.865680217 ],
    [ 7.57e-09, 2.28818475655, 942.062061969 ],
    [ 5.62e-09, 1.485943786, 3.1813937377 ],
    [ 6.31e-09, 1.83863158533, 10.2949407385 ],
    [ 5.04e-09, 2.08322743695, 103.092774219 ],
    [ 4.62e-09, 0.40130574859, 433.711737877 ]
];

KMG.VSOPTerms.jupiter_R5 = [
    [ 1.1193e-07, 4.74280611863, 536.804512095 ],
    [ 4.288e-08, 5.90497787277, 522.577418094 ],
    [ 2.004e-08, 3.65178377123, 7.1135470008 ],
    [ 2.118e-08, 5.57290745004, 515.463871093 ],
    [ 1.908e-08, 4.29659647286, 543.918059096 ],
    [ 1.534e-08, 5.4637372964, 1066.49547719 ],
    [ 1.596e-08, 4.11045079899, 1059.38193019 ],
    [ 1.301e-08, 3.72955393027, 14.2270940016 ],
    [ 1.033e-08, 4.50671820436, 529.690965095 ]
];












KMG.VSOPTerms.saturn_L0 = [
    [ 0.87401354025, 0, 0 ],
    [ 0.11107659762, 3.96205090159, 213.299095438 ],
    [ 0.01414150957, 4.58581516874, 7.1135470008 ],
    [ 0.00398379389, 0.52112032699, 206.185548437 ],
    [ 0.00350769243, 3.30329907896, 426.598190876 ],
    [ 0.00206816305, 0.24658372002, 103.092774219 ],
    [ 0.000792713, 3.84007056878, 220.412642439 ],
    [ 0.00023990355, 4.66976924553, 110.206321219 ],
    [ 0.00016573588, 0.43719228296, 419.484643875 ],
    [ 0.00014906995, 5.76903183869, 316.391869657 ],
    [ 0.0001582029, 0.93809155235, 632.783739313 ],
    [ 0.00014609559, 1.56518472, 3.9321532631 ],
    [ 0.00013160301, 4.44891291899, 14.2270940016 ],
    [ 0.00015053543, 2.71669915667, 639.897286314 ],
    [ 0.00013005299, 5.98119023644, 11.0457002639 ],
    [ 0.00010725067, 3.12939523827, 202.253395174 ],
    [ 5.863206e-05, 0.23656938524, 529.690965095 ],
    [ 5.227757e-05, 4.20783365759, 3.1813937377 ],
    [ 6.126317e-05, 1.76328667907, 277.034993741 ],
    [ 5.019687e-05, 3.17787728405, 433.711737877 ],
    [ 4.59255e-05, 0.61977744975, 199.072001436 ],
    [ 4.005867e-05, 2.24479718502, 63.7358983034 ],
    [ 2.953796e-05, 0.98280366998, 95.9792272178 ],
    [ 3.87367e-05, 3.22283226966, 138.517496871 ],
    [ 2.461186e-05, 2.03163875071, 735.876513532 ],
    [ 3.269484e-05, 0.77492638211, 949.17560897 ],
    [ 1.758145e-05, 3.2658010994, 522.577418094 ],
    [ 1.640172e-05, 5.5050445305, 846.082834751 ],
    [ 1.391327e-05, 4.02333150505, 323.505416657 ],
    [ 1.580648e-05, 4.37265307169, 309.278322656 ],
    [ 1.123498e-05, 2.83726798446, 415.552490612 ],
    [ 1.017275e-05, 3.71700135395, 227.52618944 ],
    [ 8.48642e-06, 3.1915017083, 209.366942175 ],
    [ 1.087229e-05, 4.1834325756, 2.4476805548 ],
    [ 9.56757e-06, 0.50744342622, 1265.56747863 ],
    [ 7.89205e-06, 5.00745127508, 0.9632078465 ],
    [ 6.86999e-06, 1.74714152638, 1052.26838319 ],
    [ 6.54484e-06, 1.59889329033, 0.0481841098 ],
    [ 7.48819e-06, 2.14396789786, 853.196381752 ],
    [ 6.33982e-06, 2.29887419204, 412.371096874 ],
    [ 7.43599e-06, 5.25277685028, 224.344795702 ],
    [ 8.52677e-06, 3.42141279787, 175.1660598 ],
    [ 5.79844e-06, 3.09254750266, 74.7815985673 ],
    [ 6.24883e-06, 0.9704808751, 210.1177017 ],
    [ 5.29874e-06, 4.44938991187, 117.31986822 ],
    [ 5.42648e-06, 1.51824981131, 9.5612275556 ],
    [ 4.74277e-06, 5.47526482059, 742.990060533 ],
    [ 4.48547e-06, 1.28991363969, 127.471796607 ],
    [ 5.46365e-06, 2.12677911914, 350.3321196 ],
    [ 4.78044e-06, 2.96486700885, 137.033024162 ],
    [ 3.54988e-06, 3.01280169452, 838.96928775 ],
    [ 4.51857e-06, 1.04437293342, 490.334089179 ],
    [ 3.47422e-06, 1.53923267387, 340.770892045 ],
    [ 3.43481e-06, 0.24603836481, 0.5212648618 ],
    [ 3.09029e-06, 3.49491017725, 216.480489176 ],
    [ 3.22189e-06, 0.96136528867, 203.737867882 ],
    [ 3.72318e-06, 2.27822895353, 217.231248701 ],
    [ 3.21562e-06, 2.57185176731, 647.010833315 ],
    [ 3.30197e-06, 0.24721738903, 1581.95934828 ],
    [ 2.49142e-06, 1.47004230445, 1368.66025285 ],
    [ 2.86703e-06, 2.37046001635, 351.816592309 ],
    [ 2.20225e-06, 4.20421716654, 200.768922466 ],
    [ 2.77774e-06, 0.40024010033, 211.81462273 ],
    [ 2.0452e-06, 6.01073368945, 265.989293477 ],
    [ 2.07645e-06, 0.48344140678, 1162.47470441 ],
    [ 2.0865e-06, 1.34533476508, 625.670192312 ],
    [ 1.82459e-06, 5.49122412646, 2.9207613068 ],
    [ 2.26601e-06, 4.90997278296, 12.5301729722 ],
    [ 2.07666e-06, 1.28298038875, 39.3568759152 ],
    [ 1.73914e-06, 1.86305647242, 0.7507595254 ],
    [ 1.84698e-06, 3.50349102817, 149.563197135 ],
    [ 1.83509e-06, 0.97260974474, 4.192785694 ],
    [ 1.46074e-06, 6.23107926975, 195.139848173 ],
    [ 1.64541e-06, 0.44004693949, 5.4166259714 ],
    [ 1.47544e-06, 1.53530368067, 5.6290742925 ],
    [ 1.3969e-06, 4.29463428594, 21.3406410024 ],
    [ 1.31292e-06, 4.06829024226, 10.2949407385 ],
    [ 1.17326e-06, 2.67913173095, 1155.36115741 ],
    [ 1.49302e-06, 5.73592320434, 52.6901980395 ],
    [ 1.22371e-06, 1.97585460706, 4.665866446 ],
    [ 1.13737e-06, 5.59421876022, 1059.38193019 ],
    [ 1.02689e-06, 1.19754453191, 1685.0521225 ],
    [ 1.18169e-06, 5.34072820318, 554.069987483 ],
    [ 1.09287e-06, 3.43808188855, 536.804512095 ],
    [ 1.104e-06, 0.16605133194, 1.4844727083 ],
    [ 1.2498e-06, 6.27738701225, 1898.35121794 ],
    [ 8.9916e-07, 5.80394843417, 114.138474483 ],
    [ 1.03968e-06, 2.19185625957, 88.865680217 ],
    [ 1.1243e-06, 1.10510750315, 191.20769491 ],
    [ 1.06578e-06, 4.01153470635, 956.289155971 ],
    [ 9.1425e-07, 1.87523841598, 38.1330356378 ],
    [ 8.3763e-07, 5.48810655641, 0.1118745846 ],
    [ 8.3489e-07, 2.28927138986, 628.85158605 ],
    [ 9.6973e-07, 4.53662541679, 302.164775655 ],
    [ 1.00634e-06, 4.96513420321, 269.921446741 ],
    [ 7.5496e-07, 2.18005762811, 728.762966531 ],
    [ 9.633e-07, 2.83319249226, 275.550521033 ],
    [ 8.2386e-07, 3.05482650543, 440.825284878 ],
    [ 7.3896e-07, 5.08917637074, 1375.77379985 ],
    [ 7.1625e-07, 5.10946423579, 65.2203710117 ],
    [ 7.0386e-07, 4.86846451411, 0.2124483211 ],
    [ 6.976e-07, 3.71027033119, 14.977853527 ],
    [ 8.8771e-07, 3.86334160349, 278.51946645 ],
    [ 6.8092e-07, 0.7343049945, 1478.86657406 ],
    [ 6.6481e-07, 0.02658132849, 70.8494453042 ],
    [ 6.5694e-07, 2.02147100289, 142.449650134 ],
    [ 7.5752e-07, 1.6141342601, 284.148540742 ],
    [ 6.3138e-07, 3.49495099319, 479.288388915 ],
    [ 6.2557e-07, 2.58733971413, 422.666037613 ],
    [ 6.93e-07, 3.44002100885, 515.463871093 ],
    [ 7.901e-07, 4.45159676932, 35.4247226521 ],
    [ 6.3664e-07, 3.3174798019, 62.2514255951 ],
    [ 5.2994e-07, 5.51392725227, 0.2606324309 ],
    [ 5.3017e-07, 3.18475265559, 8.0767548473 ],
    [ 5.4492e-07, 2.45664158976, 22.0914005278 ],
    [ 5.0507e-07, 4.26791628421, 99.1606209555 ],
    [ 5.5159e-07, 0.96792241728, 942.062061969 ],
    [ 4.932e-07, 2.386664758, 1471.75302706 ],
    [ 4.7203e-07, 2.02525393154, 312.199083963 ],
    [ 6.109e-07, 1.50302054623, 210.851414883 ],
    [ 6.0676e-07, 2.68689407241, 388.465155238 ],
    [ 4.5138e-07, 0.93106348303, 2001.44399216 ],
    [ 4.345e-07, 2.52603236088, 288.080694005 ],
    [ 4.2562e-07, 3.81786681717, 330.618963658 ],
    [ 3.9933e-07, 5.71382574413, 408.438943611 ],
    [ 5.0125e-07, 6.0315257085, 2214.7430876 ],
    [ 4.6031e-07, 0.54227917765, 212.335887592 ],
    [ 5.416e-07, 0.78128719345, 191.958454436 ],
    [ 4.7042e-07, 4.59902370789, 437.64389114 ],
    [ 4.2367e-07, 1.9006958138, 430.530344139 ],
    [ 3.9759e-07, 1.63243208156, 1066.49547719 ],
    [ 3.6469e-07, 0.84688120284, 213.347279548 ],
    [ 3.5468e-07, 4.18601929802, 215.746775993 ],
    [ 3.6469e-07, 3.93224996469, 213.250911328 ],
    [ 3.8003e-07, 0.31314052371, 423.416797138 ],
    [ 4.4824e-07, 1.12406079738, 6.1503391543 ],
    [ 3.7902e-07, 1.19795851065, 2.7083129857 ],
    [ 4.3405e-07, 1.3736045557, 563.631215038 ],
    [ 4.3913e-07, 3.93075296633, 525.498179401 ],
    [ 3.4837e-07, 1.01543342379, 203.004154699 ],
    [ 3.1755e-07, 1.69273634405, 0.1600586944 ],
    [ 3.0892e-07, 6.13529793424, 417.03696332 ],
    [ 3.6407e-07, 6.00604303567, 18.1592472647 ],
    [ 2.9157e-07, 1.19375828579, 404.506790348 ],
    [ 3.2811e-07, 0.53654765923, 107.024927482 ],
    [ 3.0461e-07, 0.72314414241, 222.860322994 ],
    [ 3.2668e-07, 0.81193242653, 1795.25844372 ],
    [ 3.7741e-07, 3.69667138462, 1272.68102563 ],
    [ 2.7679e-07, 1.4566396812, 7.1617311106 ],
    [ 2.7165e-07, 1.89600219634, 1045.15483619 ],
    [ 3.7836e-07, 4.51945172068, 24.3790223882 ],
    [ 3.5003e-07, 4.46092370686, 214.262303285 ],
    [ 3.2661e-07, 0.6634774319, 692.587484354 ],
    [ 3.0436e-07, 5.30241022019, 33.9402499438 ],
    [ 2.7579e-07, 6.22702209204, 1.2720243872 ],
    [ 2.6658e-07, 4.56713174166, 7.065362891 ],
    [ 3.1745e-07, 5.49844823318, 56.6223513026 ],
    [ 2.8153e-07, 5.64388600762, 128.956269315 ],
    [ 2.4275e-07, 3.93953220869, 414.068017904 ],
    [ 3.2024e-07, 5.22237631301, 92.0470739547 ],
    [ 2.3059e-07, 3.66034194445, 207.670021145 ],
    [ 2.6975e-07, 0.06644184255, 205.222340591 ],
    [ 3.1825e-07, 5.59208218558, 6069.77675455 ],
    [ 2.3153e-07, 2.10053945, 1788.14489672 ],
    [ 3.104e-07, 0.37144696566, 703.633184617 ],
    [ 2.9384e-07, 0.14749408878, 131.40394987 ],
    [ 2.2551e-07, 5.2399478021, 212.777830576 ],
    [ 2.6183e-07, 5.41312719168, 140.001969579 ],
    [ 2.5779e-07, 4.36084632109, 32.2433289144 ],
    [ 2.0659e-07, 0.67095777002, 2317.83586181 ],
    [ 2.0362e-07, 2.82404200673, 429.779584614 ],
    [ 2.4404e-07, 3.08826377429, 145.631043871 ],
    [ 2.3748e-07, 2.54374565817, 76.2660712756 ],
    [ 2.0112e-07, 5.05984887501, 617.805885786 ],
    [ 2.3302e-07, 3.97332549746, 483.220542179 ],
    [ 2.2878e-07, 6.10447953656, 177.874372786 ],
    [ 2.2984e-07, 3.20182261633, 208.633228992 ],
    [ 2.0638e-07, 5.22127912054, 6.592282139 ],
    [ 2.1419e-07, 0.71923264007, 1258.45393163 ]
    // 179 terms retained
];

KMG.VSOPTerms.saturn_L1 = [
    [ 213.299095217, 0, 0 ],
    [ 0.01297370862, 1.82834923978, 213.299095438 ],
    [ 0.00564345393, 2.88499717272, 7.1135470008 ],
    [ 0.00093734369, 1.06311793502, 426.598190876 ],
    [ 0.00107674962, 2.27769131009, 206.185548437 ],
    [ 0.00040244455, 2.04108104671, 220.412642439 ],
    [ 0.00019941774, 1.2795439047, 103.092774219 ],
    [ 0.00010511678, 2.7488034213, 14.2270940016 ],
    [ 6.416106e-05, 0.38238295041, 639.897286314 ],
    [ 4.848994e-05, 2.43037610229, 419.484643875 ],
    [ 4.056892e-05, 2.92133209468, 110.206321219 ],
    [ 3.768635e-05, 3.6496533078, 3.9321532631 ],
    [ 3.384691e-05, 2.41694503459, 3.1813937377 ],
    [ 3.231693e-05, 1.26149969158, 433.711737877 ],
    [ 3.071405e-05, 2.32739504783, 199.072001436 ],
    [ 1.953179e-05, 3.56378136497, 11.0457002639 ],
    [ 1.249468e-05, 2.62810757084, 95.9792272178 ],
    [ 9.2135e-06, 1.96069472334, 227.52618944 ],
    [ 7.01524e-06, 4.43097553887, 529.690965095 ],
    [ 6.49591e-06, 6.17410622073, 202.253395174 ],
    [ 6.27498e-06, 6.1110981622, 309.278322656 ],
    [ 4.68362e-06, 4.61704486774, 63.7358983034 ],
    [ 4.40442e-06, 6.0186116335, 853.196381752 ],
    [ 4.78347e-06, 4.98809792152, 522.577418094 ],
    [ 4.088e-06, 2.10122200324, 323.505416657 ],
    [ 4.07654e-06, 1.29967965754, 209.366942175 ],
    [ 3.4372e-06, 3.95819456535, 412.371096874 ],
    [ 3.38569e-06, 3.63538109408, 316.391869657 ],
    [ 3.36129e-06, 3.77170200605, 735.876513532 ],
    [ 3.31895e-06, 2.86077271205, 210.1177017 ],
    [ 3.46963e-06, 2.24152661493, 632.783739313 ],
    [ 2.89484e-06, 2.73211009526, 117.31986822 ],
    [ 2.541e-06, 0.54280472223, 647.010833315 ],
    [ 2.30497e-06, 1.64428691304, 216.480489176 ],
    [ 2.8091e-06, 5.74399466555, 2.4476805548 ],
    [ 1.92275e-06, 2.96534476762, 224.344795702 ],
    [ 1.71342e-06, 4.09606536666, 846.082834751 ],
    [ 1.6711e-06, 2.59746814308, 21.3406410024 ],
    [ 1.36321e-06, 2.28588945465, 10.2949407385 ],
    [ 1.29468e-06, 3.4486372972, 742.990060533 ],
    [ 1.27864e-06, 4.09556557491, 217.231248701 ],
    [ 1.09809e-06, 6.16222822735, 415.552490612 ],
    [ 9.3929e-07, 3.48395603528, 1052.26838319 ],
    [ 9.25e-07, 3.94738565799, 88.865680217 ],
    [ 9.7503e-07, 4.72798517062, 838.96928775 ],
    [ 8.5414e-07, 1.21992749767, 440.825284878 ],
    [ 8.3544e-07, 3.11243528672, 625.670192312 ],
    [ 7.7552e-07, 6.24420223771, 302.164775655 ],
    [ 6.1557e-07, 1.82806831206, 195.139848173 ],
    [ 6.1894e-07, 4.29399030957, 127.471796607 ],
    [ 6.71e-07, 0.28960408801, 4.665866446 ],
    [ 5.6935e-07, 5.01850216663, 137.033024162 ],
    [ 5.4018e-07, 5.12526846805, 490.334089179 ],
    [ 5.4588e-07, 0.28394184881, 74.7815985673 ],
    [ 6.5843e-07, 5.64781011841, 9.5612275556 ],
    [ 4.936e-07, 1.44414937308, 536.804512095 ],
    [ 5.779e-07, 2.47591802875, 191.958454436 ],
    [ 4.4445e-07, 2.70867717923, 5.4166259714 ],
    [ 4.6462e-07, 1.17725360336, 149.563197135 ],
    [ 4.0352e-07, 3.88835739308, 728.762966531 ],
    [ 3.7766e-07, 2.53385959344, 12.5301729722 ],
    [ 4.6627e-07, 5.14898441386, 515.463871093 ],
    [ 4.5601e-07, 2.22651202659, 956.289155971 ],
    [ 4.0425e-07, 0.41248570335, 269.921446741 ],
    [ 3.7318e-07, 3.78007466606, 2.9207613068 ],
    [ 3.3848e-07, 3.21091304755, 1368.66025285 ],
    [ 3.7468e-07, 0.63301847328, 422.666037613 ],
    [ 3.3013e-07, 0.30379634705, 351.816592309 ],
    [ 3.0286e-07, 2.84006878726, 203.004154699 ],
    [ 3.5096e-07, 6.08465483298, 5.6290742925 ],
    [ 3.3273e-07, 4.640252073, 277.034993741 ],
    [ 3.1908e-07, 4.38588051077, 1155.36115741 ],
    [ 2.9011e-07, 3.38845528142, 1059.38193019 ],
    [ 2.8659e-07, 2.0211899083, 330.618963658 ],
    [ 2.9347e-07, 5.41549054397, 1066.49547719 ],
    [ 2.8266e-07, 2.74211823281, 265.989293477 ],
    [ 3.0064e-07, 6.18691482959, 284.148540742 ],
    [ 3.1444e-07, 2.43486054228, 52.6901980395 ],
    [ 2.6507e-07, 4.51149190693, 340.770892045 ],
    [ 2.2023e-07, 5.14128268104, 4.192785694 ],
    [ 2.2201e-07, 1.96451679625, 203.737867882 ],
    [ 2.1711e-07, 2.67663515039, 942.062061969 ],
    [ 2.2573e-07, 5.88439455151, 210.851414883 ],
    [ 1.9449e-07, 4.76522617576, 70.8494453042 ],
    [ 1.926e-07, 2.30000060917, 437.64389114 ],
    [ 1.9467e-07, 6.1635806985, 860.309928753 ],
    [ 1.9308e-07, 4.10055638793, 18.1592472647 ],
    [ 2.2756e-07, 4.13890496693, 191.20769491 ],
    [ 1.7772e-07, 2.43993724475, 423.416797138 ],
    [ 1.7625e-07, 1.84879760332, 234.63973644 ],
    [ 1.7917e-07, 0.90281001853, 429.779584614 ],
    [ 1.539e-07, 4.2343555618, 1162.47470441 ],
    [ 1.4518e-07, 3.60447992897, 1045.15483619 ],
    [ 1.4098e-07, 2.94108637859, 1685.0521225 ],
    [ 1.6365e-07, 4.04772986282, 949.17560897 ],
    [ 1.3351e-07, 6.24525394105, 38.1330356378 ],
    [ 1.5958e-07, 1.06504854837, 56.6223513026 ],
    [ 1.4066e-07, 1.43547760486, 408.438943611 ],
    [ 1.5765e-07, 5.59418374906, 6.1503391543 ],
    [ 1.3047e-07, 5.75713536656, 138.517496871 ],
    [ 1.4963e-07, 5.77194144042, 22.0914005278 ],
    [ 1.591e-07, 1.93236196007, 1272.68102563 ],
    [ 1.2859e-07, 4.24850891703, 405.257549874 ],
    [ 1.3585e-07, 4.09378444821, 1471.75302706 ],
    [ 1.5186e-07, 0.74349230082, 200.768922466 ],
    [ 1.6343e-07, 5.95883716209, 628.85158605 ],
    [ 1.0876e-07, 1.54843099228, 223.594036176 ],
    [ 1.2178e-07, 1.86122230918, 131.40394987 ],
    [ 1.1698e-07, 1.80956732786, 124.433415221 ],
    [ 1.0205e-07, 3.46772102734, 1375.77379985 ],
    [ 1.0113e-07, 2.38081573177, 107.024927482 ],
    [ 9.801e-08, 2.55376042251, 99.9113804809 ],
    [ 1.0569e-07, 5.35748271313, 215.746775993 ],
    [ 1.2078e-07, 4.84566679178, 831.85574075 ],
    [ 9.282e-08, 3.90397999336, 430.530344139 ],
    [ 1.0209e-07, 6.07702154705, 32.2433289144 ],
    [ 9.247e-08, 3.65397916243, 142.449650134 ],
    [ 9.333e-08, 5.8116812666, 7.1617311106 ],
    [ 8.973e-08, 1.23896814586, 106.274167956 ],
    [ 9.584e-08, 1.38807709012, 145.631043871 ],
    [ 8.092e-08, 4.41109592718, 703.633184617 ],
    [ 8.37e-08, 5.64021200149, 62.2514255951 ],
    [ 8.365e-08, 2.42756208502, 1258.45393163 ],
    [ 7.625e-08, 3.75230513033, 312.199083963 ],
    [ 7.507e-08, 0.52825397746, 654.124380316 ],
    [ 7.222e-08, 0.28432332038, 0.7507595254 ],
    [ 8.219e-08, 6.22089296322, 14.977853527 ],
    [ 7.047e-08, 0.53162328102, 388.465155238 ],
    [ 6.575e-08, 3.48594056852, 35.4247226521 ],
    [ 9.019e-08, 4.94930308863, 208.633228992 ],
    [ 6.422e-08, 3.32913886531, 1361.54670584 ],
    [ 8.828e-08, 0.08576921133, 288.080694005 ],
    [ 6.468e-08, 2.89346190385, 114.138474483 ],
    [ 6.244e-08, 0.54959845938, 65.2203710117 ],
    [ 6.147e-08, 2.67701859857, 2001.44399216 ],
    [ 6.729e-08, 0.23473166872, 8.0767548473 ],
    [ 7.33e-08, 4.85397668762, 222.860322994 ],
    [ 6.306e-08, 3.80609816761, 1788.14489672 ],
    [ 5.794e-08, 4.39110470067, 81.7521332162 ],
    [ 6.114e-08, 0.88426580807, 92.0470739547 ],
    [ 6.916e-08, 2.04730284282, 99.1606209555 ],
    [ 5.224e-08, 5.49152647879, 563.631215038 ],
    [ 6.227e-08, 1.60545827612, 1589.07289528 ],
    [ 5.156e-08, 2.11913652877, 214.262303285 ],
    [ 6.641e-08, 5.82592142759, 483.220542179 ],
    [ 4.96e-08, 5.75655227165, 565.115687747 ],
    [ 4.949e-08, 0.41506756602, 76.2660712756 ],
    [ 5.284e-08, 4.5806449086, 134.585343608 ],
    [ 4.983e-08, 4.20110843598, 404.506790348 ],
    [ 5.143e-08, 4.67534992519, 212.335887592 ],
    [ 4.733e-08, 4.59040852304, 554.069987483 ],
    [ 4.551e-08, 3.24564999051, 231.458342703 ],
    [ 5.149e-08, 3.3357437859, 1.4844727083 ],
    [ 4.646e-08, 5.79841221351, 217.964961884 ],
    [ 4.468e-08, 0.12007438852, 295.051228654 ],
    [ 4.609e-08, 0.45274542243, 362.862292573 ],
    [ 4.476e-08, 5.37754871729, 497.44763618 ],
    [ 4.962e-08, 3.77054763448, 1265.56747863 ],
    [ 4.209e-08, 4.88259084305, 98.8999885246 ],
    [ 4.24e-08, 5.00130451925, 213.347279548 ],
    [ 4.739e-08, 4.53295409208, 1148.24761041 ],
    [ 5.056e-08, 2.20279742533, 207.882469467 ],
    [ 3.647e-08, 0.55692708637, 750.103607533 ],
    [ 3.59e-08, 1.83316476388, 225.82926841 ],
    [ 3.553e-08, 0.35405996436, 333.657345044 ],
    [ 3.771e-08, 0.98541172336, 24.3790223882 ],
    [ 3.643e-08, 1.6134963491, 245.542424352 ],
    [ 3.416e-08, 2.19565598832, 1574.84580128 ],
    [ 3.326e-08, 5.32536836657, 347.884439046 ],
    [ 3.648e-08, 0.80545608428, 343.2185726 ],
    [ 3.23e-08, 0.21797740452, 635.965133051 ],
    [ 4.252e-08, 1.8025133313, 213.250911328 ],
    [ 3.11e-08, 3.03951432197, 1677.9385755 ],
    [ 3.692e-08, 0.81899526461, 344.703045308 ],
    [ 3.007e-08, 3.35935547424, 7.8643065262 ],
    [ 2.905e-08, 1.33932275244, 543.918059096 ],
    [ 2.952e-08, 4.87373800642, 144.146571163 ],
    [ 2.765e-08, 2.42541766183, 2317.83586181 ],
    [ 3.051e-08, 4.3098992779, 6062.66320755 ],
    [ 3.636e-08, 5.12822987131, 218.928169731 ],
    [ 2.96e-08, 3.53539509519, 2104.53676638 ],
    [ 3.22e-08, 2.88065191084, 216.219856745 ],
    [ 2.89e-08, 5.73415956875, 9992.87290377 ],
    [ 2.581e-08, 3.79872579706, 17.2654753874 ],
    [ 3.497e-08, 5.29659047575, 350.3321196 ],
    [ 2.852e-08, 3.72852216251, 6076.89030155 ],
    [ 2.825e-08, 2.5435487903, 1692.1656695 ],
    [ 2.775e-08, 0.23409308831, 357.445666601 ],
    [ 2.964e-08, 2.48786690434, 46.470422916 ],
    [ 2.494e-08, 4.3775623453, 217.491881132 ],
    [ 2.434e-08, 0.74936808231, 414.068017904 ],
    [ 2.711e-08, 5.15376962514, 10007.0999978 ],
    [ 3.124e-08, 1.92045529107, 17.4084877393 ],
    [ 3.11e-08, 1.71435795236, 1169.58825141 ],
    [ 2.683e-08, 3.44460235259, 31.019488637 ],
    [ 3.07e-08, 0.27064671367, 120.358249606 ],
    [ 2.498e-08, 0.89152242639, 479.288388915 ],
    [ 2.239e-08, 3.76466001926, 425.113718168 ],
    [ 2.492e-08, 2.10872471949, 168.052512799 ],
    [ 2.554e-08, 1.63237286968, 182.279606801 ],
    [ 2.212e-08, 3.15570115956, 212.777830576 ],
    [ 2.345e-08, 2.33187767722, 218.715721409 ],
    [ 2.512e-08, 4.52214797332, 198.321241911 ],
    [ 2.058e-08, 5.32848893146, 125.987323898 ],
    [ 2.67e-08, 5.76962486601, 618.556645312 ],
    [ 2.501e-08, 1.36963027063, 1905.46476494 ],
    [ 2.258e-08, 3.21639296814, 273.102840478 ],
    [ 2.143e-08, 4.82825483897, 1279.79457263 ],
    [ 2.052e-08, 1.27587061572, 14.0146456805 ],
    [ 2.615e-08, 0.71070461113, 85.8272988312 ],
    [ 2.093e-08, 3.39000145617, 160.608897399 ],
    [ 1.983e-08, 0.3957372733, 358.93013931 ],
    [ 2.197e-08, 5.93385162544, 13.3333221243 ],
    [ 1.947e-08, 1.11697571149, 447.938831878 ],
    [ 1.963e-08, 2.32757954485, 28.4541880032 ],
    [ 2.225e-08, 3.64731297942, 213.8203603 ],
    [ 1.993e-08, 1.357548667, 20.6069278195 ],
    [ 1.908e-08, 1.85043929897, 1.2720243872 ],
    [ 1.912e-08, 3.44056631214, 69.1525242748 ],
    [ 1.924e-08, 3.75344898408, 28.3111756513 ],
    [ 2.107e-08, 2.25960904718, 116.426096343 ],
    [ 1.99e-08, 5.04917972011, 424.150510321 ],
    [ 2.242e-08, 4.24915057068, 1464.63948006 ],
    [ 1.837e-08, 5.40613525191, 31.492569389 ],
    [ 1.884e-08, 6.27237464104, 25.1297819136 ],
    [ 1.964e-08, 4.88959404434, 275.550521033 ],
    [ 1.761e-08, 1.55538934409, 650.942986578 ],
    [ 2.289e-08, 4.95949808683, 258.875746477 ],
    [ 1.715e-08, 3.99957963119, 416.303250138 ],
    [ 2.176e-08, 0.00746756006, 0.8937718773 ],
    [ 1.909e-08, 2.59860489663, 329.725191781 ],
    [ 1.677e-08, 0.41818851015, 54.1746707478 ],
    [ 2.113e-08, 2.56576165077, 59.8037450403 ],
    [ 1.91e-08, 2.42712655158, 113.387714957 ]
    // 234 terms retained
];

KMG.VSOPTerms.saturn_L2 = [
    [ 0.0011644133, 1.17988132879, 7.1135470008 ],
    [ 0.00091841837, 0.0732519584, 213.299095438 ],
    [ 0.00036661728, 0, 0 ],
    [ 0.00015274496, 4.06493179167, 206.185548437 ],
    [ 0.00010987259, 5.4447918831, 426.598190876 ],
    [ 0.0001062983, 0.25764306189, 220.412642439 ],
    [ 4.265404e-05, 1.04596041482, 14.2270940016 ],
    [ 1.215447e-05, 2.91866579609, 103.092774219 ],
    [ 1.142595e-05, 4.63711665368, 639.897286314 ],
    [ 1.061494e-05, 5.68896768215, 433.711737877 ],
    [ 1.020102e-05, 0.6336845725, 3.1813937377 ],
    [ 1.044759e-05, 4.04202827818, 199.072001436 ],
    [ 6.48857e-06, 4.33990455509, 419.484643875 ],
    [ 5.4932e-06, 5.57301151406, 3.9321532631 ],
    [ 4.56767e-06, 1.2689684848, 110.206321219 ],
    [ 4.24918e-06, 0.20908786519, 227.52618944 ],
    [ 2.73782e-06, 4.2885706119, 95.9792272178 ],
    [ 1.61533e-06, 1.38145587317, 11.0457002639 ],
    [ 1.29502e-06, 1.56592444783, 309.278322656 ],
    [ 1.08829e-06, 3.89769392463, 853.196381752 ],
    [ 1.00917e-06, 0.89243113369, 21.3406410024 ],
    [ 1.0071e-06, 4.89713543344, 647.010833315 ],
    [ 9.5154e-07, 5.62447011514, 412.371096874 ],
    [ 8.1962e-07, 1.02414352999, 117.31986822 ],
    [ 7.486e-07, 4.76187112999, 210.1177017 ],
    [ 8.2667e-07, 6.05014465562, 216.480489176 ],
    [ 9.55e-07, 2.91469950689, 316.391869657 ],
    [ 6.4191e-07, 0.35066202401, 323.505416657 ],
    [ 8.4889e-07, 5.73495539065, 209.366942175 ],
    [ 6.6442e-07, 0.48307559227, 10.2949407385 ],
    [ 6.7164e-07, 0.45592762644, 522.577418094 ],
    [ 5.3849e-07, 2.71027004601, 529.690965095 ],
    [ 5.2073e-07, 4.77422682479, 632.783739313 ],
    [ 4.4991e-07, 5.69247085773, 440.825284878 ],
    [ 4.5297e-07, 1.66820818508, 202.253395174 ],
    [ 4.2349e-07, 5.70774454577, 88.865680217 ],
    [ 3.205e-07, 0.06977561095, 63.7358983034 ],
    [ 3.1531e-07, 1.67269081492, 302.164775655 ],
    [ 3.116e-07, 4.16289690897, 191.958454436 ],
    [ 2.4709e-07, 5.65552005153, 735.876513532 ],
    [ 2.654e-07, 0.82957323703, 224.344795702 ],
    [ 2.0111e-07, 5.94400958785, 217.231248701 ],
    [ 1.7562e-07, 4.90127107888, 625.670192312 ],
    [ 1.7423e-07, 1.62944882745, 742.990060533 ],
    [ 1.3745e-07, 3.76551606198, 195.139848173 ],
    [ 1.2239e-07, 4.71655885093, 203.004154699 ],
    [ 1.1865e-07, 0.12658169661, 234.63973644 ],
    [ 1.5992e-07, 0.58010406176, 515.463871093 ],
    [ 1.2178e-07, 3.02991813349, 846.082834751 ],
    [ 1.1013e-07, 5.91647084481, 536.804512095 ],
    [ 1.3971e-07, 0.20726957441, 838.96928775 ],
    [ 1.0983e-07, 5.61246766042, 728.762966531 ],
    [ 9.95e-08, 0.24994105562, 330.618963658 ],
    [ 9.192e-08, 4.15737094186, 860.309928753 ],
    [ 9.424e-08, 3.21424196104, 1066.49547719 ],
    [ 9.432e-08, 0.46528491211, 956.289155971 ],
    [ 1.0125e-07, 4.98323117202, 422.666037613 ],
    [ 8.282e-08, 2.1423724836, 269.921446741 ],
    [ 7.182e-08, 5.40492160991, 1052.26838319 ],
    [ 7.53e-08, 5.24653553801, 429.779584614 ],
    [ 6.339e-08, 4.46236888166, 284.148540742 ],
    [ 5.962e-08, 5.41494016179, 149.563197135 ],
    [ 7.482e-08, 4.02606821044, 9.5612275556 ],
    [ 5.72e-08, 4.26530477198, 415.552490612 ],
    [ 6.049e-08, 5.93261878105, 405.257549874 ],
    [ 5.707e-08, 0.0108846996, 124.433415221 ],
    [ 4.736e-08, 2.27408430395, 18.1592472647 ],
    [ 5.605e-08, 6.0218667366, 223.594036176 ],
    [ 4.492e-08, 4.93190106788, 654.124380316 ],
    [ 4.572e-08, 4.41905037462, 942.062061969 ],
    [ 5.619e-08, 0.29640581964, 127.471796607 ],
    [ 5.427e-08, 5.54628097641, 949.17560897 ],
    [ 4.05e-08, 4.70655233568, 74.7815985673 ],
    [ 4.983e-08, 3.20538998582, 277.034993741 ],
    [ 4.231e-08, 2.89079464814, 56.6223513026 ],
    [ 4.064e-08, 5.30594179929, 1045.15483619 ],
    [ 3.949e-08, 3.3080407983, 490.334089179 ],
    [ 3.966e-08, 6.12786433144, 81.7521332162 ],
    [ 3.74e-08, 4.93207109771, 52.6901980395 ],
    [ 4.556e-08, 6.13297205287, 1155.36115741 ],
    [ 3.71e-08, 0.40358664974, 137.033024162 ],
    [ 3.405e-08, 4.28369409738, 99.9113804809 ],
    [ 3.385e-08, 1.58207215076, 1059.38193019 ],
    [ 3.946e-08, 0.36427920856, 12.5301729722 ],
    [ 4.075e-08, 0.29371909541, 831.85574075 ],
    [ 3.337e-08, 0.22680009908, 1272.68102563 ],
    [ 3.645e-08, 0.15608090085, 437.64389114 ],
    [ 2.882e-08, 3.16980253835, 70.8494453042 ],
    [ 2.82e-08, 0.32685718956, 191.20769491 ],
    [ 2.675e-08, 1.8752517315, 295.051228654 ],
    [ 3.593e-08, 4.72358358604, 423.416797138 ],
    [ 2.692e-08, 3.59467219768, 131.40394987 ],
    [ 2.611e-08, 5.15121377007, 1368.66025285 ],
    [ 2.439e-08, 3.90853469376, 210.851414883 ],
    [ 2.46e-08, 1.5850302701, 32.2433289144 ],
    [ 2.37e-08, 4.74096554852, 351.816592309 ],
    [ 2.444e-08, 5.81456271395, 106.274167956 ],
    [ 2.213e-08, 2.05928438838, 6076.89030155 ],
    [ 2.206e-08, 5.98426401448, 6062.66320755 ],
    [ 2.163e-08, 5.95837514288, 145.631043871 ],
    [ 2.748e-08, 3.38304528348, 408.438943611 ],
    [ 2.284e-08, 3.14006785569, 22.0914005278 ],
    [ 2.089e-08, 3.48276343851, 10007.0999978 ],
    [ 2.078e-08, 1.12426049665, 9992.87290377 ],
    [ 2.575e-08, 5.11506203019, 265.989293477 ],
    [ 1.81e-08, 5.03261959505, 1361.54670584 ],
    [ 1.751e-08, 4.12209032177, 107.024927482 ],
    [ 1.757e-08, 4.17277201762, 1258.45393163 ],
    [ 1.917e-08, 4.52092673239, 138.517496871 ],
    [ 1.66e-08, 1.3675970543, 231.458342703 ],
    [ 1.629e-08, 3.76846556637, 628.85158605 ],
    [ 2.073e-08, 5.24889328333, 1265.56747863 ],
    [ 1.908e-08, 5.87241184631, 1471.75302706 ],
    [ 1.491e-08, 0.47137450159, 340.770892045 ],
    [ 1.469e-08, 5.63066479682, 447.938831878 ],
    [ 1.368e-08, 2.9019117936, 215.746775993 ],
    [ 1.387e-08, 5.85935596482, 430.530344139 ],
    [ 1.722e-08, 6.23117770604, 1148.24761041 ],
    [ 1.303e-08, 0.59972315177, 28.4541880032 ],
    [ 1.19e-08, 2.83055605436, 200.768922466 ],
    [ 1.266e-08, 5.78318939698, 543.918059096 ],
    [ 1.159e-08, 3.52473802224, 497.44763618 ],
    [ 1.433e-08, 0.85149270762, 6069.77675455 ],
    [ 1.244e-08, 0.03107328684, 1589.07289528 ],
    [ 1.091e-08, 4.9691226184, 1685.0521225 ],
    [ 9.93e-09, 1.599506621, 1375.77379985 ],
    [ 1.342e-08, 2.27535909191, 9999.98645077 ],
    [ 1.164e-08, 0.71458004021, 508.350324092 ],
    [ 1.054e-08, 1.40406602585, 483.220542179 ],
    [ 1.108e-08, 1.19549464972, 618.556645312 ],
    [ 9.59e-09, 4.2288083422, 288.080694005 ],
    [ 1.031e-08, 1.0892563558, 184.844907435 ],
    [ 9.26e-09, 2.59820818098, 134.585343608 ],
    [ 9.34e-09, 2.43391814989, 222.860322994 ],
    [ 9.35e-09, 2.650043211, 1279.79457263 ],
    [ 9.32e-09, 2.47823744049, 703.633184617 ],
    [ 8.94e-09, 4.52571251065, 38.1330356378 ],
    [ 8.89e-09, 2.26537788507, 1162.47470441 ],
    [ 1.026e-08, 4.88481004083, 750.103607533 ],
    [ 8.61e-09, 4.72556919318, 362.862292573 ],
    [ 9.87e-09, 4.5550804487, 635.965133051 ],
    [ 8.17e-09, 4.78613243939, 1677.9385755 ],
    [ 8.38e-09, 2.22382688806, 333.657345044 ],
    [ 8.18e-09, 5.77611891155, 416.303250138 ],
    [ 7.7e-09, 3.431287848, 1073.60902419 ],
    [ 7.75e-09, 2.51136824078, 343.2185726 ],
    [ 7.34e-09, 2.35308297796, 120.358249606 ],
    [ 8.82e-09, 5.59382134246, 1788.14489672 ],
    [ 7.18e-09, 3.92701610563, 1574.84580128 ],
    [ 7.28e-09, 4.85632864351, 76.2660712756 ],
    [ 6.96e-09, 3.68169796191, 347.884439046 ],
    [ 6.83e-09, 3.73251938537, 203.737867882 ],
    [ 6.68e-09, 2.85405845694, 92.0470739547 ],
    [ 8.46e-09, 5.0061997125, 1581.95934828 ],
    [ 7.14e-09, 5.73513429762, 721.64941953 ],
    [ 6.97e-09, 0.20687083504, 99.1606209555 ],
    [ 6.75e-09, 5.62875135263, 17.2654753874 ],
    [ 8.38e-09, 5.97145881711, 1464.63948006 ],
    [ 6.41e-09, 0.67589597459, 46.470422916 ],
    [ 6.34e-09, 4.84360016292, 357.445666601 ],
    [ 8.13e-09, 0.65010530865, 113.387714957 ],
    [ 7.79e-09, 0.04397099012, 1169.58825141 ],
    [ 6.54e-09, 5.89612648687, 337.732510659 ],
    [ 5.43e-09, 5.07477971244, 388.465155238 ],
    [ 5.34e-09, 1.21443390921, 62.2514255951 ],
    [ 5.3e-09, 5.4507420669, 312.199083963 ],
    [ 5.24e-09, 4.84778928724, 358.93013931 ],
    [ 5.24e-09, 1.53836680827, 195.890607699 ],
    [ 5.98e-09, 0.90807361549, 1692.1656695 ],
    [ 5.21e-09, 3.69000991897, 217.964961884 ],
    [ 6.61e-09, 4.49401694007, 643.078680052 ],
    [ 5.37e-09, 6.17024172829, 182.279606801 ],
    [ 5.39e-09, 0.29923807305, 98.8999885246 ],
    [ 5.04e-09, 3.80940628684, 168.052512799 ],
    [ 4.89e-09, 1.08047606868, 5856.47765912 ],
    [ 5.7e-09, 3.22538390359, 208.633228992 ],
    [ 5.42e-09, 6.00891355828, 1905.46476494 ],
    [ 4.68e-09, 2.50179341284, 9786.68735533 ],
    [ 4.78e-09, 4.69534368607, 2001.44399216 ],
    [ 4.68e-09, 0.6971820243, 258.875746477 ],
    [ 4.56e-09, 3.18302424015, 218.928169731 ],
    [ 5.42e-09, 0.56755755204, 404.506790348 ],
    [ 4.18e-09, 4.81455000162, 636.715892576 ],
    [ 4.05e-09, 3.79642493875, 24.3790223882 ],
    [ 4.28e-09, 0.98881943857, 160.608897399 ],
    [ 3.95e-09, 3.50540272263, 129.919477162 ],
    [ 4.91e-09, 5.25616442245, 436.893131615 ],
    [ 3.95e-09, 0.63866561227, 5849.36411211 ],
    [ 4.01e-09, 3.91645377349, 565.115687747 ],
    [ 3.85e-09, 3.66039075343, 563.631215038 ],
    [ 3.85e-09, 4.21962510029, 867.423475754 ],
    [ 3.95e-09, 0.79256328399, 767.369082921 ],
    [ 3.97e-09, 1.47228787593, 273.102840478 ],
    [ 4.07e-09, 5.47101735998, 1038.04128919 ],
    [ 4.5e-09, 2.16827084832, 561.183534484 ],
    [ 3.71e-09, 2.92289280832, 212.335887592 ],
    [ 4.71e-09, 0.67355945445, 207.882469467 ],
    [ 4.94e-09, 3.69576582281, 350.3321196 ],
    [ 4.45e-09, 2.54960078264, 313.210475919 ],
    [ 4.3e-09, 5.32368128659, 2104.53676638 ],
    [ 3.6e-09, 0.37557163523, 214.262303285 ]
    // 201 terms retained
];

KMG.VSOPTerms.saturn_L3 = [
    [ 0.00016038732, 5.73945573267, 7.1135470008 ],
    [ 4.254737e-05, 4.58877599687, 213.299095438 ],
    [ 1.906379e-05, 4.7607084357, 220.412642439 ],
    [ 1.464959e-05, 5.91328884284, 206.185548437 ],
    [ 1.162062e-05, 5.61974313217, 14.2270940016 ],
    [ 1.044765e-05, 3.57813061587, 426.598190876 ],
    [ 2.36068e-06, 3.85849798708, 433.711737877 ],
    [ 2.37009e-06, 5.76820709729, 199.072001436 ],
    [ 1.65645e-06, 5.11642167451, 3.1813937377 ],
    [ 1.31328e-06, 4.74306126145, 227.52618944 ],
    [ 1.50882e-06, 2.72695802283, 639.897286314 ],
    [ 6.1607e-07, 4.74260728276, 103.092774219 ],
    [ 6.3899e-07, 0.08672623762, 419.484643875 ],
    [ 4.0405e-07, 5.47280316518, 21.3406410024 ],
    [ 4.0222e-07, 5.96343977224, 95.9792272178 ],
    [ 3.8807e-07, 5.83309187434, 110.206321219 ],
    [ 2.6949e-07, 3.00877360899, 647.010833315 ],
    [ 2.5017e-07, 0.98675576491, 3.9321532631 ],
    [ 3.2692e-07, 3.14159265359, 0 ],
    [ 1.8051e-07, 1.021817946, 412.371096874 ],
    [ 1.7831e-07, 3.32039911376, 309.278322656 ],
    [ 1.5894e-07, 3.89729495217, 440.825284878 ],
    [ 1.5768e-07, 5.61263410328, 117.31986822 ],
    [ 1.8212e-07, 4.96397771331, 10.2949407385 ],
    [ 1.8497e-07, 1.9253436571, 853.196381752 ],
    [ 1.2927e-07, 1.17950837478, 88.865680217 ],
    [ 1.7889e-07, 4.20422746039, 216.480489176 ],
    [ 1.144e-07, 5.57587131751, 11.0457002639 ],
    [ 1.0554e-07, 5.92710883673, 191.958454436 ],
    [ 1.0432e-07, 3.95667199114, 209.366942175 ],
    [ 8.655e-08, 3.39231823414, 302.164775655 ],
    [ 7.523e-08, 4.87915941795, 323.505416657 ],
    [ 5.871e-08, 1.0570339306, 210.1177017 ],
    [ 5.349e-08, 4.63664712061, 234.63973644 ],
    [ 4.986e-08, 0.17277280741, 632.783739313 ],
    [ 6.3e-08, 2.25329355289, 522.577418094 ],
    [ 3.608e-08, 2.30889061812, 515.463871093 ],
    [ 2.933e-08, 2.21148312356, 860.309928753 ],
    [ 2.572e-08, 0.41973213333, 625.670192312 ],
    [ 2.479e-08, 4.94903388247, 224.344795702 ],
    [ 2.175e-08, 3.16635787015, 202.253395174 ],
    [ 2.368e-08, 4.75945968289, 330.618963658 ],
    [ 2.705e-08, 0.65007424536, 529.690965095 ],
    [ 1.981e-08, 4.38259974938, 124.433415221 ],
    [ 2.151e-08, 1.35777052319, 405.257549874 ],
    [ 2.05e-08, 1.03766221834, 728.762966531 ],
    [ 2.129e-08, 3.34889649076, 429.779584614 ],
    [ 1.804e-08, 3.08896387579, 654.124380316 ],
    [ 1.794e-08, 3.09524789608, 422.666037613 ],
    [ 1.767e-08, 4.12428069333, 536.804512095 ],
    [ 2.036e-08, 4.14778460181, 223.594036176 ],
    [ 1.522e-08, 0.30568508593, 316.391869657 ],
    [ 2.003e-08, 1.19811189628, 1066.49547719 ],
    [ 1.824e-08, 5.82606735563, 195.139848173 ],
    [ 1.672e-08, 6.05450203591, 742.990060533 ],
    [ 1.374e-08, 5.00478301043, 956.289155971 ],
    [ 1.33e-08, 3.91860861475, 269.921446741 ],
    [ 1.448e-08, 1.57683663501, 81.7521332162 ],
    [ 1.282e-08, 1.641726276, 63.7358983034 ],
    [ 1.53e-08, 2.07185037631, 838.96928775 ],
    [ 1.023e-08, 3.72829174293, 295.051228654 ],
    [ 1.252e-08, 2.40431685132, 217.231248701 ],
    [ 1.325e-08, 1.4316872847, 735.876513532 ],
    [ 9.41e-09, 2.77748068918, 284.148540742 ],
    [ 8.03e-09, 4.71988196699, 56.6223513026 ],
    [ 9.48e-09, 2.0311671158, 831.85574075 ],
    [ 8.31e-09, 0.74562303148, 846.082834751 ],
    [ 8.42e-09, 3.3317537692, 18.1592472647 ],
    [ 8.24e-09, 0.80001123001, 1045.15483619 ],
    [ 8.57e-09, 2.39067793598, 203.004154699 ],
    [ 7.38e-09, 3.80960374631, 447.938831878 ],
    [ 5.84e-09, 6.25069777652, 942.062061969 ],
    [ 5.38e-09, 2.86495331128, 184.844907435 ],
    [ 5.05e-09, 6.25643434939, 1059.38193019 ],
    [ 6.26e-09, 1.55608850413, 423.416797138 ],
    [ 4.85e-09, 3.46793365763, 149.563197135 ],
    [ 4.84e-09, 4.87301938477, 1272.68102563 ],
    [ 4.33e-09, 2.70775591374, 508.350324092 ],
    [ 4.38e-09, 4.22151675617, 437.64389114 ],
    [ 4.35e-09, 5.39766982546, 408.438943611 ],
    [ 3.52e-09, 0.59786545468, 22.0914005278 ],
    [ 3.67e-09, 1.22439337201, 2324.94940882 ],
    [ 4.38e-09, 1.71625572063, 1155.36115741 ],
    [ 3.74e-09, 1.18586297651, 721.64941953 ],
    [ 3.1e-09, 2.42135657973, 127.471796607 ],
    [ 3.09e-09, 0.33610530663, 6076.89030155 ],
    [ 3.09e-09, 1.42279282226, 6062.66320755 ],
    [ 3.05e-09, 5.34819286072, 131.40394987 ],
    [ 3.33e-09, 1.84641267165, 1141.13406341 ],
    [ 3.58e-09, 0.68499202426, 1361.54670584 ],
    [ 2.93e-09, 2.1908688296, 416.303250138 ],
    [ 3.37e-09, 3.2900154507, 750.103607533 ],
    [ 2.93e-09, 2.28323305517, 635.965133051 ],
    [ 3.73e-09, 1.10446940352, 1052.26838319 ],
    [ 3.13e-09, 1.86587122616, 1148.24761041 ],
    [ 2.58e-09, 3.31118509824, 618.556645312 ],
    [ 2.58e-09, 2.56646226279, 415.552490612 ]
    // 97 terms retained
];

KMG.VSOPTerms.saturn_L4 = [
    [ 1.661877e-05, 3.99824447634, 7.1135470008 ],
    [ 2.57094e-06, 2.98422287887, 220.412642439 ],
    [ 2.36328e-06, 3.9024884432, 14.2270940016 ],
    [ 1.4952e-06, 2.73191135434, 213.299095438 ],
    [ 1.09412e-06, 1.51564560686, 206.185548437 ],
    [ 6.9119e-07, 1.74804093636, 426.598190876 ],
    [ 3.768e-07, 1.23800346661, 199.072001436 ],
    [ 3.9678e-07, 2.04527339062, 433.711737877 ],
    [ 3.1172e-07, 3.01055217526, 227.52618944 ],
    [ 1.5026e-07, 0.83249780616, 639.897286314 ],
    [ 9.424e-08, 3.71267465225, 21.3406410024 ],
    [ 5.131e-08, 2.14278851183, 419.484643875 ],
    [ 4.379e-08, 1.44314873951, 95.9792272178 ],
    [ 5.391e-08, 1.15849076251, 647.010833315 ],
    [ 4.315e-08, 2.11844568875, 440.825284878 ],
    [ 3.215e-08, 4.10085180982, 110.206321219 ],
    [ 2.866e-08, 3.036049512, 88.865680217 ],
    [ 2.825e-08, 2.76965112625, 412.371096874 ],
    [ 2.584e-08, 6.2804703528, 853.196381752 ],
    [ 2.616e-08, 0.38576038218, 103.092774219 ],
    [ 1.872e-08, 5.13517095425, 309.278322656 ],
    [ 2.21e-08, 3.77003162591, 117.31986822 ],
    [ 1.772e-08, 5.18511152518, 302.164775655 ],
    [ 1.832e-08, 2.8429204789, 234.63973644 ],
    [ 1.759e-08, 2.26487572601, 216.480489176 ],
    [ 1.193e-08, 1.54874757981, 191.958454436 ],
    [ 7.65e-09, 4.76897987642, 210.1177017 ],
    [ 6.44e-09, 4.21681516017, 515.463871093 ],
    [ 6.19e-09, 4.0485658098, 522.577418094 ],
    [ 6.19e-09, 2.37595244026, 209.366942175 ],
    [ 6.11e-09, 3.14631600944, 323.505416657 ],
    [ 5.6e-09, 2.17190605203, 124.433415221 ],
    [ 5.19e-09, 3.2053999088, 405.257549874 ],
    [ 4.43e-09, 0.25912890713, 860.309928753 ]
    // 34 terms retained
];

KMG.VSOPTerms.saturn_L5 = [
    [ 1.23607e-06, 2.25923420203, 7.1135470008 ],
    [ 3.4176e-07, 2.16278773143, 14.2270940016 ],
    [ 2.7539e-07, 1.19822164604, 220.412642439 ],
    [ 5.763e-08, 1.21171444884, 227.52618944 ],
    [ 5.284e-08, 0.23520891295, 433.711737877 ],
    [ 3.65e-08, 6.20014021207, 426.598190876 ],
    [ 3.061e-08, 2.96839870592, 199.072001436 ],
    [ 2.865e-08, 4.29470838129, 206.185548437 ],
    [ 1.499e-08, 6.21044685389, 213.299095438 ],
    [ 1.262e-08, 5.25209851911, 639.897286314 ],
    [ 7.56e-09, 6.17670364645, 191.958454436 ],
    [ 7.59e-09, 0.69127092329, 302.164775655 ],
    [ 8.2e-09, 5.59433772118, 647.010833315 ],
    [ 9.42e-09, 0.24584020543, 440.825284878 ],
    [ 5.47e-09, 4.87451203466, 88.865680217 ],
    [ 5.03e-09, 4.63319665449, 419.484643875 ],
    [ 3.57e-09, 4.73247835262, 860.309928753 ],
    [ 3.43e-09, 5.70825898673, 654.124380316 ],
    [ 2.43e-09, 2.03429529667, 323.505416657 ],
    [ 3.05e-09, 1.06249794404, 234.63973644 ],
    [ 2.31e-09, 4.36065387404, 853.196381752 ],
    [ 2.32e-09, 0.84968053738, 309.278322656 ],
    [ 2.39e-09, 0.65475141729, 117.31986822 ],
    [ 1.67e-09, 5.240620732, 405.257549874 ],
    [ 1.65e-09, 2.4145655156, 515.463871093 ],
    [ 1.55e-09, 1.75303344154, 412.371096874 ],
    [ 1.18e-09, 4.41706591175, 632.783739313 ]
    // 27 terms retained
];

KMG.VSOPTerms.saturn_B0 = [
    [ 0.04330678039, 3.60284428399, 213.299095438 ],
    [ 0.00240348302, 2.85238489373, 426.598190876 ],
    [ 0.00084745939, 0, 0 ],
    [ 0.00030863357, 3.48441504555, 220.412642439 ],
    [ 0.00034116062, 0.57297307557, 206.185548437 ],
    [ 0.0001473407, 2.11846596715, 639.897286314 ],
    [ 9.916667e-05, 5.79003188904, 419.484643875 ],
    [ 6.993564e-05, 4.7360468972, 7.1135470008 ],
    [ 4.807588e-05, 5.43305312061, 316.391869657 ],
    [ 4.788392e-05, 4.96512926584, 110.206321219 ],
    [ 3.432125e-05, 2.732557466, 433.711737877 ],
    [ 1.506129e-05, 6.01304519391, 103.092774219 ],
    [ 1.060298e-05, 5.6309929646, 529.690965095 ],
    [ 9.69071e-06, 5.20434966293, 632.783739313 ],
    [ 9.4205e-06, 1.39646688872, 853.196381752 ],
    [ 7.07645e-06, 3.80302289005, 323.505416657 ],
    [ 5.52314e-06, 5.13149119536, 202.253395174 ],
    [ 3.99674e-06, 3.35891409671, 227.52618944 ],
    [ 3.16063e-06, 1.99716693551, 647.010833315 ],
    [ 3.1938e-06, 3.62571687438, 209.366942175 ],
    [ 2.84495e-06, 4.88648507126, 224.344795702 ],
    [ 3.14224e-06, 0.46510248959, 217.231248701 ],
    [ 2.36441e-06, 2.13887684631, 11.0457002639 ],
    [ 2.15354e-06, 5.9498256102, 846.082834751 ],
    [ 2.08523e-06, 2.12003937634, 415.552490612 ],
    [ 1.78958e-06, 2.95361337281, 63.7358983034 ],
    [ 2.07214e-06, 0.73021353207, 199.072001436 ],
    [ 1.3914e-06, 1.99821987827, 735.876513532 ],
    [ 1.34884e-06, 5.24501026174, 742.990060533 ],
    [ 1.40585e-06, 0.64417933116, 490.334089179 ],
    [ 1.21669e-06, 3.11537142395, 522.577418094 ],
    [ 1.3924e-06, 4.59535592976, 14.2270940016 ],
    [ 1.15525e-06, 3.1089202092, 216.480489176 ],
    [ 1.14218e-06, 0.96262037933, 210.1177017 ],
    [ 9.6377e-07, 4.48164269503, 117.31986822 ],
    [ 8.0594e-07, 1.31693242934, 277.034993741 ],
    [ 7.2953e-07, 3.05987977572, 536.804512095 ],
    [ 6.9261e-07, 4.92378376874, 309.278322656 ],
    [ 7.4302e-07, 2.89377583784, 149.563197135 ],
    [ 6.8041e-07, 2.1800128871, 351.816592309 ],
    [ 6.1733e-07, 0.67727575242, 1066.49547719 ],
    [ 5.6598e-07, 2.6096247711, 440.825284878 ],
    [ 4.8864e-07, 5.78725829726, 95.9792272178 ],
    [ 4.8242e-07, 2.18211814462, 74.7815985673 ],
    [ 3.8304e-07, 5.29151507162, 1059.38193019 ]
    // 45 terms retained
];

KMG.VSOPTerms.saturn_B1 = [
    [ 0.00198927992, 4.93901017903, 213.299095438 ],
    [ 0.00036947916, 3.14159265359, 0 ],
    [ 0.00017966989, 0.5197943111, 426.598190876 ],
    [ 0.00010919721, 1.79463271368, 220.412642439 ],
    [ 0.00013320265, 2.26481519893, 206.185548437 ],
    [ 3.243428e-05, 1.21094033148, 419.484643875 ],
    [ 2.900519e-05, 6.17033461979, 639.897286314 ],
    [ 1.584712e-05, 0.9341639713, 433.711737877 ],
    [ 1.580666e-05, 3.08171717435, 7.1135470008 ],
    [ 7.00659e-06, 0.20545152078, 316.391869657 ],
    [ 3.10902e-06, 4.38351712708, 110.206321219 ],
    [ 3.01237e-06, 1.66219956459, 227.52618944 ],
    [ 3.03761e-06, 5.46322830151, 853.196381752 ],
    [ 2.59878e-06, 3.93026240568, 103.092774219 ],
    [ 2.52673e-06, 0.9002092521, 632.783739313 ],
    [ 1.82664e-06, 0.12142438148, 647.010833315 ],
    [ 1.57532e-06, 2.42607457234, 199.072001436 ],
    [ 1.08184e-06, 1.39896246207, 529.690965095 ],
    [ 8.8301e-07, 2.17503185037, 323.505416657 ],
    [ 8.6875e-07, 2.91365320786, 14.2270940016 ],
    [ 9.3226e-07, 2.4431495804, 217.231248701 ],
    [ 7.6217e-07, 2.73666477702, 210.1177017 ],
    [ 6.7406e-07, 1.49053395808, 209.366942175 ],
    [ 6.9585e-07, 1.31682001912, 216.480489176 ],
    [ 5.3865e-07, 1.74961587267, 202.253395174 ],
    [ 4.8657e-07, 0.85586786255, 440.825284878 ],
    [ 3.8289e-07, 2.90107344056, 117.31986822 ],
    [ 3.0566e-07, 1.28845522495, 412.371096874 ],
    [ 2.7841e-07, 4.74764197119, 1066.49547719 ],
    [ 3.2708e-07, 2.2181845052, 224.344795702 ],
    [ 1.8822e-07, 5.62219514688, 860.309928753 ],
    [ 1.9503e-07, 0.67017561839, 846.082834751 ],
    [ 1.6933e-07, 1.19325749663, 536.804512095 ],
    [ 1.6367e-07, 1.21661206395, 95.9792272178 ],
    [ 1.8612e-07, 1.22520531243, 309.278322656 ],
    [ 1.3682e-07, 4.73321416332, 522.577418094 ],
    [ 1.5156e-07, 4.6996705248, 11.0457002639 ],
    [ 1.1499e-07, 4.14138196473, 415.552490612 ],
    [ 1.2837e-07, 2.81845968681, 742.990060533 ],
    [ 1.3649e-07, 0.41098020093, 422.666037613 ],
    [ 1.054e-07, 1.81501295981, 330.618963658 ],
    [ 1.0912e-07, 1.85613282527, 423.416797138 ],
    [ 9.472e-08, 1.51137573235, 63.7358983034 ],
    [ 8.741e-08, 3.12101135745, 625.670192312 ],
    [ 9.441e-08, 0.52002672064, 429.779584614 ],
    [ 8.971e-08, 3.23483186571, 277.034993741 ],
    [ 7.026e-08, 2.45348926519, 430.530344139 ],
    [ 7.163e-08, 4.60387223265, 215.746775993 ],
    [ 6.468e-08, 2.17426030779, 490.334089179 ],
    [ 6.287e-08, 1.51913918673, 234.63973644 ],
    [ 6.166e-08, 0.07222081964, 654.124380316 ],
    [ 6.137e-08, 0.42127140031, 149.563197135 ],
    [ 7.021e-08, 1.7565001339, 437.64389114 ],
    [ 5.019e-08, 5.76559473909, 210.851414883 ],
    [ 4.119e-08, 2.71283218857, 3.1813937377 ],
    [ 3.872e-08, 2.9984970498, 949.17560897 ],
    [ 3.675e-08, 5.11600747801, 3.9321532631 ],
    [ 3.776e-08, 2.46233837693, 1059.38193019 ],
    [ 3.317e-08, 4.69110070363, 628.85158605 ],
    [ 3.682e-08, 1.19319192495, 223.594036176 ]
    // 60 terms retained
];

KMG.VSOPTerms.saturn_B2 = [
    [ 0.00013884264, 0.08994998691, 213.299095438 ],
    [ 3.075713e-05, 3.9161093762, 206.185548437 ],
    [ 2.081666e-05, 0.09631968077, 220.412642439 ],
    [ 1.452574e-05, 5.48867576013, 426.598190876 ],
    [ 5.46808e-06, 2.94585826799, 419.484643875 ],
    [ 3.91398e-06, 5.43939792344, 433.711737877 ],
    [ 3.1974e-06, 4.34820275048, 639.897286314 ],
    [ 2.03518e-06, 1.37396136744, 7.1135470008 ],
    [ 2.20164e-06, 0, 0 ],
    [ 1.16719e-06, 6.24505924943, 227.52618944 ],
    [ 6.7605e-07, 1.75135990376, 316.391869657 ],
    [ 6.4044e-07, 4.10904350356, 199.072001436 ],
    [ 5.5518e-07, 4.56815095513, 647.010833315 ],
    [ 4.9875e-07, 3.48944345784, 853.196381752 ],
    [ 3.8984e-07, 2.7993042852, 632.783739313 ],
    [ 2.7643e-07, 1.22439852303, 14.2270940016 ],
    [ 2.4804e-07, 4.48123972552, 210.1177017 ],
    [ 2.1498e-07, 5.38853499774, 440.825284878 ],
    [ 1.5704e-07, 4.28129850675, 217.231248701 ],
    [ 1.9538e-07, 5.81992746567, 216.480489176 ],
    [ 1.4472e-07, 1.71327951628, 110.206321219 ],
    [ 1.229e-07, 4.06067197339, 103.092774219 ],
    [ 1.0826e-07, 0.58425778734, 323.505416657 ],
    [ 1.1875e-07, 2.9567255894, 412.371096874 ],
    [ 1.0534e-07, 2.51484815706, 529.690965095 ],
    [ 7.971e-08, 1.29072033406, 117.31986822 ],
    [ 9.046e-08, 5.92757785737, 209.366942175 ],
    [ 6.82e-08, 3.73629063516, 860.309928753 ],
    [ 5.266e-08, 3.17424271177, 202.253395174 ],
    [ 6.316e-08, 2.70918854345, 1066.49547719 ],
    [ 4.648e-08, 3.40943979533, 309.278322656 ],
    [ 3.657e-08, 6.10028538147, 234.63973644 ],
    [ 3.034e-08, 3.00141076688, 95.9792272178 ],
    [ 2.964e-08, 4.7591827384, 625.670192312 ],
    [ 2.831e-08, 3.72837340664, 423.416797138 ],
    [ 3.06e-08, 4.54921839566, 654.124380316 ],
    [ 3.173e-08, 4.93945460684, 429.779584614 ],
    [ 2.517e-08, 2.84610096404, 846.082834751 ],
    [ 2.755e-08, 0.11130771173, 330.618963658 ],
    [ 2.476e-08, 5.8052055678, 536.804512095 ],
    [ 2.579e-08, 4.80701288066, 422.666037613 ],
    [ 2.252e-08, 0.09608234743, 522.577418094 ],
    [ 2.036e-08, 0.29468198549, 224.344795702 ],
    [ 1.945e-08, 5.61183319602, 735.876513532 ],
    [ 1.649e-08, 6.17255863554, 415.552490612 ],
    [ 1.711e-08, 5.68150133024, 223.594036176 ],
    [ 1.223e-08, 1.07126086594, 21.3406410024 ],
    [ 1.51e-08, 1.50174476287, 742.990060533 ],
    [ 1.07e-08, 4.69201775284, 203.004154699 ],
    [ 1.097e-08, 4.44901307448, 430.530344139 ],
    [ 9.59e-09, 0.29003331127, 3.9321532631 ],
    [ 1.219e-08, 4.89549127087, 277.034993741 ],
    [ 7.8e-09, 6.11668251851, 124.433415221 ],
    [ 8.1e-09, 5.92587997397, 437.64389114 ],
    [ 7.11e-09, 0.87489137869, 3.1813937377 ],
    [ 7.03e-09, 2.88322689246, 88.865680217 ],
    [ 7.41e-09, 5.28664451824, 447.938831878 ],
    [ 7.97e-09, 0.38839628271, 515.463871093 ]
    // 58 terms retained
];

KMG.VSOPTerms.saturn_B3 = [
    [ 4.63357e-06, 1.69194209337, 213.299095438 ],
    [ 4.87242e-06, 5.57827705588, 206.185548437 ],
    [ 2.70686e-06, 4.65445792593, 220.412642439 ],
    [ 2.77451e-06, 0, 0 ],
    [ 6.6718e-07, 3.66337287998, 433.711737877 ],
    [ 6.5617e-07, 4.71263096227, 419.484643875 ],
    [ 6.9846e-07, 3.33236270677, 426.598190876 ],
    [ 3.0551e-07, 4.53651131935, 227.52618944 ],
    [ 2.9704e-07, 2.49374065388, 639.897286314 ],
    [ 1.8157e-07, 5.89401285772, 7.1135470008 ],
    [ 1.7504e-07, 5.79120992263, 199.072001436 ],
    [ 1.1684e-07, 2.74773493978, 647.010833315 ],
    [ 6.048e-08, 5.80237729519, 14.2270940016 ],
    [ 6.248e-08, 1.60565634016, 853.196381752 ],
    [ 6.42e-08, 3.63996599914, 440.825284878 ],
    [ 4.552e-08, 6.21266119922, 210.1177017 ],
    [ 4.995e-08, 3.21953122449, 316.391869657 ],
    [ 4.166e-08, 4.64321479214, 632.783739313 ],
    [ 2.938e-08, 4.647670282, 412.371096874 ],
    [ 2.894e-08, 4.02023147538, 216.480489176 ],
    [ 2.225e-08, 0.67809668672, 103.092774219 ],
    [ 1.694e-08, 1.86898759241, 860.309928753 ],
    [ 1.394e-08, 4.39486147395, 234.63973644 ],
    [ 1.272e-08, 5.87144755894, 217.231248701 ],
    [ 1.132e-08, 5.91391008745, 117.31986822 ],
    [ 9.84e-09, 0.89291344192, 1066.49547719 ],
    [ 8.48e-09, 5.10998113739, 323.505416657 ],
    [ 1.018e-08, 2.76708857895, 654.124380316 ],
    [ 8.44e-09, 5.65924574483, 309.278322656 ],
    [ 6.31e-09, 3.09293087763, 429.779584614 ],
    [ 5.24e-09, 0.12316698689, 625.670192312 ],
    [ 5.48e-09, 0.64455286234, 110.206321219 ],
    [ 4.84e-09, 5.32908334165, 202.253395174 ],
    [ 5.11e-09, 4.72373936399, 330.618963658 ],
    [ 4.51e-09, 3.89411630776, 223.594036176 ]
    // 35 terms retained
];

KMG.VSOPTerms.saturn_B4 = [
    [ 5.8521e-07, 0.96404269672, 206.185548437 ],
    [ 2.7023e-07, 2.97511812746, 213.299095438 ],
    [ 2.7345e-07, 2.90816987834, 220.412642439 ],
    [ 8.709e-08, 1.88638219079, 433.711737877 ],
    [ 6.015e-08, 2.81931276694, 227.52618944 ],
    [ 6.059e-08, 0.21576562475, 419.484643875 ],
    [ 3.796e-08, 1.19723799579, 199.072001436 ],
    [ 3.647e-08, 1.71327650497, 426.598190876 ],
    [ 2.054e-08, 0.66410894553, 639.897286314 ],
    [ 2.559e-08, 3.14159265359, 0 ],
    [ 1.867e-08, 0.93578719925, 647.010833315 ],
    [ 1.256e-08, 4.1317599278, 7.1135470008 ],
    [ 1.399e-08, 1.88853247568, 440.825284878 ],
    [ 9.36e-09, 4.08790738476, 14.2270940016 ]
    // 14 terms retained
];

KMG.VSOPTerms.saturn_B5 = [
    [ 5.442e-08, 2.61186488264, 206.185548437 ],
    [ 1.966e-08, 1.16969532852, 220.412642439 ],
    [ 9.07e-09, 0.10771558371, 433.711737877 ],
    [ 8.29e-09, 1.07640059707, 227.52618944 ],
    [ 5.84e-09, 2.88210646011, 199.072001436 ],
    [ 7.64e-09, 3.14159265359, 0 ]
    // 6 terms retained
];

KMG.VSOPTerms.saturn_R0 = [
    [ 9.55758135486, 0, 0 ],
    [ 0.52921382865, 2.39226219573, 213.299095438 ],
    [ 0.01873679867, 5.2354960466, 206.185548437 ],
    [ 0.01464663929, 1.64763042902, 426.598190876 ],
    [ 0.00821891141, 5.93520042303, 316.391869657 ],
    [ 0.00547506923, 5.0153261898, 103.092774219 ],
    [ 0.0037168465, 2.27114821115, 220.412642439 ],
    [ 0.00361778765, 3.13904301847, 7.1135470008 ],
    [ 0.00140617506, 5.70406606781, 632.783739313 ],
    [ 0.00108974848, 3.29313390175, 110.206321219 ],
    [ 0.00069006962, 5.94099540992, 419.484643875 ],
    [ 0.00061053367, 0.94037691801, 639.897286314 ],
    [ 0.00048913294, 1.55733638681, 202.253395174 ],
    [ 0.00034143772, 0.19519102597, 277.034993741 ],
    [ 0.00032401773, 5.47084567016, 949.17560897 ],
    [ 0.00020936596, 0.46349251129, 735.876513532 ],
    [ 0.000208393, 1.52102476129, 433.711737877 ],
    [ 0.00020746751, 5.33255457763, 199.072001436 ],
    [ 0.00015298404, 3.0594381494, 529.690965095 ],
    [ 0.00014296484, 2.60433479142, 323.505416657 ],
    [ 0.00011993338, 5.98050967385, 846.082834751 ],
    [ 0.00011380257, 1.7310542704, 522.577418094 ],
    [ 0.00012884624, 1.64890652873, 138.517496871 ],
    [ 7.752664e-05, 5.85190720634, 95.9792272178 ],
    [ 9.796004e-05, 5.20477537945, 1265.56747863 ],
    [ 6.465823e-05, 0.17732249942, 1052.26838319 ],
    [ 6.770608e-05, 3.00432308205, 14.2270940016 ],
    [ 5.850459e-05, 1.45520063003, 415.552490612 ],
    [ 5.30742e-05, 0.597422002, 63.7358983034 ],
    [ 4.695487e-05, 2.14913875148, 227.52618944 ],
    [ 4.044055e-05, 1.64006628713, 209.366942175 ],
    [ 3.688237e-05, 0.78017261355, 412.371096874 ],
    [ 3.376576e-05, 3.69526804193, 224.344795702 ],
    [ 2.885428e-05, 1.38764476428, 838.96928775 ],
    [ 2.975955e-05, 5.6846913175, 210.1177017 ],
    [ 3.419618e-05, 4.94550542171, 1581.95934828 ],
    [ 3.460944e-05, 1.8508869805, 175.1660598 ],
    [ 3.400702e-05, 0.55385265588, 350.3321196 ],
    [ 2.507656e-05, 3.53854849756, 742.990060533 ],
    [ 2.448261e-05, 6.18411000897, 1368.66025285 ],
    [ 2.406134e-05, 2.96557066697, 117.31986822 ],
    [ 2.8811e-05, 0.17962517668, 853.196381752 ],
    [ 2.173933e-05, 0.01504273441, 340.770892045 ],
    [ 2.024755e-05, 5.05404443168, 11.0457002639 ],
    [ 1.740284e-05, 2.34658553206, 309.278322656 ],
    [ 1.861491e-05, 5.93369815396, 625.670192312 ],
    [ 1.888373e-05, 0.02965674854, 3.9321532631 ],
    [ 1.610962e-05, 1.17294612833, 74.7815985673 ],
    [ 1.462651e-05, 1.92592107843, 216.480489176 ],
    [ 1.474674e-05, 5.67670456599, 203.737867882 ],
    [ 1.395118e-05, 5.93681366484, 127.471796607 ],
    [ 1.781073e-05, 0.76321113173, 217.231248701 ],
    [ 1.817173e-05, 5.77721016746, 490.334089179 ],
    [ 1.472651e-05, 1.40074361969, 137.033024162 ],
    [ 1.304238e-05, 0.77242217158, 647.010833315 ],
    [ 1.149625e-05, 5.74018465658, 1162.47470441 ],
    [ 1.12666e-05, 4.46695542616, 265.989293477 ],
    [ 1.277624e-05, 2.98416387533, 1059.38193019 ],
    [ 1.207069e-05, 0.75304212507, 351.816592309 ],
    [ 1.071373e-05, 1.13559402672, 1155.36115741 ],
    [ 1.020836e-05, 5.912164079, 1685.0521225 ],
    [ 1.314853e-05, 5.11211291628, 211.81462273 ],
    [ 1.295446e-05, 4.69181789263, 1898.35121794 ],
    [ 1.099067e-05, 1.81772713286, 149.563197135 ],
    [ 9.987e-06, 2.63153637392, 200.768922466 ],
    [ 9.85887e-06, 2.25994579127, 956.289155971 ],
    [ 9.32498e-06, 3.6697651607, 554.069987483 ],
    [ 6.64378e-06, 0.60293797633, 728.762966531 ],
    [ 6.59773e-06, 4.66626568448, 195.139848173 ],
    [ 6.1773e-06, 5.62079509269, 942.062061969 ],
    [ 6.26321e-06, 5.9422380524, 1478.86657406 ],
    [ 4.82324e-06, 1.8404847559, 479.288388915 ],
    [ 4.88024e-06, 2.79370056377, 3.1813937377 ],
    [ 4.69977e-06, 0.83852490947, 1471.75302706 ],
    [ 4.51795e-06, 5.64511397088, 2001.44399216 ],
    [ 5.53115e-06, 3.41113180428, 269.921446741 ],
    [ 5.34419e-06, 1.26448338991, 275.550521033 ],
    [ 4.72465e-06, 1.881976479, 515.463871093 ],
    [ 4.05564e-06, 1.63989371862, 536.804512095 ],
    [ 5.16979e-06, 4.44301732436, 2214.7430876 ],
    [ 4.53031e-06, 3.00355936608, 302.164775655 ],
    [ 4.94358e-06, 2.28631779029, 278.51946645 ],
    [ 4.89957e-06, 5.80627763476, 191.20769491 ],
    [ 4.27438e-06, 0.05728625421, 284.148540742 ],
    [ 3.39681e-06, 1.40193253039, 440.825284878 ],
    [ 3.40671e-06, 0.89095123731, 628.85158605 ],
    [ 3.85941e-06, 1.99711336197, 1272.68102563 ],
    [ 2.88229e-06, 1.12166658438, 422.666037613 ],
    [ 2.9413e-06, 0.42566345584, 312.199083963 ],
    [ 2.6248e-06, 0.31730778329, 1045.15483619 ],
    [ 2.95348e-06, 0.67123785008, 88.865680217 ],
    [ 3.42778e-06, 5.85587331618, 1795.25844372 ],
    [ 3.41376e-06, 2.37619847718, 525.498179401 ],
    [ 2.3384e-06, 4.22716164833, 114.138474483 ],
    [ 2.23693e-06, 2.28109311966, 330.618963658 ],
    [ 2.75816e-06, 0.47831420035, 38.1330356378 ],
    [ 2.24509e-06, 0.54737895493, 1788.14489672 ],
    [ 3.03382e-06, 0.87951215556, 6069.77675455 ],
    [ 2.92033e-06, 6.21435200687, 210.851414883 ],
    [ 2.26021e-06, 0.37470024598, 142.449650134 ],
    [ 2.77361e-06, 5.32007209923, 692.587484354 ],
    [ 2.42981e-06, 5.3719132247, 1258.45393163 ],
    [ 2.05518e-06, 0.95727934819, 288.080694005 ],
    [ 2.07418e-06, 5.38074389449, 2317.83586181 ],
    [ 1.86792e-06, 6.03513906344, 404.506790348 ],
    [ 2.18728e-06, 5.25467962646, 212.335887592 ],
    [ 2.21952e-06, 5.94565685178, 39.3568759152 ],
    [ 1.79461e-06, 4.4108886003, 408.438943611 ],
    [ 2.41484e-06, 1.12472797872, 388.465155238 ],
    [ 1.97242e-06, 3.90215848857, 52.6901980395 ],
    [ 2.36745e-06, 0.90816434282, 1375.77379985 ],
    [ 1.72018e-06, 5.56321647759, 213.347279548 ],
    [ 1.69893e-06, 2.85627663958, 99.1606209555 ],
    [ 2.14211e-06, 4.20220398238, 2531.13495725 ],
    [ 1.71967e-06, 2.365497404, 213.250911328 ],
    [ 1.65592e-06, 2.63731901847, 215.746775993 ],
    [ 2.30764e-06, 5.49430203101, 191.958454436 ],
    [ 1.77457e-06, 0.3813183367, 430.530344139 ],
    [ 1.91521e-06, 2.95905308803, 437.64389114 ],
    [ 1.63278e-06, 3.45811838277, 617.805885786 ],
    [ 1.62306e-06, 5.73059706733, 203.004154699 ],
    [ 1.75037e-06, 5.71409014243, 1066.49547719 ],
    [ 1.82912e-06, 5.66913964019, 2111.65031338 ],
    [ 1.50093e-06, 4.40713052025, 417.03696332 ],
    [ 1.87955e-06, 6.07914706117, 563.631215038 ],
    [ 1.44751e-06, 5.081154075, 423.416797138 ],
    [ 1.37424e-06, 5.43711941387, 222.860322994 ],
    [ 1.72859e-06, 1.84924132022, 1589.07289528 ],
    [ 1.65367e-06, 2.89085128458, 214.262303285 ],
    [ 1.45738e-06, 1.56566786572, 831.85574075 ],
    [ 1.76715e-06, 2.3025051169, 9999.98645077 ],
    [ 1.29054e-06, 2.5532773604, 414.068017904 ],
    [ 1.20072e-06, 0.04355666836, 1361.54670584 ],
    [ 1.43538e-06, 0.99839503339, 76.2660712756 ],
    [ 1.08866e-06, 2.092391991, 207.670021145 ],
    [ 1.31903e-06, 2.85788215274, 312.459716394 ],
    [ 1.12006e-06, 0.26268721967, 2104.53676638 ],
    [ 1.25243e-06, 4.78336081984, 205.222340591 ],
    [ 1.04426e-06, 3.63700546876, 65.2203710117 ],
    [ 1.07397e-06, 3.66971473274, 212.777830576 ],
    [ 1.08678e-06, 2.85493119127, 21.3406410024 ],
    [ 9.7432e-07, 5.12133810135, 2634.22773147 ],
    [ 1.09144e-06, 1.6323570202, 208.633228992 ],
    [ 9.6681e-07, 4.19670884921, 305.346169393 ],
    [ 9.6356e-07, 2.56061375123, 1692.1656695 ],
    [ 8.595e-07, 4.54551656203, 210.378334131 ],
    [ 9.9199e-07, 5.13700784528, 1574.84580128 ],
    [ 1.12586e-06, 5.03077528575, 703.633184617 ],
    [ 8.382e-07, 1.18242417124, 429.779584614 ],
    [ 8.9023e-07, 5.38777022, 107.024927482 ],
    [ 1.10307e-06, 2.43652629097, 355.748745572 ],
    [ 9.0436e-07, 4.20939381417, 213.8203603 ],
    [ 9.5576e-07, 5.44345029853, 2428.04218303 ],
    [ 9.4196e-07, 2.39809539458, 483.220542179 ],
    [ 8.5658e-07, 0.03212125891, 860.309928753 ],
    [ 8.8781e-07, 4.05795823648, 128.956269315 ],
    [ 8.1952e-07, 1.6641358772, 62.2514255951 ],
    [ 9.0968e-07, 3.96769274342, 2847.52682691 ],
    [ 8.4136e-07, 4.60800956822, 177.874372786 ],
    [ 8.8291e-07, 3.86573756854, 140.001969579 ],
    [ 9.3309e-07, 0.73847907603, 831.104981224 ],
    [ 9.195e-07, 2.94820357852, 35.4247226521 ],
    [ 9.6733e-07, 4.84623402274, 131.40394987 ],
    [ 8.6987e-07, 1.33651321637, 1905.46476494 ],
    [ 7.1036e-07, 0.99289997732, 405.257549874 ],
    [ 9.5225e-07, 2.51496477958, 2.4476805548 ],
    [ 7.25e-07, 4.63319492132, 245.542424352 ],
    [ 8.2455e-07, 1.52813728425, 145.631043871 ],
    [ 7.678e-07, 3.15262144591, 767.369082921 ],
    [ 7.0362e-07, 4.04036200412, 173.942219523 ],
    [ 8.619e-07, 2.29886507805, 85.8272988312 ],
    [ 6.6726e-07, 4.75093122174, 70.8494453042 ],
    [ 6.5893e-07, 2.4729931125, 280.967147005 ],
    [ 6.5129e-07, 0.09259103795, 9.5612275556 ],
    [ 7.1669e-07, 0.01187527275, 565.115687747 ],
    [ 6.6488e-07, 1.08200099735, 339.286419336 ],
    [ 6.3441e-07, 2.01741294636, 234.63973644 ],
    [ 6.0956e-07, 5.11950202312, 756.323382657 ],
    [ 5.7792e-07, 6.05712220674, 1677.9385755 ],
    [ 6.4168e-07, 1.28718951847, 1148.24761041 ],
    [ 7.3324e-07, 4.3782396964, 425.113718168 ],
    [ 5.7179e-07, 6.26635812249, 2420.92863603 ],
    [ 5.5012e-07, 3.85870982169, 342.255364753 ],
    [ 5.5347e-07, 1.6036662959, 543.024287219 ],
    [ 6.4075e-07, 4.09799744422, 327.43756992 ],
    [ 5.7804e-07, 5.46967524925, 347.884439046 ],
    [ 7.3568e-07, 3.72317864427, 92.0470739547 ],
    [ 7.365e-07, 3.57067095117, 1.4844727083 ],
    [ 6.5011e-07, 2.44916996344, 267.473766186 ],
    [ 5.4545e-07, 3.71490034335, 344.703045308 ],
    [ 4.9834e-07, 3.93491116778, 192.692167619 ],
    [ 4.9536e-07, 3.22835315683, 333.657345044 ],
    [ 4.7617e-07, 3.92991700611, 199.284449757 ],
    [ 4.9487e-07, 4.90287053223, 217.491881132 ],
    [ 4.639e-07, 2.63757382235, 10.2949407385 ],
    [ 6.2822e-07, 4.40222532856, 214.783568146 ],
    [ 4.6317e-07, 2.0959781782, 212.548335913 ],
    [ 5.4399e-07, 1.06837441326, 362.862292573 ],
    [ 5.8898e-07, 2.62274564952, 225.82926841 ],
    [ 4.8458e-07, 3.15145995815, 216.219856745 ],
    [ 4.6304e-07, 4.86526668367, 2950.61960113 ],
    [ 4.6012e-07, 4.97405657859, 198.321241911 ],
    [ 4.668e-07, 2.44971808455, 207.148756284 ],
    [ 4.4544e-07, 1.77853306195, 223.594036176 ],
    [ 4.4526e-07, 5.55789993555, 264.504820769 ],
    [ 5.5807e-07, 4.29420266501, 329.725191781 ],
    [ 4.947e-07, 5.2071040339, 2744.43405269 ],
    [ 5.8832e-07, 4.23073251588, 700.664239201 ],
    [ 5.2681e-07, 3.79401248595, 343.2185726 ],
    [ 4.1599e-07, 0.74365516186, 125.987323898 ],
    [ 5.6184e-07, 2.06967234741, 124.433415221 ],
    [ 4.7914e-07, 2.38951194877, 207.882469467 ],
    [ 4.3427e-07, 1.83764074596, 106.274167956 ],
    [ 3.9822e-07, 4.00880264668, 12.5301729722 ],
    [ 5.3915e-07, 4.97995268146, 134.585343608 ],
    [ 4.9974e-07, 5.75533228241, 320.32402292 ],
    [ 4.6661e-07, 2.06519866248, 2008.55753916 ],
    [ 4.4845e-07, 5.35638703411, 218.928169731 ],
    [ 4.0789e-07, 4.92568693313, 1891.23767094 ],
    [ 4.2917e-07, 0.39624025575, 357.445666601 ],
    [ 3.7986e-07, 2.06627721117, 247.239345382 ],
    [ 4.8733e-07, 5.32762223699, 3127.31333126 ],
    [ 4.108e-07, 2.47538730007, 237.678117826 ],
    [ 3.4595e-07, 5.62346550573, 99.9113804809 ],
    [ 4.0736e-07, 4.08372789207, 621.738039049 ],
    [ 3.4217e-07, 0.73134343646, 750.103607533 ],
    [ 3.397e-07, 5.31274574257, 206.233732547 ],
    [ 3.6432e-07, 1.68823737636, 22.0914005278 ],
    [ 3.9263e-07, 3.4565924439, 241.610271089 ],
    [ 3.9247e-07, 4.39637044405, 18.1592472647 ],
    [ 3.4703e-07, 2.24942082303, 487.365143763 ],
    [ 3.3115e-07, 4.86602845858, 209.106309744 ],
    [ 3.2805e-07, 1.06026635194, 252.655971353 ],
    [ 3.9031e-07, 3.73882100198, 3163.91869657 ],
    [ 3.2427e-07, 2.22874162802, 319.573263394 ],
    [ 3.4475e-07, 1.82451837226, 380.12776796 ],
    [ 4.1741e-07, 0.08219629974, 210.330150021 ],
    [ 3.3602e-07, 5.80228769156, 251.432131076 ],
    [ 3.1221e-07, 1.96490815234, 244.318584075 ],
    [ 3.482e-07, 5.96330410021, 217.964961884 ],
    [ 3.8505e-07, 4.43924639932, 160.608897399 ],
    [ 3.6106e-07, 3.83276808968, 56.6223513026 ],
    [ 3.0287e-07, 2.25797096745, 1169.58825141 ],
    [ 3.1085e-07, 4.90133840375, 144.146571163 ],
    [ 3.2208e-07, 3.57884943983, 231.458342703 ],
    [ 2.8857e-07, 5.80423567126, 1994.33044516 ],
    [ 3.2178e-07, 2.13176978399, 206.137364327 ],
    [ 3.1795e-07, 3.81800770982, 73.297125859 ],
    [ 2.9001e-07, 2.21676176185, 14.977853527 ],
    [ 3.4903e-07, 5.6522370985, 497.44763618 ],
    [ 3.2246e-07, 1.92866027151, 98.8999885246 ],
    [ 3.2119e-07, 0.99531311844, 1464.63948006 ],
    [ 2.9114e-07, 5.98247860339, 2737.32050569 ],
    [ 3.6706e-07, 4.75493516593, 348.847646892 ],
    [ 2.7506e-07, 6.12108141844, 214.049854963 ],
    [ 2.8512e-07, 1.68678188105, 78.7137518304 ],
    [ 2.7266e-07, 0.2424126514, 313.210475919 ],
    [ 2.8789e-07, 0.04439781853, 5.6290742925 ],
    [ 3.2512e-07, 3.77917498543, 33.9402499438 ],
    [ 3.5016e-07, 3.43495537908, 273.102840478 ],
    [ 2.713e-07, 5.20559983787, 148.078724426 ],
    [ 3.3098e-07, 2.44781346214, 969.622478095 ],
    [ 2.7876e-07, 1.4445798235, 258.875746477 ],
    [ 2.7324e-07, 4.2603169255, 179.358845494 ],
    [ 2.9185e-07, 4.84536228119, 905.886579792 ],
    [ 2.7869e-07, 0.78770357978, 546.956440482 ],
    [ 2.757e-07, 2.4521432165, 254.943593214 ],
    [ 2.893e-07, 6.03256439022, 188.92007305 ],
    [ 3.4313e-07, 6.00978682828, 166.828672522 ],
    [ 2.5943e-07, 0.65129538567, 654.124380316 ],
    [ 3.3574e-07, 1.23583695762, 2221.8566346 ],
    [ 2.4357e-07, 0.52261322301, 894.840879528 ],
    [ 2.7769e-07, 5.17801023424, 5.4166259714 ],
    [ 2.5596e-07, 3.35872554982, 0.9632078465 ],
    [ 2.2984e-07, 3.5246592021, 458.84151979 ],
    [ 2.4471e-07, 0.00612626886, 69.1525242748 ],
    [ 2.8688e-07, 0.76245403349, 488.849616471 ],
    [ 2.3664e-07, 2.54807644282, 196.624320882 ],
    [ 2.5432e-07, 5.28932962898, 636.715892576 ],
    [ 3.1152e-07, 2.04977568414, 282.451619713 ],
    [ 2.5224e-07, 4.97246368293, 3060.82592235 ],
    [ 2.9605e-07, 3.92681945757, 206.706813299 ],
    [ 2.2223e-07, 3.25151461044, 681.54178409 ],
    [ 2.7913e-07, 2.72520521957, 32.2433289144 ],
    [ 2.2107e-07, 4.75818706798, 213.187220853 ],
    [ 2.1662e-07, 4.61542319262, 3267.01147078 ],
    [ 2.7048e-07, 2.86264558816, 24.3790223882 ],
    [ 2.2107e-07, 3.16802956645, 213.410970023 ],
    [ 2.0731e-07, 1.67138184255, 274.066048325 ],
    [ 2.5352e-07, 5.12122578609, 168.052512799 ],
    [ 2.8e-07, 4.72415728042, 552.585514774 ],
    [ 2.6154e-07, 1.59534268938, 491.818561888 ],
    [ 2.1984e-07, 0.87565381783, 635.965133051 ],
    [ 2.7121e-07, 5.53473514339, 555.554460191 ],
    [ 2.5282e-07, 1.78091725384, 182.279606801 ],
    [ 1.9559e-07, 2.14658471778, 54.1746707478 ],
    [ 2.702e-07, 3.57938591854, 561.183534484 ],
    [ 2.1398e-07, 3.86074898701, 116.426096343 ],
    [ 1.988e-07, 5.59172876182, 4.192785694 ],
    [ 1.9455e-07, 0.10611239153, 218.715721409 ],
    [ 1.9933e-07, 2.90526601486, 120.358249606 ],
    [ 2.5474e-07, 1.62678013615, 2324.94940882 ],
    [ 2.5565e-07, 2.09824642636, 248.72381809 ],
    [ 1.9858e-07, 2.5207926516, 1485.98012107 ],
    [ 1.8516e-07, 2.54810951896, 213.511543759 ],
    [ 1.8516e-07, 5.3775511051, 213.086647117 ],
    [ 1.977e-07, 0.0753938129, 842.150681488 ],
    [ 2.366e-07, 1.60734696991, 738.797274839 ],
    [ 2.0404e-07, 2.95125083804, 59.8037450403 ],
    [ 2.4267e-07, 3.15706315958, 240.386430812 ],
    [ 1.8338e-07, 3.18779671933, 295.051228654 ],
    [ 1.7466e-07, 2.90466924741, 477.803916207 ],
    [ 2.0744e-07, 1.0646867375, 494.266242443 ],
    [ 2.0425e-07, 1.8415240439, 533.623118358 ],
    [ 2.1401e-07, 0.64115941242, 189.723222202 ],
    [ 1.6379e-07, 3.9827987735, 2.9207613068 ],
    [ 1.6058e-07, 0.59325161303, 746.922213796 ],
    [ 1.7014e-07, 4.74645535598, 2207.6295406 ],
    [ 2.0479e-07, 6.05098286202, 173.681587092 ],
    [ 1.5443e-07, 1.49110952141, 543.918059096 ],
    [ 1.9833e-07, 4.93811673788, 121.252021483 ],
    [ 1.7073e-07, 0.71316728361, 1781.03134972 ],
    [ 1.7213e-07, 0.67923942083, 151.047669843 ],
    [ 1.5031e-07, 5.52780819403, 2310.72231481 ],
    [ 1.5525e-07, 5.71027236377, 3053.71237535 ],
    [ 1.5852e-07, 4.45624558241, 643.829439577 ],
    [ 1.6033e-07, 0.63293747499, 358.93013931 ],
    [ 1.4591e-07, 5.26184260227, 472.174841915 ],
    [ 1.6544e-07, 3.52801242983, 3480.31056622 ],
    [ 1.8834e-07, 0.55399472524, 4.665866446 ],
    [ 1.7549e-07, 2.26583782913, 672.140615228 ],
    [ 1.8022e-07, 2.71080286082, 181.806526049 ],
    [ 1.5918e-07, 5.23473369828, 135.548551454 ],
    [ 1.3931e-07, 3.19357128657, 213.559727869 ],
    [ 1.4074e-07, 0.80929029505, 221.375850285 ],
    [ 1.3931e-07, 4.73208739639, 213.038463007 ],
    [ 1.4594e-07, 2.65461071698, 292.012847268 ],
    [ 1.4383e-07, 0.21121098879, 235.390495966 ],
    [ 1.6173e-07, 0.91043299219, 280.003939158 ],
    [ 1.3328e-07, 3.54955934512, 205.664283575 ],
    [ 1.6559e-07, 5.3889675375, 424.150510321 ],
    [ 1.6104e-07, 0.82547975762, 176.650532508 ],
    [ 1.2726e-07, 0.75928182731, 721.64941953 ],
    [ 1.2745e-07, 3.55415994159, 153.495350398 ],
    [ 1.4455e-07, 0.12149539513, 313.683556671 ],
    [ 1.6497e-07, 3.26380729084, 6283.07584999 ],
    [ 1.6566e-07, 1.62651930127, 5856.47765912 ],
    [ 1.5039e-07, 1.25437397471, 2641.34127847 ],
    [ 1.5688e-07, 1.1894072881, 486.401935916 ],
    [ 1.1898e-07, 0.91072314364, 416.303250138 ],
    [ 1.1709e-07, 1.10722547914, 81.7521332162 ],
    [ 1.2984e-07, 4.74370547048, 3377.217792 ],
    [ 1.3213e-07, 4.95593892766, 1279.79457263 ],
    [ 1.6123e-07, 0.98390715272, 2538.24850425 ],
    [ 1.4673e-07, 2.63437960547, 618.556645312 ],
    [ 1.1539e-07, 0.63828316888, 28.3111756513 ],
    [ 1.1339e-07, 4.36553205735, 3583.40334044 ],
    [ 1.4901e-07, 1.75796184641, 569.04784101 ],
    [ 1.1246e-07, 5.9919115557, 193.655375465 ],
    [ 1.4753e-07, 2.92291248767, 167.089304953 ],
    [ 1.2755e-07, 3.61745093436, 67.6680515665 ],
    [ 1.3536e-07, 2.50325109462, 1802.37199072 ],
    [ 1.2238e-07, 0.27162703042, 1044.40407666 ],
    [ 1.1034e-07, 6.28008547861, 629.602345575 ],
    [ 1.4387e-07, 0.38039001729, 601.764250676 ],
    [ 1.231e-07, 2.18899826214, 650.942986578 ],
    [ 1.0854e-07, 0.14262616333, 501.379789443 ],
    [ 1.5105e-07, 2.6715208815, 46.470422916 ],
    [ 1.0735e-07, 2.86920913253, 113.387714957 ],
    [ 1.4686e-07, 6.05254709898, 468.242688652 ],
    [ 1.0576e-07, 2.06017585814, 429.045871431 ],
    [ 1.2292e-07, 1.82443833563, 241.87090352 ],
    [ 1.1154e-07, 1.20110507523, 172.245298493 ],
    [ 1.3687e-07, 2.20307346288, 228.276948965 ],
    [ 1.0679e-07, 5.0736954182, 162.896519259 ],
    [ 1.203e-07, 3.18736701996, 72.0732855816 ],
    [ 1.216e-07, 4.51222901843, 425.63498303 ],
    [ 9.941e-08, 1.4988720921, 226.632417562 ],
    [ 1.2101e-07, 4.14977794208, 1108.13997497 ],
    [ 1.0287e-07, 2.10680007794, 1033.3583764 ],
    [ 1.0771e-07, 4.68125923293, 129.919477162 ],
    [ 9.592e-08, 4.80075106366, 426.646374986 ],
    [ 1.2949e-07, 5.1160175613, 219.449434592 ],
    [ 9.921e-08, 2.81125800889, 518.645264831 ],
    [ 1.2272e-07, 5.33779805565, 776.930310476 ],
    [ 9.486e-08, 4.85709302918, 820.05928096 ],
    [ 1.1392e-07, 3.86350991469, 405.991263056 ],
    [ 9.281e-08, 0.70440206655, 403.02231764 ],
    [ 9.617e-08, 1.60410621884, 426.550006766 ],
    [ 1.0112e-07, 2.7648687563, 210.590782452 ],
    [ 1.0872e-07, 1.35809078598, 170.760825785 ],
    [ 1.2502e-07, 6.06479177955, 875.830299001 ],
    [ 1.0175e-07, 2.36250012243, 685.473937353 ],
    [ 1.2211e-07, 2.04456082125, 508.350324092 ],
    [ 9.502e-08, 3.18475934663, 286.596221297 ],
    [ 1.0133e-07, 4.02559667441, 381.351608237 ],
    [ 8.889e-08, 3.62576694345, 319.312630963 ],
    [ 8.927e-08, 5.46319224261, 3370.104245 ],
    [ 1.0052e-07, 5.16107251039, 216.007408424 ],
    [ 8.553e-08, 3.87970879218, 630.336058758 ],
    [ 8.401e-08, 5.65557131026, 213.459154132 ],
    [ 8.401e-08, 2.27009862215, 213.139036744 ],
    [ 9.962e-08, 5.97645215717, 6.1503391543 ],
    [ 1.1664e-07, 0.95814408096, 694.071957062 ],
    [ 8.686e-08, 2.33879748618, 220.364458329 ],
    [ 8.135e-08, 5.54067608923, 220.460826549 ],
    [ 9.144e-08, 0.45077461958, 2097.42321938 ],
    [ 9.579e-08, 2.76806282069, 556.517668038 ],
    [ 8.128e-08, 5.54123343077, 181.055766524 ],
    [ 1.0807e-07, 0.06096432609, 691.103011645 ],
    [ 9.578e-08, 2.84972091302, 184.094147909 ],
    [ 9.848e-08, 2.37490871749, 945.243455707 ],
    [ 8.512e-08, 0.17361504982, 289.565166714 ],
    [ 8.689e-08, 0.84670554895, 2957.73314813 ],
    [ 7.633e-08, 0.00567409646, 7.1617311106 ],
    [ 9.022e-08, 3.38436801047, 731.944360269 ],
    [ 7.888e-08, 5.78452089815, 230.825203256 ],
    [ 9.472e-08, 2.26694157732, 8.0767548473 ],
    [ 7.461e-08, 5.29596435777, 2627.11418447 ],
    [ 7.616e-08, 3.1056140631, 7.065362891 ],
    [ 9.879e-08, 4.69447221853, 10213.2855462 ],
    [ 7.264e-08, 0.07122374466, 100.645093664 ],
    [ 8.001e-08, 1.60939840798, 696.519637617 ],
    [ 7.601e-08, 4.90123787776, 51.2057253312 ],
    [ 7.716e-08, 4.69702238883, 436.159418432 ],
    [ 9.866e-08, 5.25569996364, 699.701031354 ],
    [ 7.375e-08, 4.52777394099, 616.321413078 ],
    [ 9.388e-08, 2.44919199853, 2118.76386038 ],
    [ 7.3e-08, 4.0188547501, 212.027071051 ],
    [ 9.071e-08, 2.75662160229, 130.440742023 ],
    [ 7.175e-08, 5.62469707711, 31.492569389 ],
    [ 6.915e-08, 0.57642247068, 739.808666795 ],
    [ 8.909e-08, 2.19570530999, 427.561398722 ],
    [ 9.167e-08, 2.04679688754, 204.701075729 ],
    [ 7.766e-08, 3.27192916123, 3796.70243588 ],
    [ 6.842e-08, 0.55589113901, 135.336103133 ],
    [ 9.154e-08, 3.04674464726, 9786.68735533 ],
    [ 8.677e-08, 4.27082106143, 141.225809856 ],
    [ 6.709e-08, 5.66109188592, 480.772861624 ],
    [ 6.946e-08, 4.1235200144, 662.531203563 ],
    [ 7.24e-08, 3.90653111215, 214.571119825 ],
    [ 6.717e-08, 4.613115875, 2524.02141025 ],
    [ 6.566e-08, 2.67659365854, 194.176640327 ],
    [ 6.537e-08, 6.25555511414, 31.019488637 ],
    [ 7.484e-08, 5.56871021201, 271.405919449 ],
    [ 7.956e-08, 5.04685375986, 411.620337349 ],
    [ 8.039e-08, 3.08941959611, 353.301065017 ],
    [ 7.069e-08, 1.10060234302, 282.664068034 ],
    [ 6.105e-08, 0.81728612933, 593.426863398 ],
    [ 6.14e-08, 3.79672318503, 180.161994646 ],
    [ 6.761e-08, 3.84307989405, 412.583545195 ],
    [ 6.034e-08, 5.4341820396, 724.830813268 ],
    [ 8.102e-08, 4.51051495778, 268.436974032 ],
    [ 6.029e-08, 1.24355734058, 447.938831878 ],
    [ 7.613e-08, 0.79977414552, 2854.64037391 ],
    [ 7.425e-08, 2.293594419, 532.611726401 ],
    [ 5.896e-08, 2.06866571185, 454.909366527 ],
    [ 6.005e-08, 2.87167092054, 426.076926014 ],
    [ 7.278e-08, 0.88193016589, 457.617679513 ],
    [ 5.744e-08, 1.73450672261, 50.4025761791 ],
    [ 6.355e-08, 6.27053564712, 313.944189102 ],
    [ 6.193e-08, 3.99658934587, 835.037134487 ],
    [ 7.429e-08, 5.38166639065, 953.107762233 ],
    [ 5.813e-08, 0.52655128116, 1038.04128919 ],
    [ 6.145e-08, 4.52475150505, 3693.60966166 ],
    [ 5.624e-08, 0.46667684775, 610.692338785 ],
    [ 6.075e-08, 3.4660945259, 278.258834019 ],
    [ 5.877e-08, 5.51717146635, 1073.60902419 ],
    [ 5.521e-08, 0.45012859744, 643.078680052 ],
    [ 6.7e-08, 4.22406253654, 916.932280055 ],
    [ 6.72e-08, 4.19624148194, 938.129908706 ],
    [ 5.508e-08, 4.07398606097, 3899.7952101 ],
    [ 5.441e-08, 2.79849882662, 397.393243347 ],
    [ 6.134e-08, 4.90393524057, 0.5212648618 ],
    [ 5.695e-08, 4.11782098393, 391.173468224 ],
    [ 5.754e-08, 4.42718264879, 165.604832245 ],
    [ 5.4e-08, 3.2629041406, 20.6069278195 ],
    [ 5.879e-08, 6.17871813155, 291.262087743 ],
    [ 6.722e-08, 2.1862234289, 627.367113342 ],
    [ 5.359e-08, 2.29438108352, 331.209664489 ],
    [ 5.39e-08, 3.7428193189, 418.521436029 ],
    [ 6.683e-08, 2.13438701667, 285.633013451 ],
    [ 6.419e-08, 5.65171900155, 518.3846324 ],
    [ 6.193e-08, 4.89768396188, 450.977213264 ],
    [ 5.687e-08, 3.48764525546, 230.564570825 ],
    [ 5.064e-08, 4.09065475521, 6.592282139 ],
    [ 5.037e-08, 2.5999065474, 66.70484372 ],
    [ 5.191e-08, 4.39610445378, 84.3428261229 ],
    [ 4.977e-08, 2.71603834658, 558.002140746 ],
    [ 5.308e-08, 0.63718449606, 114.399106913 ],
    [ 5.221e-08, 4.65473413721, 310.714611254 ],
    [ 4.896e-08, 3.7700969923, 423.677429569 ],
    [ 5.931e-08, 2.73953602204, 219.891377577 ],
    [ 6.357e-08, 1.4013701239, 606.760185522 ],
    [ 6.528e-08, 2.95896329675, 624.919432787 ],
    [ 4.734e-08, 0.23182011937, 1063.31408345 ],
    [ 6.408e-08, 1.1668741968, 268.958238894 ],
    [ 5.179e-08, 1.95231681037, 1182.92157353 ],
    [ 4.785e-08, 1.5907152341, 420.969116584 ],
    [ 6.093e-08, 0.30791927132, 524.013706692 ],
    [ 5.161e-08, 0.14373018373, 2413.81508903 ],
    [ 4.854e-08, 5.21382590347, 3686.49611466 ],
    [ 4.648e-08, 3.71025478809, 305.085536962 ],
    [ 5.072e-08, 1.7325757494, 337.732510659 ],
    [ 4.926e-08, 2.12141378228, 104.055982065 ],
    [ 4.959e-08, 0.46912887724, 3274.12501779 ],
    [ 4.797e-08, 3.68003355961, 240.125798381 ],
    [ 4.881e-08, 2.56296192969, 980.668178359 ],
    [ 4.538e-08, 5.06386842515, 103.140958328 ],
    [ 5.243e-08, 4.56756453601, 238.901958104 ],
    [ 5.396e-08, 3.52859562249, 107.285559913 ],
    [ 4.504e-08, 1.68251875362, 196.033620051 ],
    [ 4.897e-08, 4.89294590398, 102.129566372 ],
    [ 4.329e-08, 1.45425771576, 409.92341632 ],
    [ 4.522e-08, 1.86757053063, 103.044590109 ],
    [ 5.627e-08, 1.48094428399, 105.540454773 ],
    [ 5.549e-08, 6.23714371031, 112.654001774 ],
    [ 5.089e-08, 3.40647640515, 427.119455738 ],
    [ 4.206e-08, 0.15752956829, 958.576777831 ],
    [ 5.782e-08, 3.55197606731, 25874.6040461 ],
    [ 4.946e-08, 0.49718145204, 511.53171783 ],
    [ 4.401e-08, 3.75996694142, 1171.87587327 ],
    [ 4.159e-08, 5.94760152108, 316.440053766 ],
    [ 4.129e-08, 4.67603982685, 106.013535525 ],
    [ 4.896e-08, 3.54149603851, 960.221309234 ],
    [ 5.302e-08, 2.03239262703, 2435.15573004 ],
    [ 4.083e-08, 3.22253056977, 775.233389447 ],
    [ 4.044e-08, 3.11555925708, 115.622947191 ],
    [ 4.31e-08, 4.15198847307, 823.991434223 ],
    [ 5.212e-08, 0.72733303302, 810.658112099 ],
    [ 4.007e-08, 2.01729253216, 597.359016661 ],
    [ 4.562e-08, 5.5955819649, 778.414783185 ],
    [ 4.147e-08, 2.75091730849, 316.343685547 ],
    [ 4.254e-08, 3.94241247597, 422.405405182 ],
    [ 4.6e-08, 1.45697260622, 184.987919787 ],
    [ 3.893e-08, 6.03446446847, 945.994215232 ],
    [ 4.02e-08, 1.20560354979, 850.014988014 ],
    [ 3.887e-08, 4.17726970779, 97.6761482472 ],
    [ 4.43e-08, 3.99621211317, 393.461090084 ],
    [ 3.84e-08, 1.21234108241, 212.075255161 ],
    [ 4.201e-08, 6.27730992986, 0.7507595254 ],
    [ 4.863e-08, 1.13422250397, 526.982652109 ],
    [ 4.447e-08, 1.35547164147, 211.602174409 ],
    [ 3.82e-08, 5.0365898977, 2943.50605413 ],
    [ 3.84e-08, 0.43014354282, 214.522935715 ],
    [ 4.73e-08, 3.62040936733, 638.412813606 ],
    [ 4.868e-08, 5.75868955321, 1246.65747184 ],
    [ 5.306e-08, 1.97377190922, 526.509571357 ],
    [ 3.931e-08, 2.36660571051, 909.818733055 ],
    [ 3.795e-08, 5.98201295154, 325.953097212 ],
    [ 3.66e-08, 2.77163682449, 123.539643344 ],
    [ 3.733e-08, 6.2488686605, 159.12442469 ],
    [ 3.63e-08, 5.31291201362, 406.954470903 ],
    [ 4.125e-08, 2.26202662047, 453.424893819 ],
    [ 3.804e-08, 1.94311852072, 421.181564905 ],
    [ 3.921e-08, 3.0321285021, 317.355077503 ],
    [ 4.474e-08, 0.79005911356, 838.218528225 ],
    [ 3.887e-08, 3.66517061, 216.268040855 ],
    [ 4.124e-08, 2.0769245436, 988.532484885 ],
    [ 3.826e-08, 5.00388072945, 7.6348118626 ],
    [ 3.511e-08, 0.85041677251, 299.126394269 ],
    [ 4.47e-08, 0.81353118479, 43.2890291783 ],
    [ 4.4e-08, 1.68614665169, 824.742193749 ],
    [ 3.581e-08, 2.35235960566, 337.801946628 ],
    [ 4.556e-08, 1.19671843654, 421.93232443 ],
    [ 4.606e-08, 3.48411536111, 913.963334639 ],
    [ 3.434e-08, 0.71560801606, 20.4468691251 ],
    [ 4.419e-08, 5.41935926211, 963.402702971 ],
    [ 3.733e-08, 2.84428537908, 739.057907269 ],
    [ 4.535e-08, 3.73475254758, 37.8724032069 ],
    [ 3.493e-08, 0.95852190622, 436.893131615 ],
    [ 4.367e-08, 6.08179089265, 760.25553592 ],
    [ 3.597e-08, 2.77342512545, 444.757438141 ],
    [ 3.724e-08, 0.59005210557, 256.428065922 ],
    [ 4.626e-08, 1.36732630873, 495.750715151 ],
    [ 4.325e-08, 4.75343402622, 40.8413486235 ],
    [ 4.192e-08, 1.53217061691, 298.232622392 ],
    [ 3.397e-08, 3.25386995141, 4113.09430554 ],
    [ 3.534e-08, 5.01937599581, 386.98068253 ],
    [ 4.444e-08, 2.22449419566, 318.839550211 ],
    [ 3.634e-08, 1.51814005753, 41.6444977756 ],
    [ 4.432e-08, 1.80184528105, 829.620508516 ],
    [ 3.209e-08, 1.74496507797, 952.357002707 ],
    [ 4.471e-08, 2.64501992639, 832.589453932 ],
    [ 4.17e-08, 3.10349766466, 60.7669528868 ],
    [ 3.718e-08, 4.79840355539, 238.428877352 ],
    [ 3.372e-08, 5.52902680091, 143.934122842 ],
    [ 3.231e-08, 4.07749274895, 426.486316291 ],
    [ 3.187e-08, 0.26747560612, 1354.43315884 ],
    [ 3.249e-08, 6.19660166578, 754.838909949 ],
    [ 3.832e-08, 5.62257892389, 315.42866181 ],
    [ 3.102e-08, 2.69222024207, 343.739837461 ],
    [ 4.045e-08, 4.0257062827, 376.195614697 ],
    [ 3.576e-08, 0.3853278728, 214.996016467 ],
    [ 3.231e-08, 2.48733524742, 426.710065461 ],
    [ 3.272e-08, 0.55922563072, 619.290358494 ],
    [ 3.145e-08, 5.53069704309, 402.219168488 ],
    [ 3.594e-08, 3.09973315674, 1048.33622993 ],
    [ 3.913e-08, 5.7636981168, 239.162590534 ],
    [ 3.13e-08, 0.12587768357, 3590.51688744 ],
    [ 3.223e-08, 2.37297249115, 429.518952183 ],
    [ 2.959e-08, 1.88185764818, 93.531546663 ],
    [ 3.401e-08, 5.91727053879, 570.744762039 ],
    [ 2.893e-08, 5.69690703144, 1262.38608489 ],
    [ 3.194e-08, 4.15518147251, 366.794445836 ],
    [ 3.267e-08, 2.0854191132, 806.725958836 ],
    [ 2.923e-08, 1.13173771167, 262.057140214 ],
    [ 3.342e-08, 1.79129601981, 443.863666263 ],
    [ 3.519e-08, 1.86888683578, 439.128363848 ],
    [ 3.331e-08, 6.05086663762, 108.721848511 ],
    [ 3.434e-08, 5.44390765201, 84.9335269539 ],
    [ 2.942e-08, 2.72795635418, 541.539814511 ],
    [ 2.965e-08, 0.02681640831, 221.163401964 ],
    [ 2.978e-08, 5.29375140441, 313.47110835 ],
    [ 3.473e-08, 2.06103634915, 1261.63532536 ],
    [ 3.689e-08, 1.11165149425, 395.578702239 ],
    [ 2.793e-08, 0.38781777981, 211.862806839 ],
    [ 3.181e-08, 1.01693719457, 418.000171167 ],
    [ 3.747e-08, 3.89168631842, 220.933907301 ],
    [ 3.29e-08, 0.63073796473, 3171.03224357 ],
    [ 3.086e-08, 2.17469905033, 306.830642101 ],
    [ 3.119e-08, 0.92371206211, 205.434788912 ],
    [ 2.987e-08, 2.01186468194, 117.910569051 ],
    [ 2.793e-08, 1.25466684542, 214.735384036 ],
    [ 2.715e-08, 1.86769320511, 426.810639197 ],
    [ 2.715e-08, 4.69713479126, 426.385742555 ],
    [ 2.89e-08, 0.64154774742, 263.020348061 ],
    [ 3.311e-08, 3.01441319731, 336.838738782 ],
    [ 2.746e-08, 2.69963506849, 380.388400391 ],
    [ 3.123e-08, 2.19601758733, 2.9689454166 ],
    [ 3.006e-08, 5.91067479448, 2.7083129857 ],
    [ 2.644e-08, 2.97696438264, 384.059921223 ],
    [ 3.645e-08, 5.61049552466, 423.629245459 ],
    [ 3.498e-08, 0.19746089391, 576.161388011 ],
    [ 2.794e-08, 4.27284753268, 4010.00153132 ],
    [ 3.389e-08, 1.49948217445, 885.439710666 ],
    [ 2.663e-08, 4.57051350603, 361.377819864 ],
    [ 3.034e-08, 2.0812482269, 2751.54759969 ],
    [ 2.581e-08, 0.17405799614, 1056.20053645 ],
    [ 3.049e-08, 1.03668168368, 732.695119794 ],
    [ 2.559e-08, 3.9647117139, 430.79097657 ],
    [ 2.715e-08, 6.16166361673, 572.229234747 ],
    [ 2.534e-08, 5.31015667874, 427.348950401 ],
    [ 2.591e-08, 4.91947374252, 464.731226514 ],
    [ 2.715e-08, 4.628028769, 140.965177426 ],
    [ 2.58e-08, 3.27421375191, 136.069816316 ],
    [ 2.605e-08, 0.99538186951, 92.3077063856 ],
    [ 2.498e-08, 0.20316576938, 110.254505329 ],
    [ 2.592e-08, 4.30914764493, 561.934294009 ],
    [ 3.139e-08, 5.41283857071, 328.240719073 ],
    [ 2.668e-08, 1.90490897736, 88.1149206916 ],
    [ 2.975e-08, 3.34497161574, 273.853600004 ],
    [ 2.896e-08, 5.62348887158, 1699.2792165 ],
    [ 3.016e-08, 1.06868053473, 7.8643065262 ],
    [ 2.711e-08, 2.27577147546, 519.396024356 ],
    [ 2.646e-08, 1.38294890847, 460.53844082 ],
    [ 2.67e-08, 2.55002171454, 195.890607699 ],
    [ 2.465e-08, 3.82257543008, 77.7505439839 ],
    [ 2.86e-08, 2.57578667803, 505.311942706 ],
    [ 2.909e-08, 0.81750588929, 45.5766510387 ],
    [ 2.434e-08, 4.67002316303, 2840.41327991 ],
    [ 3.297e-08, 1.33975572602, 305.606801824 ],
    [ 3.36e-08, 3.38474137719, 162.093370107 ],
    [ 3.327e-08, 2.32322471286, 285.37238102 ],
    [ 2.434e-08, 3.71460437051, 4216.18707975 ],
    [ 2.4e-08, 4.51737346541, 540.736665358 ],
    [ 2.506e-08, 1.31681285875, 36.6485629295 ],
    [ 2.388e-08, 1.13864271701, 23.5758732361 ],
    [ 2.367e-08, 0.92796234913, 757.217154534 ],
    [ 3.057e-08, 1.71218695964, 256.588124616 ],
    [ 2.342e-08, 1.45192564703, 131.546962222 ],
    [ 2.514e-08, 0.09021648201, 206.936307963 ],
    [ 3.153e-08, 0.85842354898, 705.117657326 ],
    [ 2.412e-08, 0.54879873444, 107.758640665 ],
    [ 2.427e-08, 2.04627850771, 124.50285119 ],
    [ 2.32e-08, 0.02863836432, 317.142629182 ],
    [ 2.632e-08, 1.41253794767, 211.654564035 ],
    [ 2.871e-08, 5.74770120564, 322.020943949 ],
    [ 2.296e-08, 1.38115687263, 425.847431351 ],
    [ 3.103e-08, 1.03244576602, 100.384461233 ],
    [ 2.323e-08, 4.89135719082, 3259.89792378 ],
    [ 2.708e-08, 5.36850947426, 432.014816847 ],
    [ 3.21e-08, 4.49278521063, 432.227265169 ],
    [ 2.276e-08, 6.04688191978, 214.10224459 ],
    [ 2.276e-08, 1.96882478275, 212.495946286 ],
    [ 2.501e-08, 3.320560631, 110.15813711 ],
    [ 2.829e-08, 2.66887892162, 141.486442287 ],
    [ 3.092e-08, 6.00298888734, 465.955066791 ],
    [ 2.246e-08, 2.10578934642, 441.576044403 ],
    [ 2.314e-08, 5.22234612103, 303.861696684 ],
    [ 2.588e-08, 0.08042775105, 133.100870899 ],
    [ 2.292e-08, 5.00278268122, 431.264057322 ],
    [ 2.856e-08, 5.42593711539, 315.168029379 ],
    [ 2.201e-08, 5.91127594022, 867.423475754 ],
    [ 2.749e-08, 1.42536872532, 42.5382696529 ],
    [ 3.057e-08, 6.17400625369, 109.243113373 ],
    [ 2.263e-08, 4.62327588198, 188.026301173 ],
    [ 2.484e-08, 4.68809498416, 1596.18644228 ],
    [ 2.774e-08, 0.96127776136, 41.0537969446 ],
    [ 2.274e-08, 4.94055830711, 4002.88798432 ],
    [ 2.541e-08, 0.837056152, 12352.8526045 ],
    [ 2.645e-08, 4.96474980727, 710.746731618 ],
    [ 2.236e-08, 5.4872957114, 200.556474145 ],
    [ 2.872e-08, 2.64762368923, 39.6175083461 ],
    [ 2.122e-08, 4.04560058177, 118.070627746 ],
    [ 2.944e-08, 3.7669979763, 428.082663584 ],
    [ 2.245e-08, 5.67078632283, 6467.92575796 ],
    [ 2.227e-08, 1.15684015463, 227.313741118 ],
    [ 2.541e-08, 1.09551842708, 184.727287356 ],
    [ 2.311e-08, 6.13117019885, 2730.20695869 ],
    [ 2.523e-08, 1.75026771081, 1578.02719502 ],
    [ 2.826e-08, 1.01897881938, 87.3117715395 ],
    [ 2.703e-08, 1.25988186933, 28.5718080822 ],
    [ 2.174e-08, 1.2246785241, 209.154493854 ],
    [ 2.079e-08, 3.44743142758, 111.169529066 ],
    [ 2.068e-08, 4.72242654672, 765.884610212 ],
    [ 2.111e-08, 2.19792675105, 449.232108125 ],
    [ 2.456e-08, 4.30511454445, 1382.88734685 ],
    [ 2.072e-08, 0.60946281465, 335.141817752 ],
    [ 2.761e-08, 6.07901608056, 2914.01423582 ],
    [ 2.235e-08, 2.8862513313, 207.079320314 ],
    [ 2.04e-08, 2.51317012035, 426.858823307 ],
    [ 2.068e-08, 4.24177127582, 96.8729990951 ],
    [ 2.212e-08, 1.21619926123, 640.860494161 ],
    [ 2.39e-08, 0.8172671045, 550.13783422 ],
    [ 2.518e-08, 2.99015150463, 745.277682393 ],
    [ 2.04e-08, 4.05168623017, 426.337558445 ],
    [ 2.189e-08, 1.65687779035, 219.661882913 ],
    [ 2.529e-08, 4.34280337125, 221.897115147 ],
    [ 2.554e-08, 5.56906813525, 214.192867315 ],
    [ 2.712e-08, 1.60469055821, 1050.9963588 ],
    [ 2.204e-08, 0.3895960191, 217.443697022 ],
    [ 2.252e-08, 3.46799691105, 481.73606947 ],
    [ 2.542e-08, 1.31713271917, 462.022913528 ],
    [ 2.035e-08, 1.13356999548, 842.901441013 ],
    [ 2.013e-08, 2.6145733766, 315.641110131 ],
    [ 1.985e-08, 2.98251882415, 668.208461965 ],
    [ 1.995e-08, 5.36620538717, 1041.22268292 ],
    [ 2.357e-08, 1.94161571159, 233.906023258 ],
    [ 2.072e-08, 2.97593151443, 304.122329115 ],
    [ 2.04e-08, 2.04492641594, 1097.0942747 ],
    [ 2.139e-08, 3.12500079869, 1276.61317889 ],
    [ 2.712e-08, 1.49710379225, 3340.6124267 ],
    [ 2.138e-08, 4.52114042572, 378.903927683 ],
    [ 2.708e-08, 0.01014338187, 389.949627947 ],
    [ 1.989e-08, 2.66756812577, 301.41401613 ],
    [ 2.281e-08, 3.34201090267, 220.200194118 ],
    [ 1.944e-08, 0.04553582326, 16.6747745564 ],
    [ 1.941e-08, 5.52054449349, 175.426692231 ],
    [ 2.377e-08, 3.03550341735, 774.482629922 ],
    [ 2.049e-08, 0.2785818143, 146.594251718 ],
    [ 1.907e-08, 1.80796641977, 192.852226313 ],
    [ 2.014e-08, 2.26726355818, 198.10879359 ],
    [ 1.894e-08, 4.66837052854, 220.300767854 ],
    [ 1.953e-08, 3.95325956567, 103.61403908 ],
    [ 1.985e-08, 0.60283431486, 3487.42411322 ],
    [ 1.907e-08, 0.26838618029, 171.654597662 ],
    [ 2.397e-08, 4.52014748152, 484.705014887 ],
    [ 2.215e-08, 2.81175588657, 25.1297819136 ],
    [ 2.065e-08, 1.44937608998, 864.242082016 ],
    [ 2.626e-08, 5.01886635967, 1269.49963189 ],
    [ 1.973e-08, 2.7356494941, 14.0146456805 ],
    [ 2.433e-08, 3.72005264961, 25558.2121765 ],
    [ 1.878e-08, 5.62259036586, 1310.39337014 ],
    [ 1.908e-08, 0.17685540317, 244.791664827 ],
    [ 2.49e-08, 4.74033063304, 637.449605759 ],
    [ 1.974e-08, 2.68790170927, 769.816763476 ],
    [ 1.843e-08, 0.0168396279, 233.745964563 ],
    [ 2.002e-08, 4.17267014873, 315.870604795 ],
    [ 2.107e-08, 2.88563182217, 328.922042629 ],
    [ 2.506e-08, 5.73769491309, 544.508759927 ],
    [ 1.836e-08, 3.41496980986, 195.77298762 ],
    [ 2.554e-08, 2.35660179716, 212.405323561 ],
    [ 2.133e-08, 3.38876216948, 420.005908737 ],
    [ 2.515e-08, 1.52053666175, 170.01006626 ],
    [ 1.825e-08, 2.10573290416, 326.686810395 ],
    [ 1.825e-08, 4.04945265223, 190.404545758 ]
    // 777 terms retained
];

KMG.VSOPTerms.saturn_R1 = [
    [ 0.0618298134, 0.2584351148, 213.299095438 ],
    [ 0.00506577242, 0.71114625261, 206.185548437 ],
    [ 0.00341394029, 5.79635741658, 426.598190876 ],
    [ 0.00188491195, 0.47215589652, 220.412642439 ],
    [ 0.00186261486, 3.14159265359, 0 ],
    [ 0.00143891146, 1.40744822888, 7.1135470008 ],
    [ 0.00049621208, 6.0174427982, 103.092774219 ],
    [ 0.00020928426, 5.09244947411, 639.897286314 ],
    [ 0.00019952564, 1.1756060613, 419.484643875 ],
    [ 0.00018839544, 1.60818334043, 110.206321219 ],
    [ 0.00012892843, 5.9432943302, 433.711737877 ],
    [ 0.00013876849, 0.75884928866, 199.072001436 ],
    [ 5.396842e-05, 1.28853589711, 14.2270940016 ],
    [ 4.869289e-05, 0.86797227054, 323.505416657 ],
    [ 4.247221e-05, 0.39294984732, 227.52618944 ],
    [ 3.252331e-05, 1.2585015433, 95.9792272178 ],
    [ 2.856066e-05, 2.1673128387, 735.876513532 ],
    [ 2.90954e-05, 4.60680719251, 202.253395174 ],
    [ 3.08141e-05, 3.43662543526, 522.577418094 ],
    [ 1.987731e-05, 2.45053765034, 412.371096874 ],
    [ 1.941443e-05, 6.02392296904, 209.366942175 ],
    [ 1.581782e-05, 1.29189091556, 210.1177017 ],
    [ 1.339521e-05, 4.30812522038, 853.196381752 ],
    [ 1.315459e-05, 1.25295611814, 117.31986822 ],
    [ 1.202869e-05, 1.86661895487, 316.391869657 ],
    [ 1.090827e-05, 0.07529636493, 216.480489176 ],
    [ 9.543e-06, 5.15171167674, 647.010833315 ],
    [ 9.65957e-06, 0.47988871608, 632.783739313 ],
    [ 8.82063e-06, 1.88467410042, 1052.26838319 ],
    [ 8.7431e-06, 1.40216274572, 224.344795702 ],
    [ 8.97508e-06, 0.98347755563, 529.690965095 ],
    [ 7.84828e-06, 3.06374185689, 838.96928775 ],
    [ 7.39765e-06, 1.38209924525, 625.670192312 ],
    [ 6.1293e-06, 3.03309390383, 63.7358983034 ],
    [ 6.58132e-06, 4.1437471502, 309.278322656 ],
    [ 6.4959e-06, 1.72473111863, 742.990060533 ],
    [ 5.99227e-06, 2.54946247931, 217.231248701 ],
    [ 5.02951e-06, 2.12941646895, 3.9321532631 ],
    [ 4.12937e-06, 4.59321186186, 415.552490612 ],
    [ 3.55987e-06, 2.30328555624, 728.762966531 ],
    [ 3.44652e-06, 5.88820160547, 440.825284878 ],
    [ 3.94995e-06, 0.5339710376, 956.289155971 ],
    [ 3.35677e-06, 1.61590789073, 1368.66025285 ],
    [ 3.62976e-06, 4.7059780752, 302.164775655 ],
    [ 3.21577e-06, 0.9793235123, 3.1813937377 ],
    [ 2.77708e-06, 0.25951592662, 195.139848173 ],
    [ 2.9118e-06, 2.8313701005, 1155.36115741 ],
    [ 2.65342e-06, 2.42688922787, 88.865680217 ],
    [ 2.6462e-06, 5.82810809153, 149.563197135 ],
    [ 3.16952e-06, 3.58395969651, 515.463871093 ],
    [ 2.94362e-06, 2.81544110682, 11.0457002639 ],
    [ 2.44591e-06, 1.04536406733, 942.062061969 ],
    [ 2.15355e-06, 3.56547915194, 490.334089179 ],
    [ 2.63891e-06, 1.2857730655, 1059.38193019 ],
    [ 2.45985e-06, 0.90791252506, 191.958454436 ],
    [ 2.21909e-06, 5.13181138104, 269.921446741 ],
    [ 1.95132e-06, 4.56582271431, 846.082834751 ],
    [ 1.82943e-06, 2.67926427647, 127.471796607 ],
    [ 1.81431e-06, 4.93450656865, 74.7815985673 ],
    [ 1.74706e-06, 3.44549385972, 137.033024162 ],
    [ 1.65475e-06, 5.99806063883, 536.804512095 ],
    [ 1.54921e-06, 1.19719941288, 265.989293477 ],
    [ 1.69692e-06, 4.63444302692, 284.148540742 ],
    [ 1.5125e-06, 0.5284507406, 330.618963658 ],
    [ 1.523e-06, 5.43871996026, 422.666037613 ],
    [ 1.40611e-06, 2.02083462656, 1045.15483619 ],
    [ 1.57686e-06, 2.99426635258, 340.770892045 ],
    [ 1.39555e-06, 1.35322655321, 1685.0521225 ],
    [ 1.4099e-06, 1.2711804015, 203.004154699 ],
    [ 1.35874e-06, 5.01655087212, 351.816592309 ],
    [ 1.53415e-06, 0.26924047897, 1272.68102563 ],
    [ 1.29293e-06, 1.14375799011, 21.3406410024 ],
    [ 1.2781e-06, 2.53730683511, 1471.75302706 ],
    [ 1.26354e-06, 3.00342230503, 277.034993741 ],
    [ 1.00208e-06, 3.61417145482, 1066.49547719 ],
    [ 1.03009e-06, 0.38169227203, 203.737867882 ],
    [ 1.07261e-06, 4.31791292903, 210.851414883 ],
    [ 9.6106e-07, 0.79400471601, 1258.45393163 ],
    [ 8.2432e-07, 0.2813059475, 234.63973644 ],
    [ 9.8329e-07, 2.56113375171, 191.20769491 ],
    [ 9.7253e-07, 3.26221061562, 831.85574075 ],
    [ 7.2231e-07, 4.37989037807, 860.309928753 ],
    [ 7.0663e-07, 0.73027101376, 437.64389114 ],
    [ 7.0354e-07, 0.876511385, 423.416797138 ],
    [ 7.1862e-07, 5.58023540653, 429.779584614 ],
    [ 7.3026e-07, 0.62391865714, 1375.77379985 ],
    [ 6.6398e-07, 2.68226810752, 405.257549874 ],
    [ 6.35e-07, 1.751479302, 1361.54670584 ],
    [ 6.1591e-07, 1.09281357936, 2001.44399216 ],
    [ 6.7049e-07, 0.06892389889, 408.438943611 ],
    [ 6.8948e-07, 2.47236189878, 949.17560897 ],
    [ 6.0266e-07, 2.25229650271, 1788.14489672 ],
    [ 6.6978e-07, 5.45314123697, 200.768922466 ],
    [ 6.5588e-07, 0.05566059213, 1589.07289528 ],
    [ 4.938e-07, 4.17156251836, 138.517496871 ],
    [ 5.5431e-07, 4.59287180519, 628.85158605 ],
    [ 5.0576e-07, 6.26929954106, 223.594036176 ],
    [ 4.7838e-07, 0.83640381014, 10.2949407385 ],
    [ 4.6677e-07, 2.17434678208, 312.199083963 ],
    [ 5.4368e-07, 0.2824567414, 124.433415221 ],
    [ 4.9402e-07, 3.79857810717, 215.746775993 ],
    [ 3.9837e-07, 5.17790796777, 1478.86657406 ],
    [ 3.9385e-07, 0.56431193299, 1574.84580128 ],
    [ 3.4944e-07, 4.68657210063, 38.1330356378 ],
    [ 3.6698e-07, 0.62957662315, 52.6901980395 ],
    [ 4.2625e-07, 2.98722916534, 1148.24761041 ],
    [ 3.9684e-07, 0.28575318525, 131.40394987 ],
    [ 3.1822e-07, 5.18978322396, 76.2660712756 ],
    [ 3.2894e-07, 1.97423476342, 142.449650134 ],
    [ 4.1928e-07, 4.82822003035, 288.080694005 ],
    [ 3.0753e-07, 1.47899080224, 1677.9385755 ],
    [ 4.2664e-07, 3.38153700265, 208.633228992 ],
    [ 2.924e-07, 4.95613345683, 1795.25844372 ],
    [ 2.9268e-07, 5.09912997273, 654.124380316 ],
    [ 3.2781e-07, 6.12212232937, 145.631043871 ],
    [ 2.8968e-07, 2.74363421275, 404.506790348 ],
    [ 2.8114e-07, 0.83461605023, 2317.83586181 ],
    [ 2.7672e-07, 2.24392488187, 430.530344139 ],
    [ 2.9995e-07, 1.96800014066, 2104.53676638 ],
    [ 3.3001e-07, 3.28430957393, 222.860322994 ],
    [ 3.185e-07, 6.0254624462, 1905.46476494 ],
    [ 2.7041e-07, 5.24903909688, 388.465155238 ],
    [ 2.6641e-07, 0.99264332766, 107.024927482 ],
    [ 2.551e-07, 2.87428732059, 703.633184617 ],
    [ 2.5131e-07, 6.23420740285, 106.274167956 ],
    [ 2.4878e-07, 1.07497317697, 99.9113804809 ],
    [ 2.4759e-07, 0.80405733736, 312.459716394 ],
    [ 2.4276e-07, 0.55199141887, 214.262303285 ],
    [ 2.8499e-07, 0.83349243224, 1692.1656695 ],
    [ 2.3219e-07, 5.08264293708, 479.288388915 ],
    [ 2.4526e-07, 3.10619175315, 212.335887592 ],
    [ 2.2349e-07, 3.90137970384, 563.631215038 ],
    [ 2.2702e-07, 4.87840606475, 295.051228654 ],
    [ 2.1955e-07, 6.06698971563, 85.8272988312 ],
    [ 2.1324e-07, 5.10526973374, 333.657345044 ],
    [ 2.6085e-07, 2.20779309963, 1265.56747863 ],
    [ 2.0837e-07, 3.28797767286, 70.8494453042 ],
    [ 2.1581e-07, 3.79617408343, 347.884439046 ],
    [ 2.1654e-07, 3.08846245324, 554.069987483 ],
    [ 2.2052e-07, 4.22754164002, 217.964961884 ],
    [ 2.0731e-07, 1.68960056607, 231.458342703 ],
    [ 2.0494e-07, 2.46182647087, 18.1592472647 ],
    [ 2.0925e-07, 0.39175133338, 319.573263394 ],
    [ 2.6026e-07, 4.27724058407, 483.220542179 ],
    [ 2.0643e-07, 5.12362856107, 362.862292573 ],
    [ 2.2054e-07, 5.50298000967, 343.2185726 ],
    [ 1.9345e-07, 2.01922865065, 313.210475919 ],
    [ 2.0192e-07, 5.08643103603, 750.103607533 ],
    [ 2.0028e-07, 3.42922105654, 213.347279548 ],
    [ 2.4142e-07, 0.64640167712, 207.882469467 ],
    [ 2.1796e-07, 0.73044797708, 99.1606209555 ],
    [ 1.727e-07, 4.71665063052, 2111.65031338 ],
    [ 2.0982e-07, 2.69008992251, 1464.63948006 ],
    [ 1.8742e-07, 0.05702129406, 245.542424352 ],
    [ 1.7629e-07, 3.83853708584, 497.44763618 ],
    [ 1.6065e-07, 4.229802702, 565.115687747 ],
    [ 2.1656e-07, 4.16347847969, 2.4476805548 ],
    [ 1.7e-07, 1.40795878071, 114.138474483 ],
    [ 1.5876e-07, 0.27065386568, 225.82926841 ],
    [ 1.5852e-07, 1.20805133747, 1994.33044516 ],
    [ 1.547e-07, 2.82288536731, 81.7521332162 ],
    [ 1.6429e-07, 3.03873564611, 134.585343608 ],
    [ 1.5136e-07, 3.85043836712, 1162.47470441 ],
    [ 1.6356e-07, 4.94371307069, 357.445666601 ],
    [ 1.5753e-07, 0.32401034699, 1891.23767094 ],
    [ 2.0149e-07, 0.23046694374, 213.250911328 ],
    [ 1.5979e-07, 1.70399938448, 2420.92863603 ],
    [ 1.82e-07, 5.69547541771, 56.6223513026 ],
    [ 1.3748e-07, 0.57922924289, 2634.22773147 ],
    [ 1.3932e-07, 5.71088147183, 92.0470739547 ],
    [ 1.7364e-07, 3.55895968238, 218.928169731 ],
    [ 1.527e-07, 1.31086107175, 216.219856745 ],
    [ 1.2507e-07, 5.19472995904, 635.965133051 ],
    [ 1.2805e-07, 1.60063026728, 320.32402292 ],
    [ 1.303e-07, 0.4651576165, 1169.58825141 ],
    [ 1.1971e-07, 5.95102208296, 543.918059096 ],
    [ 1.2216e-07, 2.45946622951, 721.64941953 ],
    [ 1.181e-07, 2.80512639599, 217.491881132 ],
    [ 1.469e-07, 5.56197626202, 344.703045308 ],
    [ 1.2762e-07, 1.63557330778, 273.102840478 ],
    [ 1.3314e-07, 5.76062418273, 2221.8566346 ],
    [ 1.1988e-07, 1.77229641324, 160.608897399 ],
    [ 1.4265e-07, 0.44725822344, 2008.55753916 ],
    [ 1.2411e-07, 1.01142427141, 329.725191781 ],
    [ 1.0525e-07, 1.5767134547, 212.777830576 ],
    [ 1.2743e-07, 1.9146399978, 1581.95934828 ],
    [ 1.1823e-07, 4.4365410311, 32.2433289144 ],
    [ 1.2921e-07, 3.76048627039, 508.350324092 ],
    [ 1.1939e-07, 4.31098492065, 618.556645312 ],
    [ 1.1699e-07, 5.10149029775, 4.665866446 ],
    [ 1.0438e-07, 2.42664333945, 546.956440482 ],
    [ 1.078e-07, 0.76340329047, 218.715721409 ],
    [ 9.965e-08, 0.48733890713, 305.346169393 ],
    [ 1.1374e-07, 3.00672855291, 198.321241911 ],
    [ 1.0188e-07, 2.65217753299, 416.303250138 ],
    [ 9.359e-08, 4.45945668775, 2428.04218303 ],
    [ 9.868e-08, 4.04952727454, 62.2514255951 ],
    [ 9.739e-08, 1.60270650693, 327.43756992 ],
    [ 1.2641e-07, 3.43384418096, 258.875746477 ],
    [ 1.121e-07, 2.41205097192, 1781.03134972 ],
    [ 9.176e-08, 5.46534060702, 414.068017904 ],
    [ 9.835e-08, 3.30296833339, 275.550521033 ],
    [ 1.0477e-07, 2.07668803958, 213.8203603 ],
    [ 9.044e-08, 2.92586386765, 1279.79457263 ],
    [ 9.29e-08, 1.11465540663, 113.387714957 ],
    [ 1.1089e-07, 1.89011533636, 561.183534484 ],
    [ 1.2015e-07, 3.70960372833, 350.3321196 ],
    [ 8.585e-08, 2.17607151845, 425.113718168 ],
    [ 8.579e-08, 1.94628753992, 35.4247226521 ],
    [ 1.0057e-07, 0.09011158121, 182.279606801 ],
    [ 8.39e-08, 3.76818315225, 251.432131076 ],
    [ 8.492e-08, 0.36083046533, 617.805885786 ],
    [ 8.386e-08, 1.809452749, 629.602345575 ],
    [ 8.172e-08, 5.14289867445, 22.0914005278 ],
    [ 8.147e-08, 5.32044581723, 65.2203710117 ],
    [ 8.151e-08, 1.4090773496, 1.4844727083 ],
    [ 7.981e-08, 0.94228723999, 2310.72231481 ],
    [ 8.963e-08, 6.16236845633, 621.738039049 ],
    [ 8.224e-08, 0.88795773141, 1485.98012107 ],
    [ 8.265e-08, 3.45191137955, 424.150510321 ],
    [ 8.824e-08, 0.54099064621, 168.052512799 ],
    [ 8.012e-08, 3.37491453205, 144.146571163 ],
    [ 7.866e-08, 5.14081759801, 358.93013931 ],
    [ 7.478e-08, 5.75449166453, 447.938831878 ],
    [ 8.368e-08, 0.33514647428, 278.51946645 ],
    [ 8.084e-08, 1.42623557144, 2737.32050569 ],
    [ 8.08e-08, 0.95897295917, 767.369082921 ],
    [ 7.277e-08, 2.18375316605, 264.504820769 ],
    [ 8.067e-08, 5.44034962793, 254.943593214 ],
    [ 6.773e-08, 1.1989380823, 5.4166259714 ],
    [ 8.896e-08, 4.89270901021, 120.358249606 ],
    [ 6.488e-08, 0.32888478249, 2950.61960113 ],
    [ 7.86e-08, 4.5700621406, 280.967147005 ],
    [ 6.488e-08, 3.47445744281, 9.5612275556 ],
    [ 6.985e-08, 3.4022840938, 98.8999885246 ],
    [ 7.599e-08, 4.50333322023, 5.6290742925 ],
    [ 8.097e-08, 0.92606736676, 636.715892576 ],
    [ 6.142e-08, 0.18131149711, 2207.6295406 ],
    [ 6.045e-08, 4.66728537547, 543.024287219 ],
    [ 6.4e-08, 2.12819280953, 274.066048325 ],
    [ 7.002e-08, 3.84517008953, 214.049854963 ],
    [ 6.481e-08, 5.31032923608, 6076.89030155 ],
    [ 5.952e-08, 6.15854896065, 650.942986578 ],
    [ 5.742e-08, 3.56573285563, 1073.60902419 ],
    [ 6.438e-08, 0.44934410249, 10007.0999978 ],
    [ 5.6e-08, 3.61451790802, 125.987323898 ],
    [ 6.258e-08, 3.20899178273, 219.449434592 ],
    [ 7.713e-08, 0.11144371545, 2324.94940882 ],
    [ 5.527e-08, 3.83851162143, 181.055766524 ],
    [ 5.774e-08, 3.03123084747, 121.252021483 ],
    [ 6.617e-08, 1.63984257878, 1898.35121794 ],
    [ 5.881e-08, 1.04006410206, 9992.87290377 ],
    [ 5.831e-08, 5.91627455087, 6062.66320755 ],
    [ 5.653e-08, 2.25485721003, 1038.04128919 ],
    [ 5.908e-08, 6.12631666036, 209.106309744 ],
    [ 5.728e-08, 0.81535963664, 472.174841915 ],
    [ 6.279e-08, 2.11442272676, 2097.42321938 ],
    [ 5.56e-08, 5.81253256927, 237.678117826 ],
    [ 6.143e-08, 4.62450813686, 207.670021145 ],
    [ 5.249e-08, 0.56512879469, 192.692167619 ],
    [ 5.148e-08, 4.85160826999, 267.473766186 ],
    [ 5.33e-08, 4.83867853829, 643.078680052 ],
    [ 6.257e-08, 0.76885025825, 210.378334131 ],
    [ 5.006e-08, 0.8361738184, 247.239345382 ],
    [ 5.102e-08, 4.01017179605, 205.222340591 ],
    [ 6.589e-08, 1.80207391594, 12.5301729722 ],
    [ 4.958e-08, 0.25209781984, 129.919477162 ],
    [ 4.879e-08, 4.01833561013, 487.365143763 ],
    [ 4.82e-08, 4.1773567487, 2744.43405269 ],
    [ 5.028e-08, 4.49963257372, 291.262087743 ],
    [ 5.754e-08, 5.50273050205, 2538.24850425 ],
    [ 5.717e-08, 0.56525356391, 116.426096343 ],
    [ 4.721e-08, 5.57698903711, 342.255364753 ],
    [ 5.961e-08, 5.13028344752, 692.587484354 ],
    [ 5.005e-08, 2.67919325691, 417.03696332 ],
    [ 5.371e-08, 3.84343543583, 842.150681488 ],
    [ 4.699e-08, 3.17263913075, 148.078724426 ],
    [ 6.196e-08, 3.80255973994, 339.286419336 ],
    [ 4.531e-08, 5.71955873189, 252.655971353 ],
    [ 5.557e-08, 0.95921182693, 1802.37199072 ],
    [ 5.441e-08, 4.39196994952, 196.624320882 ],
    [ 4.437e-08, 4.92360676724, 184.094147909 ],
    [ 4.981e-08, 1.60730372548, 166.828672522 ],
    [ 4.867e-08, 0.84582358902, 46.470422916 ],
    [ 4.524e-08, 0.25012053389, 128.956269315 ],
    [ 5.519e-08, 6.18074896704, 337.732510659 ],
    [ 5.817e-08, 5.953264978, 486.401935916 ],
    [ 4.49e-08, 4.7275613628, 151.047669843 ],
    [ 4.229e-08, 4.19753271868, 685.473937353 ],
    [ 4.822e-08, 1.53957590355, 214.783568146 ],
    [ 4.259e-08, 4.89602700674, 14.977853527 ],
    [ 3.976e-08, 2.98413489266, 380.12776796 ],
    [ 4.711e-08, 3.65759071858, 189.723222202 ],
    [ 4.351e-08, 5.42665964067, 436.893131615 ],
    [ 3.867e-08, 3.04703905658, 409.92341632 ],
    [ 4.121e-08, 5.81711354467, 491.818561888 ],
    [ 3.858e-08, 0.73540020809, 2627.11418447 ],
    [ 4.17e-08, 1.17103665385, 3053.71237535 ],
    [ 3.964e-08, 3.09877355914, 710.746731618 ],
    [ 3.7e-08, 1.27418723826, 211.81462273 ],
    [ 4.811e-08, 0.47066044488, 248.72381809 ],
    [ 4.996e-08, 3.35730909586, 824.742193749 ],
    [ 3.907e-08, 3.45934568477, 220.460826549 ],
    [ 3.565e-08, 4.52827067299, 488.849616471 ],
    [ 4.85e-08, 3.70375230989, 235.390495966 ],
    [ 3.549e-08, 2.24093365926, 135.336103133 ],
    [ 3.551e-08, 2.90115048624, 411.620337349 ],
    [ 3.559e-08, 1.11004317365, 6283.07584999 ],
    [ 3.56e-08, 4.54293796144, 601.764250676 ],
    [ 3.527e-08, 1.56280584377, 643.829439577 ],
    [ 3.817e-08, 0.98122521854, 271.405919449 ],
    [ 3.702e-08, 5.5090303582, 458.84151979 ],
    [ 3.603e-08, 3.52371843525, 244.318584075 ],
    [ 3.972e-08, 5.20379695714, 114.399106913 ],
    [ 3.63e-08, 2.21149516722, 2.9207613068 ],
    [ 4.441e-08, 3.75471250684, 699.701031354 ],
    [ 3.314e-08, 4.27527294246, 867.423475754 ],
    [ 4.15e-08, 4.21425727533, 501.379789443 ],
    [ 3.259e-08, 4.47232416065, 289.565166714 ],
    [ 3.887e-08, 4.78383139539, 175.1660598 ],
    [ 3.404e-08, 3.49533217629, 963.402702971 ],
    [ 3.223e-08, 5.89367074982, 131.546962222 ],
    [ 3.223e-08, 1.95410765469, 212.027071051 ],
    [ 3.321e-08, 1.95836137959, 1354.43315884 ],
    [ 3.805e-08, 6.2127100829, 268.436974032 ],
    [ 3.38e-08, 1.80720303188, 756.323382657 ],
    [ 3.098e-08, 2.15477201622, 916.932280055 ],
    [ 3.098e-08, 5.5171211947, 24.3790223882 ],
    [ 3.082e-08, 6.14482751895, 3267.01147078 ],
    [ 3.113e-08, 4.13740456117, 533.623118358 ],
    [ 3.625e-08, 3.76005340828, 204.701075729 ],
    [ 3.657e-08, 5.27032709245, 67.6680515665 ],
    [ 4.003e-08, 6.07055704991, 2641.34127847 ],
    [ 2.882e-08, 0.84196326695, 444.757438141 ],
    [ 3.196e-08, 2.69187071972, 426.646374986 ],
    [ 3.514e-08, 1.39367720888, 2214.7430876 ],
    [ 3.381e-08, 3.69723542122, 229.973869994 ],
    [ 2.85e-08, 4.48074469649, 241.610271089 ],
    [ 2.893e-08, 1.51207793298, 945.994215232 ],
    [ 3.959e-08, 5.96505772017, 212.548335913 ],
    [ 3.54e-08, 1.30228911976, 69.1525242748 ],
    [ 3.081e-08, 5.73491728749, 282.664068034 ],
    [ 3.059e-08, 2.59797438443, 905.886579792 ],
    [ 2.794e-08, 3.44247926079, 188.92007305 ],
    [ 2.797e-08, 0.03214799691, 427.561398722 ],
    [ 2.912e-08, 1.70578054502, 28.3111756513 ],
    [ 2.788e-08, 0.01934629259, 681.54178409 ],
    [ 2.781e-08, 1.05617356654, 28.4541880032 ],
    [ 3.005e-08, 3.90461328299, 526.509571357 ],
    [ 3.279e-08, 2.64942711439, 739.808666795 ],
    [ 2.679e-08, 3.42065965187, 778.414783185 ],
    [ 2.687e-08, 3.21965090864, 776.930310476 ],
    [ 3.193e-08, 2.72165081797, 432.227265169 ],
    [ 3.225e-08, 0.99672485298, 2118.76386038 ],
    [ 3.232e-08, 1.87653144247, 2413.81508903 ],
    [ 2.634e-08, 2.55045330366, 10213.2855462 ],
    [ 2.591e-08, 5.44639271736, 305.085536962 ],
    [ 2.937e-08, 0.8421987444, 2435.15573004 ],
    [ 2.594e-08, 5.42212771611, 207.148756284 ],
    [ 2.552e-08, 3.86374272953, 3060.82592235 ],
    [ 2.549e-08, 5.91713564413, 439.128363848 ],
    [ 2.989e-08, 2.5569061971, 425.63498303 ],
    [ 3.263e-08, 2.59868619716, 213.038463007 ],
    [ 3.107e-08, 4.04496319473, 6.1503391543 ],
    [ 2.506e-08, 0.17179793992, 945.243455707 ],
    [ 2.829e-08, 4.8374091254, 397.393243347 ],
    [ 3.167e-08, 5.70962048994, 381.351608237 ],
    [ 3.274e-08, 6.27291197136, 421.181564905 ],
    [ 2.499e-08, 5.28733779933, 299.126394269 ],
    [ 2.584e-08, 4.23448348275, 195.890607699 ],
    [ 3.275e-08, 0.27673788021, 201.519681991 ],
    [ 2.58e-08, 2.62721090534, 213.187220853 ],
    [ 2.491e-08, 5.85060777804, 738.797274839 ],
    [ 2.541e-08, 2.56639705704, 140.001969579 ],
    [ 2.529e-08, 1.99070587972, 319.312630963 ],
    [ 2.467e-08, 3.42927288151, 4.192785694 ],
    [ 2.42e-08, 2.36333597473, 84.3428261229 ],
    [ 2.372e-08, 2.19097141324, 17.2654753874 ],
    [ 2.346e-08, 3.77641630157, 206.233732547 ],
    [ 2.77e-08, 0.44868346595, 285.633013451 ],
    [ 2.461e-08, 5.42065334253, 395.578702239 ],
    [ 2.352e-08, 0.63041319237, 210.590782452 ],
    [ 2.556e-08, 0.31798127807, 326.686810395 ],
    [ 3.257e-08, 5.02353259776, 313.944189102 ],
    [ 2.396e-08, 4.05648460784, 519.396024356 ],
    [ 2.563e-08, 1.24842307195, 724.830813268 ],
    [ 2.439e-08, 3.49398086505, 431.264057322 ],
    [ 2.299e-08, 0.13437111088, 2524.02141025 ],
    [ 2.299e-08, 4.51974731455, 228.276948965 ],
    [ 2.515e-08, 0.70044371265, 2943.50605413 ],
    [ 3.111e-08, 2.77650913154, 732.695119794 ],
    [ 2.453e-08, 3.14780313298, 170.760825785 ],
    [ 2.673e-08, 3.33934506849, 1141.13406341 ],
    [ 2.501e-08, 3.85258138055, 696.519637617 ],
    [ 2.384e-08, 0.80154277885, 3370.104245 ],
    [ 2.318e-08, 0.79742541663, 426.076926014 ],
    [ 2.204e-08, 0.22323394228, 3259.89792378 ],
    [ 2.647e-08, 2.60111065092, 436.159418432 ],
    [ 2.126e-08, 0.1483231766, 405.991263056 ],
    [ 2.301e-08, 1.25086250691, 427.119455738 ],
    [ 2.752e-08, 3.02333147039, 468.242688652 ],
    [ 2.128e-08, 3.08760310976, 203.26478713 ],
    [ 2.105e-08, 0.46661118435, 184.987919787 ],
    [ 2.354e-08, 2.59778868023, 511.53171783 ],
    [ 2.333e-08, 3.02634928771, 216.007408424 ],
    [ 2.162e-08, 4.27244747747, 7.1617311106 ],
    [ 2.581e-08, 4.73385922413, 221.375850285 ],
    [ 2.074e-08, 0.57960021408, 180.161994646 ],
    [ 2.478e-08, 4.72786315991, 556.517668038 ],
    [ 2.58e-08, 1.0370534038, 213.410970023 ],
    [ 2.025e-08, 2.28785218653, 610.692338785 ],
    [ 2.244e-08, 0.12206585141, 259.769518354 ],
    [ 2.005e-08, 3.14124583124, 1382.88734685 ],
    [ 2.052e-08, 0.7429125469, 200.556474145 ],
    [ 1.985e-08, 3.34537824132, 421.93232443 ],
    [ 2e-08, 5.26813039382, 661.237927316 ],
    [ 2.153e-08, 0.85935268348, 286.596221297 ],
    [ 1.936e-08, 1.0528693453, 1262.38608489 ],
    [ 2.039e-08, 1.72125271358, 1670.8250285 ],
    [ 1.901e-08, 0.58371277903, 406.954470903 ],
    [ 1.976e-08, 1.31263772907, 135.548551454 ],
    [ 2.447e-08, 0.52794500154, 429.518952183 ],
    [ 2.174e-08, 2.29627370615, 1773.91780272 ],
    [ 1.895e-08, 2.80891695372, 141.698890608 ],
    [ 1.872e-08, 4.35634331322, 572.229234747 ],
    [ 1.863e-08, 1.4831442904, 638.412813606 ],
    [ 2.007e-08, 1.73735242111, 193.655375465 ],
    [ 1.927e-08, 1.56648434889, 391.173468224 ],
    [ 1.844e-08, 6.11579285251, 1261.63532536 ],
    [ 2.179e-08, 6.14304471748, 205.434788912 ],
    [ 2.094e-08, 5.00798053675, 420.969116584 ],
    [ 2.538e-08, 5.83123621858, 426.550006766 ],
    [ 2.168e-08, 0.41741136149, 213.511543759 ],
    [ 2.433e-08, 1.02613363057, 59.8037450403 ],
    [ 1.836e-08, 0.30655659532, 938.129908706 ],
    [ 1.83e-08, 5.54146705928, 206.137364327 ],
    [ 1.776e-08, 2.1638241283, 72.0732855816 ],
    [ 2.034e-08, 1.21814866092, 3046.59882835 ],
    [ 1.879e-08, 4.4335865129, 576.161388011 ],
    [ 1.753e-08, 0.06020614247, 241.753283441 ],
    [ 2.168e-08, 3.24685294764, 213.086647117 ],
    [ 1.74e-08, 0.14507117402, 196.033620051 ],
    [ 1.84e-08, 2.85531411351, 842.901441013 ],
    [ 2.254e-08, 5.04269960259, 558.002140746 ],
    [ 2.357e-08, 5.39214088781, 2854.64037391 ],
    [ 1.84e-08, 2.81087023611, 179.358845494 ],
    [ 1.765e-08, 3.65425588942, 403.02231764 ],
    [ 2.147e-08, 1.24753861866, 624.919432787 ],
    [ 1.749e-08, 5.29018685566, 87.3117715395 ],
    [ 1.903e-08, 2.91827326906, 398.144002873 ],
    [ 2.073e-08, 2.50732735763, 26.826702943 ],
    [ 1.675e-08, 4.80439517678, 181.806526049 ],
    [ 1.902e-08, 2.74426125465, 4952.06359329 ],
    [ 1.962e-08, 3.52111949662, 213.459154132 ],
    [ 2.076e-08, 3.2790596932, 1596.18644228 ],
    [ 1.892e-08, 6.08128888555, 230.707583177 ],
    [ 1.75e-08, 1.10237257017, 586.313316397 ],
    [ 1.71e-08, 2.1459528792, 1056.20053645 ],
    [ 1.616e-08, 2.12300497232, 430.79097657 ],
    [ 1.681e-08, 6.0994130421, 952.357002707 ],
    [ 1.655e-08, 2.26128695913, 418.521436029 ],
    [ 1.871e-08, 5.61838915758, 2957.73314813 ],
    [ 1.962e-08, 0.13564680851, 213.139036744 ],
    [ 1.629e-08, 2.83974065181, 92.7978334801 ],
    [ 2.145e-08, 5.44218817748, 627.367113342 ],
    [ 1.792e-08, 1.07109040443, 355.748745572 ],
    [ 1.647e-08, 0.82347900016, 214.571119825 ],
    [ 1.624e-08, 1.17583107487, 739.057907269 ],
    [ 1.524e-08, 2.71525171937, 73.297125859 ],
    [ 1.788e-08, 1.2490851295, 219.891377577 ],
    [ 1.524e-08, 5.26558677448, 5429.87946824 ],
    [ 1.615e-08, 2.9899688328, 45.5766510387 ],
    [ 1.692e-08, 1.91984860233, 630.336058758 ],
    [ 1.742e-08, 0.38573693332, 831.104981224 ],
    [ 1.92e-08, 5.19783839519, 550.13783422 ],
    [ 1.936e-08, 2.81335247199, 429.045871431 ],
    [ 1.504e-08, 1.90331343411, 205.664283575 ],
    [ 1.596e-08, 0.99004701777, 953.107762233 ],
    [ 1.782e-08, 3.91453968301, 159.12442469 ],
    [ 1.47e-08, 5.46587523637, 273.853600004 ],
    [ 1.46e-08, 1.3167378976, 84.9335269539 ],
    [ 1.479e-08, 5.27664183474, 757.217154534 ],
    [ 1.455e-08, 2.61054780734, 850.014988014 ],
    [ 1.808e-08, 3.96315121347, 1699.2792165 ],
    [ 1.643e-08, 0.57689283331, 532.611726401 ],
    [ 1.887e-08, 2.78798625347, 418.000171167 ],
    [ 1.607e-08, 1.08154126629, 518.3846324 ],
    [ 1.68e-08, 3.17515284087, 105.540454773 ],
    [ 1.641e-08, 2.91802756388, 172.245298493 ],
    [ 1.48e-08, 4.08712341396, 206.936307963 ],
    [ 1.407e-08, 3.2376562218, 453.424893819 ],
    [ 1.631e-08, 1.06286709889, 213.559727869 ],
    [ 1.466e-08, 1.13594271587, 731.944360269 ],
    [ 1.389e-08, 0.40584159469, 9360.08916446 ],
    [ 1.496e-08, 1.12030845793, 423.677429569 ],
    [ 1.668e-08, 4.32873096627, 173.942219523 ],
    [ 1.467e-08, 0.03783145221, 432.014816847 ],
    [ 1.824e-08, 0.24130491507, 220.364458329 ],
    [ 1.408e-08, 3.34120468096, 934.948514968 ],
    [ 1.341e-08, 1.40041251657, 373.907992837 ],
    [ 1.34e-08, 1.30057612449, 428.082663584 ],
    [ 1.663e-08, 2.38182712355, 188.026301173 ],
    [ 1.416e-08, 3.65464640816, 6.8529145699 ],
    [ 1.39e-08, 0.72143566917, 2751.54759969 ],
    [ 1.562e-08, 5.99871360541, 292.012847268 ],
    [ 1.388e-08, 1.31100159458, 6275.96230299 ],
    [ 1.351e-08, 5.85616582168, 5863.59120612 ],
    [ 1.475e-08, 1.21040113552, 2531.13495725 ],
    [ 1.481e-08, 4.9347698651, 384.059921223 ],
    [ 1.271e-08, 3.46636801274, 354.997986046 ],
    [ 1.437e-08, 4.05228413274, 177.874372786 ],
    [ 1.619e-08, 2.44942359064, 1049.08698945 ],
    [ 1.626e-08, 3.16002444915, 835.787894013 ],
    [ 1.249e-08, 2.97028182853, 51749.2080923 ],
    [ 1.387e-08, 3.37238340312, 409.189703137 ],
    [ 1.24e-08, 2.66940683813, 2700.71514039 ],
    [ 1.457e-08, 1.85616688056, 96.8729990951 ],
    [ 1.23e-08, 4.27283851216, 12139.5535091 ],
    [ 1.221e-08, 4.36973999431, 3914.0223041 ],
    [ 1.251e-08, 5.29882815294, 306.096928918 ],
    [ 1.4e-08, 5.0407108032, 295.194241006 ],
    [ 1.304e-08, 5.77737491864, 60.5545045657 ],
    [ 1.247e-08, 0.99106661572, 9793.80090234 ],
    [ 1.174e-08, 6.11392643811, 823.991434223 ],
    [ 1.231e-08, 1.1089053072, 2303.60876781 ],
    [ 1.186e-08, 4.55984967028, 9808.53818466 ],
    [ 1.401e-08, 2.50099443277, 206.706813299 ],
    [ 1.181e-08, 5.81146592434, 569.04784101 ],
    [ 1.234e-08, 2.72607019445, 10206.1719992 ],
    [ 1.334e-08, 4.87244369722, 54.1746707478 ],
    [ 1.198e-08, 5.42400970257, 864.242082016 ],
    [ 1.499e-08, 0.34153793328, 17.4084877393 ],
    [ 1.143e-08, 1.61667366569, 238.571889704 ],
    [ 1.199e-08, 1.39732488359, 1987.21689816 ],
    [ 1.266e-08, 5.89383144767, 162.896519259 ],
    [ 1.268e-08, 4.10670310052, 3377.217792 ],
    [ 1.297e-08, 4.35617934153, 606.760185522 ],
    [ 1.27e-08, 2.05134233573, 525.758811831 ],
    [ 1.203e-08, 1.96781078617, 220.933907301 ],
    [ 1.196e-08, 5.1348521485, 227.313741118 ],
    [ 1.537e-08, 3.54197877408, 2015.67108616 ],
    [ 1.098e-08, 5.0954389741, 107.758640665 ],
    [ 1.153e-08, 5.33028034679, 233.906023258 ],
    [ 1.365e-08, 3.08025915574, 427.348950401 ],
    [ 1.075e-08, 3.06444759157, 464.731226514 ],
    [ 1.374e-08, 2.92410533076, 1457.52593306 ],
    [ 1.352e-08, 2.28174856694, 525.498179401 ],
    [ 1.073e-08, 1.11416151647, 221.163401964 ],
    [ 1.344e-08, 1.64695425702, 857.128535015 ],
    [ 1.184e-08, 2.99776919968, 199.284449757 ],
    [ 1.107e-08, 4.1210715373, 188.169313524 ]
    // 551 terms retained
];

KMG.VSOPTerms.saturn_R2 = [
    [ 0.00436902572, 4.78671677509, 213.299095438 ],
    [ 0.00071922498, 2.5007006993, 206.185548437 ],
    [ 0.00049766872, 4.97167777235, 220.412642439 ],
    [ 0.00043220783, 3.86941044212, 426.598190876 ],
    [ 0.00029645766, 5.96309886479, 7.1135470008 ],
    [ 4.141687e-05, 4.10673009419, 433.711737877 ],
    [ 4.720822e-05, 2.47524028389, 199.072001436 ],
    [ 3.789321e-05, 3.0977118974, 639.897286314 ],
    [ 2.963981e-05, 1.37198670946, 103.092774219 ],
    [ 2.556403e-05, 2.85066948131, 419.484643875 ],
    [ 2.208473e-05, 6.27590108662, 110.206321219 ],
    [ 2.187311e-05, 5.8554501714, 14.2270940016 ],
    [ 1.956779e-05, 4.92451269861, 227.52618944 ],
    [ 2.326777e-05, 0, 0 ],
    [ 9.23829e-06, 5.4638968891, 323.505416657 ],
    [ 7.05974e-06, 2.97065900638, 95.9792272178 ],
    [ 5.45943e-06, 4.12843012325, 412.371096874 ],
    [ 3.73763e-06, 5.8341214698, 117.31986822 ],
    [ 3.60843e-06, 3.27730304283, 647.010833315 ],
    [ 3.56448e-06, 3.19046275776, 210.1177017 ],
    [ 3.90607e-06, 4.48122593284, 216.480489176 ],
    [ 4.31231e-06, 5.17807636127, 522.577418094 ],
    [ 3.25474e-06, 2.26775488379, 853.196381752 ],
    [ 4.04424e-06, 4.17313476718, 209.366942175 ],
    [ 2.04458e-06, 0.08803952503, 202.253395174 ],
    [ 2.06684e-06, 4.02119282093, 735.876513532 ],
    [ 1.77973e-06, 4.09718163123, 440.825284878 ],
    [ 1.79903e-06, 3.59725930296, 632.783739313 ],
    [ 1.53635e-06, 3.13514267989, 625.670192312 ],
    [ 1.47816e-06, 0.13561171385, 302.164775655 ],
    [ 1.23132e-06, 4.188082239, 88.865680217 ],
    [ 1.32767e-06, 2.59540724138, 191.958454436 ],
    [ 1.00365e-06, 5.46047886103, 3.1813937377 ],
    [ 1.31964e-06, 5.9341108212, 309.278322656 ],
    [ 9.7129e-07, 4.01875371334, 728.762966531 ],
    [ 1.10801e-06, 4.78116393398, 838.96928775 ],
    [ 1.18896e-06, 5.55283545372, 224.344795702 ],
    [ 9.3927e-07, 4.38412535132, 217.231248701 ],
    [ 1.08788e-06, 5.29339369085, 515.463871093 ],
    [ 7.856e-07, 5.72528816327, 21.3406410024 ],
    [ 8.1356e-07, 5.10874041756, 956.289155971 ],
    [ 9.6525e-07, 6.25894400082, 742.990060533 ],
    [ 6.9181e-07, 4.0500529712, 3.9321532631 ],
    [ 6.483e-07, 3.78002548365, 1052.26838319 ],
    [ 6.3978e-07, 5.81225801002, 529.690965095 ],
    [ 6.2365e-07, 2.18095710071, 195.139848173 ],
    [ 5.7229e-07, 3.14757658238, 203.004154699 ],
    [ 5.5804e-07, 4.84263005967, 234.63973644 ],
    [ 5.3036e-07, 5.07508755229, 330.618963658 ],
    [ 5.0918e-07, 2.77244266104, 942.062061969 ],
    [ 4.4966e-07, 0.58212370012, 269.921446741 ],
    [ 4.1393e-07, 4.78657175977, 63.7358983034 ],
    [ 4.1412e-07, 3.73171033163, 316.391869657 ],
    [ 5.2786e-07, 3.920753603, 949.17560897 ],
    [ 3.8591e-07, 3.74711996033, 1045.15483619 ],
    [ 3.7347e-07, 4.19076534429, 536.804512095 ],
    [ 3.549e-07, 2.91778598255, 284.148540742 ],
    [ 3.365e-07, 3.80330571653, 149.563197135 ],
    [ 4.09e-07, 4.58137310079, 1155.36115741 ],
    [ 3.0568e-07, 2.48114941443, 860.309928753 ],
    [ 3.1258e-07, 4.84287013662, 1272.68102563 ],
    [ 3.9345e-07, 3.51497594706, 422.666037613 ],
    [ 3.0267e-07, 4.35601859659, 405.257549874 ],
    [ 2.9735e-07, 1.58889278109, 1066.49547719 ],
    [ 3.5157e-07, 5.94690982234, 1059.38193019 ],
    [ 2.5796e-07, 3.5517378854, 1368.66025285 ],
    [ 2.6344e-07, 4.80468984306, 124.433415221 ],
    [ 2.9862e-07, 3.66430349958, 429.779584614 ],
    [ 3.289e-07, 4.96719279752, 831.85574075 ],
    [ 2.2072e-07, 2.76570533706, 415.552490612 ],
    [ 2.6103e-07, 4.4552180721, 223.594036176 ],
    [ 2.3925e-07, 5.30856839441, 10.2949407385 ],
    [ 2.7199e-07, 1.66568373581, 277.034993741 ],
    [ 2.16e-07, 1.03111763332, 11.0457002639 ],
    [ 1.9791e-07, 2.53638693425, 1258.45393163 ],
    [ 1.704e-07, 3.27716162306, 654.124380316 ],
    [ 1.7345e-07, 3.49852392962, 1361.54670584 ],
    [ 1.5726e-07, 1.72390137596, 490.334089179 ],
    [ 2.0965e-07, 3.62456217146, 1265.56747863 ],
    [ 1.7893e-07, 4.30763518069, 1471.75302706 ],
    [ 1.3547e-07, 0.32283926763, 295.051228654 ],
    [ 1.2646e-07, 3.13027912532, 74.7815985673 ],
    [ 1.5208e-07, 3.59590956406, 265.989293477 ],
    [ 1.1701e-07, 2.33365710225, 210.851414883 ],
    [ 1.5492e-07, 5.01357631979, 127.471796607 ],
    [ 1.2792e-07, 4.61580100969, 1589.07289528 ],
    [ 1.0737e-07, 5.04941789777, 191.20769491 ],
    [ 1.4117e-07, 3.04728052859, 423.416797138 ],
    [ 1.1052e-07, 4.51972952811, 81.7521332162 ],
    [ 1.3338e-07, 4.8899993703, 437.64389114 ],
    [ 1.0549e-07, 5.02936454854, 137.033024162 ],
    [ 1.4258e-07, 4.6919299495, 1148.24761041 ],
    [ 1.3432e-07, 1.9111707707, 408.438943611 ],
    [ 1.0094e-07, 5.20250555714, 340.770892045 ],
    [ 1.0411e-07, 3.33366465751, 1685.0521225 ],
    [ 9.52e-08, 3.19193162671, 351.816592309 ],
    [ 1.1397e-07, 5.48081632887, 1375.77379985 ],
    [ 8.777e-08, 2.80839077219, 99.9113804809 ],
    [ 8.733e-08, 3.22125033819, 1677.9385755 ],
    [ 7.85e-08, 2.36712432378, 1574.84580128 ],
    [ 7.658e-08, 6.08736238432, 231.458342703 ],
    [ 9.222e-08, 3.40983965001, 1581.95934828 ],
    [ 8.222e-08, 4.04654478628, 1788.14489672 ],
    [ 7.179e-08, 2.00932392414, 131.40394987 ],
    [ 7.672e-08, 3.69477797972, 846.082834751 ],
    [ 6.723e-08, 4.38526201358, 145.631043871 ],
    [ 6.408e-08, 1.31732334919, 215.746775993 ],
    [ 6.29e-08, 4.01002594556, 447.938831878 ],
    [ 7.239e-08, 3.29158763151, 750.103607533 ],
    [ 6.054e-08, 0.55440901153, 18.1592472647 ],
    [ 5.878e-08, 4.48086148593, 106.274167956 ],
    [ 6.14e-08, 3.78862477414, 313.210475919 ],
    [ 6.911e-08, 4.84071390677, 319.573263394 ],
    [ 6.823e-08, 5.44107387955, 508.350324092 ],
    [ 6.072e-08, 2.90739860693, 138.517496871 ],
    [ 7.309e-08, 4.37976118424, 1464.63948006 ],
    [ 5.615e-08, 4.1761755515, 721.64941953 ],
    [ 5.14e-08, 2.65252687662, 288.080694005 ],
    [ 5.311e-08, 3.6252084951, 6076.89030155 ],
    [ 5.193e-08, 5.04861839155, 10007.0999978 ],
    [ 5.472e-08, 1.1708333574, 56.6223513026 ],
    [ 5.383e-08, 4.35702878688, 1905.46476494 ],
    [ 5.195e-08, 4.18394941363, 543.918059096 ],
    [ 4.765e-08, 3.32372808126, 76.2660712756 ],
    [ 4.694e-08, 6.25649673541, 483.220542179 ],
    [ 4.519e-08, 1.21202742896, 200.768922466 ],
    [ 4.922e-08, 3.14333262849, 2001.44399216 ],
    [ 4.712e-08, 1.26507812515, 6062.66320755 ],
    [ 4.851e-08, 2.42490640186, 628.85158605 ],
    [ 5.155e-08, 4.4512863615, 416.303250138 ],
    [ 4.626e-08, 2.68842971043, 9992.87290377 ],
    [ 4.261e-08, 2.01635516905, 347.884439046 ],
    [ 4.843e-08, 5.93693841859, 618.556645312 ],
    [ 4.556e-08, 0.75092365616, 333.657345044 ],
    [ 4.249e-08, 0.82449917175, 222.860322994 ],
    [ 4.342e-08, 0.9627351577, 343.2185726 ],
    [ 4.444e-08, 5.77025648302, 184.844907435 ],
    [ 4.169e-08, 2.95237909837, 107.024927482 ],
    [ 3.894e-08, 2.91997373157, 38.1330356378 ],
    [ 3.898e-08, 1.97004731481, 497.44763618 ],
    [ 3.994e-08, 2.91478526694, 1994.33044516 ],
    [ 5.097e-08, 3.13189365474, 1898.35121794 ],
    [ 3.629e-08, 3.25010351543, 362.862292573 ],
    [ 3.699e-08, 4.17117563916, 430.530344139 ],
    [ 3.56e-08, 3.4822402108, 388.465155238 ],
    [ 3.694e-08, 0.89402011536, 703.633184617 ],
    [ 3.606e-08, 0.0348773782, 32.2433289144 ],
    [ 3.484e-08, 1.83233211242, 70.8494453042 ],
    [ 3.611e-08, 3.27859535883, 635.965133051 ],
    [ 3.479e-08, 1.96759778624, 203.737867882 ],
    [ 3.39e-08, 1.2313404579, 134.585343608 ],
    [ 3.551e-08, 3.29904637657, 357.445666601 ],
    [ 4.236e-08, 5.47583443571, 1692.1656695 ],
    [ 3.289e-08, 0.57265070971, 10213.2855462 ],
    [ 3.247e-08, 5.47801108148, 6283.07584999 ],
    [ 3.125e-08, 2.18412055759, 1891.23767094 ],
    [ 3.319e-08, 3.543626184, 629.602345575 ],
    [ 3.03e-08, 3.9110870462, 312.199083963 ],
    [ 4.163e-08, 5.19007572863, 404.506790348 ],
    [ 4.076e-08, 4.10841252077, 1781.03134972 ],
    [ 3.774e-08, 3.80557045886, 2104.53676638 ],
    [ 3.206e-08, 3.89813077889, 1038.04128919 ],
    [ 2.872e-08, 2.1977039642, 217.964961884 ],
    [ 3.294e-08, 5.62584228838, 113.387714957 ],
    [ 3.157e-08, 2.95571558329, 52.6901980395 ],
    [ 2.888e-08, 2.56166067768, 867.423475754 ],
    [ 2.86e-08, 2.34237875942, 181.055766524 ],
    [ 3.18e-08, 4.22909289398, 337.732510659 ],
    [ 2.899e-08, 5.12520635604, 312.459716394 ],
    [ 2.998e-08, 5.44837420714, 258.875746477 ],
    [ 3.032e-08, 4.1181812554, 1478.86657406 ],
    [ 3.013e-08, 1.61330987129, 1073.60902419 ],
    [ 2.716e-08, 3.14448153596, 358.93013931 ],
    [ 2.765e-08, 6.16872527649, 273.102840478 ],
    [ 2.766e-08, 1.01040617017, 1279.79457263 ],
    [ 3.082e-08, 5.60019300569, 216.219856745 ],
    [ 3.254e-08, 3.92690377039, 85.8272988312 ],
    [ 2.661e-08, 2.3170549735, 565.115687747 ],
    [ 2.771e-08, 5.77771382441, 160.608897399 ],
    [ 2.452e-08, 5.3199797483, 444.757438141 ],
    [ 2.41e-08, 0.00880493603, 195.890607699 ],
    [ 2.81e-08, 1.68907631956, 213.347279548 ],
    [ 2.811e-08, 4.77447520427, 213.250911328 ],
    [ 2.434e-08, 4.76729826936, 218.715721409 ],
    [ 3.133e-08, 2.493198911, 6069.77675455 ],
    [ 2.884e-08, 0.32368080181, 561.183534484 ],
    [ 2.784e-08, 4.1994248541, 650.942986578 ],
    [ 2.554e-08, 5.043725881, 1169.58825141 ],
    [ 2.981e-08, 3.91292350334, 9999.98645077 ],
    [ 2.631e-08, 1.12699455399, 344.703045308 ],
    [ 2.678e-08, 5.09176744531, 824.742193749 ],
    [ 2.679e-08, 1.6897140187, 208.633228992 ],
    [ 2.648e-08, 2.94415462727, 643.078680052 ],
    [ 2.12e-08, 2.31088616664, 2627.11418447 ],
    [ 2.118e-08, 3.28098774331, 320.32402292 ],
    [ 2.226e-08, 4.08089457879, 131.546962222 ],
    [ 2.553e-08, 3.43332044217, 6275.96230299 ],
    [ 2.67e-08, 3.55722356494, 2420.92863603 ],
    [ 2.005e-08, 2.02382593901, 144.146571163 ],
    [ 2.124e-08, 1.61210282593, 218.928169731 ],
    [ 2.444e-08, 2.95506585634, 2214.7430876 ],
    [ 1.995e-08, 3.54870355383, 22.0914005278 ],
    [ 1.938e-08, 4.22895382496, 546.956440482 ],
    [ 2.152e-08, 3.95372746872, 1795.25844372 ],
    [ 1.909e-08, 0.85189037198, 121.252021483 ],
    [ 1.925e-08, 2.91107035422, 636.715892576 ],
    [ 2.195e-08, 3.74800214181, 436.893131615 ],
    [ 1.872e-08, 4.66994466499, 188.026301173 ],
    [ 2.061e-08, 2.87712309214, 2310.72231481 ],
    [ 2.208e-08, 4.83492066978, 1141.13406341 ],
    [ 2.135e-08, 3.00526791204, 2317.83586181 ],
    [ 1.816e-08, 2.8017551192, 291.262087743 ],
    [ 1.897e-08, 1.68036754832, 350.3321196 ],
    [ 2.279e-08, 5.43456146966, 207.882469467 ],
    [ 1.769e-08, 3.54746039561, 329.725191781 ],
    [ 1.759e-08, 1.64172549261, 424.150510321 ],
    [ 1.848e-08, 2.24194286719, 168.052512799 ],
    [ 1.779e-08, 1.36026967744, 212.335887592 ],
    [ 2.106e-08, 4.22304768571, 2221.8566346 ],
    [ 1.711e-08, 1.92063117332, 129.919477162 ],
    [ 2.223e-08, 5.23762818237, 99.1606209555 ],
    [ 1.781e-08, 3.29852655586, 1670.8250285 ],
    [ 1.766e-08, 3.55341010945, 1354.43315884 ],
    [ 2.051e-08, 3.73308531316, 2097.42321938 ],
    [ 1.691e-08, 5.10160176441, 214.262303285 ],
    [ 1.757e-08, 4.60923293699, 182.279606801 ],
    [ 1.733e-08, 5.28757672531, 45.5766510387 ],
    [ 1.977e-08, 4.85653036081, 10206.1719992 ],
    [ 1.567e-08, 4.47742703992, 210.378334131 ],
    [ 1.551e-08, 2.15558953807, 207.670021145 ],
    [ 1.779e-08, 3.4039983467, 2428.04218303 ],
    [ 1.541e-08, 6.0937477836, 554.069987483 ],
    [ 1.821e-08, 4.15498729351, 225.82926841 ],
    [ 1.483e-08, 1.31282416766, 219.449434592 ],
    [ 1.456e-08, 5.90544857131, 1.4844727083 ],
    [ 1.56e-08, 1.01224093587, 235.390495966 ],
    [ 1.753e-08, 0.10174553335, 12.5301729722 ],
    [ 1.461e-08, 2.45326772796, 305.346169393 ],
    [ 1.542e-08, 5.51223038941, 204.701075729 ],
    [ 1.723e-08, 5.94689036034, 196.624320882 ],
    [ 1.508e-08, 0.72241135463, 429.045871431 ],
    [ 1.581e-08, 2.64780225512, 207.148756284 ],
    [ 1.476e-08, 6.12782257368, 212.777830576 ],
    [ 1.548e-08, 0.53240818911, 120.358249606 ],
    [ 1.474e-08, 0.33626790634, 213.8203603 ],
    [ 1.37e-08, 5.51600816906, 92.7978334801 ],
    [ 1.428e-08, 3.25039966249, 945.994215232 ],
    [ 1.444e-08, 5.69264187185, 1485.98012107 ],
    [ 1.329e-08, 1.9796728209, 198.321241911 ],
    [ 1.752e-08, 2.70090942746, 12.7426212933 ],
    [ 1.317e-08, 1.73769800248, 1382.88734685 ],
    [ 1.434e-08, 4.37660077473, 5863.59120612 ],
    [ 1.408e-08, 0.80461100746, 1585.14074202 ],
    [ 1.271e-08, 5.70165238307, 2.9207613068 ],
    [ 1.313e-08, 5.57979182873, 128.365568484 ],
    [ 1.25e-08, 0.35839694485, 334.551116921 ],
    [ 1.337e-08, 3.27439246509, 193.655375465 ],
    [ 1.298e-08, 6.18760666624, 526.509571357 ],
    [ 1.319e-08, 5.67233796212, 298.232622392 ],
    [ 1.346e-08, 5.79997037285, 9793.80090234 ],
    [ 1.402e-08, 3.16235877831, 175.1660598 ],
    [ 1.202e-08, 2.88792018909, 2413.81508903 ],
    [ 1.562e-08, 5.00012041556, 2008.55753916 ],
    [ 1.354e-08, 0.94866727482, 217.491881132 ],
    [ 1.292e-08, 5.13478886171, 1162.47470441 ],
    [ 1.197e-08, 1.74106457854, 2207.6295406 ],
    [ 1.281e-08, 0.47848987165, 525.498179401 ],
    [ 1.244e-08, 5.99520374248, 28.4541880032 ],
    [ 1.148e-08, 2.17212855226, 1055.44977693 ],
    [ 1.282e-08, 6.12823934151, 1802.37199072 ],
    [ 1.304e-08, 0.3733792328, 3473.19701922 ],
    [ 1.215e-08, 3.87917402622, 209.106309744 ],
    [ 1.117e-08, 3.33328660827, 661.237927316 ],
    [ 1.367e-08, 1.00973749169, 621.738039049 ],
    [ 1.395e-08, 3.82109633863, 2111.65031338 ],
    [ 1.279e-08, 2.87401595453, 142.449650134 ],
    [ 1.081e-08, 4.11745082549, 156.676744135 ],
    [ 1.094e-08, 0.95082594069, 842.150681488 ],
    [ 1.295e-08, 4.70261675421, 9786.68735533 ],
    [ 1.238e-08, 0.48462207051, 3906.9087571 ],
    [ 1.011e-08, 2.158067736, 251.432131076 ],
    [ 1.276e-08, 4.48356586181, 732.695119794 ],
    [ 1.316e-08, 4.72331667671, 398.144002873 ],
    [ 9.8e-09, 1.88269080686, 501.379789443 ],
    [ 9.62e-09, 5.92160366799, 519.396024356 ],
    [ 1.182e-08, 3.69482624364, 2854.64037391 ],
    [ 9.45e-09, 4.87513739959, 241.753283441 ],
    [ 9.7e-09, 2.89031410383, 1987.21689816 ],
    [ 1.194e-08, 3.26293060096, 5856.47765912 ],
    [ 9.36e-09, 5.49997099924, 739.057907269 ],
    [ 1.129e-08, 5.17087619935, 98.8999885246 ],
    [ 1.024e-08, 5.62644279982, 479.288388915 ],
    [ 1.129e-08, 5.48559615849, 3995.77443732 ],
    [ 9.78e-09, 5.31362529668, 114.138474483 ],
    [ 1.167e-08, 2.19961653985, 1699.2792165 ],
    [ 8.64e-09, 0.25714937203, 436.159418432 ],
    [ 1.062e-08, 5.13323858077, 2751.54759969 ],
    [ 9.47e-09, 4.98276726039, 699.701031354 ],
    [ 8.86e-09, 3.03398159069, 306.096928918 ],
    [ 9.16e-09, 4.99280834008, 4209.07353275 ],
    [ 1.048e-08, 0.86254115639, 525.758811831 ],
    [ 8.94e-09, 2.41362473223, 289.565166714 ],
    [ 8e-09, 1.26419353964, 710.746731618 ],
    [ 7.91e-09, 2.14989417962, 2620.00063747 ],
    [ 7.95e-09, 2.09247626825, 563.631215038 ],
    [ 7.87e-09, 5.25336286912, 214.783568146 ],
    [ 7.83e-09, 1.29408648806, 685.473937353 ],
    [ 1.06e-08, 1.56954240117, 5849.36411211 ],
    [ 7.84e-09, 5.3041896283, 327.43756992 ],
    [ 7.64e-09, 4.56705124334, 380.12776796 ],
    [ 8.11e-09, 6.20098147255, 245.542424352 ],
    [ 8.57e-09, 1.78247179649, 135.336103133 ],
    [ 8.01e-09, 1.863831191, 3039.48528135 ],
    [ 8.01e-09, 0.46947170994, 3466.08347222 ],
    [ 9.68e-09, 3.02618272726, 2634.22773147 ],
    [ 8.14e-09, 1.96028453251, 417.03696332 ],
    [ 8.1e-09, 4.1354009543, 831.104981224 ],
    [ 7.39e-09, 2.27110740297, 2303.60876781 ],
    [ 7.47e-09, 0.2924506326, 916.932280055 ],
    [ 8.89e-09, 4.44997608522, 230.707583177 ],
    [ 7.26e-09, 2.54556193643, 576.161388011 ],
    [ 9.82e-09, 1.94714680471, 229.973869994 ],
    [ 7.28e-09, 1.11567846944, 540.736665358 ],
    [ 7.28e-09, 1.30997967935, 511.53171783 ],
    [ 7.11e-09, 4.55074874644, 980.668178359 ],
    [ 7.16e-09, 3.74192651696, 3053.71237535 ],
    [ 7.69e-09, 3.34498423969, 953.107762233 ],
    [ 9.2e-09, 3.83992182117, 348.635198571 ],
    [ 7.89e-09, 3.15830383443, 739.808666795 ],
    [ 8.96e-09, 4.82222996928, 4216.18707975 ],
    [ 7.12e-09, 0.43380103197, 1493.09366807 ],
    [ 8.4e-09, 4.85251148183, 326.686810395 ],
    [ 7.24e-09, 0.757901174, 486.401935916 ],
    [ 7.9e-09, 0.48073040004, 4017.11507832 ],
    [ 8.31e-09, 3.48853527081, 84.9335269539 ],
    [ 7.45e-09, 6.22304530635, 1269.49963189 ],
    [ 6.79e-09, 0.78943373396, 273.853600004 ],
    [ 9.32e-09, 5.20456188216, 849.264228489 ]
];

KMG.VSOPTerms.saturn_R3 = [
    [ 0.00020315239, 3.02186068237, 213.299095438 ],
    [ 8.923679e-05, 3.19144467228, 220.412642439 ],
    [ 6.908768e-05, 4.35175288182, 206.185548437 ],
    [ 4.087056e-05, 4.22398596149, 7.1135470008 ],
    [ 3.878848e-05, 2.01051759517, 426.598190876 ],
    [ 1.070754e-05, 4.20372656114, 199.072001436 ],
    [ 9.07379e-06, 2.28356519128, 433.711737877 ],
    [ 6.05936e-06, 3.17456913264, 227.52618944 ],
    [ 5.96411e-06, 4.13395467306, 14.2270940016 ],
    [ 4.83108e-06, 1.17313249713, 639.897286314 ],
    [ 3.93213e-06, 0, 0 ],
    [ 2.29396e-06, 4.69783424016, 419.484643875 ],
    [ 1.87917e-06, 4.5908926492, 110.206321219 ],
    [ 1.49326e-06, 3.20334759568, 103.092774219 ],
    [ 1.21613e-06, 3.76751430846, 323.505416657 ],
    [ 1.013e-06, 5.81716272185, 412.371096874 ],
    [ 1.0203e-06, 4.70997918436, 95.9792272178 ],
    [ 9.2737e-07, 1.43601934858, 647.010833315 ],
    [ 7.2411e-07, 4.15100432048, 117.31986822 ],
    [ 8.4197e-07, 2.63457296718, 216.480489176 ],
    [ 6.1913e-07, 2.31131212952, 440.825284878 ],
    [ 4.522e-07, 4.37634609863, 191.958454436 ],
    [ 4.9426e-07, 2.38844043734, 209.366942175 ],
    [ 5.4819e-07, 0.30627159494, 853.196381752 ],
    [ 4.0466e-07, 1.83906916098, 302.164775655 ],
    [ 3.8104e-07, 5.93442433914, 88.865680217 ],
    [ 3.2001e-07, 4.01244131364, 21.3406410024 ],
    [ 4.0737e-07, 0.68516563011, 522.577418094 ],
    [ 2.8116e-07, 5.7651243739, 210.1177017 ],
    [ 2.4831e-07, 3.06280485014, 234.63973644 ],
    [ 2.5254e-07, 0.7396536674, 515.463871093 ],
    [ 2.0713e-07, 4.9263934342, 625.670192312 ],
    [ 1.7714e-07, 5.72683468372, 728.762966531 ],
    [ 1.8131e-07, 1.43975542803, 309.278322656 ],
    [ 1.6495e-07, 3.52692613051, 3.1813937377 ],
    [ 1.2918e-07, 3.3668492051, 330.618963658 ],
    [ 1.1094e-07, 3.37261850494, 224.344795702 ],
    [ 1.0869e-07, 3.43386860676, 956.289155971 ],
    [ 1.0016e-07, 1.59530701443, 202.253395174 ],
    [ 1.1527e-07, 5.96454139918, 735.876513532 ],
    [ 1.0427e-07, 6.07038986657, 405.257549874 ],
    [ 9.198e-08, 2.93495179548, 124.433415221 ],
    [ 8.733e-08, 4.65644352017, 632.783739313 ],
    [ 9.909e-08, 0.58906585168, 860.309928753 ],
    [ 7.397e-08, 4.53722615699, 942.062061969 ],
    [ 9.877e-08, 0.25973572185, 838.96928775 ],
    [ 9.223e-08, 2.57680550459, 223.594036176 ],
    [ 7.483e-08, 1.4654223471, 654.124380316 ],
    [ 8.102e-08, 1.77706845061, 429.779584614 ],
    [ 7.173e-08, 5.49665397606, 1045.15483619 ],
    [ 6.882e-08, 1.47851183871, 422.666037613 ],
    [ 7.832e-08, 0.44349627838, 831.85574075 ],
    [ 8.107e-08, 4.50187795175, 742.990060533 ],
    [ 6.92e-08, 4.81164954413, 316.391869657 ],
    [ 8.075e-08, 4.21886190434, 195.139848173 ],
    [ 5.803e-08, 2.3541937285, 269.921446741 ],
    [ 5.616e-08, 1.20479876549, 284.148540742 ],
    [ 5.782e-08, 4.19740457842, 529.690965095 ],
    [ 4.92e-08, 2.16694660987, 295.051228654 ],
    [ 5.415e-08, 2.4712399192, 536.804512095 ],
    [ 5.965e-08, 6.060771835, 1066.49547719 ],
    [ 5.49e-08, 0.8459759962, 217.231248701 ],
    [ 5.849e-08, 3.40892096038, 10.2949407385 ],
    [ 4.178e-08, 3.22951777344, 1272.68102563 ],
    [ 4.391e-08, 0.88818379722, 203.004154699 ],
    [ 3.566e-08, 6.23461945528, 81.7521332162 ],
    [ 4.005e-08, 0.12257495486, 1155.36115741 ],
    [ 3.099e-08, 4.35795864442, 1258.45393163 ],
    [ 3.394e-08, 0.86274027413, 508.350324092 ],
    [ 3.447e-08, 0.20752334492, 1148.24761041 ],
    [ 3.642e-08, 5.97995786501, 1052.26838319 ],
    [ 3.059e-08, 4.96923422399, 1677.9385755 ],
    [ 2.893e-08, 1.90456088258, 149.563197135 ],
    [ 2.74e-08, 5.7005388801, 3.9321532631 ],
    [ 3.014e-08, 5.36409568893, 1361.54670584 ],
    [ 2.608e-08, 2.99591016813, 1589.07289528 ],
    [ 2.464e-08, 2.25182696243, 447.938831878 ],
    [ 2.295e-08, 3.77182395165, 408.438943611 ],
    [ 2.449e-08, 5.87771646576, 721.64941953 ],
    [ 2.441e-08, 3.18918907436, 319.573263394 ],
    [ 1.967e-08, 1.29771144286, 184.844907435 ],
    [ 2.51e-08, 4.26899907719, 1059.38193019 ],
    [ 2.337e-08, 5.73749856685, 313.210475919 ],
    [ 2.438e-08, 2.20340625323, 543.918059096 ],
    [ 1.967e-08, 5.54991356049, 1038.04128919 ],
    [ 2.159e-08, 6.13002461326, 1464.63948006 ],
    [ 2.033e-08, 6.2340937498, 1471.75302706 ],
    [ 1.679e-08, 0.53404387418, 635.965133051 ],
    [ 1.667e-08, 2.31776149711, 337.732510659 ],
    [ 1.743e-08, 4.57646237847, 1994.33044516 ],
    [ 1.913e-08, 5.17436386408, 2854.64037391 ],
    [ 1.612e-08, 0.53564663022, 416.303250138 ],
    [ 1.66e-08, 5.71352144007, 11.0457002639 ],
    [ 2.034e-08, 1.58251242401, 750.103607533 ],
    [ 1.577e-08, 0.55789908488, 2324.94940882 ],
    [ 1.659e-08, 2.57526072926, 2090.30967238 ],
    [ 1.483e-08, 0.0210563348, 490.334089179 ],
    [ 1.424e-08, 0.96656932678, 415.552490612 ],
    [ 1.677e-08, 5.9335568145, 1781.03134972 ],
    [ 1.632e-08, 2.35226638604, 131.546962222 ],
    [ 1.402e-08, 0.60008117843, 210.851414883 ],
    [ 1.677e-08, 6.13301097969, 1073.60902419 ],
    [ 1.478e-08, 3.89120179199, 1251.34038462 ],
    [ 1.773e-08, 0.03977695852, 423.416797138 ],
    [ 1.442e-08, 5.32547705924, 2538.24850425 ],
    [ 1.49e-08, 5.26389041723, 1354.43315884 ],
    [ 1.61e-08, 3.02368875538, 437.64389114 ],
    [ 1.462e-08, 3.28599831588, 1884.12412394 ],
    [ 1.346e-08, 5.09589748079, 25.2727942655 ],
    [ 1.48e-08, 0.47735175322, 824.742193749 ],
    [ 1.312e-08, 3.79347668996, 1567.73225428 ],
    [ 1.335e-08, 1.74107324653, 195.890607699 ],
    [ 1.329e-08, 3.20676992162, 2207.6295406 ],
    [ 1.252e-08, 4.12592480127, 1574.84580128 ],
    [ 1.526e-08, 1.83391016543, 436.893131615 ],
    [ 1.204e-08, 5.83523069063, 215.746775993 ],
    [ 1.431e-08, 2.26632806642, 2420.92863603 ],
    [ 1.202e-08, 0.89248153731, 127.471796607 ],
    [ 1.403e-08, 1.02096357086, 643.078680052 ],
    [ 1.176e-08, 3.91611015213, 1891.23767094 ],
    [ 1.137e-08, 0.35727698514, 497.44763618 ],
    [ 1.117e-08, 6.17430918265, 63.7358983034 ],
    [ 1.138e-08, 0.82455844655, 867.423475754 ],
    [ 1.145e-08, 3.10797488346, 2200.51599359 ],
    [ 1.082e-08, 3.7258944551, 131.40394987 ],
    [ 1.387e-08, 1.42954726378, 2634.22773147 ],
    [ 1.311e-08, 1.45489259116, 430.530344139 ],
    [ 1.003e-08, 1.81530935794, 618.556645312 ],
    [ 1.219e-08, 5.39420447728, 1279.79457263 ],
    [ 1.342e-08, 5.63184874016, 1382.88734685 ],
    [ 9.43e-09, 2.27529460454, 1478.86657406 ],
    [ 1.034e-08, 4.7209593611, 1987.21689816 ],
    [ 9.1e-09, 4.75468748593, 113.387714957 ],
    [ 9.01e-09, 5.71833080761, 265.989293477 ],
    [ 1.017e-08, 3.79640287208, 1375.77379985 ],
    [ 8.87e-09, 2.86363894581, 934.948514968 ],
    [ 9.14e-09, 3.03946255874, 241.753283441 ],
    [ 8.79e-09, 2.65659265685, 145.631043871 ],
    [ 1.082e-08, 4.48298283322, 2214.7430876 ],
    [ 9.68e-09, 4.18488402192, 231.458342703 ],
    [ 8.88e-09, 5.98816755324, 2524.02141025 ],
    [ 8.09e-09, 2.89742868175, 2008.55753916 ],
    [ 8.72e-09, 5.9569965423, 1368.66025285 ],
    [ 8.14e-09, 6.26605263515, 2015.67108616 ],
    [ 9.9e-09, 5.32604038017, 2428.04218303 ],
    [ 7.95e-09, 2.3817813581, 2228.9701816 ],
    [ 7.65e-09, 4.7003367494, 1670.8250285 ],
    [ 7.19e-09, 3.14082277075, 56.6223513026 ],
    [ 7.25e-09, 5.87999254075, 1685.0521225 ],
    [ 7.72e-09, 1.15596098579, 3053.71237535 ],
    [ 9.44e-09, 4.19194509927, 1802.37199072 ],
    [ 8.23e-09, 0.15294957676, 1141.13406341 ],
    [ 7.38e-09, 4.90593328066, 1485.98012107 ],
    [ 6.85e-09, 1.70083536518, 483.220542179 ]
];

KMG.VSOPTerms.saturn_R4 = [
    [ 1.202117e-05, 1.41498340225, 220.412642439 ],
    [ 7.07794e-06, 1.16151449537, 213.299095438 ],
    [ 5.16224e-06, 6.2404910535, 206.185548437 ],
    [ 4.26107e-06, 2.46891791825, 7.1135470008 ],
    [ 2.67495e-06, 0.18644716875, 426.598190876 ],
    [ 1.70055e-06, 5.96000580678, 199.072001436 ],
    [ 1.44813e-06, 1.44265291294, 227.52618944 ],
    [ 1.50056e-06, 0.47968186381, 433.711737877 ],
    [ 1.21067e-06, 2.40476128629, 14.2270940016 ],
    [ 4.7503e-07, 5.56874777537, 639.897286314 ],
    [ 1.5651e-07, 2.89076603229, 110.206321219 ],
    [ 1.6364e-07, 0.53928792415, 440.825284878 ],
    [ 1.8973e-07, 5.8551475302, 647.010833315 ],
    [ 1.449e-07, 1.31356947305, 412.371096874 ],
    [ 1.231e-07, 2.10618416544, 323.505416657 ],
    [ 1.4688e-07, 0.29685965949, 419.484643875 ],
    [ 1.0893e-07, 2.45288604864, 117.31986822 ],
    [ 1.1348e-07, 0.17490312278, 95.9792272178 ],
    [ 9.21e-08, 2.30108004686, 21.3406410024 ],
    [ 9.007e-08, 1.55461797818, 88.865680217 ],
    [ 8.089e-08, 3.62570131736, 302.164775655 ],
    [ 8.668e-08, 0.69662054025, 216.480489176 ],
    [ 7.794e-08, 4.50477684881, 853.196381752 ],
    [ 8.261e-08, 1.27827363929, 234.63973644 ],
    [ 9.616e-08, 3.14159265359, 0 ],
    [ 4.937e-08, 2.61740899859, 515.463871093 ],
    [ 4.365e-08, 0.05807483283, 191.958454436 ],
    [ 5.944e-08, 5.17118993601, 103.092774219 ],
    [ 3.675e-08, 3.26106349552, 210.1177017 ],
    [ 4.387e-08, 4.98731675488, 860.309928753 ],
    [ 4.001e-08, 1.58149127982, 330.618963658 ],
    [ 3.875e-08, 6.01795427919, 654.124380316 ],
    [ 3.956e-08, 1.58112427915, 405.257549874 ],
    [ 2.962e-08, 2.67872711614, 522.577418094 ],
    [ 2.961e-08, 0.73625753769, 209.366942175 ],
    [ 3.102e-08, 1.28964935689, 728.762966531 ],
    [ 2.266e-08, 3.17206848552, 203.004154699 ],
    [ 2.16e-08, 1.08089139585, 124.433415221 ],
    [ 2.118e-08, 6.14470291334, 429.779584614 ],
    [ 2.066e-08, 3.92049451838, 1066.49547719 ],
    [ 2.211e-08, 0.80527848095, 625.670192312 ],
    [ 2.147e-08, 0.49411458094, 447.938831878 ],
    [ 1.927e-08, 0.78578237497, 295.051228654 ],
    [ 1.793e-08, 0.12585846743, 942.062061969 ],
    [ 1.706e-08, 1.43840425376, 224.344795702 ],
    [ 1.986e-08, 1.95084664432, 831.85574075 ],
    [ 1.6e-08, 5.41185167676, 824.742193749 ],
    [ 1.717e-08, 0.83103173636, 223.594036176 ],
    [ 1.598e-08, 1.93650947414, 529.690965095 ],
    [ 1.303e-08, 5.54181517607, 316.391869657 ],
    [ 1.288e-08, 1.91850903205, 956.289155971 ],
    [ 1.184e-08, 3.02295343322, 184.844907435 ],
    [ 1.234e-08, 0.93431249316, 721.64941953 ],
    [ 1.212e-08, 6.13915785712, 422.666037613 ],
    [ 1.249e-08, 5.97947803636, 195.139848173 ],
    [ 1.142e-08, 0.96309096169, 536.804512095 ],
    [ 1.011e-08, 1.14653787675, 838.96928775 ],
    [ 1.031e-08, 1.15377008428, 1148.24761041 ],
    [ 1.109e-08, 1.63414938335, 17.4084877393 ],
    [ 1.094e-08, 0.98475168289, 1045.15483619 ],
    [ 9.85e-09, 3.05768671768, 1574.84580128 ],
    [ 8.87e-09, 2.52072621499, 508.350324092 ],
    [ 9.86e-09, 1.63414986297, 735.876513532 ],
    [ 7.53e-09, 4.90938931967, 56.6223513026 ],
    [ 7.91e-09, 2.74375014558, 423.416797138 ]
];

KMG.VSOPTerms.saturn_R5 = [
    [ 1.28668e-06, 5.91279864289, 220.412642439 ],
    [ 3.2196e-07, 0.69558284384, 7.1135470008 ],
    [ 2.6737e-07, 5.91270395039, 227.52618944 ],
    [ 1.9837e-07, 0.6739685296, 14.2270940016 ],
    [ 1.9994e-07, 4.95031713518, 433.711737877 ],
    [ 1.3627e-07, 1.47747814594, 199.072001436 ],
    [ 1.3706e-07, 4.59824754628, 426.598190876 ],
    [ 1.4068e-07, 2.63892426573, 206.185548437 ],
    [ 7.324e-08, 4.64667642371, 213.299095438 ],
    [ 4.916e-08, 3.63019930267, 639.897286314 ],
    [ 2.985e-08, 4.64378755577, 191.958454436 ],
    [ 2.675e-08, 0.51742057647, 323.505416657 ],
    [ 3.42e-08, 4.91489841099, 440.825284878 ],
    [ 3.171e-08, 4.10118061147, 647.010833315 ],
    [ 2.885e-08, 3.24108476164, 419.484643875 ],
    [ 2.173e-08, 5.39877301813, 302.164775655 ],
    [ 1.873e-08, 3.22101902976, 95.9792272178 ],
    [ 2.055e-08, 3.60842101774, 88.865680217 ],
    [ 1.509e-08, 2.68946095921, 853.196381752 ],
    [ 1.518e-08, 0.89692431439, 515.463871093 ],
    [ 1.737e-08, 0.41793799128, 117.31986822 ],
    [ 1.64e-08, 0, 0 ],
    [ 1.285e-08, 5.82563377753, 234.63973644 ],
    [ 9.83e-09, 5.91256391941, 3.1813937377 ],
    [ 1.054e-08, 0.2077897712, 412.371096874 ],
    [ 7.19e-09, 5.20973072924, 216.480489176 ],
    [ 7.06e-09, 2.65805151133, 110.206321219 ]
];

KMG.VSOPTerms.uranus_L0 = [
    [ 5.48129294297, 0, 0 ],
    [ 0.09260408234, 0.89106421507, 74.7815985673 ],
    [ 0.01504247898, 3.6271926092, 1.4844727083 ],
    [ 0.00365981674, 1.89962179044, 73.297125859 ],
    [ 0.00272328168, 3.35823706307, 149.563197135 ],
    [ 0.00070328461, 5.39254450063, 63.7358983034 ],
    [ 0.00068892678, 6.09292483287, 76.2660712756 ],
    [ 0.00061998615, 2.26952066061, 2.9689454166 ],
    [ 0.00061950719, 2.85098872691, 11.0457002639 ],
    [ 0.0002646877, 3.14152083966, 71.8126531507 ],
    [ 0.00025710476, 6.11379840493, 454.909366527 ],
    [ 0.0002107885, 4.36059339067, 148.078724426 ],
    [ 0.00017818647, 1.74436930289, 36.6485629295 ],
    [ 0.00014613507, 4.73732166022, 3.9321532631 ],
    [ 0.00011162509, 5.8268179635, 224.344795702 ],
    [ 0.0001099791, 0.48865004018, 138.517496871 ],
    [ 9.527478e-05, 2.95516862826, 35.1640902212 ],
    [ 7.545601e-05, 5.236265824, 109.945688788 ],
    [ 4.220241e-05, 3.23328220918, 70.8494453042 ],
    [ 4.0519e-05, 2.277550173, 151.047669843 ],
    [ 3.354596e-05, 1.0654900738, 4.4534181249 ],
    [ 2.926718e-05, 4.62903718891, 9.5612275556 ],
    [ 3.49034e-05, 5.48306144511, 146.594251718 ],
    [ 3.144069e-05, 4.75199570434, 77.7505439839 ],
    [ 2.922333e-05, 5.35235361027, 85.8272988312 ],
    [ 2.272788e-05, 4.36600400036, 70.3281804424 ],
    [ 2.051219e-05, 1.51773566586, 0.1118745846 ],
    [ 2.148602e-05, 0.60745949945, 38.1330356378 ],
    [ 1.991643e-05, 4.92437588682, 277.034993741 ],
    [ 1.376226e-05, 2.04283539351, 65.2203710117 ],
    [ 1.666902e-05, 3.62744066769, 380.12776796 ],
    [ 1.284107e-05, 3.11347961505, 202.253395174 ],
    [ 1.150429e-05, 0.93343589092, 3.1813937377 ],
    [ 1.533221e-05, 2.58594681212, 52.6901980395 ],
    [ 1.281604e-05, 0.54271272721, 222.860322994 ],
    [ 1.372139e-05, 4.19641530878, 111.430161497 ],
    [ 1.221029e-05, 0.1990065003, 108.46121608 ],
    [ 9.46181e-06, 1.19253165736, 127.471796607 ],
    [ 1.150989e-05, 4.17898916639, 33.6796175129 ],
    [ 1.244347e-05, 0.91614441731, 2.4476805548 ],
    [ 1.072013e-05, 0.23566016888, 62.2514255951 ],
    [ 1.090463e-05, 1.77501500531, 12.5301729722 ],
    [ 7.07935e-06, 5.18291670033, 213.299095438 ],
    [ 6.53376e-06, 0.96587864431, 78.7137518304 ],
    [ 6.2757e-06, 0.18209040157, 984.600331622 ],
    [ 5.24485e-06, 2.01275350435, 299.126394269 ],
    [ 5.59396e-06, 3.35768635981, 0.5212648618 ],
    [ 6.06847e-06, 5.4320988925, 529.690965095 ],
    [ 4.04897e-06, 5.98690517582, 8.0767548473 ],
    [ 4.67183e-06, 0.41482520325, 145.10977901 ],
    [ 4.71311e-06, 1.40661608158, 184.727287356 ],
    [ 4.83226e-06, 2.10553218341, 0.9632078465 ],
    [ 3.95569e-06, 5.87037914022, 351.816592309 ],
    [ 4.33527e-06, 5.52141037763, 183.242814648 ],
    [ 3.09843e-06, 5.83301863492, 145.631043871 ],
    [ 3.78642e-06, 2.34989391811, 56.6223513026 ],
    [ 3.99033e-06, 0.33796522578, 415.552490612 ],
    [ 3.00392e-06, 5.64355207373, 22.0914005278 ],
    [ 2.4923e-06, 4.74621772167, 225.82926841 ],
    [ 2.39311e-06, 2.35072447972, 137.033024162 ],
    [ 2.94103e-06, 5.83919833199, 39.6175083461 ],
    [ 2.1645e-06, 4.77807782477, 340.770892045 ],
    [ 2.51784e-06, 1.63692846797, 221.375850285 ],
    [ 2.19624e-06, 1.92233630317, 67.6680515665 ],
    [ 2.02019e-06, 1.29693040688, 0.0481841098 ],
    [ 2.24105e-06, 0.51589500446, 84.3428261229 ],
    [ 2.16563e-06, 6.14217553245, 5.9378908332 ],
    [ 2.22605e-06, 2.84314245655, 0.2606324309 ],
    [ 2.07907e-06, 5.5801263788, 68.8437077341 ],
    [ 1.8752e-06, 1.3192760652, 0.1600586944 ],
    [ 1.99306e-06, 0.95648612651, 152.532142551 ],
    [ 1.58075e-06, 0.73795262538, 54.1746707478 ],
    [ 1.68606e-06, 5.87865394974, 18.1592472647 ],
    [ 1.70326e-06, 3.67712574811, 5.4166259714 ],
    [ 1.93647e-06, 1.88800957346, 456.393839236 ],
    [ 1.93051e-06, 0.91616617785, 453.424893819 ],
    [ 1.81991e-06, 3.53625031273, 79.2350166922 ],
    [ 1.73102e-06, 1.53869634445, 160.608897399 ],
    [ 1.64483e-06, 1.42390725018, 106.976743372 ],
    [ 1.7194e-06, 5.67948631369, 219.891377577 ],
    [ 1.62805e-06, 3.05027759814, 112.914634205 ],
    [ 1.46659e-06, 1.26296726443, 59.8037450403 ],
    [ 1.39276e-06, 5.38697273752, 32.1951448046 ],
    [ 1.38636e-06, 4.25998533357, 909.818733055 ],
    [ 1.43058e-06, 1.2998045387, 35.4247226521 ],
    [ 1.23986e-06, 1.37489956563, 7.1135470008 ],
    [ 1.04582e-06, 5.02793726187, 0.7507595254 ],
    [ 1.03295e-06, 0.68145096277, 14.977853527 ],
    [ 9.4957e-07, 0.90678215577, 74.6697239827 ],
    [ 8.2948e-07, 2.92800368384, 265.989293477 ],
    [ 1.10403e-06, 2.02666475709, 554.069987483 ],
    [ 9.4433e-07, 3.94271122207, 74.8934731519 ],
    [ 8.0072e-07, 1.01583506701, 6.592282139 ],
    [ 1.09576e-06, 5.70572405893, 77.962992305 ],
    [ 8.5946e-07, 1.70581556772, 82.8583534146 ],
    [ 1.03799e-06, 1.45794315266, 24.3790223882 ],
    [ 7.4661e-07, 4.63178804642, 69.3649725959 ],
    [ 7.9813e-07, 3.00965058125, 297.641921561 ],
    [ 8.449e-07, 0.36886722094, 186.211760064 ],
    [ 8.8657e-07, 0.52498114072, 181.758341939 ],
    [ 7.0368e-07, 1.18984702891, 66.70484372 ],
    [ 6.9971e-07, 0.87463619381, 305.346169393 ],
    [ 7.0082e-07, 3.75845990682, 131.40394987 ],
    [ 8.435e-07, 5.88592009032, 256.539940506 ],
    [ 7.4493e-07, 6.2423868428, 447.795819526 ],
    [ 6.2454e-07, 0.16868402018, 479.288388915 ],
    [ 7.2904e-07, 2.84891153624, 462.022913528 ],
    [ 6.9205e-07, 4.43939850837, 39.3568759152 ],
    [ 7.6729e-07, 4.58716659215, 6.2197751235 ],
    [ 7.3423e-07, 4.27591432865, 87.3117715395 ],
    [ 5.5577e-07, 1.49804110443, 71.6002048296 ],
    [ 5.7315e-07, 1.63007488533, 143.625306301 ],
    [ 6.1674e-07, 3.18616775231, 77.2292791221 ],
    [ 5.7668e-07, 3.67128264895, 51.2057253312 ],
    [ 5.0352e-07, 1.12355398826, 20.6069278195 ],
    [ 5.372e-07, 5.51853172042, 128.956269315 ],
    [ 5.7895e-07, 2.6686921691, 381.612240668 ],
    [ 5.8089e-07, 1.5863521331, 60.7669528868 ],
    [ 4.539e-07, 0.48027056949, 14.0146456805 ],
    [ 3.7513e-07, 6.06768205316, 211.81462273 ],
    [ 3.8565e-07, 3.43547372715, 153.495350398 ],
    [ 4.6085e-07, 4.36220351003, 75.7448064138 ],
    [ 4.022e-07, 4.57551863155, 46.2097904851 ],
    [ 3.4314e-07, 2.9385893887, 140.001969579 ],
    [ 3.8754e-07, 5.59046474201, 99.1606209555 ],
    [ 3.4864e-07, 1.0287768134, 203.737867882 ],
    [ 4.0016e-07, 0.69893479575, 218.406904869 ],
    [ 3.2562e-07, 4.21895389367, 200.768922466 ],
    [ 3.1889e-07, 5.50965372046, 72.3339180125 ],
    [ 4.1668e-07, 3.82449219367, 81.0013736908 ],
    [ 3.4668e-07, 0.39221757952, 1.3725981237 ],
    [ 3.9741e-07, 6.05490168728, 293.188503436 ],
    [ 2.7545e-07, 2.18754130148, 125.987323898 ],
    [ 3.6328e-07, 1.66621808766, 258.024413215 ],
    [ 3.5508e-07, 1.96672429313, 835.037134487 ],
    [ 3.5373e-07, 3.72274050162, 692.587484354 ],
    [ 2.7364e-07, 2.10315692995, 209.366942175 ],
    [ 2.6442e-07, 4.48298644364, 373.907992837 ],
    [ 3.4517e-07, 1.08687838842, 191.20769491 ],
    [ 2.6317e-07, 3.6335778804, 490.334089179 ],
    [ 2.9888e-07, 3.87365011384, 259.508885923 ],
    [ 2.5926e-07, 0.54378574725, 41.6444977756 ],
    [ 2.711e-07, 0.00478270361, 28.5718080822 ],
    [ 2.6313e-07, 5.81236674192, 75.3028634291 ],
    [ 3.4277e-07, 6.05545630018, 275.550521033 ],
    [ 2.4315e-07, 3.18651202042, 81.3738807063 ],
    [ 2.9936e-07, 1.8878903041, 269.921446741 ],
    [ 2.6242e-07, 6.20368166778, 134.585343608 ],
    [ 2.2842e-07, 0.92857008471, 288.080694005 ],
    [ 2.5216e-07, 5.43032747843, 116.426096343 ],
    [ 2.7063e-07, 4.75299776159, 41.1019810544 ],
    [ 2.2706e-07, 0.5305745312, 1514.29129672 ],
    [ 2.648e-07, 4.77161377188, 284.148540742 ],
    [ 2.195e-07, 4.59091247537, 404.506790348 ],
    [ 2.2022e-07, 1.84418065243, 617.805885786 ],
    [ 2.4811e-07, 4.70901440561, 378.643295252 ],
    [ 2.904e-07, 0.17160028536, 528.206492386 ],
    [ 2.0487e-07, 0.10247779138, 195.139848173 ],
    [ 2.0726e-07, 5.62240737217, 55.6591434561 ],
    [ 2.5919e-07, 0.74700144605, 278.51946645 ],
    [ 2.2824e-07, 3.58334799786, 1.5963472929 ],
    [ 2.1855e-07, 0.05691568897, 173.942219523 ]
    // 162 terms retained
];

KMG.VSOPTerms.uranus_L1 = [
    [ 74.7815986091, 0, 0 ],
    [ 0.00154332863, 5.24158770553, 74.7815985673 ],
    [ 0.00024456474, 1.71260334156, 1.4844727083 ],
    [ 9.258442e-05, 0.4282973235, 11.0457002639 ],
    [ 8.265977e-05, 1.50218091379, 63.7358983034 ],
    [ 9.15016e-05, 1.41213765216, 149.563197135 ],
    [ 3.899108e-05, 0.4648357916, 3.9321532631 ],
    [ 2.277065e-05, 4.17199181523, 76.2660712756 ],
    [ 1.92747e-05, 0.52976188479, 2.9689454166 ],
    [ 1.232725e-05, 1.58632088145, 70.8494453042 ],
    [ 7.91201e-06, 5.43640595978, 3.1813937377 ],
    [ 7.66954e-06, 1.99425624214, 73.297125859 ],
    [ 4.81813e-06, 2.98574070918, 85.8272988312 ],
    [ 4.49635e-06, 4.14242946378, 138.517496871 ],
    [ 5.65091e-06, 3.87400932383, 224.344795702 ],
    [ 4.266e-06, 4.73158166033, 71.8126531507 ],
    [ 3.47745e-06, 2.45368882357, 9.5612275556 ],
    [ 3.32699e-06, 2.55525645638, 148.078724426 ],
    [ 3.17054e-06, 5.57858240166, 52.6901980395 ],
    [ 1.79897e-06, 5.68365861477, 12.5301729722 ],
    [ 1.71119e-06, 3.00040981195, 78.7137518304 ],
    [ 2.05579e-06, 2.36242761009, 2.4476805548 ],
    [ 1.58038e-06, 2.90930836614, 0.9632078465 ],
    [ 1.8909e-06, 4.20258063269, 56.6223513026 ],
    [ 2.02696e-06, 0.34360451816, 151.047669843 ],
    [ 1.54762e-06, 5.59005854748, 4.4534181249 ],
    [ 1.43472e-06, 2.59047613814, 62.2514255951 ],
    [ 1.51459e-06, 2.93993108236, 77.7505439839 ],
    [ 1.53561e-06, 4.65220425575, 35.1640902212 ],
    [ 1.21462e-06, 4.14937021194, 127.471796607 ],
    [ 1.15538e-06, 3.73245717203, 65.2203710117 ],
    [ 1.02213e-06, 4.18917777961, 145.631043871 ],
    [ 1.01894e-06, 6.03382617339, 0.1118745846 ],
    [ 8.8409e-07, 3.99004756152, 18.1592472647 ],
    [ 8.7591e-07, 6.15639888455, 202.253395174 ],
    [ 8.0591e-07, 2.64095955809, 22.0914005278 ],
    [ 7.2047e-07, 6.04586846354, 70.3281804424 ],
    [ 6.8727e-07, 4.05075598128, 77.962992305 ],
    [ 5.9329e-07, 3.70581611259, 67.6680515665 ],
    [ 4.7388e-07, 3.54091852775, 351.816592309 ],
    [ 4.2712e-07, 5.72066604839, 5.4166259714 ],
    [ 4.4405e-07, 5.91042456876, 7.1135470008 ],
    [ 3.5784e-07, 3.29585017124, 8.0767548473 ],
    [ 3.5724e-07, 3.32933903151, 71.6002048296 ],
    [ 3.6081e-07, 5.89881403933, 33.6796175129 ],
    [ 4.1676e-07, 4.94718694607, 222.860322994 ],
    [ 3.1215e-07, 5.48938304422, 160.608897399 ],
    [ 3.1453e-07, 5.62016551866, 984.600331622 ],
    [ 3.5171e-07, 5.07842850969, 38.1330356378 ],
    [ 3.5543e-07, 0.0550243966, 299.126394269 ],
    [ 3.081e-07, 5.49604033608, 59.8037450403 ],
    [ 2.8883e-07, 4.51759500034, 84.3428261229 ],
    [ 2.6705e-07, 5.53637447019, 131.40394987 ],
    [ 2.9956e-07, 1.66046193211, 447.795819526 ],
    [ 2.9206e-07, 1.14722620686, 462.022913528 ],
    [ 2.5811e-07, 4.99049651973, 137.033024162 ],
    [ 2.5474e-07, 5.73884476629, 380.12776796 ],
    [ 2.1683e-07, 2.80603505468, 69.3649725959 ],
    [ 2.3016e-07, 2.24983506758, 111.430161497 ],
    [ 1.9228e-07, 3.55594434001, 54.1746707478 ],
    [ 2.1696e-07, 0.9887213968, 213.299095438 ],
    [ 1.9457e-07, 1.86460184285, 108.46121608 ],
    [ 1.614e-07, 3.10230818045, 14.977853527 ],
    [ 1.3138e-07, 1.95065801902, 87.3117715395 ],
    [ 1.3904e-07, 1.5420709382, 340.770892045 ],
    [ 1.3543e-07, 4.38430774439, 5.9378908332 ],
    [ 1.6493e-07, 2.80104132725, 225.82926841 ],
    [ 1.3111e-07, 5.88308816286, 6.2197751235 ],
    [ 1.1811e-07, 0.32606713574, 35.4247226521 ],
    [ 1.2471e-07, 0.32808369953, 51.2057253312 ],
    [ 1.0981e-07, 1.6929966677, 45.5766510387 ],
    [ 1.0888e-07, 5.970420479, 265.989293477 ],
    [ 1.1433e-07, 3.37877229066, 72.3339180125 ],
    [ 1.2003e-07, 3.60398124894, 269.921446741 ],
    [ 1.2936e-07, 5.38263455371, 152.532142551 ],
    [ 1.1674e-07, 1.74413259892, 79.2350166922 ],
    [ 1.0446e-07, 4.16878885118, 24.3790223882 ],
    [ 1.0634e-07, 3.06878261442, 284.148540742 ],
    [ 9.674e-08, 5.51339189448, 153.495350398 ],
    [ 9.59e-08, 0.49485192598, 209.366942175 ],
    [ 9.269e-08, 3.5458995448, 41.6444977756 ],
    [ 9.568e-08, 5.59970406046, 82.8583534146 ],
    [ 9.31e-08, 4.49468477512, 20.6069278195 ],
    [ 9.632e-08, 1.00932793597, 68.8437077341 ],
    [ 8.745e-08, 3.91021963381, 60.7669528868 ],
    [ 1.0176e-07, 3.51758777802, 529.690965095 ],
    [ 1.0048e-07, 4.64919764888, 77.2292791221 ],
    [ 8.679e-08, 1.96792212254, 195.139848173 ],
    [ 8.387e-08, 4.41835912213, 134.585343608 ],
    [ 7.983e-08, 5.35924979986, 75.7448064138 ],
    [ 9.263e-08, 3.95182354442, 39.6175083461 ],
    [ 7.594e-08, 5.77307721631, 73.8183907208 ],
    [ 7.713e-08, 4.44174669087, 14.0146456805 ],
    [ 7.49e-08, 2.17900285342, 145.10977901 ],
    [ 7.873e-08, 5.74835382023, 184.727287356 ],
    [ 7.688e-08, 2.41795807218, 146.594251718 ],
    [ 6.438e-08, 0.84540553248, 32.1951448046 ],
    [ 6.256e-08, 2.17063033953, 74.8934731519 ],
    [ 7.937e-08, 0.1717266497, 120.358249606 ],
    [ 7.02e-08, 4.12096862702, 191.20769491 ],
    [ 6.862e-08, 2.13341287037, 116.426096343 ],
    [ 5.208e-08, 3.11117214481, 106.976743372 ],
    [ 4.811e-08, 2.25140758551, 46.2097904851 ],
    [ 4.566e-08, 3.45427623308, 0.7507595254 ],
    [ 4.473e-08, 3.94632863732, 6.592282139 ],
    [ 5.202e-08, 1.15450734319, 112.914634205 ],
    [ 4.323e-08, 5.15540388592, 144.146571163 ],
    [ 4.746e-08, 5.18244413774, 81.0013736908 ],
    [ 4.232e-08, 0.2192191002, 92.940845832 ],
    [ 4.323e-08, 2.52442111234, 99.1606209555 ],
    [ 3.879e-08, 2.78711315762, 565.115687747 ],
    [ 4.332e-08, 5.91118459987, 221.375850285 ],
    [ 3.801e-08, 0.75135339336, 58.1068240109 ],
    [ 3.812e-08, 3.23225846555, 479.288388915 ],
    [ 3.656e-08, 5.27986185627, 66.9172920411 ],
    [ 3.811e-08, 4.92593102646, 125.987323898 ],
    [ 4.172e-08, 2.28697665136, 109.945688788 ],
    [ 3.472e-08, 2.95403921517, 74.6697239827 ],
    [ 3.501e-08, 4.89811329155, 28.3111756513 ],
    [ 4.495e-08, 4.1545333789, 344.703045308 ],
    [ 4.258e-08, 2.68419933901, 7.8643065262 ],
    [ 3.456e-08, 0.02638325764, 140.001969579 ],
    [ 4.181e-08, 1.90641663083, 277.034993741 ],
    [ 3.644e-08, 5.32238666094, 408.438943611 ],
    [ 3.205e-08, 0.05087987138, 220.412642439 ],
    [ 3.19e-08, 1.48430670387, 128.956269315 ],
    [ 3.901e-08, 6.25926496244, 0.8937718773 ],
    [ 3.788e-08, 0.03327505225, 152.744590872 ],
    [ 3.2e-08, 0.52009458683, 2.2876218604 ],
    [ 3.011e-08, 1.93475294714, 80.1982245387 ],
    [ 4.054e-08, 5.23320423468, 96.8729990951 ],
    [ 3.798e-08, 4.97868021019, 36.6485629295 ],
    [ 3.895e-08, 1.10480659598, 297.641921561 ],
    [ 3.295e-08, 4.80719384894, 422.666037613 ],
    [ 3.192e-08, 2.81905779664, 453.424893819 ],
    [ 2.804e-08, 6.19069392998, 135.548551454 ],
    [ 3.469e-08, 5.88266049174, 16.6747745564 ],
    [ 2.785e-08, 1.35852942533, 404.506790348 ],
    [ 2.892e-08, 0.53676605577, 159.12442469 ],
    [ 3.232e-08, 1.54622440929, 23.5758732361 ],
    [ 2.958e-08, 6.25751544465, 456.393839236 ],
    [ 2.542e-08, 1.85372598824, 490.334089179 ],
    [ 2.547e-08, 5.19766530615, 173.942219523 ],
    [ 3.118e-08, 6.10201148242, 142.449650134 ],
    [ 2.762e-08, 3.51066557656, 288.080694005 ],
    [ 2.793e-08, 3.90482859776, 358.93013931 ],
    [ 2.958e-08, 5.31404018803, 55.1378785943 ],
    [ 2.387e-08, 1.31646029756, 211.81462273 ],
    [ 2.413e-08, 4.38647851761, 60.5545045657 ],
    [ 2.285e-08, 2.31869038469, 31.492569389 ],
    [ 2.366e-08, 2.21968144549, 66.70484372 ],
    [ 2.779e-08, 4.72642945119, 186.211760064 ],
    [ 2.27e-08, 3.49350071105, 206.185548437 ],
    [ 2.224e-08, 0.41045917285, 81.3738807063 ],
    [ 2.196e-08, 0.76298510234, 17.5261078183 ],
    [ 2.115e-08, 3.58641580944, 333.657345044 ],
    [ 2.575e-08, 0.73175693995, 200.768922466 ],
    [ 2.158e-08, 2.61976125405, 13.3333221243 ],
    [ 2.041e-08, 6.27470432139, 98.8999885246 ],
    [ 2.212e-08, 2.36295359318, 347.884439046 ],
    [ 2.183e-08, 2.4900467683, 76.4785195967 ],
    [ 2.032e-08, 1.6748491158, 235.390495966 ],
    [ 2.226e-08, 5.9732773815, 1514.29129672 ]
    // 163 terms retained
];

KMG.VSOPTerms.uranus_L2 = [
    [ 2.349469e-05, 2.26708640433, 74.7815985673 ],
    [ 8.48806e-06, 3.14159265359, 0 ],
    [ 7.68983e-06, 4.52562378749, 11.0457002639 ],
    [ 5.51555e-06, 3.2581932204, 63.7358983034 ],
    [ 5.41559e-06, 2.27572631399, 3.9321532631 ],
    [ 5.29491e-06, 4.92336172394, 1.4844727083 ],
    [ 2.57527e-06, 3.69060540044, 3.1813937377 ],
    [ 1.82036e-06, 6.21866555925, 70.8494453042 ],
    [ 1.84429e-06, 5.05954505833, 149.563197135 ],
    [ 4.9505e-07, 6.03085160423, 56.6223513026 ],
    [ 5.3456e-07, 1.45801353517, 76.2660712756 ],
    [ 3.8334e-07, 1.78433163102, 52.6901980395 ],
    [ 4.4885e-07, 3.90644983662, 2.4476805548 ],
    [ 4.4623e-07, 0.81232539761, 85.8272988312 ],
    [ 3.7373e-07, 4.46132739805, 2.9689454166 ],
    [ 3.3044e-07, 0.86461989031, 9.5612275556 ],
    [ 2.4305e-07, 2.10670976428, 18.1592472647 ],
    [ 2.925e-07, 5.09724793503, 73.297125859 ],
    [ 2.2309e-07, 4.81978108793, 78.7137518304 ],
    [ 2.2283e-07, 5.99230347559, 138.517496871 ],
    [ 1.723e-07, 2.53731197138, 145.631043871 ],
    [ 2.1416e-07, 2.39692592406, 77.962992305 ],
    [ 1.5114e-07, 1.43013979998, 224.344795702 ],
    [ 1.6756e-07, 3.46508324378, 12.5301729722 ],
    [ 1.2003e-07, 0.01666017885, 22.0914005278 ],
    [ 1.0497e-07, 4.47250656935, 62.2514255951 ],
    [ 1.0943e-07, 0.08477481315, 127.471796607 ],
    [ 8.683e-08, 4.25475342937, 7.1135470008 ],
    [ 1.0478e-07, 5.16510093405, 71.6002048296 ],
    [ 7.208e-08, 1.25579094145, 5.4166259714 ],
    [ 8.383e-08, 5.49939298653, 67.6680515665 ],
    [ 6.079e-08, 5.44023447414, 65.2203710117 ],
    [ 5.718e-08, 1.83543074459, 202.253395174 ],
    [ 6.109e-08, 3.36329480272, 447.795819526 ],
    [ 6.002e-08, 5.72509014963, 462.022913528 ],
    [ 5.684e-08, 4.14533132422, 151.047669843 ],
    [ 5.091e-08, 3.52369031374, 59.8037450403 ],
    [ 5.147e-08, 1.05915315998, 131.40394987 ],
    [ 4.917e-08, 3.38475371297, 4.4534181249 ],
    [ 4.818e-08, 1.20436413021, 71.8126531507 ],
    [ 4.697e-08, 6.13059120042, 148.078724426 ],
    [ 3.95e-08, 0.69544777458, 77.7505439839 ],
    [ 3.655e-08, 1.75283968054, 351.816592309 ],
    [ 3.144e-08, 3.30914690507, 160.608897399 ],
    [ 3.17e-08, 6.13784634729, 77.2292791221 ],
    [ 3.149e-08, 3.83524373649, 45.5766510387 ],
    [ 3.616e-08, 4.56973348262, 454.909366527 ],
    [ 2.673e-08, 1.05631111199, 69.3649725959 ],
    [ 2.66e-08, 5.35501232753, 269.921446741 ],
    [ 2.315e-08, 2.61423820966, 84.3428261229 ],
    [ 2.258e-08, 5.07517615514, 14.977853527 ],
    [ 2.249e-08, 1.37812609668, 284.148540742 ],
    [ 2.072e-08, 4.3496677836, 984.600331622 ],
    [ 2.101e-08, 2.31175293338, 120.358249606 ],
    [ 1.808e-08, 0.52249831108, 137.033024162 ],
    [ 1.849e-08, 5.69618054054, 54.1746707478 ],
    [ 1.983e-08, 3.87043200848, 195.139848173 ],
    [ 1.632e-08, 5.07069503204, 209.366942175 ],
    [ 1.578e-08, 2.91229378751, 51.2057253312 ],
    [ 1.722e-08, 6.25913624391, 41.6444977756 ],
    [ 1.656e-08, 6.26113629911, 277.034993741 ],
    [ 1.822e-08, 1.24304611018, 35.1640902212 ],
    [ 1.345e-08, 2.04057300383, 70.3281804424 ],
    [ 1.253e-08, 2.65486278486, 134.585343608 ],
    [ 1.239e-08, 4.63255501972, 92.940845832 ],
    [ 1.369e-08, 6.08201469405, 87.3117715395 ],
    [ 1.277e-08, 5.87454788183, 60.5545045657 ],
    [ 1.281e-08, 2.51504858314, 72.3339180125 ],
    [ 1.25e-08, 1.09008933023, 213.299095438 ],
    [ 1.055e-08, 4.00338488062, 299.126394269 ],
    [ 1.133e-08, 4.64929170681, 152.744590872 ],
    [ 1.082e-08, 1.07336611951, 153.495350398 ],
    [ 1.037e-08, 4.82158521698, 116.426096343 ],
    [ 8.63e-09, 3.56774115747, 340.770892045 ],
    [ 9.57e-09, 2.11521253777, 20.6069278195 ],
    [ 9.52e-09, 2.4717064451, 380.12776796 ],
    [ 8.36e-09, 6.12347738126, 49.5088043018 ],
    [ 8.08e-09, 0.29677438017, 191.20769491 ],
    [ 8.08e-09, 4.08162792952, 14.2270940016 ],
    [ 7.92e-09, 6.1709106312, 344.703045308 ],
    [ 7.91e-09, 2.37030711541, 58.1068240109 ],
    [ 9.14e-09, 2.11419968166, 14.0146456805 ],
    [ 7.88e-09, 0.75228496417, 408.438943611 ],
    [ 7.63e-09, 2.38121244677, 222.860322994 ],
    [ 8.91e-09, 2.04340711828, 265.989293477 ],
    [ 7.3e-09, 3.10064098912, 422.666037613 ],
    [ 7.65e-09, 0.7772382722, 76.4785195967 ],
    [ 6.45e-09, 2.77108845143, 96.8729990951 ],
    [ 7.45e-09, 2.35633194869, 358.93013931 ],
    [ 6.2e-09, 1.98188971784, 33.6796175129 ],
    [ 6.55e-09, 3.8541585028, 16.6747745564 ],
    [ 6.08e-09, 0.15790159997, 28.3111756513 ],
    [ 5.87e-09, 1.09637968292, 55.1378785943 ],
    [ 6.17e-09, 1.70137701054, 8.0767548473 ],
    [ 6.45e-09, 5.17890892522, 23.5758732361 ],
    [ 5.89e-09, 3.39293635432, 144.146571163 ],
    [ 5.98e-09, 3.77279530334, 80.1982245387 ],
    [ 5.62e-09, 4.90624120147, 35.4247226521 ],
    [ 5.87e-09, 4.33026772564, 29.2049475286 ]
    // 99 terms retained
];

KMG.VSOPTerms.uranus_L3 = [
    [ 1.22192e-06, 0.02112102225, 74.7815985673 ],
    [ 6.8195e-07, 4.12138633187, 3.9321532631 ],
    [ 5.2729e-07, 2.38808499397, 11.0457002639 ],
    [ 4.3714e-07, 2.95937380925, 1.4844727083 ],
    [ 4.5405e-07, 2.04405402149, 3.1813937377 ],
    [ 2.4903e-07, 4.886800756, 63.7358983034 ],
    [ 2.1004e-07, 4.54879176205, 70.8494453042 ],
    [ 8.985e-08, 1.58255257968, 56.6223513026 ],
    [ 9.158e-08, 2.57000447334, 149.563197135 ],
    [ 1.0361e-07, 0, 0 ],
    [ 4.261e-08, 0.22780215466, 18.1592472647 ],
    [ 3.625e-08, 5.3836730459, 76.2660712756 ],
    [ 3.244e-08, 5.01058611704, 85.8272988312 ],
    [ 3.488e-08, 4.13160885916, 52.6901980395 ],
    [ 3.57e-08, 0.94065081296, 77.962992305 ],
    [ 2.738e-08, 0.4034653554, 78.7137518304 ],
    [ 2.233e-08, 0.87157987676, 145.631043871 ],
    [ 1.948e-08, 2.67957461817, 7.1135470008 ],
    [ 2.12e-08, 5.64073933192, 9.5612275556 ],
    [ 1.566e-08, 5.46300116637, 73.297125859 ],
    [ 1.308e-08, 1.25835033636, 12.5301729722 ],
    [ 1.616e-08, 0.49324165265, 71.6002048296 ],
    [ 1.23e-08, 3.93093451148, 22.0914005278 ],
    [ 9.06e-09, 2.17573166732, 127.471796607 ],
    [ 8.11e-09, 5.08300105756, 447.795819526 ],
    [ 8e-09, 4.00214562488, 462.022913528 ],
    [ 7.18e-09, 0.34600103024, 5.6290742925 ],
    [ 7.18e-09, 1.19635899416, 138.517496871 ],
    [ 6.8e-09, 2.9444450611, 131.40394987 ],
    [ 5.81e-09, 5.14726797687, 224.344795702 ]
    // 30 terms retained
];

KMG.VSOPTerms.uranus_L4 = [
    [ 5.536e-08, 4.57721551627, 74.7815985673 ],
    [ 3.183e-08, 0.34467460171, 11.0457002639 ]
    // 2 terms retained
];

KMG.VSOPTerms.uranus_B0 = [
    [ 0.01346277648, 2.61877810547, 74.7815985673 ],
    [ 0.000623414, 5.08111189648, 149.563197135 ],
    [ 0.00061601196, 3.14159265359, 0 ],
    [ 9.963722e-05, 1.61603805646, 76.2660712756 ],
    [ 9.92616e-05, 0.57630380333, 73.297125859 ],
    [ 3.259466e-05, 1.26119342526, 224.344795702 ],
    [ 2.972303e-05, 2.24367206357, 1.4844727083 ],
    [ 2.010275e-05, 6.05550884547, 148.078724426 ],
    [ 1.522163e-05, 0.27959645002, 63.7358983034 ],
    [ 9.24064e-06, 4.03822512696, 151.047669843 ],
    [ 7.6064e-06, 6.13999362624, 71.8126531507 ],
    [ 4.20265e-06, 5.21280055515, 11.0457002639 ],
    [ 4.30661e-06, 3.55443947716, 213.299095438 ],
    [ 4.36847e-06, 3.38081057022, 529.690965095 ],
    [ 5.22314e-06, 3.32086440954, 138.517496871 ],
    [ 4.34627e-06, 0.34063199763, 77.7505439839 ],
    [ 4.6263e-06, 0.74256687606, 85.8272988312 ],
    [ 2.32667e-06, 2.25715668168, 222.860322994 ],
    [ 2.15848e-06, 1.59122810633, 38.1330356378 ],
    [ 2.44698e-06, 0.787951741, 2.9689454166 ],
    [ 1.79936e-06, 3.72487768728, 299.126394269 ],
    [ 1.74896e-06, 1.23550822483, 146.594251718 ],
    [ 1.73648e-06, 1.93654971482, 380.12776796 ],
    [ 1.60368e-06, 5.33635511113, 111.430161497 ],
    [ 1.44064e-06, 5.96238846558, 35.1640902212 ],
    [ 1.02049e-06, 2.61876132065, 78.7137518304 ],
    [ 1.16363e-06, 5.73877137488, 70.8494453042 ],
    [ 1.06444e-06, 0.94095705978, 70.3281804424 ],
    [ 8.616e-07, 0.70251751041, 39.6175083461 ],
    [ 7.2611e-07, 0.205721589, 225.82926841 ],
    [ 7.1172e-07, 0.83343109173, 109.945688788 ],
    [ 5.7495e-07, 2.67048156941, 108.46121608 ],
    [ 5.4263e-07, 3.35177461012, 184.727287356 ],
    [ 4.4471e-07, 2.74407889623, 152.532142551 ]
    // 34 terms retained
];

KMG.VSOPTerms.uranus_B1 = [
    [ 0.00034101978, 0.01321929936, 74.7815985673 ],
    [ 2.480115e-05, 2.73961370453, 149.563197135 ],
    [ 1.719377e-05, 0, 0 ],
    [ 3.95276e-06, 5.49322816551, 76.2660712756 ],
    [ 3.08903e-06, 3.61139770633, 73.297125859 ],
    [ 1.81125e-06, 5.32079457105, 224.344795702 ],
    [ 1.4452e-06, 4.22110521671, 63.7358983034 ],
    [ 7.6343e-07, 4.54620999213, 85.8272988312 ],
    [ 7.2633e-07, 5.97811706013, 1.4844727083 ],
    [ 6.5492e-07, 2.77607065171, 11.0457002639 ],
    [ 6.3931e-07, 6.15917217447, 138.517496871 ],
    [ 5.0972e-07, 1.79457572126, 151.047669843 ],
    [ 3.993e-07, 3.59559614775, 148.078724426 ],
    [ 3.6667e-07, 3.82753352893, 70.8494453042 ],
    [ 2.6969e-07, 4.71074996908, 78.7137518304 ],
    [ 2.7205e-07, 4.22769491494, 71.8126531507 ],
    [ 2.2074e-07, 4.76357435668, 213.299095438 ],
    [ 2.2655e-07, 4.40615405121, 77.7505439839 ],
    [ 1.572e-07, 1.55930265947, 529.690965095 ],
    [ 1.009e-07, 5.83224201984, 145.631043871 ],
    [ 1.2912e-07, 1.56375170441, 299.126394269 ],
    [ 7.956e-08, 5.0228752619, 2.9689454166 ],
    [ 8.579e-08, 6.26698868752, 222.860322994 ],
    [ 7.534e-08, 0.80106371071, 160.608897399 ],
    [ 6.679e-08, 2.7852838806, 3.9321532631 ],
    [ 5.496e-08, 3.31254191722, 77.962992305 ],
    [ 5.232e-08, 5.06918050814, 71.6002048296 ]
    // 27 terms retained
];

KMG.VSOPTerms.uranus_B2 = [
    [ 7.64663e-06, 1.74870957857, 74.7815985673 ],
    [ 5.5734e-07, 3.14159265359, 0 ],
    [ 2.5641e-07, 5.67301557131, 149.563197135 ],
    [ 1.3335e-07, 5.92348443969, 73.297125859 ],
    [ 6.636e-08, 2.30241577514, 85.8272988312 ],
    [ 4.926e-08, 2.21241492976, 76.2660712756 ],
    [ 4.368e-08, 0.76649493506, 11.0457002639 ],
    [ 4.095e-08, 1.81604424547, 70.8494453042 ],
    [ 3.55e-08, 2.72620892642, 224.344795702 ],
    [ 3.556e-08, 0.36898980602, 78.7137518304 ],
    [ 3.799e-08, 1.75732801545, 138.517496871 ],
    [ 1.82e-08, 1.54477121376, 77.962992305 ],
    [ 1.651e-08, 1.41591379356, 1.4844727083 ],
    [ 1.608e-08, 6.22512841748, 213.299095438 ],
    [ 1.452e-08, 3.90164387464, 145.631043871 ]
    // 15 terms retained
];

KMG.VSOPTerms.uranus_B3 = [
    [ 2.1201e-07, 3.16540759295, 74.7815985673 ]
    // 1 terms retained
];

KMG.VSOPTerms.uranus_R0 = [
    [ 19.2126484721, 0, 0 ],
    [ 0.88784984413, 5.60377527014, 74.7815985673 ],
    [ 0.03440836062, 0.32836099706, 73.297125859 ],
    [ 0.0205565386, 1.7829515933, 149.563197135 ],
    [ 0.0064932241, 4.52247285911, 76.2660712756 ],
    [ 0.00602247865, 3.86003823674, 63.7358983034 ],
    [ 0.00496404167, 1.40139935333, 454.909366527 ],
    [ 0.00338525369, 1.58002770318, 138.517496871 ],
    [ 0.00243509114, 1.57086606044, 71.8126531507 ],
    [ 0.00190522303, 1.99809394714, 1.4844727083 ],
    [ 0.00161858838, 2.79137786799, 148.078724426 ],
    [ 0.00143706183, 1.38368544947, 11.0457002639 ],
    [ 0.00093192405, 0.17437220467, 36.6485629295 ],
    [ 0.00071424548, 4.24509236074, 224.344795702 ],
    [ 0.00089806014, 3.66105364565, 109.945688788 ],
    [ 0.00039009723, 1.66971401684, 70.8494453042 ],
    [ 0.00046677296, 1.39976401694, 35.1640902212 ],
    [ 0.00039025624, 3.36234773834, 277.034993741 ],
    [ 0.00036755274, 3.88649278513, 146.594251718 ],
    [ 0.00030348723, 0.70100838798, 151.047669843 ],
    [ 0.00029156413, 3.180563367, 77.7505439839 ],
    [ 0.00020471591, 1.55587964879, 202.253395174 ],
    [ 0.00025620756, 5.25656086672, 380.12776796 ],
    [ 0.0002578588, 3.7853770987, 85.8272988312 ],
    [ 0.00022637073, 0.72518687029, 529.690965095 ],
    [ 0.00020473534, 2.79640244248, 70.3281804424 ],
    [ 0.000179013, 0.55455066863, 2.9689454166 ],
    [ 0.00012328114, 5.96037276805, 127.471796607 ],
    [ 0.00014701666, 4.90434516516, 108.46121608 ],
    [ 0.0001149468, 0.43772043395, 65.2203710117 ],
    [ 0.00015502375, 5.35405396163, 38.1330356378 ],
    [ 0.00010792498, 1.42106296264, 213.299095438 ],
    [ 0.00011695693, 3.29824190199, 3.9321532631 ],
    [ 0.00011959076, 1.7504339214, 984.600331622 ],
    [ 0.00012896452, 2.62154084288, 111.430161497 ],
    [ 0.00011852959, 0.99344161196, 52.6901980395 ],
    [ 9.111621e-05, 4.99633582839, 62.2514255951 ],
    [ 8.420792e-05, 5.25351368389, 222.860322994 ],
    [ 7.448995e-05, 0.79495503123, 351.816592309 ],
    [ 8.402384e-05, 5.03876467031, 415.552490612 ],
    [ 6.046221e-05, 5.67958564987, 78.7137518304 ],
    [ 5.524411e-05, 3.11493320824, 9.5612275556 ],
    [ 7.329301e-05, 3.97276588872, 183.242814648 ],
    [ 5.44457e-05, 5.10574758517, 145.10977901 ],
    [ 5.238203e-05, 2.62960535651, 33.6796175129 ],
    [ 4.079523e-05, 3.22064116734, 340.770892045 ],
    [ 3.801645e-05, 6.10982670905, 184.727287356 ],
    [ 3.918728e-05, 4.25017709085, 39.6175083461 ],
    [ 2.940764e-05, 2.14649735789, 137.033024162 ],
    [ 3.781197e-05, 3.45840366912, 456.393839236 ],
    [ 2.942224e-05, 0.42392830457, 299.126394269 ],
    [ 3.686324e-05, 2.48725993956, 453.424893819 ],
    [ 3.101496e-05, 4.14028619712, 219.891377577 ],
    [ 2.962643e-05, 0.82981906774, 56.6223513026 ],
    [ 2.937579e-05, 3.67652211319, 140.001969579 ],
    [ 2.864793e-05, 0.30998964462, 12.5301729722 ],
    [ 2.53811e-05, 4.85443168231, 131.40394987 ],
    [ 1.962787e-05, 5.24326793681, 84.3428261229 ],
    [ 2.363719e-05, 0.44244699485, 554.069987483 ],
    [ 1.978408e-05, 6.12838999163, 106.976743372 ],
    [ 2.182603e-05, 2.94042519396, 305.346169393 ],
    [ 1.963255e-05, 0.04114614586, 221.375850285 ],
    [ 1.829781e-05, 4.01105197128, 68.8437077341 ],
    [ 1.64292e-05, 0.35558129224, 67.6680515665 ],
    [ 1.584876e-05, 3.16265838848, 225.82926841 ],
    [ 1.848022e-05, 2.91116293131, 909.818733055 ],
    [ 1.632263e-05, 4.23038575372, 22.0914005278 ],
    [ 1.402196e-05, 1.3910671015, 265.989293477 ],
    [ 1.404021e-05, 5.63567908789, 4.4534181249 ],
    [ 1.656488e-05, 1.96436491067, 79.2350166922 ],
    [ 1.248478e-05, 5.44008558936, 54.1746707478 ],
    [ 1.563396e-05, 1.47919498164, 112.914634205 ],
    [ 1.248513e-05, 4.88964506527, 479.288388915 ],
    [ 1.197649e-05, 2.52152454056, 145.631043871 ],
    [ 1.506943e-05, 5.2418542036, 181.758341939 ],
    [ 1.481952e-05, 5.66201356223, 152.532142551 ],
    [ 1.439115e-05, 1.53047702403, 447.795819526 ],
    [ 1.408871e-05, 4.41921152932, 462.022913528 ],
    [ 1.477003e-05, 4.32173218344, 256.539940506 ],
    [ 1.228234e-05, 5.97697848866, 59.8037450403 ],
    [ 1.249895e-05, 6.24480493841, 160.608897399 ],
    [ 9.06516e-06, 5.62013120164, 74.6697239827 ],
    [ 1.090686e-05, 4.15394319904, 77.962992305 ],
    [ 8.44827e-06, 0.1296605606, 82.8583534146 ],
    [ 9.00579e-06, 2.37303064621, 74.8934731519 ],
    [ 1.071649e-05, 1.74298201693, 528.206492386 ],
    [ 6.89518e-06, 3.08087933344, 69.3649725959 ],
    [ 5.9401e-06, 4.50031730404, 8.0767548473 ],
    [ 7.18644e-06, 4.00028668863, 128.956269315 ],
    [ 6.99874e-06, 0.03990034416, 143.625306301 ],
    [ 5.75672e-06, 5.89553952415, 66.70484372 ],
    [ 7.58678e-06, 2.1369380317, 692.587484354 ],
    [ 7.10274e-06, 5.41605211553, 218.406904869 ],
    [ 5.48663e-06, 5.62811775865, 3.1813937377 ],
    [ 6.51756e-06, 4.42317051993, 18.1592472647 ],
    [ 5.3973e-06, 6.20779847549, 71.6002048296 ],
    [ 5.44899e-06, 5.69409543986, 203.737867882 ],
    [ 7.10254e-06, 4.21967520209, 381.612240668 ],
    [ 5.94034e-06, 3.83794153459, 32.1951448046 ],
    [ 7.09902e-06, 4.48962691884, 293.188503436 ],
    [ 7.05697e-06, 0.4551853916, 835.037134487 ],
    [ 5.87851e-06, 5.08268227675, 186.211760064 ],
    [ 5.98191e-06, 0.35792534475, 269.921446741 ],
    [ 6.42152e-06, 2.71090806243, 87.3117715395 ],
    [ 4.9564e-06, 2.6511174264, 200.768922466 ],
    [ 6.30166e-06, 4.46153551027, 275.550521033 ],
    [ 5.7495e-06, 5.57877269214, 2.4476805548 ],
    [ 5.69622e-06, 1.63924602135, 77.2292791221 ],
    [ 5.56672e-06, 1.07231890667, 1059.38193019 ],
    [ 4.49362e-06, 0.27988155703, 617.805885786 ],
    [ 4.63703e-06, 1.43450762802, 297.641921561 ],
    [ 4.36536e-06, 0.52783902054, 209.366942175 ],
    [ 4.6392e-06, 2.35519668239, 211.81462273 ],
    [ 4.35944e-06, 2.10077178384, 1514.29129672 ],
    [ 5.15533e-06, 3.23274245907, 284.148540742 ],
    [ 4.55004e-06, 4.08342038147, 99.1606209555 ],
    [ 4.77251e-06, 2.8938165321, 39.3568759152 ],
    [ 5.42691e-06, 5.39457310701, 278.51946645 ],
    [ 4.09903e-06, 3.04961893378, 404.506790348 ],
    [ 3.68389e-06, 0.71079545635, 125.987323898 ],
    [ 5.03183e-06, 5.8391548775, 191.20769491 ],
    [ 4.874e-06, 0.06424307109, 60.7669528868 ],
    [ 4.5503e-06, 2.59321031027, 490.334089179 ],
    [ 4.36349e-06, 2.08129398068, 51.2057253312 ],
    [ 4.35759e-06, 2.79444435294, 75.7448064138 ],
    [ 3.2348e-06, 4.82939220481, 195.139848173 ],
    [ 3.59344e-06, 0.00870449102, 35.4247226521 ],
    [ 4.29078e-06, 3.08057776747, 41.1019810544 ],
    [ 3.19986e-06, 5.48621997496, 14.977853527 ],
    [ 4.13961e-06, 0.08822621279, 258.024413215 ],
    [ 3.79728e-06, 0.05834508997, 378.643295252 ],
    [ 4.20206e-06, 2.25392348451, 81.0013736908 ],
    [ 3.57527e-06, 4.71408309367, 173.942219523 ],
    [ 3.58938e-06, 0.35269536425, 426.598190876 ],
    [ 4.05369e-06, 6.12344979469, 24.3790223882 ],
    [ 3.65088e-06, 5.59471873032, 255.055467798 ],
    [ 3.08155e-06, 3.92316644086, 116.426096343 ],
    [ 3.25546e-06, 4.71973290837, 134.585343608 ],
    [ 2.92775e-06, 3.99521624654, 72.3339180125 ],
    [ 3.86408e-06, 0.68629232964, 230.564570825 ],
    [ 3.0558e-06, 3.76131538046, 344.703045308 ],
    [ 2.86849e-06, 1.8498761975, 153.495350398 ],
    [ 3.53346e-06, 4.65720677156, 329.837066365 ],
    [ 3.01835e-06, 0.13173596285, 565.115687747 ],
    [ 2.41282e-06, 1.6040006132, 81.3738807063 ],
    [ 2.49797e-06, 4.24206827815, 75.3028634291 ],
    [ 2.45219e-06, 5.94902281852, 20.6069278195 ],
    [ 2.48331e-06, 1.06282358803, 105.492270664 ],
    [ 3.05353e-06, 2.55534744586, 6208.29425142 ],
    [ 2.9637e-06, 4.21095612809, 1364.72809958 ],
    [ 2.19939e-06, 2.96120542961, 120.358249606 ],
    [ 2.33643e-06, 2.97217201792, 46.2097904851 ],
    [ 2.62427e-06, 3.83657820849, 831.104981224 ],
    [ 2.33512e-06, 4.47917715806, 628.85158605 ],
    [ 1.87419e-06, 3.03519991355, 135.548551454 ],
    [ 2.168e-06, 3.42879551504, 241.610271089 ],
    [ 2.5579e-06, 1.16711533037, 177.874372786 ],
    [ 2.20463e-06, 0.19626840245, 180.273869231 ],
    [ 2.24582e-06, 0.4067414402, 114.399106913 ],
    [ 2.05687e-06, 2.30385491694, 259.508885923 ],
    [ 2.11135e-06, 4.93079268569, 103.092774219 ],
    [ 1.75625e-06, 5.51167774427, 7.1135470008 ],
    [ 1.88093e-06, 2.23534719993, 5.4166259714 ],
    [ 1.71643e-06, 5.21732384809, 41.6444977756 ],
    [ 1.76103e-06, 1.95966779423, 756.323382657 ],
    [ 1.70321e-06, 4.95071878484, 206.185548437 ],
    [ 1.69478e-06, 4.04293214414, 55.6591434561 ],
    [ 2.19016e-06, 0.24791955037, 294.672976144 ],
    [ 1.8779e-06, 2.04529505651, 408.438943611 ],
    [ 1.82258e-06, 0.70728907628, 391.173468224 ],
    [ 1.91808e-06, 5.76676964168, 291.704030728 ],
    [ 1.53646e-06, 4.7065704527, 543.024287219 ],
    [ 1.69989e-06, 4.50972133596, 288.080694005 ],
    [ 1.63761e-06, 5.22511628213, 67.3592350258 ],
    [ 1.94295e-06, 6.11711108749, 414.068017904 ],
    [ 1.68295e-06, 5.25802294337, 518.645264831 ],
    [ 1.56891e-06, 0.66346387654, 220.412642439 ],
    [ 1.82269e-06, 0.78381581992, 417.03696332 ],
    [ 1.675e-06, 4.92284198283, 422.666037613 ],
    [ 1.70706e-06, 2.30954371717, 98.8999885246 ],
    [ 1.61764e-06, 3.27144223053, 443.863666263 ],
    [ 1.33098e-06, 2.88847467964, 373.907992837 ],
    [ 1.61139e-06, 3.82341819072, 451.940421111 ],
    [ 1.79288e-06, 4.82418428313, 366.485629295 ],
    [ 1.78253e-06, 3.98045379191, 10138.5039476 ],
    [ 1.42045e-06, 1.2689265649, 159.12442469 ],
    [ 1.53749e-06, 4.27847447687, 45.5766510387 ],
    [ 1.61285e-06, 4.99511779244, 73.8183907208 ],
    [ 1.46245e-06, 2.65555668221, 465.955066791 ],
    [ 1.24849e-06, 4.30472570922, 339.286419336 ],
    [ 1.54661e-06, 4.32026115082, 760.25553592 ],
    [ 1.42885e-06, 2.07772801387, 457.878311944 ],
    [ 1.52257e-06, 4.64725594465, 155.782972258 ],
    [ 1.16813e-06, 4.43623541426, 5.9378908332 ],
    [ 1.1336e-06, 4.65468501147, 80.1982245387 ],
    [ 1.08272e-06, 3.76939374352, 142.449650134 ],
    [ 1.3356e-06, 5.30624966763, 14.0146456805 ],
    [ 1.1629e-06, 2.51243579606, 296.157448853 ],
    [ 1.29281e-06, 0.36073764928, 96.8729990951 ],
    [ 1.22859e-06, 2.38440865925, 141.486442287 ],
    [ 1.01683e-06, 1.05650638045, 92.3077063856 ],
    [ 1.14628e-06, 6.24869783552, 767.369082921 ],
    [ 1.13301e-06, 0.83046410321, 100.384461233 ],
    [ 1.07414e-06, 2.39445059446, 347.884439046 ],
    [ 9.5213e-07, 0.79902536632, 342.255364753 ],
    [ 1.1111e-06, 0.38500786215, 216.92243216 ],
    [ 1.27294e-06, 0.4239525152, 331.321539074 ],
    [ 1.12636e-06, 0.08107841996, 558.002140746 ],
    [ 1.03166e-06, 0.69792291595, 358.93013931 ],
    [ 1.11707e-06, 0.75072196369, 80.7194894005 ],
    [ 9.0912e-07, 5.16491055574, 144.146571163 ],
    [ 9.0696e-07, 0.2213237742, 333.657345044 ],
    [ 9.8568e-07, 4.33164222339, 74.5209661364 ],
    [ 8.9282e-07, 2.18851161054, 74.8297826771 ],
    [ 1.17046e-06, 3.94988763259, 74.2603337055 ],
    [ 8.9282e-07, 5.87783530506, 74.7334144575 ],
    [ 9.7479e-07, 0.69714600982, 977.486784621 ],
    [ 1.16587e-06, 1.83677031992, 1289.94650101 ],
    [ 8.5652e-07, 5.79984896939, 6.592282139 ],
    [ 8.6998e-07, 5.61960123914, 300.610866977 ],
    [ 1.05424e-06, 5.94521818668, 328.352593657 ],
    [ 1.12185e-06, 1.21210217535, 329.725191781 ],
    [ 8.2982e-07, 2.20797412496, 74.9416572617 ],
    [ 9.4527e-07, 4.54115315196, 28.5718080822 ],
    [ 1.06878e-06, 1.82068770403, 306.830642101 ],
    [ 1.03534e-06, 2.9937266237, 6.2197751235 ],
    [ 1.06186e-06, 0.81603278109, 1087.69310584 ],
    [ 7.7777e-07, 2.73309413665, 110.206321219 ],
    [ 9.8378e-07, 3.73478755861, 75.0422309982 ],
    [ 8.5982e-07, 2.83236465462, 983.115858914 ],
    [ 8.9038e-07, 4.73790965769, 604.472563662 ],
    [ 8.3329e-07, 1.88332319315, 387.241314961 ],
    [ 8.516e-07, 1.25690280514, 142.140833593 ],
    [ 9.0074e-07, 3.8029787264, 986.08480433 ],
    [ 7.4695e-07, 1.35103014238, 350.3321196 ],
    [ 9.0483e-07, 0.36671354002, 0.9632078465 ],
    [ 9.5775e-07, 5.54841186043, 969.622478095 ],
    [ 8.2748e-07, 5.85591719177, 74.6215398729 ],
    [ 7.5723e-07, 2.78001204936, 88.1149206916 ],
    [ 8.4009e-07, 1.84380973979, 227.313741118 ],
    [ 7.0483e-07, 4.65532969655, 44.7253177768 ],
    [ 7.1348e-07, 3.65007988636, 894.840879528 ],
    [ 9.4503e-07, 4.98848650229, 403.134192224 ],
    [ 8.9085e-07, 4.43916822737, 154.01661526 ],
    [ 7.939e-07, 5.66990936464, 267.473766186 ],
    [ 7.5695e-07, 5.40808174797, 50.4025761791 ],
    [ 6.8583e-07, 4.76679841387, 991.713878623 ],
    [ 6.5256e-07, 0.69286492023, 152.744590872 ],
    [ 6.2931e-07, 2.90223286898, 79.889407998 ],
    [ 6.4054e-07, 0.09529052033, 681.54178409 ],
    [ 8.0142e-07, 2.97521726739, 526.722019678 ],
    [ 6.9651e-07, 3.95227500507, 187.696232772 ],
    [ 5.9427e-07, 3.59867941503, 58.1068240109 ],
    [ 5.924e-07, 0.51080685499, 28.3111756513 ],
    [ 6.8652e-07, 2.41879555463, 235.390495966 ],
    [ 6.6216e-07, 5.04460437297, 30.7106720963 ],
    [ 7.0223e-07, 3.73647394236, 546.956440482 ],
    [ 6.6829e-07, 0.85504819327, 522.577418094 ],
    [ 6.2028e-07, 2.3155351706, 74.0308390419 ],
    [ 6.2958e-07, 0.29182779746, 119.506916344 ],
    [ 7.1477e-07, 3.16924790922, 23.5758732361 ],
    [ 7.4807e-07, 5.36814054526, 373.014220959 ],
    [ 6.3852e-07, 2.36782311698, 157.639951982 ],
    [ 7.0614e-07, 0.5585579503, 92.940845832 ],
    [ 5.5762e-07, 5.27011035858, 874.394010403 ],
    [ 7.5741e-07, 4.66371340256, 101.868933941 ],
    [ 7.3741e-07, 6.20569442158, 312.459716394 ],
    [ 7.2959e-07, 0.58417048033, 367.970102003 ],
    [ 5.3182e-07, 2.24688972584, 17.5261078183 ],
    [ 6.3238e-07, 4.59765034931, 67.8804998876 ],
    [ 6.0717e-07, 0.57546407104, 253.57099509 ],
    [ 5.284e-07, 2.45780676537, 264.504820769 ],
    [ 7.0508e-07, 1.51929972323, 552.585514774 ],
    [ 6.8624e-07, 2.4450775445, 555.554460191 ],
    [ 6.2796e-07, 0.33786296182, 561.183534484 ],
    [ 4.9353e-07, 1.09630903572, 19.1224551112 ],
    [ 6.4619e-07, 5.27406291626, 68.1893164283 ],
    [ 6.2909e-07, 5.35706460122, 92.0470739547 ],
    [ 4.764e-07, 3.90841810802, 192.692167619 ],
    [ 6.5137e-07, 3.73959418275, 536.804512095 ],
    [ 6.5253e-07, 4.24102184816, 771.301236184 ],
    [ 5.9404e-07, 6.10556142565, 365.001156587 ],
    [ 5.2269e-07, 1.71514378709, 905.886579792 ],
    [ 4.5962e-07, 3.874335532, 210.330150021 ],
    [ 6.216e-07, 2.68143699514, 130.440742023 ],
    [ 4.6457e-07, 5.97440565334, 477.803916207 ],
    [ 4.6176e-07, 3.89655419144, 48.7580447764 ],
    [ 4.2915e-07, 3.81993104061, 61.2882177486 ],
    [ 4.7152e-07, 0.99574606527, 166.828672522 ],
    [ 5.3843e-07, 2.867487359, 353.301065017 ],
    [ 4.2114e-07, 2.61910843789, 90.8232336773 ],
    [ 5.261e-07, 2.97705829152, 383.096713377 ],
    [ 4.318e-07, 4.15850225489, 173.681587092 ],
    [ 4.1297e-07, 1.7992397018, 149.45132255 ],
    [ 4.4964e-07, 1.76623473669, 0.5212648618 ],
    [ 4.2836e-07, 1.56965438447, 120.991389052 ],
    [ 4.9794e-07, 4.03361534543, 303.861696684 ],
    [ 4.5233e-07, 3.5777862545, 97.4155158163 ],
    [ 3.8695e-07, 2.3940421117, 31.492569389 ],
    [ 3.8067e-07, 5.79467736188, 75.5323580927 ],
    [ 5.0252e-07, 4.7645830025, 911.303205763 ],
    [ 5.0884e-07, 5.15513957128, 439.782755154 ],
    [ 4.282e-07, 5.17313041477, 162.093370107 ],
    [ 4.2805e-07, 0.84360648676, 58.319272332 ],
    [ 5.0343e-07, 5.81599953406, 66.9172920411 ],
    [ 3.5657e-07, 1.87511529678, 472.174841915 ],
    [ 4.5667e-07, 1.9211081498, 55.1378785943 ],
    [ 3.9992e-07, 1.74263755793, 89.7594520943 ],
    [ 4.9427e-07, 1.89225881347, 42.5864537627 ],
    [ 4.4919e-07, 1.48348147872, 450.977213264 ],
    [ 3.4282e-07, 5.20397534102, 316.391869657 ],
    [ 4.6407e-07, 0.33922791761, 273.102840478 ],
    [ 3.7265e-07, 2.03623179153, 117.910569051 ],
    [ 4.6107e-07, 5.62298858989, 1819.63746611 ],
    [ 3.9368e-07, 4.19402801195, 486.401935916 ],
    [ 4.1044e-07, 4.82988044777, 149.675071719 ],
    [ 4.4959e-07, 0.72694662195, 3265.83082813 ],
    [ 4.3756e-07, 0.75422118122, 404.618664933 ],
    [ 3.1823e-07, 3.84768075664, 20.4468691251 ],
    [ 4.4288e-07, 4.36757729571, 418.260803598 ],
    [ 3.8e-07, 3.03175184245, 167.089304953 ],
    [ 4.3649e-07, 1.57339867295, 491.557929457 ],
    [ 3.3721e-07, 1.26383804364, 260.993358631 ],
    [ 3.1278e-07, 4.16119477825, 13.3333221243 ],
    [ 3.651e-07, 2.58786153975, 68.5618234438 ],
    [ 3.9768e-07, 2.8636569438, 468.242688652 ],
    [ 3.629e-07, 1.35814658055, 59.2824801785 ],
    [ 3.2168e-07, 3.12118521629, 103.35340665 ],
    [ 3.3633e-07, 0.15841728793, 24.1183899573 ],
    [ 3.3723e-07, 0.75503571162, 290.219558019 ],
    [ 2.975e-07, 5.33159349844, 1033.3583764 ],
    [ 3.1989e-07, 4.67688193416, 205.222340591 ],
    [ 3.5268e-07, 1.00718464333, 1108.13997497 ],
    [ 3.0858e-07, 4.62657701145, 258.875746477 ],
    [ 3.285e-07, 5.25352681937, 114.138474483 ],
    [ 3.3452e-07, 3.40494756837, 43.1289704839 ],
    [ 3.1092e-07, 2.26716508311, 104.007797955 ],
    [ 2.9723e-07, 5.64053362927, 254.943593214 ],
    [ 3.1576e-07, 3.7823710623, 152.010877689 ],
    [ 3.4573e-07, 5.17385991822, 25.6028626656 ],
    [ 2.8153e-07, 3.9268752386, 199.284449757 ],
    [ 2.8415e-07, 1.76927009458, 820.05928096 ],
    [ 2.8971e-07, 2.58260543469, 76.4785195967 ],
    [ 3.3643e-07, 5.79472403547, 274.066048325 ],
    [ 3.1355e-07, 1.39422550951, 178.789396523 ],
    [ 2.9433e-07, 5.93671324356, 280.967147005 ],
    [ 3.0136e-07, 0.443733256, 27.0873353739 ],
    [ 3.3815e-07, 6.26141095251, 401.649719516 ],
    [ 2.7513e-07, 2.15290154943, 480.772861624 ],
    [ 2.6821e-07, 2.51632690244, 123.539643344 ],
    [ 2.6229e-07, 0.22582956326, 286.596221297 ],
    [ 2.6562e-07, 3.88341102553, 372.423520128 ],
    [ 3.4017e-07, 1.44565808735, 88.7962442478 ],
    [ 2.774e-07, 4.64687309709, 198.321241911 ],
    [ 2.9859e-07, 0.82891399431, 100.645093664 ],
    [ 3.3948e-07, 1.14432761269, 82.4858463991 ],
    [ 2.6493e-07, 1.98025893553, 95.3885263868 ],
    [ 2.4352e-07, 2.37812752505, 146.381803397 ],
    [ 2.7244e-07, 2.10487988447, 1057.89745748 ],
    [ 2.6337e-07, 0.39684584427, 106.013535525 ],
    [ 2.4101e-07, 6.21637542402, 16.6747745564 ],
    [ 3.1013e-07, 5.3398578805, 476.431318084 ],
    [ 2.7036e-07, 0.71198582048, 248.72381809 ],
    [ 2.3868e-07, 3.42162769068, 1044.40407666 ],
    [ 2.9026e-07, 3.98796449555, 908.334260346 ],
    [ 2.4251e-07, 0.36629105441, 73.1852512744 ],
    [ 2.2897e-07, 2.26875155959, 175.1660598 ],
    [ 2.8024e-07, 3.46485782344, 1439.50969815 ],
    [ 2.2051e-07, 0.05165872393, 33.1371007917 ],
    [ 2.2208e-07, 5.32236354206, 483.220542179 ],
    [ 2.1075e-07, 0.37096066639, 214.783568146 ],
    [ 2.0699e-07, 1.79611118091, 118.022443636 ],
    [ 2.7443e-07, 5.75986647976, 1215.16490245 ],
    [ 2.5481e-07, 5.4969198547, 115.883579622 ],
    [ 2.7703e-07, 4.1192830645, 694.071957062 ],
    [ 2.4828e-07, 0.6523800562, 132.888422578 ],
    [ 2.1295e-07, 3.86501877873, 66.1835788582 ],
    [ 2.1146e-07, 1.13726745832, 60.5545045657 ],
    [ 2.3959e-07, 4.56157429146, 458.84151979 ],
    [ 2.6221e-07, 2.77532838847, 490.073456749 ],
    [ 2.2973e-07, 4.52937663566, 78.4049352897 ],
    [ 2.5273e-07, 3.64987288394, 73.4090004436 ],
    [ 2.6408e-07, 3.3724051836, 49.7212526229 ],
    [ 2.687e-07, 3.26028443561, 691.103011645 ],
    [ 2.1053e-07, 5.54284102969, 129.919477162 ],
    [ 2.0861e-07, 3.92598175503, 134.064078746 ],
    [ 2.2933e-07, 5.02405062369, 150.526404981 ],
    [ 2.298e-07, 2.5672758855, 332.806011782 ],
    [ 2.0836e-07, 0.98988990409, 29.2049475286 ],
    [ 1.8891e-07, 1.91272305963, 124.50285119 ],
    [ 1.8755e-07, 1.07911898423, 70.1157321213 ],
    [ 2.3454e-07, 0.60524375676, 189.723222202 ],
    [ 2.3104e-07, 3.93171225238, 43.2890291783 ],
    [ 1.9351e-07, 1.33568544736, 616.321413078 ],
    [ 2.3769e-07, 0.02170705684, 593.426863398 ],
    [ 2.1258e-07, 0.90140026224, 326.868120949 ],
    [ 1.9626e-07, 1.40914183189, 1589.07289528 ],
    [ 1.8282e-07, 4.55112709109, 165.604832245 ],
    [ 2.4502e-07, 0.91753157942, 441.267227862 ],
    [ 2.4938e-07, 4.63474678982, 162.896519259 ],
    [ 1.8904e-07, 1.23360547168, 13.4933808187 ],
    [ 1.7364e-07, 5.28602832892, 7.8643065262 ],
    [ 1.8603e-07, 5.11206439748, 81.8951455681 ],
    [ 1.7341e-07, 4.0647673679, 403.02231764 ],
    [ 2.2513e-07, 3.15059944802, 419.745276306 ],
    [ 1.7912e-07, 2.53786076055, 47.061123747 ],
    [ 2.1237e-07, 2.14856256664, 75.5847477194 ],
    [ 1.6995e-07, 2.48647736969, 2043.98226181 ],
    [ 2.2639e-07, 2.07623129511, 699.701031354 ],
    [ 2.3531e-07, 5.80237015057, 232.049043534 ],
    [ 1.9255e-07, 1.5662120398, 425.113718168 ],
    [ 2.2735e-07, 0.2827454276, 0.1118745846 ],
    [ 2.091e-07, 5.30767454224, 237.678117826 ],
    [ 1.6146e-07, 3.45551692754, 0.7507595254 ],
    [ 2.1076e-07, 0.96002144676, 405.991263056 ],
    [ 1.7963e-07, 1.60799681102, 215.437959452 ],
    [ 1.6289e-07, 4.88888227946, 69.1525242748 ],
    [ 2.1756e-07, 3.23184546146, 1744.85586754 ],
    [ 2.1708e-07, 0.88801367868, 344.963677739 ],
    [ 1.5964e-07, 0.34537232571, 77.0692204277 ],
    [ 1.7286e-07, 6.02968524571, 32.2433289144 ],
    [ 1.5915e-07, 2.96605572794, 25.8634950965 ],
    [ 1.783e-07, 4.01479681257, 280.003939158 ],
    [ 1.4755e-07, 3.74119528291, 610.692338785 ],
    [ 1.5023e-07, 4.24763459617, 228.276948965 ],
    [ 1.5326e-07, 0.22145354256, 17.2654753874 ],
    [ 1.5354e-07, 0.25482391126, 661.094914965 ],
    [ 1.6424e-07, 3.43626239649, 147.11551658 ],
    [ 1.4654e-07, 1.14175759154, 823.991434223 ],
    [ 1.5172e-07, 5.07753627325, 114.941623635 ],
    [ 1.4674e-07, 1.6817792116, 207.882469467 ],
    [ 1.7682e-07, 5.94376629143, 624.919432787 ],
    [ 1.8848e-07, 1.3845654645, 377.158822543 ],
    [ 1.5425e-07, 1.66489033237, 440.682272526 ],
    [ 1.4513e-07, 0.39264401278, 142.662098455 ],
    [ 1.4672e-07, 4.41834132435, 16.4623262353 ],
    [ 1.6992e-07, 0.16042368544, 438.298282446 ],
    [ 1.6587e-07, 0.92058534977, 369.082067696 ],
    [ 1.7239e-07, 4.51659362028, 606.760185522 ],
    [ 1.3222e-07, 3.0434010617, 668.208461965 ],
    [ 1.4458e-07, 2.93327046597, 419.484643875 ],
    [ 1.3238e-07, 0.13650358961, 216.480489176 ],
    [ 1.5722e-07, 4.93688742368, 124.290402869 ],
    [ 1.2927e-07, 1.65950183059, 54.3347294422 ],
    [ 1.4216e-07, 4.41971117975, 47.6942631934 ],
    [ 1.2751e-07, 0.03041331624, 217.231248701 ],
    [ 1.4006e-07, 3.6887047076, 16.04163511 ],
    [ 1.4718e-07, 1.08540409163, 49.5088043018 ],
    [ 1.7579e-07, 5.05617037261, 564.855055316 ],
    [ 1.2945e-07, 1.53551413817, 218.928169731 ],
    [ 1.3528e-07, 4.80158552555, 72.7758609972 ],
    [ 1.2546e-07, 3.43007050169, 958.576777831 ],
    [ 1.3034e-07, 0.56491831473, 1171.87587327 ],
    [ 1.2452e-07, 3.29205788475, 902.705186054 ],
    [ 1.1963e-07, 1.41057536904, 55.7710180407 ],
    [ 1.647e-07, 2.04067746898, 411.620337349 ],
    [ 1.5604e-07, 1.53457514224, 833.552661779 ],
    [ 1.4914e-07, 3.42772092084, 19.0105805266 ],
    [ 1.204e-07, 5.17744918756, 135.336103133 ],
    [ 1.4349e-07, 4.18933467558, 89.338760969 ],
    [ 1.5553e-07, 3.54672509714, 113.877842052 ],
    [ 1.5574e-07, 5.92871386562, 778.414783185 ],
    [ 1.5424e-07, 2.12697366276, 106.274167956 ],
    [ 1.1957e-07, 1.43314130608, 455.872574374 ],
    [ 1.5933e-07, 5.49557852242, 513.079881013 ],
    [ 1.3562e-07, 4.11426797137, 95.2284676924 ],
    [ 1.2063e-07, 0.20881650176, 65.8747623175 ],
    [ 1.5093e-07, 1.86345091876, 7.7042478318 ],
    [ 1.5832e-07, 3.42498484109, 79.5169009825 ],
    [ 1.1492e-07, 4.6518745562, 149.611381244 ],
    [ 1.4516e-07, 3.35209961643, 19.643719973 ],
    [ 1.1406e-07, 1.31085455047, 63.6240237188 ],
    [ 1.2043e-07, 0.01569453703, 397.393243347 ],
    [ 1.4157e-07, 1.87440535402, 6283.07584999 ],
    [ 1.1355e-07, 0.19026820825, 5.6290742925 ],
    [ 1.4109e-07, 0.09348109699, 6133.51265286 ],
    [ 1.1659e-07, 0.84853578994, 5.1078094307 ],
    [ 1.1052e-07, 0.47607339293, 150.084461996 ],
    [ 1.3908e-07, 5.6551430952, 639.897286314 ],
    [ 1.1505e-07, 5.1947564228, 1182.92157353 ],
    [ 1.1492e-07, 2.05801478182, 149.515013025 ],
    [ 1.4974e-07, 3.54838066958, 252.655971353 ],
    [ 1.155e-07, 4.78304722906, 334.29048449 ],
    [ 1.0671e-07, 4.67373109923, 149.723255829 ],
    [ 1.0855e-07, 4.52379396618, 453.946158681 ],
    [ 1.4218e-07, 0.08018756427, 240.386430812 ],
    [ 1.1896e-07, 1.4080319722, 26.0235537909 ],
    [ 1.3388e-07, 0.76174926716, 37.8724032069 ],
    [ 1.086e-07, 4.40226202285, 57.1436161644 ],
    [ 1.0722e-07, 5.34547451937, 331.209664489 ],
    [ 1.2796e-07, 3.70341837855, 67.0773507355 ],
    [ 1.3353e-07, 0.86919663716, 22.8945496799 ],
    [ 1.0568e-07, 5.80969806479, 193.655375465 ],
    [ 1.0324e-07, 2.99970080363, 525.758811831 ],
    [ 1.1331e-07, 3.11771273798, 93.9040536785 ],
    [ 1.431e-07, 1.06766336398, 477.915790792 ],
    [ 1.0296e-07, 3.8144746384, 180.161994646 ],
    [ 1.2341e-07, 4.62813430525, 1894.41906468 ],
    [ 1.1464e-07, 0.93530139587, 121.842722314 ],
    [ 1.2833e-07, 0.31985851817, 474.946845375 ],
    [ 1.2455e-07, 2.84950981207, 184.094147909 ],
    [ 1.173e-07, 1.07977388266, 363.516683878 ],
    [ 1.0287e-07, 6.03277961834, 43.2408450685 ],
    [ 1.1395e-07, 4.25533440684, 181.055766524 ],
    [ 1.0426e-07, 1.46990536801, 80.4106728598 ],
    [ 1.002e-07, 6.22580063292, 84.1827674285 ],
    [ 1.3895e-07, 3.4634353626, 157.267444966 ],
    [ 9.893e-08, 2.72218970897, 384.059921223 ],
    [ 1.0719e-07, 2.47554935503, 140.656360885 ],
    [ 1.0964e-07, 3.74557708007, 494.266242443 ],
    [ 1.2104e-07, 2.69878200554, 369.454574712 ],
    [ 9.686e-08, 0.0069758008, 40.1600250673 ],
    [ 1.2385e-07, 1.71007866936, 229.080098117 ],
    [ 1.2577e-07, 4.66630955474, 64.6991061499 ],
    [ 1.065e-07, 1.78642598254, 252.086522382 ],
    [ 1.1653e-07, 5.70662425749, 39.0962434843 ],
    [ 1.1004e-07, 3.58723041577, 449.280292235 ],
    [ 1.0454e-07, 2.81847601796, 1246.65747184 ],
    [ 9.326e-08, 0.97605558757, 109.312549342 ],
    [ 9.261e-08, 5.19861935669, 749.209835656 ],
    [ 9.811e-08, 3.72249796639, 233.906023258 ],
    [ 1.0264e-07, 6.08657486312, 156.155479274 ],
    [ 1.2406e-07, 0.7620799857, 122.475861761 ],
    [ 1.0249e-07, 2.86919673355, 189.180705481 ],
    [ 1.2671e-07, 6.19797274264, 149.823829566 ],
    [ 9.589e-08, 1.00839074495, 393.461090084 ],
    [ 9.106e-08, 5.53296926826, 133.100870899 ],
    [ 1.0449e-07, 1.23520879648, 148.599989288 ],
    [ 9.923e-08, 5.65994205559, 42.5382696529 ],
    [ 1.237e-07, 5.2960237032, 20.4950532349 ],
    [ 1.0304e-07, 3.56303132976, 619.290358494 ],
    [ 1.1103e-07, 5.89715087659, 832.589453932 ],
    [ 9.313e-08, 3.00333916453, 754.838909949 ],
    [ 1.0342e-07, 5.50503668014, 460.53844082 ],
    [ 1.2219e-07, 3.17057317997, 30.0562807905 ],
    [ 8.998e-08, 5.82877688374, 248.463185659 ],
    [ 1.0082e-07, 1.9111904865, 25.0603459444 ],
    [ 1.0991e-07, 0.05720554764, 54.2865453324 ],
    [ 8.638e-08, 5.49106676064, 448.689591404 ],
    [ 9.39e-08, 1.32674472289, 9.4011688612 ],
    [ 9.621e-08, 5.6909029939, 73.88782669 ],
    [ 1.0975e-07, 4.40051429814, 63.847772888 ],
    [ 8.365e-08, 3.2694361084, 172.197114384 ],
    [ 9.674e-08, 4.27052644727, 282.664068034 ],
    [ 1.077e-07, 0.19304986906, 463.507386236 ],
    [ 1.0666e-07, 1.42510087091, 268.436974032 ],
    [ 1.0567e-07, 2.61602525339, 446.311346818 ],
    [ 8.495e-08, 5.03708799595, 370.93904742 ],
    [ 9.888e-08, 4.25430313596, 602.988090954 ],
    [ 1.0101e-07, 5.04200998723, 241.87090352 ],
    [ 8.89e-08, 2.5332074673, 271.405919449 ],
    [ 9.08e-08, 0.99121734894, 6.9010986797 ],
    [ 1.0416e-07, 4.96315418372, 97.6761482472 ],
    [ 8.79e-08, 3.05434837439, 291.262087743 ],
    [ 7.936e-08, 5.71233384542, 541.539814511 ],
    [ 1.0152e-07, 1.90464684114, 91.4563731237 ],
    [ 7.939e-08, 0.88279344814, 154.979823106 ],
    [ 8.212e-08, 0.00845991197, 76.42612997 ],
    [ 7.965e-08, 2.36308659035, 196.624320882 ],
    [ 8.948e-08, 4.31891786278, 469.136460529 ],
    [ 8.46e-08, 0.14600703561, 262.47783134 ],
    [ 9.878e-08, 0.61245182735, 308.315114809 ],
    [ 9.12e-08, 5.03217831219, 450.455948402 ],
    [ 1.0276e-07, 3.58321573131, 842.150681488 ],
    [ 8.153e-08, 4.60445400464, 69.6737891366 ],
    [ 1.0625e-07, 2.28659627239, 194.288514911 ],
    [ 7.552e-08, 4.86800510971, 1097.0942747 ],
    [ 9.019e-08, 0.69841869766, 685.473937353 ],
    [ 7.451e-08, 5.67442696266, 337.801946628 ],
    [ 8.011e-08, 4.33417263028, 302.095339686 ],
    [ 9.132e-08, 1.09206046595, 93.7921790939 ],
    [ 9.342e-08, 4.16662386065, 15.4991183888 ],
    [ 7.411e-08, 3.04632695464, 7.4223635415 ],
    [ 1.0072e-07, 1.18952866918, 621.738039049 ],
    [ 8.913e-08, 1.33679256423, 0.2606324309 ],
    [ 8.189e-08, 3.16576794671, 32.7164096664 ],
    [ 7.85e-08, 4.37236255826, 464.470594083 ],
    [ 8.734e-08, 2.03651704284, 149.40313844 ],
    [ 7.745e-08, 0.14834225031, 1404.0849755 ],
    [ 9.037e-08, 3.53203542312, 636.667708467 ],
    [ 1.0212e-07, 2.58904966897, 711.449307034 ],
    [ 8.569e-08, 2.47926109895, 497.44763618 ],
    [ 9.591e-08, 1.33938357595, 142.970914996 ],
    [ 7.613e-08, 1.86876737547, 31.6526280834 ],
    [ 8.723e-08, 5.88916926012, 82.2039621088 ],
    [ 8.997e-08, 2.37079010824, 76.154196691 ],
    [ 7.128e-08, 6.2445038363, 376.195614697 ],
    [ 9.686e-08, 5.67475763163, 98.3574718034 ],
    [ 9.993e-08, 4.91667894523, 829.620508516 ],
    [ 7.745e-08, 4.87945477576, 310.172094533 ],
    [ 9.812e-08, 3.78656280821, 838.218528225 ],
    [ 8.785e-08, 6.14514661123, 17.6379824029 ],
    [ 9.5e-08, 6.02030079251, 916.932280055 ],
    [ 8.44e-08, 5.06400284478, 1.3725981237 ],
    [ 9.802e-08, 1.92874890805, 62.7726904569 ],
    [ 7.059e-08, 5.91499106809, 74.1484591209 ],
    [ 7.016e-08, 1.52544072246, 679.254162229 ],
    [ 9.577e-08, 1.44268080407, 763.436929658 ],
    [ 9.562e-08, 1.97733085047, 703.633184617 ],
    [ 7.059e-08, 1.94098053303, 75.4147380137 ],
    [ 9.214e-08, 0.88741799785, 362.862292573 ],
    [ 6.823e-08, 5.11460794174, 107.498008234 ],
    [ 7.148e-08, 1.73466140387, 1190.78588006 ],
    [ 9.073e-08, 4.31998777457, 16.1535096946 ],
    [ 9.126e-08, 3.74417362577, 4.665866446 ],
    [ 7.923e-08, 4.6451154044, 232.421550549 ],
    [ 8.828e-08, 1.08177391234, 412.583545195 ],
    [ 9.169e-08, 3.25102587429, 155.501087968 ],
    [ 7.624e-08, 0.88232424215, 459.362784652 ],
    [ 8.2e-08, 1.51866334745, 10063.7223491 ],
    [ 8.005e-08, 6.13208431788, 745.277682393 ],
    [ 8.579e-08, 2.377262345, 75.6753704446 ],
    [ 7.597e-08, 2.63491731877, 657.162761701 ],
    [ 6.398e-08, 0.61376490225, 73.2489417492 ],
    [ 7.149e-08, 1.33917289544, 236.874968674 ],
    [ 6.577e-08, 4.82504547981, 1072.71525231 ],
    [ 6.38e-08, 3.20688120531, 73.3453099688 ],
    [ 7.506e-08, 0.67400214407, 228.798213827 ],
    [ 7.451e-08, 3.06064473161, 171.654597662 ],
    [ 6.361e-08, 6.05108999867, 95.9792272178 ],
    [ 7.086e-08, 4.88497877319, 6531.66165626 ],
    [ 6.522e-08, 4.0143169552, 118.873776898 ],
    [ 6.236e-08, 1.08169162104, 143.934122842 ],
    [ 7.2e-08, 1.19830150903, 1617.38407094 ],
    [ 6.373e-08, 3.2741194528, 116.537970927 ],
    [ 6.15e-08, 0.03921300469, 627.367113342 ],
    [ 8.664e-08, 5.60425824325, 2810.92146161 ],
    [ 7.635e-08, 4.06598468585, 4.7353024152 ],
    [ 6.147e-08, 4.16482048084, 1300.99220128 ],
    [ 7.471e-08, 0.45174255163, 192.804042203 ],
    [ 8.148e-08, 3.11700641874, 10213.2855462 ],
    [ 8.603e-08, 3.80404544682, 25558.2121765 ],
    [ 7.593e-08, 2.86863623528, 406.103137641 ],
    [ 7.725e-08, 3.05989382335, 341.994732322 ],
    [ 7.063e-08, 5.35078594952, 73.0364934281 ],
    [ 6.762e-08, 1.94867196735, 288.735085311 ],
    [ 6.102e-08, 2.06174377751, 73.9784494152 ],
    [ 6.993e-08, 1.24520005325, 400.165246808 ],
    [ 7.856e-08, 3.11320541136, 81.682697247 ],
    [ 6.731e-08, 0.00424999029, 572.229234747 ],
    [ 6.688e-08, 0.03046234361, 90.2807169561 ],
    [ 7.766e-08, 2.87448427459, 79.4474650133 ],
    [ 7.668e-08, 1.71124875127, 104.529062817 ],
    [ 8.317e-08, 2.40731767085, 674.800744104 ],
    [ 6.793e-08, 1.29774355388, 22.633917249 ],
    [ 7.732e-08, 1.44266849755, 131.925214732 ],
    [ 6.034e-08, 0.96635268225, 476.319443499 ],
    [ 6e-08, 3.24980736635, 76.7873361374 ],
    [ 6.375e-08, 1.37050567525, 75.1541055828 ],
    [ 5.861e-08, 4.31971360878, 86.6304479833 ],
    [ 7.19e-08, 3.21396773403, 71.1582618449 ],
    [ 6.303e-08, 2.24129466051, 1310.39337014 ],
    [ 6.628e-08, 1.990437442, 1.5963472929 ],
    [ 6.263e-08, 3.47620738623, 346.399966337 ],
    [ 6.081e-08, 1.2659989052, 61.448276443 ],
    [ 7.312e-08, 5.48372849636, 50.66320861 ],
    [ 7.3e-08, 5.26774051203, 285.633013451 ],
    [ 5.727e-08, 2.39389303582, 20277.0078953 ],
    [ 7.776e-08, 5.47416512352, 416.77633089 ],
    [ 5.693e-08, 1.13593628568, 445.348138972 ],
    [ 5.794e-08, 2.43359359889, 180.795134093 ],
    [ 6.927e-08, 4.19296597477, 525.23754697 ],
    [ 7.681e-08, 5.64147063245, 549.728443943 ],
    [ 6.68e-08, 5.36285833774, 452.461685972 ],
    [ 7.677e-08, 0.71278975356, 44.070926471 ],
    [ 7.734e-08, 5.72717526802, 154.29849955 ],
    [ 5.932e-08, 3.22993254909, 73.4571845534 ],
    [ 5.683e-08, 3.65029666464, 442.379193555 ],
    [ 5.788e-08, 2.17544248991, 2.2876218604 ],
    [ 6.685e-08, 4.8497109273, 148.812437609 ],
    [ 5.797e-08, 0.51568102763, 149.302564704 ],
    [ 7.739e-08, 3.23104533276, 589.494710135 ],
    [ 7.474e-08, 2.47202834062, 321.760311518 ],
    [ 6.106e-08, 0.81922621826, 89.5993933999 ],
    [ 5.522e-08, 1.83812319711, 375.392465545 ],
    [ 6.706e-08, 5.23367324742, 769.816763476 ],
    [ 6.168e-08, 4.58379993316, 137.554289024 ],
    [ 7.21e-08, 2.56243122515, 375.674349835 ],
    [ 6.777e-08, 0.50997508166, 1147.49685088 ],
    [ 6.59e-08, 3.39794943072, 389.688995516 ],
    [ 6.376e-08, 0.24081237769, 881.507557403 ],
    [ 5.829e-08, 6.04973118199, 172.457746815 ],
    [ 5.827e-08, 2.19507738696, 8.9068362498 ],
    [ 5.305e-08, 1.977856112, 150.31395666 ],
    [ 5.706e-08, 1.66973662153, 70.0462961521 ],
    [ 5.422e-08, 1.21990761182, 332.172872336 ],
    [ 6.818e-08, 1.98954025696, 105.380396079 ],
    [ 7.235e-08, 2.78896876234, 748.097869963 ],
    [ 6.36e-08, 0.36304095923, 74.4090915518 ],
    [ 5.612e-08, 3.4988632804, 102.523325247 ],
    [ 6.581e-08, 4.48256802747, 31.2319369581 ],
    [ 6.268e-08, 3.59621382047, 488.849616471 ],
    [ 6.36e-08, 0.66780746624, 272.581575617 ],
    [ 6.673e-08, 0.77536194908, 6069.77675455 ],
    [ 5.279e-08, 4.27436629709, 11.1575748485 ],
    [ 5.611e-08, 2.40776057824, 1286.01434775 ],
    [ 5.9e-08, 0.51262679903, 285.111748589 ],
    [ 5.898e-08, 5.26174074234, 757.807855365 ],
    [ 5.385e-08, 1.77116775784, 139.480704717 ],
    [ 6.198e-08, 0.83056505252, 1507.17774972 ],
    [ 5.425e-08, 1.93107713343, 40.8413486235 ],
    [ 6.091e-08, 5.18564204379, 487.104511332 ],
    [ 5.134e-08, 2.61122038772, 194.176640327 ],
    [ 5.505e-08, 1.31212823209, 883.795179264 ],
    [ 5.687e-08, 1.96943472998, 394.354861962 ],
    [ 6.304e-08, 3.02157380188, 442.751700571 ],
    [ 5.027e-08, 4.45266598835, 12.0089081104 ],
    [ 5.204e-08, 3.39869589191, 1400.15282223 ],
    [ 6.542e-08, 2.31977509408, 328.240719073 ],
    [ 4.969e-08, 6.27367198215, 0.1600586944 ],
    [ 5.019e-08, 2.43585264336, 742.990060533 ],
    [ 5.505e-08, 0.3230734679, 40.5807161926 ],
    [ 6.432e-08, 2.21948959433, 9999.98645077 ],
    [ 6.932e-08, 1.71722830737, 378.903927683 ],
    [ 5.187e-08, 3.04429850681, 1083.76095258 ],
    [ 4.893e-08, 6.06127550285, 980.668178359 ],
    [ 5.791e-08, 3.94061476239, 550.13783422 ],
    [ 5.054e-08, 5.63164324182, 164.120359536 ],
    [ 5.481e-08, 4.36493293939, 233.533516242 ],
    [ 5.326e-08, 0.06980162504, 336.838738782 ],
    [ 6.675e-08, 4.68809907572, 312.199083963 ],
    [ 5.777e-08, 2.24316510899, 230.937077841 ],
    [ 4.907e-08, 2.9603946351, 361.377819864 ],
    [ 6.636e-08, 0.3441507572, 511.595408305 ],
    [ 6.333e-08, 0.96579519801, 249.947658367 ],
    [ 6.468e-08, 3.02580538093, 298.232622392 ],
    [ 5.096e-08, 4.22435065058, 65.3804297061 ],
    [ 5.159e-08, 3.77051984159, 57.255490749 ],
    [ 4.974e-08, 1.21594265105, 455.069425222 ],
    [ 5.785e-08, 5.06114337982, 216.268040855 ],
    [ 4.96e-08, 4.7280621023, 454.749307833 ],
    [ 5.619e-08, 2.27500441196, 227.52618944 ],
    [ 5.161e-08, 2.79823920744, 217.443697022 ],
    [ 4.791e-08, 4.40314095945, 853.196381752 ],
    [ 5.45e-08, 6.00971547441, 25.1297819136 ],
    [ 5.094e-08, 3.96693309174, 1066.49547719 ],
    [ 6.485e-08, 3.02825531498, 167.722444399 ],
    [ 5.396e-08, 5.62885554221, 418.521436029 ],
    [ 5.048e-08, 2.46802064424, 987.569277038 ],
    [ 6.152e-08, 0.79853332272, 2274.54683264 ],
    [ 6.507e-08, 1.72872754258, 125.184174746 ],
    [ 4.734e-08, 0.64940724791, 119.39504176 ],
    [ 5.785e-08, 4.31238502962, 374.498693667 ],
    [ 6.209e-08, 4.78522319194, 270.182079171 ],
    [ 5.381e-08, 5.50204905208, 632.783739313 ],
    [ 4.921e-08, 1.43037646364, 73.1370671646 ],
    [ 4.596e-08, 0.55370404346, 35.685355083 ],
    [ 5.076e-08, 1.34845106372, 455.021241112 ],
    [ 5.73e-08, 3.30386575677, 88.274979386 ],
    [ 5.07e-08, 4.59616483078, 454.797491943 ],
    [ 4.547e-08, 3.81754661073, 1329.30337693 ],
    [ 6.213e-08, 2.58827935033, 544.508759927 ],
    [ 4.825e-08, 6.08615762909, 304.122329115 ],
    [ 4.824e-08, 6.00481294702, 226.792476257 ],
    [ 5.528e-08, 5.69752791882, 548.44091319 ],
    [ 6.054e-08, 0.84188900289, 10.0824924174 ],
    [ 5.426e-08, 2.44848284229, 531.978586955 ],
    [ 5.047e-08, 2.74537299312, 423.629245459 ],
    [ 6.017e-08, 0.11706831045, 149.041932273 ],
    [ 5.671e-08, 4.76092767065, 491.818561888 ],
    [ 5.866e-08, 6.20513223441, 772.785708892 ],
    [ 5.334e-08, 2.49860553733, 1131.19458334 ],
    [ 4.766e-08, 0.19527580548, 380.388400391 ],
    [ 4.562e-08, 0.55717668871, 253.459120505 ],
    [ 5.777e-08, 4.22586873011, 208.845677313 ],
    [ 5.257e-08, 4.72122908918, 535.320039387 ],
    [ 4.406e-08, 3.42864201394, 144.897330689 ],
    [ 5.174e-08, 1.37808288211, 520.129737539 ],
    [ 4.469e-08, 1.67012643165, 1261.63532536 ],
    [ 4.331e-08, 2.64717426456, 1517.26024213 ],
    [ 4.802e-08, 2.6056946352, 177.304923814 ],
    [ 5.206e-08, 0.97973969441, 128.435004453 ],
    [ 4.368e-08, 3.36272561974, 1503.24559645 ],
    [ 4.329e-08, 2.73534631925, 289.565166714 ],
    [ 4.48e-08, 1.66847193407, 357.445666601 ],
    [ 5.386e-08, 5.84886051674, 268.697606463 ],
    [ 5.293e-08, 1.36761627543, 271.61836777 ],
    [ 5.277e-08, 0.77780731413, 1670.07426897 ],
    [ 4.812e-08, 4.95769337401, 545.471967774 ],
    [ 5.895e-08, 2.03979596386, 8.5980197091 ],
    [ 4.41e-08, 3.23960763864, 973.554631358 ],
    [ 4.201e-08, 6.02802824632, 204.701075729 ],
    [ 4.947e-08, 5.50324549674, 365.900673958 ],
    [ 4.553e-08, 2.77414446606, 147.966849842 ],
    [ 5.351e-08, 1.81217833246, 521.092945386 ],
    [ 4.218e-08, 0.73689779266, 1321.4390704 ],
    [ 5.016e-08, 1.91636964972, 535.910740218 ],
    [ 5.188e-08, 1.30753762651, 436.813809737 ],
    [ 5.686e-08, 2.54348150001, 501.379789443 ],
    [ 4.126e-08, 3.00605697657, 136.069816316 ],
    [ 4.341e-08, 3.74899549978, 263.020348061 ],
    [ 4.976e-08, 2.82755706922, 360.414612018 ],
    [ 5.36e-08, 3.99155865541, 92.4195809702 ],
    [ 4.935e-08, 5.04375067678, 697.807168369 ],
    [ 4.129e-08, 1.50064332826, 71.8608372605 ],
    [ 4.825e-08, 2.90964137048, 551.101042066 ],
    [ 5.036e-08, 4.66411186577, 305.606801824 ],
    [ 4.587e-08, 4.78553156868, 95.931043108 ],
    [ 5.054e-08, 5.41201072891, 758.771063212 ],
    [ 5.012e-08, 4.50266403787, 635.965133051 ],
    [ 5.151e-08, 0.41217186078, 968.138005387 ],
    [ 4.247e-08, 0.65406696565, 920.864433319 ],
    [ 5.15e-08, 1.13490701556, 310.975243685 ],
    [ 4.941e-08, 2.84565061722, 406.954470903 ],
    [ 4.569e-08, 5.19758291396, 10.2949407385 ],
    [ 4.259e-08, 5.53167973839, 184.987919787 ],
    [ 4.604e-08, 2.51643176466, 962.508931094 ],
    [ 4.409e-08, 1.59455204572, 367.597594988 ],
    [ 5.105e-08, 1.26007002216, 971.106950803 ],
    [ 4.5e-08, 6.15657007891, 1052.26838319 ],
    [ 3.968e-08, 0.07377679014, 77.7023598741 ],
    [ 3.9e-08, 1.66467970991, 945.243455707 ],
    [ 4.137e-08, 4.19706074841, 25.2727942655 ],
    [ 4.237e-08, 2.80797873442, 213.953486744 ],
    [ 3.899e-08, 4.28674267073, 224.232921117 ],
    [ 5.03e-08, 6.24112139947, 1162.47470441 ],
    [ 4.967e-08, 2.58649417006, 358.408874448 ],
    [ 3.859e-08, 2.72333630141, 818.574808252 ],
    [ 4.889e-08, 2.50485923786, 355.748745572 ],
    [ 4.626e-08, 6.00420830249, 421.181564905 ],
    [ 4.765e-08, 4.37822799323, 117.36805233 ],
    [ 3.919e-08, 4.81677862044, 893.356406819 ],
    [ 4.287e-08, 3.15207047069, 846.082834751 ],
    [ 3.941e-08, 0.04342429962, 1235.61177157 ],
    [ 3.816e-08, 2.42145744929, 348.847646892 ],
    [ 4.756e-08, 1.32234737789, 238.901958104 ],
    [ 4.077e-08, 5.6885446997, 695.55642977 ],
    [ 3.842e-08, 0.3742937338, 774.482629922 ],
    [ 4.674e-08, 0.08112657673, 1366.21257229 ],
    [ 5.313e-08, 4.38472090135, 689.618538937 ],
    [ 4.578e-08, 0.36908312831, 168.31314523 ],
    [ 4.827e-08, 1.26561568753, 170.760825785 ],
    [ 4.636e-08, 5.93439675803, 148.190599011 ],
    [ 5.128e-08, 0.17600223269, 433.711737877 ],
    [ 4.291e-08, 3.12693688865, 377.419454974 ],
    [ 3.927e-08, 5.59942396205, 1048.33622993 ],
    [ 4.226e-08, 6.24596640453, 448.971475694 ],
    [ 3.776e-08, 1.78756451192, 71.7007785661 ],
    [ 3.85e-08, 2.72007090628, 151.850818995 ],
    [ 4.561e-08, 0.07201979569, 2349.3284312 ],
    [ 4.291e-08, 5.39929372298, 523.753074261 ],
    [ 4.143e-08, 0.17158866287, 735.876513532 ],
    [ 3.694e-08, 1.44652002583, 48.9181034708 ],
    [ 3.728e-08, 1.69745141654, 984.712206207 ],
    [ 4.173e-08, 4.01017634093, 195.77298762 ],
    [ 4.986e-08, 1.03560339271, 224.456670287 ],
    [ 4.031e-08, 0.92145122185, 76.0054388447 ],
    [ 4.097e-08, 3.51219407937, 72.4939767069 ],
    [ 3.812e-08, 4.41246815759, 1511.3223513 ],
    [ 4.098e-08, 2.39702785276, 239.162590534 ],
    [ 3.751e-08, 5.81981147475, 450.716580833 ],
    [ 3.657e-08, 1.4138849444, 117.31986822 ],
    [ 4.373e-08, 4.08948598951, 75.4359898731 ],
    [ 4.765e-08, 4.44775874782, 51.8870488874 ],
    [ 3.7e-08, 2.04103813925, 63.2146334416 ],
    [ 4.436e-08, 5.7658054565, 836.521607196 ],
    [ 4.648e-08, 2.07482117651, 1106.65550226 ],
    [ 4.854e-08, 5.26337784504, 601.503618245 ],
    [ 3.736e-08, 1.46595907948, 138.629371455 ],
    [ 4.304e-08, 3.03122452327, 1109.62444767 ],
    [ 4.02e-08, 0.59697361731, 91.2439248026 ],
    [ 4.937e-08, 5.49417275871, 976.736025096 ],
    [ 3.719e-08, 0.11762341199, 1031.87390369 ],
    [ 4.036e-08, 2.09041185441, 325.383648241 ],
    [ 4.373e-08, 3.76648561161, 74.1272072615 ],
    [ 4.545e-08, 1.35255134812, 41.7563723602 ],
    [ 4.172e-08, 0.75349427039, 1500.06420271 ],
    [ 4.19e-08, 5.82534911413, 346.448150447 ],
    [ 3.784e-08, 0.83700163181, 827.923587486 ],
    [ 4.454e-08, 1.87402712883, 141.177625747 ],
    [ 4.853e-08, 0.95917381603, 58.1705144857 ],
    [ 4.409e-08, 0.16608106044, 630.336058758 ],
    [ 3.597e-08, 1.02560564655, 515.463871093 ],
    [ 4.822e-08, 3.83570312464, 163.577842815 ],
    [ 4.021e-08, 5.68447974866, 3.4902102784 ],
    [ 4.244e-08, 3.75845344717, 733.428832977 ],
    [ 3.933e-08, 4.55157642432, 240.125798381 ],
    [ 4.421e-08, 1.51263319894, 1610.27052393 ],
    [ 3.39e-08, 4.00215380112, 74.9940468884 ],
    [ 4.556e-08, 3.41531360523, 1140.38330388 ],
    [ 4.171e-08, 0.76417016678, 623.434960079 ],
    [ 3.997e-08, 5.74857613262, 6212.22640469 ],
    [ 4.54e-08, 3.21454634514, 761.740008628 ],
    [ 4.232e-08, 0.8388726758, 176.650532508 ],
    [ 4.098e-08, 1.41920746453, 559.699061775 ],
    [ 4.553e-08, 1.09016692751, 561.886109899 ],
    [ 3.828e-08, 4.08837921098, 268.958238894 ],
    [ 3.598e-08, 5.35099971703, 394.945562793 ],
    [ 3.484e-08, 5.54596330164, 594.911336106 ],
    [ 3.564e-08, 1.57868308864, 354.997986046 ],
    [ 4.279e-08, 2.35436288262, 562.668007192 ],
    [ 3.896e-08, 4.66682485035, 71.9245277353 ],
    [ 4.485e-08, 4.71272827101, 731.944360269 ],
    [ 3.398e-08, 1.6208634854, 941.311302444 ],
    [ 3.299e-08, 5.13632919725, 477.000767055 ],
    [ 4.623e-08, 2.72836206211, 6244.94281435 ],
    [ 3.308e-08, 2.60386718967, 14.8177948326 ],
    [ 3.435e-08, 2.96178781224, 995.646031886 ],
    [ 3.98e-08, 3.73613153043, 673.316271396 ],
    [ 3.623e-08, 0.12701520068, 49.1787359017 ],
    [ 4.377e-08, 0.27353840833, 469.72716136 ],
    [ 3.255e-08, 1.24513640154, 82.6459050935 ],
    [ 3.323e-08, 4.51516827363, 454.861182418 ],
    [ 3.32e-08, 1.42938752044, 454.957550637 ],
    [ 3.495e-08, 5.61859895107, 1116.00428149 ],
    [ 3.593e-08, 5.35238853915, 57.5161231799 ],
    [ 4.196e-08, 1.04465999471, 743.793209685 ],
    [ 3.512e-08, 6.09122971288, 70.5888128733 ],
    [ 3.814e-08, 2.49565462974, 6204.36209816 ],
    [ 3.828e-08, 4.39752166068, 586.313316397 ],
    [ 3.924e-08, 1.1070704438, 686.958410061 ],
    [ 3.356e-08, 6.26211053275, 447.205118696 ],
    [ 3.639e-08, 4.85097208169, 138.405622286 ],
    [ 3.518e-08, 0.52105043625, 262.80789974 ],
    [ 3.671e-08, 1.99667387765, 511.53171783 ],
    [ 4.167e-08, 1.61938375536, 576.161388011 ],
    [ 3.263e-08, 2.27802067614, 295.194241006 ],
    [ 3.215e-08, 0.64628330219, 887.727332527 ],
    [ 3.232e-08, 2.20615118349, 68.631259413 ],
    [ 3.279e-08, 3.50509705814, 256.428065922 ],
    [ 3.718e-08, 3.27473813045, 454.648734096 ],
    [ 3.638e-08, 2.63250736806, 455.169998958 ],
    [ 3.459e-08, 3.18851975154, 377.680087405 ],
    [ 3.772e-08, 0.88810300052, 10142.4361009 ],
    [ 3.669e-08, 4.11456655271, 409.92341632 ],
    [ 3.53e-08, 4.02075420346, 388.204522807 ],
    [ 3.163e-08, 1.65300792599, 765.884610212 ],
    [ 3.568e-08, 5.95965909592, 460.847257361 ],
    [ 3.188e-08, 1.74587038709, 18.9100067901 ],
    [ 3.305e-08, 5.77382040863, 10.5244354021 ],
    [ 4.026e-08, 2.48487699537, 531.175437803 ],
    [ 3.345e-08, 4.15802505352, 1515.77576942 ],
    [ 3.644e-08, 1.78909340323, 251.171498645 ],
    [ 3.525e-08, 2.56091667232, 78114.1462276 ],
    [ 3.147e-08, 5.05814757549, 1521.40484372 ],
    [ 3.155e-08, 0.65831540442, 74.0478853844 ],
    [ 4.18e-08, 1.168336748, 514.564353721 ],
    [ 3.255e-08, 1.96741940264, 58.7399634573 ],
    [ 3.212e-08, 3.18682610058, 1512.80682401 ],
    [ 3.486e-08, 0.22630227172, 36.5366883449 ],
    [ 3.997e-08, 5.58144993177, 57.7980074702 ],
    [ 3.628e-08, 2.42977552434, 230.825203256 ],
    [ 3.884e-08, 5.6577084846, 94.4253185403 ],
    [ 3.485e-08, 3.26177495276, 36.7604375141 ],
    [ 3.506e-08, 6.26633354904, 545.275025818 ],
    [ 3.187e-08, 1.62296832026, 138.469312761 ],
    [ 3.934e-08, 2.86731965547, 832.068189071 ],
    [ 3.115e-08, 5.67364420834, 73.5577582899 ],
    [ 3.721e-08, 2.55626754637, 279.482674296 ],
    [ 3.171e-08, 4.85529878165, 138.56568098 ],
    [ 3.108e-08, 3.14860474691, 72.5463663336 ],
    [ 3.777e-08, 5.94890597104, 873.170170125 ],
    [ 4.357e-08, 4.15105623366, 10175.1525106 ],
    [ 3.525e-08, 4.8031643597, 429.779584614 ],
    [ 3.382e-08, 1.45717307307, 5983.94945572 ],
    [ 4.161e-08, 5.39091883238, 1363.24362687 ],
    [ 3.537e-08, 4.29176088936, 36.1754821775 ],
    [ 3.115e-08, 0.59873966282, 273.853600004 ],
    [ 3.457e-08, 3.94796907904, 444.82687411 ],
    [ 3.593e-08, 3.91831549069, 10134.5717944 ],
    [ 3.7e-08, 0.67445695843, 73.9302653054 ],
    [ 3.547e-08, 5.63096398237, 440.894720847 ],
    [ 3.622e-08, 1.10742531477, 2250.16781025 ],
    [ 3.562e-08, 3.80604468765, 1525.33699698 ],
    [ 3.33e-08, 1.76480149289, 78.9743842613 ],
    [ 3.013e-08, 0.69171521367, 210.851414883 ],
    [ 3.241e-08, 3.65013641564, 335.774957199 ],
    [ 3.032e-08, 5.77852412826, 612.176811494 ],
    [ 3.978e-08, 4.58297442673, 898.773032791 ],
    [ 3.337e-08, 4.81258545559, 597.359016661 ],
    [ 3.141e-08, 3.11768616608, 6607.92772754 ],
    [ 3.696e-08, 1.76581280127, 384.581186085 ],
    [ 3.577e-08, 3.95434949639, 179.310661384 ],
    [ 3.02e-08, 5.0419340802, 197.799977049 ],
    [ 4.082e-08, 3.52781255989, 402.219168488 ],
    [ 3.454e-08, 3.41560919175, 912.787678471 ],
    [ 3.697e-08, 0.89932694516, 75.6329318292 ],
    [ 3.238e-08, 1.15084522701, 104.837879358 ],
    [ 3.374e-08, 0.40981508151, 677.769689521 ],
    [ 3.5e-08, 4.46985063604, 46.470422916 ],
    [ 3.111e-08, 1.88860295507, 34.2008823747 ],
    [ 3.953e-08, 0.25645102865, 517.160792122 ],
    [ 3.194e-08, 4.56998602897, 1385.17496871 ],
    [ 3.931e-08, 1.09338513303, 388.465155238 ],
    [ 2.93e-08, 4.8814435312, 455.660126053 ],
    [ 3.18e-08, 1.03370427552, 885.439710666 ],
    [ 3.235e-08, 5.09681747179, 464.991858945 ],
    [ 3.173e-08, 5.68964342749, 4.192785694 ],
    [ 3.181e-08, 2.87968862974, 9914.15915194 ],
    [ 3.355e-08, 5.45857968674, 73.0846775379 ],
    [ 3.951e-08, 5.81493541571, 586.377006872 ],
    [ 2.899e-08, 5.12928266291, 448.317084388 ],
    [ 2.903e-08, 1.06370870134, 454.158607002 ],
    [ 3.706e-08, 2.47342147635, 64.2571631652 ],
    [ 3.649e-08, 1.90256590579, 31.5407534988 ],
    [ 3.36e-08, 4.99299052479, 143.343422011 ],
    [ 3.657e-08, 4.53797912903, 676.285216813 ],
    [ 3.488e-08, 5.62713714766, 3189.56475686 ],
    [ 2.94e-08, 4.33606107945, 78263.7094247 ],
    [ 3.309e-08, 3.10770680369, 519.608472677 ],
    [ 3.781e-08, 4.30315299354, 164.541050662 ],
    [ 4.03e-08, 4.41794838679, 772.588766936 ],
    [ 3.058e-08, 4.84465787968, 221.163401964 ],
    [ 2.867e-08, 5.17129632099, 346.187518016 ],
    [ 3.842e-08, 1.87994191354, 299.7170951 ],
    [ 2.844e-08, 4.34268503622, 262.057140214 ],
    [ 3.724e-08, 4.94511644698, 984.488457037 ],
    [ 3.216e-08, 5.70775867303, 14.6690369863 ],
    [ 2.923e-08, 0.37358823115, 6.4804075544 ],
    [ 2.931e-08, 0.78809830626, 540.055341802 ],
    [ 3.707e-08, 4.14868763219, 6136.48159827 ],
    [ 3.931e-08, 5.52289695589, 6171.64568849 ],
    [ 2.83e-08, 2.11705330414, 34.5309507748 ],
    [ 3.348e-08, 3.08775772849, 245.494240243 ],
    [ 3.394e-08, 2.49196845335, 260.360219185 ],
    [ 3.378e-08, 3.82658652472, 25936.8554717 ],
    [ 3.041e-08, 2.14503983522, 6604.95878212 ],
    [ 3.657e-08, 6.02755271763, 340.882766629 ],
    [ 2.818e-08, 4.44508352472, 369.342700127 ],
    [ 2.865e-08, 3.21935127992, 3.8202786785 ],
    [ 3.738e-08, 5.38309514127, 980.146913497 ],
    [ 2.797e-08, 5.97725967979, 2014.02655476 ],
    [ 3.28e-08, 0.74832416123, 422.714221723 ],
    [ 3.511e-08, 1.92497000013, 343.47920503 ],
    [ 2.962e-08, 2.29867992492, 661.158605439 ],
    [ 3.603e-08, 2.72183511139, 508.626462888 ],
    [ 3.62e-08, 5.57691156197, 10066.6912945 ],
    [ 3.306e-08, 6.20620840278, 11.5669651257 ],
    [ 3.279e-08, 6.13563821647, 276.071785895 ],
    [ 2.823e-08, 1.19859134883, 1119.18567523 ],
    [ 3.302e-08, 5.46042536571, 302.377223976 ],
    [ 2.747e-08, 4.5747626302, 226.632417562 ],
    [ 3.814e-08, 3.13695930196, 901.954426528 ],
    [ 2.707e-08, 0.46257342768, 1458.47209457 ],
    [ 3.402e-08, 4.84131712548, 714.678884881 ],
    [ 3.346e-08, 1.9097173874, 44.6134431922 ],
    [ 2.96e-08, 5.31788128818, 1467.07011428 ],
    [ 3.062e-08, 1.93542241882, 987.78172536 ],
    [ 3.045e-08, 4.24065596268, 170.170124954 ],
    [ 3.504e-08, 4.10521239427, 6280.10690457 ],
    [ 2.674e-08, 1.01129308948, 582.381163134 ],
    [ 3.584e-08, 3.12196206765, 108.721848511 ],
    [ 2.975e-08, 0.13746189123, 9987.4562778 ],
    [ 2.634e-08, 5.61201014857, 412.371096874 ],
    [ 3.702e-08, 0.66231252049, 10101.8553847 ],
    [ 3.526e-08, 4.42297802934, 322.61164478 ],
    [ 3.261e-08, 4.39228048501, 75.3722993983 ],
    [ 2.939e-08, 3.26319979871, 130.552616608 ],
    [ 3.295e-08, 3.98758407636, 488.58898404 ],
    [ 2.737e-08, 3.15826692829, 683.026256798 ],
    [ 2.915e-08, 1.47424610987, 680.057311381 ],
    [ 2.624e-08, 0.47879556723, 29.226199388 ],
    [ 2.678e-08, 1.28275200438, 236.193645118 ],
    [ 3.678e-08, 3.46436124301, 26468.0309095 ],
    [ 2.598e-08, 2.16996571956, 191.319569495 ],
    [ 2.943e-08, 3.58544468129, 12489.8856287 ],
    [ 2.72e-08, 1.24094972893, 989.053749747 ],
    [ 2.894e-08, 2.2699912084, 1615.89959823 ],
    [ 2.985e-08, 4.93091159917, 132.579606038 ],
    [ 2.579e-08, 1.27635624544, 1034.84284911 ],
    [ 2.711e-08, 1.25250599577, 52250.5878817 ],
    [ 2.917e-08, 5.69857391789, 688.65533109 ],
    [ 3.483e-08, 1.97113718781, 655.938921424 ],
    [ 3.28e-08, 1.75059058234, 683.989464644 ],
    [ 3.26e-08, 3.46047977615, 74.1908977363 ],
    [ 2.936e-08, 2.61715717878, 115.36231476 ],
    [ 3.2e-08, 0.66316490563, 457.357047082 ],
    [ 2.565e-08, 3.47443238116, 2042.4977891 ],
    [ 3.158e-08, 4.58160924364, 12492.8545741 ],
    [ 2.719e-08, 2.8954618437, 27.7204748203 ],
    [ 3.373e-08, 5.52806001629, 10210.3166008 ],
    [ 2.6e-08, 0.31946397676, 85.9391734158 ],
    [ 2.619e-08, 4.43681016724, 949.17560897 ],
    [ 3.29e-08, 1.35055242247, 515.676319414 ],
    [ 3.18e-08, 4.49938964982, 694.838222952 ],
    [ 2.586e-08, 4.09771865336, 1448.91086701 ],
    [ 2.574e-08, 5.47692668053, 246.978712951 ],
    [ 3.001e-08, 3.24181300229, 1618.86854364 ],
    [ 3.009e-08, 3.16728117117, 385.756842253 ],
    [ 2.675e-08, 4.91608217296, 754.035760796 ],
    [ 2.535e-08, 0.13831089527, 591.94239069 ],
    [ 3.319e-08, 5.98200177347, 533.835566679 ],
    [ 3.307e-08, 3.31452419197, 732.97125859 ],
    [ 2.975e-08, 5.72770980032, 1011.42703456 ],
    [ 3.46e-08, 2.59999470578, 267.58564077 ],
    [ 2.857e-08, 4.11031053901, 2267.43328564 ],
    [ 2.754e-08, 0.78792218586, 229.452605133 ],
    [ 3.422e-08, 6.18592254593, 281.488411866 ],
    [ 3.495e-08, 0.1722463496, 371.529748251 ],
    [ 2.547e-08, 4.45612695304, 901.220713346 ],
    [ 2.476e-08, 1.55163657371, 1234.12729886 ],
    [ 3.38e-08, 3.46612468213, 283.62727588 ],
    [ 2.593e-08, 1.42286075943, 141.698890608 ],
    [ 2.665e-08, 2.98397830634, 250.602049673 ],
    [ 2.424e-08, 3.87508350406, 70.6369969831 ],
    [ 2.458e-08, 4.65895339908, 392.657940932 ],
    [ 2.877e-08, 5.47506403197, 1436.54075273 ],
    [ 2.948e-08, 3.49876539234, 123.018378482 ],
    [ 2.739e-08, 6.05181954433, 161.412046551 ],
    [ 2.361e-08, 5.34825180906, 318.679491517 ],
    [ 3.221e-08, 1.06289254235, 388.725787669 ],
    [ 2.715e-08, 1.28980431988, 108.982480942 ],
    [ 2.392e-08, 2.58938442749, 156.676744135 ],
    [ 2.313e-08, 5.57068624384, 29.7956483596 ],
    [ 2.351e-08, 3.65378596351, 112.393369343 ],
    [ 2.768e-08, 5.4225616879, 482.257334332 ],
    [ 2.731e-08, 2.33677247572, 273.151024588 ],
    [ 3.23e-08, 5.65661970187, 134.372895287 ],
    [ 2.685e-08, 5.03687735302, 763.224481337 ],
    [ 2.816e-08, 5.71804752798, 327.43756992 ],
    [ 2.608e-08, 3.11386505876, 578.449009871 ],
    [ 2.371e-08, 3.52034351878, 3.6233367224 ],
    [ 2.26e-08, 6.23958645351, 400.574637085 ],
    [ 3.089e-08, 5.69639540598, 537.395212926 ],
    [ 2.84e-08, 0.03011890351, 563.370582607 ],
    [ 2.43e-08, 4.24536997427, 27.7417266797 ],
    [ 2.3e-08, 2.44747995452, 107.918699359 ],
    [ 2.756e-08, 0.44285569281, 255.837365091 ],
    [ 2.255e-08, 3.38467700412, 1257.7031721 ],
    [ 2.26e-08, 3.85026258012, 753.141988919 ],
    [ 2.598e-08, 0.43155550046, 175.426692231 ],
    [ 2.319e-08, 6.27990804405, 493.042402165 ],
    [ 2.579e-08, 1.76841912074, 710.746731618 ],
    [ 2.323e-08, 5.19875505188, 380.239642545 ],
    [ 2.426e-08, 0.96570848986, 225.308003548 ],
    [ 2.182e-08, 3.63636403703, 178.135005217 ],
    [ 2.713e-08, 0.64055715691, 424.150510321 ],
    [ 2.85e-08, 5.36388642993, 44.0921783304 ],
    [ 2.174e-08, 1.36737239358, 526.509571357 ],
    [ 2.23e-08, 0.18624095003, 309.278322656 ],
    [ 2.691e-08, 3.12857199475, 36.9091953604 ],
    [ 2.356e-08, 4.70736394167, 1297.06004802 ],
    [ 2.705e-08, 3.96315420875, 466.758215943 ],
    [ 2.12e-08, 4.00527978646, 78.9262001515 ],
    [ 2.79e-08, 4.69333575335, 845.885892795 ],
    [ 2.79e-08, 3.15560752049, 696.322695661 ],
    [ 2.082e-08, 4.28436571612, 1134.16352876 ],
    [ 2.65e-08, 1.97955054585, 421.229749014 ],
    [ 2.35e-08, 2.27006566559, 280.216387479 ],
    [ 2.757e-08, 3.97088429501, 566.339528024 ],
    [ 2.4e-08, 2.08287192901, 3116.267631 ],
    [ 2.091e-08, 4.86268336295, 1222.27844945 ],
    [ 2.402e-08, 4.59336971395, 569.04784101 ],
    [ 2.053e-08, 4.50782983699, 2045.46673452 ],
    [ 2.585e-08, 3.01434261062, 30.5987975117 ],
    [ 2.362e-08, 0.28351250494, 25863.5583459 ],
    [ 2.296e-08, 2.43545418785, 52252.0723544 ],
    [ 2.296e-08, 4.03915647243, 52102.5091573 ],
    [ 2.48e-08, 4.82872104445, 702.148711909 ],
    [ 2.394e-08, 2.7184228788, 688.442882769 ],
    [ 2.598e-08, 5.52873150583, 207.361204605 ],
    [ 2.726e-08, 2.73636031357, 320.32402292 ],
    [ 2.686e-08, 3.13615031711, 161.720863091 ],
    [ 2.651e-08, 4.31467866101, 639.636653883 ],
    [ 1.999e-08, 3.81218083941, 122.055170635 ],
    [ 2.454e-08, 4.63684196748, 1012.91150727 ],
    [ 1.998e-08, 4.34234332604, 343.2185726 ],
    [ 1.982e-08, 1.04358448861, 76.3142553854 ],
    [ 2.651e-08, 4.50494915824, 6209.77872413 ],
    [ 2.315e-08, 2.16329763901, 380.015893375 ],
    [ 2.012e-08, 0.58027132344, 530.654172941 ],
    [ 1.987e-08, 2.34515279356, 768.853555629 ],
    [ 2.062e-08, 5.14612272595, 68.3011910129 ],
    [ 1.998e-08, 4.72846905297, 76.2178871658 ],
    [ 2.501e-08, 1.46803291637, 95.2766518022 ],
    [ 2.564e-08, 2.20950808655, 566.600160455 ],
    [ 2.569e-08, 1.6864211704, 749.582342672 ],
    [ 2.047e-08, 4.43426104911, 229.340730548 ],
    [ 2.226e-08, 1.08954827693, 383.309161698 ],
    [ 2.046e-08, 3.37543676127, 1055.44977693 ],
    [ 1.954e-08, 2.49907098662, 313.944189102 ],
    [ 2.177e-08, 3.00048235729, 317.876342365 ],
    [ 2.238e-08, 0.97968512796, 147.557459564 ],
    [ 2.148e-08, 0.16770637484, 112.654001774 ],
    [ 2.35e-08, 5.77036099171, 304.2342037 ],
    [ 2.183e-08, 5.58654428071, 428.082663584 ],
    [ 2.063e-08, 5.64116701319, 73.6696328745 ],
    [ 2.535e-08, 1.1355489711, 140.965177426 ],
    [ 2.445e-08, 0.65211381551, 271.66655188 ],
    [ 2.072e-08, 2.29027742046, 696.519637617 ],
    [ 2.08e-08, 1.24910729957, 311.284060226 ],
    [ 1.912e-08, 3.75992027324, 528.727757248 ],
    [ 2.063e-08, 2.21480458793, 75.8935642601 ],
    [ 2.107e-08, 4.64640498877, 150.366346287 ],
    [ 1.883e-08, 5.29259430554, 381.090975807 ],
    [ 2.562e-08, 1.42062915032, 551.212916651 ],
    [ 2.062e-08, 0.46104612533, 386.065658793 ],
    [ 1.916e-08, 5.84122649523, 481.73606947 ],
    [ 2.333e-08, 4.77162438255, 347.932623155 ],
    [ 2.156e-08, 2.11521771652, 1250.5896251 ],
    [ 2.347e-08, 1.97105922216, 188.238749494 ],
    [ 2.034e-08, 5.51423990497, 678.360390352 ],
    [ 2.321e-08, 3.54031153946, 103.986546096 ],
    [ 1.833e-08, 5.62091026321, 840.66620878 ],
    [ 2.378e-08, 6.0007378545, 664.127550856 ],
    [ 1.896e-08, 2.15809918048, 379.164560113 ],
    [ 1.809e-08, 5.61397062326, 14.2270940016 ],
    [ 2.262e-08, 4.5851769094, 430.530344139 ],
    [ 1.933e-08, 0.42376762202, 915.447807347 ],
    [ 1.933e-08, 5.10325064461, 1065.01100448 ],
    [ 2.083e-08, 4.96820157485, 294.300469129 ],
    [ 1.797e-08, 2.39655065767, 311.938451532 ],
    [ 1.797e-08, 0.79284837309, 461.501648666 ],
    [ 1.865e-08, 1.13583348993, 739.057907269 ],
    [ 1.865e-08, 5.81531651252, 888.621104404 ],
    [ 1.793e-08, 5.7880461393, 625.882640634 ],
    [ 1.947e-08, 5.79903258109, 257.391273768 ],
    [ 2.462e-08, 3.9591678311, 26.826702943 ],
    [ 2.317e-08, 0.68746265782, 625.994515218 ],
    [ 2.107e-08, 0.10366607161, 1002.75957889 ],
    [ 2.174e-08, 4.30981640926, 221.897115147 ],
    [ 1.883e-08, 4.16371906934, 213.187220853 ],
    [ 1.991e-08, 2.15389092541, 507.599564567 ],
    [ 1.81e-08, 3.70831888738, 539.25219265 ],
    [ 1.991e-08, 5.06761957393, 255.57673266 ],
    [ 1.812e-08, 0.78741962695, 151.260118164 ],
    [ 1.964e-08, 2.71891117329, 1024.21783997 ],
    [ 2.252e-08, 4.45925757192, 598.534672829 ],
    [ 1.804e-08, 2.34130589983, 80.9319377216 ],
    [ 1.854e-08, 0.13193495049, 1396.9714285 ],
    [ 1.854e-08, 4.81141797308, 1546.53462563 ],
    [ 2.186e-08, 2.58979636823, 76.5267037065 ],
    [ 1.763e-08, 5.59121902178, 947.691136261 ],
    [ 1.763e-08, 0.91173599918, 798.127939127 ],
    [ 1.816e-08, 0.95956155095, 156.043604689 ],
    [ 2.202e-08, 2.18092416439, 583.865635842 ],
    [ 1.91e-08, 2.64138421542, 498.198395706 ],
    [ 1.91e-08, 4.24508650001, 348.635198571 ],
    [ 2.215e-08, 2.45791819477, 154.559131981 ],
    [ 2.322e-08, 6.16493439544, 3340.6124267 ],
    [ 1.895e-08, 2.0239663472, 467.439539499 ],
    [ 1.943e-08, 4.41537853646, 185.578620618 ],
    [ 1.738e-08, 2.44168217704, 913.000126792 ],
    [ 2.046e-08, 2.19760587122, 882.992030112 ],
    [ 1.83e-08, 1.16794111151, 47.2735720681 ],
    [ 2.143e-08, 5.26070898677, 42.0651889009 ],
    [ 2.2e-08, 5.8975093892, 10139.9884204 ],
    [ 1.677e-08, 1.72367555591, 975.039104066 ],
    [ 1.677e-08, 3.26140378877, 1124.6023012 ],
    [ 1.776e-08, 5.05356646709, 956.289155971 ],
    [ 2.115e-08, 3.10908283877, 84.8640909847 ],
    [ 2.116e-08, 4.50159315432, 269.070113479 ],
    [ 1.77e-08, 2.96002469436, 1459.95656727 ],
    [ 1.807e-08, 3.84800342064, 529.57909051 ],
    [ 1.87e-08, 2.9336511131, 1208.05135545 ],
    [ 1.87e-08, 4.47137934596, 1357.61455258 ],
    [ 1.891e-08, 1.70111414825, 190.665178189 ],
    [ 2.06e-08, 5.06581864584, 26013.121543 ],
    [ 1.835e-08, 4.7112058249, 76.1060125812 ],
    [ 2.02e-08, 1.67687010626, 354.785537725 ],
    [ 1.733e-08, 2.43404581799, 187.275541647 ],
    [ 1.641e-08, 0.46152323273, 303.058547532 ],
    [ 1.671e-08, 0.67572104809, 154.671006565 ],
    [ 1.696e-08, 3.15463633411, 398.287015225 ],
    [ 1.968e-08, 5.83082526219, 195.400480604 ],
    [ 2.23e-08, 1.7680194688, 624.51004251 ],
    [ 2.151e-08, 3.33296618401, 552.697389359 ],
    [ 1.674e-08, 3.34095983797, 316.652502088 ],
    [ 2.029e-08, 2.07844879451, 199.853898729 ],
    [ 2.029e-08, 0.47474650993, 349.417095864 ],
    [ 2.114e-08, 3.86984575671, 81.2620061217 ],
    [ 2.147e-08, 5.6393177255, 590.830424997 ],
    [ 1.706e-08, 0.73548513365, 961.024458386 ],
    [ 1.706e-08, 2.33918741824, 811.461261251 ],
    [ 1.822e-08, 1.64784768077, 473.462372667 ],
    [ 1.822e-08, 3.25154996536, 323.899175532 ],
    [ 1.909e-08, 5.58002039864, 6134.99712557 ],
    [ 2.061e-08, 3.34168764903, 6.8529145699 ],
    [ 1.846e-08, 4.3315401475, 1396.22066897 ],
    [ 1.879e-08, 4.21685982495, 52.1476813183 ],
    [ 1.937e-08, 2.04746615092, 367.858227419 ],
    [ 1.937e-08, 3.58519438379, 517.421424553 ],
    [ 1.884e-08, 1.88048876898, 12.1576659567 ],
    [ 1.602e-08, 1.46373302224, 325.953097212 ],
    [ 1.754e-08, 4.23029342972, 539.092133956 ],
    [ 1.645e-08, 6.23273743453, 782.346936448 ],
    [ 2.153e-08, 1.61615068478, 587.86147958 ],
    [ 1.702e-08, 2.46774061252, 407.475735765 ],
    [ 1.602e-08, 4.95996654045, 487.152695442 ],
    [ 1.576e-08, 3.95360340011, 2077.76245306 ],
    [ 1.576e-08, 2.41587516724, 1928.19925593 ],
    [ 1.576e-08, 5.4438886119, 532.138645649 ],
    [ 1.88e-08, 1.41060159, 575.267616133 ],
    [ 1.88e-08, 6.0900846126, 724.830813268 ],
    [ 1.596e-08, 5.33991691502, 34.6215735 ],
    [ 1.624e-08, 1.21716384102, 475.516294347 ],
    [ 1.803e-08, 0.60015233109, 529.802839679 ],
    [ 1.662e-08, 3.50151803039, 484.705014887 ],
    [ 1.735e-08, 1.01657070139, 196.884953312 ],
    [ 1.584e-08, 0.28218018153, 1811.77315958 ],
    [ 1.804e-08, 6.08380488717, 188.659440619 ],
    [ 1.758e-08, 0.5321154964, 550.888593745 ],
    [ 1.758e-08, 2.06984372926, 700.45179088 ],
    [ 1.573e-08, 5.3835015322, 461.129141651 ],
    [ 1.667e-08, 0.24230138722, 556.517668038 ],
    [ 1.559e-08, 6.02213221899, 343.739837461 ],
    [ 1.796e-08, 5.78444078662, 525.498179401 ],
    [ 1.563e-08, 0.8061744441, 563.631215038 ],
    [ 1.603e-08, 4.38109882376, 59.5912967192 ],
    [ 1.606e-08, 1.83958629336, 1349.75024605 ],
    [ 1.606e-08, 3.44328857794, 1200.18704892 ],
    [ 1.665e-08, 3.75333799201, 764.708954045 ],
    [ 1.665e-08, 2.14963570742, 914.27215118 ],
    [ 1.741e-08, 0.81651703967, 548.243971234 ],
    [ 1.766e-08, 2.00418474011, 495.963163472 ],
    [ 1.98e-08, 4.53192980595, 1054.92851206 ],
    [ 1.98e-08, 2.99420157308, 905.36531493 ],
    [ 2.146e-08, 2.25428923199, 67.9286839974 ],
    [ 1.56e-08, 3.27821444787, 1208.94512732 ],
    [ 1.695e-08, 2.26284891229, 493.303034596 ],
    [ 1.94e-08, 4.17311496384, 981.631386205 ],
    [ 2.135e-08, 5.07005192745, 245.542424352 ],
    [ 1.604e-08, 4.06884840529, 1136.45115062 ],
    [ 1.703e-08, 2.08965979965, 274.587313187 ],
    [ 1.678e-08, 0.30302488401, 1297.86319717 ],
    [ 2.086e-08, 3.24437004031, 516.04882643 ],
    [ 1.505e-08, 0.3862283384, 509.084037275 ],
    [ 1.631e-08, 0.44359079978, 806.725958836 ],
    [ 1.544e-08, 4.38766645261, 206.706813299 ],
    [ 1.495e-08, 4.52648520007, 234.496724089 ],
    [ 1.549e-08, 0.99024664404, 834.073926641 ],
    [ 1.549e-08, 5.73570371835, 684.510729506 ],
    [ 2.013e-08, 5.61129200002, 81.6345131372 ],
    [ 1.95e-08, 0.19680015179, 118.070627746 ],
    [ 1.943e-08, 5.23985037412, 14.5571624017 ],
    [ 1.483e-08, 0.49824817575, 1020.82820343 ],
    [ 1.483e-08, 2.03597640861, 1170.39140056 ],
    [ 1.482e-08, 4.41190841719, 170.712641675 ],
    [ 1.902e-08, 2.0710383254, 15.1903018481 ],
    [ 1.493e-08, 2.1365672033, 10.9338256793 ],
    [ 1.702e-08, 2.7847833526, 844.598362043 ],
    [ 1.914e-08, 6.05987746357, 1211.23274918 ],
    [ 2.038e-08, 1.60297482666, 6588.42201938 ],
    [ 1.689e-08, 3.06284907974, 0.8031491521 ],
    [ 1.685e-08, 0.28381539862, 521.614210247 ],
    [ 1.734e-08, 3.45650791724, 1895.90353738 ],
    [ 1.636e-08, 1.62858153403, 164.380991967 ],
    [ 1.602e-08, 0.20642761616, 64.4866578288 ],
    [ 1.8e-08, 2.99044739237, 101.60830151 ],
    [ 1.867e-08, 2.92532022361, 6060.215527 ],
    [ 1.822e-08, 4.31796502202, 934.197755443 ],
    [ 1.66e-08, 5.69708947634, 1291.43097372 ],
    [ 2e-08, 5.18442514436, 452.201053542 ],
    [ 1.573e-08, 2.39570178134, 614.83694037 ],
    [ 1.446e-08, 6.12512087543, 568.297081484 ],
    [ 1.446e-08, 4.58739264257, 418.73388435 ],
    [ 1.432e-08, 1.97954511274, 504.561183181 ],
    [ 1.578e-08, 4.62126447177, 669.692934674 ],
    [ 1.773e-08, 3.00675487512, 16.9835910971 ],
    [ 1.514e-08, 0.35161589106, 403.703641196 ],
    [ 1.888e-08, 3.89724586598, 1440.99417086 ],
    [ 1.9e-08, 3.58215504368, 3192.53370227 ],
    [ 1.747e-08, 4.07850521042, 6346.81174829 ],
    [ 1.747e-08, 2.54077697756, 6197.24855116 ],
    [ 1.683e-08, 1.9223528062, 181.646467355 ],
    [ 1.587e-08, 4.9976178222, 6057.24658158 ],
    [ 1.889e-08, 0.62618826487, 1129.71011063 ],
    [ 1.753e-08, 1.82324191014, 1020.02505427 ],
    [ 1.753e-08, 3.360970143, 1169.58825141 ],
    [ 1.407e-08, 3.8766789322, 904.189658762 ],
    [ 1.658e-08, 0.17315209135, 170.01006626 ],
    [ 1.612e-08, 4.71519560888, 370.045275543 ],
    [ 1.456e-08, 5.78909667336, 415.664365197 ],
    [ 1.472e-08, 3.92804806651, 212.335887592 ],
    [ 1.776e-08, 5.89527317383, 1593.8081977 ],
    [ 1.776e-08, 4.29157088924, 1743.37139483 ],
    [ 1.398e-08, 2.89266999881, 376.946374222 ],
    [ 1.936e-08, 3.02716801943, 10518.6317156 ],
    [ 1.423e-08, 1.34276219051, 302.749730992 ],
    [ 1.929e-08, 4.65175583668, 2199.76523407 ],
    [ 1.93e-08, 3.81505372582, 543.918059096 ],
    [ 1.581e-08, 4.28040315071, 375.934982266 ],
    [ 1.621e-08, 2.21372960034, 362.03221117 ],
    [ 1.629e-08, 4.08549980424, 340.510259614 ],
    [ 1.756e-08, 1.24206336045, 555.666334776 ],
    [ 1.391e-08, 4.05514082167, 623.222511758 ],
    [ 1.48e-08, 0.85968170103, 557.038932899 ],
    [ 1.421e-08, 0.13443282384, 1523.69246558 ],
    [ 1.421e-08, 1.73813510842, 1374.12926844 ],
    [ 1.399e-08, 1.64961108641, 356.270010434 ],
    [ 1.847e-08, 1.78123333872, 25939.8244171 ],
    [ 1.466e-08, 0.75306338987, 2.0057375701 ],
    [ 1.461e-08, 3.67524662572, 139.171888177 ],
    [ 1.453e-08, 4.69267570928, 746.762155101 ],
    [ 1.45e-08, 3.85293024011, 907.3710525 ],
    [ 1.369e-08, 1.34933149459, 1130.23137549 ],
    [ 1.42e-08, 2.79221953555, 396.541910085 ]
];

KMG.VSOPTerms.uranus_R1 = [
    [ 0.01479896629, 3.67205697578, 74.7815985673 ],
    [ 0.00071212143, 6.22600975161, 63.7358983034 ],
    [ 0.0006862716, 6.13411179902, 149.563197135 ],
    [ 0.00020857554, 5.2462584896, 11.0457002639 ],
    [ 0.00021468362, 2.60175716374, 76.2660712756 ],
    [ 0.00024059369, 3.14159265359, 0 ],
    [ 0.00011405056, 0.01849738017, 70.8494453042 ],
    [ 7.496797e-05, 0.42361355955, 73.297125859 ],
    [ 4.243606e-05, 1.41691058162, 85.8272988312 ],
    [ 3.505951e-05, 2.58348117401, 138.517496871 ],
    [ 3.2288e-05, 5.25495561645, 3.9321532631 ],
    [ 3.926833e-05, 3.15526349399, 71.8126531507 ],
    [ 3.059899e-05, 0.15323842112, 1.4844727083 ],
    [ 3.578254e-05, 2.31157935775, 224.344795702 ],
    [ 2.564235e-05, 0.98078549108, 148.078724426 ],
    [ 2.429191e-05, 3.99450740432, 52.6901980395 ],
    [ 1.64483e-05, 2.65310351864, 127.471796607 ],
    [ 1.583569e-05, 1.4304953436, 78.7137518304 ],
    [ 1.41338e-05, 4.57461623347, 202.253395174 ],
    [ 1.489724e-05, 2.67568435302, 56.6223513026 ],
    [ 1.40328e-05, 1.36986207457, 77.7505439839 ],
    [ 1.227894e-05, 1.04699377171, 62.2514255951 ],
    [ 1.507836e-05, 5.06019185241, 151.047669843 ],
    [ 9.91944e-06, 2.1718165585, 65.2203710117 ],
    [ 1.032728e-05, 0.26473484111, 131.40394987 ],
    [ 8.61752e-06, 5.05508815872, 351.816592309 ],
    [ 7.44512e-06, 3.07725212553, 35.1640902212 ],
    [ 6.03966e-06, 0.90716451094, 984.600331622 ],
    [ 6.47014e-06, 4.47286717163, 70.3281804424 ],
    [ 5.74672e-06, 3.2306914554, 447.795819526 ],
    [ 6.87477e-06, 2.49910872963, 77.962992305 ],
    [ 6.23247e-06, 0.86227007749, 9.5612275556 ],
    [ 5.27867e-06, 5.15141241909, 2.9689454166 ],
    [ 5.61872e-06, 2.71781314149, 462.022913528 ],
    [ 5.3053e-06, 5.91685160971, 213.299095438 ],
    [ 4.59886e-06, 4.22296426568, 12.5301729722 ],
    [ 4.94251e-06, 0.4632180053, 145.631043871 ],
    [ 4.87371e-06, 0.70688896635, 380.12776796 ],
    [ 3.80709e-06, 3.85094436388, 3.1813937377 ],
    [ 4.44185e-06, 2.15555848995, 67.6680515665 ],
    [ 3.38646e-06, 2.53719277381, 18.1592472647 ],
    [ 3.72951e-06, 5.05141758574, 529.690965095 ],
    [ 3.48335e-06, 1.74875375735, 71.6002048296 ],
    [ 4.05615e-06, 1.22950417858, 22.0914005278 ],
    [ 2.68994e-06, 6.2420480531, 340.770892045 ],
    [ 2.5586e-06, 2.95699944505, 84.3428261229 ],
    [ 2.59244e-06, 3.92085033287, 59.8037450403 ],
    [ 2.24702e-06, 3.90949421678, 160.608897399 ],
    [ 2.21874e-06, 3.64708443278, 137.033024162 ],
    [ 2.54339e-06, 3.50524488134, 38.1330356378 ],
    [ 2.382e-06, 2.04842095939, 269.921446741 ],
    [ 2.72459e-06, 3.38353829996, 222.860322994 ],
    [ 2.006e-06, 1.24854381161, 69.3649725959 ],
    [ 2.34216e-06, 0.27861629739, 108.46121608 ],
    [ 1.88802e-06, 4.41158620525, 265.989293477 ],
    [ 2.12138e-06, 0.68012161063, 111.430161497 ],
    [ 2.05992e-06, 1.53361539719, 284.148540742 ],
    [ 1.96457e-06, 4.77133840382, 299.126394269 ],
    [ 1.53201e-06, 5.21574674133, 209.366942175 ],
    [ 1.63544e-06, 4.34120077587, 33.6796175129 ],
    [ 1.50382e-06, 1.98905719076, 54.1746707478 ],
    [ 1.36927e-06, 0.40354426815, 195.139848173 ],
    [ 1.17521e-06, 0.39618046394, 87.3117715395 ],
    [ 1.28577e-06, 2.40591376513, 39.6175083461 ],
    [ 1.04684e-06, 2.91746030897, 134.585343608 ],
    [ 1.0387e-06, 1.81603765254, 72.3339180125 ],
    [ 1.06087e-06, 0.17146170085, 79.2350166922 ],
    [ 1.06822e-06, 0.69945014388, 2.4476805548 ],
    [ 9.4904e-07, 4.02460487466, 82.8583534146 ],
    [ 1.04645e-06, 4.43615418997, 305.346169393 ],
    [ 9.3832e-07, 5.01799603662, 51.2057253312 ],
    [ 1.03733e-06, 2.57520994669, 191.20769491 ],
    [ 1.0682e-06, 1.22984965801, 225.82926841 ],
    [ 9.358e-07, 3.09257295667, 77.2292791221 ],
    [ 9.7607e-07, 3.8140415956, 152.532142551 ],
    [ 8.4782e-07, 5.72500693196, 68.8437077341 ],
    [ 7.7488e-07, 0.08155105577, 45.5766510387 ],
    [ 7.6047e-07, 4.2042219855, 73.8183907208 ],
    [ 8.6387e-07, 0.53091293351, 145.10977901 ],
    [ 7.5755e-07, 3.78546185557, 75.7448064138 ],
    [ 7.7592e-07, 1.63627982289, 479.288388915 ],
    [ 8.478e-07, 0.61510586137, 116.426096343 ],
    [ 1.00494e-06, 4.93994320097, 120.358249606 ],
    [ 7.1979e-07, 4.30613043603, 565.115687747 ],
    [ 7.1236e-07, 2.38119498898, 60.7669528868 ],
    [ 7.1539e-07, 3.93757368948, 153.495350398 ],
    [ 8.4837e-07, 5.55880391517, 344.703045308 ],
    [ 6.3516e-07, 1.93751130249, 41.6444977756 ],
    [ 7.1587e-07, 3.7120401109, 408.438943611 ],
    [ 6.1914e-07, 3.90141588459, 4.4534181249 ],
    [ 6.5088e-07, 1.55911828467, 106.976743372 ],
    [ 6.0091e-07, 0.60112111486, 74.8934731519 ],
    [ 6.1828e-07, 4.39028435621, 453.424893819 ],
    [ 6.3246e-07, 4.18799696764, 184.727287356 ],
    [ 6.2339e-07, 3.23753339104, 422.666037613 ],
    [ 5.4893e-07, 3.72792577723, 7.1135470008 ],
    [ 5.2457e-07, 6.08632045364, 404.506790348 ],
    [ 5.3071e-07, 3.51022280941, 125.987323898 ],
    [ 5.9034e-07, 1.55684840494, 456.393839236 ],
    [ 5.8831e-07, 5.33573241567, 220.412642439 ],
    [ 5.2838e-07, 5.20104115605, 358.93013931 ],
    [ 5.2878e-07, 4.44628349017, 426.598190876 ],
    [ 5.5201e-07, 1.60181891958, 14.977853527 ],
    [ 5.0997e-07, 0.52968367981, 490.334089179 ],
    [ 4.9541e-07, 4.25523625544, 5.4166259714 ],
    [ 5.1389e-07, 0.37029408817, 206.185548437 ],
    [ 5.1834e-07, 1.7547806765, 8.0767548473 ],
    [ 5.6742e-07, 0.8389113562, 146.594251718 ],
    [ 4.9107e-07, 0.94051631401, 99.1606209555 ],
    [ 4.5714e-07, 5.34241750716, 152.744590872 ],
    [ 4.8197e-07, 1.97584360072, 288.080694005 ],
    [ 4.4024e-07, 3.03717070644, 20.6069278195 ],
    [ 4.9092e-07, 5.84636334727, 112.914634205 ],
    [ 4.1989e-07, 0.0489566624, 128.956269315 ],
    [ 4.8335e-07, 3.62867663323, 81.0013736908 ],
    [ 4.1451e-07, 2.33805925587, 277.034993741 ],
    [ 4.0161e-07, 5.0967211278, 35.4247226521 ],
    [ 4.1968e-07, 2.50991447143, 24.3790223882 ],
    [ 3.8204e-07, 3.61405134343, 173.942219523 ],
    [ 3.8414e-07, 2.06063652881, 333.657345044 ],
    [ 4.2597e-07, 1.260887373, 1514.29129672 ],
    [ 3.8855e-07, 0.74315611802, 347.884439046 ],
    [ 3.8552e-07, 4.95041145803, 92.940845832 ],
    [ 3.3234e-07, 1.38358507432, 74.6697239827 ],
    [ 3.3788e-07, 3.68407945156, 66.9172920411 ],
    [ 3.9054e-07, 5.4970292656, 200.768922466 ],
    [ 3.1786e-07, 0.54344835858, 203.737867882 ],
    [ 3.3322e-07, 6.26106483857, 1059.38193019 ],
    [ 3.0806e-07, 2.53797566903, 977.486784621 ],
    [ 3.0059e-07, 0.19481253674, 387.241314961 ],
    [ 2.912e-07, 5.44130853027, 58.1068240109 ],
    [ 2.8997e-07, 3.10546504714, 991.713878623 ],
    [ 2.7827e-07, 0.36512476794, 80.1982245387 ],
    [ 3.5694e-07, 3.72852678524, 96.8729990951 ],
    [ 3.2516e-07, 4.3844786763, 221.375850285 ],
    [ 2.684e-07, 1.35294770385, 0.9632078465 ],
    [ 3.1276e-07, 0.79566551587, 373.014220959 ],
    [ 2.5922e-07, 3.45840169631, 144.146571163 ],
    [ 3.1032e-07, 2.06301188151, 230.564570825 ],
    [ 3.0278e-07, 0.71358545978, 109.945688788 ],
    [ 2.4834e-07, 3.04814439142, 14.0146456805 ],
    [ 2.5206e-07, 5.12301274564, 81.3738807063 ],
    [ 2.7765e-07, 4.75859307922, 415.552490612 ],
    [ 2.5582e-07, 2.56904012503, 522.577418094 ],
    [ 2.4351e-07, 2.20288762433, 628.85158605 ],
    [ 2.4132e-07, 5.67351884701, 443.863666263 ],
    [ 2.5491e-07, 1.78473889586, 143.625306301 ],
    [ 2.4065e-07, 0.6701080534, 46.2097904851 ],
    [ 2.5679e-07, 5.43185950755, 546.956440482 ],
    [ 2.4624e-07, 3.30585050808, 617.805885786 ],
    [ 2.4242e-07, 5.59897471399, 32.1951448046 ],
    [ 2.239e-07, 4.82189515313, 135.548551454 ],
    [ 2.7179e-07, 2.02720095476, 536.804512095 ],
    [ 2.1973e-07, 4.59216176679, 241.610271089 ],
    [ 2.2055e-07, 4.61793641919, 391.173468224 ],
    [ 2.0834e-07, 0.24550904041, 465.955066791 ],
    [ 2.7275e-07, 2.15420645259, 140.001969579 ],
    [ 2.3632e-07, 4.94972840898, 561.183534484 ],
    [ 2.1149e-07, 5.27166890173, 159.12442469 ],
    [ 2.3328e-07, 3.80624099549, 55.1378785943 ],
    [ 2.0015e-07, 1.30330553666, 518.645264831 ],
    [ 2.4853e-07, 0.5339855631, 181.758341939 ],
    [ 2.0058e-07, 4.88841177982, 909.818733055 ],
    [ 1.9193e-07, 1.31168318333, 543.024287219 ],
    [ 2.0801e-07, 0.91178178054, 76.4785195967 ],
    [ 1.899e-07, 4.67975156701, 98.8999885246 ],
    [ 1.9667e-07, 0.66620464883, 66.70484372 ],
    [ 2.5922e-07, 4.52830002662, 454.909366527 ],
    [ 1.8833e-07, 6.0804245163, 103.092774219 ],
    [ 2.1624e-07, 1.23560892029, 41.1019810544 ],
    [ 1.8091e-07, 0.96586313214, 55.6591434561 ],
    [ 2.1264e-07, 4.1951431552, 329.725191781 ],
    [ 1.8717e-07, 5.77529020491, 142.449650134 ],
    [ 1.9415e-07, 4.31464975363, 6.2197751235 ],
    [ 2.3318e-07, 5.83851945854, 297.641921561 ],
    [ 1.6657e-07, 6.09418922673, 211.81462273 ],
    [ 1.6201e-07, 2.49044081792, 61.2882177486 ],
    [ 2.0158e-07, 3.16239645425, 186.211760064 ],
    [ 1.6004e-07, 2.97277766861, 81.8951455681 ],
    [ 1.9202e-07, 6.01151966247, 155.782972258 ],
    [ 1.7468e-07, 4.82367359029, 273.102840478 ],
    [ 1.5141e-07, 3.65588411554, 472.174841915 ],
    [ 1.8451e-07, 3.47623430315, 36.6485629295 ],
    [ 1.6303e-07, 0.13085990583, 554.069987483 ],
    [ 1.8634e-07, 0.23919770714, 23.5758732361 ],
    [ 1.4358e-07, 2.69393539884, 70.1157321213 ],
    [ 1.519e-07, 2.43789398876, 486.401935916 ],
    [ 1.4488e-07, 0.14254642208, 235.390495966 ],
    [ 1.3868e-07, 5.09135892763, 29.2049475286 ],
    [ 1.4406e-07, 1.56741430063, 110.206321219 ],
    [ 1.5722e-07, 4.25156109914, 146.381803397 ],
    [ 1.7435e-07, 1.95393343617, 835.037134487 ],
    [ 1.3691e-07, 1.63831110433, 92.0470739547 ],
    [ 1.3239e-07, 2.85690648081, 49.5088043018 ],
    [ 1.2541e-07, 2.92111856784, 60.5545045657 ],
    [ 1.2594e-07, 3.20935822266, 100.384461233 ],
    [ 1.4937e-07, 0.32571457437, 259.508885923 ],
    [ 1.2827e-07, 2.77958172785, 105.492270664 ],
    [ 1.2323e-07, 3.36427641421, 440.682272526 ],
    [ 1.5261e-07, 0.25477631378, 258.875746477 ],
    [ 1.2061e-07, 0.08834689678, 157.639951982 ],
    [ 1.2881e-07, 0.30715003179, 124.290402869 ],
    [ 1.093e-07, 3.41396817201, 33.1371007917 ],
    [ 1.1062e-07, 4.99201784219, 604.472563662 ],
    [ 1.0713e-07, 3.88653353837, 767.369082921 ],
    [ 1.0435e-07, 5.25417558285, 264.504820769 ],
    [ 1.286e-07, 4.80794300903, 114.399106913 ],
    [ 1.1561e-07, 2.6045014019, 166.828672522 ],
    [ 1.0926e-07, 0.64149188846, 558.002140746 ],
    [ 1.232e-07, 4.33795118362, 16.6747745564 ],
    [ 9.947e-08, 0.67247104431, 31.492569389 ],
    [ 1.1298e-07, 0.96114335836, 373.907992837 ],
    [ 1.215e-07, 1.91679035087, 378.643295252 ],
    [ 1.2229e-07, 0.70508380884, 218.406904869 ],
    [ 1.0319e-07, 0.18138367123, 275.550521033 ],
    [ 1.0753e-07, 5.74480767273, 88.1149206916 ],
    [ 9.402e-08, 0.67913169059, 353.301065017 ],
    [ 1.0651e-07, 2.32656568944, 132.888422578 ],
    [ 9.113e-08, 2.99457723392, 681.54178409 ],
    [ 1.0788e-07, 2.62866889129, 154.01661526 ],
    [ 9.169e-08, 4.79284571455, 216.480489176 ],
    [ 9.121e-08, 0.77801335714, 67.3592350258 ],
    [ 9.222e-08, 0.73831686735, 129.919477162 ],
    [ 1.0633e-07, 0.37523847853, 699.701031354 ],
    [ 9.637e-08, 2.88664912193, 67.8804998876 ],
    [ 8.646e-08, 6.1226167326, 150.526404981 ],
    [ 8.601e-08, 2.2012646488, 342.255364753 ],
    [ 9.283e-08, 3.02854870998, 162.093370107 ],
    [ 9.178e-08, 1.49445512725, 19.643719973 ],
    [ 1.0072e-07, 3.56581375513, 278.51946645 ],
    [ 9.455e-08, 3.06088366945, 149.675071719 ],
    [ 9.786e-08, 2.43713607191, 75.3028634291 ],
    [ 9.167e-08, 5.33037538537, 152.010877689 ],
    [ 8.844e-08, 5.263892204, 80.7194894005 ],
    [ 8.017e-08, 4.7182259586, 106.013535525 ],
    [ 1.0094e-07, 0.7860106238, 339.286419336 ],
    [ 8.813e-08, 0.01616162779, 42.5864537627 ],
    [ 7.821e-08, 0.61192552414, 135.336103133 ],
    [ 8.193e-08, 2.59644466423, 469.136460529 ],
    [ 8.571e-08, 5.69112316506, 760.25553592 ],
    [ 9.277e-08, 1.97750611607, 147.11551658 ],
    [ 7.482e-08, 2.64377659424, 5.9378908332 ],
    [ 8.699e-08, 0.54050826161, 66.1835788582 ],
    [ 9.761e-08, 2.59090843673, 50.4025761791 ],
    [ 7.547e-08, 5.94593031762, 97.4155158163 ],
    [ 7.597e-08, 5.80197876381, 450.977213264 ],
    [ 8.669e-08, 3.69932904987, 300.610866977 ],
    [ 7.728e-08, 1.95146228634, 180.273869231 ],
    [ 7.309e-08, 4.98689362574, 117.910569051 ],
    [ 8.195e-08, 2.30281777892, 254.943593214 ],
    [ 7.536e-08, 1.47100575256, 32.2433289144 ],
    [ 8.473e-08, 1.27680705707, 39.3568759152 ],
    [ 7.026e-08, 0.68091865104, 874.394010403 ],
    [ 7.389e-08, 4.09295183164, 92.3077063856 ],
    [ 7.314e-08, 5.04313738379, 756.323382657 ],
    [ 8.454e-08, 1.22026161161, 79.4474650133 ],
    [ 8.732e-08, 1.34335847863, 48.7580447764 ],
    [ 8.7e-08, 0.17463519061, 43.1289704839 ],
    [ 8.187e-08, 4.29619724129, 624.919432787 ],
    [ 6.941e-08, 5.420540286, 610.692338785 ],
    [ 6.816e-08, 3.90452052962, 480.772861624 ],
    [ 6.753e-08, 6.03251850119, 350.3321196 ],
    [ 6.692e-08, 4.78230287697, 142.662098455 ],
    [ 7.025e-08, 1.27885740826, 68.5618234438 ],
    [ 6.824e-08, 1.36436524169, 291.262087743 ],
    [ 6.9e-08, 3.33848530676, 68.1893164283 ],
    [ 7.254e-08, 3.18927739209, 268.436974032 ],
    [ 7.635e-08, 4.81180010568, 312.459716394 ],
    [ 8.135e-08, 1.99010407624, 692.587484354 ],
    [ 6.31e-08, 5.42075206842, 88.7962442478 ],
    [ 6.477e-08, 1.05239284135, 685.473937353 ],
    [ 7.121e-08, 5.79764411155, 468.242688652 ],
    [ 6.32e-08, 2.58497126634, 458.090760265 ],
    [ 6.775e-08, 2.59596588927, 282.664068034 ],
    [ 6.222e-08, 5.68982546821, 113.877842052 ],
    [ 8.525e-08, 0.00581798397, 227.313741118 ],
    [ 6.52e-08, 3.99093726386, 42.5382696529 ],
    [ 6.435e-08, 1.03721543099, 365.900673958 ],
    [ 8.153e-08, 4.04274797388, 183.242814648 ],
    [ 6.039e-08, 4.35471040863, 19.1224551112 ],
    [ 8.149e-08, 1.12461637867, 69.1525242748 ],
    [ 6.151e-08, 2.783037838, 121.842722314 ],
    [ 7.815e-08, 0.55588235015, 296.157448853 ],
    [ 5.989e-08, 4.98445156091, 184.094147909 ],
    [ 6.379e-08, 0.16323583721, 228.276948965 ],
    [ 6.269e-08, 4.22014121556, 119.506916344 ],
    [ 5.982e-08, 5.44774666431, 17.5261078183 ],
    [ 5.87e-08, 0.36534808613, 148.599989288 ],
    [ 5.868e-08, 5.39245291119, 95.3885263868 ],
    [ 5.906e-08, 0.97697194245, 13.3333221243 ],
    [ 5.78e-08, 0.17831781847, 458.84151979 ],
    [ 5.719e-08, 4.74598221436, 248.72381809 ],
    [ 5.534e-08, 4.24741728108, 75.5323580927 ],
    [ 5.63e-08, 2.81567861587, 154.979823106 ],
    [ 6.26e-08, 3.52991762509, 285.633013451 ],
    [ 6.919e-08, 3.31432622158, 306.830642101 ],
    [ 6.087e-08, 4.04640130992, 271.405919449 ],
    [ 6.866e-08, 1.3429923722, 7.8643065262 ],
    [ 5.586e-08, 5.33279407873, 920.864433319 ],
    [ 6.528e-08, 0.45565192064, 106.274167956 ],
    [ 5.586e-08, 0.29304653043, 173.681587092 ],
    [ 5.353e-08, 2.49825965802, 24.1183899573 ],
    [ 6.205e-08, 5.27879491339, 120.991389052 ],
    [ 5.974e-08, 3.62786821437, 189.723222202 ],
    [ 5.176e-08, 3.69984512887, 778.414783185 ],
    [ 5.24e-08, 4.14231460056, 89.7594520943 ],
    [ 5.172e-08, 1.54846732288, 193.655375465 ],
    [ 6.36e-08, 0.35370738254, 411.620337349 ],
    [ 5.26e-08, 1.26005665335, 267.473766186 ],
    [ 6.906e-08, 4.88299482194, 419.484643875 ],
    [ 6.332e-08, 5.25617761055, 58.319272332 ],
    [ 5.993e-08, 4.70505278581, 298.232622392 ],
    [ 5.507e-08, 2.72405080404, 986.08480433 ],
    [ 4.936e-08, 6.07953205967, 134.064078746 ],
    [ 5.469e-08, 6.2163560823, 91.4563731237 ],
    [ 4.846e-08, 5.6671411571, 90.8232336773 ],
    [ 4.87e-08, 1.24431497533, 25.6028626656 ],
    [ 6.149e-08, 1.88362168986, 397.393243347 ],
    [ 5.154e-08, 3.37555501409, 831.104981224 ],
    [ 5.253e-08, 1.85387498292, 114.941623635 ],
    [ 5.163e-08, 0.49175608455, 16.4623262353 ],
    [ 4.67e-08, 0.85077620511, 403.02231764 ],
    [ 4.688e-08, 4.94827397388, 902.705186054 ],
    [ 5.005e-08, 1.40309022449, 6.1503391543 ],
    [ 5.217e-08, 0.27521357608, 192.692167619 ],
    [ 6.177e-08, 2.78454594522, 198.321241911 ],
    [ 5.014e-08, 5.57665259095, 451.940421111 ],
    [ 4.58e-08, 2.47734499363, 31.2319369581 ],
    [ 5.129e-08, 3.2352870415, 109.312549342 ],
    [ 5.74e-08, 0.95870813397, 483.220542179 ],
    [ 4.369e-08, 6.21847573079, 207.882469467 ],
    [ 4.425e-08, 2.74721673213, 823.991434223 ],
    [ 4.299e-08, 0.66587852826, 210.330150021 ],
    [ 4.527e-08, 1.8736581989, 44.7253177768 ],
    [ 4.484e-08, 1.03729827686, 606.760185522 ],
    [ 4.135e-08, 0.41031273891, 180.161994646 ],
    [ 4.646e-08, 5.82325024322, 905.886579792 ],
    [ 4.086e-08, 4.84914558939, 124.50285119 ],
    [ 4.486e-08, 0.35223479841, 457.878311944 ],
    [ 4.318e-08, 1.68857333749, 309.278322656 ],
    [ 5.151e-08, 2.90867214997, 28.3111756513 ],
    [ 4.061e-08, 3.32301396744, 107.498008234 ],
    [ 4.332e-08, 1.41872733238, 25.1297819136 ],
    [ 4.944e-08, 5.87125173636, 303.861696684 ],
    [ 4.407e-08, 5.2874885047, 449.280292235 ],
    [ 4.18e-08, 1.67985859496, 7.4223635415 ],
    [ 3.977e-08, 3.22662754639, 639.897286314 ],
    [ 5.415e-08, 2.15030495019, 187.696232772 ],
    [ 4.217e-08, 0.73382717079, 497.44763618 ],
    [ 4.875e-08, 0.88184557385, 255.055467798 ],
    [ 4.758e-08, 4.60909386948, 258.024413215 ],
    [ 5.337e-08, 2.36556705745, 477.803916207 ],
    [ 4.456e-08, 1.74674336635, 95.9792272178 ],
    [ 4.138e-08, 3.80344455465, 460.53844082 ],
    [ 3.843e-08, 4.02615028031, 104.007797955 ],
    [ 5.032e-08, 0.36645338967, 123.539643344 ],
    [ 3.78e-08, 2.89085160996, 27.0873353739 ],
    [ 4.309e-08, 4.77464606019, 463.507386236 ],
    [ 3.779e-08, 3.05636034284, 142.140833593 ],
    [ 4.357e-08, 3.73616179561, 376.195614697 ],
    [ 3.705e-08, 2.47343159576, 25.2727942655 ],
    [ 4.232e-08, 4.31629167726, 446.311346818 ],
    [ 3.576e-08, 2.55404008547, 6.592282139 ],
    [ 3.685e-08, 3.26448469664, 170.760825785 ],
    [ 3.575e-08, 4.31199276037, 572.229234747 ],
    [ 4.496e-08, 2.10358455875, 838.218528225 ],
    [ 3.716e-08, 0.20018583737, 394.354861962 ],
    [ 3.846e-08, 5.8108074508, 586.313316397 ],
    [ 3.527e-08, 4.05179036599, 433.711737877 ],
    [ 3.524e-08, 3.75716903766, 473.068613792 ],
    [ 3.501e-08, 4.445648846, 384.059921223 ],
    [ 3.636e-08, 2.12955997197, 73.1852512744 ],
    [ 3.841e-08, 5.28811045359, 43.2890291783 ],
    [ 3.928e-08, 4.26291422687, 196.624320882 ],
    [ 3.702e-08, 3.86923731076, 981.631386205 ],
    [ 3.445e-08, 2.10100539423, 316.391869657 ],
    [ 3.432e-08, 2.97356096189, 535.910740218 ],
    [ 4.312e-08, 0.38740046308, 988.532484885 ],
    [ 3.867e-08, 2.08559458308, 457.357047082 ],
    [ 3.353e-08, 4.19681836937, 114.138474483 ],
    [ 4.128e-08, 3.06165703137, 377.158822543 ],
    [ 3.545e-08, 4.41886084391, 1293.87865428 ],
    [ 3.309e-08, 3.54050386234, 520.129737539 ],
    [ 3.337e-08, 6.23473900765, 9947.05568153 ],
    [ 4.527e-08, 4.61192905449, 47.061123747 ],
    [ 3.523e-08, 2.00908999163, 47.6942631934 ],
    [ 3.37e-08, 3.65249455401, 976.002311913 ],
    [ 3.29e-08, 6.135297351, 34.2008823747 ],
    [ 3.253e-08, 5.22413528932, 425.113718168 ],
    [ 3.461e-08, 5.18605119393, 993.198351331 ],
    [ 3.712e-08, 2.53410725291, 237.678117826 ],
    [ 3.24e-08, 3.56995183051, 17.2654753874 ],
    [ 3.362e-08, 1.26285882591, 233.906023258 ],
    [ 3.606e-08, 1.94705146379, 661.094914965 ],
    [ 3.182e-08, 0.3660331511, 449.492740556 ],
    [ 3.427e-08, 6.03153107557, 199.284449757 ],
    [ 3.169e-08, 2.55715329118, 6133.51265286 ],
    [ 3.994e-08, 4.53148620187, 916.932280055 ],
    [ 4.413e-08, 4.14550138614, 219.891377577 ],
    [ 3.6e-08, 4.16003477661, 214.783568146 ],
    [ 4.193e-08, 4.26425258521, 381.612240668 ],
    [ 3.846e-08, 3.76849990033, 8.5980197091 ],
    [ 3.183e-08, 3.15317674552, 15.1903018481 ],
    [ 3.35e-08, 5.63661413371, 444.82687411 ],
    [ 3.78e-08, 5.35722293289, 328.240719073 ],
    [ 3.166e-08, 2.16351748263, 983.115858914 ],
    [ 3.93e-08, 2.09444900058, 653.981367964 ],
    [ 3.585e-08, 1.24517449239, 162.896519259 ],
    [ 3.527e-08, 1.89208045227, 280.967147005 ],
    [ 3.282e-08, 1.91872815218, 2349.3284312 ],
    [ 3.076e-08, 4.77282170585, 820.05928096 ],
    [ 3.399e-08, 5.35259772941, 141.698890608 ],
    [ 3.269e-08, 0.52855777633, 450.455948402 ],
    [ 3.582e-08, 1.60170266832, 1587.58842258 ],
    [ 3.044e-08, 0.84602343274, 30.7106720963 ],
    [ 3.616e-08, 6.16820602029, 171.654597662 ],
    [ 3.007e-08, 4.69605806277, 978.971257329 ],
    [ 3.528e-08, 4.79818282081, 406.954470903 ],
    [ 2.98e-08, 2.17792323043, 597.359016661 ],
    [ 2.977e-08, 0.6947862817, 294.300469129 ],
    [ 3.411e-08, 1.18022650672, 167.722444399 ],
    [ 4.049e-08, 3.15153850922, 833.552661779 ],
    [ 3.725e-08, 5.84743216544, 6058.73105429 ],
    [ 3.242e-08, 0.63525153286, 141.486442287 ],
    [ 3.683e-08, 1.86888555615, 371.529748251 ],
    [ 3.877e-08, 1.44138798341, 346.187518016 ],
    [ 3.142e-08, 2.26934250738, 517.160792122 ],
    [ 4.077e-08, 0.07273073033, 1190.03512053 ],
    [ 2.893e-08, 3.53141229605, 94.4253185403 ],
    [ 3.02e-08, 2.64998251178, 20.4468691251 ],
    [ 3.11e-08, 1.11431255827, 1044.40407666 ],
    [ 2.836e-08, 0.62522723719, 749.209835656 ],
    [ 2.898e-08, 4.11830043593, 600.540410399 ],
    [ 2.819e-08, 4.72400465237, 122.475861761 ],
    [ 3.572e-08, 1.96375884146, 372.423520128 ],
    [ 2.801e-08, 3.99301180541, 10063.7223491 ],
    [ 2.806e-08, 3.85026986935, 133.100870899 ],
    [ 2.791e-08, 6.24681129336, 908.334260346 ],
    [ 3.466e-08, 3.43275071793, 82.6459050935 ],
    [ 3.725e-08, 1.68366366742, 683.989464644 ],
    [ 3.763e-08, 3.28247771799, 432.817966 ],
    [ 3.493e-08, 0.98765698465, 9988.94075051 ],
    [ 3.523e-08, 5.12512607932, 105.380396079 ],
    [ 3.432e-08, 2.8048316223, 764.187689183 ],
    [ 2.733e-08, 0.42373696972, 354.997986046 ],
    [ 3.041e-08, 5.75641149588, 409.92341632 ],
    [ 3.379e-08, 5.47448876584, 1396.22066897 ],
    [ 3.102e-08, 0.41684444831, 521.092945386 ],
    [ 2.863e-08, 0.41519700992, 894.840879528 ],
    [ 3.128e-08, 5.23384180625, 424.150510321 ],
    [ 2.688e-08, 3.59170326422, 621.738039049 ],
    [ 2.848e-08, 2.16605887838, 216.92243216 ],
    [ 2.673e-08, 1.60411606116, 136.069816316 ],
    [ 3.414e-08, 4.93712749827, 1140.38330388 ],
    [ 2.653e-08, 5.10283251074, 118.022443636 ],
    [ 2.73e-08, 4.22647867347, 990.229405914 ],
    [ 3.113e-08, 5.23808775951, 417.03696332 ],
    [ 3.289e-08, 4.26401031509, 544.508759927 ],
    [ 3.1e-08, 5.4792852793, 701.185504063 ],
    [ 2.785e-08, 5.19343849093, 144.897330689 ],
    [ 2.605e-08, 4.82136791856, 362.862292573 ],
    [ 3.183e-08, 4.76078229245, 294.672976144 ],
    [ 3.55e-08, 3.82073713802, 511.53171783 ],
    [ 2.641e-08, 3.49997209213, 293.188503436 ],
    [ 2.788e-08, 1.54956737675, 28.5718080822 ],
    [ 2.897e-08, 0.37376102831, 582.381163134 ],
    [ 2.615e-08, 2.25516923974, 74.9940468884 ],
    [ 3.582e-08, 1.27992264402, 987.569277038 ],
    [ 3.115e-08, 5.10929689813, 459.053968112 ],
    [ 2.589e-08, 1.83177157042, 657.162761701 ],
    [ 2.539e-08, 4.14968938109, 74.7334144575 ],
    [ 2.797e-08, 2.82242772664, 2036.86871481 ],
    [ 2.688e-08, 2.16500211397, 262.80789974 ],
    [ 2.817e-08, 6.06679932038, 374.498693667 ],
    [ 2.539e-08, 0.46036497385, 74.8297826771 ],
    [ 2.504e-08, 3.523948017, 1183.67233306 ],
    [ 2.565e-08, 1.64023845161, 73.4090004436 ],
    [ 2.663e-08, 4.23321349902, 421.181564905 ],
    [ 3.019e-08, 1.62290757266, 414.068017904 ],
    [ 2.793e-08, 2.00644423849, 75.0422309982 ],
    [ 3.253e-08, 2.43153394317, 98.3574718034 ],
    [ 2.883e-08, 2.41875736533, 4.665866446 ],
    [ 2.553e-08, 1.25909246207, 670.496083826 ],
    [ 3.135e-08, 1.96936617667, 842.150681488 ],
    [ 2.604e-08, 3.87350462519, 74.0308390419 ],
    [ 2.51e-08, 3.35948960782, 464.991858945 ],
    [ 3.05e-08, 1.8107797128, 331.209664489 ],
    [ 3.005e-08, 0.81031349171, 73.88782669 ],
    [ 2.701e-08, 5.89709637826, 525.23754697 ],
    [ 3.11e-08, 6.14956891318, 118.873776898 ],
    [ 2.774e-08, 6.26134027482, 1022.31267613 ],
    [ 2.402e-08, 4.38353347008, 1303.27982314 ],
    [ 2.8e-08, 2.60339313269, 74.5209661364 ],
    [ 3.005e-08, 0.76247280223, 75.6753704446 ],
    [ 2.434e-08, 4.9478467943, 969.622478095 ],
    [ 2.63e-08, 0.62894209942, 227.52618944 ],
    [ 2.669e-08, 0.7334022821, 73.0846775379 ],
    [ 2.465e-08, 1.3064877338, 77.0692204277 ],
    [ 2.395e-08, 2.76580569447, 768.853555629 ],
    [ 2.753e-08, 5.59058621175, 388.725787669 ],
    [ 3.23e-08, 0.01981320255, 881.507557403 ],
    [ 3.008e-08, 5.6595546366, 1969.20066324 ],
    [ 3.008e-08, 0.91409756228, 2118.76386038 ],
    [ 2.465e-08, 0.26629856014, 72.4939767069 ],
    [ 2.313e-08, 3.37979302623, 286.596221297 ],
    [ 2.272e-08, 2.77069357318, 515.463871093 ],
    [ 2.579e-08, 4.80372721669, 103.35340665 ],
    [ 2.36e-08, 4.12736987374, 74.6215398729 ],
    [ 2.22e-08, 2.17920233841, 491.818561888 ],
    [ 2.498e-08, 1.19812774743, 383.096713377 ],
    [ 2.981e-08, 3.15769661969, 1887.30551768 ],
    [ 2.57e-08, 3.1385967429, 229.080098117 ],
    [ 2.355e-08, 0.48259604722, 74.9416572617 ],
    [ 2.228e-08, 1.4245214891, 6219.33995169 ],
    [ 2.184e-08, 5.18000549953, 59.2824801785 ],
    [ 2.319e-08, 2.10326941903, 11.1575748485 ],
    [ 2.724e-08, 3.48225905765, 10.2949407385 ],
    [ 2.162e-08, 3.61282527361, 22.633917249 ],
    [ 2.232e-08, 3.98572942665, 68.631259413 ],
    [ 2.39e-08, 2.47806087593, 177.874372786 ],
    [ 2.199e-08, 0.22998162264, 217.231248701 ],
    [ 2.915e-08, 5.18526716284, 218.928169731 ],
    [ 2.875e-08, 2.77889026188, 184.987919787 ],
    [ 2.865e-08, 0.62015957113, 1411.1985225 ],
    [ 2.298e-08, 3.95654643159, 26.0235537909 ],
    [ 2.318e-08, 1.21463632824, 291.704030728 ],
    [ 2.56e-08, 1.48802298081, 1055.44977693 ],
    [ 2.796e-08, 5.59819583385, 260.993358631 ],
    [ 2.492e-08, 4.25519394022, 149.45132255 ],
    [ 2.007e-08, 6.11892578566, 63.6240237188 ],
    [ 2.11e-08, 3.59139003023, 256.428065922 ],
    [ 2.198e-08, 4.46404375855, 524.061890802 ],
    [ 2.706e-08, 0.80150714262, 89.0086925689 ],
    [ 2.41e-08, 2.28619111368, 74.2603337055 ],
    [ 2.102e-08, 3.18561308775, 635.965133051 ],
    [ 2.006e-08, 1.30247563131, 385.756842253 ],
    [ 2.304e-08, 3.60550712225, 115.883579622 ],
    [ 1.899e-08, 2.42426868365, 273.853600004 ],
    [ 2.119e-08, 5.98199852906, 559.699061775 ],
    [ 2.152e-08, 5.30772822745, 2.0057375701 ],
    [ 2.447e-08, 5.10278930542, 205.222340591 ],
    [ 1.962e-08, 1.45399000044, 80.4106728598 ],
    [ 1.895e-08, 3.30475087405, 46.470422916 ],
    [ 1.942e-08, 1.79179369066, 346.399966337 ],
    [ 1.85e-08, 5.74338030118, 175.1660598 ],
    [ 1.848e-08, 2.74750349182, 429.779584614 ],
    [ 1.848e-08, 1.20977525896, 280.216387479 ],
    [ 2.22e-08, 1.12912931401, 323.505416657 ],
    [ 1.839e-08, 3.5808636747, 327.43756992 ],
    [ 1.839e-08, 4.86693953738, 507.599564567 ],
    [ 1.848e-08, 5.26302620499, 81.682697247 ],
    [ 1.996e-08, 4.36291795113, 1812.52391911 ],
    [ 1.893e-08, 0.10622820999, 93.9040536785 ],
    [ 2.368e-08, 2.77235858734, 477.000767055 ],
    [ 1.891e-08, 2.25571301508, 4.7353024152 ],
    [ 1.792e-08, 1.5975940843, 832.589453932 ],
    [ 1.792e-08, 3.20129636889, 683.026256798 ],
    [ 2.092e-08, 0.32766195745, 343.2185726 ],
    [ 1.792e-08, 5.80267442975, 779.899255893 ],
    [ 1.726e-08, 3.18023607065, 332.172872336 ],
    [ 1.831e-08, 3.75183606052, 469.72716136 ],
    [ 1.831e-08, 5.28956429339, 619.290358494 ],
    [ 1.721e-08, 0.80119805379, 1432.39615115 ],
    [ 1.721e-08, 2.33892628665, 1581.95934828 ],
    [ 1.978e-08, 1.7419645108, 331.321539074 ],
    [ 1.895e-08, 5.31311179301, 253.57099509 ],
    [ 1.758e-08, 2.96038070029, 1596.18644228 ],
    [ 1.758e-08, 1.42265246742, 1446.62324515 ],
    [ 2.109e-08, 0.73357181364, 758.771063212 ],
    [ 1.911e-08, 0.46392477628, 1589.07289528 ],
    [ 1.96e-08, 5.98949067581, 1392.28851571 ],
    [ 1.96e-08, 1.31000765322, 1242.72531857 ],
    [ 1.833e-08, 6.18306213718, 535.320039387 ],
    [ 2.195e-08, 0.42296220916, 703.633184617 ],
    [ 1.815e-08, 5.00776376696, 255.837365091 ],
    [ 1.89e-08, 0.32598438166, 221.163401964 ],
    [ 1.864e-08, 2.6802330408, 405.991263056 ],
    [ 2.065e-08, 6.09002439734, 763.436929658 ],
    [ 2.065e-08, 4.55229616447, 613.873732523 ],
    [ 1.61e-08, 4.9140818566, 115.36231476 ],
    [ 1.823e-08, 5.54014516908, 357.445666601 ],
    [ 1.62e-08, 2.90668209411, 609.207866077 ],
    [ 1.604e-08, 3.64436334999, 30.0562807905 ],
    [ 1.578e-08, 6.12288879129, 423.629245459 ],
    [ 1.754e-08, 3.29214293116, 1515.77576942 ],
    [ 1.819e-08, 6.21015313585, 215.437959452 ],
    [ 1.679e-08, 2.61674435978, 181.055766524 ],
    [ 1.907e-08, 5.520303318, 602.988090954 ],
    [ 1.52e-08, 1.94954212244, 1228.49822457 ],
    [ 1.52e-08, 0.34583983785, 1378.06142171 ],
    [ 1.538e-08, 4.79041960434, 543.918059096 ],
    [ 1.518e-08, 3.84678636307, 14.2270940016 ],
    [ 1.851e-08, 4.61165114292, 774.482629922 ],
    [ 1.52e-08, 3.24071154201, 39.0962434843 ],
    [ 1.647e-08, 5.88231739154, 398.877716056 ],
    [ 1.471e-08, 1.35595542925, 481.73606947 ],
    [ 1.469e-08, 5.56206799884, 301.41401613 ],
    [ 1.474e-08, 1.58634608266, 274.066048325 ],
    [ 1.48e-08, 6.05250894033, 194.288514911 ],
    [ 1.473e-08, 0.67726919761, 539.25219265 ],
    [ 1.472e-08, 3.07440978254, 50.66320861 ],
    [ 1.564e-08, 5.43230552977, 459.362784652 ],
    [ 1.468e-08, 5.20182042843, 130.440742023 ],
    [ 1.802e-08, 2.75155368399, 30.5987975117 ],
    [ 1.483e-08, 2.08618845205, 69.6737891366 ],
    [ 1.433e-08, 3.35897454068, 267.58564077 ],
    [ 1.801e-08, 6.06701083819, 210.851414883 ],
    [ 1.473e-08, 1.65632386952, 1052.26838319 ],
    [ 1.392e-08, 3.13732434239, 369.082067696 ],
    [ 1.502e-08, 0.28443439725, 495.963163472 ],
    [ 1.403e-08, 4.98324477005, 35.685355083 ],
    [ 1.404e-08, 3.16559098208, 255.57673266 ],
    [ 1.456e-08, 5.36560710378, 6283.07584999 ],
    [ 1.412e-08, 0.68968780108, 348.847646892 ],
    [ 1.589e-08, 4.89344411716, 1366.21257229 ],
    [ 1.426e-08, 5.72934799733, 335.141817752 ],
    [ 1.469e-08, 4.66006940636, 893.356406819 ],
    [ 1.469e-08, 6.26377169094, 743.793209685 ],
    [ 1.668e-08, 1.29876086261, 1673.25566271 ],
    [ 1.668e-08, 2.90246314719, 1523.69246558 ],
    [ 1.526e-08, 5.93140614398, 1662.96072197 ],
    [ 1.373e-08, 4.85710108204, 61.448276443 ],
    [ 1.366e-08, 4.78315200862, 470.690369206 ],
    [ 1.39e-08, 5.7698716402, 79.889407998 ],
    [ 1.461e-08, 3.00376275716, 632.783739313 ]
];

KMG.VSOPTerms.uranus_R2 = [
    [ 0.00022439899, 0.69953310903, 74.7815985673 ],
    [ 4.726838e-05, 1.69896897296, 63.7358983034 ],
    [ 1.681383e-05, 4.64842242588, 70.8494453042 ],
    [ 1.433633e-05, 3.52135281258, 149.563197135 ],
    [ 1.649477e-05, 3.09669484042, 11.0457002639 ],
    [ 7.69974e-06, 0, 0 ],
    [ 4.61159e-06, 0.76667185672, 3.9321532631 ],
    [ 5.00193e-06, 6.17218448634, 76.2660712756 ],
    [ 3.90377e-06, 4.49603136758, 56.6223513026 ],
    [ 3.89972e-06, 5.52663268311, 85.8272988312 ],
    [ 2.92283e-06, 0.20370820668, 52.6901980395 ],
    [ 2.72269e-06, 3.8473537521, 138.517496871 ],
    [ 2.86451e-06, 3.53449822561, 73.297125859 ],
    [ 2.05341e-06, 3.24759155116, 78.7137518304 ],
    [ 2.19349e-06, 1.96433948894, 131.40394987 ],
    [ 2.15812e-06, 0.84820922453, 77.962992305 ],
    [ 1.2904e-06, 2.08142441038, 3.1813937377 ],
    [ 1.48716e-06, 4.89757177249, 127.471796607 ],
    [ 1.17642e-06, 4.93417950365, 447.795819526 ],
    [ 1.12873e-06, 1.01358614296, 462.022913528 ],
    [ 9.9082e-07, 6.15736951949, 224.344795702 ],
    [ 9.1634e-07, 0.68110922044, 18.1592472647 ],
    [ 8.9537e-07, 0.23396296581, 202.253395174 ],
    [ 8.8475e-07, 2.93078580361, 62.2514255951 ],
    [ 1.13471e-06, 4.78996247308, 145.631043871 ],
    [ 1.03857e-06, 3.58561861261, 71.6002048296 ],
    [ 6.1854e-07, 3.29891157272, 351.816592309 ],
    [ 5.7828e-07, 4.90530751807, 22.0914005278 ],
    [ 6.4448e-07, 3.38789169908, 1.4844727083 ],
    [ 7.111e-07, 6.10490045777, 454.909366527 ],
    [ 5.092e-07, 3.86475363643, 65.2203710117 ],
    [ 6.3666e-07, 3.96437325595, 67.6680515665 ],
    [ 5.9151e-07, 5.54929939724, 9.5612275556 ],
    [ 4.8713e-07, 3.74773116593, 269.921446741 ],
    [ 4.401e-07, 1.92372120641, 59.8037450403 ],
    [ 4.2677e-07, 2.61696151844, 151.047669843 ],
    [ 4.4556e-07, 5.90316779799, 71.8126531507 ],
    [ 4.2421e-07, 6.1363853032, 284.148540742 ],
    [ 3.7328e-07, 5.91300114911, 984.600331622 ],
    [ 4.2329e-07, 2.08837866544, 12.5301729722 ],
    [ 3.6234e-07, 5.4033118009, 77.7505439839 ],
    [ 3.1472e-07, 4.58140053324, 148.078724426 ],
    [ 3.1469e-07, 2.26119541579, 195.139848173 ],
    [ 2.7151e-07, 3.53245541147, 209.366942175 ],
    [ 2.8313e-07, 4.57742211849, 77.2292791221 ],
    [ 2.6135e-07, 0.65832277309, 120.358249606 ],
    [ 2.4371e-07, 5.86680470366, 69.3649725959 ],
    [ 2.3072e-07, 1.04150250909, 84.3428261229 ],
    [ 2.2686e-07, 1.71276605718, 160.608897399 ],
    [ 2.7909e-07, 4.91450005237, 277.034993741 ],
    [ 2.0958e-07, 2.202477842, 45.5766510387 ],
    [ 2.0277e-07, 2.30684759993, 2.4476805548 ],
    [ 1.6889e-07, 4.75579457418, 213.299095438 ],
    [ 1.6616e-07, 1.85435119988, 340.770892045 ],
    [ 1.7053e-07, 4.3720784206, 54.1746707478 ],
    [ 1.6086e-07, 3.65914337666, 152.744590872 ],
    [ 1.4838e-07, 5.44395102901, 408.438943611 ],
    [ 1.3872e-07, 3.3853110087, 358.93013931 ],
    [ 1.3344e-07, 5.24928235077, 137.033024162 ],
    [ 1.3276e-07, 1.26302583053, 134.585343608 ],
    [ 1.27e-07, 3.02323882509, 92.940845832 ],
    [ 1.3615e-07, 1.5319229404, 422.666037613 ],
    [ 1.2387e-07, 1.33244915199, 51.2057253312 ],
    [ 1.645e-07, 0.40355823582, 265.989293477 ],
    [ 1.2052e-07, 5.08792165794, 191.20769491 ],
    [ 1.1443e-07, 2.05677650023, 7.1135470008 ],
    [ 1.2762e-07, 4.42146478775, 87.3117715395 ],
    [ 1.2158e-07, 3.23645294871, 116.426096343 ],
    [ 1.1636e-07, 4.65085291428, 41.6444977756 ],
    [ 1.1612e-07, 4.17982719132, 60.5545045657 ],
    [ 1.1692e-07, 3.73284551397, 220.412642439 ],
    [ 1.0313e-07, 0.35141402139, 70.3281804424 ],
    [ 1.1316e-07, 1.07773417628, 72.3339180125 ],
    [ 9.522e-08, 3.05257396853, 2.9689454166 ],
    [ 9.279e-08, 2.43997351068, 565.115687747 ],
    [ 8.993e-08, 5.1884103266, 225.82926841 ],
    [ 1.0284e-07, 1.18602188589, 344.703045308 ],
    [ 8.847e-08, 6.00863947318, 5.4166259714 ],
    [ 8.508e-08, 5.24741470219, 347.884439046 ],
    [ 8.322e-08, 3.71500823381, 14.977853527 ],
    [ 8.276e-08, 2.27407098373, 299.126394269 ],
    [ 8.064e-08, 5.71681525179, 55.1378785943 ],
    [ 7.829e-08, 0.90269701074, 222.860322994 ],
    [ 8.335e-08, 4.48600419464, 70.1157321213 ],
    [ 8.489e-08, 3.911747962, 333.657345044 ],
    [ 8.708e-08, 5.81537952972, 153.495350398 ],
    [ 1.0194e-07, 5.97791997034, 35.1640902212 ],
    [ 9.652e-08, 0.38887666466, 415.552490612 ],
    [ 7.106e-08, 1.5059848847, 991.713878623 ],
    [ 8.055e-08, 2.25812279923, 206.185548437 ],
    [ 6.468e-08, 2.99863142327, 380.12776796 ],
    [ 6.393e-08, 1.1686180992, 96.8729990951 ],
    [ 8.976e-08, 6.05363032396, 146.381803397 ],
    [ 6.131e-08, 0.05596259493, 99.1606209555 ],
    [ 5.803e-08, 0.79879069877, 142.449650134 ],
    [ 5.816e-08, 4.63029217647, 49.5088043018 ],
    [ 5.557e-08, 0.63854330387, 58.1068240109 ],
    [ 5.869e-08, 2.21418083323, 80.1982245387 ],
    [ 5.162e-08, 4.36457872885, 977.486784621 ],
    [ 5.428e-08, 0.85181859845, 546.956440482 ],
    [ 5.75e-08, 2.48104577171, 373.014220959 ],
    [ 5.766e-08, 0.34229026122, 536.804512095 ],
    [ 5.924e-08, 5.48443563529, 76.4785195967 ],
    [ 5.154e-08, 4.81339702575, 387.241314961 ],
    [ 5.325e-08, 3.72411790512, 23.5758732361 ],
    [ 5.037e-08, 5.06388596602, 440.682272526 ],
    [ 5.209e-08, 4.09574144962, 132.888422578 ],
    [ 5.79e-08, 3.39593613152, 458.090760265 ],
    [ 5.007e-08, 4.25821411688, 522.577418094 ],
    [ 5.114e-08, 0.4964558173, 60.7669528868 ],
    [ 5.027e-08, 6.1524848967, 39.6175083461 ],
    [ 5.183e-08, 3.25775152471, 561.183534484 ],
    [ 4.603e-08, 1.69268338637, 152.532142551 ],
    [ 4.566e-08, 0.46068888813, 33.1371007917 ],
    [ 5.302e-08, 1.83522660093, 124.290402869 ],
    [ 4.454e-08, 2.30288945184, 312.459716394 ],
    [ 5.766e-08, 0.6606915576, 38.1330356378 ],
    [ 4.255e-08, 3.58596694157, 479.288388915 ],
    [ 4.315e-08, 1.64104755836, 128.956269315 ],
    [ 4.19e-08, 4.37674804409, 79.2350166922 ],
    [ 5.756e-08, 0.87494010124, 20.6069278195 ],
    [ 5.409e-08, 0.87333646247, 81.8951455681 ],
    [ 5.124e-08, 1.40551554367, 144.146571163 ],
    [ 4.045e-08, 6.07362424621, 19.643719973 ],
    [ 3.994e-08, 5.77048046468, 288.080694005 ],
    [ 4.987e-08, 2.99179430284, 29.2049475286 ],
    [ 3.87e-08, 4.43713601497, 141.698890608 ],
    [ 3.811e-08, 3.15820960943, 159.12442469 ],
    [ 4.553e-08, 0.01384318412, 298.232622392 ],
    [ 3.737e-08, 5.28319518103, 353.301065017 ],
    [ 3.742e-08, 2.67921642406, 426.598190876 ],
    [ 3.939e-08, 5.27301148162, 521.092945386 ],
    [ 5.065e-08, 4.09433474334, 111.430161497 ],
    [ 3.861e-08, 1.343943837, 535.320039387 ],
    [ 3.619e-08, 5.10070043677, 490.334089179 ],
    [ 4.385e-08, 0.620576801, 827.172827961 ],
    [ 3.645e-08, 0.34509016266, 33.6796175129 ],
    [ 3.558e-08, 2.51710360898, 258.875746477 ],
    [ 3.919e-08, 0.62079541541, 152.010877689 ],
    [ 3.576e-08, 3.24526237368, 230.564570825 ],
    [ 3.469e-08, 0.79054323335, 983.115858914 ],
    [ 4.53e-08, 2.86839686392, 129.919477162 ],
    [ 3.648e-08, 5.59395544992, 774.482629922 ],
    [ 3.44e-08, 4.71254994607, 6.9010986797 ],
    [ 3.513e-08, 4.49630054276, 376.195614697 ],
    [ 4.521e-08, 2.05472247761, 404.506790348 ],
    [ 3.336e-08, 0.89628904042, 469.136460529 ],
    [ 3.274e-08, 3.86236880159, 42.5382696529 ],
    [ 3.201e-08, 2.76459652868, 248.72381809 ],
    [ 3.184e-08, 0.07709843451, 1514.29129672 ],
    [ 3.783e-08, 5.29835962126, 369.082067696 ],
    [ 3.119e-08, 1.27526406087, 200.768922466 ],
    [ 3.266e-08, 2.24754480216, 73.8183907208 ],
    [ 3.055e-08, 2.60120354408, 433.711737877 ],
    [ 3.051e-08, 4.54953369151, 980.668178359 ],
    [ 3.472e-08, 4.93521260607, 411.620337349 ],
    [ 3.531e-08, 4.49372794858, 881.507557403 ],
    [ 3.284e-08, 5.59170577331, 472.174841915 ],
    [ 3.049e-08, 3.68906777491, 16.6747745564 ],
    [ 3.015e-08, 6.02967446446, 291.262087743 ],
    [ 3.755e-08, 3.1258774756, 108.46121608 ],
    [ 3.467e-08, 2.17484439267, 554.069987483 ],
    [ 3.138e-08, 0.52367930477, 1094.80665284 ],
    [ 3.257e-08, 2.49339546514, 451.72797279 ],
    [ 2.886e-08, 2.44887846041, 135.336103133 ],
    [ 2.965e-08, 0.3929499553, 25.2727942655 ],
    [ 2.794e-08, 5.32964924523, 125.987323898 ],
    [ 2.814e-08, 1.70481689541, 639.897286314 ],
    [ 2.777e-08, 5.94801147914, 89.7594520943 ],
    [ 2.831e-08, 2.52728803131, 867.280463402 ],
    [ 2.779e-08, 0.48501334493, 305.346169393 ],
    [ 2.872e-08, 0.77434367967, 486.401935916 ],
    [ 2.857e-08, 4.71106805785, 218.928169731 ],
    [ 3.081e-08, 4.10993868704, 146.594251718 ],
    [ 2.763e-08, 4.27510031656, 350.3321196 ],
    [ 3.365e-08, 3.67691210011, 661.094914965 ],
    [ 2.925e-08, 1.43646759644, 381.612240668 ],
    [ 2.802e-08, 3.11122994722, 216.480489176 ],
    [ 2.756e-08, 4.6267249884, 1357.61455258 ],
    [ 3.45e-08, 2.12911756067, 685.473937353 ],
    [ 2.646e-08, 3.81808560938, 550.888593745 ],
    [ 2.584e-08, 5.63009428967, 24.3790223882 ],
    [ 2.74e-08, 1.85885336732, 529.690965095 ],
    [ 2.606e-08, 4.36605237304, 1080.57955884 ],
    [ 2.438e-08, 3.04265976382, 391.173468224 ],
    [ 2.446e-08, 5.7384638154, 535.910740218 ],
    [ 2.471e-08, 4.1814010428, 235.390495966 ],
    [ 2.568e-08, 1.09886876369, 913.000126792 ],
    [ 2.346e-08, 1.88690998393, 82.8583534146 ],
    [ 2.301e-08, 0.2711625493, 7.8643065262 ],
    [ 3.053e-08, 5.35047433775, 681.54178409 ],
    [ 2.29e-08, 2.49218620138, 203.737867882 ],
    [ 2.325e-08, 0.52844013308, 14.2270940016 ],
    [ 2.258e-08, 0.0315661773, 398.287015225 ],
    [ 2.16e-08, 6.01811980506, 140.001969579 ],
    [ 2.328e-08, 3.12607654898, 273.102840478 ],
    [ 2.139e-08, 4.33383273131, 91.4563731237 ],
    [ 2.723e-08, 1.24464892033, 166.828672522 ],
    [ 2.053e-08, 4.3243438112, 515.463871093 ],
    [ 2.398e-08, 5.9014427096, 79.4474650133 ],
    [ 2.222e-08, 4.80208391464, 268.436974032 ],
    [ 2.31e-08, 0.48180017719, 14.0146456805 ],
    [ 2.022e-08, 5.85402756377, 271.405919449 ],
    [ 2.521e-08, 3.23111737258, 901.954426528 ],
    [ 2.369e-08, 2.40985582671, 73.0846775379 ],
    [ 2.034e-08, 0.47496124187, 2043.98226181 ],
    [ 1.955e-08, 6.21237525891, 384.059921223 ],
    [ 1.954e-08, 3.38054663002, 820.05928096 ],
    [ 1.867e-08, 5.32253331194, 31.492569389 ],
    [ 2.416e-08, 0.0642020989, 419.484643875 ],
    [ 1.762e-08, 5.772005785, 1589.07289528 ],
    [ 1.762e-08, 4.23427755214, 1439.50969815 ],
    [ 1.925e-08, 0.79521713622, 184.094147909 ],
    [ 2.204e-08, 0.52846501316, 278.51946645 ],
    [ 2.228e-08, 4.32684227036, 66.9172920411 ],
    [ 1.679e-08, 5.14179135334, 1059.38193019 ],
    [ 1.706e-08, 1.54289098759, 234.496724089 ],
    [ 1.625e-08, 5.07314285147, 100.384461233 ],
    [ 1.609e-08, 6.16926697458, 1119.18567523 ],
    [ 2.033e-08, 3.53119363701, 109.945688788 ],
    [ 2.129e-08, 1.22429037482, 184.727287356 ],
    [ 1.717e-08, 2.42144217711, 678.360390352 ],
    [ 1.717e-08, 3.95917040998, 827.923587486 ],
    [ 1.81e-08, 0.05278694247, 17.2654753874 ],
    [ 1.585e-08, 1.88716701489, 4.4534181249 ],
    [ 1.577e-08, 5.35894329524, 1894.41906468 ],
    [ 1.523e-08, 3.77627435709, 181.055766524 ],
    [ 1.534e-08, 0.19778048653, 135.548551454 ],
    [ 1.506e-08, 2.95864025543, 849.264228489 ],
    [ 1.506e-08, 1.35493797085, 998.827425623 ],
    [ 1.722e-08, 5.00518792666, 699.701031354 ],
    [ 1.722e-08, 3.46745969379, 550.13783422 ],
    [ 1.643e-08, 5.86122302822, 89.0086925689 ],
    [ 1.52e-08, 1.42254433373, 0.2124483211 ],
    [ 1.529e-08, 0.77073213979, 329.725191781 ],
    [ 1.458e-08, 5.90775641818, 147.11551658 ],
    [ 1.792e-08, 1.11686829848, 453.424893819 ],
    [ 1.498e-08, 2.6114567579, 365.900673958 ],
    [ 1.793e-08, 2.14241351007, 211.81462273 ],
    [ 1.58e-08, 5.57997675255, 785.528330185 ],
    [ 1.58e-08, 4.04224851969, 635.965133051 ],
    [ 1.835e-08, 4.31480288855, 465.955066791 ],
    [ 1.407e-08, 4.94842057032, 74.8934731519 ],
    [ 1.403e-08, 5.15016124506, 180.161994646 ],
    [ 1.42e-08, 2.60452620081, 95.3885263868 ],
    [ 1.383e-08, 5.95287019467, 74.6697239827 ],
    [ 1.382e-08, 2.10457236484, 458.84151979 ],
    [ 1.513e-08, 1.88475439191, 1051.51762366 ],
    [ 1.368e-08, 5.67966974902, 66.70484372 ]
];

KMG.VSOPTerms.uranus_R3 = [
    [ 1.164663e-05, 4.73440180792, 74.7815985673 ],
    [ 2.12363e-06, 3.34268349684, 63.7358983034 ],
    [ 1.96315e-06, 2.981012371, 70.8494453042 ],
    [ 1.04707e-06, 0.95789279555, 11.0457002639 ],
    [ 7.1681e-07, 0.02528295071, 56.6223513026 ],
    [ 7.2719e-07, 0.99479831041, 149.563197135 ],
    [ 5.4933e-07, 2.59936585639, 3.9321532631 ],
    [ 3.4026e-07, 3.82319495878, 76.2660712756 ],
    [ 3.2081e-07, 3.59825177872, 131.40394987 ],
    [ 2.9569e-07, 3.44303690664, 85.8272988312 ],
    [ 3.6377e-07, 5.65035573026, 77.962992305 ],
    [ 2.7625e-07, 0.42885477377, 3.1813937377 ],
    [ 2.7552e-07, 2.55709855563, 52.6901980395 ],
    [ 2.474e-07, 5.14634979896, 78.7137518304 ],
    [ 1.9382e-07, 5.13444064222, 18.1592472647 ],
    [ 1.5767e-07, 0.37116951743, 447.795819526 ],
    [ 1.5441e-07, 5.57271837433, 462.022913528 ],
    [ 1.5035e-07, 3.84415419523, 73.297125859 ],
    [ 1.545e-07, 2.9757251436, 145.631043871 ],
    [ 1.7788e-07, 0, 0 ],
    [ 1.5958e-07, 5.19915553861, 71.6002048296 ],
    [ 1.078e-07, 6.02554585112, 138.517496871 ],
    [ 1.0347e-07, 3.60350847669, 224.344795702 ],
    [ 7.612e-08, 1.47668980969, 1.4844727083 ],
    [ 8.14e-08, 2.61444086595, 22.0914005278 ],
    [ 7.107e-08, 5.43946774526, 269.921446741 ],
    [ 6.459e-08, 4.37142319461, 284.148540742 ],
    [ 6.817e-08, 0.0148593733, 151.047669843 ],
    [ 7.811e-08, 0.29898229022, 127.471796607 ],
    [ 5.768e-08, 4.22672716677, 373.014220959 ],
    [ 5.105e-08, 1.81797461354, 202.253395174 ],
    [ 4.692e-08, 2.7840457544, 120.358249606 ],
    [ 5.071e-08, 0.7664167964, 62.2514255951 ],
    [ 4.133e-08, 1.8887930071, 209.366942175 ],
    [ 5.201e-08, 4.15791319343, 195.139848173 ],
    [ 3.946e-08, 1.83105030444, 72.3339180125 ],
    [ 3.582e-08, 3.92592140377, 124.290402869 ],
    [ 4.34e-08, 3.99626115302, 9.5612275556 ],
    [ 3.739e-08, 1.50894993813, 148.078724426 ],
    [ 3.436e-08, 1.99291271003, 65.2203710117 ],
    [ 3.835e-08, 1.15614639932, 153.495350398 ],
    [ 3.593e-08, 0.94897593272, 92.940845832 ],
    [ 3.95e-08, 1.85721204646, 152.744590872 ],
    [ 3.277e-08, 1.40881404192, 351.816592309 ],
    [ 3.058e-08, 5.76662885271, 160.608897399 ],
    [ 2.719e-08, 5.64780369357, 134.585343608 ],
    [ 2.8e-08, 0.79480255927, 572.229234747 ],
    [ 2.727e-08, 6.00569967758, 12.5301729722 ],
    [ 2.524e-08, 3.05071097098, 387.241314961 ],
    [ 2.662e-08, 1.98593312104, 450.977213264 ],
    [ 2.391e-08, 1.62282528307, 358.93013931 ],
    [ 2.57e-08, 2.81202618885, 213.299095438 ],
    [ 2.291e-08, 4.81424601791, 536.804512095 ],
    [ 2.213e-08, 2.20360299816, 465.955066791 ],
    [ 2.345e-08, 3.89530188536, 76.4785195967 ],
    [ 1.99e-08, 6.00348345539, 77.2292791221 ],
    [ 1.836e-08, 0.86993337572, 288.080694005 ],
    [ 2.233e-08, 4.20038854663, 45.5766510387 ],
    [ 1.745e-08, 4.28595550732, 67.6680515665 ],
    [ 1.715e-08, 5.36211200127, 84.3428261229 ],
    [ 1.64e-08, 5.46719808619, 309.278322656 ],
    [ 1.64e-08, 3.86349580161, 458.84151979 ],
    [ 1.728e-08, 3.60055588821, 81.8951455681 ],
    [ 1.483e-08, 3.46836166107, 59.8037450403 ],
    [ 1.463e-08, 3.58895839694, 347.884439046 ],
    [ 1.415e-08, 1.8281699263, 497.44763618 ],
    [ 1.399e-08, 5.26616832831, 909.818733055 ],
    [ 1.399e-08, 3.66246604373, 1059.38193019 ],
    [ 1.401e-08, 4.64442933182, 96.8729990951 ]
];

KMG.VSOPTerms.uranus_R4 = [
    [ 5.3224e-07, 3.00468894529, 74.7815985673 ],
    [ 9.887e-08, 1.91399083603, 56.6223513026 ],
    [ 7.008e-08, 5.08677527404, 11.0457002639 ],
    [ 6.718e-08, 5.39509675772, 149.563197135 ],
    [ 3.855e-08, 5.18994119112, 131.40394987 ],
    [ 3.316e-08, 1.22839100759, 85.8272988312 ],
    [ 2.664e-08, 0.44064577837, 63.7358983034 ],
    [ 2.309e-08, 0.92380720934, 145.631043871 ],
    [ 2.383e-08, 6.21390585593, 358.93013931 ],
    [ 2.288e-08, 2.23425399117, 440.682272526 ],
    [ 2.472e-08, 3.28269448244, 18.1592472647 ],
    [ 2.837e-08, 3.14159265359, 0 ]
];

KMG.VSOPTerms.neptune_L0 = [
    [ 5.31188633046, 0, 0 ],
    [ 0.0179847553, 2.9010127389, 38.1330356378 ],
    [ 0.01019727652, 0.48580922867, 1.4844727083 ],
    [ 0.00124531845, 4.83008090676, 36.6485629295 ],
    [ 0.00042064466, 5.41054993053, 2.9689454166 ],
    [ 0.00037714584, 6.09221808686, 35.1640902212 ],
    [ 0.00033784738, 1.24488874087, 76.2660712756 ],
    [ 0.00016482741, 7.727998e-05, 491.557929457 ],
    [ 9.198584e-05, 4.93747051954, 39.6175083461 ],
    [ 8.99425e-05, 0.27462171806, 175.1660598 ],
    [ 4.216242e-05, 1.98711875978, 73.297125859 ],
    [ 3.364807e-05, 1.03590060915, 33.6796175129 ],
    [ 2.2848e-05, 4.20606949415, 4.4534181249 ],
    [ 1.433516e-05, 2.78339802539, 74.7815985673 ],
    [ 9.00236e-06, 2.07607168714, 109.945688788 ],
    [ 7.44997e-06, 3.19032509437, 71.8126531507 ],
    [ 5.06217e-06, 5.7478606968, 114.399106913 ],
    [ 3.99552e-06, 0.34972342836, 1021.24889455 ],
    [ 3.45189e-06, 3.46185292806, 41.1019810544 ],
    [ 3.06338e-06, 0.49684052934, 0.5212648618 ],
    [ 2.87322e-06, 4.50523446022, 0.0481841098 ],
    [ 3.23003e-06, 2.24814943701, 32.1951448046 ],
    [ 3.40303e-06, 3.30376245107, 77.7505439839 ],
    [ 2.66605e-06, 4.8893260559, 0.9632078465 ],
    [ 2.27079e-06, 1.79713146385, 453.424893819 ],
    [ 2.44722e-06, 1.24693366148, 9.5612275556 ],
    [ 2.32888e-06, 2.50459784128, 137.033024162 ],
    [ 2.8217e-06, 2.2456558998, 146.594251718 ],
    [ 2.51941e-06, 5.78166617117, 388.465155238 ],
    [ 1.50188e-06, 2.99706170691, 5.9378908332 ],
    [ 1.70404e-06, 3.32390687638, 108.46121608 ],
    [ 1.51401e-06, 2.19153150087, 33.9402499438 ],
    [ 1.48305e-06, 0.85949274408, 111.430161497 ],
    [ 1.18672e-06, 3.67706211426, 2.4476805548 ],
    [ 1.01821e-06, 5.70539236951, 0.1118745846 ],
    [ 9.7873e-07, 2.80518417596, 8.0767548473 ],
    [ 1.03059e-06, 4.40432042649, 70.3281804424 ],
    [ 1.03305e-06, 0.04078966679, 0.2606324309 ],
    [ 1.09299e-06, 2.41599473953, 183.242814648 ],
    [ 7.3938e-07, 1.32805035282, 529.690965095 ],
    [ 7.7725e-07, 4.16446516489, 4.192785694 ],
    [ 8.6312e-07, 4.22838781137, 490.073456749 ],
    [ 8.1558e-07, 5.19840134548, 493.042402165 ],
    [ 7.1503e-07, 5.29530376008, 350.3321196 ],
    [ 6.4418e-07, 3.54540876782, 168.052512799 ],
    [ 6.257e-07, 0.15028731307, 182.279606801 ],
    [ 5.8488e-07, 3.50107011546, 145.10977901 ],
    [ 4.8286e-07, 1.1125900709, 112.914634205 ],
    [ 4.7229e-07, 4.57373234943, 46.2097904851 ],
    [ 3.9124e-07, 1.66569494185, 213.299095438 ],
    [ 4.7728e-07, 0.12906212459, 484.444382456 ],
    [ 4.6858e-07, 3.01699530311, 498.671476458 ],
    [ 3.8659e-07, 2.38685681991, 2.9207613068 ],
    [ 4.7046e-07, 4.49844734537, 173.681587092 ],
    [ 4.7565e-07, 2.58404545035, 219.891377577 ],
    [ 4.4714e-07, 5.47302844713, 176.650532508 ]
    // 56 terms retained
];

KMG.VSOPTerms.neptune_L1 = [
    [ 38.1330356396, 0, 0 ],
    [ 0.00016604172, 4.86323329249, 1.4844727083 ],
    [ 0.00015744045, 2.27887427527, 38.1330356378 ],
    [ 1.306261e-05, 3.6728520962, 2.9689454166 ],
    [ 6.04842e-06, 1.5048304279, 35.1640902212 ],
    [ 1.82909e-06, 3.45225794434, 39.6175083461 ],
    [ 1.95106e-06, 0.88660326088, 76.2660712756 ],
    [ 1.0641e-06, 2.44986610969, 4.4534181249 ],
    [ 1.0559e-06, 2.75516054635, 33.6796175129 ],
    [ 7.2757e-07, 5.49395347003, 36.6485629295 ],
    [ 5.7069e-07, 5.2164980497, 0.5212648618 ],
    [ 2.9871e-07, 3.67043294114, 388.465155238 ],
    [ 2.8866e-07, 5.16877538898, 9.5612275556 ],
    [ 2.8742e-07, 5.16732589024, 2.4476805548 ],
    [ 2.5507e-07, 5.24526281928, 168.052512799 ],
    [ 2.4869e-07, 4.73193067879, 182.279606801 ],
    [ 2.0205e-07, 5.78945415677, 1021.24889455 ],
    [ 1.9022e-07, 1.82981144269, 484.444382456 ],
    [ 1.8661e-07, 1.31606255521, 498.671476458 ],
    [ 1.5039e-07, 4.94966181697, 137.033024162 ],
    [ 1.5094e-07, 3.98706934679, 32.1951448046 ],
    [ 1.0804e-07, 1.93261742828, 41.1019810544 ],
    [ 1.072e-07, 2.44148207341, 4.192785694 ],
    [ 1.1765e-07, 4.87825331237, 71.8126531507 ],
    [ 9.363e-08, 3.07523176644, 74.7815985673 ],
    [ 9.58e-08, 1.23193270898, 5.9378908332 ],
    [ 8.968e-08, 0.01758782577, 8.0767548473 ],
    [ 9.882e-08, 6.08165614859, 7.1135470008 ],
    [ 6.992e-08, 0.61688829918, 2.9207613068 ],
    [ 6.19e-08, 5.32293546028, 114.399106913 ],
    [ 5.543e-08, 2.24141643357, 46.2097904851 ],
    [ 5.578e-08, 5.45096032574, 73.297125859 ],
    [ 5.858e-08, 1.72552768872, 77.7505439839 ]
    // 33 terms retained
];

KMG.VSOPTerms.neptune_L2 = [
    [ 2.86136e-06, 1.18985661922, 38.1330356378 ],
    [ 2.9565e-06, 1.85520880574, 1.4844727083 ],
    [ 1.02284e-06, 0, 0 ],
    [ 2.2987e-07, 1.21060882957, 2.9689454166 ],
    [ 7.332e-08, 0.53982718012, 2.4476805548 ],
    [ 9.112e-08, 4.42541280638, 35.1640902212 ],
    [ 5.223e-08, 0.67422237527, 168.052512799 ],
    [ 5.201e-08, 3.02334762854, 182.279606801 ],
    [ 3.925e-08, 3.53215364421, 484.444382456 ],
    [ 3.741e-08, 5.90239568618, 498.671476458 ],
    [ 3.054e-08, 0.28898269237, 4.4534181249 ],
    [ 3.382e-08, 5.91086982903, 76.2660712756 ],
    [ 3.289e-08, 1.84550132467, 175.1660598 ],
    [ 2.157e-08, 1.89134644831, 388.465155238 ],
    [ 2.211e-08, 4.37947574774, 7.1135470008 ],
    [ 1.955e-08, 5.15138892758, 33.6796175129 ],
    [ 1.847e-08, 3.48560457075, 9.5612275556 ],
    [ 2.436e-08, 4.68322560973, 491.557929457 ],
    [ 1.674e-08, 2.55582666306, 36.6485629295 ],
    [ 1.309e-08, 4.52441960698, 1021.24889455 ]
    // 20 terms retained
];

KMG.VSOPTerms.neptune_L3 = [
    [ 1.2472e-07, 6.04427218715, 1.4844727083 ],
    [ 1.1257e-07, 6.11436681584, 38.1330356378 ],
    [ 4.354e-08, 3.14159265359, 0 ],
    [ 1.39e-08, 4.95198243861, 2.9689454166 ]
    // 4 terms retained
];

KMG.VSOPTerms.neptune_B0 = [
    [ 0.03088622933, 1.44104372644, 38.1330356378 ],
    [ 0.00027780087, 5.91271884599, 76.2660712756 ],
    [ 0.00027623609, 0, 0 ],
    [ 0.00015355489, 2.52123799551, 36.6485629295 ],
    [ 0.00015448133, 3.50877079215, 39.6175083461 ],
    [ 1.999918e-05, 1.50998668632, 74.7815985673 ],
    [ 1.96754e-05, 4.37778196626, 1.4844727083 ],
    [ 1.015137e-05, 3.21560997434, 35.1640902212 ],
    [ 6.05767e-06, 2.80246592015, 73.297125859 ],
    [ 5.94878e-06, 2.12892696997, 41.1019810544 ],
    [ 5.88806e-06, 3.18655898167, 2.9689454166 ],
    [ 4.0183e-06, 4.16883411107, 114.399106913 ],
    [ 2.54333e-06, 3.27120475878, 453.424893819 ],
    [ 2.61647e-06, 3.76722702982, 213.299095438 ],
    [ 2.79963e-06, 1.68165289071, 77.7505439839 ],
    [ 2.0559e-06, 4.25652269561, 529.690965095 ],
    [ 1.40455e-06, 3.52969120587, 137.033024162 ],
    [ 9.853e-07, 4.16774786185, 33.6796175129 ]
    // 18 terms retained
];

KMG.VSOPTerms.neptune_B1 = [
    [ 5.150897e-05, 2.14270496419, 38.1330356378 ],
    [ 2.58298e-06, 5.4653959892, 76.2660712756 ],
    [ 2.51862e-06, 4.40444268588, 36.6485629295 ],
    [ 2.34436e-06, 1.65983511437, 39.6175083461 ],
    [ 2.08814e-06, 0, 0 ],
    [ 2.5312e-07, 6.00917621033, 35.1640902212 ],
    [ 1.7795e-07, 4.95721064558, 213.299095438 ],
    [ 1.7841e-07, 0.44821000048, 41.1019810544 ],
    [ 1.3152e-07, 1.49958304388, 529.690965095 ],
    [ 1.0729e-07, 4.39946094022, 73.297125859 ],
    [ 8.422e-08, 1.55833887152, 2.9689454166 ]
    // 11 terms retained
];

KMG.VSOPTerms.neptune_B2 = [
    [ 4.2058e-07, 1.91480759314, 38.1330356378 ],
    [ 4.359e-08, 4.77459417163, 39.6175083461 ],
    [ 4.23e-08, 1.12991232222, 36.6485629295 ],
    [ 4.166e-08, 4.37185631758, 76.2660712756 ]
    // 4 terms retained
];

KMG.VSOPTerms.neptune_B3 = [
    [ 4.131e-08, 3.06928911462, 38.1330356378 ]
    // 1 terms retained
];

KMG.VSOPTerms.neptune_R0 = [
    [ 30.0701320583, 0, 0 ],
    [ 0.27062259632, 1.32999459377, 38.1330356378 ],
    [ 0.01691764014, 3.25186135653, 36.6485629295 ],
    [ 0.00807830553, 5.18592878704, 1.4844727083 ],
    [ 0.0053776051, 4.52113935896, 35.1640902212 ],
    [ 0.00495725141, 1.5710564165, 491.557929457 ],
    [ 0.00274571975, 1.84552258866, 175.1660598 ],
    [ 0.00135134092, 3.37220609835, 39.6175083461 ],
    [ 0.00121801746, 5.79754470298, 76.2660712756 ],
    [ 0.00100896068, 0.3770272493, 73.297125859 ],
    [ 0.00069791331, 3.79616637768, 2.9689454166 ],
    [ 0.00046687836, 5.74938034313, 33.6796175129 ],
    [ 0.00024594531, 0.50801745878, 109.945688788 ],
    [ 0.00016939478, 1.59422512526, 71.8126531507 ],
    [ 0.00014229808, 1.07785898723, 74.7815985673 ],
    [ 0.0001201232, 1.92059384991, 1021.24889455 ],
    [ 8.394349e-05, 0.67818233586, 146.594251718 ],
    [ 7.571796e-05, 1.07149207335, 388.465155238 ],
    [ 5.720872e-05, 2.59061733345, 4.4534181249 ],
    [ 4.84021e-05, 1.90681013048, 41.1019810544 ],
    [ 4.483493e-05, 2.90573464537, 529.690965095 ],
    [ 4.269595e-05, 3.4133352687, 453.424893819 ],
    [ 4.353588e-05, 0.67984856103, 32.1951448046 ],
    [ 4.420549e-05, 1.74990681127, 108.46121608 ],
    [ 2.879755e-05, 1.98627174527, 137.033024162 ],
    [ 2.635535e-05, 3.09755951044, 213.299095438 ],
    [ 3.381113e-05, 0.84810966225, 183.242814648 ],
    [ 2.877511e-05, 3.67417203197, 350.3321196 ],
    [ 2.306505e-05, 2.80964587883, 70.3281804424 ],
    [ 2.529939e-05, 5.79822254729, 490.073456749 ],
    [ 2.522868e-05, 0.48612122962, 493.042402165 ],
    [ 2.085926e-05, 0.61853857468, 33.9402499438 ],
    [ 1.976522e-05, 5.1170304456, 168.052512799 ],
    [ 1.904055e-05, 1.72165893329, 182.279606801 ],
    [ 1.653525e-05, 1.9278198756, 145.10977901 ],
    [ 1.434507e-05, 1.69985856533, 484.444382456 ],
    [ 1.403029e-05, 4.58914203187, 498.671476458 ],
    [ 1.499989e-05, 1.01619882251, 219.891377577 ],
    [ 1.397976e-05, 0.76199761055, 176.650532508 ],
    [ 1.402764e-05, 6.07659120736, 173.681587092 ],
    [ 1.128278e-05, 5.96666460978, 9.5612275556 ],
    [ 1.228058e-05, 1.59915900158, 77.7505439839 ],
    [ 8.35562e-06, 3.97050539397, 114.399106913 ],
    [ 8.11407e-06, 3.00264146159, 46.2097904851 ],
    [ 7.31543e-06, 2.10445780662, 181.758341939 ],
    [ 6.15618e-06, 2.97867866529, 106.976743372 ],
    [ 7.03453e-06, 1.18748208693, 256.539940506 ],
    [ 5.01955e-06, 1.38654746863, 5.9378908332 ],
    [ 5.30475e-06, 4.2411216215, 111.430161497 ],
    [ 4.37096e-06, 2.27029212923, 1550.93985965 ],
    [ 3.99906e-06, 1.25612321821, 8.0767548473 ],
    [ 4.20992e-06, 1.8924823459, 30.7106720963 ],
    [ 3.82461e-06, 3.29964092733, 983.115858914 ],
    [ 4.22891e-06, 5.5309962033, 525.498179401 ],
    [ 3.55064e-06, 2.27873080286, 218.406904869 ],
    [ 2.81092e-06, 4.54185193503, 44.7253177768 ],
    [ 3.14499e-06, 3.95932948594, 381.351608237 ],
    [ 2.79604e-06, 1.54525386438, 98.8999885246 ],
    [ 2.68088e-06, 5.1344811954, 112.914634205 ],
    [ 3.3326e-06, 5.75014889084, 39.0962434843 ],
    [ 2.91773e-06, 4.02405440052, 68.8437077341 ],
    [ 3.2143e-06, 1.50624339061, 454.909366527 ],
    [ 3.092e-06, 2.85451259377, 72.0732855816 ],
    [ 3.45541e-06, 1.35801933629, 293.188503436 ],
    [ 3.0736e-06, 0.31939966593, 601.764250676 ],
    [ 2.51026e-06, 3.54039557458, 312.199083963 ],
    [ 2.48151e-06, 3.41078778961, 37.611770776 ],
    [ 3.06e-06, 2.72475094464, 6244.94281435 ],
    [ 2.9353e-06, 4.89079714624, 528.206492386 ],
    [ 2.34148e-06, 0.59107513684, 42.5864537627 ],
    [ 2.39159e-06, 3.15940174394, 143.625306301 ],
    [ 2.14523e-06, 3.62480267276, 278.258834019 ],
    [ 2.46198e-06, 1.01506302015, 141.225809856 ],
    [ 1.74151e-06, 5.54934515763, 567.824000732 ],
    [ 1.63736e-06, 2.09772553888, 2.4476805548 ],
    [ 1.62895e-06, 2.48942845886, 4.192785694 ],
    [ 1.93252e-06, 1.58538835107, 138.517496871 ],
    [ 1.55321e-06, 3.28425560727, 31.019488637 ],
    [ 1.8228e-06, 2.45335941387, 255.055467798 ],
    [ 1.77846e-06, 4.14773474853, 10175.1525106 ],
    [ 1.74672e-06, 1.53072472355, 329.837066365 ],
    [ 1.37774e-06, 3.34926113123, 0.9632078465 ],
    [ 1.60922e-06, 5.16388154007, 211.81462273 ],
    [ 1.13312e-06, 4.96838153028, 148.078724426 ],
    [ 1.29107e-06, 3.2553937053, 24.1183899573 ],
    [ 1.22785e-06, 5.39724696402, 62.2514255951 ],
    [ 1.07361e-06, 3.2645911301, 1059.38193019 ],
    [ 1.19951e-06, 3.07428550584, 184.727287356 ],
    [ 9.9006e-07, 1.92575084098, 28.5718080822 ],
    [ 9.771e-07, 2.59473517954, 6.592282139 ],
    [ 1.23604e-06, 3.11899453253, 221.375850285 ],
    [ 1.24693e-06, 2.97042402154, 251.432131076 ],
    [ 1.14252e-06, 0.25039919123, 594.650703675 ],
    [ 1.10984e-06, 3.34269023552, 180.273869231 ],
    [ 1.20812e-06, 1.92944484022, 25.6028626656 ],
    [ 1.04667e-06, 0.94883561775, 395.578702239 ],
    [ 1.09779e-06, 5.43147613574, 494.526874873 ],
    [ 9.6919e-07, 0.86184760695, 1014.13534755 ],
    [ 9.8685e-07, 0.89578101892, 488.58898404 ],
    [ 8.8965e-07, 4.78114888597, 144.146571163 ],
    [ 1.07888e-06, 0.98700578434, 1124.34166877 ],
    [ 9.7074e-07, 2.62665185334, 291.704030728 ],
    [ 7.5666e-07, 5.88963758122, 43.2408450685 ],
    [ 9.3718e-07, 6.09873436871, 526.722019678 ],
    [ 9.4822e-07, 0.20662771116, 456.393839236 ],
    [ 6.9954e-07, 2.39614984454, 426.598190876 ],
    [ 8.9656e-07, 3.25464366223, 258.024413215 ],
    [ 7.688e-07, 4.2039418951, 105.492270664 ],
    [ 6.9133e-07, 4.93031154435, 1028.36244155 ],
    [ 9.0474e-07, 1.69635495867, 366.485629295 ],
    [ 7.3446e-07, 3.143052027, 82.8583534146 ],
    [ 5.787e-07, 0.8590265451, 60.7669528868 ],
    [ 7.8695e-07, 1.0930757555, 700.664239201 ],
    [ 5.5696e-07, 3.89047184339, 47.6942631934 ],
    [ 6.3218e-07, 4.39571226649, 149.563197135 ],
    [ 5.6877e-07, 0.81233112899, 2.9207613068 ],
    [ 5.6765e-07, 5.14903738264, 0.5212648618 ],
    [ 5.6174e-07, 5.42986960794, 911.042573332 ],
    [ 6.1746e-07, 6.16453594476, 1019.76442184 ],
    [ 7.0668e-07, 0.08154675285, 40.5807161926 ],
    [ 7.4941e-07, 4.85541117469, 186.211760064 ],
    [ 6.2137e-07, 4.7900016913, 11.0457002639 ],
    [ 6.1135e-07, 0.83712327235, 1022.73336726 ],
    [ 6.1658e-07, 5.70207975404, 178.135005217 ],
    [ 5.3467e-07, 0.37111991212, 27.0873353739 ],
    [ 5.64e-07, 3.52361228973, 216.92243216 ],
    [ 4.8819e-07, 5.10789123481, 64.9597385808 ],
    [ 6.3989e-07, 6.27428332013, 7.1135470008 ],
    [ 6.329e-07, 4.3942491003, 807.949799113 ],
    [ 4.6355e-07, 1.34731122935, 451.940421111 ],
    [ 6.0544e-07, 3.40308211679, 294.672976144 ],
    [ 5.714e-07, 0.44713393582, 140.001969579 ],
    [ 4.6891e-07, 0.16868575852, 7.4223635415 ],
    [ 5.376e-07, 2.796449643, 328.352593657 ],
    [ 5.611e-07, 1.06133412372, 172.197114384 ],
    [ 4.3828e-07, 6.04649305744, 135.548551454 ],
    [ 4.9546e-07, 0.64111181985, 41.0537969446 ],
    [ 5.4352e-07, 2.92484004653, 563.631215038 ],
    [ 4.2962e-07, 5.40180687766, 487.365143763 ],
    [ 5.1507e-07, 0.09101955359, 210.330150021 ],
    [ 4.2022e-07, 3.11630465723, 29.226199388 ],
    [ 4.7855e-07, 3.9092908086, 63.7358983034 ],
    [ 4.1545e-07, 6.27971504434, 32.7164096664 ],
    [ 4.1412e-07, 4.45532728136, 37.1698277913 ],
    [ 4.0691e-07, 0.15392324705, 79.2350166922 ],
    [ 4.8205e-07, 1.8419837301, 403.134192224 ],
    [ 3.6975e-07, 0.44979453927, 30.0562807905 ],
    [ 4.7762e-07, 0.88083849566, 3302.47939106 ],
    [ 3.9465e-07, 3.50565537871, 357.445666601 ],
    [ 4.2139e-07, 0.63375113641, 343.2185726 ],
    [ 4.278e-07, 3.55125610401, 38.6543004996 ],
    [ 3.8995e-07, 5.26486175542, 415.291858181 ],
    [ 3.8872e-07, 5.25715558452, 386.98068253 ],
    [ 4.0508e-07, 1.36656945746, 31.2319369581 ],
    [ 3.3786e-07, 5.23988634904, 67.3592350258 ],
    [ 4.0879e-07, 3.55298595767, 331.321539074 ],
    [ 3.8768e-07, 1.12288359393, 38.1812197476 ],
    [ 3.6962e-07, 6.08599078489, 35.4247226521 ],
    [ 3.8831e-07, 4.67876780698, 38.084851528 ],
    [ 3.8231e-07, 6.26491109393, 389.949627947 ],
    [ 3.1356e-07, 0.07745279153, 12.5301729722 ],
    [ 2.6341e-07, 4.59559782764, 106.013535525 ],
    [ 2.9746e-07, 4.45828452713, 22.633917249 ],
    [ 2.7465e-07, 5.99541587686, 206.185548437 ],
    [ 2.6195e-07, 4.49611532896, 34.2008823747 ],
    [ 2.4122e-07, 5.1708944214, 129.919477162 ],
    [ 2.8998e-07, 3.64928923192, 253.57099509 ],
    [ 2.6787e-07, 4.37969316517, 142.140833593 ],
    [ 3.0385e-07, 1.60122950634, 348.847646892 ],
    [ 2.4285e-07, 1.01980822546, 41.7563723602 ],
    [ 3.1322e-07, 1.05975821421, 100.384461233 ],
    [ 2.2588e-07, 4.7248213782, 81.3738807063 ],
    [ 2.6405e-07, 3.03479369857, 365.001156587 ],
    [ 2.1916e-07, 3.48038797535, 69.1525242748 ],
    [ 2.2498e-07, 4.03487494425, 19.1224551112 ],
    [ 2.1838e-07, 3.92447477596, 5.1078094307 ],
    [ 2.2885e-07, 1.58977064672, 189.393153802 ],
    [ 2.5496e-07, 2.43810677799, 351.816592309 ],
    [ 2.6083e-07, 3.61207095239, 367.970102003 ],
    [ 1.9111e-07, 2.59694457001, 2080.63082474 ],
    [ 1.964e-07, 6.15701741238, 35.212274331 ],
    [ 2.5688e-07, 2.00512719767, 439.782755154 ],
    [ 2.1613e-07, 3.32354204724, 119.506916344 ],
    [ 2.5389e-07, 4.74025836522, 1474.67378837 ],
    [ 1.8107e-07, 5.35129342595, 244.318584075 ],
    [ 2.2539e-07, 4.79833880058, 84.3428261229 ],
    [ 2.3295e-07, 5.93767762095, 316.391869657 ],
    [ 1.6978e-07, 3.05115560279, 220.412642439 ],
    [ 2.0022e-07, 4.99276451168, 179.098213063 ],
    [ 2.037e-07, 1.86508317889, 171.233906537 ],
    [ 2.2628e-07, 0.27205770382, 666.723989257 ],
    [ 1.8427e-07, 3.3935424558, 69.3649725959 ],
    [ 1.9046e-07, 2.02999241631, 5.4166259714 ],
    [ 1.5738e-07, 3.40021239975, 274.066048325 ],
    [ 1.9072e-07, 3.70882976684, 164.120359536 ],
    [ 1.8716e-07, 0.90215956591, 285.37238102 ],
    [ 1.5889e-07, 0.42011285882, 697.743477894 ],
    [ 1.4988e-07, 3.08544843936, 704.857024895 ],
    [ 1.5972e-07, 1.82864185268, 477.330835455 ],
    [ 1.6509e-07, 5.04817895427, 36.9091953604 ],
    [ 1.3892e-07, 2.94161501165, 38.3936680687 ],
    [ 1.4019e-07, 2.8606104905, 37.8724032069 ],
    [ 1.5302e-07, 4.94041289914, 101.868933941 ],
    [ 1.7397e-07, 5.81486997282, 35.685355083 ],
    [ 1.7379e-07, 2.51842240176, 20.6069278195 ],
    [ 1.6416e-07, 3.63037693563, 45.2465826386 ],
    [ 1.2943e-07, 3.03051173423, 522.577418094 ],
    [ 1.5752e-07, 5.00292909214, 247.239345382 ],
    [ 1.4362e-07, 5.49004892867, 39.3568759152 ],
    [ 1.2679e-07, 0.20331109323, 460.53844082 ],
    [ 1.626e-07, 5.93480347217, 815.063346114 ],
    [ 1.29e-07, 3.51131840632, 446.311346818 ],
    [ 1.3891e-07, 5.51064697666, 31.5407534988 ],
    [ 1.577e-07, 3.77930539694, 404.618664933 ],
    [ 1.3399e-07, 3.96033558345, 290.219558019 ],
    [ 1.5368e-07, 2.45783892707, 26.826702943 ],
    [ 1.4246e-07, 3.18588280921, 401.649719516 ],
    [ 1.2199e-07, 4.94365391256, 14.0146456805 ],
    [ 1.4368e-07, 4.93297486962, 120.991389052 ],
    [ 1.3413e-07, 3.79142222247, 151.047669843 ],
    [ 1.2073e-07, 2.92823577017, 2.7083129857 ],
    [ 1.412e-07, 4.69411530315, 738.797274839 ],
    [ 1.1566e-07, 5.91003538993, 536.804512095 ],
    [ 1.5578e-07, 2.91836788254, 875.830299001 ],
    [ 1.3125e-07, 2.16051328657, 152.532142551 ],
    [ 1.2793e-07, 1.97868575679, 1.3725981237 ],
    [ 1.4101e-07, 4.75302563115, 0.2606324309 ],
    [ 1.2967e-07, 0.0053347154, 97.4155158163 ],
    [ 1.0788e-07, 6.18639055862, 115.883579622 ],
    [ 1.3729e-07, 2.3230647385, 38.2449102224 ],
    [ 1.1606e-07, 4.61702427262, 178.789396523 ],
    [ 1.1256e-07, 0.79281130068, 42.3258213318 ],
    [ 1.45e-07, 5.4468870718, 44.070926471 ],
    [ 1.1534e-07, 5.26580538005, 160.938965799 ],
    [ 1.3411e-07, 5.17996944056, 32.4557772355 ],
    [ 1.3658e-07, 2.15687632802, 476.431318084 ],
    [ 1.2788e-07, 2.07356149992, 20.4950532349 ],
    [ 1.3782e-07, 3.47865209163, 38.0211610532 ],
    [ 1.3257e-07, 5.1513852948, 103.092774219 ],
    [ 9.715e-08, 0.7459788348, 918.156120333 ],
    [ 1.0378e-07, 5.38520350123, 222.860322994 ],
    [ 1.3357e-07, 5.89635739027, 748.097869963 ],
    [ 1.2632e-07, 1.20306997433, 16.1535096946 ],
    [ 1.1437e-07, 1.58444114292, 495.49008272 ],
    [ 1.1424e-07, 4.74142930795, 487.625776194 ],
    [ 9.336e-08, 0.9731363095, 662.531203563 ],
    [ 8.911e-08, 5.21180580479, 118.022443636 ],
    [ 9.827e-08, 4.48170250645, 505.785023458 ],
    [ 1.1615e-07, 3.09644428293, 17.6379824029 ],
    [ 9.957e-08, 4.03258124099, 169.536985508 ],
    [ 9.818e-08, 5.20376439002, 1.5963472929 ],
    [ 1.016e-07, 3.74441320429, 457.617679513 ],
    [ 8.661e-08, 0.31247523804, 1440.73353843 ],
    [ 8.496e-08, 1.06445636872, 55.7710180407 ],
    [ 1.1162e-07, 1.9290782234, 564.855055316 ],
    [ 8.434e-08, 5.55699081873, 17.5261078183 ],
    [ 8.057e-08, 0.31116345866, 377.419454974 ],
    [ 1.007e-07, 3.92554977184, 441.267227862 ],
    [ 7.77e-08, 0.14603509444, 944.982823276 ],
    [ 7.938e-08, 2.40417397694, 488.376535719 ],
    [ 9.894e-08, 0.63707319139, 183.764079509 ],
    [ 7.633e-08, 2.25662443193, 79.1868325824 ],
    [ 7.867e-08, 3.87469522964, 494.739323195 ],
    [ 9.203e-08, 4.3660584197, 29.7474642498 ],
    [ 9.716e-08, 3.06038536864, 166.568040091 ],
    [ 9.377e-08, 0.56416645296, 673.316271396 ],
    [ 8.771e-08, 5.24535317574, 1057.89745748 ],
    [ 8.225e-08, 5.42577676109, 104.007797955 ],
    [ 8.367e-08, 0.48337087236, 19.0105805266 ],
    [ 9.82e-08, 5.88955818086, 358.408874448 ],
    [ 7.009e-08, 2.93493492342, 0.0481841098 ],
    [ 8.254e-08, 3.47304582051, 156.155479274 ],
    [ 7.684e-08, 1.53844437652, 59.2824801785 ],
    [ 9.804e-08, 6.06393995615, 784.746432893 ],
    [ 8.516e-08, 5.99059807952, 180.795134093 ],
    [ 8.09e-08, 1.38588221442, 1654.03263386 ],
    [ 9.074e-08, 4.0397149046, 1017.05610886 ],
    [ 6.908e-08, 1.41919832926, 178.347453538 ],
    [ 8.713e-08, 0.35913477738, 636.667708467 ],
    [ 8.23e-08, 2.53750470473, 518.3846324 ],
    [ 8.594e-08, 5.29103584901, 457.878311944 ],
    [ 6.769e-08, 5.43380191356, 171.984666062 ],
    [ 8.995e-08, 1.36992508507, 6209.77872413 ],
    [ 9.278e-08, 3.80308677009, 25558.2121765 ],
    [ 6.562e-08, 3.13520633691, 416.77633089 ],
    [ 6.567e-08, 4.01934954352, 0.1118745846 ],
    [ 7.032e-08, 4.14454482953, 326.868120949 ],
    [ 8.384e-08, 5.49363770202, 532.611726401 ],
    [ 7.471e-08, 4.62144262894, 526.982652109 ],
    [ 7.5e-08, 0.61545750834, 485.928855164 ],
    [ 7.716e-08, 1.04880061527, 525.23754697 ],
    [ 8.504e-08, 2.79350586429, 10139.9884204 ],
    [ 8.006e-08, 5.70274817349, 209.106309744 ],
    [ 7.58e-08, 5.07865976334, 157.639951982 ],
    [ 7.186e-08, 6.22843514949, 77.2292791221 ],
    [ 7.754e-08, 4.25725025641, 418.260803598 ],
    [ 7.784e-08, 1.89308086046, 984.600331622 ],
    [ 6.06e-08, 4.25541364939, 36.1272980677 ],
    [ 6.513e-08, 0.07498932215, 79.889407998 ],
    [ 6.05e-08, 2.97979060439, 36.6967470393 ],
    [ 7.265e-08, 4.94483532763, 131.40394987 ],
    [ 6.984e-08, 2.53239305821, 497.187003749 ],
    [ 7.824e-08, 2.31462643851, 513.079881013 ],
    [ 7.175e-08, 3.69203633127, 524.013706692 ],
    [ 6.855e-08, 0.14076801572, 283.62727588 ],
    [ 7.476e-08, 5.27896188334, 259.508885923 ],
    [ 6.922e-08, 3.36515011915, 438.298282446 ],
    [ 7.349e-08, 3.50406958122, 500.155949166 ],
    [ 6.301e-08, 0.14776691217, 608.877797677 ],
    [ 5.892e-08, 4.24403528888, 4.665866446 ],
    [ 5.995e-08, 4.84848023982, 215.437959452 ],
    [ 7.128e-08, 5.92696788834, 482.959909748 ],
    [ 6.829e-08, 1.01745137848, 1543.82631265 ],
    [ 6.817e-08, 6.1216282969, 395.057437377 ],
    [ 5.369e-08, 3.76855960849, 52099.5402119 ],
    [ 5.776e-08, 5.61434462641, 987.569277038 ],
    [ 7.523e-08, 5.60432148128, 2810.92146161 ],
    [ 7.329e-08, 3.76816058312, 1512.80682401 ],
    [ 5.616e-08, 2.1387418697, 145.631043871 ],
    [ 5.26e-08, 0.35171132812, 36.6003788197 ],
    [ 5.366e-08, 2.33827486119, 65.2203710117 ],
    [ 5.688e-08, 1.82274388581, 1227.43444299 ],
    [ 5.658e-08, 2.35049199704, 5.6290742925 ],
    [ 6.135e-08, 4.23390394127, 496.011347582 ],
    [ 6.472e-08, 3.49494191669, 552.697389359 ],
    [ 4.983e-08, 3.91958511552, 10135.5350022 ],
    [ 5.071e-08, 2.99193131986, 313.683556671 ],
    [ 5.964e-08, 5.70758449643, 309.799587518 ],
    [ 4.83e-08, 1.15390722082, 134.064078746 ],
    [ 5.091e-08, 6.00974510144, 1409.71404979 ],
    [ 5.205e-08, 5.5027133451, 238.901958104 ],
    [ 5.33e-08, 0.31491843987, 319.312630963 ],
    [ 4.943e-08, 1.43051344597, 422.405405182 ],
    [ 5.604e-08, 2.05669305961, 207.361204605 ],
    [ 6.31e-08, 5.22966882627, 139.741337148 ],
    [ 4.773e-08, 3.06677020431, 464.731226514 ],
    [ 4.867e-08, 1.45874544328, 49.1787359017 ],
    [ 4.919e-08, 3.57280542629, 52175.8062831 ],
    [ 6.33e-08, 5.80748895304, 57.255490749 ],
    [ 4.762e-08, 5.90654311203, 838.96928775 ],
    [ 4.848e-08, 0.77467099227, 1.6969210294 ],
    [ 5.694e-08, 0.77313415569, 709.964834325 ],
    [ 5.455e-08, 0.90288890561, 208.845677313 ],
    [ 4.901e-08, 3.79986913631, 15.4991183888 ],
    [ 4.772e-08, 0.15755140037, 39.5056337615 ],
    [ 5.673e-08, 2.68359159067, 1127.26243008 ],
    [ 5.477e-08, 0.53123497431, 113.877842052 ],
    [ 5.077e-08, 1.59268428609, 1547.97091423 ],
    [ 4.981e-08, 1.44584050478, 1.2720243872 ],
    [ 5.938e-08, 0.96886308551, 6280.10690457 ],
    [ 5.206e-08, 3.5800381937, 474.946845375 ],
    [ 5.256e-08, 0.61005270999, 95.9792272178 ],
    [ 5.531e-08, 5.28764137194, 36.7604375141 ],
    [ 5.938e-08, 0.65008179576, 6.9010986797 ],
    [ 6.158e-08, 5.73176703797, 711.449307034 ],
    [ 5.15e-08, 5.58407480282, 26049.7701059 ],
    [ 5.138e-08, 4.55234158942, 670.916774951 ],
    [ 5.609e-08, 4.3727275978, 52.8020726241 ],
    [ 5.636e-08, 2.39183054397, 10210.3166008 ],
    [ 5.004e-08, 4.99992587162, 421.229749014 ],
    [ 4.512e-08, 2.59978208967, 1234.54798999 ],
    [ 4.314e-08, 3.38846714337, 142.662098455 ],
    [ 4.471e-08, 3.94378336812, 12566.1517 ],
    [ 5.296e-08, 1.12249063176, 134.112262856 ],
    [ 4.188e-08, 2.52490407427, 6205.32530601 ],
    [ 4.645e-08, 1.90644271528, 13324.3166712 ],
    [ 4.501e-08, 2.01956232903, 315.168029379 ],
    [ 4.177e-08, 2.09489065926, 803.757013419 ],
    [ 4.675e-08, 2.19237385948, 501.640421874 ],
    [ 5.296e-08, 3.88249567974, 2118.76386038 ],
    [ 5.325e-08, 4.28221258353, 477.915790792 ],
    [ 5.519e-08, 0.09960657331, 600.019145537 ],
    [ 4.179e-08, 0.14619703083, 6644.57629047 ],
    [ 4.49e-08, 1.07042724999, 52139.1577202 ],
    [ 3.97e-08, 6.13227798578, 1553.90880506 ],
    [ 5.183e-08, 3.52837189121, 110.206321219 ],
    [ 5.259e-08, 6.20809827528, 142.710282565 ],
    [ 4.183e-08, 5.17141470503, 3.6233367224 ],
    [ 4.196e-08, 0.14530465304, 65.8747623175 ],
    [ 3.869e-08, 5.25125030487, 1558.05340665 ],
    [ 4.457e-08, 2.10247889113, 487.104511332 ],
    [ 4.893e-08, 1.83678005941, 46.5186070258 ],
    [ 3.875e-08, 5.60271074608, 385.496209822 ],
    [ 3.826e-08, 1.30946706974, 2176.61005196 ],
    [ 4.591e-08, 4.84657580441, 1337.64076421 ],
    [ 3.928e-08, 4.81049906938, 91.7864415238 ],
    [ 5.111e-08, 1.18808726579, 981.631386205 ],
    [ 4.709e-08, 1.40878215308, 52213.9393188 ],
    [ 3.891e-08, 5.43661875415, 154.671006565 ],
    [ 4.145e-08, 4.32505910718, 363.516683878 ],
    [ 3.926e-08, 1.42639045134, 70.8494453042 ],
    [ 4.04e-08, 5.2612175946, 80.7194894005 ],
    [ 3.885e-08, 1.55337878207, 310.714611254 ],
    [ 4.787e-08, 3.65822147476, 589.345952289 ],
    [ 4.02e-08, 5.45643059988, 6641.60734505 ],
    [ 4.288e-08, 3.35265955957, 203.216603021 ],
    [ 4.462e-08, 2.86966056442, 353.040432586 ],
    [ 4.657e-08, 3.60514658478, 187.696232772 ],
    [ 3.767e-08, 0.05292047125, 320.27583881 ],
    [ 4.632e-08, 0.82011276589, 3265.83082813 ],
    [ 4.555e-08, 5.30391170376, 26013.121543 ],
    [ 3.555e-08, 4.80240768951, 224.344795702 ],
    [ 3.967e-08, 1.01381988824, 75.7448064138 ],
    [ 4.302e-08, 1.60914544159, 12529.5031371 ],
    [ 3.493e-08, 4.75315651083, 12489.8856287 ],
    [ 3.722e-08, 0.27433061822, 949.436241401 ],
    [ 3.722e-08, 4.61537211162, 1025.70231268 ],
    [ 4.234e-08, 5.25112033465, 194.288514911 ],
    [ 4.796e-08, 6.21059766333, 491.818561888 ],
    [ 3.639e-08, 1.25605018211, 2603.20824283 ],
    [ 4.646e-08, 5.71392664345, 321.760311518 ],
    [ 4.523e-08, 4.6281260806, 179.619477925 ],
    [ 3.702e-08, 2.08952561657, 491.036664595 ],
    [ 3.433e-08, 5.69102402866, 419.484643875 ],
    [ 3.672e-08, 2.87489628704, 497.49582029 ],
    [ 3.428e-08, 5.70553310685, 491.669804041 ],
    [ 4.513e-08, 4.3893109634, 425.113718168 ],
    [ 3.404e-08, 0.57791231752, 491.446054872 ],
    [ 3.853e-08, 0.61321572401, 12526.5341916 ],
    [ 3.788e-08, 3.3222199584, 3140.01275493 ],
    [ 3.781e-08, 5.58125317044, 1652.54816116 ],
    [ 3.903e-08, 5.31609723466, 408.17831118 ],
    [ 3.945e-08, 3.60558877186, 1589.07289528 ],
    [ 4.299e-08, 5.24473992747, 296.157448853 ],
    [ 4.084e-08, 0.83813879869, 52.3601296394 ],
    [ 4.084e-08, 3.50290269471, 23.9059416362 ],
    [ 4.552e-08, 1.80974055684, 73.5577582899 ],
    [ 3.336e-08, 2.4141367832, 67.8804998876 ],
    [ 3.636e-08, 5.31067380234, 141.486442287 ],
    [ 3.345e-08, 3.94392179077, 20389.9225295 ],
    [ 4.639e-08, 6.24618220184, 821.394995822 ],
    [ 3.934e-08, 0.26992234338, 1655.51710657 ],
    [ 4.431e-08, 2.486474378, 549.728443943 ],
    [ 4.168e-08, 5.39993754642, 236.502461659 ],
    [ 3.316e-08, 0.82217489269, 305.085536962 ],
    [ 4.524e-08, 5.52532381522, 487.413327873 ],
    [ 4.02e-08, 0.07393243012, 52136.1887748 ],
    [ 3.275e-08, 0.98533127454, 1344.75431121 ],
    [ 3.213e-08, 2.97105590703, 20386.9535841 ],
    [ 4.065e-08, 5.41027187466, 332.806011782 ],
    [ 3.183e-08, 2.98783802386, 499.634684304 ],
    [ 4.428e-08, 0.06728869735, 491.297297026 ],
    [ 4.063e-08, 0.0619283857, 6168.67674308 ],
    [ 3.53e-08, 3.13717614844, 347.363174184 ],
    [ 3.917e-08, 1.33801660176, 1054.92851206 ],
    [ 3.917e-08, 5.67905809516, 1131.19458334 ],
    [ 3.833e-08, 0.87811168267, 52.6901980395 ],
    [ 4.02e-08, 2.69209723289, 1439.46151404 ],
    [ 3.424e-08, 1.0329673702, 481.475437039 ],
    [ 3.159e-08, 1.04693380342, 703.372552187 ],
    [ 3.364e-08, 2.18084331708, 32.5039613453 ],
    [ 3.258e-08, 4.65131076542, 696.259005186 ],
    [ 3.427e-08, 0.27003884843, 2389.9091474 ],
    [ 4.349e-08, 0.07531141761, 20426.5710924 ],
    [ 3.383e-08, 5.61838426864, 699.227950602 ],
    [ 3.305e-08, 1.4166687729, 562.14674233 ],
    [ 3.297e-08, 5.46677712589, 1442.21801113 ],
    [ 3.277e-08, 2.71815883511, 980.146913497 ],
    [ 3.171e-08, 4.49510885866, 1439.24906572 ],
    [ 4.175e-08, 4.24327636055, 381.612240668 ],
    [ 3.155e-08, 3.40776789576, 39.7293829307 ],
    [ 4.112e-08, 0.90309319273, 1087.69310584 ],
    [ 3.05e-08, 5.01538526352, 8.9068362498 ],
    [ 3.725e-08, 1.52448613082, 1058.1099058 ],
    [ 3.65e-08, 3.59798316565, 192.804042203 ],
    [ 3.837e-08, 1.48519528444, 10098.8864393 ],
    [ 2.959e-08, 1.23012121982, 2500.11546862 ],
    [ 3.33e-08, 6.12470287875, 10172.1835652 ],
    [ 3.361e-08, 4.31837298696, 492.079194319 ],
    [ 3.294e-08, 2.52694043155, 1692.1656695 ],
    [ 3.013e-08, 0.92957285991, 1515.77576942 ],
    [ 3.403e-08, 1.10932483984, 987.308644608 ],
    [ 3.312e-08, 0.67710158807, 977.486784621 ],
    [ 3.03e-08, 1.77996261146, 156489.285814 ],
    [ 3.605e-08, 4.89955108152, 1043.8828118 ],
    [ 3.276e-08, 4.26765608367, 1189.30140735 ],
    [ 2.966e-08, 5.29808076929, 31.9826964835 ],
    [ 2.994e-08, 2.58599359402, 178.086821107 ],
    [ 3.905e-08, 1.87748122254, 1158.28191871 ],
    [ 3.11e-08, 3.09203517638, 235.933012687 ],
    [ 3.313e-08, 2.70308129756, 604.472563662 ],
    [ 3.276e-08, 1.24440460327, 874.654642833 ],
    [ 3.276e-08, 5.58544609667, 950.920714109 ],
    [ 2.863e-08, 5.3079720203, 449.232108125 ],
    [ 3.746e-08, 0.33859914037, 913.963334639 ],
    [ 3.552e-08, 3.07180917863, 240.386430812 ],
    [ 2.885e-08, 6.01129889094, 1097.51496583 ],
    [ 3.643e-08, 5.11977873355, 452.201053542 ],
    [ 2.761e-08, 4.05534163585, 6283.07584999 ],
    [ 3.226e-08, 4.76711354367, 6241.97386894 ],
    [ 2.988e-08, 5.62906786113, 140.656360885 ],
    [ 3.748e-08, 4.84009347869, 341.734099891 ],
    [ 3.847e-08, 2.40982343643, 26086.4186689 ],
    [ 2.702e-08, 3.72061244391, 946.467295984 ],
    [ 2.846e-08, 4.90997675486, 488.849616471 ],
    [ 2.723e-08, 4.37517047024, 15.1903018481 ],
    [ 2.847e-08, 5.22951186538, 661.046730855 ],
    [ 2.68e-08, 4.19379121323, 13.184564278 ],
    [ 3.269e-08, 0.4311977852, 496.974555428 ],
    [ 2.878e-08, 5.00361557843, 252.086522382 ],
    [ 3.489e-08, 3.82213189319, 625.994515218 ],
    [ 3.742e-08, 2.03372773652, 8.5980197091 ],
    [ 3.341e-08, 2.91360557418, 304.2342037 ],
    [ 2.915e-08, 2.63627684599, 6681.2248534 ],
    [ 2.915e-08, 1.4377362589, 6604.95878212 ],
    [ 2.629e-08, 2.0982440745, 2713.41456405 ],
    [ 2.901e-08, 3.3392480023, 515.463871093 ],
    [ 2.803e-08, 1.23584865903, 6643.09181776 ],
    [ 2.621e-08, 3.27309087943, 483.481174609 ],
    [ 3.045e-08, 3.33515866438, 921.07688164 ],
    [ 2.699e-08, 5.4259779465, 925.269667334 ],
    [ 2.808e-08, 5.77870303237, 1024.21783997 ],
    [ 3.028e-08, 3.75501312393, 511.595408305 ],
    [ 3.09e-08, 2.49453093252, 14.6690369863 ],
    [ 2.63e-08, 0.62190616803, 990.229405914 ],
    [ 2.913e-08, 4.83296711477, 515.936951845 ],
    [ 3.139e-08, 5.9913425471, 570.744762039 ],
    [ 2.752e-08, 3.08268180744, 853.196381752 ],
    [ 2.643e-08, 1.99093797444, 470.217288454 ],
    [ 2.763e-08, 4.01095972177, 448.971475694 ],
    [ 3.426e-08, 4.73955481174, 1050.9963588 ],
    [ 2.613e-08, 5.04769883328, 175.21424391 ],
    [ 3.08e-08, 1.08651068269, 260.993358631 ],
    [ 2.605e-08, 1.78290020063, 175.11787569 ],
    [ 2.573e-08, 2.01267457287, 1514.29129672 ],
    [ 2.633e-08, 1.63639954931, 170.712641675 ],
    [ 3.025e-08, 5.51446170055, 369.454574712 ],
    [ 2.49e-08, 0.15301603966, 78187.4433534 ],
    [ 2.589e-08, 0.79196093766, 1228.9189157 ],
    [ 3.493e-08, 3.8800673873, 495.702531041 ],
    [ 3.143e-08, 5.33170343283, 1542.34183994 ],
    [ 2.816e-08, 3.74486418363, 2.0057375701 ],
    [ 3.062e-08, 4.88018345098, 227.968132424 ],
    [ 2.971e-08, 1.27359129352, 530.914805372 ],
    [ 3.329e-08, 2.71693827722, 171.021458216 ],
    [ 2.648e-08, 0.6030438692, 70.5888128733 ],
    [ 3.061e-08, 5.05044834864, 378.643295252 ],
    [ 2.738e-08, 4.75405645015, 151.260118164 ],
    [ 2.727e-08, 5.89140709596, 213.953486744 ],
    [ 3.411e-08, 2.24137878065, 734.455731298 ],
    [ 2.623e-08, 0.54340876464, 1586.10394987 ],
    [ 3.169e-08, 5.84871429991, 1049.51188609 ],
    [ 2.43e-08, 2.34597429597, 450.455948402 ],
    [ 2.907e-08, 5.58085498481, 597.571464982 ],
    [ 3.06e-08, 5.27973140962, 523.753074261 ],
    [ 3.3e-08, 0.94221473935, 58.1705144857 ],
    [ 2.606e-08, 4.76989264753, 391.434100655 ],
    [ 3.175e-08, 2.32600231924, 339.286419336 ],
    [ 3.112e-08, 4.24784219323, 1615.89959823 ],
    [ 3.34e-08, 1.36950315448, 384.272369544 ],
    [ 3.301e-08, 5.83023910521, 51.7751743028 ],
    [ 2.415e-08, 0.6944692367, 489.552191887 ],
    [ 3.31e-08, 5.55595218696, 674.800744104 ],
    [ 2.736e-08, 5.74320864965, 1167.84314627 ],
    [ 2.956e-08, 5.22962139507, 199.853898729 ],
    [ 3.262e-08, 0.01501002027, 1545.31078535 ],
    [ 2.506e-08, 4.84043333582, 943.498350567 ],
    [ 3.24e-08, 2.46676155925, 1016.79547643 ],
    [ 3.148e-08, 4.62079057738, 233.533516242 ],
    [ 2.327e-08, 4.10421417326, 70.1157321213 ],
    [ 2.371e-08, 4.79963943424, 271.145287018 ],
    [ 3.006e-08, 3.66877796077, 1476.15826108 ],
    [ 3.033e-08, 0.6715748869, 292.48592802 ],
    [ 2.344e-08, 1.83547256266, 492.308688982 ],
    [ 3.117e-08, 2.76268894894, 1473.18931566 ],
    [ 2.323e-08, 2.88799980853, 533.623118358 ],
    [ 2.34e-08, 4.44862573253, 490.807169931 ],
    [ 2.919e-08, 4.75889516601, 1511.3223513 ],
    [ 2.493e-08, 6.10541658597, 1225.94997028 ],
    [ 2.691e-08, 3.20679023131, 463.507386236 ],
    [ 2.291e-08, 5.81535163158, 246.978712951 ],
    [ 2.319e-08, 6.0551428147, 525.758811831 ],
    [ 3.112e-08, 0.89712836583, 314.907396948 ],
    [ 3.085e-08, 5.84605938859, 1192.22216866 ],
    [ 2.897e-08, 0.54747024257, 20350.3050211 ],
    [ 2.469e-08, 3.75373347656, 494.005610012 ],
    [ 3.067e-08, 2.22210324061, 248.463185659 ],
    [ 2.252e-08, 0.87483094907, 61.0275853177 ],
    [ 2.392e-08, 3.62837597194, 439.197799817 ],
    [ 2.817e-08, 2.73562306571, 16.6747745564 ],
    [ 2.379e-08, 6.17876088396, 467.651987821 ],
    [ 2.607e-08, 4.82656583469, 384.581186085 ],
    [ 2.718e-08, 1.01823841209, 215.959224314 ],
    [ 2.998e-08, 1.097557153, 1964.74724512 ],
    [ 2.883e-08, 2.97813866507, 383.096713377 ],
    [ 2.529e-08, 5.81554218602, 1587.58842258 ],
    [ 2.203e-08, 2.23336308907, 481.262988718 ],
    [ 2.26e-08, 2.3540491366, 659.610442256 ],
    [ 2.173e-08, 4.95048919972, 76.7873361374 ],
    [ 2.491e-08, 1.7023635707, 445.348138972 ],
    [ 2.164e-08, 4.91477263756, 249.947658367 ],
    [ 2.289e-08, 1.18497528002, 1552.42433235 ],
    [ 2.975e-08, 0.48272389481, 1052.48083151 ],
    [ 2.339e-08, 0.75318738767, 478.815308163 ],
    [ 3.011e-08, 0.16359500858, 54.2865453324 ],
    [ 3.011e-08, 1.03494557852, 21.9795259432 ]
];

KMG.VSOPTerms.neptune_R1 = [
    [ 0.00236338618, 0.70497954792, 38.1330356378 ],
    [ 0.00013220034, 3.3201438793, 1.4844727083 ],
    [ 8.621779e-05, 6.21626927537, 35.1640902212 ],
    [ 2.701587e-05, 1.88124996531, 39.6175083461 ],
    [ 2.15306e-05, 5.16877044933, 76.2660712756 ],
    [ 2.15417e-05, 2.0943033339, 2.9689454166 ],
    [ 1.463314e-05, 1.18410155089, 33.6796175129 ],
    [ 1.603164e-05, 0, 0 ],
    [ 1.135663e-05, 3.91905853528, 36.6485629295 ],
    [ 8.9765e-06, 5.24122933533, 388.465155238 ],
    [ 7.89359e-06, 0.53295000718, 168.052512799 ],
    [ 7.6003e-06, 0.02051033644, 182.279606801 ],
    [ 6.07183e-06, 1.0770650035, 1021.24889455 ],
    [ 5.71622e-06, 3.40060785432, 484.444382456 ],
    [ 5.6079e-06, 2.88685815667, 498.671476458 ],
    [ 4.89973e-06, 3.46822250901, 137.033024162 ],
    [ 2.64197e-06, 0.86149368602, 4.4534181249 ],
    [ 2.70304e-06, 3.27489604455, 71.8126531507 ],
    [ 2.03512e-06, 2.41823214253, 32.1951448046 ],
    [ 1.5518e-06, 0.36515053081, 41.1019810544 ],
    [ 1.32766e-06, 3.60157672619, 9.5612275556 ],
    [ 9.3942e-07, 0.66658493388, 46.2097904851 ],
    [ 8.3697e-07, 3.26305475932, 98.8999885246 ],
    [ 7.2205e-07, 4.47717435693, 601.764250676 ],
    [ 6.8777e-07, 1.46946530374, 74.7815985673 ],
    [ 8.6953e-07, 5.77228651853, 381.351608237 ],
    [ 6.8138e-07, 4.52508272214, 70.3281804424 ],
    [ 6.525e-07, 3.85934463923, 73.297125859 ],
    [ 6.837e-07, 3.395139944, 108.46121608 ],
    [ 5.3375e-07, 5.43650770516, 395.578702239 ],
    [ 4.391e-07, 3.6156439495, 2.4476805548 ],
    [ 4.1546e-07, 4.74846317654, 8.0767548473 ],
    [ 4.8724e-07, 1.98932271543, 175.1660598 ],
    [ 4.1744e-07, 4.94257598763, 31.019488637 ],
    [ 4.4102e-07, 1.41744904844, 1550.93985965 ],
    [ 4.117e-07, 1.41999405024, 490.073456749 ],
    [ 4.1099e-07, 4.86312668872, 493.042402165 ],
    [ 3.6267e-07, 5.30764043577, 312.199083963 ],
    [ 3.6321e-07, 0.38296932117, 77.7505439839 ],
    [ 4.0928e-07, 2.27526815371, 529.690965095 ],
    [ 3.2141e-07, 5.9128587434, 5.9378908332 ],
    [ 3.1197e-07, 2.70549944134, 1014.13534755 ],
    [ 3.273e-07, 5.22147683115, 41.0537969446 ],
    [ 3.6035e-07, 4.88125211442, 491.557929457 ],
    [ 2.9991e-07, 3.30769367603, 1028.36244155 ],
    [ 2.9424e-07, 3.63261469286, 30.7106720963 ],
    [ 2.7478e-07, 1.76175718511, 44.7253177768 ],
    [ 2.7676e-07, 4.54801642564, 7.1135470008 ],
    [ 2.7475e-07, 0.97228280623, 33.9402499438 ],
    [ 2.4944e-07, 3.10083196356, 144.146571163 ],
    [ 2.5956e-07, 2.99728316628, 60.7669528868 ],
    [ 2.1401e-07, 0.68033795793, 251.432131076 ],
    [ 2.1369e-07, 4.71270048898, 278.258834019 ],
    [ 2.3818e-07, 5.11019967861, 176.650532508 ],
    [ 2.4486e-07, 3.56527493795, 145.10977901 ],
    [ 2.3379e-07, 1.65568321349, 173.681587092 ],
    [ 2.7004e-07, 4.13984627053, 453.424893819 ],
    [ 2.0725e-07, 0.89222104366, 4.192785694 ],
    [ 1.9795e-07, 5.61602288526, 24.1183899573 ],
    [ 2.3863e-07, 0.99001670827, 213.299095438 ],
    [ 1.8408e-07, 1.98233778039, 72.0732855816 ],
    [ 1.8266e-07, 6.17260374467, 189.393153802 ],
    [ 1.896e-07, 4.66648698212, 106.976743372 ],
    [ 1.7705e-07, 1.59531409128, 62.2514255951 ],
    [ 1.5648e-07, 3.64570115017, 0.5212648618 ],
    [ 1.6368e-07, 1.70913999198, 357.445666601 ],
    [ 2.0132e-07, 3.295219611, 114.399106913 ],
    [ 1.5425e-07, 4.38812302799, 25.6028626656 ],
    [ 1.8932e-07, 2.21630439663, 343.2185726 ],
    [ 1.4031e-07, 0.55320290294, 129.919477162 ],
    [ 1.4328e-07, 5.84024214567, 68.8437077341 ],
    [ 1.5466e-07, 4.20417846946, 567.824000732 ],
    [ 1.2746e-07, 3.52815836608, 477.330835455 ],
    [ 1.1724e-07, 5.5764726346, 31.2319369581 ],
    [ 1.1533e-07, 0.89138506506, 594.650703675 ],
    [ 1.0508e-07, 4.35552732772, 32.7164096664 ],
    [ 1.0777e-07, 5.30551078064, 2.9207613068 ],
    [ 1.0826e-07, 5.21826226871, 26.826702943 ],
    [ 1.0084e-07, 1.98102236804, 40.5807161926 ],
    [ 1.1686e-07, 5.14865195162, 42.5864537627 ],
    [ 9.207e-08, 0.50092534158, 64.9597385808 ],
    [ 9.084e-08, 5.86031317808, 6.592282139 ],
    [ 9.231e-08, 0.6818097771, 160.938965799 ],
    [ 1.0114e-07, 4.51164596686, 28.5718080822 ],
    [ 8.35e-08, 2.82449631025, 43.2408450685 ],
    [ 9.592e-08, 3.76289614986, 181.758341939 ],
    [ 9.969e-08, 1.45995045237, 47.6942631934 ],
    [ 7.946e-08, 2.40126769187, 11.0457002639 ],
    [ 7.629e-08, 1.57125741752, 135.548551454 ],
    [ 7.645e-08, 4.07503370297, 389.949627947 ],
    [ 8.004e-08, 2.78082277326, 505.785023458 ],
    [ 9.45e-08, 0.27241260289, 426.598190876 ],
    [ 7.192e-08, 0.82841201068, 911.042573332 ],
    [ 6.981e-08, 1.86764180939, 206.185548437 ],
    [ 7.897e-08, 1.86554246391, 38.6543004996 ],
    [ 6.766e-08, 0.85749934506, 82.8583534146 ],
    [ 6.357e-08, 0.90093123522, 487.365143763 ],
    [ 6.72e-08, 1.33936767947, 220.412642439 ],
    [ 6.344e-08, 4.04005545219, 12.5301729722 ],
    [ 7.695e-08, 5.13312500855, 23.9059416362 ],
    [ 7.059e-08, 5.99832463478, 639.897286314 ],
    [ 8.302e-08, 3.85960902325, 37.611770776 ],
    [ 6.412e-08, 2.41743840961, 1059.38193019 ],
    [ 6.751e-08, 1.9686089447, 45.2465826386 ],
    [ 6.301e-08, 4.04821192714, 35.685355083 ],
    [ 5.517e-08, 3.8132579089, 815.063346114 ],
    [ 5.562e-08, 0.41619602113, 563.631215038 ],
    [ 6.115e-08, 2.10934525342, 697.743477894 ],
    [ 6.216e-08, 4.79301628209, 143.625306301 ],
    [ 5.346e-08, 3.13071964722, 386.98068253 ],
    [ 6.866e-08, 0.62766858525, 350.3321196 ],
    [ 5.245e-08, 6.06245070403, 171.233906537 ],
    [ 5.129e-08, 0.79394555531, 179.098213063 ],
    [ 5.099e-08, 2.96677243218, 27.0873353739 ],
    [ 5.169e-08, 6.18160132142, 63.7358983034 ],
    [ 5.168e-08, 4.7376553637, 522.577418094 ],
    [ 5.006e-08, 2.37645082899, 77.2292791221 ],
    [ 5.005e-08, 4.70632786719, 460.53844082 ],
    [ 5.167e-08, 5.20246890403, 446.311346818 ],
    [ 5.119e-08, 2.17338058771, 494.739323195 ],
    [ 5.025e-08, 4.21265519443, 536.804512095 ],
    [ 5.125e-08, 5.38138329172, 179.310661384 ],
    [ 4.918e-08, 4.09031782903, 488.376535719 ],
    [ 4.711e-08, 5.56542374115, 42.3258213318 ],
    [ 4.459e-08, 1.3078482983, 69.3649725959 ],
    [ 5.485e-08, 3.88088464259, 218.406904869 ],
    [ 4.419e-08, 4.22946309121, 5.4166259714 ],
    [ 4.559e-08, 4.92224120952, 285.37238102 ],
    [ 4.687e-08, 2.2140115321, 1029.84691426 ],
    [ 4.644e-08, 1.87902594973, 1433.61999143 ],
    [ 5.639e-08, 3.05597013393, 983.115858914 ],
    [ 4.317e-08, 1.37172516583, 0.9632078465 ],
    [ 4.385e-08, 2.35709104539, 84.3428261229 ],
    [ 4.43e-08, 3.37768805833, 377.419454974 ],
    [ 4.681e-08, 2.14249250241, 97.4155158163 ],
    [ 5.845e-08, 4.62301099402, 1024.21783997 ],
    [ 5.769e-08, 5.71579471638, 351.816592309 ],
    [ 4.454e-08, 5.20355311714, 274.066048325 ],
    [ 4.398e-08, 5.65312496227, 3.9321532631 ],
    [ 4.287e-08, 0.66340266603, 1012.65087484 ],
    [ 4.086e-08, 0.14551174994, 385.283761501 ],
    [ 4.029e-08, 5.98399329775, 178.347453538 ],
    [ 4.276e-08, 3.6820508297, 348.847646892 ],
    [ 4.012e-08, 0.42559540783, 104313.479531 ],
    [ 4.309e-08, 3.04099090488, 100.384461233 ],
    [ 3.957e-08, 0.86846121055, 171.984666062 ],
    [ 3.961e-08, 3.04953080906, 1017.31674129 ],
    [ 5.559e-08, 0.77714806229, 1447.84708543 ],
    [ 5.071e-08, 2.61075526868, 1536.71276564 ],
    [ 4.225e-08, 2.45845211305, 496.011347582 ],
    [ 4.052e-08, 5.00014006312, 391.646548976 ],
    [ 3.763e-08, 4.29449373755, 313.683556671 ],
    [ 4.038e-08, 2.82857942788, 1661.14618087 ],
    [ 4.067e-08, 5.7316992896, 169.536985508 ],
    [ 4.826e-08, 3.7558926471, 379.867135529 ],
    [ 4.296e-08, 5.90228488768, 142.140833593 ],
    [ 3.721e-08, 1.20062375429, 1026.87796884 ],
    [ 3.929e-08, 3.94354033755, 39.0962434843 ],
    [ 4.728e-08, 4.73892221737, 382.836080946 ],
    [ 3.489e-08, 4.28865448963, 1025.18104781 ],
    [ 3.714e-08, 5.05021268365, 292.48592802 ],
    [ 3.988e-08, 2.82832650224, 134.112262856 ],
    [ 3.471e-08, 4.98900354066, 69.1525242748 ],
    [ 3.528e-08, 2.80271543681, 14.0146456805 ],
    [ 3.745e-08, 4.24728135115, 180.795134093 ],
    [ 3.836e-08, 1.02685786071, 1018.27994913 ],
    [ 3.941e-08, 5.21895739331, 183.764079509 ],
    [ 3.78e-08, 6.03723468132, 1022.73336726 ],
    [ 3.647e-08, 3.98130320367, 608.877797677 ],
    [ 3.456e-08, 5.54052355058, 846.082834751 ],
    [ 4.047e-08, 3.71041480907, 1018.06750081 ],
    [ 3.865e-08, 4.76002199091, 166.568040091 ],
    [ 3.629e-08, 3.29053233846, 447.795819526 ],
    [ 3.337e-08, 0.47308019225, 79.1868325824 ],
    [ 3.304e-08, 1.49289552229, 1505.69327701 ],
    [ 3.615e-08, 3.68096122231, 494.526874873 ],
    [ 3.209e-08, 0.29676849415, 22.633917249 ],
    [ 3.28e-08, 3.62226152032, 531.175437803 ],
    [ 3.337e-08, 2.7250287632, 481.475437039 ],
    [ 3.187e-08, 0.08677634706, 399.510855502 ],
    [ 3.389e-08, 1.79454271219, 1519.92037101 ],
    [ 3.154e-08, 3.69356460843, 470.217288454 ],
    [ 3.706e-08, 2.79048710497, 462.022913528 ],
    [ 3.682e-08, 2.45952306167, 106.013535525 ],
    [ 3.136e-08, 4.38015969606, 385.496209822 ],
    [ 4.279e-08, 4.3563378889, 1066.49547719 ],
    [ 3.392e-08, 0.48037804731, 521.092945386 ],
    [ 3.465e-08, 0.93152295589, 2183.72359896 ],
    [ 3.735e-08, 0.98809808606, 487.413327873 ],
    [ 3.285e-08, 4.36830516894, 397.063174947 ],
    [ 3.998e-08, 3.38773325131, 6283.07584999 ],
    [ 2.998e-08, 2.61728063127, 487.625776194 ],
    [ 3.295e-08, 2.53821501556, 4.665866446 ],
    [ 2.964e-08, 3.66274645375, 495.49008272 ],
    [ 3.901e-08, 1.65463736406, 210.330150021 ],
    [ 2.95e-08, 1.99904237956, 872.909537694 ],
    [ 2.936e-08, 3.39722203959, 423.629245459 ],
    [ 3.121e-08, 5.89456985534, 105.492270664 ],
    [ 3.904e-08, 3.01022809543, 556.517668038 ],
    [ 3.801e-08, 4.23636257679, 1052.26838319 ],
    [ 2.93e-08, 6.15005257333, 164.120359536 ],
    [ 3.267e-08, 4.19718045293, 518.3846324 ],
    [ 3.946e-08, 2.8884275967, 151.260118164 ],
    [ 2.823e-08, 0.60712626756, 214.783568146 ],
    [ 2.826e-08, 2.91070227143, 391.434100655 ],
    [ 3.347e-08, 6.09373507569, 6246.42728706 ],
    [ 2.792e-08, 0.5524813599, 5.1078094307 ],
    [ 3.47e-08, 5.06081504795, 79.2350166922 ],
    [ 3.01e-08, 0.24656411754, 91.7864415238 ],
    [ 2.861e-08, 6.17465663902, 422.405405182 ],
    [ 2.989e-08, 2.31620917965, 485.928855164 ],
    [ 3.088e-08, 2.29186342974, 110.206321219 ],
    [ 3.03e-08, 3.698661491, 532.611726401 ],
    [ 3.148e-08, 6.25285869266, 535.320039387 ],
    [ 3.02e-08, 2.36422658177, 290.219558019 ],
    [ 2.73e-08, 3.34082732623, 394.094229531 ],
    [ 3.17e-08, 1.23078934548, 10176.6369833 ],
    [ 2.673e-08, 6.03366372927, 196.506700803 ],
    [ 2.635e-08, 3.39631667641, 148.078724426 ],
    [ 2.838e-08, 2.85241236576, 138.517496871 ],
    [ 2.63e-08, 0.46957619348, 1970.42450352 ],
    [ 2.599e-08, 4.86022081674, 439.197799817 ],
    [ 2.878e-08, 2.61946597178, 488.58898404 ],
    [ 2.72e-08, 1.71836225398, 364.559213602 ],
    [ 3.053e-08, 2.49346960035, 6243.45834165 ],
    [ 3.332e-08, 3.25113612987, 30.0562807905 ],
    [ 3.062e-08, 6.23776299874, 419.484643875 ],
    [ 2.786e-08, 0.83078219939, 497.187003749 ],
    [ 2.834e-08, 3.52926079424, 457.878311944 ],
    [ 2.932e-08, 1.80245810977, 500.155949166 ],
    [ 2.613e-08, 0.97430899059, 244.318584075 ],
    [ 3.03e-08, 5.10152500393, 367.970102003 ],
    [ 2.956e-08, 5.76230870725, 986.08480433 ],
    [ 2.658e-08, 0.88044044504, 109.945688788 ],
    [ 3.116e-08, 2.20042242739, 495.702531041 ],
    [ 2.554e-08, 0.65945973992, 67.3592350258 ],
    [ 2.901e-08, 3.91891656185, 10173.6680379 ],
    [ 2.84e-08, 1.34453183591, 482.959909748 ],
    [ 2.458e-08, 1.20012815574, 489.110248902 ],
    [ 2.556e-08, 3.86921927085, 487.104511332 ],
    [ 2.614e-08, 1.51881085312, 463.507386236 ],
    [ 2.386e-08, 4.58400538443, 615.991344678 ],
    [ 2.438e-08, 5.19827220476, 501.119157012 ],
    [ 2.537e-08, 1.64802783144, 519.608472677 ],
    [ 2.444e-08, 3.87859489652, 185.248552218 ],
    [ 2.262e-08, 5.79112288939, 605.95703637 ],
    [ 2.795e-08, 4.0426575258, 255.055467798 ],
    [ 2.895e-08, 3.26202698812, 1646.91908686 ],
    [ 2.324e-08, 3.99503920129, 481.262988718 ],
    [ 2.962e-08, 1.74151265966, 2080.63082474 ],
    [ 2.621e-08, 1.74442251671, 35.212274331 ]
];

KMG.VSOPTerms.neptune_R2 = [
    [ 4.247776e-05, 5.89911844921, 38.1330356378 ],
    [ 2.17404e-06, 0.34589546713, 1.4844727083 ],
    [ 1.63025e-06, 2.2387294713, 168.052512799 ],
    [ 1.56285e-06, 4.59414467342, 182.279606801 ],
    [ 1.1794e-06, 5.10295026024, 484.444382456 ],
    [ 1.12429e-06, 1.19000583596, 498.671476458 ],
    [ 1.27836e-06, 2.84821806298, 35.1640902212 ],
    [ 9.9311e-07, 3.41592669789, 175.1660598 ],
    [ 6.4814e-07, 3.4621406484, 388.465155238 ],
    [ 7.678e-07, 0.01680343065, 491.557929457 ],
    [ 4.9511e-07, 4.06995993334, 76.2660712756 ],
    [ 3.933e-07, 6.09521855958, 1021.24889455 ],
    [ 3.6451e-07, 5.17129778081, 137.033024162 ],
    [ 3.6709e-07, 5.97476878862, 2.9689454166 ],
    [ 2.9037e-07, 3.58135470306, 33.6796175129 ],
    [ 2.0862e-07, 0.77341568423, 36.6485629295 ],
    [ 1.3886e-07, 3.59248623971, 395.578702239 ],
    [ 1.3001e-07, 5.12870831936, 98.8999885246 ],
    [ 1.1379e-07, 1.18060018898, 381.351608237 ],
    [ 9.132e-08, 2.34787658568, 601.764250676 ],
    [ 8.527e-08, 5.25134685897, 2.4476805548 ],
    [ 7.608e-08, 4.99805971093, 4.4534181249 ],
    [ 7.417e-08, 4.46775409796, 189.393153802 ],
    [ 7.225e-08, 1.92287508629, 9.5612275556 ],
    [ 7.289e-08, 1.6551952578, 1028.36244155 ],
    [ 8.076e-08, 5.84268048268, 220.412642439 ],
    [ 9.415e-08, 0, 0 ],
    [ 6.554e-08, 0.69397520662, 144.146571163 ],
    [ 5.628e-08, 5.23383764266, 46.2097904851 ],
    [ 5.523e-08, 4.59041448911, 1014.13534755 ],
    [ 7.254e-08, 1.14445074833, 1059.38193019 ],
    [ 5.226e-08, 0.02783946816, 74.7815985673 ],
    [ 5.177e-08, 5.23116646157, 477.330835455 ],
    [ 5.098e-08, 3.50187769013, 39.6175083461 ],
    [ 5.503e-08, 3.49522319102, 183.764079509 ],
    [ 5.055e-08, 0.19949888617, 166.568040091 ],
    [ 4.751e-08, 1.1805494827, 169.536985508 ],
    [ 4.587e-08, 2.13374192347, 41.1019810544 ],
    [ 6.17e-08, 6.15456871599, 71.8126531507 ],
    [ 4.606e-08, 3.91970908886, 587.537156675 ],
    [ 4.536e-08, 2.84337336954, 7.1135470008 ],
    [ 4.338e-08, 0.51553847342, 446.311346818 ],
    [ 3.891e-08, 0.26338839265, 1550.93985965 ],
    [ 4.465e-08, 3.01487041336, 129.919477162 ],
    [ 4.162e-08, 1.58187532018, 73.297125859 ],
    [ 3.727e-08, 2.37977930658, 160.938965799 ],
    [ 4.83e-08, 2.23553496822, 176.650532508 ],
    [ 3.842e-08, 3.7938720423, 111.430161497 ],
    [ 3.296e-08, 1.07748822909, 505.785023458 ],
    [ 3.966e-08, 1.70648052846, 983.115858914 ],
    [ 4.008e-08, 0.30663868827, 494.739323195 ],
    [ 3.974e-08, 5.9735178384, 488.376535719 ],
    [ 3.925e-08, 4.85736421123, 60.7669528868 ],
    [ 2.966e-08, 2.01608546009, 822.176893115 ],
    [ 3.972e-08, 1.07780371834, 374.238061237 ],
    [ 2.848e-08, 6.17799253802, 704.857024895 ],
    [ 3.527e-08, 0.79317138165, 274.066048325 ],
    [ 2.773e-08, 5.37132330836, 251.432131076 ],
    [ 3.113e-08, 5.12622288666, 426.598190876 ],
    [ 3.344e-08, 5.61433537548, 1124.34166877 ],
    [ 3.552e-08, 5.22645982165, 350.3321196 ],
    [ 2.597e-08, 0.67759426519, 312.199083963 ],
    [ 2.58e-08, 3.56031931199, 567.824000732 ],
    [ 2.578e-08, 1.45603792456, 1035.47598855 ],
    [ 2.541e-08, 5.19427579702, 1227.43444299 ],
    [ 2.507e-08, 1.31206832468, 386.98068253 ],
    [ 2.51e-08, 4.12148891512, 171.233906537 ],
    [ 2.511e-08, 2.71606957319, 179.098213063 ],
    [ 2.342e-08, 0.96469916587, 1019.76442184 ],
    [ 2.5e-08, 0.7028227603, 707.777786202 ],
    [ 2.48e-08, 4.59623030219, 693.5506922 ]
];

KMG.VSOPTerms.neptune_R3 = [
    [ 1.66556e-06, 4.55393495836, 38.1330356378 ],
    [ 2.238e-07, 3.94830879358, 168.052512799 ],
    [ 2.1348e-07, 2.86296778794, 182.279606801 ],
    [ 1.6233e-07, 0.54226725872, 484.444382456 ],
    [ 1.5623e-07, 5.75702251906, 498.671476458 ],
    [ 1.1412e-07, 4.38291384655, 1.4844727083 ],
    [ 6.448e-08, 5.19003066847, 31.019488637 ],
    [ 3.655e-08, 5.91335292846, 1007.02180055 ],
    [ 3.681e-08, 1.62865545676, 388.465155238 ],
    [ 3.198e-08, 0.70197118575, 1558.05340665 ],
    [ 3.243e-08, 1.8803566598, 522.577418094 ],
    [ 2.688e-08, 1.87062743473, 402.69224924 ],
    [ 3.246e-08, 0.79381356193, 536.804512095 ],
    [ 2.65e-08, 5.76858449026, 343.2185726 ],
    [ 2.644e-08, 4.64542905401, 500.155949166 ],
    [ 2.541e-08, 4.79217120822, 482.959909748 ],
    [ 2.523e-08, 1.7286988978, 395.578702239 ],
    [ 3.04e-08, 2.90934098363, 76.2660712756 ],
    [ 2.69e-08, 2.21096415618, 446.311346818 ],
    [ 2.355e-08, 5.77381398401, 485.928855164 ],
    [ 2.874e-08, 6.1964334054, 815.063346114 ],
    [ 2.45e-08, 2.14451121185, 39.6175083461 ],
    [ 2.278e-08, 3.66579603119, 497.187003749 ]
];

KMG.VSOPTerms.neptune_R4 = [
    [ 4.227e-08, 2.40375758563, 477.330835455 ],
    [ 4.333e-08, 0.10459484545, 395.578702239 ],
    [ 3.545e-08, 4.78431259422, 1028.36244155 ],
    [ 3.154e-08, 3.88192942366, 505.785023458 ],
    [ 3.016e-08, 1.03609346831, 189.393153802 ],
    [ 2.294e-08, 1.10879658603, 182.279606801 ],
    [ 2.295e-08, 5.67776133184, 168.052512799 ]
];






// Position of the Sun relative to the Solar System Barycenter
// From VSOP87E
KMG.VSOPTerms.sun_X0 = [
    [ 0.00495672739, 3.74107356792, 529.690965095 ],
    [ 0.00271802376, 4.01601149775, 213.299095438 ],
    [ 0.00155435675, 2.17052050061, 38.1330356378 ],
    [ 0.00083792997, 2.33967985523, 74.7815985673 ],
    [ 0.00029374249, 0, 0 ],
    [ 0.00012013079, 4.09073224903, 1059.38193019 ],
    [ 7.577257e-005, 3.24151897354, 426.598190876 ],
    [ 1.94138e-005, 1.01219474101, 206.185548437 ],
    [ 1.940649e-005, 4.79769963661, 149.563197135 ],
    [ 1.888831e-005, 3.89252804366, 220.412642439 ],
    [ 1.434208e-005, 3.86895363775, 522.577418094 ],
    [ 1.406367e-005, 0.4759833515, 536.804512095 ],
    [ 1.185835e-005, 0.77770585045, 76.2660712756 ],
    [ 8.13685e-006, 3.25483611884, 36.6485629295 ],
    [ 7.67074e-006, 4.22743731914, 39.6175083461 ],
    [ 6.24814e-006, 0.27936466811, 73.297125859 ],
    [ 4.3664e-006, 4.44044655092, 1589.07289528 ],
    [ 3.79145e-006, 5.15640874752, 7.1135470008 ],
    [ 3.15393e-006, 6.15699854629, 419.484643875 ],
    [ 3.08784e-006, 2.49456658747, 639.897286314 ],
    [ 2.78795e-006, 4.93431870348, 110.206321219 ],
    [ 3.03993e-006, 4.89507841707, 6283.07584999 ],
    [ 2.27188e-006, 5.27839813806, 103.092774219 ],
    [ 2.16162e-006, 5.8029803212, 316.391869657 ],
    [ 1.76764e-006, 0.03416525046, 10213.2855462 ],
    [ 1.35792e-006, 2.00151020964, 1.4844727083 ],
    [ 1.16993e-006, 2.42475255571, 632.783739313 ],
    [ 1.05413e-006, 3.1233221385, 433.711737877 ],
    [ 9.7988e-007, 3.02626461372, 1052.26838319 ],
    [ 1.09101e-006, 3.15781282608, 1162.47470441 ],
    [ 6.9588e-007, 0.8219649508, 1066.49547719 ],
    [ 5.6882e-007, 1.32304578699, 949.17560897 ],
    [ 6.612e-007, 0.27653561007, 846.082834751 ],
    [ 6.3189e-007, 5.79436684832, 148.078724426 ],
    [ 6.3139e-007, 0.73209797865, 224.344795702 ],
    [ 4.8979e-007, 3.06244424367, 3340.6124267 ],
    [ 3.7824e-007, 4.58891701161, 35.1640902212 ],
    [ 3.115e-007, 1.37429681895, 63.7358983034 ],
    [ 3.0682e-007, 4.22246917155, 11.0457002639 ],
    [ 2.8741e-007, 3.71398829023, 151.047669843 ],
    [ 2.858e-007, 2.84721981555, 41.1019810544 ],
    [ 2.3782e-007, 3.76207354349, 227.52618944 ],
    [ 2.3267e-007, 0.46827104623, 85.8272988312 ],
    [ 2.2744e-007, 1.67012539714, 71.8126531507 ],
    [ 1.8818e-007, 4.79056538983, 2118.76386038 ],
    [ 2.2286e-007, 3.93734569173, 2.9689454166 ],
    [ 2.1992e-007, 0.11232184552, 77.7505439839 ],
    [ 2.0026e-007, 4.02923197304, 209.366942175 ],
    [ 1.9681e-007, 0.87544248531, 217.231248701 ],
    [ 1.9075e-007, 5.91973929854, 202.253395174 ],
    [ 1.6571e-007, 2.54911337935, 735.876513532 ],
    [ 1.5738e-007, 5.27754524439, 742.990060533 ],
    [ 1.8319e-007, 3.06472848621, 323.505416657 ],
    [ 1.736e-007, 3.01137661271, 138.517496871 ],
    [ 1.5488e-007, 4.00542220967, 515.463871093 ],
    [ 1.6367e-007, 1.83137880912, 853.196381752 ],
    [ 1.1229e-007, 1.18029367551, 199.072001436 ],
    [ 1.0836e-007, 0.34161370756, 543.918059096 ],
    [ 1.1587e-007, 0.61075744193, 525.758811832 ],
    [ 1.1447e-007, 3.7270425577, 533.623118358 ],
    [ 7.92e-008, 2.43547958386, 1478.86657406 ],
    [ 8.322e-008, 3.52503621824, 1692.1656695 ],
    [ 7.185e-008, 3.51955509534, 216.480489176 ],
    [ 7.015e-008, 1.38855213071, 210.1177017 ],
    [ 7.12e-008, 2.46055859947, 415.552490612 ],
    [ 6.867e-008, 4.39735582882, 117.31986822 ],
    [ 7.226e-008, 4.04267257839, 1265.56747863 ],
    [ 6.955e-008, 2.865019528, 956.289155971 ],
    [ 7.493e-008, 5.01430547428, 14.2270940016 ],
    [ 6.597e-008, 2.37676813421, 647.010833315 ],
    [ 7.38e-008, 3.2730220882, 1581.95934828 ],
    [ 6.401e-008, 5.30226825802, 95.9792272178 ],
    [ 6.244e-008, 5.44473078234, 70.8494453042 ]
    // 73 terms retained
];

KMG.VSOPTerms.sun_X1 = [
    [ 1.296073e-005, 3.14159265359, 0 ],
    [ 8.97419e-006, 1.1289200545, 426.598190876 ],
    [ 7.76911e-006, 2.70600396412, 206.185548437 ],
    [ 7.53636e-006, 2.19131779736, 220.412642439 ],
    [ 6.06034e-006, 3.24815679698, 1059.38193019 ],
    [ 5.72567e-006, 5.56994506134, 522.577418094 ],
    [ 5.6152e-006, 5.05742214407, 536.804512095 ],
    [ 1.01075e-006, 3.47363025932, 7.1135470008 ],
    [ 7.2584e-007, 0.36521293891, 639.897286314 ],
    [ 8.753e-007, 1.66279295561, 419.484643875 ],
    [ 5.3691e-007, 1.32771189808, 433.711737877 ],
    [ 5.7424e-007, 4.25022395061, 213.299095438 ],
    [ 4.4073e-007, 3.59873993683, 1589.07289528 ],
    [ 3.1012e-007, 4.88786083215, 1052.26838319 ],
    [ 3.2089e-007, 0.97023379672, 529.690965095 ],
    [ 3.0164e-007, 5.48452294664, 1066.49547719 ],
    [ 3.2092e-007, 2.84692417916, 149.563197135 ],
    [ 2.1371e-007, 0.56918433581, 316.391869657 ],
    [ 1.899e-007, 2.06104675595, 227.52618944 ],
    [ 1.4015e-007, 4.17777922613, 110.206321219 ],
    [ 1.5885e-007, 5.78017661291, 76.2660712756 ],
    [ 1.2374e-007, 5.70562636316, 515.463871093 ],
    [ 1.3243e-007, 5.16075891864, 36.6485629295 ],
    [ 1.1847e-007, 3.05476901979, 632.783739313 ],
    [ 1.2487e-007, 2.32002507803, 39.6175083461 ],
    [ 1.0223e-007, 2.19747174258, 73.297125859 ],
    [ 9.014e-008, 2.8687275429, 199.072001436 ],
    [ 8.667e-008, 4.924197114, 543.918059096 ],
    [ 7.754e-008, 3.01431732345, 949.17560897 ],
    [ 7.535e-008, 2.70484475866, 103.092774219 ],
    [ 5.483e-008, 6.01106223961, 853.196381752 ],
    [ 5.158e-008, 1.94900517603, 209.366942175 ],
    [ 5.079e-008, 2.96229494906, 217.231248701 ],
    [ 4.653e-008, 1.72782369127, 216.480489176 ],
    [ 4.541e-008, 3.17727011849, 210.1177017 ],
    [ 4.456e-008, 0.76977956324, 323.505416657 ],
    [ 4.233e-008, 3.49063898076, 63.7358983034 ],
    [ 4.095e-008, 0.51793431422, 647.010833315 ],
    [ 4.989e-008, 3.32377727482, 14.2270940016 ],
    [ 4.32e-008, 4.2884518892, 735.876513532 ]
    // 40 terms retained
];

KMG.VSOPTerms.sun_X2 = [
    [ 1.60293e-006, 4.40406062613, 206.185548437 ],
    [ 1.55633e-006, 0.48183983171, 220.412642439 ],
    [ 1.18222e-006, 0.99338493688, 522.577418094 ],
    [ 1.15842e-006, 3.35337160144, 536.804512095 ],
    [ 9.6063e-007, 5.5670757102, 213.299095438 ],
    [ 6.5107e-007, 5.63089478188, 426.598190876 ],
    [ 7.4211e-007, 2.15619420586, 529.690965095 ],
    [ 3.9505e-007, 1.98115233273, 1059.38193019 ],
    [ 4.4785e-007, 0, 0 ],
    [ 1.4232e-007, 5.82837756444, 433.711737877 ],
    [ 1.3989e-007, 1.76434060619, 7.1135470008 ],
    [ 1.2711e-007, 3.4914979877, 419.484643875 ],
    [ 9.321e-008, 4.71464865506, 639.897286314 ],
    [ 7.707e-008, 0.35647823047, 227.52618944 ],
    [ 6.797e-008, 3.87383015136, 1066.49547719 ],
    [ 5.452e-008, 0.48898137631, 1052.26838319 ],
    [ 5.027e-008, 1.12572622612, 515.463871093 ],
    [ 3.854e-008, 2.44255859575, 1589.07289528 ],
    [ 3.667e-008, 4.56283602529, 199.072001436 ],
    [ 3.523e-008, 3.22103209546, 543.918059096 ],
    [ 1.347e-008, 2.19024470415, 316.391869657 ],
    [ 1.405e-008, 6.22622304401, 216.480489176 ],
    [ 1.32e-008, 4.96541286159, 647.010833315 ],
    [ 1.365e-008, 4.95810524231, 210.1177017 ],
    [ 1.687e-008, 1.62553064962, 14.2270940016 ],
    [ 1.093e-008, 4.21067890946, 103.092774219 ],
    [ 9.73e-009, 4.02172041169, 853.196381752 ]
    // 27 terms retained
];

KMG.VSOPTerms.sun_X3 = [
    [ 2.2035e-007, 6.11822426048, 206.185548437 ],
    [ 2.1482e-007, 5.03368299703, 220.412642439 ],
    [ 1.6291e-007, 2.71940457791, 522.577418094 ],
    [ 1.5934e-007, 1.63320186413, 536.804512095 ],
    [ 3.063e-008, 3.8020122552, 426.598190876 ],
    [ 2.563e-008, 4.04702837579, 433.711737877 ],
    [ 2.101e-008, 4.9278699675, 227.52618944 ],
    [ 1.706e-008, 0.42316599671, 1059.38193019 ],
    [ 2.008e-008, 0, 0 ],
    [ 1.375e-008, 2.83821817426, 515.463871093 ],
    [ 1.266e-008, 5.3750910608, 419.484643875 ],
    [ 1.038e-008, 2.26994057258, 1066.49547719 ],
    [ 1e-008, 6.26567671131, 199.072001436 ],
    [ 9.64e-009, 1.50782014667, 543.918059096 ],
    [ 1.275e-008, 0.02482955002, 7.1135470008 ],
    [ 8.45e-009, 2.83708264275, 639.897286314 ],
    [ 6.78e-009, 2.36507413871, 1052.26838319 ]
    // 17 terms retained
];

KMG.VSOPTerms.sun_X4 = [
    [ 2.272e-008, 1.5636483818, 206.185548437 ],
    [ 2.236e-008, 3.28143366276, 220.412642439 ],
    [ 1.682e-008, 4.46996330708, 522.577418094 ],
    [ 1.638e-008, 6.17513895178, 536.804512095 ],
    [ 4.3e-009, 3.20713267334, 227.52618944 ],
    [ 3.48e-009, 2.26681787351, 433.711737877 ],
    [ 2.91e-009, 4.56956279775, 515.463871093 ],
    [ 2.06e-009, 6.05364860885, 543.918059096 ],
    [ 2.02e-009, 1.69320982304, 199.072001436 ]
    // 9 terms retained
];

KMG.VSOPTerms.sun_Y0 = [
    [ 0.00495536218, 2.17046712634, 529.690965095 ],
    [ 0.00272185821, 2.44443364925, 213.299095438 ],
    [ 0.00155444313, 0.5992701084, 38.1330356378 ],
    [ 0.00083755792, 0.7688016471, 74.7815985673 ],
    [ 0.00033869535, 0, 0 ],
    [ 0.00012011827, 2.5200314788, 1059.38193019 ],
    [ 7.58583e-005, 1.66995483217, 426.598190876 ],
    [ 1.963743e-005, 5.70773655842, 206.185548437 ],
    [ 1.891503e-005, 2.32096821003, 220.412642439 ],
    [ 1.940124e-005, 3.22686130461, 149.563197135 ],
    [ 1.436841e-005, 2.30161968078, 522.577418094 ],
    [ 1.405975e-005, 5.18858607879, 536.804512095 ],
    [ 1.185515e-005, 5.48969329104, 76.2660712756 ],
    [ 8.13077e-006, 1.68393442622, 36.6485629295 ],
    [ 7.67125e-006, 2.65620459324, 39.6175083461 ],
    [ 6.28788e-006, 4.99295631526, 73.297125859 ],
    [ 4.36632e-006, 2.86969820654, 1589.07289528 ],
    [ 3.82844e-006, 3.57213982765, 7.1135470008 ],
    [ 3.17511e-006, 4.53536380695, 419.484643875 ],
    [ 3.09191e-006, 0.92301535903, 639.897286314 ],
    [ 2.87366e-006, 3.36314089821, 110.206321219 ],
    [ 3.04013e-006, 3.32425157103, 6283.07584999 ],
    [ 2.69924e-006, 0.29178785093, 103.092774219 ],
    [ 2.13445e-006, 4.22099738237, 316.391869657 ],
    [ 1.77041e-006, 4.747331353, 10213.2855462 ],
    [ 1.38577e-006, 0.43043981485, 1.4844727083 ],
    [ 1.12761e-006, 0.85382170184, 632.783739313 ],
    [ 1.05538e-006, 1.55181188435, 433.711737877 ],
    [ 9.8007e-007, 1.45965911177, 1052.26838319 ],
    [ 1.09014e-006, 1.58735183284, 1162.47470441 ],
    [ 6.9581e-007, 5.53444845615, 1066.49547719 ],
    [ 5.6638e-007, 6.03067632809, 949.17560897 ],
    [ 6.6066e-007, 4.9895069635, 846.082834751 ],
    [ 6.3109e-007, 4.22325583135, 148.078724426 ],
    [ 6.3108e-007, 5.44406082112, 224.344795702 ],
    [ 4.891e-007, 1.4905211289, 3340.6124267 ],
    [ 3.4784e-007, 3.0311366542, 35.1640902212 ],
    [ 3.0366e-007, 2.65225160596, 11.0457002639 ],
    [ 2.8582e-007, 1.27599593473, 41.1019810544 ],
    [ 2.8733e-007, 2.14315245629, 151.047669843 ],
    [ 2.7688e-007, 5.44433605847, 63.7358983034 ],
    [ 2.3815e-007, 2.19051967809, 227.52618944 ],
    [ 2.3457e-007, 0.09576335036, 71.8126531507 ],
    [ 2.3256e-007, 5.18050538435, 85.8272988312 ],
    [ 1.8818e-007, 3.21978774117, 2118.76386038 ],
    [ 2.2104e-007, 2.36649230999, 2.9689454166 ],
    [ 2.1981e-007, 4.82484958838, 77.7505439839 ],
    [ 2.0052e-007, 2.45637769313, 209.366942175 ],
    [ 1.9691e-007, 5.58713076986, 217.231248701 ],
    [ 1.5682e-007, 3.70800811377, 742.990060533 ],
    [ 1.8552e-007, 4.31061638297, 202.253395174 ],
    [ 1.8318e-007, 1.49471267476, 323.505416657 ],
    [ 1.7492e-007, 1.45131471586, 138.517496871 ],
    [ 1.5554e-007, 1.06805925164, 735.876513532 ],
    [ 1.5545e-007, 2.44244738845, 515.463871093 ],
    [ 1.6381e-007, 0.25980625854, 853.196381752 ],
    [ 1.1595e-007, 5.83451477433, 199.072001436 ],
    [ 1.0833e-007, 5.05422968004, 543.918059096 ],
    [ 1.1585e-007, 5.32336141881, 525.758811832 ],
    [ 1.1435e-007, 2.15573411853, 533.623118358 ],
    [ 7.912e-008, 0.8642910472, 1478.86657406 ],
    [ 8.319e-008, 1.95435351055, 1692.1656695 ],
    [ 7.196e-008, 1.94802350337, 216.480489176 ],
    [ 7.036e-008, 6.09743344991, 210.1177017 ],
    [ 7.148e-008, 0.89057242152, 415.552490612 ],
    [ 6.899e-008, 2.82570489004, 117.31986822 ],
    [ 7.245e-008, 2.48166026447, 1265.56747863 ],
    [ 6.96e-008, 1.29290894763, 956.289155971 ],
    [ 7.569e-008, 3.42743646666, 14.2270940016 ],
    [ 6.604e-008, 0.80525786731, 647.010833315 ],
    [ 7.374e-008, 1.70513414627, 1581.95934828 ],
    [ 7.04e-008, 0.48482036852, 95.9792272178 ],
    [ 6.33e-008, 3.87859376833, 70.8494453042 ]
    // 73 terms retained
];

KMG.VSOPTerms.sun_Y1 = [
    [ 8.98747e-006, 5.8406215769, 426.598190876 ],
    [ 7.81392e-006, 1.12962797123, 206.185548437 ],
    [ 7.54898e-006, 0.61969438775, 220.412642439 ],
    [ 6.05551e-006, 1.67748431613, 1059.38193019 ],
    [ 5.73282e-006, 4.00088433502, 522.577418094 ],
    [ 5.61304e-006, 3.48675865561, 536.804512095 ],
    [ 1.02847e-006, 1.87716874734, 7.1135470008 ],
    [ 7.2695e-007, 5.07718907269, 639.897286314 ],
    [ 8.732e-007, 0.0906528032, 419.484643875 ],
    [ 5.3759e-007, 6.03942421773, 433.711737877 ],
    [ 4.7287e-007, 2.15306225354, 213.299095438 ],
    [ 4.4572e-007, 5.0598198221, 529.690965095 ],
    [ 4.4061e-007, 2.02795830775, 1589.07289528 ],
    [ 3.101e-007, 3.31770926852, 1052.26838319 ],
    [ 3.016e-007, 3.91376481697, 1066.49547719 ],
    [ 3.2071e-007, 1.27581809571, 149.563197135 ],
    [ 2.1415e-007, 5.30131509744, 316.391869657 ],
    [ 1.9019e-007, 0.48946385175, 227.52618944 ],
    [ 1.6129e-007, 2.44989442588, 110.206321219 ],
    [ 1.5875e-007, 4.20914007335, 76.2660712756 ],
    [ 1.2413e-007, 4.14057132118, 515.463871093 ],
    [ 1.3252e-007, 3.5892518546, 36.6485629295 ],
    [ 1.1814e-007, 1.50628561093, 632.783739313 ],
    [ 1.2488e-007, 0.74887488462, 39.6175083461 ],
    [ 1.0164e-007, 0.6299231039, 73.297125859 ],
    [ 9.222e-008, 1.25927718333, 199.072001436 ],
    [ 8.663e-008, 3.35360012494, 543.918059096 ],
    [ 7.755e-008, 1.44764390538, 949.17560897 ],
    [ 7.691e-008, 1.12047989646, 103.092774219 ],
    [ 5.487e-008, 4.43944248381, 853.196381752 ],
    [ 5.17e-008, 0.37516758388, 209.366942175 ],
    [ 5.081e-008, 1.3905945573, 217.231248701 ],
    [ 4.66e-008, 0.15626149972, 216.480489176 ],
    [ 4.553e-008, 1.60431626596, 210.1177017 ],
    [ 4.447e-008, 5.48065037241, 323.505416657 ],
    [ 6.117e-008, 0, 0 ],
    [ 4.151e-008, 1.93098926861, 63.7358983034 ],
    [ 4.099e-008, 5.22964063969, 647.010833315 ],
    [ 5.058e-008, 1.73136117173, 14.2270940016 ],
    [ 4.293e-008, 2.71452907477, 735.876513532 ]
    // 40 terms retained
];

KMG.VSOPTerms.sun_Y2 = [
    [ 1.60849e-006, 2.83104666823, 206.185548437 ],
    [ 1.55973e-006, 5.19309730583, 220.412642439 ],
    [ 1.18316e-006, 5.70681506981, 522.577418094 ],
    [ 1.15781e-006, 1.78259431361, 536.804512095 ],
    [ 1.03374e-006, 4.03691274682, 213.299095438 ],
    [ 6.5392e-007, 4.05826871786, 426.598190876 ],
    [ 7.3065e-007, 0.61752643976, 529.690965095 ],
    [ 5.5814e-007, 3.14159265359, 0 ],
    [ 3.9447e-007, 0.41095552166, 1059.38193019 ],
    [ 1.4254e-007, 4.25680464915, 433.711737877 ],
    [ 1.4479e-007, 0.14336346755, 7.1135470008 ],
    [ 1.2723e-007, 1.91903810105, 419.484643875 ],
    [ 9.344e-008, 3.14385567645, 639.897286314 ],
    [ 7.72e-008, 5.06798604557, 227.52618944 ],
    [ 6.795e-008, 2.30303656447, 1066.49547719 ],
    [ 5.452e-008, 5.20193437243, 1052.26838319 ],
    [ 5.04e-008, 5.84239832938, 515.463871093 ],
    [ 3.852e-008, 0.87182418595, 1589.07289528 ],
    [ 3.729e-008, 2.96611895542, 199.072001436 ],
    [ 3.521e-008, 1.65043749771, 543.918059096 ],
    [ 1.351e-008, 0.59351678849, 316.391869657 ],
    [ 1.409e-008, 4.65471130275, 216.480489176 ],
    [ 1.321e-008, 3.39383854482, 647.010833315 ],
    [ 1.368e-008, 3.38543777835, 210.1177017 ],
    [ 1.717e-008, 0.02861328541, 14.2270940016 ]
    // 25 terms retained
];

KMG.VSOPTerms.sun_Y3 = [
    [ 2.2088e-007, 4.54598360855, 206.185548437 ],
    [ 2.1546e-007, 3.46116671016, 220.412642439 ],
    [ 1.63e-007, 1.14934178921, 522.577418094 ],
    [ 1.5923e-007, 0.06221071687, 536.804512095 ],
    [ 3.093e-008, 2.22514436528, 426.598190876 ],
    [ 2.568e-008, 2.47493921494, 433.711737877 ],
    [ 2.105e-008, 3.35595521974, 227.52618944 ],
    [ 2.639e-008, 0, 0 ],
    [ 1.7e-008, 5.13510489936, 1059.38193019 ],
    [ 1.378e-008, 1.27086042787, 515.463871093 ],
    [ 1.266e-008, 3.80209162712, 419.484643875 ],
    [ 1.363e-008, 4.63636570705, 7.1135470008 ],
    [ 1.013e-008, 4.67704889552, 199.072001436 ],
    [ 1.037e-008, 0.69915801725, 1066.49547719 ],
    [ 9.64e-009, 6.2204514585, 543.918059096 ],
    [ 8.49e-009, 1.26670686968, 639.897286314 ],
    [ 6.78e-009, 0.7955478313, 1052.26838319 ]
    // 17 terms retained
];

KMG.VSOPTerms.sun_Y4 = [
    [ 2.278e-008, 6.2738890301, 206.185548437 ],
    [ 2.245e-008, 1.70782913671, 220.412642439 ],
    [ 1.682e-008, 2.8998895537, 522.577418094 ],
    [ 1.636e-008, 4.60365551069, 536.804512095 ],
    [ 4.31e-009, 1.63508563664, 227.52618944 ],
    [ 3.49e-009, 0.69586528581, 433.711737877 ],
    [ 2.91e-009, 3.00165310731, 515.463871093 ],
    [ 2.06e-009, 4.48461122025, 543.918059096 ],
    [ 2.04e-009, 0.11049991144, 199.072001436 ]
    // 9 terms retained
];

KMG.VSOPTerms.sun_Z0 = [
    [ 0.00011810648, 0.46078690233, 213.299095438 ],
    [ 0.000112777, 0.41689943638, 529.690965095 ],
    [ 4.802048e-005, 4.5826472337, 38.1330356378 ],
    [ 1.131046e-005, 5.75877139035, 74.7815985673 ],
    [ 1.152656e-005, 3.14159265359, 0 ],
    [ 3.2982e-006, 5.97879747107, 426.598190876 ],
    [ 2.73335e-006, 0.76652182727, 1059.38193019 ],
    [ 9.4247e-007, 3.71017552866, 206.185548437 ],
    [ 8.1859e-007, 0.33908959552, 220.412642439 ],
    [ 4.0793e-007, 0.45519444489, 522.577418094 ],
    [ 3.1695e-007, 3.44538862917, 536.804512095 ],
    [ 2.4534e-007, 5.66491831903, 36.6485629295 ],
    [ 2.6057e-007, 1.93178628731, 149.563197135 ],
    [ 2.3291e-007, 0.36646817056, 39.6175083461 ],
    [ 1.973e-007, 3.16782731236, 76.2660712756 ],
    [ 2.1801e-007, 1.54437894252, 7.1135470008 ],
    [ 1.4512e-007, 1.58375269275, 110.206321219 ],
    [ 1.3582e-007, 5.23992989955, 639.897286314 ]
    // 18 terms retained
];

KMG.VSOPTerms.sun_Z1 = [
    [ 5.44343e-006, 1.80383716985, 213.299095438 ],
    [ 3.88234e-006, 4.6685522117, 529.690965095 ],
    [ 1.33398e-006, 0, 0 ],
    [ 3.7294e-007, 5.40133589632, 206.185548437 ],
    [ 2.8944e-007, 4.9324571056, 220.412642439 ],
    [ 2.8635e-007, 3.15447649004, 74.7815985673 ],
    [ 2.4988e-007, 3.65752330365, 426.598190876 ],
    [ 1.9373e-007, 5.74043087058, 1059.38193019 ],
    [ 1.3746e-007, 1.71298046603, 536.804512095 ],
    [ 1.2168e-007, 2.31196328906, 522.577418094 ],
    [ 8.01e-008, 5.28413417446, 38.1330356378 ]
    // 11 terms retained
];

KMG.VSOPTerms.sun_Z2 = [
    [ 3.7478e-007, 3.23028568613, 213.299095438 ],
    [ 2.7315e-007, 6.15507992196, 529.690965095 ],
    [ 8.616e-008, 0.7720923931, 206.185548437 ],
    [ 5.511e-008, 3.23377546695, 220.412642439 ],
    [ 2.969e-008, 6.27419756063, 536.804512095 ],
    [ 2.272e-008, 4.09618627765, 522.577418094 ],
    [ 1.982e-008, 2.34242027589, 426.598190876 ]
    // 7 terms retained
];


















KMG.VSOPSeries = {};



KMG.VSOPSeries.mercury_L = [
	KMG.VSOPTerms.mercury_L0,
	KMG.VSOPTerms.mercury_L1,
	KMG.VSOPTerms.mercury_L2,
	KMG.VSOPTerms.mercury_L3,
	KMG.VSOPTerms.mercury_L4,
	KMG.VSOPTerms.mercury_L5
];


KMG.VSOPSeries.mercury_B = [
	KMG.VSOPTerms.mercury_B0,
	KMG.VSOPTerms.mercury_B1,
	KMG.VSOPTerms.mercury_B2,
	KMG.VSOPTerms.mercury_B3,
	KMG.VSOPTerms.mercury_B4,
	KMG.VSOPTerms.mercury_B5
];

KMG.VSOPSeries.mercury_R = [
	KMG.VSOPTerms.mercury_R0,
	KMG.VSOPTerms.mercury_R1,
	KMG.VSOPTerms.mercury_R2,
	KMG.VSOPTerms.mercury_R3,
	KMG.VSOPTerms.mercury_R4
];





KMG.VSOPSeries.venus_L = [
	KMG.VSOPTerms.venus_L0,
	KMG.VSOPTerms.venus_L1,
	KMG.VSOPTerms.venus_L2,
	KMG.VSOPTerms.venus_L3,
	KMG.VSOPTerms.venus_L4,
	KMG.VSOPTerms.venus_L5
];


KMG.VSOPSeries.venus_B = [
	KMG.VSOPTerms.venus_B0,
	KMG.VSOPTerms.venus_B1,
	KMG.VSOPTerms.venus_B2,
	KMG.VSOPTerms.venus_B3,
	KMG.VSOPTerms.venus_B4,
	KMG.VSOPTerms.venus_B5
];

KMG.VSOPSeries.venus_R = [
	KMG.VSOPTerms.venus_R0,
	KMG.VSOPTerms.venus_R1,
	KMG.VSOPTerms.venus_R2,
	KMG.VSOPTerms.venus_R3,
	KMG.VSOPTerms.venus_R4
];





KMG.VSOPSeries.earth_L = [
	KMG.VSOPTerms.earth_L0,
	KMG.VSOPTerms.earth_L1,
	KMG.VSOPTerms.earth_L2,
	KMG.VSOPTerms.earth_L3,
	KMG.VSOPTerms.earth_L4,
	KMG.VSOPTerms.earth_L5
];


KMG.VSOPSeries.earth_B = [
	KMG.VSOPTerms.earth_B0,
	KMG.VSOPTerms.earth_B1,
	KMG.VSOPTerms.earth_B2
];

KMG.VSOPSeries.earth_R = [
	KMG.VSOPTerms.earth_R0,
	KMG.VSOPTerms.earth_R1,
	KMG.VSOPTerms.earth_R2,
	KMG.VSOPTerms.earth_R3,
	KMG.VSOPTerms.earth_R4,
	KMG.VSOPTerms.earth_R5
];








KMG.VSOPSeries.mars_L = [
	KMG.VSOPTerms.mars_L0,
	KMG.VSOPTerms.mars_L1,
	KMG.VSOPTerms.mars_L2,
	KMG.VSOPTerms.mars_L3,
	KMG.VSOPTerms.mars_L4,
	KMG.VSOPTerms.mars_L5
];


KMG.VSOPSeries.mars_B = [
	KMG.VSOPTerms.mars_B0,
	KMG.VSOPTerms.mars_B1,
	KMG.VSOPTerms.mars_B2,
	KMG.VSOPTerms.mars_B3,
	KMG.VSOPTerms.mars_B4,
	KMG.VSOPTerms.mars_B5
];

KMG.VSOPSeries.mars_R = [
	KMG.VSOPTerms.mars_R0,
	KMG.VSOPTerms.mars_R1,
	KMG.VSOPTerms.mars_R2,
	KMG.VSOPTerms.mars_R3,
	KMG.VSOPTerms.mars_R4,
	KMG.VSOPTerms.mars_R5
];





KMG.VSOPSeries.jupiter_L = [
	KMG.VSOPTerms.jupiter_L0,
	KMG.VSOPTerms.jupiter_L1,
	KMG.VSOPTerms.jupiter_L2,
	KMG.VSOPTerms.jupiter_L3,
	KMG.VSOPTerms.jupiter_L4,
	KMG.VSOPTerms.jupiter_L5
];


KMG.VSOPSeries.jupiter_B = [
	KMG.VSOPTerms.jupiter_B0,
	KMG.VSOPTerms.jupiter_B1,
	KMG.VSOPTerms.jupiter_B2,
	KMG.VSOPTerms.jupiter_B3,
	KMG.VSOPTerms.jupiter_B4,
	KMG.VSOPTerms.jupiter_B5
];

KMG.VSOPSeries.jupiter_R = [
	KMG.VSOPTerms.jupiter_R0,
	KMG.VSOPTerms.jupiter_R1,
	KMG.VSOPTerms.jupiter_R2,
	KMG.VSOPTerms.jupiter_R3,
	KMG.VSOPTerms.jupiter_R4,
	KMG.VSOPTerms.jupiter_R5
];



KMG.VSOPSeries.saturn_L = [
	KMG.VSOPTerms.saturn_L0,
	KMG.VSOPTerms.saturn_L1,
	KMG.VSOPTerms.saturn_L2,
	KMG.VSOPTerms.saturn_L3,
	KMG.VSOPTerms.saturn_L4,
	KMG.VSOPTerms.saturn_L5
];


KMG.VSOPSeries.saturn_B = [
	KMG.VSOPTerms.saturn_B0,
	KMG.VSOPTerms.saturn_B1,
	KMG.VSOPTerms.saturn_B2,
	KMG.VSOPTerms.saturn_B3,
	KMG.VSOPTerms.saturn_B4,
	KMG.VSOPTerms.saturn_B5
];

KMG.VSOPSeries.saturn_R = [
	KMG.VSOPTerms.saturn_R0,
	KMG.VSOPTerms.saturn_R1,
	KMG.VSOPTerms.saturn_R2,
	KMG.VSOPTerms.saturn_R3,
	KMG.VSOPTerms.saturn_R4,
	KMG.VSOPTerms.saturn_R5
];







KMG.VSOPSeries.uranus_L = [
	KMG.VSOPTerms.uranus_L0,
	KMG.VSOPTerms.uranus_L1,
	KMG.VSOPTerms.uranus_L2,
	KMG.VSOPTerms.uranus_L3,
	KMG.VSOPTerms.uranus_L4
];


KMG.VSOPSeries.uranus_B = [
	KMG.VSOPTerms.uranus_B0,
	KMG.VSOPTerms.uranus_B1,
	KMG.VSOPTerms.uranus_B2,
	KMG.VSOPTerms.uranus_B3
];

KMG.VSOPSeries.uranus_R = [
	KMG.VSOPTerms.uranus_R0,
	KMG.VSOPTerms.uranus_R1,
	KMG.VSOPTerms.uranus_R2,
	KMG.VSOPTerms.uranus_R3,
	KMG.VSOPTerms.uranus_R4
];








KMG.VSOPSeries.neptune_L = [
	KMG.VSOPTerms.neptune_L0,
	KMG.VSOPTerms.neptune_L1,
	KMG.VSOPTerms.neptune_L2,
	KMG.VSOPTerms.neptune_L3
];


KMG.VSOPSeries.neptune_B = [
	KMG.VSOPTerms.neptune_B0,
	KMG.VSOPTerms.neptune_B1,
	KMG.VSOPTerms.neptune_B2,
	KMG.VSOPTerms.neptune_B3
];

KMG.VSOPSeries.neptune_R = [
	KMG.VSOPTerms.neptune_R0,
	KMG.VSOPTerms.neptune_R1,
	KMG.VSOPTerms.neptune_R2,
	KMG.VSOPTerms.neptune_R3,
	KMG.VSOPTerms.neptune_R4
];



KMG.VSOPSeries.sun_X = [
	KMG.VSOPTerms.sun_X0,
	KMG.VSOPTerms.sun_X1,
	KMG.VSOPTerms.sun_X2,
	KMG.VSOPTerms.sun_X3,
	KMG.VSOPTerms.sun_X4
];

KMG.VSOPSeries.sun_Y = [
	KMG.VSOPTerms.sun_Y0,
	KMG.VSOPTerms.sun_Y1,
	KMG.VSOPTerms.sun_Y2,
	KMG.VSOPTerms.sun_Y3,
	KMG.VSOPTerms.sun_Y4
];

KMG.VSOPSeries.sun_Z = [
	KMG.VSOPTerms.sun_Z0,
	KMG.VSOPTerms.sun_Z1,
	KMG.VSOPTerms.sun_Z2
];






KMG.VSOP87Orbit = function(L, B, R, period) {

	function positionAtTime(jd, preserveDirection) {
		var t = (jd - 2451545) / 365250;

		var l = 0;
		var b = 0;
		var r = 0;
		
		var T = 1;
		for (var i = 0; i < L.length; i++) {
			var s = 0;
			for (var j = 0; j < L[i].length; j++) {
				s += L[i][j][0] * Math.cos(L[i][j][1] + L[i][j][2] * t);
			}
			l += s * T;
            T = t * T;
		}
		
		var T = 1;
		for (var i = 0; i < B.length; i++) {
			var s = 0;
			for (var j = 0; j < B[i].length; j++) {
				s += B[i][j][0] * Math.cos(B[i][j][1] + B[i][j][2] * t);
			}
			b += s * T;
            T = t * T;
		}
		
		var T = 1;
		for (var i = 0; i < R.length; i++) {
			var s = 0;
			for (var j = 0; j < R[i].length; j++) {
				s += R[i][j][0] * Math.cos(R[i][j][1] + R[i][j][2] * t);
			}
			r += s * T;
            T = t * T;
		}
		

		l = KMG.Math.clamp(l, 2 * Math.PI);

		//b -= Math.PI / 2;
       // l += Math.PI;
		
		var modB = (preserveDirection) ? 0 : -(Math.PI / 2);
		var modL = (preserveDirection) ? 0 : Math.PI;
		b += modB;
		l += modL;
		
		var x = Math.cos(l) * Math.sin(b) * r;
		var y = Math.cos(b) * r;
		var z = -Math.sin(l) * Math.sin(b) * r;
		
		
		
		var position = new THREE.Vector3(x, y, z);
		position.l = l;
		position.b = b;
		position.r = r;

		return position;
	}
	
	return {
		positionAtTime : positionAtTime,
		period : period,
		epoch : KMG.Util.julianNow()
	};
	
};
KMG.VSOP87Orbit.prototype = Object.create( KMG.Orbit.prototype );



KMG.VSOP87OrbitRect = function(X, Y, Z, period) {

	
	function evaluate(terms, t) {
		var v = 0;
		
		var T = 1;
		for (var i = 0; i < terms.length; i++) {
			var s = 0;
			for (var j = 0; j < terms[i].length; j++) {
				s += terms[i][j][0] * Math.cos(terms[i][j][1] + terms[i][j][2] * t);
			}
			v += s * T;
            T = t * T;
		}
		
		return v;
	}

	function positionAtTime(jd) {
		var t = (jd - 2451545) / 365250;

		var x = 0;
		var y = 0; 
		var z = 0;
		
		var T = 1;
		for (var i = 0; i < X.length; i++) {
			var s = 0;
			for (var j = 0; j < X[i].length; j++) {
				s += X[i][j][0] * Math.cos(X[i][j][1] + X[i][j][2] * t);
			}
			x += s * T;
            T = t * T;
		}
		
		
		var T = 1;
		for (var i = 0; i < Y.length; i++) {
			var s = 0;
			for (var j = 0; j < Y[i].length; j++) {
				s += Y[i][j][0] * Math.cos(Y[i][j][1] + Y[i][j][2] * t);
			}
			y += s * T;
            T = t * T;
		}
		
		var T = 1;
		for (var i = 0; i < Z.length; i++) {
			var s = 0;
			for (var j = 0; j < Z[i].length; j++) {
				s += Z[i][j][0] * Math.cos(Z[i][j][1] + Z[i][j][2] * t);
			}
			z += s * T;
            T = t * T;
		}
		
		
		
		var pos = new THREE.Vector3(x, z, -y);

		return pos;
	};
	
	return {
		positionAtTime : positionAtTime,
		period : period,
		epoch : KMG.Util.julianNow()
	};
	
};
KMG.VSOP87OrbitRect.prototype = Object.create( KMG.Orbit.prototype );	

/* File: CustomOrbits.js */
/** Custom and Body-Specific Orbital Algorithms
 * http://www.apoapsys.com
 * 
 * Copyright 2014 Kevin M. Gill <kmsmgill@gmail.com>
 *
 * Uses algorithms from the VSOP87 theory for the orbits
 * of major planets.
 * ftp://ftp.bdl.fr/pub/ephem/planets/vsop87/
 * 
 * Code is also adapted from Celestia source
 * vsop87.cpp
 * customorbit.cpp
 * 
 * Uses algorithms from:
 * Meeus, Jean: Astronomical Algorithms.
 * Richmond, Virg.: Willmann-Bell, 2009.
 * ISBN: 978-0943396613
 * http://amzn.com/0943396611
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */


KMG.OrbitUtil = {};

KMG.OrbitUtil.anomaly = function(meanAnomaly, eccentricity)
{
    var e, delta, err;
    var tol = 0.00000001745;
    var iterations = 20;	// limit while() to maximum of 20 iterations.

    e = meanAnomaly - 2 * Math.PI *  Math.floor(meanAnomaly / (2*Math.PI));
    err = 1;
    while(Math.abs(err) > tol && iterations > 0)
    {
        err = e - eccentricity*Math.sin(e) - meanAnomaly;
        delta = err / (1 - eccentricity * Math.cos(e));
        e -= delta;
        iterations--;
    }

    var trueAnomaly = 2*Math.atan(Math.sqrt((1+eccentricity)/(1-eccentricity))*Math.tan(e/2));
    var eccentricAnomaly = e;
    
    
    return {
		trueAnomaly : trueAnomaly,
		eccentricAnomaly : eccentricAnomaly
	};
};

/**
 * Returns value in radians
 */
KMG.OrbitUtil.meanAnomalySun = function(t)
{
    var t2, a, b;

	t2 = t*  t;
	a = 9.999736042e1 * t;
	b = 360 * (a - Math.floor(a));

    return (3.5847583e2 - (1.5e-4 + 3.3e-6*t)*t2 + b) * KMG.PI_BY_180;
};






KMG.CustomMoonOrbit = function()
{
	KMG.Orbit.call( this );
	

	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.distance;
		
		
	}
	
	function degToRad(d) {
		return d * KMG.PI_BY_180;
	}
	
	function sin(v) {
		return Math.sin(v);
	}
	
	function cos(v) {
		return Math.cos(v);
	}
	
	// Adapted from Celestia: customorbit.cpp "LunarOrbit"
	function positionAtTime(jd) {

		
		var jd19, t, t2;
		var ld, ms, md, de, f, n, hp;
		var a, sa, sn, b, sb, c, sc, e, e2, l, g, w1, w2;
		var m1, m2, m3, m4, m5, m6;
        var eclLon, eclLat, horzPar, distance;
        var RA, dec;

        // Computation requires an abbreviated Julian day:
        // epoch January 0.5, 1900.
        jd19 = jd - 2415020.0;
		t = jd19/36525;
		t2 = t*t;

		m1 = jd19/27.32158213;
		m1 = 360.0*(m1-Math.floor(m1));
		m2 = jd19/365.2596407;
		m2 = 360.0*(m2-Math.floor(m2));
		m3 = jd19/27.55455094;
		m3 = 360.0*(m3-Math.floor(m3));
		m4 = jd19/29.53058868;
		m4 = 360.0*(m4-Math.floor(m4));
		m5 = jd19/27.21222039;
		m5 = 360.0*(m5-Math.floor(m5));
		m6 = jd19/6798.363307;
		m6 = 360.0*(m6-Math.floor(m6));

		ld = 270.434164+m1-(.001133-.0000019*t)*t2;
		ms = 358.475833+m2-(.00015+.0000033*t)*t2;
		md = 296.104608+m3+(.009192+.0000144*t)*t2;
		de = 350.737486+m4-(.001436-.0000019*t)*t2;
		f = 11.250889+m5-(.003211+.0000003*t)*t2;
		n = 259.183275-m6+(.002078+.000022*t)*t2;

		a = degToRad(51.2+20.2*t);
		sa = sin(a);
		sn = sin(degToRad(n));
		b = 346.56+(132.87-.0091731*t)*t;
		sb = .003964*sin(degToRad(b));
		c = degToRad(n+275.05-2.3*t);
		sc = sin(c);
		ld = ld+.000233*sa+sb+.001964*sn;
		ms = ms-.001778*sa;
		md = md+.000817*sa+sb+.002541*sn;
		f = f+sb-.024691*sn-.004328*sc;
		de = de+.002011*sa+sb+.001964*sn;
		e = 1-(.002495+7.52e-06*t)*t;
		e2 = e*e;

		ld = degToRad(ld);
		ms = degToRad(ms);
		n = degToRad(n);
		de = degToRad(de);
		f = degToRad(f);
		md = degToRad(md);

		l = 6.28875*sin(md)+1.27402*sin(2*de-md)+.658309*sin(2*de)+
			.213616*sin(2*md)-e*.185596*sin(ms)-.114336*sin(2*f)+
			.058793*sin(2*(de-md))+.057212*e*sin(2*de-ms-md)+
			.05332*sin(2*de+md)+.045874*e*sin(2*de-ms)+.041024*e*sin(md-ms);
		l = l-.034718*sin(de)-e*.030465*sin(ms+md)+.015326*sin(2*(de-f))-
			.012528*sin(2*f+md)-.01098*sin(2*f-md)+.010674*sin(4*de-md)+
			.010034*sin(3*md)+.008548*sin(4*de-2*md)-e*.00791*sin(ms-md+2*de)-
			e*.006783*sin(2*de+ms);
		l = l+.005162*sin(md-de)+e*.005*sin(ms+de)+.003862*sin(4*de)+
			e*.004049*sin(md-ms+2*de)+.003996*sin(2*(md+de))+
			.003665*sin(2*de-3*md)+e*.002695*sin(2*md-ms)+
			.002602*sin(md-2*(f+de))+e*.002396*sin(2*(de-md)-ms)-
			.002349*sin(md+de);
		l = l+e2*.002249*sin(2*(de-ms))-e*.002125*sin(2*md+ms)-
			e2*.002079*sin(2*ms)+e2*.002059*sin(2*(de-ms)-md)-
			.001773*sin(md+2*(de-f))-.001595*sin(2*(f+de))+
			e*.00122*sin(4*de-ms-md)-.00111*sin(2*(md+f))+.000892*sin(md-3*de);
		l = l-e*.000811*sin(ms+md+2*de)+e*.000761*sin(4*de-ms-2*md)+
				e2*.000704*sin(md-2*(ms+de))+e*.000693*sin(ms-2*(md-de))+
				e*.000598*sin(2*(de-f)-ms)+.00055*sin(md+4*de)+.000538*sin(4*md)+
				e*.000521*sin(4*de-ms)+.000486*sin(2*md-de);
		l = l+e2*.000717*sin(md-2*ms);
			eclLon = ld+degToRad(l);
			eclLon = KMG.Math.clamp(eclLon, 2 * Math.PI);

		g = 5.12819*sin(f)+.280606*sin(md+f)+.277693*sin(md-f)+
			.173238*sin(2*de-f)+.055413*sin(2*de+f-md)+.046272*sin(2*de-f-md)+
			.032573*sin(2*de+f)+.017198*sin(2*md+f)+.009267*sin(2*de+md-f)+
			.008823*sin(2*md-f)+e*.008247*sin(2*de-ms-f);
		g = g+.004323*sin(2*(de-md)-f)+.0042*sin(2*de+f+md)+
			e*.003372*sin(f-ms-2*de)+e*.002472*sin(2*de+f-ms-md)+
			e*.002222*sin(2*de+f-ms)+e*.002072*sin(2*de-f-ms-md)+
			e*.001877*sin(f-ms+md)+.001828*sin(4*de-f-md)-e*.001803*sin(f+ms)-
			.00175*sin(3*f);
		g = g+e*.00157*sin(md-ms-f)-.001487*sin(f+de)-e*.001481*sin(f+ms+md)+
				e*.001417*sin(f-ms-md)+e*.00135*sin(f-ms)+.00133*sin(f-de)+
				.001106*sin(f+3*md)+.00102*sin(4*de-f)+.000833*sin(f+4*de-md)+
				.000781*sin(md-3*f)+.00067*sin(f+4*de-2*md);
		g = g+.000606*sin(2*de-3*f)+.000597*sin(2*(de+md)-f)+
			e*.000492*sin(2*de+md-ms-f)+.00045*sin(2*(md-de)-f)+
			.000439*sin(3*md-f)+.000423*sin(f+2*(de+md))+
			.000422*sin(2*de-f-3*md)-e*.000367*sin(ms+f+2*de-md)-
			e*.000353*sin(ms+f+2*de)+.000331*sin(f+4*de);
		g = g+e*.000317*sin(2*de+f-ms+md)+e2*.000306*sin(2*(de-ms)-f)-
			.000283*sin(md+3*f);
		w1 = .0004664*cos(n);
		w2 = .0000754*cos(c);
		eclLat = degToRad(g)*(1-w1-w2);

		hp = .950724+.051818*cos(md)+.009531*cos(2*de-md)+.007843*cos(2*de)+
			 .002824*cos(2*md)+.000857*cos(2*de+md)+e*.000533*cos(2*de-ms)+
			 e*.000401*cos(2*de-md-ms)+e*.00032*cos(md-ms)-.000271*cos(de)-
			 e*.000264*cos(ms+md)-.000198*cos(2*f-md);
		hp = hp+.000173*cos(3*md)+.000167*cos(4*de-md)-e*.000111*cos(ms)+
			 .000103*cos(4*de-2*md)-.000084*cos(2*md-2*de)-
			 e*.000083*cos(2*de+ms)+.000079*cos(2*de+2*md)+.000072*cos(4*de)+
			 e*.000064*cos(2*de-ms+md)-e*.000063*cos(2*de+ms-md)+
			 e*.000041*cos(ms+de);
		hp = hp+e*.000035*cos(2*md-ms)-.000033*cos(3*md-2*de)-
			 .00003*cos(md+de)-.000029*cos(2*(f-de))-e*.000029*cos(2*md+ms)+
			 e2*.000026*cos(2*(de-ms))-.000023*cos(2*(f-de)+md)+
			 e*.000019*cos(4*de-ms-md);
		horzPar = degToRad(hp);
			
		
		distance = 6378.14 / sin(horzPar) / 149597870.700;
		//console.info("Distance: " + distance);
		// Finally convert eclLat, eclLon to RA, Dec.
        //EclipticToEquatorial(t, eclLat, eclLon, RA, dec);
		
		//var equatorial = KMG.Math.convertEclipticToEquatorial((jd - 2415020.0) / 36525.0, eclLat, eclLon);
		////var RA = equatorial.ra;
		//var dec = equatorial.dec;
		
		/*
		var RA = KMG.Math.clamp(eclLon, 2 * Math.PI);
		var dec = eclLat;
		
        // RA and Dec are referred to the equinox of date; we want to use
        // the J2000 equinox instead.  A better idea would be to directly
        // compute the position of the Moon in this coordinate system, but
        // this was easier.
        var converted = KMG.Math.epochConvert(jd, 2451545.0, RA, dec);
        RA = converted.ra;
        dec = converted.dec;
        
        //EpochConvert(jd, astro::J2000, RA, dec, RA, dec);

        // Corrections for internal coordinate system
        dec -= (Math.PI/2);
        RA += Math.PI;
		
        var pos = new THREE.Vector3(Math.cos(RA) * Math.sin(dec) * distance,
                       Math.cos(dec) * distance,
                       -Math.sin(RA) * Math.sin(dec) * distance);
		
		
		pos.distance = distance;
		return pos;
		*/
		
		var x = distance * Math.cos(eclLat) * Math.cos(eclLon);
        var y = distance * Math.cos(eclLat) * Math.sin(eclLon);
        var z = distance * Math.sin(eclLat);

        return new THREE.Vector3(x, z, -y);
		
		
	}
	

	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 27.321661,
		epoch : KMG.Util.julianNow()
	};
	
};
KMG.CustomMoonOrbit.prototype = Object.create( KMG.Orbit.prototype );







KMG.Jupiter = {};
KMG.Jupiter.radius = 71398.0;

KMG.Jupiter.computeElements = function(t) {
	
	var l1 = 106.07719 + 203.488955790 * t;
	var l2 = 175.73161 + 101.374724735 * t;
	var l3 = 120.55883 + 50.317609207 * t;
	var l4 = 84.44459 + 21.571071177 * t;
	
	var p1 = 97.0881 + 0.16138586 * t;
	var p2 = 154.8663 + 0.04726307 * t;
	var p3 = 188.1840 + 0.00712734 * t;
	var p4 = 335.2868 + 0.00184000 * t;
	
	var w1 = 312.3346 - 0.13279386 * t;
	var w2 = 100.4411 - 0.03263064 * t;
	var w3 = 119.1942 - 0.00717703 * t;
	var w4 = 322.6186 - 0.00175934 * t;
	
	// Principle inequality in the longitude of Jupiter
	var Γ = 0.33033 * KMG.Math.dsin(163.679 + 0.0010512 * t) + 0.03439 * KMG.Math.dsin(34.486 - 0.0161731 * t);
	
	// Phase of free libration
	var Φ = 199.6766 + 0.17379190 * t;
	
	// Longitude of the node of the equator of Jupiter on the ecliptic
	var Ψ = 316.5182 - 0.00000208 * t;
	
	// Mean anomalies of Jupiter and Saturn
	var G = 30.23756 + 0.0830925701 * t + Γ;
	var G_ = 31.97853 + 0.0334597339 * t;
	
	// Longitude of the perihelion of Jupiter
	var Π = 13.469942;
	
	return {
		l1 : l1,
		l2 : l2,
		l3 : l3,
		l4 : l4,
		
		p1 : p1,
		p2 : p2,
		p3 : p3,
		p4 : p4,
		
		w1 : w1,
		w2 : w2,
		w3 : w3,
		w4 : w4,
		
		Γ : Γ,
		Φ : Φ,
		Ψ : Ψ,
		G : G,
		G_ : G_,
		Π : Π
		
	};
	
	
};




KMG.CustomIoOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	}
	
	function degToRad(v) {
		return v * KMG.PI_BY_180;
	}
	
	function positionAtTime(jd) {
		//var t = (jd - 2451545) / 36525;
		var t = jd - 2443000.5;
		//var t = (jd - 2443000.5) / 36525;
		var e = KMG.Jupiter.computeElements(t);
		
		var LPEJ = e.Π;
		
		// Calculate periodic terms for longitude
		var Σ1 = 0.47259*KMG.Math.dsin(2*(e.l1 - e.l2)) - 0.03478*KMG.Math.dsin(e.p3 - e.p4)
				+ 0.01081*KMG.Math.dsin(e.l2 - 2*e.l3 + e.p3) + 7.38e-3*KMG.Math.dsin(e.Φ)
				+ 7.13e-3*KMG.Math.dsin(e.l2 - 2*e.l3 + e.p2) - 6.74e-3*KMG.Math.dsin(e.p1 + e.p3 - 2*LPEJ - 2*e.G)
				+ 6.66e-3*KMG.Math.dsin(e.l2 - 2*e.l3 + e.p4) + 4.45e-3*KMG.Math.dsin(e.l1 - e.p3)
				- 3.54e-3*KMG.Math.dsin(e.l1 - e.l2) - 3.17e-3*KMG.Math.dsin(2*(e.Ψ - LPEJ))
				+ 2.65e-3*KMG.Math.dsin(e.l1 - e.p4) - 1.86e-3*KMG.Math.dsin(e.G)
				+ 1.62e-3*KMG.Math.dsin(e.p2 - e.p3) + 1.58e-3*KMG.Math.dsin(4*(e.l1 - e.l2))
				- 1.55e-3*KMG.Math.dsin(e.l1 - e.l3) - 1.38e-3*KMG.Math.dsin(e.Ψ + e.w3 - 2*LPEJ - 2*e.G)
				- 1.15e-3*KMG.Math.dsin(2*(e.l1 - 2*e.l2 + e.w2)) + 8.9e-4*KMG.Math.dsin(e.p2 - e.p4)
				+ 8.5e-4*KMG.Math.dsin(e.l1 + e.p3 - 2*LPEJ - 2*e.G) + 8.3e-4*KMG.Math.dsin(e.w2 - e.w3)
				+ 5.3e-4*KMG.Math.dsin(e.Ψ - e.w2);
		Σ1 = KMG.Math.clamp(Σ1, 360.0);
		//Σ1 = degToRad(Σ1);
		var L = e.l1 + Σ1;

		// Calculate periodic terms for the tangent of the latitude
		var B = 6.393e-4*KMG.Math.dsin(L - e.w1) + 1.825e-4*KMG.Math.dsin(L - e.w2)
			+ 3.29e-5*KMG.Math.dsin(L - e.w3) - 3.11e-5*KMG.Math.dsin(L - e.Ψ)
			+ 9.3e-6*KMG.Math.dsin(L - e.w4) + 7.5e-6*KMG.Math.dsin(3*L - 4*e.l2 - 1.9927*Σ1 + e.w2)
			+ 4.6e-6*KMG.Math.dsin(L + e.Ψ - 2*LPEJ - 2*e.G);
		B = KMG.Math.datan(B);

		// Calculate the periodic terms for distance
		var R = -4.1339e-3*KMG.Math.dcos(2*(e.l1 - e.l2)) - 3.87e-5*KMG.Math.dcos(e.l1 - e.p3)
		  - 2.14e-5*KMG.Math.dcos(e.l1 - e.p4) + 1.7e-5*KMG.Math.dcos(e.l1 - e.l2)
		  - 1.31e-5*KMG.Math.dcos(4*(e.l1 - e.l2)) + 1.06e-5*KMG.Math.dcos(e.l1 - e.l3)
		  - 6.6e-6*KMG.Math.dcos(e.l1 + e.p3 - 2*LPEJ - 2*e.G);
		R = 5.90569 * KMG.Jupiter.radius * (1 + R) / KMG.AU_TO_KM;

		var T = (jd - 2433282.423) / 36525.0;
		var P = 1.3966626*T + 3.088e-4*T*T;
		L += P;

		//L += 22.203;
	
		
		L = L * KMG.PI_BY_180;
		B = B * KMG.PI_BY_180;
		
		B -= Math.PI / 2;
        L += Math.PI;
		
		var x = Math.cos(L) * Math.sin(B) * R;
		var y = Math.cos(B) * R;
		var z = -Math.sin(L) * Math.sin(B) * R;

		var position = new THREE.Vector3(x, y, z);
		position.l = L;
		position.b = B;
		position.r = R;
		return position;
	}
	

	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 1.769138,
		epoch : KMG.Util.julianNow()
	};
	
};
KMG.CustomIoOrbit.prototype = Object.create( KMG.Orbit.prototype );



KMG.CustomEuropaOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	}
	
	function degToRad(v) {
		return v * KMG.PI_BY_180;
	}
	
	function positionAtTime(jd) {
		//var t = (jd - 2451545) / 36525;
		var t = (jd - 2443000.5);// / 36525;
		var e = KMG.Jupiter.computeElements(t);
		
		var LPEJ = e.Π;
		
		
		// Calculate periodic terms for lone.Gitude
		var Σ1 = 1.06476*KMG.Math.dsin(2*(e.l2 - e.l3)) + 0.04256*KMG.Math.dsin(e.l1 - 2*e.l2 + e.p3)
			  + 0.03581*KMG.Math.dsin(e.l2 - e.p3) + 0.02395*KMG.Math.dsin(e.l1 - 2*e.l2 + e.p4)
			  + 0.01984*KMG.Math.dsin(e.l2 - e.p4) - 0.01778*KMG.Math.dsin(e.Φ)
			  + 0.01654*KMG.Math.dsin(e.l2 - e.p2) + 0.01334*KMG.Math.dsin(e.l2 - 2*e.l3 + e.p2)
			  + 0.01294*KMG.Math.dsin(e.p3 - e.p4) - 0.01142*KMG.Math.dsin(e.l2 - e.l3)
			  - 0.01057*KMG.Math.dsin(e.G) - 7.75e-3*KMG.Math.dsin(2*(e.Ψ - LPEJ))
			  + 5.24e-3*KMG.Math.dsin(2*(e.l1 - e.l2)) - 4.6e-3*KMG.Math.dsin(e.l1 - e.l3)
			  + 3.16e-3*KMG.Math.dsin(e.Ψ - 2*e.G + e.w3 - 2*LPEJ) - 2.03e-3*KMG.Math.dsin(e.p1 + e.p3 - 2*LPEJ - 2*e.G)
			  + 1.46e-3*KMG.Math.dsin(e.Ψ - e.w3) - 1.45e-3*KMG.Math.dsin(2*e.G)
			  + 1.25e-3*KMG.Math.dsin(e.Ψ - e.w4) - 1.15e-3*KMG.Math.dsin(e.l1 - 2*e.l3 + e.p3)
			  - 9.4e-4*KMG.Math.dsin(2*(e.l2 - e.w2)) + 8.6e-4*KMG.Math.dsin(2*(e.l1 - 2*e.l2 + e.w2))
			  - 8.6e-4*KMG.Math.dsin(5*e.G_ - 2*e.G + 0.9115) - 7.8e-4*KMG.Math.dsin(e.l2 - e.l4)
			  - 6.4e-4*KMG.Math.dsin(3*e.l3 - 7*e.l4 + 4*e.p4) + 6.4e-4*KMG.Math.dsin(e.p1 - e.p4)
			  - 6.3e-4*KMG.Math.dsin(e.l1 - 2*e.l3 + e.p4) + 5.8e-4*KMG.Math.dsin(e.w3 - e.w4)
			  + 5.6e-4*KMG.Math.dsin(2*(e.Ψ - LPEJ - e.G)) + 5.6e-4*KMG.Math.dsin(2*(e.l2 - e.l4))
			  + 5.5e-4*KMG.Math.dsin(2*(e.l1 - e.l3)) + 5.2e-4*KMG.Math.dsin(3*e.l3 - 7*e.l4 + e.p3 +3*e.p4)
			  - 4.3e-4*KMG.Math.dsin(e.l1 - e.p3) + 4.1e-4*KMG.Math.dsin(5*(e.l2 - e.l3))
			  + 4.1e-4*KMG.Math.dsin(e.p4 - LPEJ) + 3.2e-4*KMG.Math.dsin(e.w2 - e.w3)
			  + 3.2e-4*KMG.Math.dsin(2*(e.l3 - e.G - LPEJ));
		Σ1 = KMG.Math.clamp(Σ1, 360.0);
		//Σ1 = dee.GToRad(Σ1);
		var L = e.l2 + Σ1;

		// Calculate periodic terms for the tane.Gent of the latitude
		var B = 8.1004e-3*KMG.Math.dsin(L - e.w2) + 4.512e-4*KMG.Math.dsin(L - e.w3)
		  - 3.284e-4*KMG.Math.dsin(L - e.Ψ) + 1.160e-4*KMG.Math.dsin(L - e.w4)
		  + 2.72e-5*KMG.Math.dsin(e.l1 - 2*e.l3 + 1.0146*Σ1 + e.w2) - 1.44e-5*KMG.Math.dsin(L - e.w1)
		  + 1.43e-5*KMG.Math.dsin(L + e.Ψ - 2*LPEJ - 2*e.G) + 3.5e-6*KMG.Math.dsin(L - e.Ψ + e.G)
		  - 2.8e-6*KMG.Math.dsin(e.l1 - 2*e.l3 + 1.0146*Σ1 + e.w3);
		B = KMG.Math.datan(B);

		// Calculate the periodic terms for distance
		var R = 9.3848e-3*KMG.Math.dcos(e.l1 - e.l2) - 3.116e-4*KMG.Math.dcos(e.l2 - e.p3)
		  - 1.744e-4*KMG.Math.dcos(e.l2 - e.p4) - 1.442e-4*KMG.Math.dcos(e.l2 - e.p2)
		  + 5.53e-5*KMG.Math.dcos(e.l2 - e.l3) + 5.23e-5*KMG.Math.dcos(e.l1 - e.l3)
		  - 2.9e-5*KMG.Math.dcos(2*(e.l1 - e.l2)) + 1.64e-5*KMG.Math.dcos(2*(e.l2 - e.w2))
		  + 1.07e-5*KMG.Math.dcos(e.l1 - 2*e.l3 + e.p3) - 1.02e-5*KMG.Math.dcos(e.l2 - e.p1)
		  - 9.1e-6*KMG.Math.dcos(2*(e.l1 - e.l3));
		R = 9.39657 * KMG.Jupiter.radius * (1 + R) / KMG.AU_TO_KM;

		var T = (jd - 2433282.423) / 36525.0;
		var P = 1.3966626*T + 3.088e-4*T*T;
		L += P;
		//L += dee.GToRad(P);
		//L += 22.203;
		
		
		//console.info([L, B, R]);
		
		L = L * KMG.PI_BY_180;
		B = B * KMG.PI_BY_180;
		
		B -= Math.PI / 2;
        L += Math.PI;
                   
		var x = Math.cos(L) * Math.sin(B) * R;
		var y = Math.cos(B) * R;
		var z = -Math.sin(L) * Math.sin(B) * R;

		var position = new THREE.Vector3(x, y, z);
		position.l = L;
		position.b = B;
		position.r = R;
		return position;
	};
	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 3.5511810791,
		epoch : KMG.Util.julianNow()
	};
	
	
};
KMG.CustomEuropaOrbit.prototype = Object.create( KMG.Orbit.prototype );





KMG.CustomGanymedeOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	}
	
	function degToRad(v) {
		return v * KMG.PI_BY_180;
	}
	
	function positionAtTime(jd) {
		//var t = (jd - 2451545) / 36525;
		var t = (jd - 2443000.5);// / 36525;
		var e = KMG.Jupiter.computeElements(t);
		
		var LPEJ = e.Π;
		var psi = e.Ψ;
		var phi = e.Φ;

		  
		  
		//Calculate periodic terms for lone.Gitude
		var Σ1 = 0.1649*KMG.Math.dsin(e.l3 - e.p3) + 0.09081*KMG.Math.dsin(e.l3 - e.p4)
			  - 0.06907*KMG.Math.dsin(e.l2 - e.l3) + 0.03784*KMG.Math.dsin(e.p3 - e.p4)
			  + 0.01846*KMG.Math.dsin(2*(e.l3 - e.l4)) - 0.01340*KMG.Math.dsin(e.G)
			  - 0.01014*KMG.Math.dsin(2*(psi - LPEJ)) + 7.04e-3*KMG.Math.dsin(e.l2 - 2*e.l3 + e.p3)
			  - 6.2e-3*KMG.Math.dsin(e.l2 - 2*e.l3 + e.p2) - 5.41e-3*KMG.Math.dsin(e.l3 - e.l4)
			  + 3.81e-3*KMG.Math.dsin(e.l2 - 2*e.l3 + e.p4) + 2.35e-3*KMG.Math.dsin(psi - e.w3)
			  + 1.98e-3*KMG.Math.dsin(psi - e.w4) + 1.76e-3*KMG.Math.dsin(phi)
			  + 1.3e-3*KMG.Math.dsin(3*(e.l3 - e.l4)) + 1.25e-3*KMG.Math.dsin(e.l1 - e.l3)
			  - 1.19e-3*KMG.Math.dsin(5*e.G_ - 2*e.G + 0.9115) + 1.09e-3*KMG.Math.dsin(e.l1 - e.l2)
			  - 1.0e-3*KMG.Math.dsin(3*e.l3 - 7*e.l4 + 4*e.p4) + 9.1e-4*KMG.Math.dsin(e.w3 - e.w4)
			  + 8.0e-4*KMG.Math.dsin(3*e.l3 - 7*e.l4 + e.p3 + 3*e.p4) - 7.5e-4*KMG.Math.dsin(2*e.l2 - 3*e.l3 + e.p3)
			  + 7.2e-4*KMG.Math.dsin(e.p1 + e.p3 - 2*LPEJ - 2*e.G) + 6.9e-4*KMG.Math.dsin(e.p4 - LPEJ)
			  - 5.8e-4*KMG.Math.dsin(2*e.l3 - 3*e.l4 + e.p4) - 5.7e-4*KMG.Math.dsin(e.l3 - 2*e.l4 + e.p4)
			  + 5.6e-4*KMG.Math.dsin(e.l3 + e.p3 - 2*LPEJ - 2*e.G) - 5.2e-4*KMG.Math.dsin(e.l2 - 2*e.l3 + e.p1)
			  - 5.0e-4*KMG.Math.dsin(e.p2 - e.p3) + 4.8e-4*KMG.Math.dsin(e.l3 - 2*e.l4 + e.p3)
			  - 4.5e-4*KMG.Math.dsin(2*e.l2 - 3*e.l3 + e.p4) - 4.1e-4*KMG.Math.dsin(e.p2 - e.p4)
			  - 3.8e-4*KMG.Math.dsin(2*e.G) - 3.7e-4*KMG.Math.dsin(e.p3 - e.p4 + e.w3 - e.w4)
			  - 3.2e-4*KMG.Math.dsin(3*e.l3 - 7*e.l4 + 2*e.p3 + 2*e.p4) + 3.0e-4*KMG.Math.dsin(4*(e.l3 - e.l4))
			  + 2.9e-4*KMG.Math.dsin(e.l3 + e.p4 - 2*LPEJ - 2*e.G) - 2.8e-4*KMG.Math.dsin(e.w3 + psi - 2*LPEJ - 2*e.G)
			  + 2.6e-4*KMG.Math.dsin(e.l3 - LPEJ - e.G) + 2.4e-4*KMG.Math.dsin(e.l2 - 3*e.l3 + 2*e.l4)
			  + 2.1e-4*KMG.Math.dsin(2*(e.l3 - LPEJ - e.G)) - 2.1e-4*KMG.Math.dsin(e.l3 - e.p2)
			  + 1.7e-4*KMG.Math.dsin(e.l3 - e.p3);
		Σ1 = KMG.Math.clamp(Σ1, 360.0);
		//sie.Gma = dee.GToRad(sie.Gma);
		var L = e.l3 + Σ1;

		//Calculate periodic terms for the tane.Gent of the latitude
		var B = 3.2402e-3*KMG.Math.dsin(L - e.w3) - 1.6911e-3*KMG.Math.dsin(L - psi)
		  + 6.847e-4*KMG.Math.dsin(L - e.w4) - 2.797e-4*KMG.Math.dsin(L - e.w2)
		  + 3.21e-5*KMG.Math.dsin(L + psi - 2*LPEJ - 2*e.G) + 5.1e-6*KMG.Math.dsin(L - psi + e.G)
		  - 4.5e-6*KMG.Math.dsin(L - psi - e.G) - 4.5e-6*KMG.Math.dsin(L + psi - 2*LPEJ)
		  + 3.7e-6*KMG.Math.dsin(L + psi - 2*LPEJ - 3*e.G) + 3.0e-6*KMG.Math.dsin(2*e.l2 - 3*L + 4.03*Σ1 + e.w2)
		  - 2.1e-6*KMG.Math.dsin(2*e.l2 - 3*L + 4.03*Σ1 + e.w3);
		B = KMG.Math.datan(B);

		//Calculate the periodic terms for distance
		var R = -1.4388e-3*KMG.Math.dcos(e.l3 - e.p3) - 7.919e-4*KMG.Math.dcos(e.l3 - e.p4)
		  + 6.342e-4*KMG.Math.dcos(e.l2 - e.l3) - 1.761e-4*KMG.Math.dcos(2*(e.l3 - e.l4))
		  + 2.94e-5*KMG.Math.dcos(e.l3 - e.l4) - 1.56e-5*KMG.Math.dcos(3*(e.l3 - e.l4))
		  + 1.56e-5*KMG.Math.dcos(e.l1 - e.l3) - 1.53e-5*KMG.Math.dcos(e.l1 - e.l2)
		  + 7.0e-6*KMG.Math.dcos(2*e.l2 - 3*e.l3 + e.p3) - 5.1e-6*KMG.Math.dcos(e.l3 + e.p3 - 2*LPEJ - 2*e.G);
		R = 14.98832 * KMG.Jupiter.radius * (1 + R) / KMG.AU_TO_KM;
		
		var T = (jd - 2433282.423) / 36525.0;
		var P = 1.3966626*T + 3.088e-4*T*T;
		L += P;
		//L += dee.GToRad(P);

		//L += JupAscendingNode;
		  
		
		//console.info([L, B, R]);
		
		L = L * KMG.PI_BY_180;
		B = B * KMG.PI_BY_180;
		
		B -= Math.PI / 2;
        L += Math.PI;
                   
		var x = Math.cos(L) * Math.sin(B) * R;
		var y = Math.cos(B) * R;
		var z = -Math.sin(L) * Math.sin(B) * R;

		var position = new THREE.Vector3(x, y, z);
		position.l = L;
		position.b = B;
		position.r = R;
		return position;
	};
	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 3.5511810791,
		epoch : KMG.Util.julianNow()
	};
	
	
};
KMG.CustomGanymedeOrbit.prototype = Object.create( KMG.Orbit.prototype );




KMG.CustomCallistoOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	}
	
	function degToRad(v) {
		return v * KMG.PI_BY_180;
	}
	
	function positionAtTime(jd) {
		//var t = (jd - 2451545) / 36525;
		var t = (jd - 2443000.5);// / 36525;
		var e = KMG.Jupiter.computeElements(t);
		
		var LPEJ = e.Π;
		var psi = e.Ψ;
		var phi = e.Φ;

		  
		  
		//Calculate periodic terms for lone.Gitude
		var Σ1 =
			0.84287*KMG.Math.dsin(e.l4 - e.p4)
			+ 0.03431*KMG.Math.dsin(e.p4 - e.p3)
			- 0.03305*KMG.Math.dsin(2*(psi - LPEJ))
			- 0.03211*KMG.Math.dsin(e.G)
			- 0.01862*KMG.Math.dsin(e.l4 - e.p3)
			+ 0.01186*KMG.Math.dsin(psi - e.w4)
			+ 6.23e-3*KMG.Math.dsin(e.l4 + e.p4 - 2*e.G - 2*LPEJ)
			+ 3.87e-3*KMG.Math.dsin(2*(e.l4 - e.p4))
			- 2.84e-3*KMG.Math.dsin(5*e.G_ - 2*e.G + 0.9115)
			- 2.34e-3*KMG.Math.dsin(2*(psi - e.p4))
			- 2.23e-3*KMG.Math.dsin(e.l3 - e.l4)
			- 2.08e-3*KMG.Math.dsin(e.l4 - LPEJ)
			+ 1.78e-3*KMG.Math.dsin(psi + e.w4 - 2*e.p4)
			+ 1.34e-3*KMG.Math.dsin(e.p4 - LPEJ)
			+ 1.25e-3*KMG.Math.dsin(2*(e.l4 - e.G - LPEJ))
			- 1.17e-3*KMG.Math.dsin(2*e.G)
			- 1.12e-3*KMG.Math.dsin(2*(e.l3 - e.l4))
			+ 1.07e-3*KMG.Math.dsin(3*e.l3 - 7*e.l4 + 4*e.p4)
			+ 1.02e-3*KMG.Math.dsin(e.l4 - e.G - LPEJ)
			+ 9.6e-4*KMG.Math.dsin(2*e.l4 - psi - e.w4)
			+ 8.7e-4*KMG.Math.dsin(2*(psi - e.w4))
			- 8.5e-4*KMG.Math.dsin(3*e.l3 - 7*e.l4 + e.p3 + 3*e.p4)
			+ 8.5e-4*KMG.Math.dsin(e.l3 - 2*e.l4 + e.p4)
			- 8.1e-4*KMG.Math.dsin(2*(e.l4 - psi))
			+ 7.1e-4*KMG.Math.dsin(e.l4 + e.p4 - 2*LPEJ - 3*e.G)
			+ 6.1e-4*KMG.Math.dsin(e.l1 - e.l4)
			- 5.6e-4*KMG.Math.dsin(psi - e.w3)
			- 5.4e-4*KMG.Math.dsin(e.l3 - 2*e.l4 + e.p3)
			+ 5.1e-4*KMG.Math.dsin(e.l2 - e.l4)
			+ 4.2e-4*KMG.Math.dsin(2*(psi - e.G - LPEJ))
			+ 3.9e-4*KMG.Math.dsin(2*(e.p4 - e.w4))
			+ 3.6e-4*KMG.Math.dsin(psi + LPEJ - e.p4 - e.w4)
			+ 3.5e-4*KMG.Math.dsin(2*e.G_ - e.G + 3.2877)
			- 3.5e-4*KMG.Math.dsin(e.l4 - e.p4 + 2*LPEJ - 2*psi)
			- 3.2e-4*KMG.Math.dsin(e.l4 + e.p4 - 2*LPEJ - e.G)
			+ 3.0e-4*KMG.Math.dsin(2*e.G_ - 2*e.G + 2.6032)
			+ 2.9e-4*KMG.Math.dsin(3*e.l3 - 7*e.l4 + 2*e.p3 + 2*e.p4)
			+ 2.8e-4*KMG.Math.dsin(e.l4 - e.p4 + 2*psi - 2*LPEJ)
			- 2.8e-4*KMG.Math.dsin(2*(e.l4 - e.w4))
			- 2.7e-4*KMG.Math.dsin(e.p3 - e.p4 + e.w3 - e.w4)
			- 2.6e-4*KMG.Math.dsin(5*e.G_ - 3*e.G + 3.2877)
			+ 2.5e-4*KMG.Math.dsin(e.w4 - e.w3)
			- 2.5e-4*KMG.Math.dsin(e.l2 - 3*e.l3 + 2*e.l4)
			- 2.3e-4*KMG.Math.dsin(3*(e.l3 - e.l4))
			+ 2.1e-4*KMG.Math.dsin(2*e.l4 - 2*LPEJ - 3*e.G)
			- 2.1e-4*KMG.Math.dsin(2*e.l3 - 3*e.l4 + e.p4)
			+ 1.9e-4*KMG.Math.dsin(e.l4 - e.p4 - e.G)
			- 1.9e-4*KMG.Math.dsin(2*e.l4 - e.p3 - e.p4)
			- 1.8e-4*KMG.Math.dsin(e.l4 - e.p4 + e.G)
			- 1.6e-4*KMG.Math.dsin(e.l4 + e.p3 - 2*LPEJ - 2*e.G);
		Σ1 = KMG.Math.clamp(Σ1, 360.0);
		//Σ1 = dee.GToRad(Σ1);
		var L = e.l4 + Σ1;

		//Calculate periodic terms for the tane.Gent of the latitude
		var B =
			- 7.6579e-3 * KMG.Math.dsin(L - psi)
			+ 4.4134e-3 * KMG.Math.dsin(L - e.w4)
			- 5.112e-4  * KMG.Math.dsin(L - e.w3)
			+ 7.73e-5   * KMG.Math.dsin(L + psi - 2*LPEJ - 2*e.G)
			+ 1.04e-5   * KMG.Math.dsin(L - psi + e.G)
			- 1.02e-5   * KMG.Math.dsin(L - psi - e.G)
			+ 8.8e-6    * KMG.Math.dsin(L + psi - 2*LPEJ - 3*e.G)
			- 3.8e-6    * KMG.Math.dsin(L + psi - 2*LPEJ - e.G);
		B = KMG.Math.datan(B);

		//Calculate the periodic terms for distance
		var R =
			- 7.3546e-3 * KMG.Math.dcos(e.l4 - e.p4)
			+ 1.621e-4  * KMG.Math.dcos(e.l4 - e.p3)
			+ 9.74e-5   * KMG.Math.dcos(e.l3 - e.l4)
			- 5.43e-5   * KMG.Math.dcos(e.l4 + e.p4 - 2*LPEJ - 2*e.G)
			- 2.71e-5   * KMG.Math.dcos(2*(e.l4 - e.p4))
			+ 1.82e-5   * KMG.Math.dcos(e.l4 - LPEJ)
			+ 1.77e-5   * KMG.Math.dcos(2*(e.l3 - e.l4))
			- 1.67e-5   * KMG.Math.dcos(2*e.l4 - psi - e.w4)
			+ 1.67e-5   * KMG.Math.dcos(psi - e.w4)
			- 1.55e-5   * KMG.Math.dcos(2*(e.l4 - LPEJ - e.G))
			+ 1.42e-5   * KMG.Math.dcos(2*(e.l4 - psi))
			+ 1.05e-5   * KMG.Math.dcos(e.l1 - e.l4)
			+ 9.2e-6    * KMG.Math.dcos(e.l2 - e.l4)
			- 8.9e-6    * KMG.Math.dcos(e.l4 - LPEJ -e.G)
			- 6.2e-6    * KMG.Math.dcos(e.l4 + e.p4 - 2*LPEJ - 3*e.G)
			+ 4.8e-6    * KMG.Math.dcos(2*(e.l4 - e.w4));

		R = 26.36273 * KMG.Jupiter.radius * (1 + R) / KMG.AU_TO_KM;
		var T = (jd - 2433282.423) / 36525.0;
		var P = 1.3966626*T + 3.088e-4*T*T;
		L += P;
		//L += degToRad(P);

		//L += JupAscendingNode;
		  
		
		//console.info([L, B, R]);
		
		L = L * KMG.PI_BY_180;
		B = B * KMG.PI_BY_180;
		
		B -= Math.PI / 2;
        L += Math.PI;
                   
		var x = Math.cos(L) * Math.sin(B) * R;
		var y = Math.cos(B) * R;
		var z = -Math.sin(L) * Math.sin(B) * R;

		var position = new THREE.Vector3(x, y, z);
		position.l = L;
		position.b = B;
		position.r = R;
		return position;
	};
	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 3.5511810791,
		epoch : KMG.Util.julianNow()
	};
	
	
};
KMG.CustomCallistoOrbit.prototype = Object.create( KMG.Orbit.prototype );





KMG.Saturn = {};
KMG.Saturn.radius = 60330.0;
KMG.Saturn.ascendingNode = 168.8112;
KMG.Saturn.tilt = 28.0817;

KMG.Saturn.computeSaturnElements = function(t) {
	
	
};


KMG.Saturn.saturnMoonPosition = function(lam, gam, Om, r) {
	
	
};


KMG.CustomMimasOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	};
	
	
	function positionAtTime(jd) {
		
	};
	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 0,
		epoch : KMG.Util.julianNow()
	};
	
	
};
KMG.CustomMimasOrbit.prototype = Object.create( KMG.Orbit.prototype );
	
	

KMG.CustomEnceladusOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	};
	
	
	function positionAtTime(jd) {
		
	};
	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 0,
		epoch : KMG.Util.julianNow()
	};
	
	
};
KMG.CustomEnceladusOrbit.prototype = Object.create( KMG.Orbit.prototype );



KMG.CustomTethysOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	};
	
	
	function positionAtTime(jd) {
		
	};
	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 0,
		epoch : KMG.Util.julianNow()
	};
	
	
};
KMG.CustomTethysOrbit.prototype = Object.create( KMG.Orbit.prototype );



KMG.CustomDioneOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	};
	
	
	function positionAtTime(jd) {
		
	};
	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 0,
		epoch : KMG.Util.julianNow()
	};
	
	
};
KMG.CustomDioneOrbit.prototype = Object.create( KMG.Orbit.prototype );



KMG.CustomRheaOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	};
	
	
	function positionAtTime(jd) {
		
	};
	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 0,
		epoch : KMG.Util.julianNow()
	};
	
	
};
KMG.CustomRheaOrbit.prototype = Object.create( KMG.Orbit.prototype );


KMG.CustomTitanOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	};
	
	
	function positionAtTime(jd) {
		
	};
	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 15.94544758,
		epoch : KMG.Util.julianNow()
	};
	
	
};
KMG.CustomTitanOrbit.prototype = Object.create( KMG.Orbit.prototype );
	
	
	
	
	

KMG.CustomHyperionOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	};
	
	
	function positionAtTime(jd) {
		
	};
	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 0,
		epoch : KMG.Util.julianNow()
	};
	
	
};
KMG.CustomHyperionOrbit.prototype = Object.create( KMG.Orbit.prototype );



KMG.CustomIapetusOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	};
	
	
	function positionAtTime(jd) {
		
	};
	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 0,
		epoch : KMG.Util.julianNow()
	};
	
	
};
KMG.CustomIapetusOrbit.prototype = Object.create( KMG.Orbit.prototype );



KMG.CustomPhoebeOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	};
	
	
	function positionAtTime(jd) {
		
	};
	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 0,
		epoch : KMG.Util.julianNow()
	};
	
	
};
KMG.CustomPhoebeOrbit.prototype = Object.create( KMG.Orbit.prototype );







// ftp://ftp.imcce.fr/pub/ephem/planets/pluto95/pluto.doc
KMG.CustomPlutoOrbit = function() {
	KMG.Orbit.call( this );
	
	function distanceAtTime(jd) {
		var pos = positionAtTime(jd);
		return pos.r;
	};
	
	
	function positionAtTime(jd) {
		
	};
	
	return {
		positionAtTime : positionAtTime,
		distanceAtTime : distanceAtTime,
		period : 0,
		epoch : KMG.Util.julianNow()
	};
	
	
};
KMG.CustomPlutoOrbit.prototype = Object.create( KMG.Orbit.prototype );





KMG.CustomOrbits = {};

KMG.CustomOrbits.sun = function() {
	return new KMG.VSOP87OrbitRect(KMG.VSOPSeries.sun_X, KMG.VSOPSeries.sun_Y, KMG.VSOPSeries.sun_Z, 0);
};

KMG.CustomOrbits.mercury = function() {
	return new KMG.VSOP87Orbit(KMG.VSOPSeries.mercury_L, KMG.VSOPSeries.mercury_B, KMG.VSOPSeries.mercury_R, 87.9522);
};

KMG.CustomOrbits.venus = function() {
	return new KMG.VSOP87Orbit(KMG.VSOPSeries.venus_L, KMG.VSOPSeries.venus_B, KMG.VSOPSeries.venus_R, 224.7018);
};

KMG.CustomOrbits.earth = function() {
	return new KMG.VSOP87Orbit(KMG.VSOPSeries.earth_L, KMG.VSOPSeries.earth_B, KMG.VSOPSeries.earth_R, 365.25);
};

KMG.CustomOrbits.moon = function() {
	return new KMG.CustomMoonOrbit();
};

KMG.CustomOrbits.mars = function() {
	return new KMG.VSOP87Orbit(KMG.VSOPSeries.mars_L, KMG.VSOPSeries.mars_B, KMG.VSOPSeries.mars_R, 689.998725);
};

KMG.CustomOrbits.ceres = function() {
	return new KMG.EllipticalOrbit(KMG.OrbitDefinitions.ceres);
};

KMG.CustomOrbits.vesta = function() {
	return new KMG.EllipticalOrbit(KMG.OrbitDefinitions.vesta);
};

KMG.CustomOrbits.jupiter = function() {
	return new KMG.VSOP87Orbit(KMG.VSOPSeries.jupiter_L, KMG.VSOPSeries.jupiter_B, KMG.VSOPSeries.jupiter_R, 4332.66855);
};

KMG.CustomOrbits.ganymede = function() {
	return new KMG.CustomGanymedeOrbit();
};

KMG.CustomOrbits.io = function() {
	return new KMG.CustomIoOrbit();
};

KMG.CustomOrbits.callisto = function() {
	return new KMG.CustomCallistoOrbit();
};

KMG.CustomOrbits.europa = function() {
	return new KMG.CustomEuropaOrbit();
};



KMG.CustomOrbits.saturn = function() {
	return new KMG.VSOP87Orbit(KMG.VSOPSeries.saturn_L, KMG.VSOPSeries.saturn_B, KMG.VSOPSeries.saturn_R, 10759.42493);
};

KMG.CustomOrbits.titan = function() {
	//return new KMG.CustomTitanOrbit();
	return new KMG.EllipticalOrbit(KMG.OrbitDefinitions.titan);
};

KMG.CustomOrbits.uranus = function() {
	return new KMG.VSOP87Orbit(KMG.VSOPSeries.uranus_L, KMG.VSOPSeries.uranus_B, KMG.VSOPSeries.uranus_R, 30686.07698);
};

KMG.CustomOrbits.neptune = function() {
	return new KMG.VSOP87Orbit(KMG.VSOPSeries.neptune_L, KMG.VSOPSeries.neptune_B, KMG.VSOPSeries.neptune_R, 60190.64325);
};

KMG.CustomOrbits.pluto = function() {
	return new KMG.EllipticalOrbit(KMG.OrbitDefinitions.pluto);
};

KMG.CustomOrbits.sedna = function() {
	return new KMG.EllipticalOrbit(KMG.OrbitDefinitions.sedna);
};

KMG.CustomOrbits.makemake = function() {
	return new KMG.EllipticalOrbit(KMG.OrbitDefinitions.makemake);
};

KMG.CustomOrbits.haumea = function() {
	return new KMG.EllipticalOrbit(KMG.OrbitDefinitions.haumea);
};

KMG.CustomOrbits.eris = function() {
	return new KMG.EllipticalOrbit(KMG.OrbitDefinitions.eris);
};






KMG.CustomOrbitProxy = function(orbit)
{
	KMG.Orbit.call( this );
	
	return {
		positionAtTime : orbit.positionAtTime,
		distanceAtTime : orbit.distanceAtTime,
		period : orbit.period,
		epoch : orbit.epoch
	};
	
};
KMG.CustomOrbitProxy.prototype = Object.create( KMG.Orbit.prototype );


KMG.CustomSunOrbit = function()
{
	return KMG.CustomOrbitProxy.call( this, KMG.CustomOrbits.sun() );
};

KMG.CustomMercuryOrbit = function()
{
	return KMG.CustomOrbitProxy.call( this, KMG.CustomOrbits.mercury() );
};

KMG.CustomVenusOrbit = function()
{
	return KMG.CustomOrbitProxy.call( this, KMG.CustomOrbits.venus() );
};

KMG.CustomEarthOrbit = function()
{
	return KMG.CustomOrbitProxy.call( this, KMG.CustomOrbits.earth() );
};

KMG.CustomMarsOrbit = function()
{
	return KMG.CustomOrbitProxy.call( this, KMG.CustomOrbits.mars() );
};

KMG.CustomJupiterOrbit = function()
{
	return KMG.CustomOrbitProxy.call( this, KMG.CustomOrbits.jupiter() );
};


KMG.CustomSaturnOrbit = function()
{
	return KMG.CustomOrbitProxy.call( this, KMG.CustomOrbits.saturn() );
};

KMG.CustomUranusOrbit = function()
{
	return KMG.CustomOrbitProxy.call( this, KMG.CustomOrbits.uranus() );
};

KMG.CustomNeptuneOrbit = function()
{
	return KMG.CustomOrbitProxy.call( this, KMG.CustomOrbits.neptune() );
};

/* File: IAURotation.js */
/** IAU Rotational Elements
 * Lunar Algorithms
 * http://www.apoapsys.com
 * 
 * Copyright 2014 Kevin M. Gill <kmsmgill@gmail.com>
 *
 * Uses algorithms from:
 * Report of the IAU Working Group on Cartographic Coordinates and Rotational Elements: 2009
 * http://astrogeology.usgs.gov/groups/iau-wgccre
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */




KMG.IAU_SECULAR_TERM_VALID_CENTURIES = 50.0;
KMG.P03LP_VALID_CENTURIES = 5000.0;

KMG.IAURotation = function() {

	var scope = this;
	
	function clampCenturies(t) {
        if (t < -KMG.IAU_SECULAR_TERM_VALID_CENTURIES)
            t = -KMG.IAU_SECULAR_TERM_VALID_CENTURIES;
        else if (t > KMG.IAU_SECULAR_TERM_VALID_CENTURIES)
            t = KMG.IAU_SECULAR_TERM_VALID_CENTURIES;
		return t;
    };
	
	this.julianCentury = function(jd) {
		return (jd - 2451545.0) / 36525.0;
	}
	
	// T = Julian Centuries of 36525 days from epoch
	// d = Julian Days from epoch
	this.calculateOrientation = function(jd) {
		var t = this.julianCentury(jd);
		t = clampCenturies(t);
		jd = jd - 2451545.0;
		
		var result = this.__calculateOrientation(jd, t);
		var ra = result.ra;
		var dec = result.dec;
		
		var node = ra + 90.0;
        var inclination = 90.0 - dec;

		return {
			ra : ra,
			dec : dec,
			node : node,
			inclination : inclination
		};
	
	};
	
	// T = Julian Centuries of 36525 days from epoch
	// d = Julian Days from epoch
	this.computeSiderealRotation = function(jd) {
		var t = this.julianCentury(jd);
		jd = jd - 2451545.0;

		return {
			meridian : this.__computeSiderealRotation(jd, t).meridian
		};
		
	};
	
	this.computeRotationalQuaternion = function(jd, skipMeridian) {
	
		var orientation = this.calculateOrientation(jd);
		var meridian = KMG.Math.clamp(this.computeSiderealRotation(jd).meridian, 360) + 90;
		var nodeAxis = new THREE.Vector3( 1, 0, 0 );
		nodeAxis.rotateY((-orientation.node + 90) * KMG.PI_BY_180);
		
		var inclinationQ = new THREE.Quaternion();
		inclinationQ.setFromAxisAngle( nodeAxis, -orientation.inclination * KMG.PI_BY_180 );
	
		var noMeridian = inclinationQ.clone();
		if (!skipMeridian) {
			var meridianQ = new THREE.Quaternion();
			meridianQ.setFromAxisAngle(new THREE.Vector3( 0, 1, 0 ), meridian * KMG.PI_BY_180);
			inclinationQ.multiply(meridianQ);
		}
		
		/*
		var nodeAxis = new THREE.Vector3( 1, 0, 0 );
		nodeAxis.rotateY((orientation.node) * KMG.PI_BY_180);
		var satelliteQ = new THREE.Quaternion();
		satelliteQ.setFromAxisAngle( nodeAxis, -orientation.inclination * KMG.PI_BY_180 );	
		var meridianQ = new THREE.Quaternion();
		meridianQ.setFromAxisAngle(new THREE.Vector3( 0, 1, 0 ), -meridian * KMG.PI_BY_180);
		satelliteQ.multiply(meridianQ);
		*/
		
		inclinationQ.meridian = meridian - 90;
		inclinationQ.ra = orientation.ra;// * KMG._180_BY_PI;
		inclinationQ.dec = orientation.dec;
		inclinationQ.inclination = orientation.inclination;
		inclinationQ.node = orientation.node;
		inclinationQ.noMeridian = noMeridian;
		//inclinationQ.satelliteQ = satelliteQ;
		return inclinationQ;
	};
	
};


//////////////////////////////////////////////
// Sun
//////////////////////////////////////////////

KMG.IAUSunRotation = function() {
	
	KMG.IAURotation.call( this );
	
	this.__calculateOrientation = function(jd, t) {
		var ra = 286.13;
		var dec = 63.87;

		return {
			ra : ra,
			dec : dec
		};
	};
	
	this.__computeSiderealRotation = function(jd) {
		var meridian = 84.176 + 14.1844000 * jd;

		return {
			meridian : meridian
		};
	};
};
KMG.IAUSunRotation.prototype = Object.create( KMG.IAURotation.prototype );


//////////////////////////////////////////////
// MERCURY
//////////////////////////////////////////////

KMG.IAUMercuryRotation = function() {
	
	KMG.IAURotation.call( this );
	
	function makeArgs(jd) {
		var M = [];
		
		M[0] = 0;
		M[1] = 174.791086 + 4.092335 * jd;
		M[2] = 349.582171 + 8.184670 * jd;
		M[3] = 164.373257 + 12.277005 * jd;
		M[4] = 339.164343 + 16.369340 * jd;
		M[5] = 153.955429 + 20.461675 * jd;
		return M;
	};
	
	this.__calculateOrientation = function(jd, t) {
		var ra = 281.0097 - 0.0328 * t;
		var dec = 61.4143 - 0.0049 * t;

		return {
			ra : ra,
			dec : dec
		};
	};
	
	this.__computeSiderealRotation = function(jd) {
		var M = makeArgs(jd);
		
		var meridian = 329.5469 + 6.1385025 * jd
								+ 0.00993822 * KMG.Math.dsin(M[1])
								- 0.00104581 * KMG.Math.dsin(M[2])
								- 0.00010280 * KMG.Math.dsin(M[3])
								- 0.00002364 * KMG.Math.dsin(M[4])
								- 0.00000532 * KMG.Math.dsin(M[5]);

		return {
			meridian : meridian
		};
	};
};
KMG.IAUMercuryRotation.prototype = Object.create( KMG.IAURotation.prototype );


//////////////////////////////////////////////
// VENUS
//////////////////////////////////////////////

KMG.IAUVenusRotation = function() {
	
	KMG.IAURotation.call( this );
	
	this.__calculateOrientation = function(jd, t) {
		var ra = 272.76;
		var dec = 67.16;

		return {
			ra : ra,
			dec : dec
		};
	};
	
	this.__computeSiderealRotation = function(jd) {
		var meridian = 160.20 - 1.4813688 * jd;

		return {
			meridian : meridian
		};
	};
};
KMG.IAUVenusRotation.prototype = Object.create( KMG.IAURotation.prototype );




//////////////////////////////////////////////
// EARTH
//////////////////////////////////////////////

KMG.IAUEarthRotation = function() {
	
	KMG.IAURotation.call( this );
	
	this.__calculateOrientation = function(jd, t) {
		var ra = 0.00 - 0.641 * t;
		//var dec = 90.00 - 0.557 * t;
		var dec = 90.00 - 23.4;

		var o = {
			ra : ra,
			dec : dec
		};
		
		return o;
	};
	
	this.__computeSiderealRotation = function(jd, t) {
		var meridian = 190.147 + 360.9856235 * jd;
		

		return {
			meridian : meridian
		};
	};
};
KMG.IAUEarthRotation.prototype = Object.create( KMG.IAURotation.prototype );

//////////////////////////////////////////////
// EARTH
//////////////////////////////////////////////

// Not yet a valid port from Celestia
KMG.EarthP03Rotation = function() {
	KMG.IAURotation.call( this );
	
	this.__calculateOrientation = function(jd, T) {
		// Clamp T to the valid time range of the precession theory.
        if (T < -KMG.P03LP_VALID_CENTURIES)
            T = -KMG.P03LP_VALID_CENTURIES;
        else if (T > KMG.P03LP_VALID_CENTURIES)
            T = KMG.P03LP_VALID_CENTURIES;
        
        var prec = KMG.Procession.PrecObliquity_P03LP(T);
        var pole = KMG.Procession.EclipticPrecession_P03LP(T);
        
        var obliquity = KMG.Math.degToRad(prec.epsA / 3600);
        var precession = KMG.Math.degToRad(prec.pA / 3600);
        
        // Calculate the angles pi and Pi from the ecliptic pole coordinates
        // P and Q:
        //   P = sin(pi)*sin(Pi)
        //   Q = sin(pi)*cos(Pi)
        var P = pole.PA * 2.0 * Math.PI / 1296000;
        var Q = pole.QA * 2.0 * Math.PI / 1296000;
        var piA = Math.asin(Math.sqrt(P * P + Q * Q));
        var PiA = Math.atan2(P, Q);
		
		var o = {
			ra : piA * KMG._180_BY_PI,
			dec : PiA * KMG._180_BY_PI
		};
		//console.info(o);
		return o;
	};
	
	this.__computeSiderealRotation = function(jd, t) {
		var theta = 2 * Math.PI * (t * 24.0 / 23.9344694 - 259.853 / 360.0);
		//console.info(theta * KMG._180_BY_PI);
		return {
			meridian : theta * KMG._180_BY_PI
		};
	};
};
KMG.EarthP03Rotation.prototype = Object.create( KMG.IAURotation.prototype );




//////////////////////////////////////////////
// Moon
//////////////////////////////////////////////


KMG.IAULunarRotation = function() {
	
	KMG.IAURotation.call( this );

	function makeArgs(jd, t) {
		var E = [];
		E[0] = 0;
		E[1]  = (125.045 -  0.0529921 * jd);
        E[2]  = (250.089 -  0.1059842 * jd);
        E[3]  = (260.008 + 13.012009 * jd);
        E[4]  = (176.625 + 13.3407154 * jd);
        E[5]  = (357.529 +  0.9856993 * jd);
        E[6]  = (311.589 + 26.4057084 * jd);
        E[7]  = (134.963 + 13.0649930 * jd);
        E[8]  = (276.617 +  0.3287146 * jd);
        E[9]  = ( 34.226 +  1.7484877 * jd);
        E[10] = ( 15.134 -  0.1589763 * jd);
        E[11] = (119.743 +  0.0036096 * jd);
        E[12] = (239.961 +  0.1643573 * jd);
        E[13] = ( 25.053 + 12.9590088 * jd);
		return E;
	}
	

	// T = Julian Centuries of 36525 days from epoch
	// d = Julian Days from epoch
	this.__calculateOrientation = function(jd, t) {

		var E = makeArgs(jd);
		
		var ra = 269.9949
            + 0.0013 * t
            - 3.8787 * KMG.Math.dsin(E[1]) 
            - 0.1204 * KMG.Math.dsin(E[2])
            + 0.0700 * KMG.Math.dsin(E[3])
            - 0.0172 * KMG.Math.dsin(E[4])
            + 0.0072 * KMG.Math.dsin(E[6])
            - 0.0052 * KMG.Math.dsin(E[10])
            + 0.0043 * KMG.Math.dsin(E[13]);
            
        var dec = 66.5392
            + 0.0130 * t
            + 1.5419 * KMG.Math.dcos(E[1])
            + 0.0239 * KMG.Math.dcos(E[2])
            - 0.0278 * KMG.Math.dcos(E[3])
            + 0.0068 * KMG.Math.dcos(E[4])
            - 0.0029 * KMG.Math.dcos(E[6])
            + 0.0009 * KMG.Math.dcos(E[7])
            + 0.0008 * KMG.Math.dcos(E[10])
            - 0.0009 * KMG.Math.dcos(E[13]);
			
		return {
			ra : ra,
			dec : dec
		};
		
	};
	
	this.__computeSiderealRotation = function(jd) {

		var E = makeArgs(jd);
		var meridian = (38.3213
                + 13.17635815 * jd
                - 1.4e-12 * (jd * jd)
                + 3.5610 * KMG.Math.dsin(E[1])
                + 0.1208 * KMG.Math.dsin(E[2])
                - 0.0642 * KMG.Math.dsin(E[3])
                + 0.0158 * KMG.Math.dsin(E[4])
                + 0.0252 * KMG.Math.dsin(E[5])
                - 0.0066 * KMG.Math.dsin(E[6])
                - 0.0047 * KMG.Math.dsin(E[7])
                - 0.0046 * KMG.Math.dsin(E[8])
                + 0.0028 * KMG.Math.dsin(E[9])
                + 0.0052 * KMG.Math.dsin(E[10])
                + 0.0040 * KMG.Math.dsin(E[11])
                + 0.0019 * KMG.Math.dsin(E[12])
                - 0.0044 * KMG.Math.dsin(E[13]));
		
		return {
			meridian : meridian - 90
		};
		
	};
	
	
};
KMG.IAULunarRotation.prototype = Object.create( KMG.IAURotation.prototype );



//////////////////////////////////////////////
// MARS
//////////////////////////////////////////////

KMG.IAUMarsRotation = function() {
	
	KMG.IAURotation.call( this );
	
	this.__calculateOrientation = function(jd, t) {
		var ra = 317.68143 - 0.1061 * t;
		var dec = 52.88650 - 0.0609 * t;

		return {
			ra : ra,
			dec : dec
		};
	};
	
	this.__computeSiderealRotation = function(jd) {
		var meridian = 176.630 + 350.89198226 * jd;

		return {
			meridian : meridian
		};
	};
};
KMG.IAUMarsRotation.prototype = Object.create( KMG.IAURotation.prototype );



//////////////////////////////////////////////
// JUPITER
//////////////////////////////////////////////

KMG.IAUJupiterRotation = function() {
	
	KMG.IAURotation.call( this );
	
	
	function calculateElements(t) {
		var Ja = 99.360714 + 4850.4046 * t;
		var Jb = 175.895369 + 1191.9605 * t;
		var Jc = 300.323162 + 262.5475 * t;
		var Jd = 114.012305 + 6070.2476 * t;
		var Je = 49.511251 + 64.3000 * t;
		
		return {
			Ja : Ja,
			Jb : Jb,
			Jc : Jc,
			Jd : Jd,
			Je : Je
		};
		
	};
	
	this.__calculateOrientation = function(jd, t) {
		
		var e = calculateElements(t);
		
		var α0 = 268.056595 - 0.006499 * t 
				+ 0.000117 * KMG.Math.dsin(e.Ja) 
				+ 0.000938 * KMG.Math.dsin(e.Jb)
				+ 0.001432 * KMG.Math.dsin(e.Jc)
				+ 0.000030 * KMG.Math.dsin(e.Jd) 
				+ 0.002150 * KMG.Math.dsin(e.Je);
				
		var δ0 = 64.495303 + 0.002413 * t 
				+ 0.000050 * KMG.Math.dcos(e.Ja)
				+ 0.000404 * KMG.Math.dcos(e.Jb)
				+ 0.000617 * KMG.Math.dcos(e.Jc)
				- 0.000013 * KMG.Math.dcos(e.Jd) 
				+ 0.000926 * KMG.Math.dcos(e.Je);
		δ0 = 86.87;
		return {
			ra : α0,
			dec : δ0
		};
	};
	
	this.__computeSiderealRotation = function(jd) {
		var W = 284.95 + 870.5360000 * jd;
		
		return {
			meridian : W
		};
	};
};
KMG.IAUJupiterRotation.prototype = Object.create( KMG.IAURotation.prototype );



KMG.IAUJovianMoonRotation = function() {
	
	KMG.IAURotation.call( this );
	
	
	this.makeJovianMoonArgs = function(t) {
		var J = [];
		
		J[0] = 0;
		J[1] = 73.32 + 91472.9 * t;
		J[2] = 24.62 + 45137.2 * t;
		J[3] = 283.90 + 4850.7 * t;
		J[4] = 355.80 + 1191.3 * t;
		J[5] = 119.90 + 262.1 * t;
		J[6] = 229.80 + 64.3 * t;
		J[7] = 352.25 + 2382.6 * t;
		J[8] = 113.35 + 6070.0 * t;
		
		return J;
	}
	
};
KMG.IAUJovianMoonRotation.prototype = Object.create( KMG.IAURotation.prototype );

//////////////////////////////////////////////
// IO
//////////////////////////////////////////////

KMG.IAUIoRotation = function() {
	
	KMG.IAUJovianMoonRotation.call( this );
	
	this.__calculateOrientation = function(jd, t) {
		
		var J = this.makeJovianMoonArgs(t);
		
		var ra = 268.05 - 0.009 * t + 0.094 * KMG.Math.dsin(J[3]) + 0.024 * KMG.Math.dsin(J[4]);
		var dec = 64.50 + 0.003 * t + 0.040 * KMG.Math.dcos(J[3]) + 0.011 * KMG.Math.dcos(J[4]);

		return {
			ra : ra,
			dec : dec
		};
	};
	
	this.__computeSiderealRotation = function(jd) {
		var t = this.julianCentury(jd);
		var J = this.makeJovianMoonArgs(t);
		var meridian = 200.39 + 203.4889538 * jd - 0.085 * KMG.Math.dsin(J[3]) - 0.022 * KMG.Math.dsin(J[4]);

		return {
			meridian : meridian
		};
	};
};
KMG.IAUIoRotation.prototype = Object.create( KMG.IAUJovianMoonRotation.prototype );




//////////////////////////////////////////////
// EUROPA
//////////////////////////////////////////////

KMG.IAUEuropaRotation = function() {
	
	KMG.IAUJovianMoonRotation.call( this );
	
	this.__calculateOrientation = function(jd, t) {
		
		var J = this.makeJovianMoonArgs(t);
		
		var ra = 268.08 - 0.009 * t
				+ 1.086 * KMG.Math.dsin(J[4])
				+ 0.060 * KMG.Math.dsin(J[5])
				+ 0.015 * KMG.Math.dsin(J[6])
				+ 0.009 * KMG.Math.dsin(J[7]);



		var dec = 64.51 + 0.003 * t 
						+ 0.468 * KMG.Math.dcos(J[4])
						+ 0.026 * KMG.Math.dcos(J[5])
						+ 0.007 * KMG.Math.dcos(J[6])
						+ 0.002 * KMG.Math.dcos(J[7]);

		return {
			ra : ra,
			dec : dec
		};
	};
	
	this.__computeSiderealRotation = function(jd) {
		var t = this.julianCentury(jd);
		var J = this.makeJovianMoonArgs(t);
		var meridian = 36.022 + 101.3747235 * jd 
						- 0.980 * KMG.Math.dsin(J[4]) 
						- 0.054 * KMG.Math.dsin(J[5])
						- 0.014 * KMG.Math.dsin(J[6])
						- 0.008 * KMG.Math.dsin(J[7]);

		return {
			meridian : meridian
		};
	};
};
KMG.IAUEuropaRotation.prototype = Object.create( KMG.IAUJovianMoonRotation.prototype );



//////////////////////////////////////////////
// GANYMEDE
//////////////////////////////////////////////

KMG.IAUGanymedeRotation = function() {
	
	KMG.IAUJovianMoonRotation.call( this );
	
	this.__calculateOrientation = function(jd, t) {
		
		var J = this.makeJovianMoonArgs(t);
		
		var ra = 268.20 - 0.009 * t
				- 0.037 * KMG.Math.dsin(J[4]) 
				+ 0.431 * KMG.Math.dsin(J[5]) 
				+ 0.091 * KMG.Math.dsin(J[6]);
		
		
		var dec = 64.57 + 0.003 * t
					- 0.016 * KMG.Math.dcos(J[4]) 
					+ 0.186 * KMG.Math.dcos(J[5])
					+ 0.039 * KMG.Math.dcos(J[6]);

		return {
			ra : ra,
			dec : dec
		};
	};
	
	this.__computeSiderealRotation = function(jd) {
		var t = this.julianCentury(jd);
		var J = this.makeJovianMoonArgs(t);
		var meridian = 44.064 + 50.3176081 * jd
						+ 0.033 * KMG.Math.dsin(J[4])
						- 0.389 * KMG.Math.dsin(J[5])
						- 0.082 * KMG.Math.dsin(J[6]);

		return {
			meridian : meridian
		};
	};
};
KMG.IAUGanymedeRotation.prototype = Object.create( KMG.IAUJovianMoonRotation.prototype );


//////////////////////////////////////////////
// CALLISTO
//////////////////////////////////////////////

KMG.IAUCallistoRotation = function() {
	
	KMG.IAUJovianMoonRotation.call( this );
	
	this.__calculateOrientation = function(jd, t) {
		
		var J = this.makeJovianMoonArgs(t);
		
		var ra = 268.72 - 0.009 * t
					- 0.068 * KMG.Math.dsin(J[5]) 
					+ 0.590 * KMG.Math.dsin(J[6])
					+ 0.010 * KMG.Math.dsin(J[8]);
		
		
		var dec = 64.83 + 0.003 * t
					- 0.029 * KMG.Math.dcos(J[5]) 
					+ 0.254 * KMG.Math.dcos(J[6])
					- 0.004 * KMG.Math.dcos(J[8]);

		return {
			ra : ra,
			dec : dec
		};
	};
	
	this.__computeSiderealRotation = function(jd) {
		var t = this.julianCentury(jd);
		var J = this.makeJovianMoonArgs(t);
		
		var meridian = 259.51 + 21.5710715 * jd
						+ 0.061 * KMG.Math.dsin(J[5]) 
						- 0.533 * KMG.Math.dsin(J[6])
						- 0.009 * KMG.Math.dsin(J[8]);

		return {
			meridian : meridian
		};
	};
};
KMG.IAUCallistoRotation.prototype = Object.create( KMG.IAUJovianMoonRotation.prototype );


//////////////////////////////////////////////
// SATURN
//////////////////////////////////////////////

KMG.IAUSaturnRotation = function() {
	
	KMG.IAURotation.call( this );
	
	this.__calculateOrientation = function(jd, t) {

		var ra = 40.589 - 0.036 * t;
		var dec = 83.537 - 0.004 * t;
		
		dec = 63.27;
		
		return {
			ra : ra,
			dec : dec
		};
	};
	
	this.__computeSiderealRotation = function(jd) {
		var meridian = 38.90 + 810.7939024 * jd;

		return {
			meridian : meridian
		};
	};
};
KMG.IAUSaturnRotation.prototype = Object.create( KMG.IAURotation.prototype );



//////////////////////////////////////////////
// TITAN
//////////////////////////////////////////////

KMG.IAUTitanRotation = function() {
	
	KMG.IAURotation.call( this );
	
	this.__calculateOrientation = function(jd, t) {

		var ra = 39.4827;
		var dec = 83.4279;
		
		dec = 63.27;
		
		return {
			ra : ra,
			dec : dec
		};
	};
	
	this.__computeSiderealRotation = function(jd) {
		var meridian = 186.5855 + 22.5769768 * jd;

		return {
			meridian : meridian
		};
	};
};
KMG.IAUTitanRotation.prototype = Object.create( KMG.IAURotation.prototype );


//////////////////////////////////////////////
// URANUS
//////////////////////////////////////////////

KMG.IAUUranusRotation = function() {
	
	KMG.IAURotation.call( this );
	
	this.__calculateOrientation = function(jd, t) {

		var ra = 257.311
		var dec = -15.175;
		
		return {
			ra : ra,
			dec : dec
		};
	};
	
	this.__computeSiderealRotation = function(jd) {
		var meridian = 203.81 - 501.1600928 * jd;

		return {
			meridian : meridian
		};
	};
};
KMG.IAUUranusRotation.prototype = Object.create( KMG.IAURotation.prototype );



//////////////////////////////////////////////
// NEPTUNE
//////////////////////////////////////////////

KMG.IAUNeptuneRotation = function() {
	
	KMG.IAURotation.call( this );
	
	function computeN(t) {
		var n = 357.85 + 52.316 * t;
		return n;
	}
	
	this.__calculateOrientation = function(jd, t) {
		
		var N = computeN(t);
		
		var ra = 299.36 + 0.70 * KMG.Math.dsin(N);
		var dec = 43.46 - 0.51 * KMG.Math.dcos(N);
		
		return {
			ra : ra,
			dec : dec
		};
	};
	
	this.__computeSiderealRotation = function(jd) {
		var t = (jd - 2451545.0) / 36525.0;
		var N = computeN(t);
		var meridian = 253.18 + 536.3128492 * jd - 0.48 * KMG.Math.dsin(N);

		return {
			meridian : meridian
		};
	};
};
KMG.IAUNeptuneRotation.prototype = Object.create( KMG.IAURotation.prototype );

/* File: BaseObject.js */
KMG.BaseObject = function ( ) {
	
	THREE.Object3D.call( this );
	var scope = this;
	
	this.setVisibility = function(visible) {
		this.traverse(function(obj) {
			obj.visible = visible;
		});
	};
	
	this.setShadowInteraction = function(enable) {
		this.traverse(function(obj) {
			obj.castShadow = enable;
			obj.receiveShadow = enable;
		});
	};
	
};
KMG.BaseObject.prototype = Object.create( THREE.Object3D.prototype );



/*
KMG.TemplateObject = function ( context, config ) {
	
	KMG.BaseObject.call( this );
	this.config = config;
	this.context = context;
	var scope = this;
	
	
	// Create Stuff
	
	this.uniforms = uniforms;
	this.mesh = mesh;
	this.material = material;
	this.geometry = geometry;
	
	this.add(mesh);
	
	this.update = function()
	{
		if (!this.context.configChanged) 
			return;
			
	};
};
KMG.TemplateObject.prototype = Object.create( KMG.BaseObject.prototype );
*/


/* File: RingObject.js */

KMG.DefaultRingConfig = {
	displayRing : false,
	ringTexture : KMG.rings[0].name,
	ringHue : 0.5,
	ringSaturation : 0.0,
	ringLightness : 0.75,
	ringInnerRadius : 260.0,
	ringOutterRadius : 400.0,
	ringAngle : 0.0,
	showShadows : true,
	ringOpacity : 1.0,
	targetObject : 0
};

KMG.RingObject = function ( context, config ) {
	
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultRingConfig);
	this.context = context;
	var scope = this;
	

	function createMesh() 
	{	
		var texDefinition = KMG.TextureMap.getRingDefinitionByName(scope.config.ringTexture);
		var ringTexture = (texDefinition.texture != null) ? KMG.TextureMap.loadTexture(texDefinition.texture) : null;
		ringTexture.format = THREE.RGBAFormat;
		
		var hslColor = new THREE.Color(0xFFFFFF);
		hslColor.setHSL(scope.config.ringHue, scope.config.ringSaturation, scope.config.ringLightness);

		var material = new THREE.MeshLambertMaterial({
									ambient		: hslColor,
									color		: hslColor,
									shininess	: 150, 
									specular	: new THREE.Color(0x000000),
									shading		: THREE.SmoothShading,
									map		: ringTexture,
									transparent: true,
									side: THREE.DoubleSide,
									fog : false,
									opacity : scope.config.ringOpacity,
									depthWrite: false, 
									depthTest: true
								});

		var innerRadius = scope.config.ringInnerRadius;
		var outterRadius = scope.config.ringOutterRadius;
		
		innerRadius = (innerRadius < outterRadius) ? innerRadius : outterRadius;
		outterRadius = (outterRadius > innerRadius) ? outterRadius : innerRadius;
		
		var geometry = new THREE.RingGeometry2( innerRadius, outterRadius, 180, 1, 0, Math.PI * 2);
		geometry.computeFaceNormals();
		
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position = new THREE.Vector3( 0, 0, 0 );

		mesh.rotation.x = 90.0 * (Math.PI/180);
		mesh.rotation.y = scope.config.ringAngle * (Math.PI/180.0);
		
		mesh.updateMatrix();
		
		mesh.castShadow = scope.config.shadows;
		mesh.receiveShadow = scope.config.shadows;

		scope.uniforms = null;
		scope.mesh = mesh;
		scope.material = material;
		scope.geometry = geometry;
		
		return mesh;

	}

	this.add(createMesh());
	
	this.update = function()
	{
		if (!this.context.configChanged)
			return;
		
		this.remove(this.mesh);
		this.add(createMesh());

		this.mesh.visible = this.config.displayRing;

		if (scope.config.targetObject) {
			this.position = scope.config.targetObject.position.clone();
		} else {
			this.rotation.z = scope.config.axialTilt * (Math.PI/180);
		}
		
	};
};
KMG.RingObject.prototype = Object.create( KMG.BaseObject.prototype );


/* File: CatalogStarsObject.js */

KMG.StarUtil = {};
KMG.StarUtil.colorForSpectralClass = function(code) {
	if (code == "O")
		return 0x9db4ff;
	else if (code == "B")
		return 0xaabfff;
	else if (code == "A")
		return 0xcad8ff;
	else if (code == "F")
		return 0xfbf8ff;
	else if (code == "G")
		return 0xfff4e8;
	else if (code == "K")
		return 0xffddb4;
	else if (code == "M")
		return 0xffbd6f;
	else if (code == "L")
		return 0xf84235;
	else if (code == "T")
		return 0xba3059;
	else if (code == "Y")
		return 0x605170;
	else // Including D,C,W,S,N,P for now until I get some concrete colors on these
		return 0xFFFFFF;
}



KMG.StarParticlesShader = {

	uniforms: THREE.UniformsUtils.merge( [
		{
			"tParticle"	   : { type: "t", value: null },
			"vAlpha": { type: "f", value: 0.15 },
			"vSizeMultiplier": { type: "f", value:3.5 },
			"color" : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
		}]),

	vertexShader: [
		'attribute float alpha;',
		'varying float vAlpha;',
		'uniform float vSizeMultiplier;',
		'void main() {',
		'	vAlpha = alpha;',
		'	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
		'	gl_PointSize = (vSizeMultiplier * alpha);',
		'	gl_Position = projectionMatrix * mvPosition;',
		'}'
	].join("\n"),

	fragmentShader: [
		"uniform sampler2D tParticle;",
		'uniform vec3 color;',
		'varying float vAlpha;',
		'varying float vSizeMultiplier;',
		'void main() {',
		'	gl_FragColor = vec4( color, vAlpha );',
		'	gl_FragColor = gl_FragColor * texture2D( tParticle, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );',
		'}'
	].join("\n")

};


KMG.DefaultSpectralTypeStarParticleSystemOptions = {
	texture : '/img/star_particle.png',
	radius : 90000.0,
	sizeMultiplier : 6.5
};

KMG.SpectralTypeStarParticleSystem = function(context, config, typeCode) {
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultSpectralTypeStarParticleSystemOptions);
	this.context = context;
	var scope = this;
	
	var particleTexture = KMG.TextureMap.loadTexture(config.texture);
	particleTexture.wrapS = particleTexture.wrapT = THREE.ClampToEdgeWrapping;
	particleTexture.format = THREE.RGBAFormat;
	particleTexture.needsUpdate = true;
	
	var geometry = new THREE.Geometry();

	var shader = KMG.StarParticlesShader;
	var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	uniforms[ "color" ].value = KMG.Util.rgbToArray(KMG.StarUtil.colorForSpectralClass(typeCode));
	uniforms[ "vSizeMultiplier" ].value = config.sizeMultiplier;
	uniforms[ "tParticle" ].value = particleTexture;
	
	var attributes = {
        alpha: { type: 'f', value: [] }
    };
	
	var material = new THREE.ShaderMaterial( {
        uniforms:       uniforms,
        attributes:     attributes,
        vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
        transparent:    true
    });
	

	this.addStar = function(vertex, visualMagnitude) {	
		
		
		var alpha = 1.0 - ((visualMagnitude + 1.46) / 9.42);
		alpha = (alpha * 0.85) + (0.15);
		
		attributes.alpha.value.push(alpha);
		
		
		vertex.magnitude = visualMagnitude;
		geometry.vertices.push( vertex );
	};
	
	this.build = function() {
		var particles = new THREE.ParticleSystem( geometry, material );
		scope.add(particles);
	
	};
	
	
	this.update = function()
	{
		if (!this.context.configChanged)
			return;
			
		uniforms[ "vSizeMultiplier" ].value = this.config.sizeMultiplier;
		
	};
};
KMG.SpectralTypeStarParticleSystem.prototype = Object.create( KMG.BaseObject.prototype );




KMG.DefaultCatalogStarsObjectOptions = {
	radius : 90000.0,
	namesVisible : false
};
KMG.DefaultCatalogStarsObjectOptions = KMG.Util.extend(KMG.DefaultCatalogStarsObjectOptions, KMG.DefaultSpectralTypeStarParticleSystemOptions);


KMG.CatalogStarsObject = function ( context, config, onLoaded ) {
	
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultCatalogStarsObjectOptions);
	this.context = context;
	var scope = this;
	
	var particleTexture = KMG.TextureMap.loadTexture('/img/star_particle.png');
	particleTexture.wrapS = particleTexture.wrapT = THREE.ClampToEdgeWrapping;
	particleTexture.format = THREE.RGBAFormat;
	
	var names = [];
	
	var spectralTypes = {};
	this.add(spectralTypes["O"] = new KMG.SpectralTypeStarParticleSystem(context, config, "O"));
	this.add(spectralTypes["B"] = new KMG.SpectralTypeStarParticleSystem(context, config, "B"));
	this.add(spectralTypes["A"] = new KMG.SpectralTypeStarParticleSystem(context, config, "A"));
	this.add(spectralTypes["F"] = new KMG.SpectralTypeStarParticleSystem(context, config, "F"));
	this.add(spectralTypes["G"] = new KMG.SpectralTypeStarParticleSystem(context, config, "G"));
	this.add(spectralTypes["K"] = new KMG.SpectralTypeStarParticleSystem(context, config, "K"));
	this.add(spectralTypes["M"] = new KMG.SpectralTypeStarParticleSystem(context, config, "M"));
	this.add(spectralTypes["L"] = new KMG.SpectralTypeStarParticleSystem(context, config, "L"));
	this.add(spectralTypes["T"] = new KMG.SpectralTypeStarParticleSystem(context, config, "T"));
	this.add(spectralTypes["Y"] = new KMG.SpectralTypeStarParticleSystem(context, config, "Y"));
	
	
	this.add(spectralTypes["D"] = new KMG.SpectralTypeStarParticleSystem(context, config, "D"));
	this.add(spectralTypes["C"] = new KMG.SpectralTypeStarParticleSystem(context, config, "C"));
	this.add(spectralTypes["W"] = new KMG.SpectralTypeStarParticleSystem(context, config, "W"));
	this.add(spectralTypes["S"] = new KMG.SpectralTypeStarParticleSystem(context, config, "S"));
	this.add(spectralTypes["N"] = new KMG.SpectralTypeStarParticleSystem(context, config, "N"));
	this.add(spectralTypes["P"] = new KMG.SpectralTypeStarParticleSystem(context, config, "P"));

	// With respect to the equatorial pole
	// North pole:
	//	Right Ascension:  12h 51.4m
	//  Declination:      27.13 deg

	// South Pole:
	//  Right Ascension:  0h 51.4m
	//  Declination:      -27.13 deg
	
	// Galactic Center (0 deg longitude)
	//  Right Ascension:  17h 45.5m
	//  Declination:      -28.94 deg

	function createSystemForSpectralClass(classCode) {
	
	
	
	};
	
	
	function createStarLabel(vertex, name) {
		
		var text = new KMG.BillBoardTextObject(context, KMG.Util.replaceWithGreekLettersAbbreviated(name), {font : "8px sans-serif", fillStyle : "rgba(200,200,200,0.95)"});
		text.position = vertex.clone();
		scope.add(text);
		names.push(text);
		
	};
	
	
	$.ajax({
		url: "/api/stars/list/",
		dataType: "json",
		error: function( jqXHR, textStatus, errorThrown ) {
			console.warn("Error: " + errorThrown);
		
		},
		success: function(data, textStatus, jqxhr) {
			
		}
	}).done(function(data) {

		
		var lbls = 0;
		for (var i = 0; i < data.length; i++) {
			
			var vMag = data[i].Vmag;
			var l = data[i].eclLon;
			var b = data[i].eclLat;
			var specClass = data[i].SpClass.toUpperCase();
			var name = data[i].name;
			
			if (spectralTypes[specClass]) {

				var vertex = KMG.Math.getPoint3D(l, b, config.radius);
				
				spectralTypes[specClass].addStar(vertex, vMag);
				
				if (name.length > 0 && vMag < 6.0) {
					
					name = name.replace(/^[0-9]+/, "");
					if (vMag > 3) {
						name = name.replace(/[ ][A-Za-z]{3}$/i, "");
					}
					
					if (name.length > 0) {
						createStarLabel(vertex, name);
						lbls++;
					}
				}
				
				
			} else {
				console.warn("No particle system for spectral type " + specClass);
			}
		}
		
		console.info("Added " + lbls + " star labels");
		for (var key in spectralTypes) {
			spectralTypes[key].build();
		}
		
		scope.setTextVisibility(config.namesVisible);
		
		if (onLoaded) {
			onLoaded(scope);
		}
		
	});
	
	this.setTextVisibility = function(visible) {
		
		for (var i = 0; i < names.length; i++) {
			names[i].setVisibility(visible);
		}
		
	};
	
	this.update = function()
	{
		if (!this.context.configChanged)
			return;
		
		this.setTextVisibility(config.namesVisible);
		
		for (var key in spectralTypes) {
			spectralTypes[key].update();
		}
	};
};
KMG.CatalogStarsObject.prototype = Object.create( KMG.BaseObject.prototype );

/* File: ConstellationLines.js */
KMG.DefaultConstellationLinesConfig = {
	
	color : 0x12110C,
	radius : 90000.0,
	opacity : 0.45,
	lineThickness : 1.0
	
};

KMG.ConstellationLines = function ( context, config, onLoaded ) {
	
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultConstellationLinesConfig);
	this.context = context;
	var scope = this;

	
	function buildPoint(point) {
		
		var coords = KMG.Math.convertEquatorialToEcliptic(point[0] * 15, point[1]);
		var vertex = KMG.Math.getPoint3D(coords.l, coords.b, config.radius);
		
		return vertex;
	}
	
	function buildPath(path) {
		
		var geometry = new THREE.Geometry();
		
		for (var i = 0; i < path.length; i++) {
			var point = path[i];
			var vertex = buildPoint(point);
			
			geometry.vertices.push( vertex );
			
		}
		
		var material = new THREE.LineBasicMaterial( { opacity: config.opacity, transparent : true, fog : false, color : config.color, linewidth:config.lineThickness } );
		var line = new THREE.Line( geometry,  material);

		return line;
	}
	
	function buildConstellation(constellation) {
		
		var const3d = new THREE.Object3D();
		
		for (var i = 0; i < constellation.length; i++) {
			var path = constellation[i];
			var path3d = buildPath(path);
			const3d.add(path3d);
		}
		
		return const3d;
		
	}
	
	
	$.ajax({
		url: "/api/constellations/list/",
		dataType: "json",
		error: function( jqXHR, textStatus, errorThrown ) {
			console.warn("Error: " + errorThrown);
		
		},
		success: function(data, textStatus, jqxhr) {
			
		}
	}).done(function(data) {

		console.info("Adding " + data.length + " constellations");
		
		for (var i = 0; i < data.length; i++) {
			
			scope.add(buildConstellation(data[i]));

		}
		
		if (onLoaded) {
			onLoaded(scope);
		}
	
	});
	
	

	
	this.update = function() {
		
		
	};
};
KMG.ConstellationLines.prototype = Object.create( KMG.BaseObject.prototype );


/* File: CometObject.js */

KMG.DefaultCometObjectConfig = {
	lookingTowards : null
};

KMG.CometObject = function ( context, config, ephemeris, tickController, centerObject, lookingTowards ) {
	
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultCometObjectConfig);
	var scope = this;
	
	this.lookingTowards = (config.lookingTowards) ? config.lookingTowards : { position: new THREE.Vector3(0, 0, 0) };
	
	var cometTexture = KMG.TextureMap.loadTexture("/img/basic-comet-3-trans.png");
	cometTexture.wrapS = cometTexture.wrapT = THREE.ClampToEdgeWrapping;
	cometTexture.format = THREE.RGBAFormat;
	cometTexture.needsUpdate = true;
	
	function createFaceMesh(rotate) {

		var geometry = new THREE.PlaneGeometry(400, 100, 10, 10);
		var materialOptions = { color: 0xFFFFFF
							, ambient : 0xFFFFFF
							, emissive : 0xAAAAAA
							, shading : THREE.NoShading
							, map : cometTexture
							, transparent : true
							, side: THREE.DoubleSide
							, blending : THREE.AdditiveBlending
							, depthWrite: false
							, depthTest: false
							};
		var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( materialOptions ));
		
		mesh.rotation.set(rotate, KMG.RAD_90, 0, 'YXZ');
		mesh.position.z -= 160;

		return mesh;
	}

	this.add(createFaceMesh(0));
	this.add(createFaceMesh(-KMG.RAD_90));
	this.add(createFaceMesh(-KMG.RAD_45));
	this.add(createFaceMesh(KMG.RAD_45));

	this.update = function() {

		if (this.lookingTowards && this.lookingTowards.position) {
			var lookAt = this.lookingTowards.position.clone();
			this.lookAt( lookAt );
		}
		
	};
};
KMG.CometObject.prototype = Object.create( KMG.BaseObject.prototype );
	
	

/* File: BillboardTextObject.js */


KMG.DefaultBillBoardTextConfig = {
	textColor : 0xFFFFFF,
	fillStyle : "rgba(255,255,255,0.95)",
	font : "10px sans-serif"

};

KMG.BillBoardTextObject = function(context, text, config) {
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultBillBoardTextConfig);
	this.context = context;
	var _text = text;
	var scope = this;
	
	function createTextTexture(text, width, height) {
		var canvas1 = document.createElement('canvas');
		var context1 = canvas1.getContext('2d');
		canvas1.width = width;
		canvas1.height = height;
		context1.font = scope.config.font;
		context1.fillStyle = scope.config.fillStyle;

		context1.textAlign="center";				
		context1.fillText(text
							, canvas1.width / 2
							, canvas1.height / 2 + 20);	
		context1.fill();

		var texture1 = new THREE.Texture(canvas1) 
		texture1.needsUpdate = true;

		return texture1;
	}
	
	
	
	var geometry = new THREE.Geometry();

	var material = new THREE.ParticleBasicMaterial( { map: createTextTexture(_text, 100, 100)
													, color: this.config.textColor
													, size: 100
													, fog : false
													, sizeAttenuation : false
													, transparent : true
													, opacity : 1.0
													, blending : THREE.AdditiveBlending
													, depthWrite: false
													, depthTest: false
													} );
	var vertex = new THREE.Vector3(0, 0, 0);
	geometry.vertices.push( vertex );
	
	var particles = new THREE.ParticleSystem( geometry, material );
	this.add(particles);
	
	
	this.setText = function(text) {
		_text = text;
		material.map = createTextTexture(_text, 100, 100);
	};

	this.update = function()
	{
		if (!this.context.configChanged)
			return;
			

	};
};
KMG.BillBoardTextObject.prototype = Object.create( KMG.BaseObject.prototype );
	
	
/* File: TexturedSphereObject.js */

KMG.MaterialPhong = 1;
KMG.MaterialLambert = 2;

KMG.DefaultTexturedSphereOptions = {
	texture : "Earth - Blue Marble",
	scale : 1,
	radius : 200,
	flattening : 0,
	ambient : 0x888888,
	color : 0xDDDDDD,
	emissive : 0x000000,
	material : KMG.MaterialLambert,
	specular : 0x444444,
	shadows : true,
	slices : 32,
	shading : true,
	transparent : false

};

/** A simpler sphere for small planets or moons
 *
 */
KMG.TexturedSphereObject = function(context, config) {
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultTexturedSphereOptions);
	this.context = context;
	var scope = this;
	
	var geometry = new THREE.EllipsoidGeometry( this.config.radius, this.config.flattening, this.config.slices, this.config.slices );
	
	var texDefinition = KMG.TextureMap.getTextureDefinitionByName(this.config.texture);
	if (!texDefinition) {
		texDefinition = KMG.TextureMap.getCloudDefinitionByName(this.config.texture);
	}
	
	var tDiffuse = (texDefinition.texture) ? KMG.TextureMap.loadTexture(texDefinition.texture) : null;
	if (config.transparent) {
		tDiffuse.format = THREE.RGBAFormat;
	}
	
	var material;
	
	var shading = (config.shading) ? THREE.SmoothShading : THREE.NoShading;
	
	if (this.config.material == KMG.MaterialLambert) {
		material = new THREE.MeshLambertMaterial({
									ambient		: new THREE.Color(this.config.ambient),
									color		: new THREE.Color(this.config.color),
									emissive	: new THREE.Color(this.config.emissive),
									shading		: shading,
									map			: tDiffuse,
									fog			: this.config.fog,
									transparent : this.config.transparent
								});
	} else if (this.config.material == KMG.MaterialPhong) {
		var tSpecular = (texDefinition.specularMap) ? KMG.TextureMap.loadTexture(texDefinition.specularMap) : null;
		material = new THREE.MeshPhongMaterial({
									ambient		: new THREE.Color(this.config.ambient),
									color		: new THREE.Color(this.config.color),
									emissive	: new THREE.Color(this.config.emissive),
									specular	: new THREE.Color(this.config.specular),
									shading		: shading,
									map			: tDiffuse,
									specularMap	: tSpecular,
									fog			: this.config.fog,
									transparent : this.config.transparent
								});
	} 
								
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position = new THREE.Vector3( 0, 0, 0 );
	
	mesh.castShadow = config.shadows;
	mesh.receiveShadow = config.shadows;
	
	
	this.add(mesh);
		
	
	this.sphereMesh = mesh;
	
	this.update = function()
	{
		if (!this.context.configChanged)
			return;
		
		this.scale.set(this.config.scale, this.config.scale, this.config.scale);
		mesh.castShadow = scope.config.shadows;
		mesh.receiveShadow = scope.config.shadows;
	};
};
KMG.TexturedSphereObject.prototype = Object.create( KMG.BaseObject.prototype );
	
	

/* File: OrbitLineShader.js */

KMG.OrbitLineShader = {

	uniforms: THREE.UniformsUtils.merge( [
		{
			"uThickness" : { type: "f", value: 2.0 },
			"alpha": { type: "f", value: 1.0 },
			"color" : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
		}]),

	vertexShader: [
		'uniform float alpha;',
		'varying float vAlpha;',
		'uniform float uThickness;',
		'void main() {',
		'	vAlpha = alpha;',
		'	gl_PointSize = uThickness;',
		'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
		'}'
	].join("\n"),

	fragmentShader: [

		'uniform vec3 color;',
		'varying float vAlpha;',
		'varying float uThickness;',
		'void main() {',
		'	gl_FragColor = vec4( color, vAlpha );',
		'}'
	].join("\n")

};



/* File: OrbitPathLine.js */


KMG.DefaultBasicOrbitPathLineConfig = {

	distance : 1.0,
	opacity : 0.75,
	transparent : true,
	color : [ 255, 255, 255 ]

};

KMG.BasicOrbitPathLine = function ( context, config) {
	
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultBasicOrbitPathLineConfig);
	this.context = context;
	var scope = this;

	var segments = 60;
	var radius = 1000;
	var size = 360 / segments;

	var geometry = new THREE.Geometry();

	for ( var i = 0; i <= segments; i ++ ) {
		var segment = ( i * size ) * Math.PI / 180;
		geometry.vertices.push( new THREE.Vector3( Math.cos( segment ) * radius, 0, Math.sin( segment ) * radius )  );
	}
	
	var material = new THREE.LineBasicMaterial( { opacity: config.opacity, transparent : config.transparent, fog : false, linewidth: 1 } );
	
	var line = new THREE.Line( geometry,  material);
	line.position.set( 0, 0, 0 );

	this.add( line );
	
	
	this.update = function()
	{
		if (!this.context.configChanged) 
			return;
		
		var color = KMG.Util.arrayToColor(config.color);
		material.color = color;
		material.opacity = config.opacity;
		
		line.scale.set( config.distance, config.distance, config.distance );
	};
};
KMG.BasicOrbitPathLine.prototype = Object.create( KMG.BaseObject.prototype );


KMG.DefaultOrbitPathLineConfig = {
	scale : 5,
	opacity : 0.55,
	transparent : true,
	color : 0xFFFFFF,
	segments : 100,
	closeOrbit : true,
	subdivisions : 12,
	lineThickness : 1.0
};
KMG.DefaultOrbitPathLineConfig = KMG.Util.extend(KMG.DefaultOrbitPathLineConfig, KMG.OrbitDefinitions.template);

KMG.OrbitPathLine = function ( context, config, orbit, centerObject, start /* Julian Days */, stop /* Julian Days */) {
	
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultOrbitPathLineConfig);
	this.context = context;
	var scope = this;
	
	this.centerObject = centerObject;
	

	var julianPeriod = orbit.period;
	
	var epoch = (orbit.epoch) ? orbit.epoch : 2451545;
	var startTime = (start) ? start : epoch;
	var stopTime = (stop) ? stop : startTime + julianPeriod;
	
	
	var segments = config.segments;
	var d = (stopTime - startTime) / segments;
	var geometry = new THREE.Geometry();
	
	var first = null;
	
	var curve = new THREE.CurvePath();
	var points = [];
	for (var t = startTime; t <= stopTime-d; t += d) {
		var p = orbit.positionAtTime(t);
		points.push(p);
		if (!first) {
			first = p;
		}
	}
	
	//if (config.closeOrbit) {
	//	points.push(first);
	//}
	
	var spline = new THREE.Spline( points );
	for (var i = 0; i < points.length * config.subdivisions; i ++ ) {
		var index = i / ( points.length * config.subdivisions );
		var position = spline.getPoint( index );
		geometry.vertices[ i ] = new THREE.Vector3( position.x, position.y, position.z );
	
	}
	
	if (config.closeOrbit) {
		var position = spline.getPoint( 0 );
		geometry.vertices.push(new THREE.Vector3( position.x, position.y, position.z));
	}
	
	/*
	var shader = KMG.OrbitLineShader;
	var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	uniforms[ "color" ].value = KMG.Util.rgbToArray( config.color);
	uniforms[ "uThickness" ].value = config.lineThickness;
	uniforms[ "alpha" ].value = config.opacity;
	var attributes = { };
	
	var material = new THREE.ShaderMaterial( {
				uniforms:       uniforms,
				attributes:     attributes,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader,
				transparent : true
			});
	*/
	
	var material = new THREE.LineBasicMaterial( { opacity: config.opacity, transparent : true, fog : false, color : config.color, linewidth: config.lineThickness } );
	var line = new THREE.Line( geometry,  material, THREE.LineStrip);
	line.position.set( 0, 0, 0 );
	line.scale.set( config.scale, config.scale, config.scale );	
	this.add( line );

	this.lineMaterial = material;

	this.update = function()
	{
		if (scope.centerObject) {
			var centerPosition = scope.centerObject.position.clone();
			this.position = centerPosition;
		}
		
		if (!this.context.configChanged) 
			return;
		
		//uniforms[ "color" ].value = KMG.Util.rgbToArray( config.color);
		//uniforms[ "alpha" ].value = config.opacity;
		
		this.traverse(function(obj) {
			obj.visible = (config.opacity != 0);
		});

		line.scale.set( config.scale, config.scale, config.scale );	
	};
};
KMG.OrbitPathLine.prototype = Object.create( KMG.BaseObject.prototype );











/* File: VectorPathLine.js */
KMG.DefaultVectorPathLineConfig = {
	scale : 5,
	opacity : 0.75,
	transparent : true,
	color : 0xFFFFFF,
	segments : 100,
	subdivisions : 6,
	lineThickness : 1.0
};


/**
 * Vectors: an array of objects containing x/y/z values in terms of AU
 */
KMG.VectorPathLine = function ( context, config, centerObject, vectors ) {
	
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultVectorPathLineConfig);
	this.context = context;
	var scope = this;
	this.centerObject = centerObject;
	
	
	
	var geometry = new THREE.Geometry();
	var points = [];
	console.info("Adding " + vectors.length + " vectors");
	for (var i = 0; i < vectors.length; i++) {
		var vector = vectors[i];
		points.push(new THREE.Vector3(vector.x, vector.z, -vector.y));
	}

	var spline = new THREE.Spline( points );
	for ( i = 0; i < points.length * config.subdivisions; i ++ ) {
		var index = i / ( points.length * config.subdivisions );
		var position = spline.getPoint( index );
		geometry.vertices[ i ] = new THREE.Vector3( position.x, position.y, position.z );
	
	}
	
	var material = new THREE.LineBasicMaterial( { opacity: config.opacity, transparent : true, fog : false, color : config.color, linewidth:config.lineThickness } );
	var line = new THREE.Line( geometry,  material);
	line.position.set( 0, 0, 0 );
	line.scale.set( config.scale, config.scale, config.scale );	
	this.add( line );

	this.setLineColor = function(color) {
		material.color = new THREE.Color(color);
	};
	
	this.update = function()
	{
		if (!this.context.configChanged) 
			return;

		if (scope.centerObject) {
			var centerPosition = scope.centerObject.position.clone();
			this.position = centerPosition;
		}
	};

};
KMG.VectorPathLine.prototype = Object.create( KMG.BaseObject.prototype );

/* File: FadingVectorPathLine.js */
KMG.DefaultFadingVectorPathLineConfig = {
	scale : 5,
	opacity : 0.75,
	transparent : true,
	color : 0xFFFFFF,
	segments : 200,
	subdivisions : 17,
	lineThickness : 1.0,
	fadeLength : 500
};


/**
 * Vectors: an array of objects containing x/y/z values in terms of AU
 */
KMG.FadingVectorPathLine = function ( context, config, centerObject, vectors ) {
	
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultFadingVectorPathLineConfig);
	this.context = context;
	var scope = this;
	this.centerObject = centerObject;
	
	

	var geometry = new THREE.Geometry();
	var points = [];
	console.info("Adding " + vectors.length + " vectors");
	for (var i = vectors.length - config.fadeLength; i < vectors.length; i++) {
		if (i < 0)
			continue;
		var vector = vectors[i];
		points.push(new THREE.Vector3(vector.x, vector.z, -vector.y));
	}
	
	
	var splineLength = points.length * config.subdivisions;
	
	var alphas = [];
	var spline = new THREE.SplineCurve3( points );
	for (var i = 0; i <= splineLength; i++) {
		var f = i / splineLength;
		var position = spline.getPoint(f);
		geometry.vertices.push(new THREE.Vector3( position.x, position.y, position.z ));
		alphas.push(f);
	}

	var shader = KMG.FadingTrackShader;
	var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	uniforms[ "color" ].value = KMG.Util.rgbToArray(config.color);
	uniforms[ "uThickness" ].value = config.lineThickness;
	
	var attributes = {
		alpha: { type: 'f', value: alphas }
	};
	
	var material = new THREE.ShaderMaterial( {
		uniforms:       uniforms,
		attributes:     attributes,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
		transparent:    true
	});
	material.linewidth = config.lineThickness;
	
	var line = new THREE.Line( geometry,  material);
	line.position.set( 0, 0, 0 );
	line.scale.set( config.scale, config.scale, config.scale );	
	this.add( line );
	
	this.lineMaterial = material;
	
	this.setLineColor = function(color) {
		uniforms[ "color" ].value = KMG.Util.rgbToArray(color);
	};
	
	this.update = function()
	{
		if (!this.context.configChanged) 
			return;

		if (scope.centerObject) {
			var centerPosition = scope.centerObject.position.clone();
			this.position = centerPosition;
		}
	};

};
KMG.FadingVectorPathLine.prototype = Object.create( KMG.BaseObject.prototype );



KMG.FadingTrackShader = {

	uniforms: THREE.UniformsUtils.merge( [
		{
			"uThickness" : { type: "f", value: 2.0 },
			"alpha": { type: "f", value: 1.0 },
			"color" : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) }
		}]),

	vertexShader: [
		'attribute float alpha;',
		'varying float vAlpha;',
		'uniform float uThickness;',
		'void main() {',
		'	vAlpha = alpha;',
		'	gl_PointSize = uThickness;',
		'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
		'}'
	].join("\n"),

	fragmentShader: [

		'uniform vec3 color;',
		'varying float vAlpha;',
		'varying float uThickness;',
		'void main() {',
		'	gl_FragColor = vec4( color, vAlpha );',
		'}'
	].join("\n")

};

/* File: CoordinateGrid.js */

KMG.DefaultCoordinateGridConfig = {
	radius: 90000.0,
	color : 0x006600,
	opacity : 0.5,
	lineThickness : .5,
	scale : 1.0
};

KMG.CoordinateGrid = function(context, config) {
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultCoordinateGridConfig)
	var scope = this;
	
	
	
	function createRing(latitude, width) {
		if (!latitude) {
			latitude = 0;
		}
		var geometry = new THREE.Geometry();
		for (var i = 0; i <= 360; i+=0.25) {
			
			var vertex = KMG.Math.getPoint3D(i, latitude, config.radius);
			geometry.vertices.push(vertex);
			
		};

		var material = new THREE.LineBasicMaterial( { opacity: config.opacity, transparent : true, fog : false, color : config.color, linewidth: width } );
		var line = new THREE.Line( geometry,  material, THREE.LineStrip);
		line.position.set( 0, 0, 0 );
		return line;
	}
	
	
	function createGrid() {
		var grid = new THREE.Object3D();
		
		for (var i = 0; i < 360; i+=10) {
			
			var ring = createRing(0, config.lineThickness);
			ring.rotation.z = KMG.RAD_90;
			ring.rotation.y = i * KMG.PI_BY_180;
			
			grid.add(ring);
		}
		
		for (var i = -90; i < 90; i+=10) {
			var ring = createRing(i, config.lineThickness);
			grid.add(ring);
		}
		
		return grid;
	}
	
	this.secondaryContainer = new THREE.Object3D();
	
	var ring = createRing(0, config.lineThickness+1);
	this.secondaryContainer.add( ring );
	var grid = createGrid();
	this.secondaryContainer.add(grid);
	this.add(this.secondaryContainer);
	
	this.scale.set( config.scale, config.scale, config.scale );	
	
	// Grid specific. Leaves the ecliptic ring showing to be controlled by the general object's visibility
	this.setGridVisibility = function(visible) {
		grid.setVisibility(visible);
	}
	
	
	this.update = function() {
		
	};
};
KMG.CoordinateGrid.prototype = Object.create( KMG.BaseObject.prototype );

/* File: SurfaceHorizonPanorama.js */
KMG.DefaultSurfaceHorizonPanoramaConfig = {
	radius: 1000.0,
	texture : "/img/panoramas/Moon-ApolloPanorama-2048-trans.png",
	color : 0xFF0000,
	opacity : 0.5,
	lineThickness : .5,
	kmScalar : 1.0
};


KMG.SurfaceHorizonPanorama = function(context, config) {
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultSurfaceHorizonPanoramaConfig)
	var scope = this;
	
	
	function createRing(latitude, width) {
		if (!latitude) {
			latitude = 0;
		}
		var geometry = new THREE.Geometry();
		for (var i = 0; i <= 360; i+=0.25) {
			
			var vertex = KMG.Math.getPoint3D(i, latitude, config.radius);
			geometry.vertices.push(vertex);
			
		};

		var material = new THREE.LineBasicMaterial( { opacity: config.opacity, transparent : true, fog : false, color : config.color, linewidth: width } );
		var line = new THREE.Line( geometry,  material, THREE.LineStrip);
		line.position.set( 0, 0, 0 );
		return line;
	}
	
	this.secondaryContainer = new THREE.Object3D();
	
	var tDiffuse = KMG.TextureMap.loadTexture(config.texture);
	tDiffuse.format = THREE.RGBAFormat;
	
	var geometry = new THREE.CylinderGeometry( config.radius, config.radius, 1000, 32, 2, true );
	var material = new THREE.MeshLambertMaterial( {color: 0xffffff,
													wireframe : false,
													side : THREE.BackSide,
													map:tDiffuse,
													transparent : true
													} );
	var cylinder = new THREE.Mesh( geometry, material );
	cylinder.rotation.x = -KMG.RAD_90;
	//this.secondaryContainer.add(cylinder);
	
	var grid = new THREE.Object3D();
	grid.add(createRing(0.0, config.lineThickness));
	this.secondaryContainer.add(grid);
	
	this.add(cylinder);
	
	this.add(this.secondaryContainer);
	
	this.scale.set( config.kmScalar, config.kmScalar, config.kmScalar );	
	
	this.update = function() {
		
	};
};
KMG.SurfaceHorizonPanorama.prototype = Object.create( KMG.BaseObject.prototype );
/* File: DotPlotObject.js */

KMG.DefaultDotPlotConfig = {
	opacity : 1.0,
	color : 0xFFFFFF,
	texture : '/img/star_particle.png',
	size : 4

};

KMG.DotPlotObject = function(context, config) {
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultDotPlotConfig);
	this.context = context;
	var scope = this;
	
	var particleTexture = KMG.TextureMap.loadTexture(config.texture);
	particleTexture.wrapS = particleTexture.wrapT = THREE.ClampToEdgeWrapping;
	particleTexture.format = THREE.RGBAFormat;
	
	
	var  particles, geometry, material, parameters, i, h, color;
		
	geometry = new THREE.Geometry();

	material = new THREE.ParticleBasicMaterial( { map: particleTexture
													, color: config.color
													, size: config.size
													, fog : false
													, sizeAttenuation : false
													, transparent : true
													, opacity : config.opacity
													, blending : THREE.AdditiveBlending
													, depthWrite: false
													, depthTest: true
													} );
	var vertex = new THREE.Vector3(0, 0, 0);
	geometry.vertices.push( vertex );
	
	particles = new THREE.ParticleSystem( geometry, material );
	
	this.material = material;
	
	this.add( particles );

	this.update = function()
	{
		if (!this.context.configChanged)
			return;
			
		//material.color = new THREE.Color(config.color);
		
		this.traverse(function(obj) {
			obj.visible = (config.opacity != 0);
		});
	};
};
KMG.DotPlotObject.prototype = Object.create( KMG.BaseObject.prototype );

/* File: RingGeometry2.js */

/** A modification of the standard three.js RingGeometry class, but with changes to support 
 * Celestia-like ring textures.
 */
THREE.RingGeometry2 = function ( innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength ) {

    THREE.Geometry.call( this );

    innerRadius = innerRadius || 0;
    outerRadius = outerRadius || 50;

    thetaStart = thetaStart !== undefined ? thetaStart : 0;
    thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

    thetaSegments = thetaSegments !== undefined ? Math.max( 3, thetaSegments ) : 8;
    phiSegments = phiSegments !== undefined ? Math.max( 3, phiSegments ) : 8;
    
    var i, o, uvs = [], radius = innerRadius, radiusStep = ( ( outerRadius - innerRadius ) / phiSegments);
	

	
    for( i = 0; i <= phiSegments; i++) {//concentric circles inside ring

        for( o = 0; o <= thetaSegments; o++) {//number of segments per circle

            var vertex = new THREE.Vector3();
            
            vertex.x = radius * Math.cos( thetaStart + o / thetaSegments * thetaLength );
            vertex.y = radius * Math.sin( thetaStart + o / thetaSegments * thetaLength );
            
            this.vertices.push( vertex );
			uvs.push( new THREE.Vector2((i / phiSegments), ( vertex.y / radius + 1 ) / 2));
        }
        
        radius += radiusStep;

    }
	
	
    var n = new THREE.Vector3( 0, 0, 1 );
    
    for( i = 0; i < phiSegments; i++) {//concentric circles inside ring

        for( o = 0; o <= thetaSegments; o++) {//number of segments per circle
            
            var v1, v2, v3;

            v1 = o + (thetaSegments * i) + i;
            v2 = o + (thetaSegments * i) + thetaSegments + i;
            v3 = o + (thetaSegments * i) + thetaSegments + 1 + i;
            
            this.faces.push( new THREE.Face3( v1, v2, v3, [ n, n, n ] ) );
            this.faceVertexUvs[ 0 ].push( [ uvs[ v1 ], uvs[ v2 ], uvs[ v3 ] ]);
            
            v1 = o + (thetaSegments * i) + i;
            v2 = o + (thetaSegments * i) + thetaSegments + 1 + i;
            v3 = o + (thetaSegments * i) + 1 + i;
            
            this.faces.push( new THREE.Face3( v1, v2, v3, [ n, n, n ] ) );
            this.faceVertexUvs[ 0 ].push( [ uvs[ v1 ], uvs[ v2 ], uvs[ v3 ] ]);

        }
    }
    
    this.computeCentroids();
    this.computeFaceNormals();

    this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius ); 

};

THREE.RingGeometry2.prototype = Object.create( THREE.Geometry.prototype );

/* File: EllipsoidGeometry.js */
/** Modification of SphereGeometry to implements an Ellipsoid Oblate Spheriod
 * @author mrdoob / http://mrdoob.com/
 */

THREE.EllipsoidGeometry = function ( radius, flattening, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {

	THREE.Geometry.call( this );

	this.radius = radius = radius || 50;

	this.widthSegments = widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
	this.heightSegments = heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

	this.phiStart = phiStart = phiStart !== undefined ? phiStart : 0;
	this.phiLength = phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

	this.thetaStart = thetaStart = thetaStart !== undefined ? thetaStart : 0;
	this.thetaLength = thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

	var x, y, vertices = [], uvs = [];

	for ( y = 0; y <= heightSegments; y ++ ) {

		var verticesRow = [];
		var uvsRow = [];

		for ( x = 0; x <= widthSegments; x ++ ) {

			var u = x / widthSegments;
			var v = y / heightSegments;
			

			var lat =  thetaStart + v * thetaLength;
			var r = KMG.Math.radiusAtGeocentricLatitude(radius, lat - KMG.RAD_90, flattening);
			
			var vertex = new THREE.Vector3();
			vertex.x = - r * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
			vertex.y = r * Math.cos( thetaStart + v * thetaLength );
			vertex.z = r * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

			this.vertices.push( vertex );

			verticesRow.push( this.vertices.length - 1 );
			uvsRow.push( new THREE.Vector2( u, 1 - v ) );

		}

		vertices.push( verticesRow );
		uvs.push( uvsRow );

	}

	for ( y = 0; y < this.heightSegments; y ++ ) {

		for ( x = 0; x < this.widthSegments; x ++ ) {

			var v1 = vertices[ y ][ x + 1 ];
			var v2 = vertices[ y ][ x ];
			var v3 = vertices[ y + 1 ][ x ];
			var v4 = vertices[ y + 1 ][ x + 1 ];

			var n1 = this.vertices[ v1 ].clone().normalize();
			var n2 = this.vertices[ v2 ].clone().normalize();
			var n3 = this.vertices[ v3 ].clone().normalize();
			var n4 = this.vertices[ v4 ].clone().normalize();

			var uv1 = uvs[ y ][ x + 1 ].clone();
			var uv2 = uvs[ y ][ x ].clone();
			var uv3 = uvs[ y + 1 ][ x ].clone();
			var uv4 = uvs[ y + 1 ][ x + 1 ].clone();

			if ( Math.abs( this.vertices[ v1 ].y ) === this.radius ) {

				uv1.x = ( uv1.x + uv2.x ) / 2;
				this.faces.push( new THREE.Face3( v1, v3, v4, [ n1, n3, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

			} else if ( Math.abs( this.vertices[ v3 ].y ) === this.radius ) {

				uv3.x = ( uv3.x + uv4.x ) / 2;
				this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

			} else {

				this.faces.push( new THREE.Face3( v1, v2, v4, [ n1, n2, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv4 ] );

				this.faces.push( new THREE.Face3( v2, v3, v4, [ n2.clone(), n3, n4.clone() ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv2.clone(), uv3, uv4.clone() ] );

			}

		}

	}

	this.computeCentroids();
	this.computeFaceNormals();

	this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

THREE.EllipsoidGeometry.prototype = Object.create( THREE.Geometry.prototype );

/* File: Vector3.js */

THREE.Vector3.prototype.rotateX = function (angle) {

	var cosX = Math.cos(angle);
	var sinX = Math.sin(angle);
			
	var ry = cosX * this.y + -sinX * this.z;
	var rz = sinX * this.y + cosX * this.z;
			
	this.y = ry;
	this.z = rz;
	
	return this;
};

THREE.Vector3.prototype.rotateY = function (angle) {

	var cosY = Math.cos(angle);
	var sinY = Math.sin(angle);
	
	var rx = cosY * this.x + sinY * this.z;
	var rz = -sinY * this.x + cosY * this.z;
	
	this.x = rx;
	this.z = rz;
	
	return this;
};

THREE.Vector3.prototype.rotateZ = function (angle) {

	var cosZ = Math.cos(angle);
	var sinZ = Math.sin(angle);
	
	var rx = cosZ * this.x + -sinZ * this.y;
	var ry = sinZ * this.x + cosZ * this.y;

	this.x = rx;
	this.y = ry;
	
	return this;
};


THREE.Vector3.prototype.rotate = function (angle, axis) {
	if (axis === undefined || axis === 'X') {
		return this.rotateX(angle);
	} else if (axis === 'Y') {
		return this.rotateY(angle);
	} else if (axis === 'Z') {
		return this.rotateZ(angle);
	}
	return this;
};

/* File: ConfigWrapper.js */

/** A very simple structure for creating property name aliases.
 *
 */
KMG.ConfigWrapper = function ( config ) {
	
	var scope = this;
	var config = config;
	var nameToPropMap = {};
	var propToNameMap = {};
	this.changeListener = null;
	
	this.add = function ( name, prop ) {
		propToNameMap[prop] = name;
		nameToPropMap[name] = prop;
		
		Object.defineProperty(this, name, {
			get : function()  { return config[nameToPropMap[name]]; },
			set : function(v) { 
				config[nameToPropMap[name]] = v;
				if (scope.changeListener) {
					scope.changeListener(nameToPropMap[name], v);
				}
			}
		});
		
	};
};

/* File: SunlightPositioning.js */

KMG.SunlightPositioning = function() {
	

	
	function limitDegrees(degrees) {
		var limited;
		degrees /= 360.0;
		limited = 360.0 * (degrees - Math.floor(degrees));
		if (limited < 0) {
			limited += 360.0;
		}
		return limited;
	}
	
	function julianDay(year, month, day, hour, minute, second, tz) {
		var day_decimal, julian_day, a;

		day_decimal = day + (hour - tz + (minute + second / 60.0) / 60.0) / 24.0;

		if (month < 3) {
			month += 12;
			year--;
		}

		julian_day = Math.floor(365.25 * (year + 4716.0)) + Math.floor(30.6001 * (month + 1)) + day_decimal - 1524.5;
		if (julian_day > 2299160.0) {
			a = Math.floor(year / 100);
			julian_day += (2 - a + Math.floor(a / 4));
		}
		console.info("Julian Day: " + julian_day);
		return julian_day;
		
	}
	
	function julianDayFromDate(date) {
		return julianDay(date.getFullYear()
					, date.getMonth() + 1
					, date.getDate()
					, date.getHours()
					, date.getMinutes()
					, date.getSeconds()
					, 0);
	}
	
	
	function julianCentury(jd) {
		return (jd - 2451545.0) / 36525.0;
	}
	

	
	//http://stackoverflow.com/questions/8619879/javascript-calculate-days-in-a-year-year-to-date
	function dayOfYear(date) {
		var start = new Date(date.getFullYear(), 0, 0);
		var diff = date - start;
		var oneDay = 1000 * 60 * 60 * 24;
		var day = Math.floor(diff / oneDay);
		return day;
	}
	
	function dayOfYearFromJulianDay(jd) {
		var dt = KMG.Util.julianToDate(jd);
		return dayOfYear(dt);
	}
	
	//function minutesToTod(minutes) {
		//var hour = Math.floor(minutes / 60.0)
		//var minute = Math.floor(minutes - (hour * 60));
		//var second = Math.floor(60.0 * (minutes - (hour * 60) - minute));
	//}
	
	function toMinutes(date) {
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        
		var tod = hour * 60.0 + minute + (second / 60.0);
		
        return tod;
    }
	
	function toMinutesFromJulianDay(jd) {
		var dt = KMG.Util.julianToDate(jd);
		return toMinutes(dt);
	}
	
	function radians(d) {
		return d*(Math.PI/180.0);
	}
	
	function degrees(r) {
		return r*(180.0/Math.PI);
	}
	
	function approxAtmosphericRefraction(solarElevation) {
		var refr = 0;
		if (solarElevation > 85) {
			refr = 0;
		} else if (solarElevation > 5) {
			refr = 58.1 / Math.tan(radians(solarElevation)) - 0.07 / (Math.pow(Math.tan(radians(solarElevation)), 3)) + 0.000086 / (Math.pow(Math.tan(radians(solarElevation)), 5))
		} else if (solarElevation > -0.575) {
			refr = 1735 + solarElevation *(-518.2 + solarElevation * (103.4 + solarElevation * (-12.79+solarElevation*0.711)));
		} else {
			refr = -20.772 / Math.tan(radians(solarElevation));
		}
		return refr / 3600.0;
	}
	
	function correctedSolarElevation(solarElevation) {
		return solarElevation + approxAtmosphericRefraction(solarElevation);
	}
	
	// Doesn't account for atmospheric influence
	this.getSunPositionOnDate = function(date){
		var jd = julianDayFromDate(date);
		return this.getSunPositionOnJulianDay(jd);
	};
	
	// Doesn't account for atmospheric influence
	this.getSunPositionOnJulianDay = function(jd, longitude, latitude, calcDetails) {
	
	
		// Take care of undefined or null values
		if (!longitude) {
			longitude = 0;
		}
		
		if (!latitude) {
			latitude = 0;
		}
		//var latitude = 0.0;
		//var longitude = 0.0;
			
		
		var jc = julianCentury(jd);
		
		var n = jd - 2451545.0; // Number of days from J2000.0
		var L = 280.460 + 0.9856474 * n; // Mean longitude of the Sun,
		
		var g = 357.528 + 0.9856003 * n; // Mean anomaly of the sun
		L = limitDegrees(L);
		g = limitDegrees(g);

		var _g = radians(g);
		var _L = radians(L);

		var eclipticLongitude = L + 1.915 * Math.sin(_g) + 0.020 * Math.sin(2 * _g);
		var eclipticLatitude = 0;

		// Distance of the sun in astronomical units
		var R = 1.00014 - 0.01671 * Math.cos(_g) - 0.00014 * Math.cos(2 * _g);

                // Obliquity of the ecliptic
		var e = 23.439 - 0.0000004 * n;

		var eccentricityEarthOrbit = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc);

		var _eclipticLongitude = radians(eclipticLongitude);
		var _eclipticLatitude = radians(eclipticLatitude);

		var _e = radians(e);

		var N = dayOfYearFromJulianDay(jd);

		var rightAscension = Math.atan((Math.sin(_eclipticLongitude) * Math.cos(_e) - Math.tan(_eclipticLatitude) * Math.sin(_e)) / Math.cos(_eclipticLongitude));
		var declination = Math.atan((Math.sin(_e) * Math.sin(_eclipticLongitude) * Math.cos(_eclipticLatitude) + Math.cos(_e) * Math.sin(_eclipticLatitude)));
		var o = -e * (Math.cos(radians((360.0 / 365.0) * (N + 10.0))));


		var obliquityCorrection = e + 0.00256 * Math.cos(radians(125.04 - 1934.136 * jc));
		var y = Math.pow(Math.tan(radians(obliquityCorrection) / 2.0), 2);

		var equationOfTime = degrees(y * Math.sin(2.0 * _L) - 2.0 * eccentricityEarthOrbit * Math.sin(_g) + 4.0 * eccentricityEarthOrbit * y * Math.sin(_g) * Math.cos(2.0 * _L)
                                - 0.5 * y * y * Math.sin(4.0 * _L) - 1.25 * eccentricityEarthOrbit * eccentricityEarthOrbit * Math.sin(2.0 * _g)) * 4.0; // in
                                                                                                                                                                                                                                                                                                // minutes
                                                                                                                                                                                                                                                                                                // of
                                                                                                                                                                                                                                                                                                // time

		var tod = toMinutesFromJulianDay(jd);
		
		var trueSolarTime = (tod + equationOfTime + 4.0 * longitude - 60.0 * 0 /* 0==tz*/);

		var ha = 0;
		if (trueSolarTime / 4.0 < 0.0)
			ha = trueSolarTime / 4.0 + 180.0;
		else
			ha = trueSolarTime / 4.0 - 180.0;
		
		


		var rotateY = rightAscension + (ha - longitude);
		var rotateX = declination;

		var xyz = new THREE.Vector3(R * 149598000000.0, 0, 0); // R (AU) in meters
		
		if (THREE.Euler) {
			var e = new THREE.Euler( radians(rotateX), radians(-rotateY), radians(o), 'XYZ' );
			xyz.applyEuler(e);
			xyz.euler = e;
		}
		
		xyz.solarY = radians(-rotateY);
		
		
		if (calcDetails) {
		
			var zenithAngle = degrees(Math.acos(Math.sin(radians(latitude))*Math.sin(radians(declination))+Math.cos(radians(latitude))*Math.cos(radians(declination))*Math.cos(radians(ha))));
		
			var azimuthAngle = 0;
			if (ha > 0) {
				azimuthAngle = degrees(Math.acos(((Math.sin(radians(latitude))*Math.cos(radians(zenithAngle)))-Math.sin(radians(declination)))/(Math.cos(radians(latitude))*Math.sin(radians(zenithAngle)))))+180
			} else {
				azimuthAngle = 540-degrees(Math.acos(((Math.sin(radians(latitude))*Math.cos(radians(zenithAngle)))-Math.sin(radians(declination)))/(Math.cos(radians(latitude))*Math.sin(radians(zenithAngle)))))
			}
			azimuthAngle = KMG.Math.clamp(azimuthAngle, 360);
			
			
			var haSunrise = degrees(Math.acos(Math.cos(radians(90.833))/(Math.cos(radians(latitude))*Math.cos(radians(declination)))-Math.tan(radians(latitude)) * Math.tan(radians(declination))));
			var sunRiseTimeUTC = 720 - (4.0 * (longitude + haSunrise)) - equationOfTime;
			var sunSetTimeUTC = 720 - (4.0 * (longitude - haSunrise)) - equationOfTime;
			
			sunRiseTimeUTC = Math.floor(jd) + (sunRiseTimeUTC / 60 / 24) - .5;
			sunSetTimeUTC = Math.floor(jd) + (sunSetTimeUTC / 60 / 24) - .5;
			xyz.details = {
				rightAscension : degrees(rightAscension),
				hourAngle : degrees(ha),
				trueSolarTime : trueSolarTime,
				equationOfTime : equationOfTime,
				declination : declination * KMG._180_BY_PI,
				zenithAngle : zenithAngle,
				elevationAngle : (90 - zenithAngle),
				apparentElevationAngle : correctedSolarElevation((90 - zenithAngle)),
				azimuthAngle : azimuthAngle,
				sunriseUTC : sunRiseTimeUTC,
				sunsetUTC : sunSetTimeUTC,
				distance : R,
				viewer : {
					latitude : latitude,
					longitude : longitude
				}
			};
		}

		return xyz;
    };
	
};
/* File: ExamineControls.js */

KMG.CenterPivot = 1;
KMG.SurfacePivot = 2;

KMG.Distance = 1;
KMG.Scale = 2;
KMG.FoV = 3;

KMG.ExamineControls = function ( gl, object, domElement, onChange ) {

	this.gl = gl;
	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;
	
	this.orientation = new THREE.Quaternion();
	
	console.info("Initializing examine controls");
	
	// API
	this.enabled = true;
	
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
	
	this.center = new THREE.Vector3(0, 0, 0);
	this.lastPosition = new THREE.Vector3(0, 0, 0);
	
	this.translate = new THREE.Vector3(0, 0, 0);
	
	this.pitchType = KMG.SurfacePivot;
	
	this.zoomType = KMG.Distance;
	
	this.maxDistance = 10000;
	this.minDistance = 210;
	this.distance = 700;
	this.defaultDistance = 700;
		
	this.maxScale = 10000.0;
	this.minScale = 0.0001;
	this.scale = 1.0;
	this.defaultScale = 1.0;
	
	this.maxFov = 90;
	this.minFov = 0.0001;
	this.fov = 45;
	this.defaultFov = 45;
	
	
	this.maxPitch = 90.0 * (Math.PI / 180.0);
	this.minPitch = 0.0;
	this._pitch = 0.0;
	this._yaw = 0.0;
	this._roll = 0.0;
	
	this.panVertical = 0;
	this.panHorizontal = 0;
	
	this.radius = 200;
	
	this.distanceMoveSpeed = 0.2;
	this.zoomSpeed = 0.001;
	this.rotateSpeed = 0.5;
	
	this.modelView = new THREE.Matrix4();
	
	var matrixRoll = new THREE.Matrix4();
	var matrixPitch = new THREE.Matrix4();
	var matrixYaw = new THREE.Matrix4();
	

	var lastX = -1;
	var lastY = -1;
	var mouseDownX = -1;
	var mouseDownY = -1;
	
	var scope = this;
	var changeEvent = { type: 'change' };
	
	var lastRotateX = 0;
	var lastRotateY = 0;
	
	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE : 3, TOUCH_ZOOM : 4, TOUCH_PAN : 5, PITCH_ROLL_YAW : 6, ZOOM_SMOOTH : 7 };
	var state = STATE.NONE;
	
	var DIRECTION = { VERTICAL : 0, HORIZONTAL : 1 };
	
	this.toConfig = function() {
		var config = {
			type : "ExamineControls",
			pitch : this._pitch,
			roll : this._roll,
			yaw : this._yaw,
			orientation : this.orientation.toArray(),
			distance : this.distance,
			scale : this.scale
		};
		
		return config;
	};
	
	function isValidConfigNumber(v) {
		return v !== undefined && v !== null && v !== NaN;	
	}
	
	this.fromConfig = function(view) {
		if (!view) {
			return;
		}
		
		this._pitch = (isValidConfigNumber(view.pitch)) ? view.pitch : this._pitch;
		this._roll = (isValidConfigNumber(view.roll)) ? view.roll : this._roll;
		this._yaw = (isValidConfigNumber(view.yaw)) ? view.yaw : this._yaw;
		this.distance = (isValidConfigNumber(view.distance)) ? view.distance : this.distance;
		this.scale = (isValidConfigNumber(view.scale)) ? view.scale : this.scale;
		if (view.orientation) {
			this.orientation.fromArray(view.orientation);
		}
		this._update();
	};
	
	this.reset = function()
	{
		this._pitch = 0;
		this._roll = 0;
		this._yaw = 0;
		this.orientation = new THREE.Quaternion();
		
		this._update();
	};
	
	
	this.rotate = function( rotateX, rotateY ) {
		lastRotateX = rotateX;
		lastRotateY = rotateY;
		
		rotateX *= this.rotateSpeed;
		rotateY *= this.rotateSpeed;
	
		var xAxis = new THREE.Vector3(1, 0, 0);
		var yAxis = new THREE.Vector3(0, 1, 0);
		
		xAxis.rotateX(this._pitch);
		xAxis.rotateZ(this._roll);
		yAxis.rotateX(this._pitch);
		yAxis.rotateZ(this._roll);
	
		var xRot = new THREE.Quaternion();
		xRot.setFromAxisAngle(xAxis, -rotateX);
		
		var yRot = new THREE.Quaternion();
		yRot.setFromAxisAngle(yAxis, -rotateY);
		
		var newRot = yRot.multiply(xRot);
		this.orientation = this.orientation.multiply(newRot);
		
		this._update();
	};
	
	this.update = function(force) {
		if (force) {
			this._update();
		} else {
			if (state == STATE.NONE && (lastRotateX || lastRotateY) ) {
			//	this.rotate(lastRotateX, lastRotateY);
			}
		}
	};
	
	
	this._update = function(skipEventDispatch) {
		
		if (this.object instanceof Array) {
			for (var i = 0; i < this.object.length; i++) {
				this._updateObject(this.object[i]);
			}
		} else {
			this._updateObject(this.object);
		}
		
		if (!skipEventDispatch) {
			this.dispatchEvent( changeEvent );
		}
	}
	
	this._updateObject = function(object) {
	
		var translateMatrix = new THREE.Matrix4();

		matrixPitch.identity().makeRotationX(this._pitch);
		matrixYaw.identity().makeRotationY(this._yaw);
		matrixRoll.identity().makeRotationZ(this._roll);
		matrixRoll.multiply(matrixPitch);
		this.modelView.identity();
		
		
		var m = new THREE.Matrix4();
		m.identity();
		m.makeRotationFromQuaternion(this.orientation);
		this.modelView.multiply(m);
		
		if (this.pitchType == KMG.SurfacePivot) {
			translateMatrix.makeTranslation(0, 0, this.radius);
			this.modelView.multiply( translateMatrix );
		}
		
		this.modelView.multiply( matrixYaw );
		this.modelView.multiply( matrixRoll );
		
		if (this.pitchType == KMG.SurfacePivot) {
			translateMatrix.makeTranslation(0, 0, -this.radius);
			this.modelView.multiply( translateMatrix );
		}
		
		if (!object.forceDefaultDistance) {
			translateMatrix.makeTranslation(0, 0, this.distance);
			this.modelView.multiply( translateMatrix );
		} else {
			translateMatrix.makeTranslation(0, 0, this.defaultDistance);
			this.modelView.multiply( translateMatrix );
		}

		translateMatrix.makeTranslation(0, this.panVertical, 0);
		this.modelView.multiply( translateMatrix );
		
		translateMatrix.makeTranslation(this.panHorizontal, 0, 0);
		this.modelView.multiply( translateMatrix );
		
		//
		if (this.translate) {
			translateMatrix.makeTranslation(this.translate.x, this.translate.y, this.translate.z);
			this.modelView.multiply( translateMatrix );
		}
		
		object.matrix.identity();
		object.applyMatrix(this.modelView);

		
	};
	
	this.eyeDistanceToCenter = function() {
		var position = new THREE.Vector3(0.0, 0.0, this.radius);
		position.rotate(this.pitch, "X");
		position.negate();
		
		var a = this.distance + position.z;
		
		var distanceToCenter = Math.sqrt((position.y * position.y) + (a * a));
		return distanceToCenter;
	};
	
	this.eyeDistanceToSurface = function() {
		var distanceToSurface = this.eyeDistanceToCenter();// - (this.radius * this.scale);
		return distanceToSurface;
	};
	
	this.setScale = function( scale ) {
		if (scale > this.maxScale)
			scale = this.maxScale;
		if (scale < this.minScale)
			scale = this.minScale;
		this.scale = scale;
	};
	
	this.setMinScale = function( minScale ) {
		this.minScale = minScale;
		if (this.scale < minScale)
			this.scale = minScale;
	};
	
	this.setMaxScale = function( maxScale ) {
		this.maxScale = maxScale;
		if (this.scale > maxScale)
			this.scale = maxScale;
	};
	
	this.setFov = function( fov ) {
		if (this.maxFov > fov)
			fov = this.maxFov;
		if (this.minFov < fov)
			fov = this.minFov;
		this.fov = fov;
	};
	
	this.pitch = function ( pitch ) {
		this.setPitch(this._pitch + (pitch * this.rotateSpeed));
	};
	
	this.setPitch = function( pitch ) {
		if (pitch > this.maxPitch) 
			pitch = this.maxPitch;
		if (pitch < this.minPitch)
			pitch = this.minPitch;
		this._pitch = pitch;
		this._update();
	};
	
	this.setMinPitch = function( minPitch ) {
		this.minPitch = minPitch;
		if (this._pitch < minPitch)
			this._pitch = minPitch;
	};
	
	this.setMaxPitch = function( maxPitch ) {
		this.maxPitch = maxPitch;
		if (this._pitch > maxPitch)
			this._pitch = maxPitch;
	};
	
	this.roll = function ( roll ) {
		this.setRoll(this._roll + (roll * this.rotateSpeed));
	};
	
	this.setRoll = function( roll ) {
		this._roll = roll;
		this._update();
	};
	
	
	this.setDistance = function( distance ) {
		if (distance > this.maxDistance)
			distance = this.maxDistance;
		if (distance < this.minDistance)
			distance = this.minDistance;
		this.distance = distance;
		this._update();
	};
	
	this.setMinDistance = function( minDistance ) {
		this.minDistance = minDistance;
		if (this.distance < minDistance)
			this.distance = minDistance;
	};
	
	this.setMaxDistance = function( maxDistance ) {
		this.maxDistance = maxDistance;
		if (this.distance > maxDistance)
			this.distance = maxDistance;
	};
	
	
	this.pan = function(amount, direction) {
		if (!direction || direction === DIRECTION.VERTICAL) {
			this.panVertical = this.panVertical + amount;
		} else if (direction === DIRECTION.HORIZONTAL) {
			this.panHorizontal = this.panHorizontal + amount;
		}
		this._update();
	};
	
	
	function _adjustDistanceByDelta(delta) {
		
		if (scope.zoomType == KMG.Distance) {
		
			// Adjust the distance by a proportional amount every time
			var ratio = scope.distanceMoveSpeed / scope.defaultDistance;
			var distanceMove = ratio * scope.distance;
			
			scope.setDistance(scope.distance + (-delta * distanceMove));
			
		} else if (scope.zoomType == KMG.Scale) {
			
			// Adjust the distance by a proportional amount every time
			var ratio = scope.zoomSpeed / scope.defaultScale;
			var scaleMove = ratio * scope.scale;
			
			scope.setScale(scope.scale + (delta * scaleMove));
		} else if (scope.zoomType == KMG.FoV) {
			
		}
	}
	
	// Events
	function onMouseDown( event ) {
		if (!scope.enabled) return;
		
		lastX = event.clientX;
		lastY = event.clientY;
		
		mouseDownX = event.clientX;
		mouseDownY = event.clientY;
		
		lastRotateX = 0;
		lastRotateY = 0;
		
		// Should be:
		// Left Button -> Rotate
		// Shift + Left Button -> Pitch/Roll
		// Ctrl + Left Button -> Pan
		// Middle Button -> Pitch/Roll
		// Right Button -> Zoom

		if ( event.button === 0 && !event.ctrlKey && !event.shiftKey) {
			state = STATE.ROTATE;
		} else if (event.button == 0 && event.ctrlKey) {
			state = STATE.PAN;
		} else if (event.button == 0 && event.shiftKey) {
			state = STATE.PITCH_ROLL_YAW;
		} else if ( event.button === 1 ) {
			state = STATE.PITCH_ROLL_YAW;
		} else if ( event.button === 2) {
			state = STATE.ZOOM_SMOOTH;
		} 

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );
	}
	
	function onMouseMove( event ) {
		if (!scope.enabled) return;
	
		event.preventDefault();
		
		if (state === STATE.NONE) {
			return;
		}
		
		var xDelta = event.clientX - lastX;
		var yDelta = event.clientY - lastY;
		
		if ( state === STATE.ROTATE ) {
			scope.rotate( (yDelta * (Math.PI / 180)), (xDelta * (Math.PI / 180)) );
		} else if ( state === STATE.ZOOM ) {
			_adjustDistanceByDelta(-yDelta);
		} else if ( state === STATE.ZOOM_SMOOTH) {
			_adjustDistanceByDelta(event.clientY - mouseDownY);
		} else if ( state === STATE.PAN ) {
			scope.pan(yDelta, DIRECTION.VERTICAL);
			scope.pan(-xDelta, DIRECTION.HORIZONTAL);
		} else if ( state === STATE.PITCH_ROLL_YAW ) {
			scope.pitch(yDelta * (Math.PI / 180));
			scope.roll(xDelta * (Math.PI / 180));
		}
		
		lastX = event.clientX;
		lastY = event.clientY;
		
		if (onChange) {
			onChange(scope);
		}
	}
	
	function onMouseUp( event ) {
		if (!scope.enabled) return;
		
		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );
		
		
		mouseDownX = -1;
		mouseDownY = -1;
		lastX = -1;
		lastY = -1;
		state = STATE.NONE;
		
		if (onChange) {
			onChange(scope);
		}
	}
	
	function onMouseWheel( event ) {
		if ( scope.enabled === false ) return;
		
		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9
			delta = event.wheelDelta;
		} else if ( event.detail ) { // Firefox
			delta = -event.detail * 20;
		}
		
		_adjustDistanceByDelta(delta);
		
		if (onChange) {
			onChange(scope);
		}
	}
	
	function onKeyDown( event ) {
		
	}
	
	
	
	
	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
	this.domElement.addEventListener( 'keydown', onKeyDown, false );

};

KMG.ExamineControls.prototype = Object.create( THREE.EventDispatcher.prototype );

/* File: OrbitControls.js */


/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.OrbitControls = function ( object, domElement ) {

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.center = new THREE.Vector3();

	this.userZoom = true;
	this.userZoomSpeed = 1.0;

	this.userRotate = true;
	this.userRotateSpeed = 1.0;

	this.userPan = true;
	this.userPanSpeed = 2.0;

	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	// internals

	var scope = this;

	var EPS = 0.000001;
	var PIXELS_PER_ROUND = 1800;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var zoomStart = new THREE.Vector2();
	var zoomEnd = new THREE.Vector2();
	var zoomDelta = new THREE.Vector2();
	
	var touchZoomDistanceStart = 0;
	var touchZoomDistanceEnd = 0;
	
	var phiDelta = 0;
	var thetaDelta = 0;
	var scale = 1;

	this.lastPosition = new THREE.Vector3();

	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE : 3, TOUCH_ZOOM : 4, TOUCH_PAN : 5 };
	var state = STATE.NONE;

	// events

	var changeEvent = { type: 'change' };


	this.rotateLeft = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta -= angle;

	};

	this.rotateRight = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		thetaDelta += angle;

	};

	this.rotateUp = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta -= angle;

	};

	this.rotateDown = function ( angle ) {

		if ( angle === undefined ) {

			angle = getAutoRotationAngle();

		}

		phiDelta += angle;

	};

	this.zoomIn = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		scale /= zoomScale;

	};

	this.zoomOut = function ( zoomScale ) {

		if ( zoomScale === undefined ) {

			zoomScale = getZoomScale();

		}

		scale *= zoomScale;

	};

	this.pan = function ( distance ) {

		distance.transformDirection( this.object.matrix );
		distance.multiplyScalar( scope.userPanSpeed );

		//this.object.position.add( distance );
		this.center.add( distance );

	};

	this.update = function () {

		var position = this.object.position;
		var offset = position.clone().sub( this.center );

		// angle from z-axis around y-axis

		var theta = Math.atan2( offset.x, offset.z );

		// angle from y-axis

		var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

		if ( this.autoRotate ) {

			this.rotateLeft( getAutoRotationAngle() );

		}

		theta += thetaDelta;
		phi += phiDelta;

		// restrict phi to be between desired limits
		phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

		// restrict phi to be betwee EPS and PI-EPS
		phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

		var radius = offset.length() * scale;

		// restrict radius to be between desired limits
		radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

		offset.x = radius * Math.sin( phi ) * Math.sin( theta );
		offset.y = radius * Math.cos( phi );
		offset.z = radius * Math.sin( phi ) * Math.cos( theta );

		position.copy( this.center ).add( offset );

		this.object.lookAt( this.center );
		
		if (state == STATE.ROTATE) {
			thetaDelta = 0;
			phiDelta = 0;
		}
		
		
		scale = 1;

		if ( this.lastPosition.distanceTo( this.object.position ) > 0 ) {

			this.dispatchEvent( changeEvent );

			this.lastPosition.copy( this.object.position );

		}

	};


	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 0.95, scope.userZoomSpeed );

	}

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;
		
		thetaDelta = 0;
		phiDelta = 0;
		
		event.preventDefault();

		if ( event.button === 0 ) {

			state = STATE.ROTATE;

			rotateStart.set( event.clientX, event.clientY );

		} else if ( event.button === 1 ) {

			state = STATE.ZOOM;

			zoomStart.set( event.clientX, event.clientY );

		} else if ( event.button === 2 ) {

			state = STATE.PAN;

		}

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		if ( state === STATE.ROTATE ) {

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			scope.rotateLeft( 2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed );
			scope.rotateUp( 2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed );

			rotateStart.copy( rotateEnd );

		} else if ( state === STATE.ZOOM ) {

			zoomEnd.set( event.clientX, event.clientY );
			zoomDelta.subVectors( zoomEnd, zoomStart );

			if ( zoomDelta.y > 0 ) {

				scope.zoomIn();

			} else {

				scope.zoomOut();

			}

			zoomStart.copy( zoomEnd );

		} else if ( state === STATE.PAN ) {

			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			scope.pan( new THREE.Vector3( - movementX, movementY, 0 ) );

		}

	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userZoom === false ) return;

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			scope.zoomOut();

		} else {

			scope.zoomIn();

		}

	}

	function onKeyDown( event ) {

		if ( scope.enabled === false ) return;
		if ( scope.userPan === false ) return;
		
		/*
		scope.rotateLeft( 2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed );
			scope.rotateUp( 2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed );
		*/
		
		switch ( event.keyCode ) {
		
			case scope.keys.UP:
				scope.pan( new THREE.Vector3( 0, 1, 0 ) );
				break;
			case scope.keys.BOTTOM:
				scope.pan( new THREE.Vector3( 0, - 1, 0 ) );
				break;
			case scope.keys.LEFT:
				scope.pan( new THREE.Vector3( - 1, 0, 0 ) );
				break;
			case scope.keys.RIGHT:
				scope.pan( new THREE.Vector3( 1, 0, 0 ) );
				break;
		}

	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
	this.domElement.addEventListener( 'mousedown', onMouseDown, false );
	this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
	this.domElement.addEventListener( 'keydown', onKeyDown, false );
	
	// KMG: Adding touch support for OrbitControls, mainly as a migration of the code
	//      from TrackballControls.js
	function touchstart( event ) {
		if ( scope.enabled === false ) return;
		
		event.preventDefault();
		
		switch ( event.touches.length ) {

			case 1:
				state = STATE.TOUCH_ROTATE;
				rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			case 2:
				state = STATE.TOUCH_ZOOM;

				break;

			case 3:
				state = STATE.TOUCH_PAN;
				break;

			default:
				state = STATE.NONE;

		}
	}

	function touchmove( event ) {
		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1:
			
				rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				rotateDelta.subVectors( rotateEnd, rotateStart );

				scope.rotateLeft( 2 * Math.PI * rotateDelta.x / PIXELS_PER_ROUND * scope.userRotateSpeed );
				scope.rotateUp( 2 * Math.PI * rotateDelta.y / PIXELS_PER_ROUND * scope.userRotateSpeed );

				rotateStart.copy( rotateEnd );
			
				break;

			case 2:

				break;

			case 3:
				//_panEnd = _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			default:
				state = STATE.NONE;

		}

	}

	function touchend( event ) {
		if ( scope.enabled === false ) return;

		if ( scope.enabled === false ) return;
		if ( scope.userRotate === false ) return;

		//document.removeEventListener( 'mousemove', onMouseMove, false );
		//document.removeEventListener( 'mouseup', onMouseUp, false );

		state = STATE.NONE;


	}
	
	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );
};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );

/* File: GUI.js */
/**
 * PlanetMaker JavaScript Controller API
 * http://planetmaker.wthr.us
 * 
 * Copyright 2013 Kevin M. Gill
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
 
KMG.TopLeft = "TL";
KMG.TopRight = "TR";
KMG.BottomLeft = "BL";
KMG.BottomRight = "BR";

KMG.Opened = 0;
KMG.Closed = 1;

//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
KMG.GUID = {

	guid : function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	}

};


KMG.OptionController = function(property, title, setValuesInterface, updateInterface) {

	var changeListeners = [];
	
	this.addChangeListener = function(changeListener) {
		changeListeners.push(changeListener);
		return this;
	};
	
	this.setValues = function(values) {
		if (setValuesInterface) {
			setValuesInterface(values);
		}
		return this;
	};
	
	this.update = function() {
		if (updateInterface) {
			updateInterface();
		}
		return this;	
	};
	
	this.onChange = function(oldValue, newValue) {
		
		for (var i = 0; i < changeListeners.length; i++) {
			changeListeners[i](property, title, oldValue, newValue);
		}
	
	};
	
	
	

};

/**
 * @class Provides an individual block of controllers. This is the base component as the user
 * will see it (though not the base in terms of the DOM). Individual controls will
 * be added to instances of this object.
 *
 * @param {string} title Title of the block
 * @param {Object} config Property object backing the controls
 * @param {function} changeListener Callback function fired when a control's value is modified by the user
 *
 * @member KMG
 */
KMG.Block = function ( title, config, changeListener ) {
	
	this.config = config;
	this.changeListener = changeListener;
	var scope = this;
	
	var expandState = KMG.Opened;
	
	var container = $("<div/>").addClass("control-outter-container");
	
	var id = KMG.GUID.guid();
	var element = $("<div/>");
	element.attr("id", id);
	element.addClass("control-container");
	element.appendTo(container);
	
	var expandIcon = $("<a/>").addClass("expand-icon")
							.attr("href", "#")
							.text("-")
							.attr("title", "Click to expand or retract")
							.click(function() { 
								scope.setExpandedState(
									(expandState == KMG.Opened) ? KMG.Closed : KMG.Opened
								);
							}).appendTo(element);
	
	element.append($("<div class='header-title'>" + title + "</div>"));

	var controlContainer = $("<div/>").addClass("inner-container").appendTo(element);

	var controlList = $("<ul/>");
	controlList.appendTo(controlContainer);
	
	var scrollBar = $("<div/>").addClass("control-container-scrollbar-vertical").appendTo(controlContainer);
	$("<hr/>").appendTo(scrollBar);
	
	var lastY = -1;
	var mouseDown = false;
	scrollBar.mousedown(function(e) {
		mouseDown = true;
		lastY = e.clientY;
		scrollBar.addClass("unselectable");
		//console.debug('Mouse Down');
	});
	
	$(document).mouseup(function(e) {
		mouseDown = false;
		scrollBar.removeClass("unselectable");
		//console.debug('Mouse Up');
	});
	
	controlList.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    };

	
	$(document).mousemove(function(e) {
		if (!mouseDown || (lastY <= e.clientY && !controlList.hasScrollBar())) {
			return;
		}
		e.preventDefault();
		var height = e.clientY - controlList.offset().top - 5;
		//console.debug("Setting height to " + height);
		controlList.css("height", height);
		
		lastY = e.clientY;
	});
	
	function fireChangeListener() {
		if (changeListener != null) {
			changeListener();
		}
	}
	
	this.getElement = function()
	{
		return container;
	}
	
	function isValueFloatingPoint(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	/**
     * 
     * @param property
	 * @param title
	 * @param min
	 * @param max
	 * @param step
     */
	this.addRange = function(property, title, min, max, step) {
		if (!min)
			min = 0;
		if (!max) 
			max = 100;
		if (!step) 
			step = 1;
	
		var slider, text;
		
		var controller = new KMG.OptionController(property,
													title, 
													null, // Set Values
													function() { // Update
			
			text.val(config[property]);
			slider.slider({value:config[property]});
		});
		
		var onSlide = function( event, ui ) {
			var oldValue = config[property];
			config[property] = ui.value;
			text.val(ui.value);
			controller.onChange(oldValue, config[property]);
			fireChangeListener();
		};
	
		var id = KMG.GUID.guid();
		var li = $("<li/>");
		$("<label for='" + id + "'>"+title+"</label>").addClass("control-label").appendTo(li);
		slider = $("<div/>").attr("id", id)
				.addClass("slider-control")
				.slider({
					value : config[property],
					min : min,
					max : max,
					step : step,
					range : "min",
					slide : onSlide,
					change : onSlide
				})
				.appendTo(li);
		text = $("<input/>").attr("type", "text")
					.addClass("value-text")
					.css("width", "40px")
					.css("margin-left", "10px")
					.on('input', function(e) {

						var value = $(this).val();
						
						// If the user blanked the input, let them enter something new before we start messing with it
						if (value === "") {
							return;
						}
						
						// Validate that the input value is a number
						if (!isValueFloatingPoint(value)) {
							$(this).val(config[property]);
							return;
						}

						// Validate that the input value falls within proper ranges
						if (value < min) {
							value = min;
							$(this).val(value);
						} else if (value > max) {
							value = max;
							$(this).val(value);
						}
						
						slider.slider("value", value);
						fireChangeListener();
					}).val(config[property])
					.appendTo(li);
		li.appendTo(controlList);
		
		return controller;
	};
	

	
	/**
     * 
     * @param property
	 * @param title
	 * @param options
     */
	this.addSelect = function(property, title, options) {
		var id = KMG.GUID.guid();
		var li = $("<li/>");
		$("<label for='" + id + "'>"+title+"</label>").addClass("control-label").appendTo(li);
		var select = $("<select id='" + id + "'></select>").appendTo(li);
		
		var controller = new KMG.OptionController(property, title, function(values) {
			$(select).empty();
			$.each(values, function(key, value) {
				var option = $("<option/>").attr("value", value).text(value);
				if (value === config[property]) {
					option.attr("selected", "true");
				}
				option.appendTo(select);
			});
		});
		
		select.change(function(e) {
			var oldValue = config[property];
			config[property] = $(select).val();
			controller.onChange(oldValue, config[property]);
			fireChangeListener();
		});
		
		if (options) {
			controller.setValues(options);
		}
		li.appendTo(controlList);
		
		return controller;
	};
	
	/**
     * 
     * @param property
	 * @param title
     */
	this.addToggle = function(property, title) {
		var id = KMG.GUID.guid();
		var li = $("<li/>");
		var oldValue;
		
		$("<label for='" + id + "'>"+title+"</label>").addClass("control-label").appendTo(li);
		var check = $("<input type='checkbox'/>").attr("id", id);
		if (config[property] === true) {
			check.attr("checked", "true");
		}

		var controller = new KMG.OptionController(property, title);
		
		check.click(function(e) {
			oldValue = config[property];
			config[property] = check.prop('checked');
			controller.onChange(oldValue, config[property]);
			//console.debug("Setting '" + property + "' to '" + config[property] + "'");
			fireChangeListener();
		});
		check.appendTo(li);
		
		li.appendTo(controlList);
		return controller;
	};
	
	/**
     * 
     * @param array
     */
	function arrayToColor(array)
	{
		var r = parseInt(array[0]);
		var g = parseInt(array[1]);
		var b = parseInt(array[2]);
		var rgb = "rgb("+r+","+g+","+b+")";
		return rgb;
	}
	
	// https://github.com/vanderlee/colorpicker
	/**
     * 
     * @param property
	 * @param title
     */
	this.addColor = function(property, title) {
		var id = KMG.GUID.guid();
		var li = $("<li/>");
		$("<label for='" + id + "'>"+title+"</label>").addClass("control-label").appendTo(li);
		$("<input/>").attr("id", id)
					.attr("type", "text")
					.val(arrayToColor(config[property]))
					.colorpicker({
						colorFormat : "RGB",
						color : arrayToColor(config[property]),
						ok: function(event, color) {
							config[property] = [color.rgb.r*255, color.rgb.g*255, color.rgb.b*255];
							//console.debug("Set '" + property + "' to '" + config[property] + "'");
							fireChangeListener();
						}
					}).appendTo(li);

		li.appendTo(controlList);
	};
	
	/**
     * 
     */
	function getLocalTimeZoneOffsetMillis()
	{
		var dt = new Date();
		return dt.getTimezoneOffset() * 60000;
	}
	
	// http://trentrichardson.com/examples/timepicker/
	/**
     * 
     * @param property
	 * @param title
     */
	this.addDateTime = function(property, title) {
		var id = KMG.GUID.guid();
		var li = $("<li/>");
		
		$("<label for='" + id + "'>"+title+"</label>").addClass("control-label").appendTo(li);
		
		var picker = $("<input/>").attr("type", "text")
								.attr("id", id)
								.datetimepicker({
									showButtonPanel: true,
									changeMonth: true,
									changeYear: true,
									yearRange : "c-25:c+25",
									onSelect : function(dateText, el) {
										config[property] = picker.datetimepicker('getDate').getTime();// - getLocalTimeZoneOffsetMillis();
										//console.debug("Setting '" + property + "' to '" + (new Date(config[property] - getLocalTimeZoneOffsetMillis())) + "'");
										fireChangeListener();
									}
								}).appendTo(li);
		if (config[property]) {
			picker.datetimepicker('setDate', (new Date(config[property])) );
		}
		
		li.appendTo(controlList);
	};
	
	
	
	/**
     * 
     * @param property
	 * @param title
     */
	this.addDate = function(property, title) {
		var id = KMG.GUID.guid();
		var li = $("<li/>");
		
		$("<label for='" + id + "'>"+title+"</label>").addClass("control-label").appendTo(li);
		
		var picker = $("<input/>").attr("type", "text")
								.attr("id", id)
								.datepicker({
									showButtonPanel: true,
									changeMonth: true,
									changeYear: true,
									yearRange : "c-25:c+25",
									onSelect : function(dateText, el) {
										config[property] = picker.datepicker('getDate').getTime() - getLocalTimeZoneOffsetMillis();
										//console.debug("Setting '" + property + "' to '" + (new Date(config[property] - getLocalTimeZoneOffsetMillis())) + "'");
										fireChangeListener();
									}
								}).appendTo(li);
		if (config[property]) {
			picker.datetimepicker('setDate', (new Date(config[property] + getLocalTimeZoneOffsetMillis())) );
		}
		
		li.appendTo(controlList);
	};
	
	/**
     * 
     * @param input
	 * @param label
	 * @param property
	 * @param validation
     */
	function onTextInput(input, label, property, validation) {
		var valid = true;
		if (validation && typeof validation === 'function' ) {
			valid = validation(input.val());
		} else if (validation && validation instanceof RegExp) {
			valid = validation.test(input.val());
		}
		if (valid) {
			input.removeClass('invalid-value-input');
			label.removeClass('invalid-value-label');
			config[property] = input.val();
		} else {
			input.addClass('invalid-value-input');
			label.addClass('invalid-value-label');
		}
	}
	
	/**
     * 
     * @param property
	 * @param title
	 * @param validation
     */
	this.addText = function(property, title, validation) {
		var id = KMG.GUID.guid();
		var li = $("<li/>");
		
		var label = $("<label for='" + id + "'>"+title+"</label>").addClass("control-label").appendTo(li);

		var text = $("<input/>").attr("type", "text")
								.on('input', function(e) {
									onTextInput($(this), label, property, validation);
								}).val(config[property]).appendTo(li);
		
		li.appendTo(controlList);
		
		onTextInput(text, label, property, validation);
	};
	
	/**
     * 
     * @param title
	 * @param callback
     */
	this.addAction = function(title, callback) {
		var id = KMG.GUID.guid();
		var li = $("<li/>");

		$("<button/>").text(title)
					.attr("id", id)
					.button()
					.click(function(e) {
						callback(e, $(this));
					}).appendTo(li);
		
		li.appendTo(controlList);
	};
	
	/**
     * 
     * @param href
	 * @param text
	 * @param title
     */
	this.addLink = function(href, text, title, target) {
		if (!title) {
			title = text;
		}
		if (!target) {
			target = "_self";
		}
		var id = KMG.GUID.guid();
		var li = $("<li/>");
		$("<a/>").text(text)
				.attr("id", id)
				.attr("href", href)
				.attr("title", title)
				.attr("target", target)
				.appendTo(li);
		
		li.appendTo(controlList);
	};

	/**
     * 
     * @param el
     */
	this.addElement = function(el) {
		var id = KMG.GUID.guid();
		var li = $("<li/>");
		$(el).appendTo(li);
		li.appendTo(controlList);
	};
	
	/**
     * 
     * @param anchor
	 * @param x
	 * @param y
     */
	this.setPosition = function(anchor, x, y) {
		switch(anchor[0]) {
		case "T":
			element.css("top", y);
			break;
		case "B":
			element.css("bottom", y);
			break;
		};
		
		switch(anchor[1]) {
		case "L":
			element.css("left", x);
			break;
		case "R":
			element.css("right", x);
			break;
		};
	};
	
	/**
     * 
     * @param visible
     */
	this.setVisible = function(visible) {
		element.css("display", (visible ? "inline-block" : "none"));
	};
	
	/**
     * 
     * @param state
     */
	this.setExpandedState = function(state) {
		expandState = state;
		if (state == KMG.Opened) {
			controlContainer.css("display", "inline-block");
			element.removeClass().addClass("control-container");
			controlContainer.addClass("inner-container");
			expandIcon.text("-");
		} else {
			controlContainer.css("display", "none");
			expandIcon.text("+");
		}
		
	};
	
};



/**
 * @class 
 *
 * @param {Object} config 
 * @param {function} changeListener
 *
 * @member KMG
 */
KMG.SideBar = function(config, changeListener, addClasses) {
	this.defaultConfig = config;
	this.defaultChangeListener = changeListener;
	var scope = this;
	
	var id = KMG.GUID.guid();
	var element = $("<div/>");
	element.attr("id", id);
	element.addClass("control-sidebar");
	//element.css("display", "inline");
	//element.css("position", "absolute");
	element.appendTo('body');
	
	for (var i = 0; i < addClasses.length; i++) {
		element.addClass(addClasses[i]);
	}
	
	/**
     * 
     * @param block
     */
	this.addBlock = function(block) {
		element.append(block.getElement());
	};
	
	this.removeBlock = function(block) {
		block.getElement().remove();
	};
	
	/**
     * 
     * @param title
	 * @param config
	 * @param changeListener
     */
	this.createBlock = function( title, config, changeListener ) {
		if (!config) {
			config = this.defaultConfig;
		}
		
		if (!changeListener) {
			changeListener = this.defaultChangeListener;
		}
		
		var block = new KMG.Block(title, config, changeListener);
		this.addBlock(block);
		return block;
	};
	

	
	
	/**
     * 
     * @param anchor
	 * @param x
	 * @param y
     */
	this.setPosition = function(anchor, x, y) {
		
		
		switch(anchor[0]) {
		case "T":
			//element.css("top", y);
			break;
		case "B":
			//element.css("bottom", y);
			break;
		};
		
		switch(anchor[1]) {
		case "L":
			element.addClass("control-sidebar-left");
			break;
		case "R":
			element.addClass("control-sidebar-right");
			break;
		};
		
	};
	
	/**
     * 
     * @param opacity
     */
	this.setOpacity = function(opacity) {
		element.css("opacity", opacity);
	};
	
	/**
     * 
     * @param visible
     */
	this.setVisible = function(visible) {
		element.css("display", (visible ? "inline-block" : "none"));
	};
	
	this.setHeight = function(height) {
		element.css("height", height);
	};
};


/**
 * @class 
 *
 * @param {Object} config 
 * @param {function} changeListener
 *
 * @member KMG
 */
KMG.GUI = function(config, changeListener) {

	
	var scope = this;
	
	this.onVisibilityChanged = null;
	
	this.left = new KMG.SideBar(config, changeListener, ["control-sidebar-left"]);
	this.right = new KMG.SideBar(config, changeListener, ["control-sidebar-right"]);
	
	this.left.setPosition("TL", "10px", "100px");
	this.right.setPosition("TR", "10px", "100px");
	
	var showGui = $("<div/>").addClass('control-show-gui')
							.css('display', 'none')
							.appendTo('#container');
	$("<a/>").attr("href", "#")
			.text('Show Controls')
			.on('click', function(e) {
				scope.setVisible(true);
			}).appendTo(showGui);
	
	function updateHeight() {
		scope.left.setHeight(($(window).height() - 100) + "px");
		scope.right.setHeight(($(window).height() - 100) + "px");
	}
	
	$(window).resize(function() {
		updateHeight();
	});
	updateHeight();
	
	
	/**
     * 
     * @param opacity
     */
	this.setOpacity = function(opacity) {
		this.left.setOpacity(opacity);
		this.right.setOpacity(opacity);
	};
	
	/**
     * 
     * @param visible
     */
	this.setVisible = function(visible, suppressShowBlock) {
		this.left.setVisible(visible);
		this.right.setVisible(visible);
		
		if (!suppressShowBlock) {
			showGui.css('display', (visible ? 'none' : 'inline-block'));
		}
		
		if (this.onVisibilityChanged) {
			this.onVisibilityChanged(visible);
		}
	};

	
};

/* File: AppEnv.js */

var AppEnv = {

	config : {
		devMode : false,
		embedded : false,
		disablePlanet : false,
		noAnalytics : false
	},
	
	_getConfig : function(urlParam, defaultValue) {
		var param = AppEnv.getUrlVar(urlParam);
		if (param) {
			return true;
		} else {
			return defaultValue;
		}
	
	},
	
	isDevMode : function() {
		return AppEnv._getConfig("devMode", AppEnv.config.devMode);
	},
	
	isEmbedded : function() {
		return AppEnv._getConfig("embedded", AppEnv.config.embedded);
	},
	
	isPlanetDisabled : function() {
		return AppEnv._getConfig("disablePlanet", AppEnv.config.disablePlanet);
	},
	
	noAnalytics : function() {
		return AppEnv._getConfig("noga", AppEnv.config.noAnalytics);
	},
	

	getUrlVars: function() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},
	getUrlVar: function(name){
		return AppEnv.getUrlVars()[name];
	}

};


/* File: EllipticalOrbiter.js */

KMG.BasicOrbiter = function(context, object, distance, rotationSpeed) {
	KMG.BaseObject.call( this );
	var scope = this;
	this.distance = distance;
	this.rotationSpeed = rotationSpeed;
	this.object = object;
	
	context.objects.push(this);

	function advanceOrbit(obj) {
		if (!obj.lastYRotation) {
			obj.lastYRotation = 0;
		}
		
		obj.lastYRotation += rotationSpeed;
		
		obj.position = new THREE.Vector3( 0, 0, -1000 );
		obj.position.multiplyScalar(distance);
		obj.position.rotateY(obj.lastYRotation*(Math.PI/180.0));
		
	}
	
	this.update = function()
	{
		if (object instanceof Array) {
			for (var i = 0; i < object.length; i++) {
				advanceOrbit(object[i]);
			}
		} else {
			advanceOrbit(object);
		}
		
	};
};
KMG.BasicOrbiter.prototype = Object.create( KMG.BaseObject.prototype );



KMG.EllipticalOrbiter = function(context, object, scale, orbitSpeed, orbit, centerObject, tickController, skipIfInvisible, dontAddToScene) {

	KMG.BaseObject.call( this );
	var scope = this;
	this.scale = (scale) ? scale : 5.0;
	this.orbitSpeed = (orbitSpeed) ? orbitSpeed : 1.0;
	//this.orbitConfig = orbitConfig;
	this.object = object;
	var epoch = 2451545;
	this.centerObject = centerObject;
	this.skipIfInvisible = skipIfInvisible;
	this.period = orbit.period;
	
	this.ownTickController = (tickController) ? false : true;
	this.tickController = (tickController) ? tickController : new KMG.TimeBasedTickController(orbitSpeed);
	if (this.ownTickController) {
		this.tickController.start();
	}
	
	if (!dontAddToScene) {
		context.objects.push(this);
	}
	

	function advanceOrbit(obj) {
		if (scope.ownTickController) {
			scope.tickController.update();
		}
		
		if (scope.skipIfInvisible && !obj.visible) {
			return;
		}
		
		
		var t;
		if (!scope.ownTickController && scope.tickController.tickJulian) {
			t = scope.tickController.tickJulian;
		} else {
			var tickPeriod = (360 / scope.orbitSpeed);
			t = epoch + (scope.tickController.ticks * tickPeriod);
		}

		var p = orbit.positionAtTime(t);
		
		obj.position = p;
		obj.position.multiplyScalar(scope.scale);
		
		if (scope.centerObject) {
			var centerPosition = scope.centerObject.position.clone();
			var centerOnEcliptic = new THREE.Vector3(centerPosition.x, 0, centerPosition.z);
			var centerObjectOrbitAngle = Math.abs(centerOnEcliptic.normalize().angleTo(new THREE.Vector3(0.0, 0.0, 1)));

			if (centerPosition.x < 0) {
				centerObjectOrbitAngle = KMG.RAD_180 + (KMG.RAD_180 - centerObjectOrbitAngle);
			}
			obj.position.add(centerPosition);
		
		}
		
		obj.updateMatrix();
	}
	
	this.update = function()
	{
		if (object instanceof Array) {
			for (var i = 0; i < object.length; i++) {
				advanceOrbit(object[i]);
			}
		} else {
			advanceOrbit(object);
		}
	};
	

};
KMG.EllipticalOrbiter.prototype = Object.create( KMG.BaseObject.prototype );

/* File: EphemerisOrbiter.js */



KMG.EphemerisOrbiter = function(context, object, scale, orbitSpeed, orbit, vectors, displayFuture, centerObjectVectors, centerObjectElements, tickController, skipIfInvisible, dontAddToScene) {

	KMG.BaseObject.call( this );
	var scope = this;
	this.scale = (scale) ? scale : 5.0;
	this.orbitSpeed = (orbitSpeed) ? orbitSpeed : 1.0;
	this.centerObjectVectors = centerObjectVectors;
	this.centerObjectElements = centerObjectElements;
	this.displayFuture = displayFuture;
	this.period = orbit.period;
	var epoch = orbit.epoch;
	
	this.ownTickController = (tickController) ? false : true;
	this.tickController = (tickController) ? tickController : new KMG.TimeBasedTickController(orbitSpeed);
	if (this.ownTickController) {
		this.tickController.start();
	}
	
	var vectorsStartDate = vectors.data[0].epoch;
	var vectorsEndDate = vectors.data[vectors.data.length - 1].epoch;
	
	
	var ellipticalOrbiter = orbit;
	
	if (!dontAddToScene) {
		context.objects.push(this);
	}
	
	function getTickTime() {
		if (scope.ownTickController) {
			scope.tickController.update();
		}

		var t;
		if (!scope.ownTickController && scope.tickController.tickJulian) {
			t = scope.tickController.tickJulian;
		} else {
			var tickPeriod = (360 / scope.orbitSpeed);
			t = epoch + (scope.tickController.ticks * tickPeriod);
		}
		
		return t;
	}
	
	
	function isDateInVectorRange(t) {
		return (t <= vectorsEndDate || (!scope.displayFuture && t >= vectorsEndDate));
	}
	
	function getDateFraction(t) {
		if (!isDateInVectorRange(t)) {
			return -1;
		}
		
		var f = (t - vectorsStartDate) / (vectorsEndDate - vectorsStartDate);
		return f;
	}
	
	function getVectorIndexForDateFraction(f) {
		var i = f * vectors.data.length;
		return i;
	}
	
	function getVectorsForDate(t) {
	
	
	
		if (!isDateInVectorRange(t)) {
			return -1;
		}

		// if the request date is before the vectors, then we assume it to be before the launch.
		// This should only apply to artificial spacecraft
		if (t < vectorsStartDate) {
			return {
				f : 0,
				lower : vectors.data[0],
				upper : vectors.data[0]
			};
		} else if (!scope.displayFuture && t >= vectorsEndDate) {
			return {
				f : 0,
				lower : vectors.data[vectors.data.length - 1],
				upper : vectors.data[vectors.data.length - 1]
			};
		} else {
		
			var f = getDateFraction(t);
			var i = getVectorIndexForDateFraction(f);
			
			var lower = parseInt(i);
			var upper = parseInt(Math.round(i+0.5));
			
			if (upper >= vectors.data.length) {
				upper = lower;
			}

			return {
				f : i - Math.floor(i),
				lower : vectors.data[lower],
				upper : vectors.data[upper]
			};
		}
		
	}
	
	function getInterpolatedVectorForDate(t) {
		if (!isDateInVectorRange(t)) {
			return -1;
		}
		
		var vectors = getVectorsForDate(t);
		if (vectors == -1) {
			return -1;
		}
		
		var x = (vectors.upper.x * vectors.f) + (vectors.lower.x * (1-vectors.f));
		var y = (vectors.upper.y * vectors.f) + (vectors.lower.y * (1-vectors.f));
		var z = (vectors.upper.z * vectors.f) + (vectors.lower.z * (1-vectors.f));

		return new THREE.Vector3(x, z, -y);
	}
	
	
	function advanceOrbit(object) {
		
		var t = getTickTime();
		
		if (scope.skipIfInvisible && !object.visible) {
			return;
		}

		if (isDateInVectorRange(t)) {
			
			var vector = getInterpolatedVectorForDate(t);
			
			object.position = vector;
			object.position.multiplyScalar(scope.scale);
			
			if (scope.centerObjectVectors) {
				var centerPosition = scope.centerObjectVectors.position.clone();
				var centerOnEcliptic = new THREE.Vector3(centerPosition.x, 0, centerPosition.z);
				var centerObjectOrbitAngle = Math.abs(centerOnEcliptic.normalize().angleTo(new THREE.Vector3(0.0, 0.0, 1)));

				if (centerPosition.x < 0) {
					centerObjectOrbitAngle = KMG.RAD_180 + (KMG.RAD_180 - centerObjectOrbitAngle);
				}
				object.position.add(centerPosition);
			
			}
			
			object.updateMatrix();
			
		} else {
			ellipticalOrbiter.update();
		}
		
	}
	

	this.update = function()
	{
		if (object instanceof Array) {
			for (var i = 0; i < object.length; i++) {
				advanceOrbit(object[i]);
			}
		} else {
			advanceOrbit(object);
		}
	};


};
KMG.EphemerisOrbiter.prototype = Object.create( KMG.BaseObject.prototype );

/* File: TickController.js */

KMG.TickController = function(tickSpeed) {

	this.ticks = 0;
	
	this.tickSpeed = (tickSpeed) ? tickSpeed : 1.0;
	
	var active = false;
	var scope = this;
	
	this.start = function() {
		active = true;
	};
	
	this.stop = function() {
		active = false;
	};
	
	this.update = function() {
		if (active) {
			this.ticks += (this.tickSpeed * 1);
		}
	};

};

KMG.TimeBasedTickController = function(speed, onUpdate) {
	
	// Defaults to realtime starting now
	var epoch = KMG.Util.julianNow();
	this.speed = (speed) ? speed : 1;
	this.ticks = 0;

	this.tickJulian = epoch;
	this.tickDate = KMG.Util.julianToDate(this.tickJulian);
	
	var last = 0;
	var lastWarp = 0;
	
	var active = false;
	var scope = this;
	
	function fireOnUpdate() {
		if (onUpdate) {
			onUpdate(scope.tickJulian, scope.tickDate);
		}
	};
	
	this.getEpoch = function() {
		return epoch;
	};
	
	this.resetToToday = function() {
		epoch = KMG.Util.julianNow();
		this.ticks = 0;
		lastWarp = 0;
		this.update(true);
	};
	
	this.resetToJulianDay = function(jd) {
		epoch = jd;
		this.ticks = 0;
		lastWarp = 0;
		this.update(true);
	};
	
	this.resetToDate = function(millis) {
		var d = new Date(millis);
		epoch =  KMG.Util.dateToJulian(d.getFullYear(),
							d.getMonth() + 1,
							d.getDate(),
							d.getHours(),
							d.getMinutes(),
							d.getSeconds());
		last = d.getTime();
		this.ticks = 0;
		this.tickJulian = epoch;
		this.tickDate = KMG.Util.julianToDate(this.tickJulian);
		lastWarp = 0;
		fireOnUpdate();
	};

	
	
	this.isActive = function() {
		return active;
	};
	
	this.start = function() {
		active = true;
		last = (new Date()).getTime();
	};
	
	this.stop = function() {
		active = false;
	};
	
	this.update = function(force) {
		if (active || force) {
			var d = new Date();
			var now = d.getTime();

			var warp = 0;
			if (last > 0) {
				warp = ((now - last) *  this.speed) / (86400000);
				lastWarp += warp;
			}
			last = now;

			this.tickJulian = epoch + lastWarp;
			this.tickDate = KMG.Util.julianToDate(this.tickJulian);
			
			fireOnUpdate();
		}
	};

};





KMG.IntervalTimeBasedTickController = function(speed, interval, onUpdate) {
	
	// Defaults to realtime starting now
	var epoch = KMG.Util.julianNow();
	this.speed = (speed) ? speed : 1;
	this.interval = interval;
	this.ticks = 0;

	this.tickJulian = epoch;
	this.tickDate = KMG.Util.julianToDate(this.tickJulian);
	
	var last = 0;
	
	var active = false;
	var scope = this;
	
	function fireOnUpdate() {
		if (onUpdate) {
			onUpdate(scope.tickJulian, scope.tickDate);
		}
	};
	
	this.getEpoch = function() {
		return epoch;
	};
	
	this.resetToToday = function() {
		epoch = KMG.Util.julianNow();
		this.ticks = 0;
		this.update(true);
	};
	
	this.resetToJulianDay = function(jd) {
		epoch = jd;
		this.ticks = 0;
		this.update(true);
	};
	
	this.resetToDate = function(millis) {
		var d = new Date(millis);
		epoch =  KMG.Util.dateToJulian(d.getFullYear(),
							d.getMonth() + 1,
							d.getDate(),
							d.getHours(),
							d.getMinutes(),
							d.getSeconds());
		last = d.getTime();
		scope.ticks = 0;
		scope.tickJulian = epoch;
		this.tickDate = KMG.Util.julianToDate(scope.tickJulian);
		
		fireOnUpdate();
	};

	
	
	this.isActive = function() {
		return active;
	};
	
	this.start = function() {
		active = true;
		last = (new Date()).getTime();
	};
	
	this.stop = function() {
		active = false;
	};
	
	this.update = function(force) {
		if (active || force) {
			var d = new Date();
			var now = d.getTime();
			
			this.ticks += this.interval;

			this.tickJulian = epoch + this.ticks;
			this.tickDate = KMG.Util.julianToDate(this.tickJulian);
			
			fireOnUpdate();
		}
	};

};



/* File: KeyCommandBindManager.js */
KMG.KeyCommandBindManager = function(engine) {
	
	var screenshotUnbind = null;
	var fullscreenUnbind = null;
	
	this.engine = engine;
	
	this.bindScreenshot = function() {
		if (screenshotUnbind) {
			return false;
		}
		if (this.engine && this.engine.context) {
			screenshotUnbind = THREEx.Screenshot.bindKey(this.engine.context.renderer);
			return true;
		} else {
			console.info("Failed to bind screenshot keys: Engine not found");
			return false;
		}
	};
	
	this.unbindScreenshot = function() {
		if (screenshotUnbind) {
			screenshotUnbind.unbind();
			screenshotUnbind = null;
		}
	};
	
	this.bindFullscreen = function() {
		if (fullscreenUnbind) {
			return false;
		}
		
		if( THREEx.FullScreen.available() ){
			fullscreenUnbind = THREEx.FullScreen.bindKey();
			return true;
		} else {
			return false;
		}
	};
	
	this.unbindFullscreen = function() {
		if (fullscreenUnbind) {
			fullscreenUnbind.unbind();
			fullscreenUnbind = null;
		}
	};
	
	this.bindAll = function() {
		var ssOk = this.bindScreenshot();
		var fsOk = this.bindFullscreen();
		return {
			screenshot : ssOk,
			fullscreen : fsOk
		};
	};
	
	this.unbindAll = function() {
		this.unbindScreenshot();
		this.unbindFullscreen();
	};
};
KMG.keyCommandBindManager = new KMG.KeyCommandBindManager();
/* File: CentralSun.js */
KMG.DefaultCentralSunConfig = {
	texture : KMG.starFlares[0].name,
	kmScalar : 0.000005
};

KMG.CentralSunObject = function ( context, config ) {
	
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultCentralSunConfig);
	var scope = this;
	this.context = context;
	
	var sunConfig = {radius:696342*config.kmScalar
					, fog:false
					, scale:config.kmScalar
					, texture:"Sun"
					, ambient: 0xFFFFFF
					, emissive: 0xFFFFFF
					, shading : false
					, color: 0xFFFFFF};
					
	var sun = new KMG.TexturedSphereObject(context, sunConfig);
	this.add(sun);
	
	var texDefinition = KMG.TextureMap.getFlareDefinitionByName(config.texture);
	var texture = (texDefinition.texture != null) ? KMG.TextureMap.loadTexture(texDefinition.texture) : null;

	texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
	texture.format = THREE.RGBAFormat;
	texture.needsUpdate = true;
	var star = new THREE.Object3D();
	var material = new THREE.SpriteMaterial({fog : false
											, color : 0xFFFFFF
											, sizeAttenuation : false
											, transparent : true
											, blending : THREE.AdditiveBlending
											, useScreenCoordinates: false
											, depthWrite: false
											, depthTest: true
											, map : texture
											});

	var sprite = new THREE.Sprite(material);
	sprite.scale.set( 100 , 100, 1 );
	star.add(sprite);
	star.update = function() { };
	star.position = new THREE.Vector3(0, 0, 0);
	this.add(star);
	
	this.isAtScreenPosition = function(x, y, sceneOffset, radius) {
		if (!radius) {
			radius = 0.033;
		}
		
		var projector = new THREE.Projector();
		var vector = new THREE.Vector3( x, y, 1 );
		
		var pos = this.position.clone();
		pos.add(sceneOffset.clone().negate());
		projector.projectVector( pos, context.camera );
		return (vector.distanceTo(pos) <= radius);
	}
	
	this.update = function() {
		
		if (sun) {
			sun.update();
		}
		
	};
};
KMG.CentralSunObject.prototype = Object.create( KMG.BaseObject.prototype );

/* File: SolarSystem.js */





KMG.SolarSystemNavigationController = function(modelConfig) {
	
	var configs = [modelConfig];
	
	var initialUrl = document.location.href.split(/[?#]/)[0];
	
	var navListeners = [];
	
	var enabled = true;
	
	window.onpopstate = function(event) {
		if (event.state) {
			fireNavigationListener(event.state);
		}
	};
	
	function setEnabled(e) {
		enabled = e;
	}
	
	function isEnabled() {
		return enabled;
	}
	
	function buildQueryString() {
		var qs = "#";
		
		for (var i = 0; i < configs.length; i++) {
			var config = configs[i];
			for (var name in config) {
				var value = config[name];
				qs += name + "=" + value + "&";
			}
		}
		
		return qs;
	}
	
	function buildState() {
		
		var state = KMG.Util.clone(modelConfig);
		return state;
	}
	
	
	function pushState() {
		if (!enabled) {
			return;
		}
		var title = "";
		var stateObj = buildState();
		var query = buildQueryString();
		window.history.pushState(stateObj, title, initialUrl + query); 
	};
	
	function fireNavigationListener(state) {
		for (var i = 0; i < navListeners.length; i++) {
			navListeners[i](state);
		}
	};
	
	function addNavigationListener(listener) {
		navListeners.push(listener);
	};
	
	function addConfig(config) {
		configs.push(config);
	};

	return {
		setEnabled : setEnabled,
		isEnabled : isEnabled,
		pushState : pushState,
		addConfig : addConfig,
		addNavigationListener : addNavigationListener
		
	};
	
};




// Reserved Colors:
// 0xFF0000 - Red:               Active focus orbit
// 0xFFFFFF - White:             Spacecraft orbits
// 0x304FFF - Light Blue:        Generic orbits
// 0x006600 - Darker Green:      Ecliptic
// 0x33CC66 - Teal:              Equatorial
// 0xCC9999 - Purple:            Azimuthal
KMG.OrbitColors = [
	0x999999, // Grey
	0xFFCCFF, // Light Pink
	0xFFFF99, // Light Yellow
	0x6666CC, // Light Watery Blue
	0x8A4D43, // Darkish Redish
	0xFFCC99,  // Light Orangish?
	0xCCFFFF, // Powder Blue
	0x33FFFF, // Cyan
	0xFF00FF, // Purple
	0x990000, // Maroon
	0xFF9900, // Orange
	0xFFFF00, // Yellow
	0x0000FF, // Blue
	0x99FF00, // Lime Green
	0xCC9999, // Light Purple
	//0x33CC66, // Teal
	0x00FF00, // Bright Green
	//0x006600, // Darker Green
	//0xFFFFFF, // White
	0xCCCCCC, // Light grey
	0xFF0099, // Pink
];







KMG.OrbitDisplay = {};
KMG.OrbitDisplay.All = 1;
KMG.OrbitDisplay.MajorPlanets = 2;
KMG.OrbitDisplay.MinorPlanets = 4;
KMG.OrbitDisplay.Moons = 8;
KMG.OrbitDisplay.Focus = 16;

KMG.activeOrbitDisplays = function(v) {
	var displays = [];
	for (var i in KMG.OrbitDisplay) {
		if (v & KMG.OrbitDisplay[i]) {
			displays.push(KMG.OrbitDisplay[i]);
		}
	}

	return displays;
};




KMG.DefaultSolarSystemConfig = {
	initWithShadows : false,
	shadows : false,
	shadowDarkness : 0.8,
	kmScalar : 0.000005,
	textureResolution : "1024x768",
	enableFps : true,
	camera : {
		positionZ : 700,
		fieldOfView : 45,
		near : 2,
		far : 100000000
	},
	canvas : {
		forceResolution : false,
		width : 1920,
		height : 1080
	}
};


KMG.SolarSystem = function ( domElement, config, sceneCallbacks ) {

	this.config = config;
	this.sceneCallbacks = sceneCallbacks;
	this.domElement = ( domElement !== undefined ) ? domElement : document;
	
	
	var lookingAt = "Sun";
	var lookingFrom = "Free";
	var fieldOfView = 45;
	var orbitLinesVisible = true;
	
	var primaryCameraPosition = new THREE.Vector3(0, 0, 0);
	var secondaryCameraPosition = new THREE.Vector3(0, 0, 0);
	
	var frameNumber = 0;
	var saveFrames = false;
	
	var loadableObjects = [];
	var loadableSatellites = [];
	
	var viewFromType = "Geocentric";
	var topocentricLatitude = 0;
	var topocentricLongitude = 0;
	
	var orientUpToEcliptic = false;
	
	var doSaveAttachment = {
		saveNextFrame : false,
		objectId : null, 
		credit : null,
		source : null,
		authorization : null,
		callback : null
	};
	
	
	var context = {
		composer : null,
		container : null, 
		stats : null,
		camera : null, 
		secondaryCamera : null,
		primaryScene : null,
		secondaryScene : null,
		renderer : null,
		controls : null,
		windowHalfX : window.innerWidth / 2,
		windowHalfY : window.innerHeight / 2,
		containerWidth : 0,
		containerHeight : 0,
		objects : [],
		planets : {},
		animationID : 0,
		background : null,
		tickController : null,
		mouse : {
			x : 0,
			y : 0,
			clientX : 0,
			clientY : 0
		},
		lights : {
			ambient : null,
			primaryPoint : null,
			secondaryPoint : null
		}
	};
	this.context = context;
	
	//var scope = this;

	function onWindowResize() 
	{
		context.windowHalfX = $("#container").width() / 2;
		context.windowHalfY = $("#container").height() / 2;
		
		context.containerWidth = $("#container").width();
		context.containerHeight = $("#container").height();
		
		context.camera.aspect = $("#container").width() / $("#container").height();
		context.camera.updateProjectionMatrix();

		context.renderer.setSize( $("#container").width(), $("#container").height() );
	}
	
	function onDocumentMouseMove( event ) 
	{
		context.mouse.clientX = event.clientX;
		context.mouse.clientY = event.clientY;
		context.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		context.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}
	
	function onDocumentMouseClickHandler( event, callback ) {
		onDocumentMouseMove(event);
		
		var sceneOffsetVector = getFocusPointVector(lookingAt);
		var scale = (lookingFrom == "Free") ? context.controls.scale : 1;
		
		for (var name in context.planets) {
			var obj = context.planets[name];
			if (obj.isAtScreenPosition && obj.isAtScreenPosition(context.mouse.x, context.mouse.y, sceneOffsetVector, 0.033, scale)) {

				if (callback) {
					callback(scope, obj);
				}
				
				update();
				return;
				
			}
		}
	}
	
	function onDocumentMouseClick( event ) {
		onDocumentMouseClickHandler( event, sceneCallbacks.onObjectClicked );
	}
	
	
	function onDocumentMouseDoubleClick( event ) {
		onDocumentMouseClickHandler( event, sceneCallbacks.onObjectDoubleClicked );
	}
	
	function addObjectToPrimaryScene(object)
	{
		context.objects.push(object);
		context.primaryScene.add( object );
		
		return object;
	}
	
	function addObjectToSecondaryScene(object) {
		context.objects.push(object);
		context.secondaryScene.add( object );
		return object;
	}
	
	
	
	function createObject(data) {
		
		var centerObject = null;
		if (data.orbiting) {
			centerObject = context.planets[data.orbiting];
		}
		
		var vectorsOrbiting;
		if (data.vectors.orbiting) {
			vectorsOrbiting = context.planets[data.vectors.orbiting];
		} else {
			vectorsOrbiting = centerObject;
		}
		
		var elementsOrbiting;
		if (data.elements.orbiting) {
			elementsOrbiting = context.planets[data.elements.orbiting];
		} else {
			elementsOrbiting = centerObject;
		}
		
		// Suppress future (keplerian orbital elements) for all objects except satellites
		var suppressFuture = (data.type == "satellite") ? false : true;

		var object = new KMG.OrbitingObject(context, {kmScalar : config.kmScalar, elementsOrbitColor : 0x999999, suppressFuture : suppressFuture, useFadingVectorPath : true, suppressDatesOfInterest : true, suppressSpacecraftModels : true}, data, tickController, vectorsOrbiting, elementsOrbiting, centerObject);
		context.objects.push(object);
		centerObject.addChild(object);
		
		object.setFutureOrbitVisibility((data.type == "satellite" || data.type == "asteroid"));
		object.setUsingFadingLine((data.type != "satellite" && data.type != "comet"));
		object.name = data.name;
		object.level = 0;
		object.id = data._id;
		object.orbiting = elementsOrbiting;
		context.planets[data.name] = object;
		
		if (data.name == lookingAt) {
			setLookingAt(lookingAt);
		}
		
		update();
		
		if (sceneCallbacks.onObjectLoaded) {
			sceneCallbacks.onObjectLoaded(scope, data, object);
		}
	}
	

	
	
	function findLoadableById(id) {
		for (var n in context.planets) {
			if (context.planets[n].id == id) {
				return context.planets[n];
			}
		}
		return null;
	}
	
	function loadRemoteObject(url, suppressFuture) {
		$.ajax({
			url: url,
			dataType: "json",
			error: function( jqXHR, textStatus, errorThrown ) {
				console.warn("Error: " + errorThrown);
			
			},
			success: function(data, textStatus, jqxhr) {
				
			}
		}).done(function(data) {
			createObject(data, suppressFuture);
		});
	}
	
	function tleBasedToEarthOrbiting(tle) {
		var data = {};
		data.displayFuture = true;
		data.links = [];
		data.origin = "tle/celestrak";
		data.type = "satellite";
		data.orbiting = "Earth";
		data.vectors = { data : [] };
		data.elements = {
			orbiting : "Earth",
			data : tle
		};
		data.datesOfInterest = [];
		data.model = {
			file : "generic",
			scale : 1
		};
		data._id = tle.satelliteNumber;
		data.name = tle.name;
		data.start = tle.epoch;
		data.isDebris = false;
		data.initialEyeDistance = 0.0000732369465053;
		return data;
	}
	
	function loadTleBased(tle) {
		
		var data = tleBasedToEarthOrbiting(tle);
		console.info(data);
		createObject(data, false);
	}
	
	function load(id) {
		
		var loadable = findLoadableById(id);
		
		if (loadable) {
			
			if (loadable.orbiting) {
				loadable.orbiting.addChild(loadable);
			} else {
				context.primaryScene.add( loadable );
			}
			
			
		} else {
			loadRemoteObject("/api/data/" + id);
		}
	}
	
	
	
	function unload(id) {
		var loadable = findLoadableById(id);
		if (loadable.orbiting) {
			loadable.orbiting.removeChild(loadable);
		} else {
			context.primaryScene.remove( loadable );
			update();
		}
		
	}

	
	function start() {
		tickController.start();
	}
	
	function stop() {
		tickController.stop();
	}
	
	function isActive() {
		return tickController.isActive();
	}
	
	function setToDateMillis(date) {
		tickController.resetToDate(date);
	}
	
	
	function setViewFromType(type) {
		viewFromType = type;
		//update();
	}
	
	function setTopocentricLatitude(lat) {
		topocentricLatitude = lat;
		//update();
	}
	
	function setTopocentricLongitude(lon) {
		topocentricLongitude = lon;
		//update();
	}
	
	function setOrientUpToEcliptic(upToEcliptic) {
		orientUpToEcliptic = upToEcliptic;
	}
	
	function setTimeWarp(timeWarp) {
		tickController.speed = timeWarp;
	}
	
	function setLookingAt(name) {
		lookingAt = name.replace(/\.\.\./g, "");
		
		for (var n in context.planets) {
			if (context.planets[n].setIsFocus) {
				context.planets[n].setIsFocus(false);
			}
		}
		if (context.planets[lookingAt] && context.planets[lookingAt].setIsFocus) {
			context.planets[lookingAt].setIsFocus(true);
		} 
		update();
	}
	
	
	
	function setLookingFrom(name) {
		
		if (lookingFrom != "Free" && name == "Free") {
			context.primaryCamera.position = primaryCameraPosition;
			context.secondaryCamera.position = secondaryCameraPosition;
			context.controls._update(true);
		} else if (name != "Free") {
			primaryCameraPosition = context.primaryCamera.position;
			secondaryCameraPosition = context.secondaryCamera.position;
		}
		
		lookingFrom = name.replace(/\.\.\./g, "");

	}
	
	function setAnimationSpeed(speed) {
		tickController.speed = speed;
	}
	
	function setFieldOfView(fov) {
		fieldOfView = fov;
	}
	
	function setEclipticVisibility(visible) {
		eclipticLine.setVisibility(visible);
	}
	
	function setEquatorialVisibility(visible) {
		equatorialLine.setVisibility(visible);
	}
	
	function setAzimuthalVisibility(visible) {
		azimuthalLine.setVisibility(visible);
	}
	
	function setTopocentricIndicatorVisible(visible) {
		topoCentricPositionIndicator.setVisibility(visible);
	}
	
	function getPlanet(name) {
		return context.planets[name];
	}
	
	function setSavingFrames(save) {
		saveFrames = save;
		
		update();
	}
	
	function saveAttachment(objectId, credit, source, authorization, callback) {
		
		doSaveAttachment.saveNextFrame = true;
		doSaveAttachment.objectId = objectId;
		doSaveAttachment.credit = credit;
		doSaveAttachment.source = source;
		doSaveAttachment.authorization = authorization;
		doSaveAttachment.callback = callback;
		
	}
	
	function getObjects() {
		var objects = [];
		for (var name in context.planets) {
			objects.push(context.planets[name]);
		}
		return objects;
	}
	
	function getObjectNames() {
		var names = [];
		
		for (var name in context.planets) {
			names.push(name);
		}
		
		return names;
	}
	
	
	function setOrbitLinesVisibility(visible) {
		orbitLinesVisible = visible;
		for (var name in context.planets) {
			if (context.planets[name] && context.planets[name].setOrbitLinesVisibility) {
				context.planets[name].setOrbitLinesVisibility(visible);
			}
		}
		
		update();
	}

	function getFocusPointVector(name) {
		var focusPoint;
		
		if (context.planets[name] && context.planets[name].getPlanetVector) {
			focusPoint = context.planets[name].getPlanetVector();
		} else if (context.planets[name] && context.planets[name].getPosition){
			focusPoint = context.planets[name].getPosition();
		} else {
			focusPoint = new THREE.Vector3(0, 0, 0);
		}
		
		return focusPoint;
	}
	
	function getViewerLocationVector(name, _locType) {
		var vector;
		
		if (!_locType) {
			_locType = viewFromType;
		}
		
		if (context.planets[name] && context.planets[name].getPlanetVector && _locType == "Geocentric") {
			vector = context.planets[name].getPlanetVector();
		} else if (context.planets[name] && context.planets[name].getPlanetTopocentricVector && _locType == "Topocentric") {
			vector = context.planets[name].getPlanetTopocentricVector(topocentricLatitude, topocentricLongitude, context.tickController.tickJulian);
		} else if (context.planets[name] && context.planets[name].getPosition){
			vector = context.planets[name].getPosition();
		} else {
			vector = new THREE.Vector3(0, 0, 0);
		}
		
		return vector;
	}
	
	
	function setStarNameVisibility(visible) {
		stars.setTextVisibility(visible);
	};
	
	function setConstellationVisibility(visible) {
		constellations.setVisibility(visible);
	};
	
	function setStarsVisibility(visible) {
		stars.setVisibility(visible);
	};
	
	function updateTopocentricPositionIndicator()
	{
		var from = getViewerLocationVector(lookingFrom != "Free" ? lookingFrom : "Earth", "Topocentric");
		topoCentricPositionIndicator.position = from;
		
	}
	
	function updateAzimuthalLineOrientation() {
		var from = getViewerLocationVector(lookingFrom != "Free" ? lookingFrom : "Earth", "Geocentric");
		azimuthalLine.position = from;
		
		
		var to = getViewerLocationVector(lookingFrom != "Free" ? lookingFrom : "Earth", "Topocentric");
		azimuthalLine.lookAt(to);
	}
	
	
	function updateView()
	{
		var at = getFocusPointVector(lookingAt);
		var lookingFromObject = context.planets[lookingFrom != "Free" ? lookingFrom : "Earth"];
		
		if (lookingFrom == "Free") {
			
			context.primaryScene.position = at.clone().negate().multiplyScalar(context.controls.scale);
			context.primaryScene.scale.set(context.controls.scale, context.controls.scale, context.controls.scale);
			context.primaryScene.updateMatrix();

			context.primaryCamera.near = 2.0;
			context.primaryCamera.updateProjectionMatrix();

		} else {
			context.primaryScene.scale.set(1, 1, 1);
			
			var from = getViewerLocationVector(lookingFrom);
			
			var up;
			
			if (orientUpToEcliptic) {
				up = new THREE.Vector3(0, 1, 0);
			} else {
				var geoFrom = getViewerLocationVector(lookingFrom, "Geocentric");
				var topFrom = getViewerLocationVector(lookingFrom, "Topocentric");
				topFrom.sub(geoFrom);
				up = topFrom;
			}
			context.primaryCamera.position = from;
			context.primaryCamera.up = up;
			context.primaryCamera.lookAt(at);

			var secondaryFrom = from.clone().normalize();
			context.secondaryCamera.position = from;
			context.secondaryCamera.up = up;
			context.secondaryCamera.lookAt(at);
			
			context.primaryScene.position = new THREE.Vector3(0, 0, 0);
			context.primaryScene.updateMatrix();

			var distance = from.distanceTo(at);
			if (distance < 2 || lookingFrom == "Saturn") {
				context.primaryCamera.near = 0.001;
			} else if (distance > 1000) {
				context.primaryCamera.near = 20;
			} else {
				context.primaryCamera.near = 2;
			}
			context.primaryCamera.fov = fieldOfView;
			context.primaryCamera.updateProjectionMatrix();
			
			context.secondaryCamera.fov = fieldOfView;
			context.secondaryCamera.updateProjectionMatrix();
			
			
			
		}
		
		
		
		if (lookingFromObject && lookingFromObject.applyObliquityToObject) {
			lookingFromObject.applyObliquityToObject(equatorialLine);
		}
		
		
		context.primaryScene.updateMatrix();
		context.secondaryScene.updateMatrix();
		
	}
	
	function update() {

		for (var name in context.planets) {
			if (context.planets[name].updatePosition) {
				context.planets[name].updatePosition();
			}
		}
		
		for (var i = 0; i < context.objects.length; i++) {
			context.objects[i].update();
		}

	}
	
	
	function animate() 
	{	
		
		
		if (lookingFrom == "Free") {
			context.controls.update();
		}
		
		if (config.enableFps && context.stats) {
			context.stats.update();
		}
		

		render();
		
		context.animationID = requestAnimationFrame( animate );
	}



	function render() {	

		context.tickController.update();
		
		var sceneOffsetVector = getFocusPointVector(lookingAt);
		var scale = (lookingFrom == "Free") ? context.controls.scale : 1;
		for (var i = 0; i < context.objects.length; i++) {

			if (context.objects[i].onMousePosition) {
				context.objects[i].onMousePosition(context.mouse.x, context.mouse.y, context.mouse.clientX, context.mouse.clientY, sceneOffsetVector.clone(), scale);
			}
		}
		
		if (sceneCallbacks.onRender) {
			sceneCallbacks.onRender(scope, context);
		}
		
		updateAzimuthalLineOrientation();
		updateTopocentricPositionIndicator();
		updateView();
		
		/*
		if (context.planets["Sun"] && context.planets[lookingAt]) {

			var scenePos = context.primaryScene.position.clone().multiplyScalar(1/context.controls.scale).negate();
			var targetPos = context.planets[lookingAt].getPlanetVector().multiplyScalar(1/context.controls.scale);
			var targetLight = context.lights.primaryDirectional;
			targetLight.position = scenePos;
			targetLight.target.position = targetPos;
		}
		*/
		
		//var time = Date.now() * 0.0004;
		//context.composer.render( time );
		
		context.renderer.clear();
		context.renderer.render(context.primaryScene, context.primaryCamera);
		context.renderer.render(context.secondaryScene, context.secondaryCamera);
		
		//doSaveAttachment: objectId, credit, source, authorization, saveNextFrame
		if (doSaveAttachment.saveNextFrame) {
			var dataUrl	= context.renderer.domElement.toDataURL("image/jpeg");
			
			$.ajax({
				url: "/api/attachment/" + doSaveAttachment.objectId,
				type : "POST",
				data : { name : "OrbitView.jpg", 
						credit : doSaveAttachment.credit,
						source : doSaveAttachment.source,
						authorization : doSaveAttachment.authorization,
						data : dataUrl }
			}).done(function(data) {
				
				if (doSaveAttachment.callback) {
					doSaveAttachment.callback(true);
				}
				
			});
			
			doSaveAttachment.saveNextFrame = false;
		}
		
		
		
		if (saveFrames) {
			//if (context.tickController.isActive() || frameNumber > 0 && context.tickController.tickJulian < 2456689.499988) {
	
				var dataUrl	= context.renderer.domElement.toDataURL("image/jpeg");
				/*
				
				
				var canvas1 = document.createElement('canvas');
				var context1 = canvas1.getContext('2d');
				canvas1.width = 1920;
				canvas1.height = 1080;
				
				context1.drawImage(context.renderer.domElement, 0, 0, 1920, 1080, 0, 0, 1920, 1080);
				context1.font = "40px sans-serif";
				context1.fillStyle = "rgba(255,255,255,0.95)";

				context1.textAlign="left";				
				context1.fillText(moment(context.tickController.tickDate).format("LLL") + " UTC"
									, 10
									, 60);
				
				var dataUrl	= canvas1.toDataURL("image/jpeg");
				*/
				$.ajax({
					url: "/api/saveframe/",
					type : "POST",
					data : { fn : frameNumber++, data : dataUrl }
				}).done(function(data) {
				
				});
				
			//}
		}
		
		
	}

	context.container = this.domElement;
	
	KMG.TextureMap.textureResolution = "1024x512";
	KMG.TextureMap.sceneReadyCallback = this.sceneCallbacks.sceneReadyCallback;
	KMG.TextureMap.resourceLoadingStart = this.sceneCallbacks.resourceLoadingStart;
	KMG.TextureMap.resourceLoadingFinish = this.sceneCallbacks.resourceLoadingFinish;
	KMG.TextureMap.renderCallback = render;

	var canvasWidth = (config.canvas.forceResolution) ? config.canvas.width : $("#container").width();
	var canvasHeight = (config.canvas.forceResolution) ? config.canvas.height : $("#container").height();


	context.primaryCamera = new THREE.PerspectiveCamera( config.camera.fieldOfView, canvasWidth / canvasHeight, config.camera.near, config.camera.far );
	context.primaryCamera.forceDefaultDistance = false;
	context.camera = context.primaryCamera;
	
	context.secondaryCamera = new THREE.PerspectiveCamera( config.camera.fieldOfView, canvasWidth / canvasHeight, config.camera.near, config.camera.far / config.kmScalar );
	context.secondaryCamera.forceDefaultDistance = true;
	
	
	var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true, preserveDrawingBuffer : true} );
	renderer.setSize( canvasWidth, canvasHeight );
	
	if (config.initWithShadows) {
		console.info("Enabling shadows on renderer");
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = false;
		renderer.shadowMapType = THREE.PCFSoftShadowMap;
		renderer.shadowMapCullFace = THREE.CullFaceFront;
		//renderer.shadowMapAutoUpdate = true;
	}
	
	renderer.autoClear = false;
	renderer.setClearColor(0x000000);
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.physicallyBasedShading = true;
	
	context.renderer = renderer;
	renderer.context.canvas.addEventListener("webglcontextlost", function(event) {
		event.preventDefault();
		console.error("WebGL Context has been lost!");
		if (context.animationID) {
			//cancelAnimationFrame(context.animationID); 
		}
		
		if (sceneCallbacks.contextLostCallback) {
			sceneCallbacks.contextLostCallback(event);
		}
		
	}, false);

	renderer.context.canvas.addEventListener("webglcontextrestored", function(event) {
		animate();
	}, false);

	
	context.container.appendChild( renderer.domElement );
	
	if (config.enableFps) {
		var stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.bottom = '0px';
		stats.domElement.style.right = '0px';
		context.container.appendChild( stats.domElement );
		context.stats = stats;
	}
	
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'click', onDocumentMouseClick, false );
	document.addEventListener( 'dblclick', onDocumentMouseDoubleClick, false );
	window.addEventListener( 'resize', onWindowResize, false );

	
	
	context.controls = new KMG.ExamineControls( renderer.getContext(), [context.primaryCamera, context.secondaryCamera], context.container, function(controls) {
		if (sceneCallbacks.onViewChanged) {
			sceneCallbacks.onViewChanged(scope, controls);
		}
	});
	context.controls.rotate(30 * (Math.PI / 180), 0);
	context.controls.setMinDistance(0.013);
	context.controls.setMaxDistance(500000000000000000);
	context.controls.setDistance(2 * KMG.AU_TO_KM * config.kmScalar);
	context.controls.setMaxScale(9999999999999999);
	context.controls.setMinScale(0.001 );
	context.controls.zoomType = KMG.Scale;
	
	if (config.view) {
		context.controls.fromConfig(config.view);
	}
	context.controls.update(true);
	
	context.controls.addEventListener( 'change', render );
	
	/*
	context.controls = new THREE.OrbitControls(context.primaryCamera, context.container);
	context.controls.scale = 1.0;
	*/
	
	primaryCameraPosition = context.primaryCamera.position;
	secondaryCameraPosition = context.secondaryCamera.position;
	
	

	//context.controls = {};
	//context.controls.scale = 1.0;



	
	context.primaryScene = new THREE.Scene();
	context.secondaryScene = new THREE.Scene();
		
	context.lights.primaryPoint = new THREE.PointLight( 0xFFFFFF, 1.0);
	context.lights.primaryPoint.position.set( 0, 0, 0 );
	context.primaryScene.add(context.lights.primaryPoint);
	
	context.lights.ambient = new THREE.AmbientLight( 0x111111 );
	context.primaryScene.add( context.lights.ambient );
	
	/*
	context.lights.primaryDirectional = new THREE.DirectionalLight( 0xFFFFFF, 2.0, 100);
	context.lights.primaryDirectional.position.set( 1, 0, 1 ).normalize();
	context.lights.primaryDirectional.castShadow = true;
	context.lights.primaryDirectional.shadowCameraVisible = true;
	context.lights.primaryDirectional.shadowMapWidth = 2048;
	context.lights.primaryDirectional.shadowMapHeight = 2048;
	context.lights.primaryDirectional.shadowDarkness = 1.0;
	context.lights.primaryDirectional.shadowCameraNear = 1700;//7500;
	context.lights.primaryDirectional.shadowCameraFar = 1400;//7900;
	context.lights.primaryDirectional.shadowCameraFov = 0.003;
	context.lights.primaryDirectional.shadowBias = 0.0001;
	context.lights.primaryDirectional.shadowCameraRight     =  20;
	context.lights.primaryDirectional.shadowCameraLeft     = -20;
	context.lights.primaryDirectional.shadowCameraTop      =  20;
	context.lights.primaryDirectional.shadowCameraBottom   = -20;
	context.lights.primaryDirectional.onlyShadow = true;
	context.primaryScene.add(context.lights.primaryDirectional);
	
	

	context.lights.spotLight = new THREE.SpotLight( 0xffffff, 1.0, 11000, 0);
	context.lights.spotLight.position.set( 100, 1000, 100 );
	context.lights.spotLight.castShadow = true;
	context.lights.spotLight.shadowCameraVisible = true;
	context.lights.spotLight.distance = 11000;
	context.lights.spotLight.shadowMapWidth = 2048;
	context.lights.spotLight.shadowMapHeight = 2048;
	context.lights.spotLight.shadowCameraFov = 0.2;
	context.lights.spotLight.shadowBias = 0.0001;
	context.lights.spotLight.shadowCameraRight     =  20;
	context.lights.spotLight.shadowCameraLeft     = -20;
	context.lights.spotLight.shadowCameraTop      =  20;
	context.lights.spotLight.shadowCameraBottom   = -20;
	context.lights.spotLight.onlyShadow = true;
	//context.primaryScene.add(context.lights.spotLight);
	*/
	
	context.lights.secondaryPoint = context.lights.primaryPoint.clone();
	context.secondaryScene.add(context.lights.secondaryPoint);
	/*
	var fps = 30;
	var tickInterval = (1 / fps) / 24;
	var tickController = new KMG.IntervalTimeBasedTickController(1, tickInterval, function(tickJulian, tickDate) {
		update();
	});
	*/

	var tickController = new KMG.TimeBasedTickController(1 + (1000000 * 0.1), function(tickJulian, tickDate) {
		update();
	});
	
	context.tickController = tickController;

	var stars = new KMG.CatalogStarsObject(context, {alphaMultiplier : 9.5, namesVisible : true}, function(instance) {
		if (sceneCallbacks.onStarsLoaded) {
			sceneCallbacks.onStarsLoaded(scope, instance);
		}
	});
	stars.scale.set(1 / config.kmScalar, 1 / config.kmScalar, 1 / config.kmScalar);
	addObjectToSecondaryScene(stars);
	
	var constellations = new KMG.ConstellationLines(context, {}, function(instance) {
		if (sceneCallbacks.onConstellationsLoaded) {
			sceneCallbacks.onConstellationsLoaded(scope, instance);
		}
	});
	constellations.scale.set(1 / config.kmScalar, 1 / config.kmScalar, 1 / config.kmScalar);
	addObjectToSecondaryScene(constellations);
	
	
	var topoCentricIndicatorConfig = {
		opacity : 1.0,
		color : 0xFFFFFF,
		radius : 100 * config.kmScalar,
		ambient : 0xFFFFFF,
		emissive : 0xFFFFFF,
		texture : 'Sun'
	};
	var topoCentricPositionIndicator= new KMG.TexturedSphereObject(context, topoCentricIndicatorConfig);
	addObjectToPrimaryScene(topoCentricPositionIndicator);
	
	
	var eclipticLine = new KMG.CoordinateGrid(context, {}); 
	addObjectToSecondaryScene(eclipticLine);
	
	var equatorialLine = new KMG.CoordinateGrid(context, {color: 0x33CC66});
	addObjectToSecondaryScene(equatorialLine);
	
	var azimuthalLine = new KMG.CoordinateGrid(context, {color: 0xCC9999});
	azimuthalLine.secondaryContainer.rotation.x = KMG.RAD_90;
	addObjectToSecondaryScene(azimuthalLine);
	
	$.ajax({
		url: "/api/majorbodies/list/",
		dataType: "json",
		error: function( jqXHR, textStatus, errorThrown ) {
			console.warn("Error: " + errorThrown);
		
		},
		success: function(data, textStatus, jqxhr) {
			
		}
	}).done(function(data) {

		var colorIndex = 0;
		for (var i = 0; i < data.length; i++) {
			var def = data[i];
			
			
			var color = 0x304FFF;
			if (KMG.OrbitColors.length > colorIndex && def.type == "planet") {
				color = KMG.OrbitColors[colorIndex];
				colorIndex++;
			}
			
			var p = new KMG.SolarSystemPlanet(context, {kmScalar : config.kmScalar, orbitColor : color}, def, tickController);
			addObjectToPrimaryScene(p);
			
		}
		
		update();
		
		if (sceneCallbacks.onPlanetsLoaded) {
			sceneCallbacks.onPlanetsLoaded(scope);
		}
	});
	
	// Loadable objects
	$.ajax({
		url: "/api/tracked/list/?max=-1",
		dataType: "json",
		error: function( jqXHR, textStatus, errorThrown ) {
			console.warn("Error: " + errorThrown);
		
		},
		success: function(data, textStatus, jqxhr) {
			
		}
	}).done(function(data) {
		
		loadableObjects = [];
		
		for (var i = 0; i < data.length; i++) {
			
			loadableObjects.push(data[i]);
			
		}

		update();
		
		if (sceneCallbacks.onLoadableObjectsListLoaded) {
			sceneCallbacks.onLoadableObjectsListLoaded(loadableObjects);
		}
	});
	

	update();
	animate();
	

	var scope = {
		context : context,
		start : start,
		stop : stop,
		update : update,
		isActive : isActive,
		setToDateMillis : setToDateMillis,
		load : load,
		loadTleBased : loadTleBased,
		unload : unload,
		setLookingAt : setLookingAt,
		setLookingFrom : setLookingFrom,
		getObjects : getObjects,
		getObjectNames : getObjectNames,
		setAnimationSpeed : setAnimationSpeed,
		setOrbitLinesVisibility : setOrbitLinesVisibility,
		setFieldOfView : setFieldOfView,
		getPlanet : getPlanet,
		setTimeWarp : setTimeWarp,
		setSavingFrames : setSavingFrames,
		setStarNameVisibility : setStarNameVisibility,
		setViewFromType : setViewFromType,
		setTopocentricLatitude : setTopocentricLatitude,
		setTopocentricLongitude : setTopocentricLongitude,
		setTopocentricIndicatorVisible : setTopocentricIndicatorVisible,
		setEclipticVisibility : setEclipticVisibility,
		setEquatorialVisibility : setEquatorialVisibility,
		setAzimuthalVisibility : setAzimuthalVisibility,
		setOrientUpToEcliptic : setOrientUpToEcliptic,
		setConstellationVisibility : setConstellationVisibility,
		setStarsVisibility : setStarsVisibility,
		saveAttachment : saveAttachment
	};
	return scope;
};

/* File: SolarSystemObject.js */



KMG.VectorLinesObject = function ( context, config, data, centerObjectVectors) {
	
	KMG.BaseObject.call( this );
	var scalar = KMG.AU_TO_KM * config.kmScalar;
	var vectorPathLineConfig = {
		scale : scalar
	};
	var fullLine = new KMG.VectorPathLine(context, vectorPathLineConfig, centerObjectVectors, data);
	var fadingLine = new KMG.FadingVectorPathLine(context, vectorPathLineConfig, centerObjectVectors, data);
	

	this.add(fullLine);
	this.add(fadingLine);
	

	this.setVisibility = function(visible) {
		fullLine.setVisibility(visible);
		fadingLine.setVisibility(visible);
	};
	
	this.setUsingFadingLine = function(useFading) {
		
		if (useFading) {
			this.remove(fullLine);
			this.add(fadingLine);
		} else {
			this.add(fullLine);
			this.remove(fadingLine);
		}
	};
	this.setUsingFadingLine(config.useFadingVectorPath);

	this.setLineColor = function(color) {
		fullLine.setLineColor(color);
		fadingLine.setLineColor(color);
	};

		
	this.update = function() {
		fullLine.update();
		fadingLine.update();
	};

};
KMG.VectorLinesObject.prototype = Object.create( KMG.BaseObject.prototype );
	



KMG.DefaultOrbitingObjectConfig = {
	kmScalar : 0.000005,
	rideAlong : false,
	leaveTrail : false,
	orbitsVisible : true,
	dateMarkersVisible : true,
	focusPoint : new THREE.Vector3(0, 0, 0),
	suppressFuture : false,
	suppressDatesOfInterest : false,
	useFadingVectorPath : false,
	suppressSpacecraftModels : false,
	elementsOrbitColor : 0xFF0000
};

KMG.OrbitingObject = function ( context, config, ephemeris, tickController, centerObjectVectors, centerObjectElements, lookingTowards ) {
	
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultOrbitingObjectConfig);
	var scope = this;

	var projector = new THREE.Projector();

	var orbitals = [];
	
	var scalar = KMG.AU_TO_KM * config.kmScalar;
	
	this.centerObjectVectors = centerObjectVectors;
	this.centerObjectElements = centerObjectElements;
	
	
	this.useVectorData = ephemeris.vectors.data.length > 0;
	
	this.applyParentObliquity = (ephemeris["applyParentObliquity"] === true);
	
	var orbit = new KMG.EllipticalOrbit(ephemeris.elements.data);
	
	var isFocus = false;
	var orbitVisibility = KMG.OrbitDisplay.MajorPlanets | KMG.OrbitDisplay.Focus;
	
	this.setIsFocus = function(focus) {
		isFocus = focus;
	};
	
	
	this.getPosition = function() {
		return objectDot.position.clone();
	};
	
	this.getPlanetVector = function() {
		var pos = this.getPosition();
		pos.applyEuler(this.rotation);
		
		if (centerObjectElements) {
			pos.add(centerObjectElements.getPlanetVector());
		}
		
		return pos;
	};
	
	this.isAtScreenPosition = function(x, y, sceneOffset, radius, scale) {
		if (!radius) {
			radius = 0.033;
		}
		
		var projector = new THREE.Projector();
		var vector = new THREE.Vector3( x, y, 1 );
		
		var pos = this.getPlanetVector();
		pos.add(sceneOffset.clone().negate());
		pos.multiplyScalar(scale);
		projector.projectVector( pos, context.camera );
		
		pos.z = 0;
		vector.z = 0;
		
		return (vector.distanceTo(pos) <= radius);
	}
	
	
	this.onMousePosition = function(x, y, clientX, clientY) {
		

	};
	
	this.setFutureOrbitVisibility = function(visible) {
		orbiter.displayFuture = visible;
		if (orbitPathLine && visible) {
			this.add(orbitPathLine);
		} else if (orbitPathLine && !visible) {
			this.remove(orbitPathLine);
		}
	};
	
	this.updatePosition = function() {
		orbiter.update();
	};
	
	this.update = function() {
		
		if (model) {
			model.update();
		}
		
		if (vectorPathLine) {
			vectorPathLine.update();
			vectorPathLine.setVisibility(this.config.orbitsVisible);
			vectorPathLine.setLineColor(isFocus ? 0xFF0000 : 0x999999);
		}

		if (orbitPathLine) {
			orbitPathLine.update();
			orbitPathLine.setVisibility(this.config.orbitsVisible);
			if (isFocus) {
				orbitPathLine.lineMaterial.color = new THREE.Color(0xFF0000);
			} else {
				orbitPathLine.lineMaterial.color = new THREE.Color(0x999999);
			}
		}
		
	
		
		if (tickController.isActive() && config.leaveTrail) {
			 var dot = new KMG.DotPlotObject(context, {});
			 dot.position = model.position.clone();
			 this.add(dot);
		
		}
		
		

	};
	
	
	function getLabelPosition(vec, lbl)
	{
		projector.projectVector( vec, context.camera );

		var x =  (vec.x + 1) / 2 * window.innerWidth - (lbl.width() / 2);
		var y = (-vec.y + 1) / 2 * window.innerHeight;
		
		return {
			x : parseInt(Math.round(x)),
			y : parseInt(Math.round(y)),
			z : vec.z
		};
	}
	

	
	this.setUsingFadingLine = function(useFading) {
		if (vectorPathLine) {
			vectorPathLine.setUsingFadingLine(useFading);
		}
	};
	
	
	// In AU
	this.getDistanceTo = function(other) {
		return model.position.distanceTo(other) / scalar;
	};
	
	this.getVelocityOnTick = function() {
		var t = tickController.tickJulian;
		var velocity = 0;
		
		if (isDateInVectorRange(t)) {
			var v = getInterpolatedVelocityVectorForDate(t);
			v.multiplyScalar(KMG.AU_TO_KM * 1000);
			v.multiplyScalar(1.0 / 86400.0);
			velocity = Math.sqrt(KMG.Math.sqr(v.x) + KMG.Math.sqr(v.y) + KMG.Math.sqr(v.z));
		} else {
			var v = orbit.velocityAtTime(t);
			v.multiplyScalar(KMG.AU_TO_KM * 1000);
			velocity = Math.sqrt(KMG.Math.sqr(v.x) + KMG.Math.sqr(v.y) + KMG.Math.sqr(v.z));
		}
		
		
		return velocity;
	};
	
	
	
	function isDateInVectorRange(t) {
		return (scope.useVectorData && (t <= vectorsEndDate || (!ephemeris.displayFuture && t >= vectorsEndDate)));
	}
	
	function getDateFraction(t) {
		if (!isDateInVectorRange(t)) {
			return -1;
		}
		
		var f = (t - vectorsStartDate) / (vectorsEndDate - vectorsStartDate);
		return f;
	}
	
	function getVectorIndexForDateFraction(f) {
		var i = f * ephemeris.vectors.data.length;
		return i;
	}
	
	
	function getVectorsForDate(t) {

		if (!isDateInVectorRange(t)) {
			return -1;
		}

		// if the request date is before the vectors, then we assume it to be before the launch.
		// This should only apply to artificial spacecraft
		if (t < vectorsStartDate) {
			return {
				f : 0,
				lower : ephemeris.vectors.data[0],
				upper : ephemeris.vectors.data[0]
			};
		} else if (!ephemeris.displayFuture && t >= vectorsEndDate) {
			return {
				f : 0,
				lower : ephemeris.vectors.data[ephemeris.vectors.data.length - 1],
				upper : ephemeris.vectors.data[ephemeris.vectors.data.length - 1]
			};
		} else {
		
			var f = getDateFraction(t);
			var i = getVectorIndexForDateFraction(f);
			
			var lower = parseInt(i);
			var upper = parseInt(Math.round(i+0.5));
			
			if (upper >= ephemeris.vectors.data.length) {
				upper = lower;
			}

			return {
				f : i - Math.floor(i),
				lower : ephemeris.vectors.data[lower],
				upper : ephemeris.vectors.data[upper]
			};
		}
		
	}
	
	function getInterpolatedVectorForDate(t) {
		if (!isDateInVectorRange(t)) {
			return -1;
		}
		
		var vectors = getVectorsForDate(t);
		if (vectors == -1) {
			return -1;
		}
		

		var x = (vectors.upper.x * vectors.f) + (vectors.lower.x * (1-vectors.f));
		var y = (vectors.upper.y * vectors.f) + (vectors.lower.y * (1-vectors.f));
		var z = (vectors.upper.z * vectors.f) + (vectors.lower.z * (1-vectors.f));

		return new THREE.Vector3(x, z, -y);
	}
	
	function getPositionVectorForDate(t) {
		var vector;
		
		
		if (isDateInVectorRange(t)) {
			vector = getInterpolatedVectorForDate(t);
		} else {
			vector = orbit.positionAtTime(t);
		}
		return vector;
	}
	
	function getInterpolatedVelocityVectorForDate(t) {
		if (!isDateInVectorRange(t)) {
			return -1;
		}
		
		var vectors = getVectorsForDate(t);
		if (vectors == -1) {
			return -1;
		}
		
		var x = (vectors.upper.vx * vectors.f) + (vectors.lower.vx * (1-vectors.f));
		var y = (vectors.upper.vy * vectors.f) + (vectors.lower.vy * (1-vectors.f));
		var z = (vectors.upper.vz * vectors.f) + (vectors.lower.vz * (1-vectors.f));
		
		return new THREE.Vector3(x, y, x);
	}
	

	var vectorPathLine;
	if (this.useVectorData) {
		// Vector data exists, create a line for it
		vectorPathLine = new KMG.VectorLinesObject( context, config, ephemeris.vectors.data, centerObjectVectors);
		this.add(vectorPathLine);		
	} else {
		var orbitConfig = {};//KMG.Util.clone(ephemeris.elements.data);
		orbitConfig.scale = scalar;
		orbitConfig.segments = 16000;
		orbitConfig.opacity = 0.8;
		orbitConfig.color = 0xFFFFFF;
		orbitConfig.closeOrbit = false;
		orbitConfig.lineThickness = 1.5;
		orbitConfig.orbit = orbit;
		vectorPathLine = new KMG.OrbitPathLine(context, orbitConfig, orbit, centerObjectElements, ephemeris.start, ephemeris.stop);
		vectorPathLine.setUsingFadingLine = function() { };
		vectorPathLine.setLineColor = function(color) {
			vectorPathLine.lineMaterial.color = new THREE.Color(color);
		};
		this.add(vectorPathLine);
		
	}
	
	
	

	var model;
	if (ephemeris.type == "spacecraft") {
		
		if (!config.suppressSpacecraftModels) {
			var modelName = (ephemeris.model) ? ephemeris.model.file : "generic";
			var modelScale = (ephemeris.model) ? ephemeris.model.scale : 1.0;
			
			var onLoad = function ( object ) {
				object.scale.set(40, 40, 40);

				object.traverse(function(obj) {
					obj.scale.set(modelScale, modelScale, modelScale);
					if (obj.material) {
						obj.material.fog = false;
						obj.material.shading = THREE.SmoothShading;
					}
				});
				scope.add(object);
				orbitals.push(object);
				object.update = function() { };
				model = object;
			};
			
			
			if (KMG.Util.isUserMobile()) {
				var loader = new THREE.OBJLoader();
				loader.load( 'obj/' + modelName + '/' + modelName + '.obj',  onLoad);
			} else {
				var loader = new THREE.OBJMTLLoader();
				loader.load( 'obj/' + modelName + '/' + modelName + '.obj', 'obj/' + modelName + '/' + modelName + '.mtl', onLoad);
			}
		}
	} else if (ephemeris.type == "satellite") {
		var dotConfig = {
			opacity : 1.0,
			color : 0xFF0000,
			size : 15,
			texture : '/img/sprites/satellite_100x100.png'
		};
		model = new KMG.DotPlotObject(context, dotConfig);
		this.add(model);
		orbitals.push(model);
	} else if (ephemeris.type == "comet") {
		
		model = new KMG.CometObject(context, {lookingTowards : centerObjectElements});
		this.add(model);
		orbitals.push(model);
		
	} else {
		var config = {radius:.0005, fog:false, scale:scalar, texture:"asteroid", color:0xFFFFFF};
		model = new KMG.TexturedSphereObject(context, config);
		this.add(model);
		orbitals.push(model);
	}
	
	
	var dotConfig = {
		opacity : 1.0,
		color : 0xFFFFFF,
		texture : '/img/sprites/circle_50x50.png'
	};
	var objectDot = new KMG.DotPlotObject(context, dotConfig);
	
	if (!model) {
		model = objectDot;
	}
	this.add(objectDot);
	orbitals.push(objectDot);

	var orbitPathLine;
	if (ephemeris.displayFuture) {
		var orbitConfig = {};
		orbitConfig.scale = scalar;
		orbitConfig.segments = 8192;
		orbitConfig.opacity = 0.8;
		orbitConfig.color = config.elementsOrbitColor;
		orbitConfig.lineThickness = 1.5;
		orbitConfig.closeOrbit = false;
		orbitPathLine = new KMG.OrbitPathLine(context, orbitConfig, orbit, centerObjectElements, ephemeris.start, ephemeris.stop);
		this.add(orbitPathLine);

	}

	var label = new KMG.BillBoardTextObject(context,ephemeris.name, {});
	this.add(label);
	orbitals.push(label);
	
	
	
	
	var orbiter = new KMG.EllipticalOrbiter(context, orbitals, scalar, 0, orbit, centerObjectElements, tickController, false, true);
	if (this.useVectorData) {
		orbiter = new KMG.EphemerisOrbiter(context, orbitals, scalar, 0, orbiter, ephemeris.vectors, ephemeris.displayFuture, centerObjectVectors, centerObjectElements, tickController, false, true);
	}
	
	var vectorsStartDate, vectorsEndDate;
	if (this.useVectorData) {
		vectorsStartDate = ephemeris.vectors.data[0].epoch;
		vectorsEndDate = ephemeris.vectors.data[ephemeris.vectors.data.length - 1].epoch;
	}
	

	
};
KMG.OrbitingObject.prototype = Object.create( KMG.BaseObject.prototype );
	
	

/* File: SolarSystemPlanet.js */

var tex = {
	name : "",
	texture : "",
	bumpMap : "",
	normalMap : "",
	specularMap : "",
	enabled : true
};

KMG.textures.push(KMG.Util.extend({ name : "asteroid", texture : "/img/planets_small/asteroid.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "sun", texture : "/img/planets_small/sun.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "mercury", texture : "/img/planets_small/mercury.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "venus", texture : "/img/planets_small/venus.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "earth", texture : "/img/planets_small/earth-true.jpg", specularMap : "/img/earth_specularmap_flat_1024x512.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "moon", texture : "/img/planets_small/moon.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "mars", texture : "/img/tx_composite.adjusted.1024x512.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "phobos", texture : "/img/planets_small/phobos.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "deimos", texture : "/img/planets_small/deimos.jpg"}, tex));

KMG.textures.push(KMG.Util.extend({ name : "asteroid", texture : "/img/planets_small/asteroid.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "jupiter", texture : "/img/planets_small/jupiter.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "callisto", texture : "/img/planets_small/callisto.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "io", texture : "/img/planets_small/io.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "ganymede", texture : "/img/planets_small/ganymede.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "europa", texture : "/img/planets_small/europa.jpg"}, tex));

KMG.textures.push(KMG.Util.extend({ name : "saturn", texture : "/img/planets_small/saturn.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "titan", texture : "/img/planets_small/titan.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "mimas", texture : "/img/planets_small/mimas.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "enceladus", texture : "/img/planets_small/enceladus.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "tethys", texture : "/img/planets_small/tethys.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "rhea", texture : "/img/planets_small/rhea.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "hyperion", texture : "/img/planets_small/hyperion.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "iapetus", texture : "/img/planets_small/iapetus.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "phoebe", texture : "/img/planets_small/phoebe.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "janus", texture : "/img/planets_small/janus.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "epimetheus", texture : "/img/planets_small/epimetheus.jpg"}, tex));


KMG.textures.push(KMG.Util.extend({ name : "uranus", texture : "/img/planets_small/uranus.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "ariel", texture : "/img/planets_small/ariel.jpg"}, tex));

KMG.textures.push(KMG.Util.extend({ name : "neptune", texture : "/img/planets_small/neptune.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "triton", texture : "/img/planets_small/triton.jpg"}, tex));

KMG.textures.push(KMG.Util.extend({ name : "pluto", texture : "/img/planets_small/pluto.jpg"}, tex));
KMG.textures.push(KMG.Util.extend({ name : "charon", texture : "/img/planets_small/charon.jpg"}, tex));


KMG.DefaultSolarSystemPlanetConfig = {
	kmScalar : 0.000005,
	orbitColor : 0x304FFF
};



KMG.SolarSystemPlanet = function(context, config, def, tickController, parent, level) {
	KMG.BaseObject.call( this );
	this.config = config = KMG.Util.extend(config, KMG.DefaultSolarSystemPlanetConfig)
	
	
	// Make sure undefined or null become 0
	if (!level) {
		level = 0;
	}
	
	this.level = level;
	this.name = def.name;
	
	var displayLabels = (def.type == "planet");
	var isFocus = false;
	var orbitVisibility = KMG.OrbitDisplay.MajorPlanets | KMG.OrbitDisplay.Focus;

	var orbit;
	if (def.customOrbit) {
		// TODO: Safety check on the value of def.customOrbit
		orbit = new KMG[def.customOrbit]();
	} else if (def.elements) {
		orbit = new KMG.EllipticalOrbit(def.elements);
	}
	
	var rotation;
	if (def.customRotation) {
		rotation = new KMG[def.customRotation]();
	}
	this.rotational = rotation;
	
	
	
	var orbitPathLine;
	
	if (orbit && orbit.period > 0) {
		var scalar = KMG.AU_TO_KM * config.kmScalar;
		var pathConfig = {
			scale : scalar,
			segments : 365,
			subdivisions : 8,
			opacity : ((def.type == "planet") ? 0.6 : 0.3),
			color : config.orbitColor,
			lineThickness : 1.5
		};
		
		
		var orbitPathLine = new KMG.OrbitPathLine(context, pathConfig, orbit, parent);
		this.add(orbitPathLine);
	}
	
	// A pretty generic basis of dot luminosity based on the size of Ganymede, with a lower bound at 10%
	var dotOpacity = 1.0;
	if (def.type == "moon") {
		dotOpacity = def.radius / 2634;
		dotOpacity = (dotOpacity > 1) ? 1 : dotOpacity;
		dotOpacity = (dotOpacity < 0.15) ? 0.10 : dotOpacity;
	}
	var dotConfig = {
		opacity : dotOpacity,
		color : 0xFFFFFF,
		size : 2.0,
		texture : '/img/sprites/circle_50x50.png'
	};
	
	var planetDot = new KMG.DotPlotObject(context, dotConfig);
	this.add(planetDot);

	function findTexture(name) {
		var name = name.toLowerCase();
		for (var i = 0; i < KMG.textures.length; i++) {
			if (KMG.textures[i].name == name) {
				return name;
			}
		}
		return "asteroid";
	}
	
	
	
	
	var sphereConfig = {
						radius:def.radius * config.kmScalar,
						flattening : def.flattening,
						fog:false,
						scale:config.kmScalar,
						texture:findTexture(def.name),
						color:0xFFFFFF,
						specular : 0xAAAAAA,
						material : (def.name == "Earth" ? KMG.MaterialPhong : KMG.MaterialLambert),
						slices : (def.type == "planet" || def.name == "Moon"  ? 128 : 32),
						shadows : true
						};
						
	if (def.lightEmitting) {
		sphereConfig.ambient = 0xFFFFFF;
		sphereConfig.emissive = 0xFFFFFF;
		sphereConfig.shading = false;
	}
						
	var planet = new KMG.TexturedSphereObject(context, sphereConfig);
	this.add(planet);
	
	
	
	
	
	var text = new KMG.BillBoardTextObject(context, def.name, {}) 
	this.add(text);
	
	var orbitals = [planetDot, planet, text];
	
	var clouds;

	var ringTexture;
	switch (def.name) {
	case "Uranus":
		ringTexture = "Uranus";
		break;
	case "Neptune":
		ringTexture = "Neptune";
		break;
	case "Saturn":
	default:
		ringTexture = "Saturn";
		break;

	};
		
	var ring;
	if (def.ring && ringTexture) {
		ring = new KMG.RingObject(context, {
			ringInnerRadius : def.ring.innerRadius * config.kmScalar,
			ringOutterRadius : def.ring.outterRadius * config.kmScalar,
			targetObject : planetDot,
			displayRing : true,
			ringTexture : ringTexture
		});
		
		//if (def.ring.rotation) {
		//	ring.mesh.rotation.set(def.ring.rotation[0], def.ring.rotation[1], def.ring.rotation[2]);
		//}
		
		this.add(ring);
		orbitals.push(ring);
	}
	
	var orbiter;
	if (orbit) {
		orbiter = new KMG.EllipticalOrbiter(context, orbitals, scalar, 1, orbit, parent, tickController, false, true);
	}

	context.planets[def.name] = this;
	
	var moons = [];
	
	
	this.addChild = function(child) {
		this.add(child);
		orbitals.push(child);
		moons.push(child);
	};
	
	this.removeChild = function(child) {
		this.remove(child);
		
		/*
		var _orbitals = [];
		for (var i = 0; i < orbitals.length; i++) {
			if (orbitals[i] != child && _orbitals.push(orbitals[i]));
		}
		orbitals = _orbitals;
		
		var _moons = [];
		for (var i = 0; i < moons.length; i++) {
			if (moons[i] != child && _moons.push(moons[i]));
		}
		moons = _moons;
		*/
	};
	
	if (def.moons) {
		for (var i = 0; i < def.moons.length; i++) {
			var moon = def.moons[i];
			var p = new KMG.SolarSystemPlanet(context, config, moon, tickController, this, level+1);
			p.applyParentObliquity = true;
			this.addChild(p);
		}
	}
	
	this.getPlanetTopocentricVector = function(latitude, longitude, jd) {
		
		var ellipsoidRadius = KMG.Math.radiusAtGeocentricLatitude(def.radius * config.kmScalar, latitude * KMG.PI_BY_180, def.flattening);
		
		var position = KMG.Math.getPoint3D(longitude, // Longitude, in degrees
											latitude, // Latitude, in degrees
											ellipsoidRadius);

		if (rotation) {
			var rotationalQ = rotation.computeRotationalQuaternion(jd);
			
			//position.rotateY(rotationalQ.meridian * KMG.PI_BY_180 + KMG.RAD_90);
			
			//var e = new THREE.Euler(0, rotationalQ.meridian * KMG.PI_BY_180 - KMG.RAD_90, 0);
			//position.applyEuler(e);
			
			position.applyQuaternion(rotationalQ);
		}
		
		var vector = this.getPlanetVector();
		return vector.add(position);
	};
	
	this.getPlanetVector = function() {
		
		var pos = planetDot.position.clone();
		if (parent) {
			if (parent.rotational) {
				var rotationalQ = parent.rotational.computeRotationalQuaternion(context.tickController.tickJulian);
				pos.applyQuaternion(rotationalQ.noMeridian);
				
			}
			pos.add(parent.getPlanetVector());
		}
		
		return pos;
	};
	
	this.getRootPosition = function() {
		return  planetDot.position.clone();
	};
	
	this.setOrbitLinesVisibility = function(visible, traverse) {
		
		orbitVisibility = visible;

		if (traverse) {
			for (var i = 0; i < moons.length; i++) {
				moons[i].setOrbitLinesVisibility(visible, traverse);
			}
		}
		
	};
	
	this.setLabelVisibility = function(visible) {
		displayLabels = visible;
	};
	
	this.setIsFocus = function(focus) {
		isFocus = focus;
	};
	

	this.isAtScreenPosition = function(x, y, sceneOffset, radius, scale) {
		if (!radius) {
			radius = 0.033;
		}
		
		var projector = new THREE.Projector();
		var vector = new THREE.Vector3( x, y, 1 );
		
		var pos = this.getPlanetVector();
		pos.add(sceneOffset.clone().negate());
		pos.multiplyScalar(scale);
		projector.projectVector( pos, context.camera );
		
		pos.z = 0;
		vector.z = 0;
		
		return (vector.distanceTo(pos) <= radius);
	}
	
	this.onMousePosition = function(x, y, clientX, clientY, sceneOffset, scale) {
		

		var mouseOverRadius = 0.033;
		var projector = new THREE.Projector();
		var vector = new THREE.Vector3( x, y, 1 );
		
		var pos = this.getPlanetVector();
		if (sceneOffset) {
			pos.add(sceneOffset.clone().negate());
		}
		
		pos.multiplyScalar(scale);
		projector.projectVector( pos, context.camera );
		
		pos.z = 0;
		vector.z = 0;

		
		if (vector.distanceTo(pos) <= mouseOverRadius) {
			text.setVisibility(true);
		} else {
			text.setVisibility(false || displayLabels || isFocus);
			
			for (var i = 0; i < moons.length; i++) {
				moons[i].onMousePosition(x, y, clientX, clientY, sceneOffset.clone(), scale);
			}
		}
		
		
		
		
	};
	
	

	function isOrbitLineVisible() {
		
		var types = KMG.activeOrbitDisplays(orbitVisibility);
		 
		for (var i = 0; i < types.length; i++) {
			
			if (types[i] == KMG.OrbitDisplay.All)
				return true;
			if (types[i] == KMG.OrbitDisplay.MajorPlanets && def.type == "planet")
				return true;
			if (types[i] == KMG.OrbitDisplay.MinorPlanets && def.type == "minorplanet")
				return true;
			if (types[i] == KMG.OrbitDisplay.Moons && def.type == "moon") 
				return true;
			if (types[i] == KMG.OrbitDisplay.Focus && isFocus) 
				return true;
			
		}
		
		return false;
	}
	
	
	function applyRotation(object, rotationalQ) {
		if (!object) {
			return;
		}
		
		if (object.sphereMesh) {
			object.sphereMesh.rotation.y = rotationalQ.meridian * KMG.PI_BY_180 + KMG.RAD_90;
		}
		object.rotation.setFromQuaternion(rotationalQ.noMeridian);
		object.updateMatrix();
	}
	
	this.updatePosition = function() {
		if (orbiter) {
			orbiter.update();
			
			if (def.name == "Earth") {
				var p = planet.position.clone().normalize();
			//	console.info(context.tickController.tickJulian + " " + (p.angleTo(new THREE.Vector3(0, 0, 1)) * 180 / Math.PI) + " " + planet.position.length());
				
			}
			
		}
	};
	
	this.applyObliquityToObject = function(object, rotationalQ) {
		
		if (!rotationalQ && !rotation) {
			return;
		} else if (!rotationalQ && rotation) {
			rotationalQ = rotation.computeRotationalQuaternion(context.tickController.tickJulian);
		}
		
		applyRotation(object, rotationalQ);
		
	};
	
	this.update = function() {
		
		if (planet) {
			planet.update();
		}
		
		
		if (rotation) {

			var rotationalQ = rotation.computeRotationalQuaternion(context.tickController.tickJulian);
			applyRotation(planet, rotationalQ);
			applyRotation(ring, rotationalQ);
			applyRotation(clouds, rotationalQ);

			//orbitals
			for (var i = 0; i < orbitals.length; i++) {
				if (orbitals[i].applyParentObliquity) {
					applyRotation(orbitals[i], rotationalQ);
				}
			}
		}
		
		
		
		if (planetDot) {
			planetDot.update();
		}

		text.setVisibility(displayLabels || isFocus);
		
		if (orbitPathLine) {
			orbitPathLine.setVisibility(isOrbitLineVisible());
			if (isFocus) {
				orbitPathLine.lineMaterial.color = new THREE.Color(0xFF0000);
			} else {
				orbitPathLine.lineMaterial.color = new THREE.Color(config.orbitColor);
			}
		}

		
		for (var i = 0; i < moons.length; i++) {
			moons[i].update();
		}
		
		
	};
};
KMG.SolarSystemPlanet.prototype = Object.create( KMG.BaseObject.prototype );
