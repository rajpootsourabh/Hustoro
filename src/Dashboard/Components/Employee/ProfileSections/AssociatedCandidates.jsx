import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvatarUrl } from '../../../../utils/avatarUtils.js';

const AssociatedCandidates = ({ candidates = [], loading = false }) => {
  const navigate = useNavigate();

  const candidateWithAvatars = useMemo(() => {
    return (candidates || []).map((cand) => {
      const firstName = cand?.first_name ?? '';
      const lastName = cand?.last_name ?? '';
      return {
        ...cand,
        avatarUrl: getAvatarUrl(firstName, lastName, cand?.profile_pic),
        first_name: firstName,
        last_name: lastName,
        email: cand?.email ?? 'N/A',
        phone: cand?.phone ?? 'N/A',
        designation: cand?.designation ?? 'Not Assigned',
        stage: cand?.stage ?? 'Unknown',
      };
    });
  }, [candidates]);

  // 🟨 Skeleton block
  const renderSkeleton = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index}
        className="bg-white border rounded-xl shadow-sm p-4 flex justify-between animate-pulse"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-2 w-32 bg-gray-100 rounded" />
            <div className="h-2 w-40 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-end space-y-1">
          <div className="h-2 w-10 bg-gray-200 rounded mr-3" />
          <div className="h-5 w-16 bg-gray-300 rounded-full" />
        </div>
      </div>
    ));
  };

  // 🟩 Show skeleton while loading
  if (loading) {
    return <div className="p-6 space-y-4">{renderSkeleton()}</div>;
  }

  // 🟥 Show message if no candidates
  if (!candidateWithAvatars || candidateWithAvatars.length === 0) {
    return <div className="p-6 text-gray-500 text-sm">No candidates associated with this employee.</div>;
  }

  // 🟦 Actual content
  return (
    <div className="p-6 space-y-4">
      {candidateWithAvatars.map((candidate) => (
        <div
          key={candidate?.id ?? Math.random()}
          className="bg-white border rounded-xl shadow-sm p-4 flex justify-between cursor-pointer hover:shadow-md transition duration-200"
          onClick={() => candidate?.id && navigate(`/dashboard/candidates/profile/${candidate.id}`)}
        >
          <div className="flex items-center space-x-4">
            <img
              src={candidate.avatarUrl}
              alt={`${candidate.first_name} ${candidate.last_name}`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="text-sm font-medium">{candidate.first_name} {candidate.last_name}</h4>
              <p className="text-xs text-gray-500">{candidate.designation}</p>
              <p className="text-xs text-gray-400">{candidate.email} | {candidate.phone}</p>
            </div>
          </div>

          <div className="flex flex-col justify-center items-end space-y-1">
            <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide leading-none mr-3">
              Stage
            </span>
            <span
              className={`text-xs px-3 py-[2px] rounded-full whitespace-nowrap font-medium ${{
                'Sourced': 'bg-gray-100 text-gray-700',
                'Applied': 'bg-blue-50 text-blue-700',
                'Phone Screen': 'bg-indigo-50 text-indigo-700',
                'Assessment': 'bg-purple-50 text-purple-700',
                'Interview': 'bg-yellow-100 text-yellow-700',
                'Offer': 'bg-orange-100 text-orange-700',
                'Hired': 'bg-green-100 text-green-700',
                'Rejected': 'bg-red-100 text-red-700',
                'Unknown': 'bg-gray-100 text-gray-500',
              }[candidate.stage]}`}
            >
              {candidate.stage}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssociatedCandidates;
