import MySQLdb as mdb
import MySQLdb.cursors
import sys
import os

# Make the data table if it does not exist
# `unixTime` is the number of seconds since since January 1, 1970.
# `roomTemperature` and `humidity` come from the DHT22 temperature/humidity sensor
# If user switches "cool" on (aka the air conditioner), `coolSwitch` gets set to 1, else 0
# `coolStatus` gets set to 1 if the relay switch connected to the HVAC air compressor is turned on -- it's to show the user if "cool" is switched on or off
# Based on the above two lines, you can probably guess how `heatSwitch` and `heatStatus` work
# `coolTemperature` is the user-set temperature for "cool" (aka the A/C), `heatTemperature` is user-set temperature for "heat"
# When user turns fan on from the user interface (the thermostat web page), `fanSwitch` is set to `, else 0. 
# `fanSwitch` also represents the actual status of the relay switch connected to the HVAC unit's fan. If `fanSwitch` is 1, the relay switch connected to HVAC's fan is on, else it's off
def makeDB():
	conn = mdb.connect(host, user, pw, db)
	c = conn.cursor()
	c.execute(
		'''
			CREATE TABLE IF NOT EXISTS statuses(
				row INT(11) AUTO_INCREMENT PRIMARY KEY,
				unixTime FLOAT NOT NULL,
				roomTemperature FLOAT,
				humidity FLOAT,
				coolSwitch BOOLEAN DEFAULT FALSE NOT NULL,
				coolStatus BOOLEAN DEFAULT FALSE NOT NULL,
				coolTemperature INTEGER,
				heatSwitch BOOLEAN DEFAULT FALSE NOT NULL,
				heatStatus BOOLEAN DEFAULT FALSE NOT NULL,
				heatTemperature INTEGER,
				fanSwitch BOOLEAN DEFAULT FALSE NOT NULL
			)
		'''
	)
	conn.commit()

# `addStatus()` is called when a POST request is sent to '/add-hvac-status' -- check `main.py` for more info
# It adds the HVAC's/thermostat's latest status to the MySQL data table
def addStatus(status):
	conn = mdb.connect(host, user, pw, db)
	c = conn.cursor()
	c.execute(
		'''
			INSERT INTO statuses(
				unixTime,
				roomTemperature,
				humidity,
				coolSwitch,
				coolStatus,
				coolTemperature,
				heatSwitch,
				heatStatus,
				heatTemperature,
				fanSwitch
			)
			VALUES (
				%s,
				%s,
				%s,
				%s,
				%s,
				%s,
				%s,
				%s,
				%s,
				%s
			)
		''',
		status
	)
	conn.commit()

# As its name suggests `getLastStatus()` retrieves the most recently-added row from the data table storing HVAC's/thermostat's status
def getLastStatus():
	conn = mdb.connect(host, user, pw, db, cursorclass=MySQLdb.cursors.DictCursor)
	c = conn.cursor()
	c.execute(
		'''
			SELECT * 
			FROM statuses 
			ORDER BY row DESC 
			LIMIT 1
		'''
	)
	data = c.fetchone()
	return data


# Try to make the database. If there's an error, print it.
# The MySQL database's connection info is stored in environment variables -- in this case, a .env file
# Since this whole app is on Heroku, it uses config variables stored with Heroku.
# More info: https://devcenter.heroku.com/articles/config-vars
try:
	host = os.environ.get('HOSTNAME')
	user = os.environ.get('USERNAME')
	pw = os.environ.get('PASSWORD')
	db = os.environ.get('DATABASE')
	makeDB()
except mdb.Error as e:
	print("Error %d: %s" % (e.args[0],e.args[1]))
	sys.exit(1)