#!/usr/local/bin/python2.7
"""Add a line of data from and HTTP request for the car
fill-up web app"""

import jinja2
import cgi
import hashlib
import cgitb
import csv
cgitb.enable()


def authenticate(key):
    """Return true for the correct key"""
    with open(".htpasswd") as f:
        keylist = f.readlines()
        keylist = [line.strip() for line in keylist]
    keyhash = hashlib.sha1(key + "enorm")
    keyhash = keyhash.hexdigest()
    if keyhash not in keylist:
        return False
    return True


def readmpgcsv():
    """Read in data from a csv file and return an array
    of arrays of the rows in the file, each sub array
    is a row from the file.
    """
    with open("../prius_gas.csv", 'rb') as f:
        csvreader = csv.reader(f, delimiter=',')
        data = [line for line in csvreader]
    return data


def adddata(form):
    """Parse the data from the HTTP request"""
    date = form["date"].value
    brand = form["brand"].value
    city = form["city"].value
    state = form["state"].value
    try:
        odo = int(form["odo"].value)
    except ValueError:
        print "Enter a number for odometer reading."
        return None
    try:
        gal = float(form["gal"].value)
    except ValueError:
        print "Enter a number for gallons."
        return None
    try:
        ppg = float(form["ppg"].value)
    except ValueError:
        print "Enter a number for price per gallon."
        return None
    data = readmpgcsv()
    try:
        prevodo = int(data[-1][5])
    except ValueError:
        print "Bad data in file. Sorry."
        return None
    miles = odo - prevodo
    mpg = round(miles/gal, 2)
    newdata = [date, brand, city,
               state, ppg, odo,
               gal, miles, mpg]
    return newdata


def mkindex():
    """Print html with info about the most recent fill-up,
    and d3.js graphs.
    """    
    env = jinja2.Environment(loader=jinja2.FileSystemLoader(
        searchpath='../templates/')
        )
    template = env.get_template('mpg.html')
    dispdict = {}

    data = readmpgcsv()
    dispdict['milesdriven'] = round(float(data[-1][-4]) -
                                    float(data[-2][-4]), 2)
    dispdict['mpg'] = round(float(data[-1][-1]), 2)
    dispdict['sumgal'] = sum([float(row[6]) for row in data[1:]])
    dispdict['lifempg'] = round(int(data[-1][-4])/dispdict['sumgal'],
                                2)
    dispdict['gascost'] = round(sum([float(row[4])*float(row[6])
                   for row in data[1:]]), 2)
    dispdict['header'] = data[0]
    dispdict['fillups'] = data[1:]
    output = template.render(dispdict)
    with open('../index.html', 'w') as f:
        f.write(output);

def main():
    """Append a line to the fill-up data .csv file and
    redirect to the data viewing page (/mpg/index.cgi)
    """
    print "Content-Type: text/html"
    print

    form = cgi.FieldStorage()
    if not authenticate(form["key"].value):
        print "Bad Key"
        return

    newdata = adddata(form)
    if newdata is None:
        return
    with open("../prius_gas.csv", 'a') as f:
        csvwriter = csv.writer(f, delimiter=',')
        csvwriter.writerow(newdata)
    mkindex()
    print """
      <html lang="en-US">
             <head>
                <meta charset="UTF-8">
                <meta http-equiv="refresh" content="1;url=/mpg">
                <script type="text/javascript">
                    window.location.href = "/mpg"
                </script>
                <title>Page Redirection</title>
            </head>
            <body>
                <a href='/mpg'>MPG app</a>
            </body>
        </html>
        """

if __name__ == "__main__":
    main()
