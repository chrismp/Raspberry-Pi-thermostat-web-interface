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
			var status = data['Status'];
			if(status===null){
				return false;
			}

			var timeLastRead = status.timeLastRead;
			var roomTemperature = roundInt(status.roomTemperature);
			var humidity = roundInt(status.humidity);
			var coolSwitch = status.coolSwitch;
			var coolTemperature = status.coolTemperature;
			var heatSwitch = status.heatSwitch;
			var heatTemperature = status.heatTemperature;
			var fanSwitch = status.fanSwitch;
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
	return status===1 ? 'On' : 'Off';
}

function translateTemperature(temp){
	return temp===null ? 'Temperature not yet set' : temp;
}

function switchesOn(switch1, switch2){
	return switch1.checked===true && switch2.checked===true;
}