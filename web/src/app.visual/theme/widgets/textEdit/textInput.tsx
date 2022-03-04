import React, {Component} from 'react';
import './textEdit.css';
import {bindInstanceMethods} from "../../../../framework.core/extras/typeUtils";
import {TextEditProps, TextEditState} from "./textEditModel";

class TextInput extends Component<TextEditProps, TextEditState> {

	constructor(props: any) {
		super(props);

		bindInstanceMethods(this);
	}

	_onChange(event: { target: { value: any; }; }) {
		const { onChange } = this.props;

		if (onChange) {
			onChange(event.target.value);
		}
	}

	render() {

		const {className, placeholder, value = '', onKeyUp, disable} = this.props;

		let cn = 'text-input font-weight-semi-bold';
		if (className) {
			cn += ` ${className}`;
		}

		if (disable) {
			cn += ` disabled`;
		}

		return (
			<input type="text" className={cn}
				   placeholder={placeholder !== undefined ? placeholder : "Enter Text Here"}
				   value={value}
				   onKeyUp={onKeyUp}
				   disabled={disable}
				   onChange={this._onChange}>
			</input>
		);
	}
}

export default TextInput;
