import React, {useCallback, useMemo, useState} from "react";
import PropTypes from 'prop-types';
import './treeView.css';
import TreeNode from "./treeNode";

const TreeView = (props) => {
    const { className, data, onSelected, selectionPath, cellContentRenderer } = props;

    const onNodeSelect = useCallback((node) => {
        if (onSelected) {
            onSelected(node);
        }
    }, []);

    const rootNodes = useMemo(() => {
        let rootNodes = null;
        if (data && Array.isArray(data)) {
            rootNodes = data.map(node => {
                return (
                    <TreeNode className={"root"}
                              key={node.id}
                              node={node}
                              onSelected={onNodeSelect}
                              selectionPath={selectionPath}
                              cellContentRenderer={cellContentRenderer}>
                    </TreeNode>
                )
            });
        }
        return rootNodes;
    }, [data, selectionPath, cellContentRenderer]);

    let cn = `${className ? className : ''} tree-view`;


    return (
        <ul className={cn}>
            {rootNodes}
        </ul>

    )
};

let nodeShape = {
    id: PropTypes.string,
    name: PropTypes.string,
    properties: PropTypes.object
};
nodeShape.childNodes = PropTypes.arrayOf(PropTypes.shape(nodeShape));

TreeView.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape(nodeShape)),
    selectionPath: PropTypes.string,
    onSelected: PropTypes.func,
    cellContentRenderer: PropTypes.func

};

export default TreeView;
