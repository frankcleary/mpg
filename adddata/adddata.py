#!/usr/local/bin/python2.7
"""Add a line of data from and HTTP request for the car
fill-up web app"""

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
    with open("../prius_gas.csv", 'ab') as f:
        csvwriter = csv.writer(f, delimiter=',')
        csvwriter.writerow(newdata)
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
