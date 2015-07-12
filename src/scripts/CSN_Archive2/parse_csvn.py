#!/usr/bin/env python

# Copyright (c) 2015, Scott D. Peckham

#------------------------------------------------------
# S.D. Peckham
# July 9, 2015
#
# Tool to break CSDMS Standard Variable Names into
# all of their component parts, then save results in
# various formats. (e.g. Turtle TTL format)
#
# Example of use at a Unix prompt:
#
#    % ./parse_csvn.py CSN_VarNames_v0.83.txt
#------------------------------------------------------
#
# Functions:
#    parse_names()
#
#------------------------------------------------------

import os.path
import sys

#------------------------------------------------------
def parse_names( in_file='CSN_VarNames_v0.83.txt' ):

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
    ## out_file = prefix + '.ttl'
    out_file = 'CSN_VarNames_v0.83.ttl'
    #-------------------------------------------
    OUT_EXISTS = os.path.exists( out_file )
    if (OUT_EXISTS):
        print 'SORRY, A TTL file with the name'
        print '       ' + out_file
        print '       already exists.'
        return
    out_unit = open( out_file, 'w' )

    #------------------------
    # Write TTL file header
    #------------------------
    out_unit.write( '@prefix dc:    <http://purl.org/dc/elements/1.1/> .' + '\n' )
    out_unit.write( '@prefix ns:    <http://example.org/ns#> .' + '\n' )
    out_unit.write( '@prefix vcard: <http://www.w3.org/2001/vcard-rdf/3.0#> .' + '\n')
    out_unit.write( '@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .' + '\n' )
    out_unit.write( '@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .' + '\n' )
    out_unit.write( '@prefix owl:   <http://www.w3.org/2002/07/owl#> .' + '\n' )
    out_unit.write( '@prefix csn:   <http://ecgs.ncsa.illinois.edu/2015/csn#> .' + '\n' )
    out_unit.write( '\n' )  # (blank line)
    
    root_quan_list = list()  # (list to save all root quantities)
    
    #---------------------------    
    # Parse all variable names
    #---------------------------
    indent = '    '  # (four spaces)
    n_names = 0
    while (True):
        #------------------------------
        # Read data line from in_file
        #------------------------------   
        line = in_unit.readline()
        if (line == ''):
            break
            
        #-----------------------------------------
        # Write entire variable name to TTL file
        #-----------------------------------------    
        line = line.strip()   # (strip leading/trailing white space)
        out_unit.write( '<csn:' + line + '>\n' )
  
        #--------------------------------------------------
        # Write object and quantity fullnames to TTL file
        #--------------------------------------------------                           
        main_parts = line.split('__')
        object_part   = main_parts[0]
        quantity_part = main_parts[1]
        out_unit.write( indent + 'a csn:name ;\n' )
        out_unit.write( indent + "csn:object_fullname '"   + object_part   + "' ;\n" )
        out_unit.write( indent + "csn:quantity_fullname '" + quantity_part + "' ;\n" )         

        #---------------------------------------------
        # Write parts of object_fullname to TTL file
        #---------------------------------------------
        object_list = object_part.split('_')
        n_objects   = len( object_list )
        for k in xrange( n_objects ):
            object = object_list[k]
            obj_string = " '" + object + "' "
            obj_prefix = indent + "csn:object" + str(k+1)
            out_unit.write( obj_prefix + obj_string + ";\n")
            adj_list = object.split('~')
            n_adjectives = len(adj_list) - 1   # (first one in list is the object)
            for j in xrange( n_adjectives ):
                adj_string = " '" + adj_list[j+1] + "' "
                adj_prefix = obj_prefix + "_adjective" + str(j+1)
                out_unit.write( adj_prefix + adj_string + ";\n" )
 
        #-------------------------------------
        # Write root object name to TTL file
        #-------------------------------------  
        root_object = object_list[-1]   # (last object in list)
        root_obj_string = " '" + root_object + "' "
        root_obj_prefix = indent + "csn:root_object"  
        out_unit.write( root_obj_prefix + root_obj_string + ";\n" )   
         
        #--------------------------------------------------------
        # Write all operations in quantity_fullname to TTL file
        #--------------------------------------------------------
        operation_list = quantity_part.split('_of_')
        n_operations   = len(operation_list) - 1     # (last one in list is the quantity)
        for k in xrange( n_operations ):
            operation = operation_list[k]
            op_string = " '" + operation + "' "
            op_prefix = indent + "csn:operation" + str(k+1)
            out_unit.write( op_prefix + op_string + ";\n" )
            
        #----------------------------------
        # Write quantity name to TTL file
        #----------------------------------            
        quantity = operation_list[-1]
        quan_string = " '" + quantity + "' "
        quan_prefix = indent + "csn:quantity"
        out_unit.write( quan_prefix + quan_string + ";\n" )
        
        #---------------------------------------
        # Write root quantity name to TTL file
        #--------------------------------------- 
        quantity_parts = quantity.split('_')
        root_quantity  = quantity_parts[-1]
        root_quan_string = " '" + root_quantity + "' "
        root_quan_prefix = indent + "csn:root_quantity"
        out_unit.write( root_quan_prefix + root_quan_string + ".\n" )  # (Notice "." vs. ";" here.)
        out_unit.write( '\n' )  # (blank line)
        root_quan_list.append( root_quantity )   # (save in root_quan_list) 
        n_names += 1

    #----------------------
    # Close the input file
    #----------------------
    in_unit.close()
    
    #----------------------------
    # Close the TXT output file
    #----------------------------
    out_unit.close()
    print 'Finished writing CSN var names as TTL.'
    print 'Number of names =', n_names, '.'
    print ' '

    #-----------------------------------------    
    # Write unique root quantities to a file
    #-----------------------------------------
    uniq_root_quan_list = sorted( set(root_quan_list) )
    n_uniq_root_quans = len( uniq_root_quan_list )
    root_quan_unit = open( 'Root_Quantities.txt', 'w' )
    for k in xrange( n_uniq_root_quans ):
        root_quantity = uniq_root_quan_list[k]
        root_quan_unit.write( root_quantity + '\n' )
    root_quan_unit.close()
    print 'Number of root quantities =', n_uniq_root_quans, '.'
    print ' '
                      
#   parse_names()
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
        parse_names( sys.argv[1] )
    else:
        print 'ERROR: Invalid number of arguments.'
        
#-----------------------------------------------------------------------
