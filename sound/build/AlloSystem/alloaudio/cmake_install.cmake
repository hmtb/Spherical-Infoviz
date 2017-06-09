# Install script for directory: /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/usr/local")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/usr/local/include/al_AmbiFilePlayer.hpp;/usr/local/include/al_AmbiTunedDecoder.hpp;/usr/local/include/al_AmbisonicsConfig.hpp;/usr/local/include/al_Convolver.hpp;/usr/local/include/al_Decorrelation.hpp;/usr/local/include/al_OutputMaster.hpp;/usr/local/include/al_SoundfileBuffered.hpp;/usr/local/include/butter.h")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
file(INSTALL DESTINATION "/usr/local/include" TYPE FILE FILES
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio/alloaudio/al_AmbiFilePlayer.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio/alloaudio/al_AmbiTunedDecoder.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio/alloaudio/al_AmbisonicsConfig.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio/alloaudio/al_Convolver.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio/alloaudio/al_Decorrelation.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio/alloaudio/al_OutputMaster.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio/alloaudio/al_SoundfileBuffered.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloaudio/alloaudio/butter.h"
    )
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/usr/local/lib/liballoaudio.a")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
file(INSTALL DESTINATION "/usr/local/lib" TYPE STATIC_LIBRARY FILES "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/lib/liballoaudio.a")
  if(EXISTS "$ENV{DESTDIR}/usr/local/lib/liballoaudio.a" AND
     NOT IS_SYMLINK "$ENV{DESTDIR}/usr/local/lib/liballoaudio.a")
    execute_process(COMMAND "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ranlib" "$ENV{DESTDIR}/usr/local/lib/liballoaudio.a")
  endif()
endif()

