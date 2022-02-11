import React, {Component} from "react";
import './comboBox.css';
import {ArrowDownSVG} from "../../svgs/arrowDownSVG";
import {ArrowUpSVG} from "../../svgs/arrowUpSVG";
import ComboBoxItem from "./comboBoxItem";
import Portal from "../portal/portal";
import {forEachKVP} from "../../../../framework.visual/extras/utils/collectionUtils";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";
import {ComboBoxProps, ComboBoxState} from './comboBoxModel';
import Button from "../button/button";

class ComboBox extends Component<ComboBoxProps, ComboBoxState> {
    timeout = null;

    constructor(props: ComboBoxProps | Readonly<ComboBoxProps>) {
        super(props);

        this.state = {
            selected: false,
            selectedItemIds: [],
        }

        bindInstanceMethods(this);
    }

    _onClickHandler = () => {
        const { onClick } = this.props;
        const { selected } = this.state;

        if (selected) {
            this._close();
        }
        else {
            this._open();
        }

        if (onClick) {
            onClick();
        }
    };

    _onSelectHandler(id: string) {
        const { onSelect, multiSelect } = this.props;
        const { selectedItemIds } = this.state;

        if (multiSelect) {

            let selectedItems = new Set<string>(selectedItemIds);

            if (selectedItems.has(id)) {
                selectedItems.delete(id);
            } else {
                selectedItems.add(id);
            }

            this.setState(prevState => {
                return {
                    ...prevState,
                    selectedItemIds: Array.from(selectedItems),
                }

            }, () => {
                if (onSelect) {
                    const { selectedItemIds } = this.state;
                    onSelect(selectedItemIds);
                }
            })
        } else {
            this.setState(prevState => {
                return {
                    ...prevState,
                    selectedItemIds: [id],
                }

            }, () => {
                this._close();
                if (onSelect) {
                    onSelect(id);
                }
            })
        }
    }

    _clear() {
        const { onSelect } = this.props;

        this.setState({
            ...this.state,
            selectedItemIds: [],
        }, () => {
            if (onSelect) {
                const { selectedItemIds } = this.state;
                let tmpArray = Object.keys(selectedItemIds);
                onSelect(Array.from(tmpArray));
            }
        })
    }

    _open() {
        this.setState({
            ...this.state,
            selected: true,
        });
    }

    _close() {
        this.setState({
            ...this.state,
            selected: false,
        });
    }


    componentDidUpdate(prevProps: Readonly<ComboBoxProps>, prevState: Readonly<ComboBoxState>, snapshot?: any) {

        if (this.props.selectedItemIds != null && this.props.selectedItemIds != this.state.selectedItemIds) {
            this.setState({
                ...this.state,
                selectedItemIds: this.props.selectedItemIds
            })
        }
    }

    render() {
        const {className, id, title, onSelect, items, graphic:Graphic, disable, light, dirty, multiSelect, readonly, ...rest} = this.props;

        const { selected } = this.state;

        let cn = "combo-box";

        let lcn = "w-100 list-items";

        if (className) {
            cn += ` ${className}`;
        }

        if (light) {
            cn += ` light`
            lcn += ` light`;
        }

        if (dirty) {
            cn += ` dirty`;
        }

        if (selected) {
            cn += ` selected`;
        }

        if (disable) {
            cn += ` disabled`;
        }

        let cbTitle = title;

        let comboBoxItems: any[] = [];

        if (items) {
            const { selectedItemIds } = this.state;

            forEachKVP(items, (itemKey: string, itemValue: { id: string; title: string; selected: boolean; }) => {
                const { id:itemId, title:itemTitle, selected:itemSelected } = itemValue;

                let value = false;
                if (selectedItemIds && selectedItemIds.includes(itemId) || title === itemTitle) {
                    value = true;
                }

                comboBoxItems.push(
                    <ComboBoxItem className={'d-flex'} key={itemId} title={itemTitle} multiSelect={multiSelect}
                                  onClick={() => this._onSelectHandler(itemId || "")} selected={value} readonly={readonly}/>
                )
            });

            if (Array.isArray(selectedItemIds) && selectedItemIds.length > 1) {
                cbTitle = `${cbTitle} (${selectedItemIds.length})`
            }
        }

        let arrowSVG = <ArrowDownSVG/>;
        if (selected) {
            arrowSVG = <ArrowUpSVG/>;
        }

        return (
            <div>
                <Portal
                    isOpen={selected}
                    zIndex={9999}
                    enterClass={'growVertical'}
                    exitClass={'shrinkVertical'}
                    timeout={200}
                    onShouldClose={this._onClickHandler}
                    portalContent={
                        <div className={`position-absolute w-100 ${multiSelect ? "" : "shadow"}`}>
                            <ul className={lcn}>
                                {comboBoxItems}
                            </ul>
                            {
                                multiSelect &&
                                <div className={"d-flex bg-advisory p-2 justify-content-center shadow"}>
                                    <Button className={"clear-button"} light={true} text={"Clear"} onClick={() => this._clear()}/>
                                </div>

                            }
                        </div>

                    }>
                    <div className={cn} {...rest} tabIndex={0}>
                        <div onClick={disable ? undefined : this._onClickHandler} className={"list-cell h-gap-1 w-100 d-flex align-items-center justify-content-between"}>
                            {
                                Graphic &&
                                <Graphic className={'small-image-container mr-3'}/>
                            }
                            <div className={"header-3 flex-fill"}>{cbTitle}</div>
                            {
                                Graphic === undefined &&
                                <div className={"d-flex align-items-center tiny-image-container combo-box-arrow pe-none"}>{arrowSVG}</div>
                            }
                        </div>
                    </div>
                </Portal>
            </div>
        );
    }
}

export default ComboBox;
