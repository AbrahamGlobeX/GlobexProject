#include "Dispatcher.h"
#include "Store.h"
#include "BaseBlock.h"

using namespace emscripten;

bool Dispatcher::addHandler(const std::string &eventname,
							const std::function<void()> &func,
							BaseBlock *node)
{
	bool result = false;

	const auto it = m_handler.find(eventname);
	if (it == m_handler.end())
	{
		auto outFlowFunc = &node->m_outFlowFunc;
		auto handlerFunc = [func, outFlowFunc](const emscripten::val &) {
			func();
			(*outFlowFunc)();
		};
		m_handler[eventname] = handlerFunc;
		result = true;
	}

	return result;
}

bool Dispatcher::addHandlerWithParams(const std::string &eventname,
							const std::function<void(const emscripten::val &)> &func,
							BaseBlock *node)
{
	bool result = false;

	const auto it = m_handler.find(eventname);
	if (it == m_handler.end())
	{
		auto outFlowFunc = &node->m_outFlowFunc;
		auto handlerFunc = [func, outFlowFunc](const emscripten::val &value) {
			func(value);
			(*outFlowFunc)();
		};
		m_handler[eventname] = handlerFunc;
		result = true;
	}

	return result;
}

void Dispatcher::dispatch(const emscripten::val &obj)
{
	using namespace emscripten;
	val eventName = obj["eventName"];
	std::string event = eventName.as<std::string>();
	//   log(event);
	const auto it = m_handler.find(event);
	if (it != m_handler.end())
	{
		it->second(obj);
		Store::emitChange();
	}
	else
	{
		logerror("Unknown event");
	}
}

bool Dispatcher::addHandler(const std::string &eventname,
				const std::function<void(const emscripten::val &)> &func)
{
	bool result = false;

	const auto it = m_handler.find(eventname);
	if (it == m_handler.end())
	{
		m_handler[eventname] = func;
		result = true;
	}

	return result;
}