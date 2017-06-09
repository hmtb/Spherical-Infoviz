# CMake generated Testfile for 
# Source directory: /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/unitTests
# Build directory: /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/AlloSystem/allocore/unitTests
# 
# This file includes the relevant testing commands required for 
# testing this directory and lists subdirectories to be tested as well.
add_test(allocoreTests "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/bin/allocoreTests")
set_tests_properties(allocoreTests PROPERTIES  DEPENDS "allocore")
add_test(memcheck_allocoreTests "MEMORYCHECK_COMMAND-NOTFOUND" "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/bin/allocoreTests" "--tool=memcheck --trace-children=yes --leak-check=full" "--suppressions=/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/valgrind_suppress.txt")
