import React from 'react';
import { useRolePermissions } from '../../../hooks/useRolePermissions';
import Timeline from './TimelineTab';
import ProfileTab from './ProfileTab';
import CommunicationTab from './CommunicationTab';
import ReviewTab from './ReviewTab';
import CommentTab from './CommentTab';
import FilledDocumentTab from './FilledDocumentTab';
import ShiftManagementTab from './ShiftManagementTab';
import JobManagementTab from './JobManagementTab';

export default function CandidateTabs({ activeTab, setActiveTab, candidateData }) {
    const applicationId = candidateData?.id;
    
    // Use the role permissions hook
    const { isCandidate, isLoading } = useRolePermissions();

    // Define all possible tabs
    const allTabs = [
        'Profile', 
        'Timeline', 
        'Communication', 
        'Review', 
        'Comments', 
        'Recieved Documents',
        'Shift Management',
        'Job Management'
    ];

    // Filter tabs based on user role - hide Shift Management for candidates
    const getFilteredTabs = () => {
        if (isLoading) {
            return allTabs; // Show all tabs while loading
        }
        
        if (isCandidate()) {
            // Hide "Shift Management" tab for candidates
            return allTabs.filter(tab => tab !== 'Shift Management');
        }
        
        return allTabs; // Show all tabs for non-candidates
    };

    const filteredTabs = getFilteredTabs();

    // If active tab is hidden (e.g., candidate viewing Shift Management), switch to first available tab
    React.useEffect(() => {
        if (!isLoading && !filteredTabs.includes(activeTab) && filteredTabs.length > 0) {
            setActiveTab(filteredTabs[0]);
        }
    }, [filteredTabs, activeTab, isLoading, setActiveTab]);

    // If loading, render original tabs with loading state
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm">
                {/* Tab Headers - Original styling */}
                <div className="border-b flex flex-wrap overflow-x-auto">
                    {allTabs.map(tab => (
                        <button
                            key={tab}
                            className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${activeTab === tab
                                    ? 'border-b-2 border-emerald-600 text-emerald-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-4">
                    {activeTab === "Profile" && <ProfileTab candidateData={candidateData} />}
                    {activeTab === "Timeline" && <Timeline applicationId={applicationId} />}
                    {activeTab === "Communication" && <CommunicationTab applicationId={applicationId} />}
                    {activeTab === "Review" && <ReviewTab applicationId={applicationId} />}
                    {activeTab === "Comments" && <CommentTab applicationId={applicationId} />}
                    {activeTab === "Recieved Documents" && <FilledDocumentTab applicationId={applicationId} />}
                    {activeTab === "Shift Management" && <ShiftManagementTab candidateData={candidateData} />}
                    {activeTab === "Job Management" && <JobManagementTab candidateData={candidateData} />}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm">
            {/* Tab Headers - Original styling preserved */}
            <div className="border-b flex flex-wrap overflow-x-auto">
                {filteredTabs.map(tab => (
                    <button
                        key={tab}
                        className={`px-4 py-4 text-sm font-medium whitespace-nowrap ${activeTab === tab
                                ? 'border-b-2 border-emerald-600 text-emerald-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content - Original content preserved */}
            <div className="p-4">
                {activeTab === "Profile" && <ProfileTab candidateData={candidateData} />}
                {activeTab === "Timeline" && <Timeline applicationId={applicationId} />}
                {activeTab === "Communication" && <CommunicationTab applicationId={applicationId} />}
                {activeTab === "Review" && <ReviewTab applicationId={applicationId} />}
                {activeTab === "Comments" && <CommentTab applicationId={applicationId} />}
                {activeTab === "Recieved Documents" && <FilledDocumentTab applicationId={applicationId} />}
                {activeTab === "Shift Management" && <ShiftManagementTab candidateData={candidateData} />}
                {activeTab === "Job Management" && <JobManagementTab candidateData={candidateData} />}
            </div>
        </div>
    );
}