#!bin/python2.7
"""Make a page with info from the current fill-up, including
graphs with calls to mpg.js (mpg graph) and miles.js (miles
driven graph.

Frank Cleary. frank@frankcleary.com
"""

import jinja2
import csv
import cgi
import cgitb
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
    print "Content-Type: text/html"
    print

    env = jinja2.Environment(loader=jinja2.FileSystemLoader(searchpath='templates/'))
    template = env.get_template('mpg.txt')
    dispdict = {}

    data = readmpgcsv()
    dispdict['milesdriven'] = round(float(data[-1][-4]) - float(data[-2][-4]), 2)
    dispdict['mpg'] = round(float(data[-1][-1]), 2)
    dispdict['sumgal'] = sum([float(row[6]) for row in data[1:]])
    dispdict['lifempg'] = round(int(data[-1][-4])/dispdict['sumgal'], 2)
    dispdict['gascost'] = round(sum([float(row[4])*float(row[6])
                   for row in data[1:]]), 2)
    dispdict['header'] = data[0]
    dispdict['fillups'] = data[1:]
    print template.render(dispdict)

if __name__ == "__main__":
    main()
