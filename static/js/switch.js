$(function(){
	var $clock = $('#clock');
	var $coolStatus = $('#cool-status');
	var $coolCurrentTemperature = $('#cool-current-temperature');
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
		$coolStatus,
		$coolCurrentTemperature,
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
				$coolStatus,
				$coolCurrentTemperature,
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
	for (var i=0; i<unitDevicePartsArray.length; i++) {
		unitDevicePartsArray[i].click(
			window.clearTimeout(timeoutId);
			timeoutId = window.setTimeout( changeDeviceSetting(device), secondsToMilliseconds(2) );
		);
	}
});