import MySQLdb as mdb
import MySQLdb.cursors

def makeDB():
	conn = mdb.connect(server, user, pw, db)
	c = conn.cursor()
	c.execute(
		'''
			CREATE TABLE IF NOT EXISTS statuses(
				row INT(11) AUTO_INCREMENT PRIMARY KEY,
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
	print(status)

	conn = mdb.connect(server, user, pw, db)
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
		status,
	)
	conn.commit()

def getLastStatus():
	conn = mdb.connect(server, user, pw, db, cursorclass=MySQLdb.cursors.DictCursor)
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


try:
	server = 'localhost'
	user = 'root'
	pw = 'password'
	db = 'HVACPi'
	makeDB()
except mdb.Error, e:
	print "Error %d: %s" % (e.args[0],e.args[1])
	sys.exit(1)

