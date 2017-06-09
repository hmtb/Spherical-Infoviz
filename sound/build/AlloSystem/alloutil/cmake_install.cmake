# Install script for directory: /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil

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
   "/usr/local/include/al_AlloSphere.hpp;/usr/local/include/al_AlloSphereAudioSpatializer.hpp;/usr/local/include/al_AlloSphereSpeakerLayout.hpp;/usr/local/include/al_AudioRenderer.hpp;/usr/local/include/al_CubeMapFBO.hpp;/usr/local/include/al_FPS.hpp;/usr/local/include/al_Field3D.hpp;/usr/local/include/al_FileWatcher.hpp;/usr/local/include/al_FrameBufferGL.hpp;/usr/local/include/al_InterfaceServerClient.hpp;/usr/local/include/al_Lua.hpp;/usr/local/include/al_Navigator.hpp;/usr/local/include/al_OITFbo.hpp;/usr/local/include/al_OmniApp.hpp;/usr/local/include/al_OmniStereo.hpp;/usr/local/include/al_OmniStereoGraphicsRenderer.hpp;/usr/local/include/al_OverlayTextGL.hpp;/usr/local/include/al_RayApp.hpp;/usr/local/include/al_RayCastingGraphicsRenderer.hpp;/usr/local/include/al_RayStereo.hpp;/usr/local/include/al_ResourceManager.hpp;/usr/local/include/al_ShaderManager.hpp;/usr/local/include/al_ShotList.hpp;/usr/local/include/al_Simulator.hpp;/usr/local/include/al_TextureGL.hpp;/usr/local/include/al_VCR.hpp;/usr/local/include/al_VoxelStack.hpp;/usr/local/include/al_WarpBlend.hpp")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
file(INSTALL DESTINATION "/usr/local/include" TYPE FILE FILES
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_AlloSphere.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_AlloSphereAudioSpatializer.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_AlloSphereSpeakerLayout.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_AudioRenderer.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_CubeMapFBO.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_FPS.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_Field3D.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_FileWatcher.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_FrameBufferGL.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_InterfaceServerClient.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_Lua.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_Navigator.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_OITFbo.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_OmniApp.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_OmniStereo.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_OmniStereoGraphicsRenderer.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_OverlayTextGL.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_RayApp.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_RayCastingGraphicsRenderer.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_RayStereo.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_ResourceManager.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_ShaderManager.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_ShotList.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_Simulator.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_TextureGL.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_VCR.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_VoxelStack.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/alloutil/alloutil/al_WarpBlend.hpp"
    )
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/usr/local/lib/liballoutil.a")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
file(INSTALL DESTINATION "/usr/local/lib" TYPE STATIC_LIBRARY FILES "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/lib/liballoutil.a")
  if(EXISTS "$ENV{DESTDIR}/usr/local/lib/liballoutil.a" AND
     NOT IS_SYMLINK "$ENV{DESTDIR}/usr/local/lib/liballoutil.a")
    execute_process(COMMAND "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ranlib" "$ENV{DESTDIR}/usr/local/lib/liballoutil.a")
  endif()
endif()

