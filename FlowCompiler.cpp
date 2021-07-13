#include "FlowCompiler.h"
#include "Store.h"
#include "Dispatcher.h"
#include "Blocks.h"
#include "JSBlock.h"
#include "FromDottedPath.h"
#include "ToDottedPath.h"

using namespace emscripten;

void nodesRegistration()
{
    BaseBlock::registerNode<HandlerBlock>(std::string("Handler"));
    BaseBlock::registerNode<IncrementBlock>(std::string("Increment"));
    BaseBlock::registerNode<DecrementBlock>(std::string("Decrement"));
    BaseBlock::registerNode<FromStoreElement>(std::string("FromStoreElement"));
    BaseBlock::registerNode<ToStoreElement>(std::string("ToStoreElement"));
    BaseBlock::registerNode<CompareBlock>(std::string("If"));
    BaseBlock::registerNode<LogToConsoleBlock>(std::string("LogToConsole"));
    BaseBlock::registerNode<NodeFor>(std::string("For"));
    BaseBlock::registerNode<JSBlock>(std::string("JavaScriptBlock"));
    BaseBlock::registerNode<HandlerWithParams>(std::string("HandlerWithParams"));
    BaseBlock::registerNode<FromDottedPath>(std::string("GetValue"));
    BaseBlock::registerNode<ToDottedPath>(std::string("SetValue"));
}

static bool isType(const emscripten::val &value, const std::string &type)
{
    return (value.typeof().as<std::string>() == type);
}

void initializeValues(const emscripten::val &obj)
{
    val initStore = obj["script"]["store"];
    if (isType(initStore, "object")) {
        val jskeys = val::global("Object").call<val>("keys", initStore);
        auto keys  = vecFromJSArray<std::string>(jskeys);
        auto &storeMap = Store::getMapStore();
        for (const auto &key: keys) {
            if (!Store::appendElement(key, initStore[key])) {
                logerror("Value: " + key + " not appended");
            }
        }
    }
}

void FlowCompiler::loadScript(const emscripten::val &obj)
{
    nodesRegistration();
    
    initializeValues(obj);

    val flost = obj["script"];
    std::set<int> toStoreNodeIds = makeAllNodes(flost);

    auto only_toStoreNode = [&](const IndexAndId &i)
    {
        if (const auto it = toStoreNodeIds.find(i.dstId); it != toStoreNodeIds.end()) {
            m_nodes[i.srcId]->node->m_outparams->at(i.srcIndex) =
                                    m_nodes[i.dstId]->node->m_inparams->at(i.dstIndex);
        }
    };

    auto allBut_toStoreNode = [&](const IndexAndId &i)
    {
        if (const auto it = toStoreNodeIds.find(i.dstId); it == toStoreNodeIds.end()) {
            m_nodes[i.dstId]->node->m_inparams->at(i.dstIndex) =
                                    m_nodes[i.srcId]->node->m_outparams->at(i.srcIndex);
        }
    };

    const auto valCons = vecFromJSArray<val>(flost["connections"]);
    for (const val &v: valCons) {
        makeDataConnection(v, only_toStoreNode);
    }
    for (const val &v: valCons) {
        makeFlowConnection(v);
        makeDataConnection(v, allBut_toStoreNode);
    }
}

void checkIsHandlerDuplicated(const std::string &nodeType, BaseBlock *i, const val &jnode)
{
    if (("Handler" == nodeType) && !i->isAddHandlerOk()) {
        auto params = vecFromJSArray<val>(jnode["params"]);
        for (const val &obj: params) {
            std::string strEvent = obj["eventName"].as<std::string>();
            logerror("ERROR: Handler duplicated: " + strEvent);
        }
    }
}

std::shared_ptr<NodeInfo> FlowCompiler::makeNodeInfo(std::shared_ptr<BaseBlock> &node)
{
    std::shared_ptr<NodeInfo> info = std::make_shared<NodeInfo>(NodeInfo({node, {}}));
    for (size_t i = 0; i < node->m_outFlowFuncs.size(); ++i) {
        info->links.push_back(0);
    }

    return info;
}

std::shared_ptr<BaseBlock>
FlowCompiler::makeNode(const std::string &nodeType, const val &jnode)
{
    auto node = BaseBlock::makeNode(nodeType, jnode);
    node->m_extenalAlarmFunc = std::bind(&FlowCompiler::makeAlarm, this, std::placeholders::_1);
    return node;
}

std::set<int> FlowCompiler::makeAllNodes(const emscripten::val &flost)
{
    std::set<int> toStoreNodeIds;

    auto nodes = vecFromJSArray<val>(flost["nodes"]);
    for (const val &jnode: nodes) {
        int ndx = jnode["id"].as<int>();
        std::string nodeType = jnode["type"].as<std::string>();
        
        if (const auto it = m_nodes.find(ndx); it != m_nodes.end()) {
            logerror("Block's ID duplicated: " + std::to_string(ndx));
            break;
        }
        
        auto node = FlowCompiler::makeNode(nodeType, jnode);
        if (node) {
            m_nodes[ndx] = makeNodeInfo(node);
        }
        else {
            logerror("Wrong block type");
            break;
        }

        checkIsHandlerDuplicated(nodeType, node.get(), jnode);

        if ("ToStoreElement" == nodeType) {
            toStoreNodeIds.insert(ndx);
        }
    }

    return toStoreNodeIds;
}

void FlowCompiler::makeDataConnection(const emscripten::val &v,
                            std::function<void(const IndexAndId &)> funcForMaking)
{
    if (v["type"] == emscripten::val("data")) {
        IndexAndId i;
        i.srcId = v["source"]["nodeID"].as<size_t>();
        i.dstId = v["dest"]["nodeID"].as<size_t>();
        i.srcIndex = v["source"]["index"].as<size_t>();
        i.dstIndex = v["dest"]["index"].as<size_t>();
        bool isDstOk = m_nodes[i.dstId]->node->m_inparams->size() > i.dstIndex;
        bool isSrcOk = m_nodes[i.srcId]->node->m_outparams->size() > i.srcIndex;
        if (isDstOk && isSrcOk) {
            funcForMaking(i);
        }
        else {
            logerror("ERROR: wrongIndex in connection: " +
                        std::to_string(i.srcId) + ":" + std::to_string(i.dstId));
        }
    }
}

void FlowCompiler::makeFlowConnection(const emscripten::val &v)
{
    if (v["type"] == emscripten::val("flow")) {
        IndexAndId i;
        i.srcId = v["source"]["nodeID"].as<size_t>();
        i.dstId = v["dest"]["nodeID"].as<size_t>();
        i.srcIndex = v["source"]["index"].as<size_t>();
        i.dstIndex = v["dest"]["index"].as<size_t>();
        auto srcData = m_nodes[i.srcId];
        auto dstData = m_nodes[i.dstId];
        srcData->node->m_outFlowFuncs[i.srcIndex] = dstData->node->m_inFlowFuncs[i.dstIndex];
        srcData->links[i.srcIndex] = dstData->node->getId();

        srcData->node->setOutFlowFunc(0);
    }
}

void FlowCompiler::makeAlarm(size_t nodeId)
{
    auto alarmFunc = std::bind(&BaseBlock::alarm, m_nodes[nodeId]->node.get());

    for (auto pair : m_nodes) {
        auto nodeInfo = pair.second;
        for (size_t i = 0; i < nodeInfo->links.size(); ++i) {
            if (nodeId == nodeInfo->links[i]) {
                nodeInfo->node->m_outFlowFuncs[i] = alarmFunc;
                nodeInfo->node->setOutFlowFunc(nodeInfo->node->m_currentOutflowFuncIndex);
            }
        }
    }
}
