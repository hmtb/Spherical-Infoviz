cmake_minimum_required (VERSION 2.8)
project (SphericalInfoVisSound)

set(BUILD_ROOT_DIR "${CMAKE_SOURCE_DIR}")
SET ( CMAKE_CXX_FLAGS "-std=c++11 ${CMAKE_CXX_FLAGS}" )

add_subdirectory(AlloSystem)

include_directories(
    Gamma
    AlloSystem/allocore
    AlloSystem/alloutil
)

add_executable(SphericalInfoVisSound
    code/sound.cpp
)

include_directories ( /usr/local/include )

target_link_libraries(
    SphericalInfoVisSound
    Gamma
    allocore
    alloutil
    /usr/local/lib/libzmq.dylib
)
