#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>

#include <string>
#include <map>
#include <functional>
#include <vector>
#include <memory>

using namespace emscripten;
//---------------------------

#include "Store.h"
#include "Dispatcher.h"

#ifdef __cplusplus
extern "C" {
#endif

// Binding code
EMSCRIPTEN_BINDINGS(store_class) {
  // value_object<AllData>("AllData")
    // .field("name", &AllData::name)
    // .field("city", &AllData::city)
    // .field("val", &AllData::val)
    // ;
  class_<Store>("Store")
    // .constructor<>()
    //.function("incVal", &Store::incVal)
    // .class_function("incVal", &Store::incVal)
    // .class_function("getAllData", &Store::getAllData)
    .class_function("getAll", &Store::getAll)
    .class_function("dispatch", &Store::dispatch)
    .class_function("appendElement", &Store::appendElement)
    .class_function("resetAll", &Store::resetAll)
    .class_function("renumber", &Store::renumber)
    // .property("name", &Store::getName, &Store::setName)
    ;
}

#ifdef __cplusplus
}
#endif

// int main()
// {
//     return 0;
// }