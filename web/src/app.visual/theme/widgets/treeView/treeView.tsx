import React, {Component} from "react";
import './treeView.css';
import TreeNode from "./treeNode";
import {TreeNodeVM, TreeViewProps} from "./treeViewModel";
import exp from "constants";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";

class TreeView extends Component<TreeViewProps> {
    constructor(props: any) {
        super(props);
        bindInstanceMethods(this);
    }

    _onSelected(node: TreeNodeVM) {
        const { onSelected } = this.props;
        if (onSelected) {
            onSelected(node);
        }
    }

    _onToggle(node: TreeNodeVM, expanded: boolean) {
        const { onToggle } = this.props;
        if (onToggle) {
            onToggle(node, expanded);
        }
    }

    render() {
        const { className, rootNodes, selectionPath, expandedPaths, cellContentRenderer } = this.props;

        let cn = `${className ? className : ''} tree-view`;

        let rootDivs: JSX.Element[] = [];

        if (rootNodes && Array.isArray(rootNodes)) {
            rootDivs = rootNodes.map(node => {
                return (
                    <TreeNode className={"root"}
                              key={node.id}
                              node={node}
                              onSelected={this._onSelected}
                              onToggle={this._onToggle}
                              selectionPath={selectionPath}
                              expandedPaths={expandedPaths}
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
