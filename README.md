Trouble with MySQL on python 3.4 virtual environment fix: http://stackoverflow.com/questions/14087598/python-3-3-importerror-no-module-named-configparser
Set up Python virtual environment with custom Python version: http://stackoverflow.com/questions/1534210/use-different-python-version-with-virtualenv

Pre-req `apt-get install`:
1. `libmysqlclient-dev`
2. `python` (v2.7)
3. `python-dev`
4. MySQL packages 

Open command line, run:
1. `pip install virtualenv`
2. `virtualenv venv`
3. `. venv/bin/activate`
4. `pip install -r requirements.txt`
5. `honcho start`