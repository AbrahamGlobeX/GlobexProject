#include "FromDottedPath.h"
#include "Store.h"

#include <string>

using namespace emscripten;

FromDottedPath::FromDottedPath(const val &node) : BaseBlock(node)
{
	setOutFlowFunc(1);

	if ((*m_inparams).size() != 2 || (*m_outparams).size() != 1)
	{
		makeFinal(&FromDottedPath::error, 0);
	}

	makeInput(&FromDottedPath::input0, 0);
}

bool FromDottedPath::getNextValue(const std::string &key, val &value)
{
	value = value[key];
	if (value.isUndefined()) {
		setOutFlowFunc(1);
		*((*m_outparams)[0]) = val(key);
		return false;
	}
	return true;
}
void FromDottedPath::input0()
{
	//dotted path
	const auto &path = *(*m_inparams)[1];

	if (!path.isString()) {
		setOutFlowFunc(1);
		return;
	}
	std::string dotted = path.as<std::string>();
	size_t pos = 0;
	size_t dotPos = 0;

	//json
	val value = *(*m_inparams)[0];
	
	std::string key;
	while( (dotPos = dotted.find('.', pos)) != std::string::npos ) {
		key = dotted.substr(pos, dotPos - pos);
		if (!getNextValue(key, value)) {
			return;
		}
		pos = dotPos + 1;
	}
	key = dotted.substr(pos);
	if (!getNextValue(key, value)) {
		return;
	}
	setOutFlowFunc(0);
	*((*m_outparams)[0]) = value;
}

void FromDottedPath::error()
{
	logerror("Error in node with ID: " + std::to_string(getId()));
	logerror("Attempt to access a nonexistent input/output data. Index is out of range.");
}
