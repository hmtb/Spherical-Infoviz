# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.8

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /Applications/CMake.app/Contents/bin/cmake

# The command to remove a file.
RM = /Applications/CMake.app/Contents/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build

# Include any dependencies generated for this target.
include AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/depend.make

# Include the progress variables for this target.
include AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/progress.make

# Include the compile flags for this target's objects.
include AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/flags.make

AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o: AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/flags.make
AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o: ../AlloSystem/alloaudio/unitTests/alloaudioTests.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o"
	cd /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/AlloSystem/alloaudio && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o -c /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio/unitTests/alloaudioTests.cpp

AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.i"
	cd /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/AlloSystem/alloaudio && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio/unitTests/alloaudioTests.cpp > CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.i

AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.s"
	cd /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/AlloSystem/alloaudio && /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio/unitTests/alloaudioTests.cpp -o CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.s

AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o.requires:

.PHONY : AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o.requires

AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o.provides: AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o.requires
	$(MAKE) -f AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/build.make AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o.provides.build
.PHONY : AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o.provides

AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o.provides.build: AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o


# Object files for target alloaudioTests
alloaudioTests_OBJECTS = \
"CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o"

# External object files for target alloaudioTests
alloaudioTests_EXTERNAL_OBJECTS =

bin/alloaudioTests: AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o
bin/alloaudioTests: AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/build.make
bin/alloaudioTests: lib/liballocore.a
bin/alloaudioTests: lib/liballoaudio.a
bin/alloaudioTests: /usr/local/lib/libGLEW.dylib
bin/alloaudioTests: /usr/local/lib/libfreetype.dylib
bin/alloaudioTests: /usr/local/lib/libfreeimage.dylib
bin/alloaudioTests: /usr/local/lib/libassimp.dylib
bin/alloaudioTests: /usr/lib/libapr-1.dylib
bin/alloaudioTests: /usr/local/lib/libportaudio.dylib
bin/alloaudioTests: /usr/local/lib/libportaudio.dylib
bin/alloaudioTests: /usr/local/lib/libsndfile.dylib
bin/alloaudioTests: lib/liballocore.a
bin/alloaudioTests: /usr/local/lib/libGLEW.dylib
bin/alloaudioTests: /usr/local/lib/libfreetype.dylib
bin/alloaudioTests: /usr/local/lib/libfreeimage.dylib
bin/alloaudioTests: /usr/local/lib/libassimp.dylib
bin/alloaudioTests: /usr/lib/libapr-1.dylib
bin/alloaudioTests: lib/libGamma.a
bin/alloaudioTests: /usr/local/lib/libportaudio.dylib
bin/alloaudioTests: /usr/local/lib/libsndfile.dylib
bin/alloaudioTests: AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Linking CXX executable ../../bin/alloaudioTests"
	cd /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/AlloSystem/alloaudio && $(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/alloaudioTests.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/build: bin/alloaudioTests

.PHONY : AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/build

AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/requires: AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/unitTests/alloaudioTests.cpp.o.requires

.PHONY : AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/requires

AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/clean:
	cd /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/AlloSystem/alloaudio && $(CMAKE_COMMAND) -P CMakeFiles/alloaudioTests.dir/cmake_clean.cmake
.PHONY : AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/clean

AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/depend:
	cd /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/AlloSystem/alloaudio /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : AlloSystem/alloaudio/CMakeFiles/alloaudioTests.dir/depend

