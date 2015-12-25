$(function(){
	$("[type='number']").keypress(function (evt) {
	    evt.preventDefault();
	});
	
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

	// $(document).ajaxStart(function(){
	// 	do something to show AJAX request is processing
	// }).ajaxStop(function(){
	// 	do something once AJAX request stops
	// });

	// Set `input` elements
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

	window.setInterval(
		function(){
			$clock.html(new Date(Date.now()));
		}
	);

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
		10000
	);

	var unitDevicePartsArray = [
		$coolSwitchRadioArray,
		$coolTemperature,
		$heatSwitchRadioArray,
		$heatTemperature,
		$fanSwitchRadioArray
	];

	for (var i=0; i<unitDevicePartsArray.length; i++) {
		unitDevicePartsArray[i].click(function(){
			var $this = $(this);
			var name = $this.attr('name');

			// `val` attribute of `input` user clicked.
			// If it's a temeprature `input`, this is the temperature value, or else...
			// ...for the others, 0 is 'off', ` is 'on'
			var switchStatus = $this.val();

			var temperatureType = $this.parent()
				.find('input[type=number]')
				.attr('name');
			var temperature = $this.parent()
				.find('input[type=number]')
				.val();

			var dataToSend = {};
			dataToSend[name] = +switchStatus;

			// console.log(dataToSend);

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
				// alert('"Cool" and "Heat" cannot be on at the same time.');
				if(name==='coolSwitch'){
					$heatSwitchRadioArray[0].checked = true;
				} else if(name==='heatSwitch'){
					$coolSwitchRadioArray[0].checked = true;
				}
			}
			console.log(dataToSend);
			$.ajax({
				url: '/status',
				type: 'POST',
				data: JSON.stringify(dataToSend),
				contentType: 'application/json; charset=utf-8',
				timeout: 20000, // give the A/C 20 seconds
				success: function(data){
					console.log('got response');
					console.log(data);
				},
				error: function(error){
					alert('HVAC/fan did not get your request!');
					console.log(error);
				}
			});
		});
	};

});