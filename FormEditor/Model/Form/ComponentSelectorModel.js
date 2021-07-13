class ComponentSelectorModel extends BaseModel
{
    constructor() {

        super();

        this.geometry = {

            x : null,
            y : null,
            width : null,
            height : null
        }
    }

    startSelection(x, y) {

        let geometry = this.geometry;

        geometry.x = x;
        geometry.y = y;

        geometry.width = 0;
        geometry.height = 0;

        this.trigger('onStartSelection', x, y);
    }

    update(x, y, width, height) {

        let geometry = this.geometry;

        geometry.x = x;
        geometry.y = y;
        geometry.width = width;
        geometry.height = height;

        this.trigger('onUpdate', geometry);
    }

    endSelection() {

        this.trigger('onEndSelection');
    }

}