
#ifndef __node_uuid_h__
#define __node_uuid_h__

#include <string>
#include <v8.h>
#include <node.h>
#include "uuid/uuid.h"

using namespace v8;
using namespace node;

// var uuid = new Uuid();
// var id = uuid.generate();
// var same = uuid.compare(id1, id2);
// var randomId = uuid.generateRandom();
// var timeId = uuid.generateTime();
class Uuid : public node::ObjectWrap {
    public:
        Uuid() { }
        static Persistent<FunctionTemplate> constructor;
        static void Init(Handle<Object> target);
        static Handle<Value> New(const Arguments &args);
        static Handle<Value> Generate(const Arguments &args);
        static Handle<Value> GenerateRandom(const Arguments &args);
        static Handle<Value> GenerateTime(const Arguments &args);
    private:   
        ~Uuid();
        static std::string GetString(uuid_t id);
};

#endif // __node_uuid_h__
