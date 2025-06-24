import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import 'react-tooltip/dist/react-tooltip.css'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CandidateProfileCard from '../../Components/Candidates/CandidateProfileCard';
import CandidateTabs from '../../Components/Candidates/CandidateTabs';
import CandidateProfileHeader from '../../Components/Candidates/CandidateProfileHeader';
import SendEmailForm from '../../Components/Candidates/SendEmailForm';
import SendTextMessageForm from '../../Components/Candidates/SendTextMessageForm';
import SubmitReviewForm from '../../Components/Candidates/SubmitReviewForm';
import { useSnackbar } from "../../../Dashboard/Components/SnackbarContext";
import JobOverviewCard from '../../Components/Candidates/JobOverviewCard';


export default function CandidateProfile() {
    const [activeTab, setActiveTab] = useState('Profile');
    const { id } = useParams();
    const [candidateData, setCandidateData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [stage, setStage] = useState('');
    const [activeForm, setActiveForm] = useState('none');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const { showSnackbar } = useSnackbar();


    // ✅ Handle stage update
    const updateStage = (nextStage) => {
        setStage(nextStage); // Optimistically update UI

        fetch(`${import.meta.env.VITE_API_BASE_URL}/job-applications/${id}/set-stage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
            body: JSON.stringify({ stage_id: nextStage }),
        })
            .then((res) => res.json())
            .then((data) => {
                showSnackbar("Candidate moved to the next stage successfully.", "success");
                console.log('Stage updated:', data);
            })
            .catch((err) => {
                console.error('Failed to update stage:', err);
                showSnackbar("Failed to move candidate to the next stage. Please try again.", "error");
            });
    };


    const handleBack = () => {
        navigate('/dashboard/candidates');
    };

    useEffect(() => {
        const fetchCandidate = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/job-applications/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    }
                });
                const candidate = response.data.data;
                setCandidateData(candidate);
                setStage(candidate.current_stage);
                console.log("Fetched candidate data:", candidate);
            } catch (error) {
                console.error("Error fetching candidate:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchCandidate();
    }, [id]);


    const handleSendEmailClick = () => setActiveForm('email');
    const handleSendTextClick = () => setActiveForm('text');
    const handleAddEvaluationClick = () => setActiveForm("review");
    const handleScheduleInterviewClick = () => alert("Schedule interview clicked");

    const handleCloseForm = () => setActiveForm('none');

    const handleReviewSubmit = async (payload) => {
        setIsSubmittingReview(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/job-applications/${id}/reviews`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            showSnackbar("Review submitted successfully.", "success");
            console.log('Review successfully submitted:', response.data);
            handleCloseForm(); // Close the form after successful submission
        } catch (error) {
            console.error('Error submitting review:', error);
            showSnackbar("Failed to submit review. Please try again.", "error");

        } finally {
            setIsSubmittingReview(false); // Stop loading
        }
    };

    const handleEmailSend = async (formData) => {
        setIsSendingEmail(true);

        const fullPayload = {
            ...formData,
            candidateApplicationId: id,
            type: 'email',
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/job-applications/communications`,
                fullPayload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            showSnackbar("Email sent successfully to the candidate.", "success");
            console.log('Email successfully sent:', response.data);
            handleCloseForm(); // Close the form on success
        } catch (error) {
            console.error('Failed to send email:', error);
            showSnackbar("Failed to send email. Please try again.", "error");
        } finally {
            setIsSendingEmail(false); // stop loading
        }
    };

    const handleDisqualification = async (reason) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/job-applications/${id}/disqualify`,
                { note: reason },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            showSnackbar("Candidate has been disqualified successfully.", "success");
            console.log('Candidate disqualified:', response.data);
            // Optional: refresh candidate data or update UI state
        } catch (error) {
            console.error('Failed to disqualify candidate:', error);
            showSnackbar("Failed to disqualify candidate. Please try again.", "error");
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-[#f6f6f6]">
            <div className={`w-full px-4 mx-auto py-8 ${activeForm !== 'none' ? 'max-w-7xl' : 'max-w-6xl'} flex-grow flex flex-col space-y-6`}>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                    <button onClick={handleBack} className="flex items-center gap-1 focus:outline-none">
                        <ArrowLeft className="w-4 h-4" />
                        Back to candidates
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left side: Profile content */}
                    <div className={`${activeForm !== 'none' ? 'md:w-[55%]' : 'md:w-[75%]'} w-full space-y-6`}>
                        <CandidateProfileHeader
                            stage={stage}
                            onUpdateStage={updateStage}
                            onSendEmailClick={handleSendEmailClick}
                            onSendTextClick={handleSendTextClick}
                            onAddEvaluationClick={handleAddEvaluationClick}
                            onScheduleInterviewClick={handleScheduleInterviewClick}
                            onDisqualify={handleDisqualification}
                        />

                        <CandidateProfileCard candidateData={candidateData} isLoading={isLoading} />
                        <CandidateTabs
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            candidateData={candidateData}
                        />
                    </div>

                    {/* Right side: Sidebar panel */}
                    <div className={`${activeForm !== 'none' ? 'md:w-[45%]' : 'md:w-[40%]'} w-full bg-white rounded-xl shadow-sm p-4 h-fit border-l border-gray-200`}>
                        {activeForm === 'none' && (
                            <JobOverviewCard job={candidateData?.job_post} loading={isLoading} />
                        )}

                        {activeForm === 'email' && (
                            <SendEmailForm
                                candidateData={candidateData?.candidate || ''}
                                onClose={handleCloseForm}
                                onSend={handleEmailSend}
                                isLoading={isSendingEmail}
                            />
                        )}

                        {activeForm === 'text' && (
                            <SendTextMessageForm
                                candidateData={candidateData?.candidate || ''}
                                onClose={handleCloseForm}
                            />
                        )}
                        {activeForm === 'review' && (
                            <SubmitReviewForm
                                onSubmit={handleReviewSubmit}
                                onClose={handleCloseForm}
                                isLoading={isSubmittingReview}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

}

