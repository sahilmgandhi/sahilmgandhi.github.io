#!/usr/bin/python

import random, sys, string, csv, argparse

parser=argparse.ArgumentParser(
    description='''This script generates the HTML code for the timeline boxes''',
    epilog="""Have fun!""")
parser.add_argument('-i', default='movies.csv', dest='inputFile', help='Name of the csv file. Default is movies.csv')
parser.add_argument('-o', default='reviews.txt', dest='outputFile', help='Name of the output file. Default is reviews.txt')
args=parser.parse_args()

outputFile = open(args.outputFile, 'w')
currRating = 9
counter = 0

with open(args.inputFile, 'r') as movies:
    movieEntries = csv.reader(movies)
    outputFile.write("<div id=\"9\">")
    outputFile.write("<div id=\"ratingsBanner\"><h2>%d.00/10 - %d/10</h2></div>" % (currRating, (currRating + 1)))
    for row in movieEntries:
        if int(float(row[0])) < currRating:
            currRating = int(float(row[0]))
            outputFile.write("</div>")
            outputFile.write("<div id=\"%d\">" % (currRating))
            outputFile.write("<div id=\"ratingsBanner\"><h2>%d.00/10 - %d.99/10</h2></div>" % (currRating, (currRating)))
        if counter % 2 == 0:
            outputFile.write("<div class=\"container left\">")
        else:
            outputFile.write("<div class=\"container right\">")
        outputFile.write("<div class=\"timelineContent\">")
        if row[1] == 'None':
            outputFile.write("<p>No movies that are ranked in the %d's yet</p>" % (currRating))
        else:    
            outputFile.write("<h2>%.2f</h2>" % (float(row[0])))
            outputFile.write("<p>%s</p>" % (str(row[1])))
        outputFile.write("</div></div>")
        counter += 1
    outputFile.write("</div>")
