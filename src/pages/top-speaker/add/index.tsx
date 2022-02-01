import React, { useEffect, useState } from "react";
import ImageCanvas from "../../../components/image-canvas";
import RichTextEditor from "react-rte";
import { ToolBarConfig } from "../../../constants";
import { createTopSpeaker, getTopSpeakers } from "../../../store/top-speaker-store/topSpeakerActions";
import { useDispatch, useSelector } from "react-redux";
import { ITopSpeakerFormData, ITopSpeakerState } from "../../../interfaces";

let formData: ITopSpeakerFormData = {
	imageSrc: null,
	topSpeakerName: null,
	description: null,
};

const initialState: ITopSpeakerState = {
	topSpeakerId: "",
	isFormNotValid: false,
	imageSrc: null,
	topSpeakerName: "",
	description: "",
};

const AddTopSpeaker: React.FC = () => {
	const dispatch = useDispatch();
	const state = useSelector((state) => state.topSpeakerReducer);
	const [editor, setEditor] = useState(() => RichTextEditor.createEmptyValue());
	const [
		{
			topSpeakerName,
			description,
			imageSrc,
			isFormNotValid,
		},
		setState,
	] = useState(initialState);

	useEffect(() => {
		dispatch(getTopSpeakers());
		closeModal();
	}, [state.addTopSpeaker, dispatch]);

	const closeModal = () => {
		setState({ ...initialState });
		setEditor(RichTextEditor.createEmptyValue());
		$("#addTopSpeakerModal").modal("hide");
	};

	const onChange = (event: any) => {
		const { name, value } = event.target;
		setState((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleImage = (data: any) => {
		setState((prevState) => ({ ...prevState, imageSrc: data }));
	};

	const handleDescription = (value: any) => {
		setEditor(value);
		const isEmpty = !value.getEditorState().getCurrentContent().getPlainText().trim();

		if (isEmpty) {
			setState((prevState) => ({
				...prevState,
				description: null,
			}));
		} else {
			setState((prevState) => ({
				...prevState,
				description: value.toString("html"),
			}));
		}
	};

	// Form Validation
	const validateForm = () => {
		const data = {
			imageSrc: imageSrc ? imageSrc : null,
			topSpeakerName: topSpeakerName && topSpeakerName.trim().length > 0 ? topSpeakerName : null,
			description: description && description.trim().length > 0 ? description : null,
		};

		formData = Object.assign({}, data);
		return true;
	};

	// Form Submission
	const onSubmit = (event: any) => {
		event.preventDefault();

		const isFormValid = validateForm();

		if (isFormValid) {
			let data = Object.values(formData).map((item) => {
				return item !== null;
			});

			if (!data.includes(false)) {
				setState((prevState) => ({ ...prevState, isFormNotValid: false }));

				let topSpeakerFormData = new FormData();
				topSpeakerFormData.append("topSpeakerImage", imageSrc); //need to recheck
				topSpeakerFormData.append("title", topSpeakerName as string);
				topSpeakerFormData.append("description", description as string);

				dispatch(createTopSpeaker(topSpeakerFormData));
			} else {
				setState((prevState) => ({ ...prevState, isFormNotValid: true }));
			}
		}
	};

	return (
		<div
			className="modal fade"
			id="addTopSpeakerModal"
			tabIndex={-1}
			data-mdb-backdrop="static"
			data-mdb-keyboard="false"
			aria-labelledby="addTopSpeakerModalLabel"
			aria-hidden="true"
		>
			<div className="modal-dialog modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="addTopSpeakerModalLabel">
							Add New Top Speaker
						</h5>
						<button type="button" className="btn-close" onClick={closeModal}></button>
					</div>
					<div className="modal-body add-topSpeaker">
						<ImageCanvas width={300} height={300} getEditedImage={handleImage} />
						<div className="d-flex justify-content-center">
							{formData.imageSrc === null && isFormNotValid ? (
								<span className="text-danger validation-message my-2">Top speaker image is required</span>
							) : null}
						</div>

						<div className="mx-5">
							<div className="form-group row my-3">
								<label className="col-sm-3 col-form-label form-label text-dark">
									<i className="far fa-file-alt fa-sm" />
									&nbsp;Top Speaker Title
								</label>
								<div className="col-sm-9">
									<input
										type="text"
										name="topSpeakerName"
										value={topSpeakerName as string}
										className="form-control"
										onChange={onChange}
									/>
									{formData.topSpeakerName === null && isFormNotValid ? (
										<span className="text-danger validation-message">Event name is required</span>
									) : null}
								</div>
							</div>

							<div className="form-group row my-3">
								<label className="col-sm-12 col-form-label form-label text-dark">
									<i className="fas fa-align-left" />
									&nbsp;Description
								</label>
								<div className="col-sm-12">
									<RichTextEditor
										value={editor}
										onChange={handleDescription}
										toolbarClassName="description"
										editorClassName="description"
										toolbarConfig={ToolBarConfig}
									/>
									{formData.description === null && isFormNotValid ? (
										<span className="text-danger validation-message">Description is required</span>
									) : null}
								</div>
							</div>
						</div>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-light shadow-none btn-rounded" onClick={closeModal}>
							Cancel
						</button>
						<button type="button" className="btn btn-primary shadow-none btn-rounded" onClick={onSubmit}>
							Submit
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddTopSpeaker;
