import sqlite3
conn = sqlite3.connect('statuses.db', check_same_thread=False)

def makeDB():
	c = conn.cursor()
	c.execute(
		'''
			CREATE TABLE IF NOT EXISTS statuses(
				row integer primary key autoincrement,
				unixTime FLOAT NOT NULL,
				roomTemperature FLOAT,
				humidity FLOAT,
				coolSwitch BOOLEAN DEFAULT FALSE NOT NULL,
				coolTemperature INTEGER,
				heatSwitch BOOLEAN DEFAULT FALSE NOT NULL,
				heatTemperature INTEGER,
				fanSwitch BOOLEAN DEFAULT FALSE NOT NULL
			)
		'''
	)
	conn.commit()

def addStatus(status):
	c = conn.cursor()
	c.execute(
		'''
			INSERT INTO statuses(
				unixTime,
				roomTemperature,
				humidity,
				coolSwitch,
				coolTemperature,
				heatSwitch,
				heatTemperature,
				fanSwitch
			)
			VALUES (
				?,
				?,
				?,
				?,
				?,
				?,
				?,
				?
			)
		''',status
	)
	conn.commit()

def getLastStatus():
	conn.row_factory = sqlite3.Row
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


makeDB()