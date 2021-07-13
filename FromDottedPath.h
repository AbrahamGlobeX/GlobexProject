#ifndef FROM_DOTTED_PATH_H
#define FROM_DOTTED_PATH_H

#include <emscripten/val.h>
#include "BaseBlock.h"

class FromDottedPath : public BaseBlock
{
public:
    FromDottedPath(const emscripten::val &node);
    ~FromDottedPath() override {}

    void input0();
    void error();

private:
    bool getNextValue(const std::string &key, emscripten::val &value);
};

#endif // FROM_DOTTED_PATH_H