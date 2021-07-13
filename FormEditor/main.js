var formEditorApp = {};

var init = function() {

    //document.getElementById("root").removeEventListener("mousemove", init);

    formEditorApp = new FormEditorApp();

    formEditorApp.init();
}

init();

//document.getElementById("root").addEventListener("mousemove", init, false);
   