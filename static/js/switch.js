$(function(){
	var $clock = $('#clock');
	var $coolSwitchStatus = $('#cool-switch-status');
	var $coolStatus = $('#cool-status');
	var $coolCurrentTemperature = $('#cool-current-temperature');
	var $heatSwitchStatus = $('#heat-switch-status');
	var $heatStatus = $('#heat-status');
	var $heatCurrentTemperature = $('#heat-current-temperature');
	var $fanStatus = $('#fan-status')
	var $lastReading = $('#last-reading');
	var $roomTemperature = $('#room-temperature');
	var $humidity = $('#humidity');
	var $coolTemperature = $('#coolTemperature');
	var $coolSwitchRadioArray = $('input:radio[name=coolSwitch]');
	var $heatTemperature = $('#heatTemperature');
	var $heatSwitchRadioArray = $('input:radio[name=heatSwitch]');
	var $fanSwitchRadioArray = $('input:radio[name=fanSwitch]');

	// Stop user from typing in a 'number' type of `input`
	$("[type='number']").keypress(function (evt) {
		evt.preventDefault();
	});

	// $(document).ajaxStart(function(){
	// 	do something to show AJAX request is processing
	// }).ajaxStop(function(){
	// 	do something once AJAX request stops
	// });

	// Set `input` elements when user opens page
	$.get(
		'/status',
		function(data){
			var status = data['Status'];
			var timeLastRead = status.timeLastRead;
			var roomTemperature = roundInt(status.roomTemperature);
			var humidity = roundInt(status.humidity);
			var coolSwitch = status.coolSwitch;
			var coolTemperature = status.coolTemperature;
			var heatSwitch = status.heatSwitch;
			var heatTemperature = status.heatTemperature;
			var fanSwitch = status.fanSwitch;

			$coolTemperature.val(coolTemperature);
			$heatTemperature.val(heatTemperature);
			setRadioInput($coolSwitchRadioArray, coolSwitch)
			setRadioInput($heatSwitchRadioArray, heatSwitch)
			setRadioInput($fanSwitchRadioArray, fanSwitch)
		}
	);

	// Grab latest HVAC status and show it on page
	updateStatus(
		$coolSwitchStatus,
		$coolStatus,
		$coolCurrentTemperature,
		$heatSwitchStatus,
		$heatStatus,
		$heatCurrentTemperature,
		$fanStatus,
		$lastReading, 
		$roomTemperature,
		$humidity
	)

	// Update clock every second
	window.setInterval(
		function(){
			$clock.html(new Date(Date.now()));
		}
	);

	// Get HVAC status every X seconds
	window.setInterval(
		function(){
			updateStatus(
				$coolSwitchStatus,
				$coolStatus,
				$coolCurrentTemperature,
				$heatSwitchStatus,
				$heatStatus,
				$heatCurrentTemperature,
				$fanStatus,
				$lastReading, 
				$roomTemperature,
				$humidity
			)
		},
		secondsToMilliseconds(5)
	);

	var unitDevicePartsArray = [
		$coolSwitchRadioArray,
		$coolTemperature,
		$heatSwitchRadioArray,
		$heatTemperature,
		$fanSwitchRadioArray
	];

	var timeoutId;
	for(var i=0; i<unitDevicePartsArray.length; i++){
		unitDevicePartsArray[i].click(function(){
			var self = this;
			clearTimeout(timeoutId);
			timeoutId = setTimeout(
				function(){
					var $device = $(self);
					var name = $device.attr('name');

					// `val` attribute of `input` user clicked.
					// If it's a temeprature `input`, this is the temperature value, or else...
					// ...for the others, 0 is 'off', ` is 'on'
					var switchStatus = $device.val();

					var temperatureType = $device.parent()
						.find('input[type=number]')
						.attr('name');
					var temperature = $device.parent()
						.find('input[type=number]')
						.val();

					var dataToSend = {};
					dataToSend[name] = +switchStatus;


					// If user switches cool or heat...
					// ...or changes cool or heat temperature...
					// ...add that info to `dataToSend` object
					if(temperatureType!=undefined){
						dataToSend[temperatureType] = temperature;
						dataTempType = dataToSend[temperatureType]

						if(
							(dataTempType===''||dataTempType===null) && 
							dataToSend[name]===1
						){
							alert('Choose a temperature before turning this on.');
							var $radioButtons = $('input[type="radio"][name="'+name+'"]');
							$radioButtons[0].checked = true;
						}
					}

					if( switchesOn($coolSwitchRadioArray[1], $heatSwitchRadioArray[1])===true ){
						if(name==='coolSwitch'){
							$heatSwitchRadioArray[0].checked = true;
						} else if(name==='heatSwitch'){
							$coolSwitchRadioArray[0].checked = true;
						}
					}

					$.ajax({
						url: '/status',
						type: 'POST',
						data: JSON.stringify(dataToSend),
						contentType: 'application/json; charset=utf-8',
						timeout: secondsToMilliseconds(60), // give the HVAC time to respond
						success: function(data){
							// Useful code may be here one day
							// console.log(data)
						},
						error: function(error){
							alert('HVAC/fan did not get your request!');
							console.log(error);
						}
					});			
				},
				secondsToMilliseconds(5) 
			);
		});
	}
});