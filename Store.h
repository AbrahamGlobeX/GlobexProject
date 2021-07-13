#ifndef STORE_H
#define STORE_H

#include <emscripten/val.h>

#include <string>
#include <memory>
#include <map>
#include <utility>

#include "Log.h"
#include "FlowCompiler.h"

// struct AllData
// {
//     std::string name;
//     std::string city;
//     int val;
// };

class Dispatcher;

class Store
{
private:
    std::unique_ptr<Dispatcher> m_dispatcher;
    std::unique_ptr<FlowCompiler> m_flowCompiler;
    bool m_isAppendBlocked = false;
    // AllData m_data;

    static Store &instance() {
        static Store store;
        return store;
    }

    void init() {
      applyHandlers();
    //   m_store["name1"] = std::make_shared<emscripten::val>("1");
    //   m_store["city1"] = std::make_shared<emscripten::val>(" ");
    //   m_store["val1"] = std::make_shared<emscripten::val>(0);
    //   m_store["valA"] = std::make_shared<emscripten::val>(1);
    //   m_store["valB"] = std::make_shared<emscripten::val>(8);
    //   m_store["from"] = std::make_shared<emscripten::val>(5);
    //   m_store["count"] = std::make_shared<emscripten::val>(10);
      
      //emscripten::val val = emscripten::val::object();
      //emscripten::val innerVal = emscripten::val::object();
      //emscripten::val arrayVal = emscripten::val::array();
      instance().setJsStore();
    }

    Store() : 
        m_dispatcher(std::make_unique<Dispatcher>()),
        m_flowCompiler(std::make_unique<FlowCompiler>()),
        m_JsStore(emscripten::val::object())
    {
        init();
    }

    void applyHandlers();

    static void unlockAppending()
    {
        instance().m_isAppendBlocked = false;
    };

    void clearStore()
    {
        instance().m_store.clear();
        instance().setJsStore();
    }

public:
    ~Store() {}

    using mapstore = std::map<std::string, std::shared_ptr<emscripten::val>>;
    mapstore m_store;
    emscripten::val m_JsStore;

    static emscripten::val getAll()
    {
        return instance().m_JsStore;
    }

    void setJsStore()
    {
        m_JsStore = emscripten::val::object();
        for (auto &elem : instance().m_store) {
            m_JsStore.set(elem.first, *elem.second);
        }
    }

    static int resetAll()
    {
        unlockAppending();
        instance().clearStore();
        instance().m_flowCompiler->clearAndCheck();
        instance().m_dispatcher->clear();
        instance().init();
        return 0;
    }

    // true if is appended
    static bool appendElement(const std::string &name, const emscripten::val &elem)
    {
        if (instance().m_isAppendBlocked) return false;

        auto &store = getMapStore();
        bool result = false;
        if (const auto it = store.find(name); it == store.end()) {
            store[name] = std::make_shared<emscripten::val>(elem);
            result = true;
        }

        return result;
    }

    // Нельзя добавлять новые элементы в хранилище после того как скрипт загружен.
    static void lockAppending()
    {
        instance().m_isAppendBlocked = true;
    };

    static mapstore &getMapStore() { return instance().m_store; }
    // static void incVal() { instance().m_data.val ++; }
    // static void decVal() { instance().m_data.val --; }
    // static AllData &getAllData() { return instance().m_data; }
    static void emitChange()
    {
        using namespace emscripten;

        instance().setJsStore();
        val event = val::global("Event");
        event.call<void>("trigger", val("change"));
    }

    static FlowCompiler &getFlowCompiler()
    {
        return *(instance().m_flowCompiler);
    }

    static Dispatcher &getDispatcher()
    {
        return *(instance().m_dispatcher);
    }

    static void dispatch(emscripten::val obj);
    static emscripten::val renumber(emscripten::val flost);

protected:    
};

#endif // STORE_H