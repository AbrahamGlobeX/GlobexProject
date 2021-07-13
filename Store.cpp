#include "Dispatcher.h"
#include "Store.h"
#include "Log.h"
#include "BaseBlock.h"

using namespace emscripten;

#include <string>

void Store::dispatch(val obj) 
{
    instance().m_dispatcher->dispatch(obj);
}

void scriptHandler(const val &obj)
{
    FlowCompiler &flowCompiler = Store::getFlowCompiler();
    flowCompiler.loadScript(obj);
    Store::lockAppending();
}
    // m_isAppendBlocked = true;

void Store::applyHandlers()
{
    m_dispatcher->addHandler("load-script", scriptHandler);

    m_dispatcher->addHandler("change-name", [](const val &obj){
        val name = obj["name"];
        
        auto &store = Store::getMapStore();
        auto itName = store.find("name1");
        if (store.end() != itName) {
            (*itName->second) = name;
        }
        // Store::getAllData().name = name.as<std::string>();
        Store::emitChange();
    });
    
    // m_dispatcher->addHandler("change-on-BTN", [](const val &obj){
    //     Store::incVal();
    //     Store::emitChange();
    // });

    // m_dispatcher->addHandler("decrement", [](const val &obj){
    //     Store::decVal();
    //     Store::emitChange();
    // });
    
    m_dispatcher->addHandler("change-ninput", [](const val &obj){
        val value = obj["val"];
        std::string strval = value.as<std::string>();
        
        auto &store = Store::getMapStore();
        auto itVal = store.find("val1");
        if (store.end() == itVal) {
            return;
        }

        if (!strval.size()) {
        (*itVal->second) = emscripten::val(0);
        Store::emitChange();
        return;
        }
        
        int nval = 0;
        
        try {
            nval = std::stoi(strval);
        }
        catch (const std::invalid_argument &e) {
            log(e.what());
        }
        catch (const std::out_of_range &e) {
            log(e.what());
        }

        if ( -1 < nval && nval < 9999999 ) {
        // Store::getAllData().val = nval;
            (*itVal->second) = emscripten::val(nval);
            Store::emitChange();
        }
        else {
        log("Invalid interval");
        }
    });
    
}

emscripten::val Store::renumber(emscripten::val flost)
{
	val str = val::global("JSON").call<val>("stringify", flost);
	val script = val::global("JSON").call<val>("parse", str);

    std::map<val, int> ndxMap;
    int counter = 1;

    auto nodes = vecFromJSArray<val>(script["nodes"]);
    for (val &jnode: nodes) {
        ndxMap[jnode["id"]] = counter;
        jnode.set("id", counter);
        ++counter;
    }

    auto connections = vecFromJSArray<val>(script["connections"]);
    for (val &connection: connections) {
        auto src = connection["source"];
        auto dst = connection["dest"];
        src.set("nodeID", ndxMap[src["nodeID"]]);
        dst.set("nodeID", ndxMap[dst["nodeID"]]);
    }

    return script;
}
