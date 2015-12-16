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

function roundInt(num){
	return Math.round(num);
}

function updateStatus(coolStatusElem, coolCurrentTemperatureElem, heatStatusElem, heatCurrentTemperatureElem, fanStatusElem, lastReadingElem, roomTemperatureElem, humidityElem){
	$.get(
		'/status',
		function(data){
			var timeLastRead = data.timeLastRead;
			var roomTemperature = roundInt(data.roomTemperature);
			var humidity = roundInt(data.humidity);
			var coolSwitch = data.coolSwitch;
			var coolTemperature = data.coolTemperature;
			var heatSwitch = data.heatSwitch;
			var heatTemperature = data.heatTemperature;
			var fanSwitch = data.fanSwitch;

			lastReadingElem.html(new Date(timeLastRead*1000));
			coolStatusElem.html(translateSwitch(coolSwitch));
			coolCurrentTemperatureElem.html(translateTemperature(coolTemperature));
			heatStatusElem.html(translateSwitch(heatSwitch));
			heatCurrentTemperatureElem.html(translateTemperature(heatTemperature));
			fanStatusElem.html(translateSwitch(fanSwitch));
			roomTemperatureElem.html(translateTemperature(roomTemperature));
			humidityElem.html(humidity);
		}
	);
}

function translateSwitch(status){
	return status===0 ? 'Off' : 'On';
}

function translateTemperature(temp){
	return temp===null ? 'Temperature not yet set' : temp;
}

function switchesOn(switch1, switch2){
	return switch1.checked===true && switch2.checked===true;
}