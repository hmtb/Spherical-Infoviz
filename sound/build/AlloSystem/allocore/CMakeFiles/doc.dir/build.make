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

# Utility rule file for doc.

# Include the progress variables for this target.
include AlloSystem/allocore/CMakeFiles/doc.dir/progress.make

AlloSystem/allocore/CMakeFiles/doc:
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --blue --bold --progress-dir=/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Generate doxygen documentation"
	cd /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/doc && doxygen Doxyfile

doc: AlloSystem/allocore/CMakeFiles/doc
doc: AlloSystem/allocore/CMakeFiles/doc.dir/build.make

.PHONY : doc

# Rule to build all files generated by this target.
AlloSystem/allocore/CMakeFiles/doc.dir/build: doc

.PHONY : AlloSystem/allocore/CMakeFiles/doc.dir/build

AlloSystem/allocore/CMakeFiles/doc.dir/clean:
	cd /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/AlloSystem/allocore && $(CMAKE_COMMAND) -P CMakeFiles/doc.dir/cmake_clean.cmake
.PHONY : AlloSystem/allocore/CMakeFiles/doc.dir/clean

AlloSystem/allocore/CMakeFiles/doc.dir/depend:
	cd /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/AlloSystem/allocore /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/AlloSystem/allocore/CMakeFiles/doc.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : AlloSystem/allocore/CMakeFiles/doc.dir/depend

