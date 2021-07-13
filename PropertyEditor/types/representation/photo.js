class Representation_PhotoType extends BasePropertyType {
    constructor(){
        super({"en" : "Photo", "ru" : "Фото"});
    }
    onCreate(){
        const widget = new WidgetLayoutHorizontal();

        const label = new WidgetLabel();
        label.text = "Значение";

        this._photoLayout = new WidgetLayoutHorizontal();

        const input = new WidgetFile();
        input.htmlElement.onchange = (e) => {
            console.log("e",e.target.files[0]);
            console.log("typeof",typeof e.target.files[0]);
            this.readFile(e.target.files[0]);
        }
        widget.includeWidget(this._photoLayout);
        widget.includeWidget(label);
        widget.includeWidget(input);
        this.widget = widget;
    }
    readFile(file){
        const readed = new FileReader();
        readed.onload = (e) => {
            // this._photoLayout.clearWidget();
            // const data = e.target.result;
            // console.log("data",data);

            // const img = new WidgetPhotoFile();
            // img.src = data;

            // this._photoLayout.includeWidget(img);

            // const dataForm = new FormData();
            // dataForm.append("name",file.name);
            // dataForm.append("data",data);

            // sendPostRequestMultiPart('/api/file/upload',dataForm,(e) => {
            //     console.log("e",e);
            // })

            let data = e.target.result;
            console.log(typeof data);
            console.log(data);
            const chunks = [];
            for(let i = 0; i < Math.floor(file.size / 261120); i++){
                chunks[i] = data.slice(i*261120,(i+1)*261120);
            }
            const ost = file.size - Math.floor(file.size / 261120)*261120;
            console.log("ost",ost);
            if(ost > 0){
                chunks.push(data.slice(file.size - ost));
            }
            console.log("chunks",chunks);
            this.createFile(file.name,file.size,chunks);

        }
        readed.readAsArrayBuffer(file);
    }

    createFile(filename,filesize,chunks){
        const created = function(result){
            console.log("result",result);
        }
        const file = {
            "filename" : filename,
            "chunkSize" : 261120,
            "uploadDate" : new Date(),
            "length" : filesize,
            "metadata" : {
                "owner" : {"$oid" : ""+APP.owner+""}
            }
        }
        APP.dbWorker.responseDOLMongoRequest = created.bind(this);
        APP.dbWorker.sendInsertRCRequest("DOLMongoRequest",JSON.stringify(file),"fs.files");
    }

}