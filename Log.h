#ifndef LOG_H
#define LOG_H

#include <emscripten/val.h>

#include <string>

template<typename T>
void log(const T &msg)
{
    emscripten::val console = emscripten::val::global("console");
    console.call<void>("log", emscripten::val(msg));
}

template<typename T>
void warning(const T &msg)
{
    emscripten::val console = emscripten::val::global("console");
    console.call<void>("warn", emscripten::val(msg));
}

template<typename T>
void logerror(const T &msg)
{
    emscripten::val console = emscripten::val::global("console");
    console.call<void>("error", emscripten::val(msg));
}

#endif // LOG_H