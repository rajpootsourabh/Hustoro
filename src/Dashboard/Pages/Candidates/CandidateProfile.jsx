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
import FileUploadDialog from '../../Components/FileUploadDialog';
import DocumentLinksForm from '../../Components/Candidates/DocumentLinksForm';

export default function CandidateProfile() {
    const [activeTab, setActiveTab] = useState('Profile');
    const { id } = useParams();
    const [candidateData, setCandidateData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stageId, setStageId] = useState(null);
    const [availableStages, setAvailableStages] = useState([]);
    const [isLoadingStages, setIsLoadingStages] = useState(true); // Add loading state for stages
    const [activeForm, setActiveForm] = useState('none');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const { showSnackbar } = useSnackbar();
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const handleProfileUploadClick = () => setIsUploadDialogOpen(true);

    // Fetch available stages for this application
    const fetchAvailableStages = async (applicationId) => {
        setIsLoadingStages(true); // Set loading to true when starting fetch
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/job-applications/${applicationId}/available-stages`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );
            setAvailableStages(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch available stages:', error);
            setAvailableStages([]);
        } finally {
            setIsLoadingStages(false); // Set loading to false when done
        }
    };

    // Handle profile pic update
    const handleProfileFileSubmit = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('profile_pic', file);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/job-applications/${id}/files`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const updatedCandidate = response.data.candidate;
            updatedCandidate.profile_pic = updatedCandidate.profile_pic + `?t=${Date.now()}`;

            setCandidateData((prev) => ({
                ...prev,
                candidate: {
                    ...updatedCandidate
                },
            }));

            showSnackbar('Profile picture updated successfully!', 'success');
        } catch (error) {
            console.error('Failed to upload profile pic:', error);
            showSnackbar('Failed to upload profile picture. Please try again.', 'error');
        } finally {
            setIsUploadDialogOpen(false);
        }
    };

// ✅ Updated stage update for dynamic stages
const updateStage = async (payload) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/job-applications/${id}/set-stage`,
      payload, // Accept full payload object
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        },
      }
    );

    // Update local state with the new stage ID
    setStageId(payload.stage_id);

    // Refresh candidate data to get updated stage information
    fetchCandidate();

    showSnackbar("Candidate moved to new stage successfully.", "success");
    console.log('Stage updated:', response.data);
  } catch (error) {
    console.error('Failed to update stage:', error);
    showSnackbar("Failed to move candidate to new stage. Please try again.", "error");
    throw error; // Re-throw to let StagesDropdown handle loading state
  }
};

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

            // Set the current stage ID (company_stage_id)
            setStageId(candidate.company_stage_id || candidate.current_stage?.id);

            console.log("Fetched candidate data:", candidate);
        } catch (error) {
            console.error("Error fetching candidate:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchCandidate();
            fetchAvailableStages(id);
        }
    }, [id]);

    const handleSendEmailClick = () => setActiveForm('email');
    const handleGenerateLinkClick = () => setActiveForm('link');
    const handleSendTextClick = () => setActiveForm('text');
    const handleAddEvaluationClick = () => setActiveForm("review");

    // ✅ Schedule interview method
    const handleScheduleInterviewClick = async (interviewData) => {
        try {
            console.log('Scheduling Jitsi interview:', interviewData);
            showSnackbar("Scheduling interview...", "info");

            const userDataString = localStorage.getItem('user');
            if (!userDataString) {
                throw new Error('User data not found. Please login again.');
            }

            const userData = JSON.parse(userDataString);
            const currentEmployeeId = userData.id;

            if (!currentEmployeeId) {
                throw new Error('Employee ID not found in user data.');
            }

            const payload = {
                employee_id: currentEmployeeId,
                candidate_id: candidateData?.candidate?.id,
                candidate_email: candidateData?.candidate?.email,
                scheduled_at: interviewData.scheduledAt
            };

            console.log('Sending payload:', payload);

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/meetings/schedule`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.message === 'Meeting scheduled successfully') {
                showSnackbar("Interview scheduled successfully! Meeting details have been sent to the candidate.", "success");
                console.log('Jitsi meeting created successfully');
            } else {
                throw new Error(response.data.error || 'Failed to create meeting');
            }

        } catch (error) {
            console.error('Failed to schedule interview:', error);
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const errorMessage = Object.values(errors).flat().join(', ');
                showSnackbar(`Validation error: ${errorMessage}`, "error");
            } else if (error.response?.status === 401) {
                showSnackbar("Authentication failed. Please login again.", "error");
            } else if (error.message.includes('User data not found') || error.message.includes('Employee ID not found')) {
                showSnackbar(error.message, "error");
            } else if (error.code === 'NETWORK_ERROR') {
                showSnackbar("Network error. Please check your connection.", "error");
            } else {
                showSnackbar("Failed to schedule interview. Please try again.", "error");
            }
            throw error;
        }
    };

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
            handleCloseForm();
        } catch (error) {
            console.error('Error submitting review:', error);
            showSnackbar("Failed to submit review. Please try again.", "error");
        } finally {
            setIsSubmittingReview(false);
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
            handleCloseForm();
        } catch (error) {
            console.error('Failed to send email:', error);
            showSnackbar("Failed to send email. Please try again.", "error");
        } finally {
            setIsSendingEmail(false);
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
        } catch (error) {
            console.error('Failed to disqualify candidate:', error);
            showSnackbar("Failed to disqualify candidate. Please try again.", "error");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f6f6f6]">
            <div className={`w-full px-4 mx-auto py-8 ${activeForm !== 'none' ? 'max-w-7xl' : 'max-w-6xl'} flex-grow flex flex-col space-y-6`}>
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left side: Profile content */}
                    <div className={`${activeForm !== 'none' ? 'md:w-[55%]' : 'md:w-[75%]'} w-full space-y-6`}>
                        <CandidateProfileHeader
                            stageId={stageId}
                            stages={availableStages}
                            onUpdateStage={updateStage}
                            onSendEmailClick={handleSendEmailClick}
                            onSendTextClick={handleSendTextClick}
                            onAddEvaluationClick={handleAddEvaluationClick}
                            onScheduleInterviewClick={handleScheduleInterviewClick}
                            onDisqualify={handleDisqualification}
                            onGenerateLinkClick={handleGenerateLinkClick}
                            candidate={candidateData?.candidate}
                            applicationId={id}
                            isLoadingStages={isLoadingStages} // Pass the loading state
                        />

                        <CandidateProfileCard candidateData={candidateData} isLoading={isLoading} onProfileUpload={handleProfileUploadClick} />
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

                        {activeForm === 'link' && (
                            <DocumentLinksForm
                                candidateData={candidateData?.candidate || ''}
                                applicationId={id} 
                                onClose={handleCloseForm}
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
            <FileUploadDialog
                open={isUploadDialogOpen}
                onClose={() => setIsUploadDialogOpen(false)}
                onSubmit={handleProfileFileSubmit}
                title="Upload Profile Picture"
                accept=".jpeg,.jpg,.png"
                maxSizeMB={2}
            />
        </div>
    );
}