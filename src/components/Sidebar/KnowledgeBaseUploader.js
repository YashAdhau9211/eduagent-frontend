import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { uploadKnowledgeBase } from '../../services/api';
import LoadingSpinner from '../common/loadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';

const KnowledgeBaseUploader = () => {
    const { state, dispatch } = useAppContext();
    const { selectedSubject, isUploadingKb } = state;
    const [files, setFiles] = useState([]);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files));
        setUploadSuccess(null); 
        dispatch({ type: 'CLEAR_ERROR' }); 
    };

    const handleUpload = async () => {
        if (!selectedSubject || files.length === 0) return;

        dispatch({ type: 'KB_UPLOAD_START' });
        setUploadSuccess(null);
        try {
            const response = await uploadKnowledgeBase(selectedSubject, files);
            dispatch({ type: 'KB_UPLOAD_SUCCESS', payload: response });
            setUploadSuccess(response.message || `Knowledge base for ${selectedSubject} updated successfully!`);
            setFiles([]); // Clear selection
            if(fileInputRef.current) fileInputRef.current.value = ""; 
        } catch (error) {
            dispatch({ type: 'KB_UPLOAD_FAIL', payload: error.message || 'Failed to upload files' });
        }
    };

    return (
        <div className="kb-uploader">
            <h4>Knowledge Base (PDFs)</h4>
             <ErrorDisplay context="kb_upload" />
             {uploadSuccess && <p style={{ color: 'green' }}>{uploadSuccess}</p>}
            <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileChange}
                disabled={!selectedSubject || isUploadingKb}
                ref={fileInputRef}
            />
            <button
                onClick={handleUpload}
                disabled={!selectedSubject || files.length === 0 || isUploadingKb}
            >
                {isUploadingKb ? <><LoadingSpinner size="16px" /> Uploading...</> : 'Upload/Update KB'}
            </button>
            {!selectedSubject && <p><small>Please select a subject first.</small></p>}
        </div>
    );
};

export default KnowledgeBaseUploader;