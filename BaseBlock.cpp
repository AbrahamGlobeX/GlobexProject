#include "BaseBlock.h"

#include "Store.h"

using namespace emscripten;

using FactoryFunc = std::function<std::shared_ptr<BaseBlock>(const emscripten::val &jnode)>;
std::map<std::string, FactoryFunc> BaseBlock::m_factoryFunctions;

BaseBlock::BaseBlock(const emscripten::val &node)
{
	fillData(node);
	fillDefaults(node);
	bindEmptyStuff();
}

BaseBlock::~BaseBlock()
{
}

void BaseBlock::call(size_t indexOfOutput)
{
	if (m_error.isError()) {
		return;
	}

	if (indexOfOutput >= m_outFlowFuncs.size())
	{
		makeTotalAlarm(Error::ERROR::call);
		return;
	}
	m_outFlowFuncs[indexOfOutput]();
}

void BaseBlock::makeTotalAlarm(Error::ERROR err)
{
	for (size_t i = 0; i < m_outFlowFuncs.size(); ++i) {
	    m_outFlowFuncs[i] = std::bind(&BaseBlock::alarm, this);
	}
	m_outFlowFunc = m_outFlowFuncs[m_currentOutflowFuncIndex];
	m_error.set(err);
	m_extenalAlarmFunc(getId());
}

void BaseBlock::alarm()
{
	logerror("Error in node with ID: " + std::to_string(getId()));
	logerror(m_error.get());
}

void BaseBlock::setOutFlowFunc(size_t indexOfOutput)
{
	if (m_error.isError()) {
		return;
	}

	if (indexOfOutput >= m_outFlowFuncs.size())
	{
		makeTotalAlarm(Error::ERROR::setOutFlowFunc);
		return;
	}

	m_outFlowFunc = m_outFlowFuncs[indexOfOutput];
	m_currentOutflowFuncIndex = indexOfOutput;

	return;
}

bool BaseBlock::isAddHandlerOk()
{
	return false;
}

std::shared_ptr<BaseBlock>
BaseBlock::makeNode(const std::string &nodeType, const val &jnode)
{
	std::map<std::string, FactoryFunc>::const_iterator it = m_factoryFunctions.find(nodeType);

	if (it != m_factoryFunctions.end())
	{
		FactoryFunc factoryFunction = it->second;
		return factoryFunction(jnode);
	}
	else
	{
		return nullptr;
	}
}

void BaseBlock::emptyStuff()
{
	//log("emptyStuff");
}

void BaseBlock::bindEmptyStuff()
{
	m_outFlowFunc = std::bind(&BaseBlock::emptyStuff, this);
	// m_outFlowFunc = m_outFlowFuncs[0];
}

void BaseBlock::makeInputFunction(size_t indexOfInput, std::function<void()> func,
								  bool isFinal)
{
	if (m_error.isError()) {
		return;
	}

	if (indexOfInput >= m_inFlowFuncs.size())
	{
		makeTotalAlarm(Error::ERROR::makeInputFunction);
		return;
	}

	auto outFunc = &m_outFlowFunc;
	auto inputFunction = (isFinal)
							 ? func
							 : [func, outFunc]() {
								   func();
								   (*outFunc)();
							   };

	m_inFlowFuncs[indexOfInput] = inputFunction;
}

void BaseBlock::fillDefaults(const emscripten::val &jnode)
{
	if (!jnode["Defaults"].isUndefined() && !jnode["Defaults"]["Inputs"].isUndefined())	{
		auto inputs = vecFromJSArray<val>(jnode["Defaults"]["Inputs"]);
		for (const auto &input : inputs) {
			int index = 0;
			if (!input["index"].isNumber()) {
				logerror("Defaults.Inputs.index is not number type");
				logerror("Of node number: " + std::to_string(jnode["id"].as<int>()));
				continue;
			}
			index = input["index"].as<int>();
			auto val = input["value"];
			if (m_inparams->size() <= static_cast<size_t>(index)) {
				logerror("Defaults index is out of range.");
				logerror("Of node number: " + std::to_string(index));
				continue;
			}
			*((*m_inparams)[index]) = val;
		}
	}
}

void BaseBlock::fillData(const emscripten::val &jnode)
{
	using namespace emscripten;
	m_outparams = std::make_shared<std::vector<std::shared_ptr<val>>>();
	m_inparams = std::make_shared<std::vector<std::shared_ptr<val>>>();
	
	if (!jnode["Inputs"].isUndefined())	{
		auto inputsFlow = vecFromJSArray<val>(jnode["Inputs"]["flow"]);
		for (const auto &v : inputsFlow)
		{
			m_inFlowFuncs.push_back(std::bind(&BaseBlock::emptyStuff, this));
		}
		auto inputsData = vecFromJSArray<val>(jnode["Inputs"]["data"]);
		for (const auto &v : inputsData)
		{
			auto valPtr = std::make_shared<val>(val::object());
			m_inparams->push_back(valPtr);
		}
	}
	else {
		logerror("'Inputs' field is undefined");
	}

	if (!jnode["Outputs"].isUndefined()) {
		auto outputsFlow = vecFromJSArray<val>(jnode["Outputs"]["flow"]);
		for (const auto &v : outputsFlow) {
			m_outFlowFuncs.push_back(std::bind(&BaseBlock::emptyStuff, this));
		}
		auto outputsData = vecFromJSArray<val>(jnode["Outputs"]["data"]);
		for (const auto &v : outputsData) {
			auto valPtr = std::make_shared<val>(val::object());
			m_outparams->push_back(valPtr);
		}
	}
	else {
		logerror("'Outputs' field is undefined");
	}

	if (!jnode["id"].isUndefined()) {
		m_id = jnode["id"].as<size_t>();
	}
	else {
		logerror("'id' field is undefined");
	}
}

BaseBlock::BaseBlock()
{
	log("DAFAULT CONSTRUCTOR");
	bindEmptyStuff();
}
