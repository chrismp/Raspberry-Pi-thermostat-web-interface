function roundInt(num){
	return Math.round(num);
}

function translateSwitch(status){
	return status===1 ? 'On' : 'Off';
}

function translateTemperature(temp){
	return temp===null ? 'Temperature not yet set' : temp;
}

function switchesOn(switch1, switch2){
	return switch1.checked===true && switch2.checked===true;
}

function secondsToMilliseconds(x){
	return x*1000;
}

function setRadioInput(arrayOfElements, statusReceivedFromServer){
	for (var i=0; i<arrayOfElements.length; i++) {
		var radioInput = $(arrayOfElements[i]); // Select the current radio button input using jQuery selector
		var radioInputValue = +radioInput.val(); // Force the radio button's value, which is a string, into an integer
		if(statusReceivedFromServer===radioInputValue){
			radioInput.prop('checked',true);
		}
	}	
}

function getOtherDeviceSetting(arrayOfElements){
	for(var i = 0; i < arrayOfElements.length; i++) {
		var elem = $(arrayOfElements[i]);
		if(elem.prop('checked',true)){
			return +elem.val();
		}
	}
}

function updateStatus(coolSwitchStatusElem, coolStatusElem, coolCurrentTemperatureElem, heatSwitchStatusElem, heatStatusElem, heatCurrentTemperatureElem, fanStatusElem, lastReadingElem, roomTemperatureElem, humidityElem){
	$.get(
		'/status',
		function(data){
			var status = data['Status'];
			if(status===null){
				return false;
			}

			var timeLastRead = status.timeLastRead;
			var roomTemperature = status.roomTemperature;
			var humidity = status.humidity;
			var coolSwitch = status.coolSwitch;
			var coolStatus = status.coolStatus;
			var coolTemperature = status.coolTemperature;
			var heatSwitch = status.heatSwitch;
			var heatStatus = status.heatStatus;
			var heatTemperature = status.heatTemperature;
			var fanSwitch = status.fanSwitch;

			lastReadingElem.html(new Date(timeLastRead*1000)); // Convert UNIX time to English
			coolSwitchStatusElem.html(translateSwitch(coolSwitch));
			coolStatusElem.html(translateSwitch(coolStatus));
			coolCurrentTemperatureElem.html(translateTemperature(coolTemperature));
			heatSwitchStatusElem.html(translateSwitch(heatSwitch));
			heatStatusElem.html(translateSwitch(heatStatus));
			heatCurrentTemperatureElem.html(translateTemperature(heatTemperature));
			fanStatusElem.html(translateSwitch(fanSwitch));
			roomTemperatureElem.html(translateTemperature(roomTemperature));
			humidityElem.html(humidity);
		}
	);
}

// function changeDeviceSetting(device, coolSwitchRadioArray, heatSwitchRadioArray){
// 	var $device = $(device);
// 	var name = $device.attr('name');

// 	// `val` attribute of `input` user clicked.
// 	// If it's a temeprature `input`, this is the temperature value, or else...
// 	// ...for the others, 0 is 'off', ` is 'on'
// 	var switchStatus = $device.val();

// 	var temperatureType = $device.parent()
// 		.find('input[type=number]')
// 		.attr('name');
// 	var temperature = $device.parent()
// 		.find('input[type=number]')
// 		.val();

// 	var dataToSend = {};
// 	dataToSend[name] = +switchStatus;

// 	// console.log(dataToSend);

// 	// If user switches cool or heat...
// 	// ...or changes cool or heat temperature...
// 	// ...add that info to `dataToSend` object
// 	if(temperatureType!=undefined){
// 		dataToSend[temperatureType] = temperature;
// 		dataTempType = dataToSend[temperatureType]

// 		if(
// 			(dataTempType===''||dataTempType===null) && 
// 			dataToSend[name]===1
// 		){
// 			alert('Choose a temperature before turning this on.');
// 			var $radioButtons = $('input[type="radio"][name="'+name+'"]');
// 			$radioButtons[0].checked = true;
// 		}
// 	}

// 	console.log(coolSwitchRadioArray); 
// 	console.log(heatSwitchRadioArray);
// 	console.log(coolSwitchRadioArray[1]); 
// 	console.log(heatSwitchRadioArray[1]);

// 	if( switchesOn(coolSwitchRadioArray[1], heatSwitchRadioArray[1])===true ){
// 		if(name==='coolSwitch'){
// 			heatSwitchRadioArray[0].checked = true;
// 		} else if(name==='heatSwitch'){
// 			coolSwitchRadioArray[0].checked = true;
// 		}
// 	}

// 	$.ajax({
// 		url: '/status',
// 		type: 'POST',
// 		data: JSON.stringify(dataToSend),
// 		contentType: 'application/json; charset=utf-8',
// 		timeout: secondsToMilliseconds(60), // give the HVAC time to respond
// 		success: function(data){
// 			console.log(data)
// 		},
// 		error: function(error){
// 			alert('HVAC/fan did not get your request!');
// 			console.log(error);
// 		}
// 	});			
// }