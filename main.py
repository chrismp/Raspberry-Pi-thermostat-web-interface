from flask import Flask, render_template, flash, redirect, jsonify, request
import datetime
import time
import sys 
import os

# my scripts
import db
import methods


app = Flask(__name__, static_url_path='')

if db.getLastStatus()==None:
	desiredStatus = {
		'coolSwitch': 0,
		'coolTemperature': None,
		'heatSwitch': 0,
		'heatTemperature': None,
		'fanSwitch': 0
	}
else:
	lastRow = db.getLastStatus()
	desiredStatus = {
		'coolSwitch': lastRow['coolSwitch'],
		'coolTemperature': lastRow['coolTemperature'],
		'heatSwitch': lastRow['heatSwitch'],
		'heatTemperature': lastRow['heatTemperature'],
		'fanSwitch': lastRow['fanSwitch']
	}

print desiredStatus # for debugging


@app.route('/', methods=['GET','POST'])
@app.route('/index', methods=['GET','POST'])
def homepage():
	return render_template('index.html')

# Receive information from the Raspberry Pi about the air conditioner's state and add to the database. 
# Respond to the Pi with the current desired state as set by the user.
@app.route('/add-hvac-status', methods=['POST'])
def update():
	response = request.json
	roomTemperature = response['roomTemperature']
	humidity = response['humidity']
	coolSwitch = response['coolSwitch']
	coolTemperature = response['coolTemperature']
	heatSwitch = response['heatSwitch']
	heatTemperature = response['heatTemperature']
	fanSwitch = response['fanSwitch']
	print response # for debugging

	# add current status received from Pi to database
	db.addStatus(
		(
			time.time(),
			roomTemperature,
			humidity,
			coolSwitch,
			coolTemperature,
			heatSwitch,
			heatTemperature,
			fanSwitch
		)
	)

	print desiredStatus # for debugging
	return jsonify(desiredStatus)

@app.route('/status', methods=['GET','POST'])
def status():
	currentLog = db.getLastStatus()
	print currentLog # debugging only

	# Sets new desired state based on user input.
	# Return current state of HVAC and fan
	if request.method == 'POST':
		response = request.json
		print response # debugging only

		# `response` won't have all the keys `desiredStatus` has.
		# So go thru each key in `desiredStatus`.
		# If a `desiredStatus` key matches a `response` key...
		# ... change that `desiredStatus` key's value... 
		# ...to that of the `response` key's value.
		# If not, still add the key to `desiredStatus`...
		# ...but give it the value from the latest reading in the data table
		for key in desiredStatus:
			if(key in response):
				desiredStatus[key] = response[key]
			else:
				desiredStatus[key] = currentLog[key]

		if 'coolSwitch' in response:
			if response['coolSwitch']==0:
				desiredStatus['coolSwitch'] = 0
			elif response['coolSwitch']==1:
				desiredStatus['coolSwitch'] = 1
				desiredStatus['heatSwitch'] = 0

			if 'coolTemperature' in response:
				if methods.blankOrNone(response['coolTemperature']):
					desiredStatus['coolSwitch'] = 0
					desiredStatus['coolTemperature'] = None

		if 'heatSwitch' in response:
			if response['heatSwitch']==0:
				desiredStatus['heatSwitch'] = 0
			elif response['heatSwitch']==1:
				desiredStatus['coolSwitch'] = 0
				desiredStatus['heatSwitch'] = 1

			if 'heatTemperature' in response:
				if methods.blankOrNone(response['heatTemperature']):
					desiredStatus['heatSwitch'] = 0
					desiredStatus['heatTemperature'] = None

		if 'fanSwitch' in response:
			if response['fanSwitch']==0 or response['fanSwitch']==1:
				desiredStatus['fanSwitch'] == response['fanSwitch']
			else:
				desiredStatus['fanSwitch'] = 0

				print desiredStatus
		db.addStatus(
			(
				time.time(),
				currentLog['roomTemperature'],
				currentLog['humidity'],
				desiredStatus['coolSwitch'],
				desiredStatus['coolTemperature'],
				desiredStatus['heatSwitch'],
				desiredStatus['heatTemperature'],
				desiredStatus['fanSwitch']
			)
		)
		return jsonify(desiredStatus)

	currentLog = db.getLastStatus()
	if currentLog==None:
		return jsonify({'Status':None})

	return jsonify(
		{
			'Status':{
				'timeLastRead': currentLog['unixTime'],
				'roomTemperature': currentLog['roomTemperature'],
				'humidity': currentLog['humidity'],
				'coolSwitch': currentLog['coolSwitch'],
				'coolTemperature': currentLog['coolTemperature'],
				'heatSwitch': currentLog['heatSwitch'],
				'heatTemperature': currentLog['heatTemperature'],
				'fanSwitch': currentLog['fanSwitch']	
			}
		}
	)

if __name__=='__main__':
	app.run(debug=True)
