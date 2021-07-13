#ifndef DISPATСHER_H
#define DISPATСHER_H

#include <emscripten/val.h>

#include <string>
#include <map>
#include <functional>
#include <vector>

#include "Log.h"

class BaseBlock;

class Dispatcher
{
public:
    Dispatcher() {}

    bool addHandler(const std::string &eventname,
            const std::function<void()> &func,
            BaseBlock *node);

    bool addHandler(const std::string &eventname,
            const std::function<void(const emscripten::val &)> &func);
            
    bool addHandlerWithParams(const std::string &eventname,
							const std::function<void(const emscripten::val &)> &func,
							BaseBlock *node);

    void dispatch(const emscripten::val &obj);

    void clear() {
        m_handler.clear();
    }

private:
    std::map<std::string, std::function<void(const emscripten::val &)>> m_handler;
};

#endif // DISPATСHER_H