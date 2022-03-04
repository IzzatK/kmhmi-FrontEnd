import {MenuItem} from "../../framework.core/model/menuItem";

export class SystemToolMenuItem extends MenuItem {
    public static class: string = 'SystemToolMenuItem';

    constructor(id: string) {
        super(id);

        this.appendClassName(SystemToolMenuItem.class);
    }
}
