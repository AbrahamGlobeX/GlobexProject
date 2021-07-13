#include "ToDottedPath.h"

#include <string>

using namespace emscripten;

ToDottedPath::ToDottedPath(const val &node) : BaseBlock(node)
{
	setOutFlowFunc(1);

	if ((*m_inparams).size() != 3 || (*m_outparams).size() != 1)
	{
		makeFinal(&ToDottedPath::error, 0);
	}

	makeInput(&ToDottedPath::input0, 0);
}

bool ToDottedPath::getNextValue(const std::string &key, val &value)
{
	value = value[key];
	if (value.isUndefined()) {
		setOutFlowFunc(1);
		*((*m_outparams)[0]) = val(key);
		return false;
	}
	return true;
}

val jsonCopier(const val& json)
{
	val str = val::global("JSON").call<val>("stringify", json);
	val newJson = val::global("JSON").call<val>("parse", str);
	return newJson;
}

void ToDottedPath::input0()
{
	//dotted path
	const auto &inputValue = *(*m_inparams)[0];
	//value to set in json
	const auto &path = *(*m_inparams)[2];

	if (!path.isString()) {
		setOutFlowFunc(1);
		return;
	}
    if (inputValue.isUndefined())
    {
        setOutFlowFunc(1);
		return;
    }
	std::string dotted = path.as<std::string>();
	size_t pos = 0;
	size_t dotPos = 0;

	//temporary json
	val json = jsonCopier(*(*m_inparams)[1]);
	//result json
	val result = json;
	std::string key;
	while( (dotPos = dotted.find('.', pos)) != std::string::npos ) {
		key = dotted.substr(pos, dotPos - pos);
		if (!getNextValue(key, json)) {
			return;
		}
		pos = dotPos + 1;
	}
	key = dotted.substr(pos);
    json.set(key, inputValue);
	setOutFlowFunc(0);
	*((*m_outparams)[0]) = result;
}

void ToDottedPath::error()
{
	logerror("Error in node with ID: " + std::to_string(getId()));
	logerror("Attempt to access a nonexistent input/output data. Index is out of range.");
}
