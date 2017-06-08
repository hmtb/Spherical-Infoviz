cmake_minimum_required (VERSION 2.8)
project (SphericalInfoVisSound)

set(BUILD_ROOT_DIR "${CMAKE_SOURCE_DIR}")

add_subdirectory(AlloSystem)

include_directories(
    Gamma
    AlloSystem/allocore
    AlloSystem/alloutil
)

add_executable(SphericalInfoVisSound
    code/sound.cpp
)

target_link_libraries(
    SphericalInfoVisSound
    Gamma
    allocore
    alloutil
    zmq
)
