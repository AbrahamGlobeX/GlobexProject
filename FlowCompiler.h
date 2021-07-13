#ifndef FLOWCOMPILER_H
#define FLOWCOMPILER_H

#include "BaseBlock.h"
#include <emscripten/val.h>

#include <string>
#include <map>
#include <set>
#include <memory>

struct NodeInfo
{
    std::shared_ptr<BaseBlock> node;
    
    //link Of OutFlowFunc: int/*outFlowFuncId*/ ---> int/*destNodeId*/
    std::vector<size_t/*destination NodeId*/> links;
};

class LeaksChecker
{
    using GetParamsFunc = std::function<
                        std::shared_ptr<std::vector<std::shared_ptr<emscripten::val>>>
                        (std::shared_ptr<BaseBlock>)
                          >;
public:
    void copy(const std::map<int, std::shared_ptr<NodeInfo>> &nodes,
                        GetParamsFunc getInParams,
                        GetParamsFunc getOutParams)
    {
        makeNodesCopy(nodes);
        makeParamsCopy(nodes, getInParams, getOutParams);
    }

    void check()
    {
        checkParams();
        checkNodes();
    }

    void clear()
    {
        m_basenodes.clear();
        m_allInparams.clear();
        m_allOutparams.clear();
    }

private:
    std::vector<std::weak_ptr<BaseBlock>> m_basenodes;
    std::vector<std::weak_ptr<emscripten::val>> m_allInparams;
    std::vector<std::weak_ptr<emscripten::val>> m_allOutparams;

    void makeNodesCopy(const std::map<int, std::shared_ptr<NodeInfo>> &nodes)
    {
        for (auto pair : nodes) {
            m_basenodes.push_back(pair.second->node);
        }
    }

    void checkNodes()
    {
        for (auto ptr : m_basenodes) {
            if (!ptr.expired()) {
                logerror("Memory leaks detected.");
                logerror(ptr.lock()->getId());
                logerror(ptr.use_count());
            }
            else {
                log("Ok, node has been deleted.");
            }
        }
    }

    void makeParamsCopy(const std::map<int, std::shared_ptr<NodeInfo>> &nodes,
                        GetParamsFunc getInParams,
                        GetParamsFunc getOutParams)
    {
        for (auto pair : nodes) {
            auto inParams = getInParams(pair.second->node);
            auto outParams = getOutParams(pair.second->node);
            
            for (auto inparam : *inParams) {
                m_allInparams.push_back(inparam);
            }
            
            for (auto outparam : *outParams) {
                m_allOutparams.push_back(outparam);
            }
        }
    }

    void checkParams()
    {
        auto checkParam = [](auto param)
        {
            if (!param.expired()) {
                logerror("Memory leaks detected.");
                logerror(param.use_count());
            }
            else {
                log("Ok, param has been deleted.");
            } 
        };
        for (auto inpar : m_allInparams) {
            checkParam(inpar);
        }
        for (auto outpar : m_allOutparams) {
            checkParam(outpar);
        }
    }

};

class FlowCompiler
{
public:
    FlowCompiler(){}

    void loadScript(const emscripten::val &obj);

    void clearAndCheck()
    {
        LeaksChecker leaksChecker;
        leaksChecker.copy(m_nodes, [](std::shared_ptr<BaseBlock> node){return node->m_inparams;},
                                     [](std::shared_ptr<BaseBlock> node){return node->m_outparams;});
        m_nodes.clear();
        leaksChecker.check();

        // makeParamsCopy();
        // makeNodesCopy();
        // m_nodes.clear();
        // checkNodes();
        // checkParams();
    }
    
private:
    struct IndexAndId
    {
        size_t srcId;
        size_t dstId;
        size_t srcIndex;
        size_t dstIndex;
    };

    std::shared_ptr<NodeInfo> makeNodeInfo(std::shared_ptr<BaseBlock> &node);

    std::set<int> makeAllNodes(const emscripten::val &flost);

    void makeDataConnection(const emscripten::val &connection,
                                std::function<void(const IndexAndId &)> funcForMaking);

    void makeFlowConnection(const emscripten::val &connection);

    std::shared_ptr<BaseBlock>
    makeNode(const std::string &command, const emscripten::val &jnode);

    // Блокирует работу узла(node) сгенерировавшего ошибку, и заставляет его кидать в лог оповещение.
    void makeAlarm(size_t node_id);

    std::map<int, std::shared_ptr<NodeInfo>> m_nodes;
};


#endif // FLOWCOMPILER_H