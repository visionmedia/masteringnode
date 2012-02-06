#include <v8.h>
#include <node.h>
#include "./uuid.h"
#include "uuid/uuid.h"

using namespace v8;
using namespace node;

Persistent<FunctionTemplate> Uuid::constructor;

std::string 
Uuid::GetString(uuid_t id) {
    char buffer[40];
    int i=0, j=0;

    for(; i<(int)sizeof(uuid_t);i++) {
        sprintf( buffer+j, "%02x",id[i] );
        j+=2;
        if( i==3 || i==5 || i==7 || i==9 ) {
            *(buffer+j) = '-';
            j++;
        }
    }

    std::string uuid = buffer;
    return uuid;
}

// Initialize
void 
Uuid::Init(Handle<Object> target) {
    HandleScope scope;

    // Setup the constructor
    constructor = Persistent<FunctionTemplate>::New(FunctionTemplate::New(Uuid::New));
    constructor->InstanceTemplate()->SetInternalFieldCount(1); // for constructors
    constructor->SetClassName(String::NewSymbol("Uuid"));

    // Setup the prototype
    NODE_SET_PROTOTYPE_METHOD(constructor, "generate", Generate);
    NODE_SET_PROTOTYPE_METHOD(constructor, "generateRandom", GenerateRandom);
    NODE_SET_PROTOTYPE_METHOD(constructor, "generateTime", GenerateTime);

    target->Set(String::NewSymbol("Uuid"), constructor->GetFunction());
}

Handle<Value> 
Uuid::New(const Arguments &args) {
    HandleScope scope;
    // no args are checked
    Uuid *uuid = new Uuid();
    uuid->Wrap(args.This());
    return args.This();
}

Uuid::~Uuid() {
    // Perform cleanup
}

Handle<Value>
Uuid::Generate(const Arguments &args) {
    HandleScope scope;
    uuid_t id;
    uuid_generate(id);

    Uuid *uuid = ObjectWrap::Unwrap<Uuid>(args.This());
    return scope.Close(String::New(uuid->GetString(id).c_str()));
}

Handle<Value>
Uuid::GenerateRandom(const Arguments &args) {
    HandleScope scope;
    uuid_t id;
    uuid_generate_random(id);

    Uuid *uuid = ObjectWrap::Unwrap<Uuid>(args.This());
    return scope.Close(String::New(uuid->GetString(id).c_str()));
}

Handle<Value>
Uuid::GenerateTime(const Arguments &args) {
    HandleScope scope;
    uuid_t id;
    uuid_generate_time(id);

    Uuid *uuid = ObjectWrap::Unwrap<Uuid>(args.This());
    return scope.Close(String::New(uuid->GetString(id).c_str()));
}

extern "C" void 
init(Handle<Object> target) 
{
    HandleScope scope;
    
    // Doing this allows us to include multiple modules in a single package
    // e.g. var Uuid = require('uuid').Uuid;
    Uuid::Init(target);

    // Set any "package-level" properties
    target->Set(String::New("version"), String::New("0.1"));
}
