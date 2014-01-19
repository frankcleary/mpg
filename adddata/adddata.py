#!/usr/local/bin/python2.7
"""Add a line of data from and HTTP request for the car fill-up web app"""

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
    mpg = miles/gal
    newdata = [date, brand, city, 
               state, ppg, odo,
               gal, miles, mpg]
    return newdata

def main():
    print "Content-Type: text/html"
    print

    cssprint()
    form = cgi.FieldStorage()
    if not authenticate(form["key"].value):
        print "Bad Key"
        return

    newdata = adddata(form)
    if newdata is None:
        return
    with open("prius_gas.csv", 'ab') as f:
        csvwriter = csv.writer(f, delimiter=',')
        csvwriter.writerow(newdata)
    print "Location: ../mpg"  # redirect to summary page
    
if __name__ == "__main__":
    main()
