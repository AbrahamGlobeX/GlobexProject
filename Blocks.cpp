#include "Blocks.h"

#include "Store.h"

#include <string>

using namespace emscripten;


HandlerBlock::HandlerBlock(const val &node) : BaseBlock(node)
{
    auto paramsArray = vecFromJSArray<val>(node["params"]);
	Dispatcher &dispatcher = Store::getDispatcher();
	for (const auto &param : paramsArray) {
		if (param["eventName"].isString()) {
			std::string eventName = param["eventName"].as<std::string>();
			auto entryFunc = std::bind(&HandlerBlock::input0, this);
			m_isAddHandlerOk = dispatcher.addHandler(eventName, entryFunc, this);
			break;
		} 
	}
}

void HandlerBlock::input0()
{
	//log("Handler*Block");
}

HandlerWithParams::HandlerWithParams(const emscripten::val &node) : BaseBlock(node)
{
	auto paramsArray = vecFromJSArray<val>(node["params"]);
	Dispatcher &dispatcher = Store::getDispatcher();
	for (const auto &param : paramsArray) {
		if (param["eventName"].isString()) {
			std::string eventName = param["eventName"].as<std::string>();
			auto value = param["value"].as<emscripten::val>();
			auto entryFunc = std::bind(&HandlerWithParams::input0, this, std::placeholders::_1);
			m_isAddHandlerOk = dispatcher.addHandlerWithParams(eventName, entryFunc, this);
			break;
		} 
	}
}

FromStoreElement::FromStoreElement(const emscripten::val &node) : BaseBlock(node)
{
    auto paramsArray = vecFromJSArray<val>(node["params"]);
	for (const auto &param : paramsArray) {
		if (param["ElementName"].isString()) {
			std::string name = param["ElementName"].as<std::string>();
			if (auto it = Store::getMapStore().find(name); it != Store::getMapStore().end()) {
				(*m_outparams)[0] = it->second;
			}
			break;
		} 
	}
}

ToStoreElement::ToStoreElement(const emscripten::val &node) : BaseBlock(node)
{
    auto paramsArray = vecFromJSArray<val>(node["params"]);
	for (const auto &param : paramsArray) {
		if (param["ElementName"].isString()) {
			std::string name = param["ElementName"].as<std::string>();
			if (auto it = Store::getMapStore().find(name); it != Store::getMapStore().end()) {
				(*m_inparams)[0] = it->second;
			}
			break;
		} 
	}
}

void IncrementBlock::input0()
{
	if (m_inparams->size()) {
		*((*m_inparams)[0]) = emscripten::val((*m_inparams)[0]->as<int>() + 1);
	}
    log("IncrementBlock");
}

void DecrementBlock::input0()
{
    log("begin DecrementBlock");
	if (m_inparams->size()) {
		*((*m_inparams)[0]) = emscripten::val((*m_inparams)[0]->as<int>() - 1);
	}
    log("DecrementBlock");
}
