#!/usr/bin/env python

# Copyright (c) 2015, Scott D. Peckham

#------------------------------------------------------
# S.D. Peckham
# July 10, 2015
#
# Tool to create a JSON LD file that has an entry for
# every object that occurs in the CSDMS Standard
# Variable Names along with all of the possible
# quantity names for that object.
#
# Example of use at a Unix prompt:
#
#    % ./write_csvn_json.py CSN_VarNames_v0.83.txt
#------------------------------------------------------
#
# Functions:
#    write_json()
#
#------------------------------------------------------

import os.path
import sys

#------------------------------------------------------
def write_json( in_file='CSN_VarNames_v0.83.txt' ):

	#--------------------------------------------------
	# Open input file that contains copied names table
	#--------------------------------------------------
	try:
		in_unit = open( in_file, 'r' )
	except:
		print 'SORRY: Could not open TXT file named:'
		print '       ' + in_file

	#-------------------------
	# Open new CSV text file
	#-------------------------
	## pos     = in_file.rfind('.')
	## prefix  = in_file[0:pos]
	## out_file = prefix + '.json'
	out_file = 'CSN_VarNames_v0.83.json'
	#-------------------------------------------
	OUT_EXISTS = os.path.exists( out_file )
	if (OUT_EXISTS):
		print 'SORRY, A JSON file with the name'
		print '       ' + out_file
		print '       already exists.'
		return
	out_unit = open( out_file, 'w' )

	#------------------------------------------------   
	# Define some string constants, used repeatedly
	#------------------------------------------------
	list_prefix            = '{ "@graph" : ['
	list_sufix            = ']}'
	id_line_prefix         = '{ "@id" : "co:'
	id_line_suffix         = '",'
	id_line_separator      = '' # later it becomes ','
	prop_line_prefix1      = '  "co:property" : '    # (for single)
	prop_line_suffix1      = ','   
	prop_line_prefix2      = '  "co:property" : [ '   # (for multiple)              
	prop_line_suffix2      = ' ],'
	rdf_type_line          = '  "rdf:type" : {"@id" : "skos:Concept"},'
	pref_label_line_prefix = '  "skos:prefLabel" : "'
	pref_label_line_suffix = '" }'
	
	#---------------------------    
	# Parse all variable names
	#---------------------------
	object_name = 'none'
	n_objects = 1
	prop_string = ''


	#-----------------------------------
	# Write some kind of file header ?
	#-----------------------------------
	out_unit.write( list_prefix + '\n\n')


	while (True):
		#------------------------------
		# Read data line from in_file
		#------------------------------   
		line = in_unit.readline()
		if (line == ''):
			break

		#--------------------------------------------------
		# Write object and quantity fullnames to TTL file
		#-------------------------------------------------- 
		line = line.strip()   # (strip leading/trailing white space)                          
		main_parts    = line.split('__')
		new_object_name   = main_parts[0]
		new_quantity_name = main_parts[1]

		READY = (new_object_name != object_name) and (object_name != 'none')
		if (READY):
			#--------------------        
			# Write the ID line
			#--------------------
			out_unit.write( id_line_separator + id_line_prefix + object_name + id_line_suffix + '\n')      

			#---------------------------------------        
			# Write the property (quantities) line
			#---------------------------------------
			if (n_quantities == 1):
				out_unit.write( prop_line_prefix1 + prop_string + prop_line_suffix1 + '\n')   
			else:
				out_unit.write( prop_line_prefix2 + prop_string + prop_line_suffix2 + '\n') 
		 
			#--------------------------        
			# Write the rdf_type line
			#--------------------------
			out_unit.write( rdf_type_line + '\n')  
		
			#----------------------------        
			# Write the pref_label line
			#----------------------------
			out_unit.write( pref_label_line_prefix + object_name + pref_label_line_suffix + '\n')  
			out_unit.write( '\n' )   # (blank line between entries)
			n_objects += 1

			#--------------------------			
			# Start a new prop string
			#--------------------------
			prop_string = '"' + new_quantity_name + '"'
			n_quantities = 1

			# after first line the prefixing separator becomes comma
			id_line_separator = ","

		else:
			#-----------------------------------------
			# Append quantities for this object_name
			#-----------------------------------------
			if (prop_string == ''):
				prop_string = '"' + new_quantity_name + '"'
				n_quantities = 1
			else:
				prop_string += (', "' + new_quantity_name + '"') 
				n_quantities += 1
				
		#------------------------- 		
		# Update the object name
		#------------------------- 
		object_name = new_object_name

	#----------------------
	# Close the input file
	#----------------------
	out_unit.write( list_sufix + "\n\n" );
	in_unit.close()
	
	#----------------------------
	# Close the TXT output file
	#----------------------------
	out_unit.close()
	print 'Finished writing CSN var names as JSON.'
	print 'Number of entries/objects =', n_objects, '.'
	print ' '
					  
#   write_json()
#------------------------------------------------------
if (__name__ == "__main__"):
	
	#-----------------------------------------------------
	# Note: First arg in sys.argv is the command itself.
	#-----------------------------------------------------
	n_args = len(sys.argv)
	if (n_args < 2):
		print 'ERROR: This tool requires an input'
		print '       text file argument.'
		print 'sys.argv =', sys.argv
		print ' '
	elif (n_args == 2):
		write_json( sys.argv[1] )
	else:
		print 'ERROR: Invalid number of arguments.'
		
#-----------------------------------------------------------------------
