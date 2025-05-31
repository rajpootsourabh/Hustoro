import React from 'react';
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { UserPlus } from 'lucide-react';
import ProfileImage from '../ProfileImage';
import { getStageLabelFromNumber } from '../../../utils/stageUtils';

export default function CandidateProfileCard({ candidateData, isLoading = false }) {
    return (
        <div className="bg-white px-8 py-12 rounded-xl shadow-sm flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">

            {/* Profile Image */}

            {isLoading ? (
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0">
                    <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                </div>
            ) : (
                <ProfileImage
                    src={candidateData?.candidate?.profile_pic}
                    alt="Profile"
                    height={24}
                    width={24}
                    iconSize={50}
                />
            )}

            {/* Text Info */}
            <div className="flex-grow text-center md:text-left">
                {isLoading ? (
                    <>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                        <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-6">
                            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>
                        <div className="flex flex-col mt-2 space-y-1 items-center md:items-start">
                            <div className="h-3 bg-gray-200 rounded w-28 animate-pulse"></div> {/* experience skeleton */}
                            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div> {/* referrals skeleton */}
                        </div>

                    </>
                ) : (
                    <>
                        {candidateData?.status === 'Rejected' && (
                            <div className="mb-1">
                                <span className="inline-block bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                                    Disqualified
                                </span>
                            </div>
                        )}

                        <h2 className="text-md font-semibold">
                            {candidateData?.candidate?.first_name} {candidateData?.candidate?.last_name}
                        </h2>

                        <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-6 text-gray-700">
                            <p className="flex items-center text-xs">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                {candidateData?.candidate?.location
                                    ? `${candidateData.candidate.location}, ${candidateData.candidate.country || ''}`
                                    : 'Not specified'}

                            </p>
                            <p className="flex items-center text-xs">
                                <PhoneIcon className="w-4 h-4 mr-1" />
                                +91 {candidateData?.candidate?.phone || '0 000 000 0000'}
                            </p>
                        </div>

                        {candidateData?.candidate?.experience && (
                            <p className="text-xs text-gray-700 mt-1 px-1">
                                {parseFloat(candidateData.candidate.experience)} years experience
                            </p>
                        )}
                        <p className="text-xs text-blue-500 mt-1">#referrals</p>

                    </>
                )}
            </div>

            {/* Right Side */}
            <div className="flex flex-col items-end text-right ml-auto">
                {isLoading ? (
                    <>
                        <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-24 mt-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-20 mt-1 animate-pulse"></div>
                    </>
                ) : (
                    <>
                        <button className="flex items-center text-sm text-gray-600 bg-[#f6f6f6] border px-2 py-1 rounded-md">
                            <UserPlus size={16} className="mr-1" />
                            0 <span className="ml-1 text-sm">Follow</span>
                        </button>
                        <p className="leading-tight mt-1 text-right">
                            <span className="text-[#050359] text-sm">
                                {candidateData?.job_post?.job_title || 'No designation'}
                                {candidateData?.current_stage &&
                                    ` • ${getStageLabelFromNumber(candidateData.current_stage)}`}
                            </span>
                            <br />
                            <span className="text-gray-600 text-xs">
                                via{' '}
                                <span className="text-xs text-black font-semibold">
                                    {candidateData?.job_post?.source_id || 'profile upload'}
                                </span>
                            </span>
                        </p>
                    </>
                )}
            </div>

        </div>
    );
}
