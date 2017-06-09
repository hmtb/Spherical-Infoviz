# CMake generated Testfile for 
# Source directory: /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio
# Build directory: /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/AlloSystem/alloaudio
# 
# This file includes the relevant testing commands required for 
# testing this directory and lists subdirectories to be tested as well.
add_test(alloaudioTests "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/bin/alloaudioTests")
add_test(memcheck_alloaudioTests "MEMORYCHECK_COMMAND-NOTFOUND" "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/bin/alloaudioTests" "--tool=memcheck --trace-children=yes --leak-check=full" "--suppressions=/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/valgrind_suppress.txt")
