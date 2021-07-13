#ifndef BLOCKS_H
#define BLOCKS_H

#include <emscripten/val.h>
#include "BaseBlock.h"

class HandlerBlock : public BaseBlock
{
public:
    HandlerBlock(const emscripten::val &node);
    ~HandlerBlock() override {}

    void input0();

    bool isAddHandlerOk() override
    {
        return m_isAddHandlerOk;
    }

private:
    bool m_isAddHandlerOk = false;
};

class HandlerWithParams : public BaseBlock
{
public:
    HandlerWithParams(const emscripten::val &node);
    ~HandlerWithParams() override {}

    void input0(const emscripten::val &obj)
    {
        *((*m_outparams)[0]) = obj["value"];
    }

    bool isAddHandlerOk() override
    {
        return m_isAddHandlerOk;
    }

private:
    bool m_isAddHandlerOk = false;
};

class CompareBlock : public BaseBlock
{
public:
    CompareBlock(const emscripten::val &node) : BaseBlock(node)
    {
        makeInput(&CompareBlock::input0, 0);
    }
    ~CompareBlock() override {}

    enum class ExitName : int {
        _then = 0,
        _else
    };

    int exitIndex(ExitName name)
    {
        return static_cast<int>(name);
    }

    void input0()
    {   
        if (((*m_inparams)[2])->as<std::string>() == "==" && *(*m_inparams)[0]/*->as<int>()*/ == *(*m_inparams)[1]/*->as<int>()*/) {
            setOutFlowFunc(exitIndex(ExitName::_then));
        } else if (((*m_inparams)[2])->as<std::string>() == "<" && *(*m_inparams)[0]/*->as<int>()*/ < *(*m_inparams)[1]/*->as<int>()*/) {
            setOutFlowFunc(exitIndex(ExitName::_then));
        } else if ((*m_inparams)[2]->as<std::string>() == ">" && *(*m_inparams)[0]/*->as<int>()*/ > *(*m_inparams)[1]/*->as<int>()*/) {
            setOutFlowFunc(exitIndex(ExitName::_then));
        } else if ((*m_inparams)[2]->as<std::string>() == "<=" && *(*m_inparams)[0]/*->as<int>()*/ <= *(*m_inparams)[1]/*->as<int>()*/) {
            setOutFlowFunc(exitIndex(ExitName::_then));
        } else if ((*m_inparams)[2]->as<std::string>() == ">=" && *(*m_inparams)[0]/*->as<int>()*/ >= *(*m_inparams)[1]/*->as<int>()*/) {
            setOutFlowFunc(exitIndex(ExitName::_then));
        } else if ((*m_inparams)[2]->as<std::string>() == "!=" && *(*m_inparams)[0]/*->as<int>()*/ != *(*m_inparams)[1]/*->as<int>()*/) {
            setOutFlowFunc(exitIndex(ExitName::_then));
        }
        else {
            setOutFlowFunc(exitIndex(ExitName::_else));
        }

        // log("CompareBlockID: " + std::to_string(getId()));
    }

};

class IncrementBlock : public BaseBlock
{
public:
    IncrementBlock(const emscripten::val &node) : BaseBlock(node)
    {
        makeInput(&IncrementBlock::input0, 0);
    }
    ~IncrementBlock() override {}

    void input0();
};

class LogToConsoleBlock : public BaseBlock
{

public:
    LogToConsoleBlock(const emscripten::val &node) : BaseBlock(node)
    {
        makeInput(&LogToConsoleBlock::input0, 0);
    }

    ~LogToConsoleBlock() override {}

    void input0()
    {
        log("LOGGER BEGIN");
        if ((*m_inparams)[0]->isString()) {
            log((*m_inparams)[0]->as<std::string>());
            return;
        }

        if ((*m_inparams)[0]->isNumber()) {
            log((*m_inparams)[0]->as<int>());
            return;
        }

        logerror("Unsupported type for logging. Need string or number. Node id: " 
                                                                + std::to_string(getId()));
    }
};

class DecrementBlock : public BaseBlock
{

public:
    DecrementBlock(const emscripten::val &node) : BaseBlock(node)
    {
        makeInput(&DecrementBlock::input0, 0);
    }
    ~DecrementBlock() override {}

    void input0();
};

class FromStoreElement : public BaseBlock
{
public:
    FromStoreElement(const emscripten::val &node);
    ~FromStoreElement() override {}

private:
};

class ToStoreElement : public BaseBlock
{
public:
    ToStoreElement(const emscripten::val &node);
    ~ToStoreElement() override {}

private:
};

class NodeFor : public BaseBlock
{
public:
    NodeFor(const emscripten::val &node) : BaseBlock(node)
    { 
        makeInput(&NodeFor::input0, 0);
        makeFinal(&NodeFor::inBreak, 1);
    }

    void input0()
    {
		m_break = false;
        size_t mutCount = (*m_inparams)[1]->as<size_t>();
        int index = (*m_inparams)[0]->as<int>();
        while (mutCount--) {
            *((*m_outparams)[0]) = emscripten::val(index++);
            call(1);
			if (m_break) {
				break;
			}
        }
    }

    void inBreak()
    {
		m_break = true;
    }

    ~NodeFor() override 
    {}

private:
	bool m_break = false;
};


#endif // BLOCKS_H