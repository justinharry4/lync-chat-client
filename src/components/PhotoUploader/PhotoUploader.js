import axios from "axios";

import Component from "../Component/Component.js";

import './PhotoUploader.css';

class PhotoUploader extends Component {
    localContext(){
        return {
            onSubmit: this.submitImageForm.bind(this),
            onSelect: this.toggleUploadButton.bind(this),
        }
    }

    toggleUploadButton(e){
        let $imageInput = $(e.target);
        let $uploadForm = $imageInput.closest('form');
        let $uploadBtn = $uploadForm.find('#photo-form-container__submit-btn');
        
        let isSelected = $imageInput.get(0).files.length > 0
        if (!isSelected){
            $uploadBtn.get(0).disabled = true;
            $uploadBtn.addClass('disabled');
        } else {
            $uploadBtn.get(0).disabled = false;
            $uploadBtn.removeClass('disabled');
        }

        console.log('input changed');
    }

    uploadImage(image){
        let apiURL = 'http://localhost:8000/chat/profiles/1/photos/';

        let data = new FormData();
        data.append('image', image);

        let promise = axios.post(apiURL, data, {
            headers: {'Content-Type': 'multipart/form-data'}
        });

        return promise;
    }

    async submitImageForm(e){
        e.preventDefault();

        let $imageInput = $(e.target).find('#photo-form-container__image');
        let image = $imageInput.get(0).files[0];

        try {
            let response = await this.uploadImage(image);
            console.log(response);
        } catch (error){
            console.log('REQUEST FAILED!');
            console.log(error);
            let message = error.response.data.image[0];
            console.log(message);
        }

        console.log('image uploaded!');
    }

    view(){
        return `
            <div id="photo-form-container">
                <h2>Upload a profile photo</h2>
                <form lf--submit:onSubmit--fl>
                    <input
                        lf--change:onSelect--fl
                        type="file"
                        name="image"
                        value="Select Image"
                        id="photo-form-container__image"
                    >
                    <button 
                        type="submit"
                        id="photo-form-container__submit-btn"
                        class="disabled"
                        disabled>
                            Upload
                        </button>
                </form>
            </div>
        `
    }
}

export default PhotoUploader