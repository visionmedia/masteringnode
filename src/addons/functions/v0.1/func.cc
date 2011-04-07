#include <v8.h>
#include <node.h>

using namespace v8;  

static Handle<Value> Echo(const Arguments& args) {
  HandleScope scope;

  if (args.Length() < 1) {
    return ThrowException(Exception::TypeError(String::New("Bad argument")));
  }
  return scope.Close(args[0]);
}

extern "C" void
init (Handle<Object> target)
{
    HandleScope scope;
    
    target->Set(String::New("version"), String::New("0.1"));
    
    NODE_SET_METHOD(target, "echo", Echo);
}
