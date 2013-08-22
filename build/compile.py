#!/usr/bin/env python
import os
import subprocess

compileDir = "../src/"
outputMin = "../bin/dom.min.js"
outputConcat =  "../bin/dom.js"

def minJS(jsFiles, output):
	print "\n" + "=" * 20
	print "minifying ", jsFiles
	print "=" * 20 + "\n"

	args = [
		"java",
		"-jar",
		"compiler.jar",
		"--js"
	]

	for f in jsFiles:
		args.append(f)

	args.append("--js_output_file")
	args.append(output)

	subprocess.call(args)
	
	print "\n" + "=" * 20
	print "minified output: " + output 
	print "=" * 20 + "\n"



def concatJS(jsFiles, output):

	print "\n" + "=" * 20
	print "concatenating : ",  jsFiles 
	print "=" * 20 + "\n"

	a = open(output, 'w')
	
	for fi in jsFiles: 	
		a.write("// Original file: %s\n" % os.path.split(fi)[1])
		out = open(os.path.abspath(fi)).read()
		a.write(out)
		a.write("\n")
		
	a.close()

	print "\n" + "=" * 20
	print "concatenated output: " + output 
	print "=" * 20 + "\n"

allJS = []
for root, dir, files in os.walk(compileDir):
	for f in files:
		filePath = os.path.join(root, f)
		if(os.path.splitext(filePath)[1] == ".js"):
			allJS.append(os.path.join(root, f));



minJS(allJS, outputMin)
concatJS(allJS, outputConcat)
