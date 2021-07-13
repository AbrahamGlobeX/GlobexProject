#ifndef TO_DOTTED_PATH_H
#define TO_DOTTED_PATH_H

#include <emscripten/val.h>
#include "BaseBlock.h"

class ToDottedPath : public BaseBlock
{
public:
    ToDottedPath(const emscripten::val &node);
    ~ToDottedPath() override {}
    void input0();
    void error();

private:
    bool getNextValue(const std::string &key, emscripten::val &value);
};

#endif // TO_DOTTED_PATH_H