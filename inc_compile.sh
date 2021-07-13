#em++ --bind -std=c++11 -o inc.js inc.cpp --js-library library.js -s WASM=1 -s NO_EXIT_RUNTIME=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "getValue"]'
#em++ --bind -std=c++11 -o inc.js inc.cpp -s WASM=1 -s NO_EXIT_RUNTIME=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "getValue"]'
em++ -W --bind -std=c++17 -o inc.js inc.cpp FlowCompiler.cpp Blocks.cpp BaseBlock.cpp Store.cpp Dispatcher.cpp FromDottedPath.cpp ToDottedPath.cpp -s WASM=1 -s NO_EXIT_RUNTIME=1 -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "getValue"]'
