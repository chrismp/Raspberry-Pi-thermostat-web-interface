def blankOrNone(v):
	return v==None or v==''

def convertToF(tempC):
        return tempC * 9/5.0 + 32

def convertToC(tempF):
        return ((tempF - 32) / 9) * 5

def inTemperatureRange(minTemp, maxTemp, temperature):
	print(minTemp,maxTemp,temperature)
	if temperature==None or temperature=='':
		return False

	if temperature<minTemp or temperature>maxTemp:
		return False

	return True
