#ifndef BASEBLOCK_H
#define BASEBLOCK_H

#include "Dispatcher.h"
#include "Log.h"

#include <map>
#include <functional>
#include <memory>
#include <emscripten/val.h>
#include <vector>

class Error
{
public:
    Error() {}
    ~Error() {}

    enum class ERROR : int
    {
        makeInputFunction = 0,
        setOutFlowFunc,
        call,
        AMOUNT
    };

    using ErrorArray = std::array<std::string_view, static_cast<size_t>(ERROR::AMOUNT)>;

    void set(ERROR err)
    {
        m_error = err;
    }

    std::string get()
    {
        size_t index = static_cast<size_t>(m_error);
        if (index >= m_array.size())
        {
            return "error in error handling";
        }

        return std::string(m_array[index]);
    }

    bool isError()
    {
        return m_error != ERROR::AMOUNT;
    }

private:
    static constexpr ErrorArray m_array = {
        std::string_view("Attempt to access a nonexistent input flow in 'makeInputFunction' method. Index is out of range."),
        std::string_view("Attempt to access a nonexistent output flow in 'setOutFlowFunc' method. Index is out of range."),
        std::string_view("Attempt to access a nonexistent output flow in 'call' method. Index is out of range."),
    };

    ERROR m_error = ERROR::AMOUNT;
};

class BaseBlock
{
    friend class FlowCompiler;
    friend class Dispatcher;

public:
    explicit BaseBlock(const emscripten::val &node);

    virtual ~BaseBlock();

    // Фабричный метод - создаёт экземпляр класса-наследника BaseBlock
    //  Пример использования:
    //		auto node = BaseBlock::makeNode(std::string("MakeAll"));
    //		if (node) {
    //			node->someWork();
    //		}
    static std::shared_ptr<BaseBlock> makeNode(const std::string &command,
                                               const emscripten::val &jnode);

    // Регистрирует экземпляр класса-наследника BaseBlock
    //	Пример регистрации:  BaseBlock::registerNode<HandlerBlock>(std::string("Handler"));
    template <typename T>
    static void registerNode(const std::string &command)
    {
        std::function<std::shared_ptr<BaseBlock>(const emscripten::val &jnode)> func =
            [](const emscripten::val &jnode) -> std::shared_ptr<BaseBlock> {
            return std::make_shared<T>(jnode);
        };

        m_factoryFunctions[command] = func;
    }

    // Создает вход(инпут) для блочка.
    // Передаем указатель на функцию(пример: &Block::input0) обрабатывающую входной поток(управления),
    // и номер соответствующего инпута блочка (inputIndex)
    template <typename _Tp, typename _Class>
    void makeInput(_Tp _Class::*func, int inputIndex)
    {
        if (m_error.isError())
        {
            return;
        }

        std::function<void()> input = std::bind(func, reinterpret_cast<_Class *>(this));
        makeInputFunction(inputIndex, input);
    }

    // Final - такая функция-инпут, после которой не вызывается следующий блочок,
    //  происходит непосредственный возврат потока управления.
    template <typename _Tp, typename _Class>
    void makeFinal(_Tp _Class::*func, int inputIndex)
    {
        if (m_error.isError())
        {
            return;
        }

        std::function<void()> input = std::bind(func, reinterpret_cast<_Class *>(this));
        makeInputFunction(inputIndex, input, true);
    }

    // Запускаем на выполнение выходную ветку с индексом "indexOfOutput",
    // и дожидаемся возврата управления кодом
    void call(size_t indexOfOutput);

    void setOutFlowFunc(size_t indexOfOutput);

    // HandlerBlock говорит FlowCompiler'у успешно ли он добавился в Dispatcher
    virtual bool isAddHandlerOk();

    size_t getId()
    {
        return m_id;
    }

private:
    void fillDefaults(const emscripten::val &jnode);

    using FactoryFunc = std::function<std::shared_ptr<BaseBlock>(const emscripten::val &jnode)>;
    static std::map<std::string, FactoryFunc> m_factoryFunctions;

    std::function<void()> m_outFlowFunc;

    // указывает на 'void FlowCompiler::makeAlarm(size_t nodeId)'
    std::function<void(size_t)> m_extenalAlarmFunc = [](size_t){};

    void emptyStuff();
    void bindEmptyStuff();

    void makeInputFunction(size_t indexOfInput, std::function<void()> func,
                                         bool isFinal = false);

    // return false if out of range
    // [[nodiscard]]
    // bool BaseBlock::makeInputHandlerFunction(size_t indexOfInput,
    //                         const std::function<void(const emscripten::val &)> func);

    // Инстанцируем входы и выходы нодов
    void fillData(const emscripten::val &jnode);

    std::vector<std::function<void()>> m_outFlowFuncs;
    std::vector<std::function<void()>> m_inFlowFuncs;

    Error m_error;
    // Устанавливаем вместо всех выходных функций - ссылку на "void alarm()"
    void makeTotalAlarm(Error::ERROR err);

    void alarm();

    size_t m_id = 0;
    size_t m_currentOutflowFuncIndex = 0;

protected:
    std::shared_ptr<std::vector<std::shared_ptr<emscripten::val>>> m_outparams;
    std::shared_ptr<std::vector<std::shared_ptr<emscripten::val>>> m_inparams;

    BaseBlock();
};

#endif // BASEBLOCK_H
