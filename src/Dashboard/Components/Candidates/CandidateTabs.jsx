import React from 'react';
import Timeline from './TimelineTab';
import ProfileTab from './ProfileTab';
import CommunicationTab from './CommunicationTab';
import ReviewTab from './ReviewTab';
import CommentTab from './CommentTab';

export default function CandidateTabs({ activeTab, setActiveTab, candidateData }) {
    const applicationId = candidateData?.id;

    const tabs = ['Profile', 'Timeline', 'Communication', 'Review', 'Comments'];

    return (
        <div className="bg-white rounded-xl shadow-sm">
            {/* Tab Headers */}
            <div className="border-b flex flex-wrap">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        className={`px-4 py-4 text-sm font-medium ${
                            activeTab === tab
                                ? 'border-b-2 border-emerald-600 text-emerald-600'
                                : 'text-gray-500'
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
            </div>
        </div>
    );
}
