import React, {Component} from "react";
import './treeView.css';
import TreeNode from "./treeNode";
import {TreeViewProps} from "./treeViewModel";

class TreeView extends Component<TreeViewProps> {
    constructor(props: any) {
        super(props);
    }

    _onSelected(node: any) {
        const { onSelected } = this.props;

        if (onSelected) {
            onSelected(node);
        }
    }

    render() {
        const { className, rootNodes, selectionPaths, cellContentRenderer } = this.props;

        let cn = `${className ? className : ''} tree-view`;

        let rootDivs: JSX.Element[] = [];

        if (rootNodes && Array.isArray(rootNodes)) {
            rootDivs = rootNodes.map(node => {
                return (
                    <TreeNode className={"root"}
                              key={node.id}
                              node={node}
                              onSelected={() => this._onSelected(node)}
                              selectionPaths={selectionPaths}
                              cellContentRenderer={cellContentRenderer}
                              index={0}
                    />
                )
            });
        }

        return (
            <ul className={cn}>
                {rootDivs}
            </ul>
        )
    }
}

export default TreeView;
