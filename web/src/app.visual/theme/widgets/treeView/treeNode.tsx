import React, {Component} from "react";
import './treeView.css';
import {CSSTransition} from "react-transition-group";
import {TreeNodeProps, TreeNodeState} from "./treeViewModel";
import {TriangleSVG} from "../../svgs/triangleSVG";
import {CircleSVG} from "../../svgs/circleSVG";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";

class TreeNode extends Component<TreeNodeProps, TreeNodeState> {
    constructor(props: any) {
        super(props);

        this.state = {
            expanded: false,
        }
        bindInstanceMethods(this);
    }


    componentDidMount() {
       this.syncPropsToState();
    }

    componentDidUpdate(prevProps: Readonly<TreeNodeProps>, prevState: Readonly<TreeNodeState>, snapshot?: any) {
        this.syncPropsToState()
    }


    componentWillUnmount() {
        if (this.props.node != null) {

            if (this.props.selectionPath == this.props.node.path) {
                if (this.props.onSelected != null) {
                    this.props.onSelected(null);
                }
            }
        }
    }

    syncPropsToState() {
        const { node } = this.props;
        if (node != null) {
            if (node.expanded != null && node.expanded != this.state.expanded) {
                this._setExpanded(node.expanded);
            }
        }
    }

    _setExpanded(expanded: boolean) {
        if (this.props.node != null && this.props.node.childNodes != null && this.props.node.childNodes.length > 0) {
            this.setState({
                ...this.state,
                expanded: expanded,
            }, () => {
                if (this.props.onToggle != null) {
                    if (this.props.node != null && this.props.node.expanded != this.state.expanded) {
                        this.props.onToggle(this.props.node, this.state.expanded);
                    }
                }
            });
        }
    }

    _toggleExpanded() {
        const { node, } = this.props;
        const { childNodes } = node;

        const { expanded } = this.state;

        const nextExpanded = !expanded;

        if (childNodes && childNodes.length > 0) {
            this._setExpanded(nextExpanded);
        }
    }

    _onSelected(node: any) {
        const { onSelected } = this.props;

        const { expanded } = this.state;

        if (this.props.node != null) {

            if (this.props.selectionPath !== this.props.node.path) {
                if (onSelected != null) {
                    onSelected(node);
                }
            }

            if (!expanded) {
                this._setExpanded(true);
            }
        }


    }

    render() {
        const { node, className, selectionPath, onSelected, onToggle, cellContentRenderer, index, ...rest } = this.props;
        const { childNodes } = node;
        const { expanded } = this.state;

        let divs: JSX.Element[] = [];

        let childIndex = index || 0;

        if (childNodes != null) {
            divs = childNodes.map((childNode: any) => {
                return (
                    <TreeNode key={childNode.id}
                              node={childNode}
                              onSelected={onSelected}
                              onToggle={onToggle}
                              selectionPath={selectionPath}
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

        let selected = false;
        if (selectionPath != null && selectionPath === node.path) {
            selected = true;
        }

        if (selected) {
            cn += ` selected`;
        }

        if (expanded) {
            cn += ` expanded`;
        }

        return (
            <li className={cn} {...rest}>
                <div className={"tree-node-graphic"}>
                    <div className={"tree-node-disclosure"} onClick={this._toggleExpanded}>
                        <div className={"nano-image-container"}>
                            {(childNodes && childNodes.length > 0) ?
                                <TriangleSVG/> : <CircleSVG/>
                            }
                        </div>
                    </div>
                    <div className={`tree-node-content ${expanded || selected && index !== 0 ? "font-weight-semi-bold" : ""}`} onClick={() => this._onSelected(node)}>
                        {
                            cellContentRenderer ? cellContentRenderer(node) :
                                <div className={`node-title`}>{node.title ? node.title : "n/a"}</div>
                        }
                    </div>
                </div>

                <div className={"tree-node-children-container"}>
                    <CSSTransition in={expanded} timeout={expanded ? 300: 300} classNames={"tree-node-children"} unmountOnExit={true}>
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
