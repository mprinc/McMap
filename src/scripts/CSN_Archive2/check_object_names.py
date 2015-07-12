#!/usr/bin/env python

# Copyright (c) 2015, Scott D. Peckham

#------------------------------------------------------
# S.D. Peckham
# July 9, 2015
#
# Tool to extract the object part of every CSDMS Standard
# Variable Name and generate a list of objects that
# includes those as well as all parent objects.
#
# Example of use at a Unix prompt:
#
#    % ./check_object_names.py CSN_VarNames_v0.83.txt
#------------------------------------------------------
#
# Functions:
#    check_objects()
#
#------------------------------------------------------

import os.path
import sys

#------------------------------------------------------
def check_objects( in_file='CSN_VarNames_v0.83.txt' ):

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
    out_file = 'All_Object_Names_v0.83.txt'
    #-------------------------------------------
    OUT_EXISTS = os.path.exists( out_file )
    if (OUT_EXISTS):
        print 'SORRY, A text file with the name'
        print '       ' + out_file
        print '       already exists.'
        return
    out_unit = open( out_file, 'w' )

    #---------------------------    
    # Parse all variable names
    #---------------------------
    n_objects = 0
    object_list1 = list()
    object_list2 = list()
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
        main_parts = line.split('__')
        object_fullname   = main_parts[0]
        # quantity_fullname = main_parts[1]

        #------------------------------------   
        # Append object name to object_list
        #------------------------------------
        object_list1.append( object_fullname )
        object_list2.append( object_fullname )

        #------------------------------------------------        
        # Append all parent object names to object_list
        #------------------------------------------------
        object_name = object_fullname
        while (True):
            pos = object_name.rfind('_')
            if (pos < 0):
                break    
            object_name = object_name[:pos]
            object_list2.append( object_name )

    #---------------------------------------------
    # Create sorted lists of unique object names
    # Not fastest method, but simple.
    #---------------------------------------------
    old_list   = sorted( set(object_list1) )
    new_list   = sorted( set(object_list2) )
    n_objects1 = len( old_list )
    n_objects2 = len( new_list ) 
  
    #--------------------------------------------
    # Write complete object list to output file
    #--------------------------------------------
    for k in xrange( n_objects2 ):
        out_unit.write( new_list[k] + '\n' )

    #----------------------
    # Close the input file
    #----------------------
    in_unit.close()
    
    #----------------------------
    # Close the TXT output file
    #----------------------------
    out_unit.close()
    print 'Finished checking all object names.'
    print 'Number of old object names =', n_objects1, '.'
    print 'Number of new object names =', n_objects2, '.'
    print ' '
                           
#   check_objects()
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
        check_objects( sys.argv[1] )
    else:
        print 'ERROR: Invalid number of arguments.'
        
#-----------------------------------------------------------------------
