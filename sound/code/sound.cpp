#include <map>
#define AL_OSX
#include "Gamma/SamplePlayer.h"
#include "alloutil/al_AlloSphereAudioSpatializer.hpp"
#include <zmq.h>
#include <sys/time.h>
#include <mutex>

using namespace al;
using namespace std;
using namespace gam;

struct SampleSource {
    SamplePlayer<float, gam::ipl::Linear, phsInc::OneShot> samples;
    SoundSource source;
    bool added;
    double time_start;

    SampleSource(const char* filename) {
        samples.load(filename);
        added = false;
    }

    void setPosition(float x, float y, float z) {
      source.pos(x, y, z);
    }
};

struct Message {
  int type;
  int dummy;
  char filename[256];
  double current_time;
  double play_time;
  double x, y, z;
};

struct MyApp : AlloSphereAudioSpatializer {
  std::map<std::string, SampleSource*> sources;
  double time_offset = 0;
  double audio_engine_time = 0;
  double t0, time_diff;
  mutex mtx;

  MyApp() {
    AlloSphereAudioSpatializer::initAudio();
    AlloSphereAudioSpatializer::initSpatialization();

    AlloSphereAudioSpatializer::initAudio();
    AlloSphereAudioSpatializer::initSpatialization();
    gam::Sync::master().spu(AlloSphereAudioSpatializer::audioIO().fps());
    scene()->usePerSampleProcessing(false);

    // set the location of listener, add sound source
    listener()->pos(0, 0, 0);

    t0 = GetRAWTime();
    time_diff = 0;
  }

  double GetRAWTime() {
    struct timeval tv;
    gettimeofday(&tv, 0);
    return (double) tv.tv_usec / 1000 + tv.tv_sec * 1000;
  }

  double GetTime() {
    return GetRAWTime() - t0;
  }

  double GetAdjustedTime() {
    return GetTime() + time_diff;
  }

  void process(const Message& m) {
    mtx.lock();
    if(m.type == 0) {
      time_diff = m.current_time - GetTime();
    }
    if(m.type == 1) {
      time_diff = m.current_time - GetTime();
      SampleSource* src = new SampleSource(m.filename);
      sources[m.filename] = src;
      src->time_start = m.play_time;
      src->setPosition(m.x, m.y, m.z);
    }
    if(m.type == 2) {
      if(sources.find(m.filename) != sources.end()) {
        SampleSource* src = sources[m.filename];
        if(src->added) {
          scene()->removeSource(src->source);
        }
        delete src;
        sources.erase(m.filename);
      }
    }
    mtx.unlock();
  }

  virtual void onSound(AudioIOData& io) {
    int numFrames = io.framesPerBuffer();
    mtx.lock();
    for(auto kvpair : sources) {
      auto& item = kvpair.second;
      if(!item->samples.done()) {
        if(!item->added) {
          if(GetAdjustedTime() > item->time_start) {
            scene()->addSource(item->source);
            item->added = true;
          }
        }
        if(item->added) {
          for(int i = 0; i < numFrames; i++) {
            item->source.writeSample(item->samples());
          }
        }
      } else {
        scene()->removeSource(item->source);
        delete item;
        sources.erase(kvpair.first);
      }
    }
    mtx.unlock();
    scene()->render(io);
  }
};

int main() {
  MyApp app;
  app.AlloSphereAudioSpatializer::audioIO().start();  // start audio
  void* zctx = zmq_ctx_new();
  void* socket = zmq_socket(zctx, ZMQ_SUB);
  zmq_setsockopt(socket, ZMQ_SUBSCRIBE, "", 0);
  zmq_bind(socket, "tcp://0.0.0.0:50004");
  while(1) {
    zmq_msg_t msg;
    zmq_msg_init(&msg);
    zmq_msg_recv(&msg, socket, 0);
    const Message& m = *(Message*)zmq_msg_data(&msg);

    // cout << m.type << ": " << m.filename << " " << m.current_time << " " << m.play_time << ", " << m.x << ", " << m.y << ", " << m.z << endl;
    app.process(m);

    zmq_msg_close(&msg);
  }
}
