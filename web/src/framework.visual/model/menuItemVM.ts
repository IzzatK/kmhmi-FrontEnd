import {Component} from "react";
import {SVGModel} from "./svgModel";

export type MenuItemVM = {
    id: string,
    title: string,
    selected: boolean,
    graphic: {new(props: SVGModel, context: any): Component<SVGModel, any>}
    context: any
}
