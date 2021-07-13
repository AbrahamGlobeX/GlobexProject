#ifndef JSBLOCK
#define JSBLOCK

#include <emscripten/val.h>
#include "BaseBlock.h"

class JSBlock : public BaseBlock
{
public:
	JSBlock(const emscripten::val &node) : BaseBlock(node)
	{
		using namespace emscripten;
		makeInput(&JSBlock::input0, 0);

		auto paramsArray = emscripten::vecFromJSArray<emscripten::val>(node["params"]);
		for (const auto &param : paramsArray) {
			if (param["libOid"].isString()) {
				m_objName = param["libOid"].as<std::string>();
				m_input0FuncName = param["funcName"].as<std::string>();
				break;
			}
		}
		while (m_inparams->size() < m_maxInparams) {
			auto valPtr = std::make_shared<val>(val::object());
			m_inparams->push_back(valPtr);
		}
		if (m_outparams->size() == 0) {
			auto valPtr = std::make_shared<val>(val::object());
			m_outparams->push_back(valPtr);
		}


	}
	~JSBlock() override {}

	void input0()
	{
		using namespace emscripten;
	    val objJS = val::global(m_objName.c_str());
		val inputData1 = *((*m_inparams)[0]);
		val inputData2 = *((*m_inparams)[1]);
		val inputData3 = *((*m_inparams)[2]);
		val inputData4 = *((*m_inparams)[3]);
		val inputData5 = *((*m_inparams)[4]);
		val inputData6 = *((*m_inparams)[5]);
		val inputData7 = *((*m_inparams)[6]);
		val inputData8 = *((*m_inparams)[7]);
		val inputData9 = *((*m_inparams)[8]);
		val inputData10 = *((*m_inparams)[9]);
		val result = objJS.call<val>(m_input0FuncName.c_str(), inputData1, inputData2, inputData3, inputData4, inputData5, inputData6, inputData7, inputData8, inputData9, inputData10);
		*((*m_outparams)[0]) = result;
	}

private:
	const size_t m_maxInparams = 10;
	std::string m_objName;
	std::string m_input0FuncName;
};

#endif //JSBLOCK