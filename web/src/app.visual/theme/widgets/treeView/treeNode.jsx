import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import './treeView.css';
import {CSSTransition} from "react-transition-group";
import {CircleSVG} from "../../svgs/circleSVG";
import {TriangleSVG} from "../../svgs/triangleSVG";

const TreeNode = (props) => {
    const { node, className, selectionPath, onSelected, cellContentRenderer, ...rest } = props;
    const { childNodes } = node;

    const [ expanded, setExpanded ] = useState(false);

    useEffect(() => {
        if (selectionPath && node && selectionPath.length >= node.path.length && selectionPath.includes(node.path)) {
            setExpanded(true);
        }
    }, [selectionPath, node]);


    let cn = `${className ? className : ''} tree-node`;
    if (selectionPath && selectionPath === node.path) {
        cn += ` selected`;
    }

    if (expanded) {
        cn += ` expanded`;
    }

    const toggleHandler = (event) => {
        if (childNodes && childNodes.length > 0) {
            setExpanded(!expanded);
        }
    };

    const selectedHandler = () => {
        if (childNodes && childNodes.length > 0) {
            setExpanded(true);
        }

        if (onSelected) {
            onSelected(node);
        }
    };

    const renderChildNodes = () => {
        let divs = [];

        if (childNodes) {
            divs = childNodes.map(childNode => {
                return (
                    <TreeNode key={childNode.id}
                              node={childNode}
                              onSelected={onSelected}
                              selectionPath={selectionPath}
                              cellContentRenderer={cellContentRenderer}/>
                )
            });
        }

        return divs;
    };

    return (
        <li className={cn} {...rest}>
            <div className={"tree-node-graphic"}>
                <div className={"tree-node-disclosure"} onClick={toggleHandler}>
                    <div className={"nano-image-container"}>
                        {(childNodes && childNodes.length > 0) ?
                            <TriangleSVG/> : <CircleSVG/>
                        }
                    </div>
                </div>
                <div className={"tree-node-content"} onClick={selectedHandler}>
                    {
                        cellContentRenderer ? cellContentRenderer(node, childNodes && childNodes.length > 0 && expanded) :
                            <div className={"title"}>{node.name ? node.name : "n/a"}</div>
                    }
                </div>
            </div>

            <div className={"tree-node-children-container"}>
                <CSSTransition in={expanded} timeout={300} classNames={"tree-node-children"} unmountOnExit={true}>
                    <ul className={"tree-node-children"}>
                        {renderChildNodes()}
                    </ul>
                </CSSTransition>
            </div>
        </li>
    )
};

let nodeShape = {
    id: PropTypes.string,
    name: PropTypes.string,
};
nodeShape.childNodes = PropTypes.arrayOf(PropTypes.shape(nodeShape));

TreeNode.propTypes = {
    node: PropTypes.shape(nodeShape).isRequired,
    selectedItem: PropTypes.shape(nodeShape),
    onSelected: PropTypes.func,
    cellContentRenderer: PropTypes.func
};

export default TreeNode;