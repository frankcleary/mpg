#! /usr/local/bin/python2.7
import cgi
import hashlib
import cgitb
import csv
cgitb.enable()

def readmpgcsv():
    with open("/home/protected/prius_gas.csv", 'rb') as f:
        csvreader = csv.reader(f, delimiter=',')
        data = [line for line in csvreader]
    return data

def main():
    print "Content-Type: text/html"
    print

    data = readmpgcsv()
    print "<p>Wrote: %s" % data[-1]
    print "<p>Miles driven: %s" % miles
    print "<p>Your mpg was: <b>%.2f</b>" % mpg
    sumgal = sum([float(row[6]) for row in data[1:]])
    lifempg = odo/sumgal
    print "<p>Lifetime mpg: %.2f" % lifempg
    gascost = sum([float(row[4])*float(row[6])
                   for row in data[1:]])
    print "<p>Lifetime gas cost: %.2f" % gascost
    chart()
    print "<p>"
    print "<p>Lifetime Data:</p>"
    print "<table>"
    writetablerow(data[0], bold=True)
    for row in data[1:]:
        writetablerow(row)
    print "</table>"

def writetablerow(row, bold=False):
    if bold:
        print ' <tr><td><b>'
        print '  </b></td><td><b>'.join(row)
        print ' </b></td></tr>'
    else:
        print ' <tr><td>'
        print '  </td><td>'.join(row)
        print ' </td></tr>'
    
if __name__ == "__main__":
    main()
