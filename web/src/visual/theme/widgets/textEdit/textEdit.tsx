import React, {Component, createRef} from 'react';
import './textEdit.css';
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";
import {TextEditProps, TextEditState} from "./textEditModel";

let tooltip = 0;

class TextEdit extends Component<TextEditProps, TextEditState> {
	private readonly inputRef: { current: any };

	constructor(props: any) {
		super(props);

		bindInstanceMethods(this);

		this.state = {
			tmpValue: props.value ? props.value : '',
			tooltipId: `textedit-${tooltip}`,
			isHover: false,
			cancelHover: true
		}

		this.inputRef = createRef();

		tooltip++;
	}

	componentDidUpdate(prevProps: Readonly<TextEditProps>, prevState: Readonly<TextEditState>, snapshot?: any) {
		const { value } = this.props;

		if (this.inputRef.current) {
			// this.inputRef.current.focus();//TODO this line was causing a bug where last text edit in a panel was always getting focused
			this.inputRef.current.addEventListener("focusout",  this.submit);
		}

		if (prevProps.value !== value) {
			this.setTmpValue(value ? value : "");
		}
	}

	submit() {
		const {tmpValue } = this.state;
		const { value, onSubmit, name } = this.props;

		if (value !== tmpValue) {
			if (onSubmit) onSubmit(name ? name : "", tmpValue);
		}
	};

	cancel() {
		const { value, onCancel } = this.props;

		this.setState({
			...this.state,
			tmpValue: value ? value : "",
		});

		// revert the value
		if (onCancel) onCancel();
	};

	setTmpValue(tmpValue: string) {
		this.setState({
			...this.state,
			tmpValue
		})
	}

	handleChange(e: React.ChangeEvent<HTMLInputElement>) {

		const { onChange } = this.props;

		this.setState({
			...this.state,
			tmpValue: e.target.value
		});

		if (onChange) {
			onChange(e.target.value);
		}
	};

	onKeyPress(e: { key: string; }) {
		switch (e.key.toUpperCase()) {
			case 'ENTER':
				this.submit();
				break;
			case 'ESCAPE':
				this.cancel();
				break;
		}
	}

	render() {
		const { placeholder, dirty, className, disable, value, type='text', autoFocus=false, edit } = this.props;

		const { tmpValue } = this.state;

		let cn = 'text-edit position-relative';

		if (className) {
			cn += ` ${className}`;
		}

		if (edit) {
			cn += ` edit`;
		}

		if (dirty) {
			cn += ` dirty`;
		}

		if (disable) {
			cn += ` disabled`;
		}

		return (
			<div className={cn}>
				<input  type={type} className={'position-absolute h-100 w-100'}
						ref={this.inputRef}
						placeholder={placeholder}
						value={tmpValue}
						onKeyUp={this.onKeyPress}
						onChange={this.handleChange}
						disabled={disable}
						autoFocus={autoFocus}
				>
				</input>
			</div>
		);
	}
}

export default TextEdit;
