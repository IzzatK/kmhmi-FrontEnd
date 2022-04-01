import React, {Component, createRef} from 'react';
import './textEdit.css';
import {bindInstanceMethods} from "../../../../framework.core/extras/utils/typeUtils";
import {TextEditProps, TextEditState} from "./textEditModel";

class TextEdit extends Component<TextEditProps, TextEditState> {
	private readonly inputRef: { current: any };

	constructor(props: any) {
		super(props);

		bindInstanceMethods(this);

		this.state = {
			tmpValue: props.value ? props.value : '',
			tooltipId: "",
			isHover: false,
			cancelHover: true
		}

		this.inputRef = createRef();
	}

	componentDidMount() {
		const { id } = this.props;

		if (id) {
			this.setState({
				...this.state,
				tooltipId: id + "_tooltip",
			})
		}

		if (this.inputRef.current && !this.props.manualFocus ) {
			this.inputRef.current.addEventListener("focusout",  this._onSubmit);
		}
	}

	componentDidUpdate(prevProps: Readonly<TextEditProps>, prevState: Readonly<TextEditState>, snapshot?: any) {
		const { value } = this.props;

		if (prevProps.value !== value) {
			this._setTmpValue(value ? value : "");
		}
	}

	_onSubmit() {
		const { tmpValue } = this.state;
		const { value, onSubmit, name } = this.props;

		if (value !== tmpValue) {
			if (onSubmit) {
				onSubmit(name ? name : "", tmpValue);
			}
		}
	};

	_onCancel() {
		const { value, onCancel } = this.props;

		this.setState({
			...this.state,
			tmpValue: value ? value : "",
		});

		// revert the value
		if (onCancel) {
			onCancel();
		}
	};

	_setTmpValue(tmpValue: string) {
		this.setState({
			...this.state,
			tmpValue
		})
	}

	_handleChange(e: React.ChangeEvent<HTMLInputElement>) {

		const { onChange } = this.props;

		this.setState({
			...this.state,
			tmpValue: e.target.value
		});

		if (onChange) {
			onChange(e.target.value);
		}
	};

	_onKeyPress(e: { key: string; }) {
		switch (e.key.toUpperCase()) {
			case 'ENTER':
				this._onSubmit();
				break;
			case 'ESCAPE':
				this._onCancel();
				break;
		}
	}

	private static onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		event.stopPropagation();
	}

	render() {
		const { placeholder, dirty, className, disable, type='text', autoFocus=false, edit=true, id } = this.props;

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
				<input
					type={type}
					className={'position-absolute h-100 w-100'}
					ref={this.inputRef}
					placeholder={placeholder}
					value={tmpValue}
					onClick={TextEdit.onClick}
					onKeyUp={this._onKeyPress}
					onChange={this._handleChange}
					readOnly={!edit}
					disabled={disable || !edit}
					autoFocus={edit && autoFocus}
					id={id}
				>
				</input>
			</div>
		);
	}
}

export default TextEdit;
