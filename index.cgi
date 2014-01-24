#!bin/python2.7
"""Make a page with info from the current fill-up, including
graphs with calls to mpg.js (mpg graph) and miles.js (miles
driven graph.

Frank Cleary. frank@frankcleary.com
"""

import cgi
import hashlib
import cgitb
import csv
cgitb.enable()


def readmpgcsv():
    """Read in data from a csv file and return an array
    of arrays of the rows in the file, each sub array
    is a row from the file.
    """
    with open("prius_gas.csv", 'rb') as f:
        csvreader = csv.reader(f, delimiter=',')
        data = [line for line in csvreader]
    return data


def main():
    """Print html with info about the most recent fill-up,
    and d3.js graphs.
    """
    # print links to .css and .js (for graphs) files
    print "Content-Type: text/html"
    print
    print '<link rel="stylesheet" type="text/css" href="mpg.css">'
    print """
       <script src="http://d3js.org/d3.v3.min.js"  charset="utf-8"></script>
       <script src="mpg.js" charset="utf-8"></script>
       <script src="miles.js" charset="utf-8"></script>
       """

    data = readmpgcsv()
    sumgal = sum([float(row[6]) for row in data[1:]])
    lifempg = int(data[-1][-4])/sumgal
    gascost = sum([float(row[4])*float(row[6])
                   for row in data[1:]])

    # print info from current fill up and table with all fillups
    print "<p>Miles driven: %s" % (float(data[-1][-4]) - float(data[-2][-4]))
    print "<p>Your mpg was: <b>%.2f</b>" % float(data[-1][-1])
    print "<p>Lifetime mpg: %.2f" % lifempg
    print "<p>Lifetime gas cost: $%.2f" % gascost
    print "<p>"
    print """<div id="mpg"></div>
             <div id="miles"></div>
          """
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
