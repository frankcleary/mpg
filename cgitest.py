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

def cssprint():
    print "<!DOCTYPE html>"
    print "<html>"
    print "<head>"
    print '<link rel="stylesheet" type="text/css" href="mpg.css">'
    print "</head>"

def chart():
    print """
          <div class="chart"></div>
          <script src="http://d3js.org/d3.v3.min.js"  
          charset="utf-8"></script>
          <script>
          var data = [4, 8, 15, 16, 23, 42];

          var x = d3.scale.linear()
              .domain([0, d3.max(data)])
              .range([0, 420]);

          d3.select(".chart")
            .selectAll("div")
              .data(data)
            .enter().append("div")
              .style("width", function(d) { return x(d) + "px"; })
              .text(function(d) { return d; });

           </script>
          """
    
def main():
    with open("/home/protected/keylist.txt") as f:
        keylist = f.readlines()
        keylist = [line.strip() for line in keylist]
    print "Content-Type: text/html"
    print
    cssprint()
    form = cgi.FieldStorage()
    keyhash = hashlib.sha1(form["key"].value + "enorm")
    keyhash = keyhash.hexdigest()
    if keyhash not in keylist:
        print "Bad Key"
        return

    date = form["date"].value
    brand = form["brand"].value
    city = form["city"].value
    state = form["state"].value
    try:
        odo = int(form["odo"].value)
    except ValueError:
        print "Enter a number for odometer reading."
        return
    try:
        gal = float(form["gal"].value)
    except ValueError:
        print "Enter a number for gallons."
        return
    try:
        ppg = float(form["ppg"].value)
    except ValueError:
        print "Enter a number for price per gallon."
        return
    data = readmpgcsv()
    try:
        prevodo = int(data[-1][5])
    except ValueError:
        print "Bad data in file. Sorry."
        return
    miles = odo - prevodo
    mpg = miles/gal
    newdata = [date, brand, city, 
               state, ppg, odo,
               gal, miles, mpg]
    with open("/home/protected/prius_gas.csv", 'ab') as f:
        csvwriter = csv.writer(f, delimiter=',')
        csvwriter.writerow(newdata)
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
