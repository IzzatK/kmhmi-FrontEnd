import React, {Component} from "react";
import './treeView.css';
import {CSSTransition} from "react-transition-group";
import {TreeViewProps, TreeViewState} from "./treeViewModel";
import {TriangleSVG} from "../../svgs/triangleSVG";
import {CircleSVG} from "../../svgs/circleSVG";

class TreeNode extends Component<TreeViewProps, TreeViewState> {
    constructor(props: any) {
        super(props);

        this.state = {
            expanded: false,
        }
    }

    _setExpanded(expanded: boolean) {
        this.setState({
            ...this.state,
            expanded: expanded,
        })
    }

    _toggleExpanded() {
        const { node } = this.props;
        const { childNodes } = node;

        const { expanded } = this.state;

        if (childNodes && childNodes.length > 0) {
            this._setExpanded(!expanded);
        }
    }

    _onSelected(node: any) {
        const { onSelected } = this.props;
        const { childNodes } = node;

        const { expanded } = this.state;

        if (onSelected && !expanded) {
            onSelected(node);
        }


        this._setExpanded(!expanded);
    }

    render() {
        const { node, className, selectionPaths, onSelected, cellContentRenderer, index, ...rest } = this.props;
        const { childNodes } = node;
        const { expanded } = this.state;

        let divs = [];

        let childIndex = index || 0;

        if (childNodes) {
            divs = childNodes.map((childNode: any) => {
                return (
                    <TreeNode key={childNode.id}
                              node={childNode}
                              onSelected={onSelected}
                              selectionPaths={selectionPaths}
                              cellContentRenderer={cellContentRenderer}
                              index={childIndex + 1}
                    />
                )
            });
        }

        let cn = `${className ? className : ''} tree-node`;
        if (index === 0) {
            cn += ` first-child`;
        }
        if (selectionPaths && selectionPaths === node.path) {
            cn += ` selected`;
        }
        if (expanded) {
            cn += ` expanded`;
        }

        return (
            <li className={cn} {...rest}>
                <div className={"tree-node-graphic"}>
                    <div className={"tree-node-disclosure"} onClick={() => this._toggleExpanded()}>
                        <div className={"nano-image-container"}>
                            {(childNodes && childNodes.length > 0) ?
                                <TriangleSVG/> : <CircleSVG/>
                            }
                        </div>
                    </div>
                    <div className={`tree-node-content ${(expanded || (selectionPaths && selectionPaths === node.path)) && index !== 0 ? "font-weight-semi-bold" : ""}`} onClick={() => this._onSelected(node)}>
                        {
                            cellContentRenderer ? cellContentRenderer(node, childNodes && childNodes.length > 0 && expanded) :
                                <div className={`node-title`}>{node.name ? node.name : "n/a"}</div>
                        }
                    </div>
                </div>

                <div className={"tree-node-children-container"}>
                    <CSSTransition in={expanded} timeout={300} classNames={"tree-node-children"} unmountOnExit={true}>
                        <ul className={"tree-node-children"}>
                            {divs}
                        </ul>
                    </CSSTransition>
                </div>
            </li>
        )
    }
}

export default TreeNode;
