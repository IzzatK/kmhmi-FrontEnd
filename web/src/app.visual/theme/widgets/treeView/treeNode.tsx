import React, {Component} from "react";
import './treeView.css';
import {CSSTransition} from "react-transition-group";
import {TreeNodeProps, TreeNodeState} from "./treeViewModel";
import {TriangleSVG} from "../../svgs/triangleSVG";
import {CircleSVG} from "../../svgs/circleSVG";
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import {forEach} from "../../../../framework.core/extras/utils/collectionUtils";

class TreeNode extends Component<TreeNodeProps, TreeNodeState> {
    constructor(props: any) {
        super(props);

        this.state = {
            expanded: false,
            selected: false // computed property
        }
        bindInstanceMethods(this);
    }


    componentDidMount() {
        let dirty = false;
        let expanded = false;
        let selected = false;

        const { node, expandedPaths, selectionPath } = this.props;

        if (node != null) {
            forEach(expandedPaths, (path: string) => {
                if (path.includes(node.path)) {
                    expanded = true;
                    dirty = true;
                }
            });

            if (selectionPath == node.path) {
                selected = true;
                expanded = true;
                dirty = true;
            }
        }

        if (dirty) {
            this.setState({
                expanded,
                selected
            })
        }
    }

    componentDidUpdate(prevProps: Readonly<TreeNodeProps>, prevState: Readonly<TreeNodeState>, snapshot?: any) {
        let dirty = false;
        let expanded = this.state.expanded;
        let selected = this.state.selected;

        if (prevProps != this.props) {
            if (prevProps.expandedPaths !== this.props.expandedPaths) {
                const { node } = this.props;
                if (node != null) {
                    if (this.hasChildren()) {
                        forEach(this.props.expandedPaths, (path: string) => {
                            if (path.includes(node.path)) {
                                dirty = true;
                                expanded = true;
                                return true;
                            }
                        });
                    }
                }
            }

            if (prevProps.selectionPath !== this.props.selectionPath) {
                dirty = true;
                if (this.props.node != null) {
                    if (this.props.selectionPath == this.props.node.path) {
                        selected = true;
                        if (this.hasChildren()) {
                            expanded = true;
                        }
                    }
                    else {
                        selected = false;
                    }
                }
            }
        }

        if (dirty) {
            this.setState({
                expanded,
                selected
            });
        }
    }

    private hasChildren(): boolean {
        let result = false;
        if (this.props.node != null && this.props.node.childNodes != null && this.props.node.childNodes.length > 0) {
            result = true;
        }
        return result;
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

    _toggleExpanded() {
        const { expanded, selected } = this.state;
        const nextExpanded = !expanded;
        const nextSelected = !selected;

        if (this.hasChildren()) {
            this.setState({
                ...this.state,
                expanded: nextExpanded,
            }, () => {
                // when local properties have changed, call handlers
                if (this.props.onToggle != null) {
                    this.props.onToggle(this.props.node, this.state.expanded);
                }
            });
        } else {
            this.setState({
                ...this.state,
                selected: nextSelected,
            }, () => {
                if (this.props.onToggle != null) {
                    this.props.onToggle(this.props.node, this.state.selected);
                }
            })
        }
    }

    _onSelected() {
        if (this.props.showDisclosure) {
            if (this.props.onSelected != null) {
                this.props.onSelected(this.props.node);

                if (!this.state.expanded) {
                    this._toggleExpanded();
                }
            }
        }
        else {
            this._toggleExpanded();
        }
    }

    render() {
        const { node, className, selectionPath, expandedPaths, onSelected, onToggle, cellContentRenderer, showDisclosure, index, ...rest } = this.props;
        const { childNodes } = node;
        const { expanded, selected } = this.state;

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
                              expandedPaths={expandedPaths}
                              cellContentRenderer={cellContentRenderer}
                              index={childIndex + 1}
                              showDisclosure={showDisclosure}
                    />
                )
            });
        }

        let cn = `${className ? className : ''} tree-node`;
        if (index === 0) {
            cn += ` first-child`;
        }

        if (selected) {
            cn += ` selected`;
        }

        if (expanded) {
            cn += ` expanded`;
        }

        if (!divs || divs.length == 0) {
            cn += ` no-children`;
        }

        return (
            <li className={cn} {...rest}>
                <div className={"tree-node-graphic"}>
                    {
                        showDisclosure &&
                        <div className={"tree-node-disclosure"} onClick={this._toggleExpanded}>
                            <div className={"nano-image-container"}>
                                {(childNodes && childNodes.length > 0) ?
                                    <TriangleSVG/> : <CircleSVG/>
                                }
                            </div>
                        </div>
                    }
                    <div className={`tree-node-content ${expanded || selected && index !== 0 ? "font-weight-semi-bold" : ""}`} onClick={this._onSelected}>
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
