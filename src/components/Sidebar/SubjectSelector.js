import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { fetchSubjects } from '../../services/api';
import LoadingSpinner from '../common/loadingSpinner';
import ErrorDisplay from '../common/ErrorDisplay';

const SubjectSelector = () => {
    const { state, dispatch } = useAppContext();
    const { subjects, selectedSubject, isLoadingSubjects } = state;

    useEffect(() => {
        const loadSubjects = async () => {
            dispatch({ type: 'FETCH_SUBJECTS_START' });
            try {
                const fetchedSubjects = await fetchSubjects();
                dispatch({ type: 'FETCH_SUBJECTS_SUCCESS', payload: fetchedSubjects });
                // Optionally select the first subject by default
                if (!selectedSubject && fetchedSubjects.length > 0) {
                   // dispatch({ type: 'SELECT_SUBJECT', payload: fetchedSubjects[0] });
                }
            } catch (error) {
                dispatch({ type: 'FETCH_SUBJECTS_FAIL', payload: error.message || 'Failed to load subjects' });
            }
        };
        loadSubjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]); // Run once on mount

    const handleChange = (event) => {
        dispatch({ type: 'SELECT_SUBJECT', payload: event.target.value });
        // Selecting a subject might clear the current chat, or you might filter chats later
        // For simplicity now, selecting subject doesn't auto-clear chat
         dispatch({ type: 'SELECT_CHAT', payload: null }); // Clear chat selection when subject changes
    };

    return (
        <div className="subject-selector">
            <h4>Select Subject</h4>
            <ErrorDisplay context="subjects" />
            {isLoadingSubjects ? (
                <LoadingSpinner />
            ) : (
                <select value={selectedSubject || ''} onChange={handleChange} disabled={subjects.length === 0}>
                    <option value="" disabled>-- Select a Subject --</option>
                    {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default SubjectSelector;