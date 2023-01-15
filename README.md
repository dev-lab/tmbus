# tmbus - M-Bus library for JavaScript

## Description
[M-Bus](https://m-bus.com/) is a standard for remote reading of consumption meters (e.g. water, heat, electricity meters, etc.). As of today, the standard is maintained by [OMS-Group](https://oms-group.org/en/), and evolved to support other device types, including sensors, detectors, controllers, etc.

A data frame sent over M-Bus from one device to another is called a **datagram** (it is also referred as a **telegram** in M-Bus protocol specification). The main purpose of the **tmbus** JavaScript (ES5) library is to decode M-Bus datagrams from M-Bus meters. The library is created primarily for [embedded device](https://github.com/dev-lab/esp-iot-mbus)s with limited storage, but despite its compactness, it is capable of decoding all data from consumption meters.

## Features
* Can parse M-Bus datagrams according to [M-Bus rev. 4.8 specification](https://m-bus.com/assets/downloads/MBDOC48.PDF).
* Supported additional device types from [OMS Specification Issue 4.5.1 / 2022-12](https://oms-group.org/en/open-metering-system/oms-specification#c2304) ([OMS Specification Issue 4.5.1 / 2022-12 Archive](https://oms-group.org/fileadmin/files/download4all/omsSpezifikationen/generation4/spezifikation/Release-Archiev/Release_2022-12.zip)).
* Helper functions available for M-Bus datagram creation and for unit conversions.
* The test page to evaluate the capabilities of the library is available here: [Live M-Bus datagram decoder](https://dev-lab.github.io/tmbus/tmbus.htm).

## Usage
Include either [tmbus.js](https://dev-lab.github.io/tmbus/tmbus.js) or [tmbus.min.js](https://dev-lab.github.io/tmbus/tmbus.min.js) in your code, and pass the M-Bus datagram (as a hex string) to `tmbus()` function to parse it:
```html
<script src="https://dev-lab.github.io/tmbus/tmbus.min.js"></script>
<script>
...
var parsedData = tmbus(mbusDatagram);
...
</script>
```

## Reference

### Creating an M-Bus datagram
```javascript
hexSum(h, c, s)
```
Calculates the checksum for M-Bus data and creates an M-Bus datagram.

#### Arguments:

Name|Type|Description
---|---|---
`h`|string|M-Bus data bytes (formatted as a hexadecimal string) to be put into the datagram, for example: `"402A"`
`c`|boolean|Optional. If `true` calculate checksum and format the data into a valid M-Bus long/short frame
`s`|string|Optional. The character to placed between the HEX bytes to format the result, e.g. `" "`

#### Returns:

M-Bus datagram bytes as hex string

#### Examples:

##### Creating an M-Bus datagram for Initialization of M-Bus device (SND_NKE M-Bus command) at address 42 (2A hex):

```javascript
console.log(hexSum("40 2A", true));
```
Result:
```
10402a6a16
```

##### Creating an M-Bus datagram (formatted with spaces) to request of Class 2 Data (REQ_UD2 M-Bus command) from an M-Bus device at address 42 (2A hex):

```javascript
console.log(hexSum("5B2A", true, " "));
```
Result:
```
10 5b 2a 85 16
```


### Parsing of the M-Bus datagram
```javascript
tmbus(h)
```
Parses an M-Bus datagram.

#### Arguments:

Name|Type|Description
---|---|---
`h`|string|M-Bus datagram bytes as a hex string, for example: `"E5"`

#### Returns:

An object representing an M-Bus datagram

#### Examples:

##### Parsing of the M-Bus fixed data structure
The M-Bus datagram is taken from the [M-Bus rev. 4.8 specification](https://m-bus.com/assets/downloads/MBDOC48.PDF), page 35:

```javascript
var result = tmbus("68 13 13 68 08 05 73 78 56 34 12 0a 00 e9 7e 01 00 00 00 35 01 00 00 3c 16");
console.log(JSON.stringify(result));
```
Result:
```json
{
	"len": 25,
	"type": "Data",
	"l": 19,
	"c": 8,
	"a": 5,
	"ci": 115,
	"errors": [],
	"fixed": true,
	"id": 12345678,
	"accessN": 10,
	"status": 0,
	"cStored": "Actual",
	"deviceCode": 7,
	"deviceType": "Water meter",
	"data": [
		{
			"id": 0,
			"storage": 0,
			"func": "Instantaneous",
			"value": 1,
			"unit": "l"
		},
		{
			"id": 1,
			"storage": 1,
			"func": "Instantaneous",
			"value": 135,
			"unit": "l"
		}
	]
}
```

##### Parsing of the M-Bus variable data structure
The M-Bus datagram is taken from the [M-Bus rev. 4.8 specification](https://m-bus.com/assets/downloads/MBDOC48.PDF), page 43:

```javascript
var result = tmbus("68 1f 1f 68 08 02 72 78 56 34 12 24 40 01 07 55 00 00 00 03 13 15 31 00 da 02 3b 13 01 8b 60 04 37 18 02 18 16");
console.log(JSON.stringify(result, null, "\t"));
```
Result:
```json
{
	"len": 37,
	"type": "Data",
	"l": 31,
	"c": 8,
	"a": 2,
	"ci": 114,
	"errors": [],
	"fixed": false,
	"id": 12345678,
	"manId": "PAD",
	"version": 1,
	"deviceCode": 7,
	"deviceType": "Water meter",
	"accessN": 85,
	"status": 0,
	"data": [
		{
			"id": 0,
			"dif": [
				3
			],
			"vif": [
				19
			],
			"type": "Volume",
			"unit": "m³",
			"value": 12.565,
			"rawValue": [
				21,
				49,
				0
			],
			"func": "Instantaneous",
			"storage": 0
		},
		{
			"id": 1,
			"dif": [
				218,
				2
			],
			"vif": [
				59
			],
			"type": "Volume Flow",
			"unit": "m³/h",
			"value": 0.113,
			"rawValue": [
				19,
				1
			],
			"func": "Maximum",
			"device": 0,
			"tariff": 0,
			"storage": 5
		},
		{
			"id": 2,
			"dif": [
				139,
				96
			],
			"vif": [
				4
			],
			"type": "Energy",
			"unit": "Wh",
			"value": 218370,
			"rawValue": [
				55,
				24,
				2
			],
			"func": "Instantaneous",
			"device": 1,
			"tariff": 2,
			"storage": 0
		}
	]
}
```

### Conversion of units in the parsed M-Bus datagram
```javascript
unitConv(cfg, f)
```
Creates a unit converter for M-Bus datagrams using the configuration/conversion function passed in, for example: Wh -> MWh, days -> years.

#### Arguments:

Name|Type|Description
---|---|---
`cfg`|object|Optional, map of target scales (prefixes) (`""`, `"k"`, `"M"`, `"G"`) to units (`"J"`, `"Wh"`, `"W"`, `"J/h"`). For example, to convert any of {J, kJ, MG} to GJ, and any of {Wh, kWh, GWh} to MWh, use: `{"J":"G","Wh":"M"}`
`f`|function|Optional, function for making more complex modifications to data value objects. For example, to convert days to years: `function(d) { if(d.unit == "days" && d.value > 364) { d.value = p10(Math.round(d.value/36.5), -1); d.unit = "years"; } }`

#### Returns:

A unit converter object with the following properties:

Name|Type|Description
---|---|---
`getUnits`|function|A function that returns an array of supported units for scaling, e.g.: `["J", "Wh", "W", "J/h"]`
`getPrefixes`|function|A function that returns an array of scales (prefixes) applicable for units, e.g.: `["", "k", "M", "G"]`
`config`|function|A function to reconfigure the unit converter, the argument types are the same as those passed when creating the units converter (`unitConv(cfg, f)`)
`process`|function|Main function for processing M-Bus datagram object e.g. `converter.process(tmbus(mbusDatagramHexString))`. This function will modify the passed object, and also return it

#### Examples:

##### Converting liters to m³
Parsing the datagram from the example above (the M-Bus datagram taken from the [M-Bus rev. 4.8 specification](https://m-bus.com/assets/downloads/MBDOC48.PDF), page 35), and converting the units from liters to m³:

```javascript
var result = tmbus("68 13 13 68 08 05 73 78 56 34 12 0a 00 e9 7e 01 00 00 00 35 01 00 00 3c 16");
unitConv(null, function(d) {
        if(d.unit == "l") {
                d.value /= 1000;
                d.unit = "m³";
        }
}).process(result);
console.log(JSON.stringify(result, null, "\t"));
```
Result:
```json
{
	"len": 25,
	"type": "Data",
	"l": 19,
	"c": 8,
	"a": 5,
	"ci": 115,
	"errors": [],
	"fixed": true,
	"id": 12345678,
	"accessN": 10,
	"status": 0,
	"cStored": "Actual",
	"deviceCode": 7,
	"deviceType": "Water meter",
	"data": [
		{
			"id": 0,
			"storage": 0,
			"func": "Instantaneous",
			"value": 0.001,
			"unit": "m³"
		},
		{
			"id": 1,
			"storage": 1,
			"func": "Instantaneous",
			"value": 0.135,
			"unit": "m³"
		}
	]
}

```

##### Using both a conversion configuration and a conversion function
Parsing the datagram from the example above (the M-Bus datagram taken from the [M-Bus rev. 4.8 specification](https://m-bus.com/assets/downloads/MBDOC48.PDF), page 43), and converting:
* Wh, MWh, GWh to kWh;
* m³ to liters;
* m³/hour to liters per minute.

```javascript
var result = tmbus("68 1f 1f 68 08 02 72 78 56 34 12 24 40 01 07 55 00 00 00 03 13 15 31 00 da 02 3b 13 01 8b 60 04 37 18 02 18 16");
unitConv({"Wh": "k"}, function(d) {
	if(d.unit == "m³") {
		d.value *= 1000;
		d.unit = "l";
	} else if(d.unit == "m³/h") {
		d.value *= 100/6; 
		d.unit = "l/min";
	}
}).process(result);
console.log(JSON.stringify(result, null, "\t"));
```
Result:
```json
{
	"len": 37,
	"type": "Data",
	"l": 31,
	"c": 8,
	"a": 2,
	"ci": 114,
	"errors": [],
	"fixed": false,
	"id": 12345678,
	"manId": "PAD",
	"version": 1,
	"deviceCode": 7,
	"deviceType": "Water meter",
	"accessN": 85,
	"status": 0,
	"data": [
		{
			"id": 0,
			"dif": [
				3
			],
			"vif": [
				19
			],
			"type": "Volume",
			"unit": "l",
			"value": 12565,
			"rawValue": [
				21,
				49,
				0
			],
			"func": "Instantaneous",
			"storage": 0
		},
		{
			"id": 1,
			"dif": [
				218,
				2
			],
			"vif": [
				59
			],
			"type": "Volume Flow",
			"unit": "l/min",
			"value": 1.8833333333333335,
			"rawValue": [
				19,
				1
			],
			"func": "Maximum",
			"device": 0,
			"tariff": 0,
			"storage": 5
		},
		{
			"id": 2,
			"dif": [
				139,
				96
			],
			"vif": [
				4
			],
			"type": "Energy",
			"unit": "kWh",
			"value": 218.37,
			"rawValue": [
				55,
				24,
				2
			],
			"func": "Instantaneous",
			"device": 1,
			"tariff": 2,
			"storage": 0
		}
	]
}
```

## Use cases:
* [M-Bus gateway with web server based on ESP8266 NodeMCU](https://github.com/dev-lab/esp-iot-mbus)
* [Live M-Bus datagram decoder](https://dev-lab.github.io/tmbus/tmbus.htm)

## [License](./LICENSE)
Copyright (c) 2023 Taras Greben

Licensed under the [Apache License](./LICENSE).
