# Install script for directory: /Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore

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
   "/usr/local/include/al_Allocore.hpp;/usr/local/include/al_Mesh.hpp;/usr/local/include/al_MeshVBO.hpp;/usr/local/include/al_Shapes.hpp;/usr/local/include/al_Image.hpp;/usr/local/include/al_EasyFBO.hpp;/usr/local/include/al_AudioIOData.hpp;/usr/local/include/al_HID.hpp;/usr/local/include/al_MIDI.hpp;/usr/local/include/al_Serial.hpp;/usr/local/include/al_CSVReader.hpp;/usr/local/include/al_Analysis.hpp;/usr/local/include/al_Complex.hpp;/usr/local/include/al_Constants.hpp;/usr/local/include/al_Frustum.hpp;/usr/local/include/al_Functions.hpp;/usr/local/include/al_Interpolation.hpp;/usr/local/include/al_Interval.hpp;/usr/local/include/al_Mat.hpp;/usr/local/include/al_Matrix4.hpp;/usr/local/include/al_Plane.hpp;/usr/local/include/al_Quat.hpp;/usr/local/include/al_Random.hpp;/usr/local/include/al_Ray.hpp;/usr/local/include/al_Spherical.hpp;/usr/local/include/al_Vec.hpp;/usr/local/include/al_Serialize.h;/usr/local/include/al_Serialize.hpp;/usr/local/include/al_Curve.hpp;/usr/local/include/al_DistAtten.hpp;/usr/local/include/al_HashSpace.hpp;/usr/local/include/al_Pose.hpp;/usr/local/include/al_Config.h;/usr/local/include/al_Info.hpp;/usr/local/include/al_PeriodicThread.hpp;/usr/local/include/al_Printing.hpp;/usr/local/include/al_Thread.hpp;/usr/local/include/al_Watcher.hpp;/usr/local/include/pstdint.h;/usr/local/include/al_Array.h;/usr/local/include/al_Array.hpp;/usr/local/include/al_Buffer.hpp;/usr/local/include/al_Color.hpp;/usr/local/include/al_Conversion.hpp;/usr/local/include/al_MsgQueue.hpp;/usr/local/include/al_MsgTube.hpp;/usr/local/include/al_SingleRWRingBuffer.hpp;/usr/local/include/al_Voxels.hpp;/usr/local/include/al_Gnomon.hpp;/usr/local/include/al_BoundingBox.hpp;/usr/local/include/al_Pickable.hpp;/usr/local/include/al_TranslateHandle.hpp;/usr/local/include/al_RotateHandle.hpp;/usr/local/include/al_BufferObject.hpp;/usr/local/include/al_DisplayList.hpp;/usr/local/include/al_FBO.hpp;/usr/local/include/al_GPUObject.hpp;/usr/local/include/al_Graphics.hpp;/usr/local/include/al_Isosurface.hpp;/usr/local/include/al_Lens.hpp;/usr/local/include/al_Light.hpp;/usr/local/include/al_OpenGL.hpp;/usr/local/include/al_Shader.hpp;/usr/local/include/al_Slab.hpp;/usr/local/include/al_Stereographic.hpp;/usr/local/include/al_Texture.hpp;/usr/local/include/al_MeshVBO.hpp;/usr/local/include/al_App.hpp;/usr/local/include/al_ControlNav.hpp;/usr/local/include/al_RenderToDisk.hpp;/usr/local/include/al_Window.hpp;/usr/local/include/al_MainLoop.hpp;/usr/local/include/al_Font.hpp;/usr/local/include/al_Image.hpp;/usr/local/include/al_Asset.hpp;/usr/local/include/al_File.hpp;/usr/local/include/al_Socket.hpp;/usr/local/include/al_Memory.hpp;/usr/local/include/al_Time.h;/usr/local/include/al_Time.hpp;/usr/local/include/al_AudioIO.hpp;/usr/local/include/al_Ambisonics.hpp;/usr/local/include/al_AudioScene.hpp;/usr/local/include/al_Crossover.hpp;/usr/local/include/al_Dbap.hpp;/usr/local/include/al_Reverb.hpp;/usr/local/include/al_Speaker.hpp;/usr/local/include/al_Vbap.hpp;/usr/local/include/al_Biquad.hpp;/usr/local/include/al_Crossover.hpp;/usr/local/include/al_Speaker.hpp;/usr/local/include/al_StereoPanner.hpp;/usr/local/include/al_OSC.hpp;/usr/local/include/al_Parameter.hpp;/usr/local/include/al_Preset.hpp;/usr/local/include/al_HtmlInterfaceServer.hpp;/usr/local/include/al_ParameterMIDI.hpp;/usr/local/include/al_PresetMIDI.hpp;/usr/local/include/al_PresetSequencer.hpp;/usr/local/include/al_SequenceRecorder.hpp;/usr/local/include/al_Composition.hpp;/usr/local/include/al_PresetMapper.hpp;/usr/local/include/al_Zeroconf.hpp")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
file(INSTALL DESTINATION "/usr/local/include" TYPE FILE FILES
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/al_Allocore.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Mesh.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_MeshVBO.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Shapes.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Image.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_EasyFBO.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/io/al_AudioIOData.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/io/al_HID.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/io/al_MIDI.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/io/al_Serial.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/io/al_CSVReader.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Analysis.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Complex.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Constants.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Frustum.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Functions.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Interpolation.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Interval.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Mat.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Matrix4.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Plane.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Quat.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Random.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Ray.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Spherical.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/math/al_Vec.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/protocol/al_Serialize.h"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/protocol/al_Serialize.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/spatial/al_Curve.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/spatial/al_DistAtten.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/spatial/al_HashSpace.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/spatial/al_Pose.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/system/al_Config.h"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/system/al_Info.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/system/al_PeriodicThread.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/system/al_Printing.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/system/al_Thread.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/system/al_Watcher.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/system/pstdint.h"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/types/al_Array.h"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/types/al_Array.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/types/al_Buffer.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/types/al_Color.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/types/al_Conversion.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/types/al_MsgQueue.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/types/al_MsgTube.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/types/al_SingleRWRingBuffer.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/types/al_Voxels.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_Gnomon.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_BoundingBox.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_Pickable.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_TranslateHandle.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_RotateHandle.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_BufferObject.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_DisplayList.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_FBO.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_GPUObject.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Graphics.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Isosurface.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Lens.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Light.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_OpenGL.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Shader.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Slab.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Stereographic.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Texture.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_MeshVBO.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/io/al_App.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/io/al_ControlNav.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/io/al_RenderToDisk.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/io/al_Window.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/system/al_MainLoop.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Font.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Image.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/graphics/al_Asset.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/io/al_File.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/io/al_Socket.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/system/al_Memory.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/system/al_Time.h"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/system/al_Time.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/io/al_AudioIO.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/sound/al_Ambisonics.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/sound/al_AudioScene.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/sound/al_Crossover.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/sound/al_Dbap.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/sound/al_Reverb.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/sound/al_Speaker.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/sound/al_Vbap.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/sound/al_Biquad.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/sound/al_Crossover.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/sound/al_Speaker.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/sound/al_StereoPanner.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/protocol/al_OSC.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_Parameter.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_Preset.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_HtmlInterfaceServer.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_ParameterMIDI.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_PresetMIDI.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_PresetSequencer.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_SequenceRecorder.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_Composition.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/ui/al_PresetMapper.hpp"
    "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/AlloSystem/allocore/allocore/protocol/al_Zeroconf.hpp"
    )
endif()

if("${CMAKE_INSTALL_COMPONENT}" STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/usr/local/lib/liballocore.a")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
file(INSTALL DESTINATION "/usr/local/lib" TYPE STATIC_LIBRARY FILES "/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/lib/liballocore.a")
  if(EXISTS "$ENV{DESTDIR}/usr/local/lib/liballocore.a" AND
     NOT IS_SYMLINK "$ENV{DESTDIR}/usr/local/lib/liballocore.a")
    execute_process(COMMAND "/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/ranlib" "$ENV{DESTDIR}/usr/local/lib/liballocore.a")
  endif()
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/Users/martin/Documents/Spherical-InfoViz/SphericalInfoviz/sound/build/AlloSystem/allocore/unitTests/cmake_install.cmake")

endif()

