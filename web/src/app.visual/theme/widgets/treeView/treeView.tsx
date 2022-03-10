import React, {Component} from "react";
import './treeView.css';
import TreeNode from "./treeNode";
import {TreeViewProps, TreeViewState} from "./treeViewModel";

class TreeView extends Component<TreeViewProps, TreeViewState> {
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
        const { className, data, selectionPaths, cellContentRenderer } = this.props;

        let cn = `${className ? className : ''} tree-view`;

        let rootNodes: any[] = [];

        if (data && Array.isArray(data)) {
            rootNodes = data.map(node => {
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
                {rootNodes}
            </ul>
        )
    }
}

export default TreeView;
