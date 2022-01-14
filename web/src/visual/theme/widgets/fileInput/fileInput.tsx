import React, {Component, createRef} from 'react';
import './fileInput.css';
import {UploadSVG} from "../../svgs/uploadSVG";
import {bindInstanceMethods} from "../../../../framework/extras/typeUtils";
import {FileInputProps, FileInputState} from "./fileInputModel";

class FileInput extends Component<FileInputProps, FileInputState>  {
	private readonly fileInputRef: React.RefObject<HTMLInputElement>;
	constructor(props: FileInputProps | Readonly<FileInputProps>) {
		super(props);

		bindInstanceMethods(this);


		this.state = {
			isDragging: false
		}

		this.fileInputRef = createRef();
	}

	_onInputChanged(event: { target: { files: any; }; }) {
		const { onSelected } = this.props;

		if (onSelected) {
			onSelected(event.target.files);
		}

		this.setIsDragging(false);

		if (this.fileInputRef.current) {
			this.fileInputRef.current.value = "";
		}
	}

	_dragEnter(event: { preventDefault: () => void; }) {
		event.preventDefault();
		this.setIsDragging(true);
	}

	_dragLeave(event: { preventDefault: () => void; }) {
		event.preventDefault();
		this.setIsDragging(false);
	}

	_dragOver(event: { preventDefault: () => void; }) {
		event.preventDefault();

		if (!this.isDragging()) {
			this.setIsDragging(true);
		}
	}

	isDragging() {
		const { isDragging=false } = this.state;
		return isDragging;
	}

	setIsDragging(value: boolean) {
		this.setState({
			...this.state,
			isDragging: value
		})
	}

	render() {
		const { className, selected } = this.props;

		const { isDragging } = this.state;

		let cn = 'file-input d-flex flex-column border border-dark border-xlg border-dashed position-relative';

		if (className) {
			cn += className;
		}

		if (isDragging) {
			cn += ' drag-hover';
		}

		return (
			<div className={cn} onDragOver={this._dragOver} onDragLeave={this._dragLeave}>
				<div className={'d-flex flex-column v-gap-4 p-5 align-items-center header-1'}>
					<UploadSVG className={'medium-image-container file-input-svg'} />
					<div>Drop Documents Here</div>
					<div className={'text-decoration-underline file-input-browse-text'}>Click to Browse</div>
				</div>
				<input id="fileInputField" key={selected} className={'position-absolute w-100 h-100'}
					   multiple
					   type="file"
					   ref={this.fileInputRef}
					   title=""
					   onChange={this._onInputChanged}
					   accept={"application/msword," +
						   "application/vnd.ms-word.document.macroEnabled.12," +
						   "application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
						   "application/vnd.openxmlformats-officedocument.wordprocessingml.template," +
						   "application/vnd.ms-word.template.macroEnabled.12," +
						   "text/html," +
						   "application/pdf," +
						   "application/vnd.ms-powerpoint.template.macroEnabled.12," +
						   "application/vnd.openxmlformats-officedocument.presentationml.template," +
						   "application/vnd.ms-powerpoint.addin.macroEnabled.12," +
						   "application/vnd.openxmlformats-officedocument.presentationml.slideshow," +
						   "application/vnd.ms-powerpoint.slideshow.macroEnabled.12," +
						   "application/vnd.ms-powerpoint," +
						   "application/vnd.ms-powerpoint.presentation.macroEnabled.12," +
						   "application/vnd.openxmlformats-officedocument.presentationml.presentation," +
						   "application/rtf," +
						   "text/rtf," +
						   "text/plain," +
						   "text/csv," +
						   "application/csv," +
						   "application/json," +
						   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet," +
						   "application/vnd.ms-excel.sheet.binary.macroEnabled.12," +
						   "application/vnd.ms-excel," +
						   "application/vnd.ms-excel.sheet.macroEnabled.12," +
						   "image/bmp," +
						   "image/gif," +
						   "image/jpeg," +
						   "image/png," +
						   "multipart/form-data"}
				/>
			</div>
		);
	}
}

export default FileInput;
