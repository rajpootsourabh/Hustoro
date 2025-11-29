import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Skeleton from '@mui/material/Skeleton';
import Dropdown from '../Components/Dropdown';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';

const Job = ({
  job,
  stats = {},
  dynamicStages = [],
  isLoading = false,
  onUploadClick,
  onFindCandidateClick,
  onFindDeleteClick,
  onEditJobClick,
  onJobOverviewClick,
  onDuplicateJobClick,
  onAssignJobClick
}) => {
  const [openDropdownId, setOpenDropdownId] = React.useState(null);

  const jobTypes = {
    'hybrid': 'Hybrid',
    'remote': 'Remote',
    'onsite': 'On-site',
  };

  const options = [
    { label: "Preview job post", action: () => onJobOverviewClick(job) },
    { label: "Edit job", action: () => onEditJobClick(job) },
    { label: "Upload Candidate", action: () => onUploadClick(job) },
    { label: "Duplicate job", action: () => onDuplicateJobClick(job) },
    { label: "Find Candidate", action: () => onFindCandidateClick(job) },
    { label: "Delete job", action: () => onFindDeleteClick(job) },
  ];

  const renderStat = (label, value, showDivider = true) => (
    <div className={`flex flex-col gap-2 py-3 items-center justify-center flex-shrink-0 ${showDivider ? 'pr-8 border-r border-gray-200' : ''}`}>
      {
        isLoading
          ? (
            <>
              <Skeleton variant="text" width={40} height={30} />
              <Skeleton variant="text" width={80} height={16} />
            </>
          )
          : (
            <>
              <p className='text-3xl font-bold p-0 m-0 text-gray-900'>{value ?? 0}</p>
              <p className='text-sm p-0 m-0 text-gray-600 font-medium whitespace-nowrap'>{label}</p>
            </>
          )
      }
    </div>
  );

  // Calculate total and active candidates dynamically
  const calculateCandidates = () => {
    if (isLoading) return { total: 0, active: 0 };

    const total = stats.total_candidates || stats.resource_count || 0;

    // Calculate active candidates dynamically based on available stages
    let active = 0;

    if (dynamicStages.length > 0) {
      // Sum all stages except the last one (assuming it's final)
      const activeStages = dynamicStages.slice(0, -1);
      activeStages.forEach(stage => {
        const stageCount = stats[stage.name] || stats[stage.id] || stats[stage.name?.toLowerCase()] || 0;
        active += stageCount;
      });
    } else {
      // Fallback: use provided active_candidates or calculate from all numeric stats
      active = stats.active_candidates !== undefined ? stats.active_candidates : total;
    }

    return { total, active };
  };

  // Get all stages to display (completely dynamic)
  const getAllStages = () => {
    if (isLoading) {
      return [];
    }

    // Always use dynamicStages if provided
    if (dynamicStages.length > 0) {
      return dynamicStages;
    }

    // If no dynamicStages, try to extract from stats (completely dynamic)
    const excludedKeys = ['total_candidates', 'resource_count', 'active_candidates'];
    const stageKeys = Object.keys(stats).filter(key =>
      typeof stats[key] === 'number' && !excludedKeys.includes(key)
    );

    return stageKeys.map(key => ({
      id: key,
      name: key.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      value: stats[key]
    }));
  };

  // Function to render stages (completely dynamic)
  const renderStages = () => {
    const stages = getAllStages();

    if (isLoading) {
      // Show 7 skeleton loaders for stages
      return Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center flex-shrink-0">
          {renderStat('Loading', 0, index < 5)}
        </div>
      ));
    }

    if (stages.length === 0) {
      return null;
    }

    // Render actual stages dynamically
    return stages.map((stage, index) => (
      <div key={stage.id} className="flex items-center flex-shrink-0">
        {renderStat(
          stage.name,
          stage.value || stats[stage.name] || stats[stage.id] || 0,
          index < stages.length - 1
        )}
      </div>
    ));
  };

  const { total, active } = calculateCandidates();
  const stages = getAllStages();
  const hasStages = stages.length > 0 || isLoading;

  return (
    <div className='w-full h-fit bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200'>
      {/* Header Section */}
      <div className='h-14 w-full flex items-center justify-between px-4 border-b border-gray-200'>
        <div className='flex items-center gap-4'>
          {
            isLoading ? (
              <>
                <Skeleton variant="text" width={150} height={28} />
                <Skeleton variant="text" width={120} height={20} />
              </>
            ) : (
              <>
                <p className='text-lg text-gray-900 font-semibold'>{job.job_title}</p>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <WorkOutlineOutlinedIcon fontSize="small" className="text-gray-500" />
                    <span>{job.job_workplace ? jobTypes[job.job_workplace] : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LocationOnOutlinedIcon fontSize="small" className="text-gray-500" />
                    <span>{job.job_location || 'N/A'}</span>
                  </div>
                </div>
              </>
            )
          }
        </div>
        <div className='flex items-center gap-3'>
          {
            isLoading ? (
              <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 999 }} />
            ) : (
              <button
                onClick={() => onUploadClick(job)}
                className='px-6 py-2 bg-teal-700 text-white text-sm font-medium rounded-lg hover:bg-teal-800 transition-colors shadow-sm'
              >
                Upload Candidate
              </button>
            )
          }

          <div className='relative cursor-pointer'>
            {
              !isLoading && (
                <>
                  <MoreVertIcon
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => {
                      setOpenDropdownId(openDropdownId === job.id ? null : job.id);
                    }}
                  />
                  {openDropdownId === job.id && (
                    <Dropdown
                      label=""
                      dropdownId={job.id}
                      openDropdownId={openDropdownId}
                      setOpenDropdownId={setOpenDropdownId}
                      options={options}
                    />
                  )}
                </>
              )
            }
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='w-full px-6 py-6 border-b border-gray-200'>
        <div className='flex items-center justify-start gap-8'>
          {/* Total Count */}
          <div className="flex items-center flex-shrink-0">
            {renderStat('Resource Count', total, hasStages)}
          </div>

          {/* Dynamic Stages - Scrollable container */}
          {hasStages && (
            <div className="flex items-center gap-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1">
              {renderStages()}
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className='h-10 w-full flex items-center justify-center bg-gray-50 rounded-b-xl'>
        {
          isLoading
            ? <Skeleton variant="text" width={400} height={20} />
            : (
              <p className='text-sm text-gray-600 font-medium'>
                {total > 0
                  ? `Candidates: ${total} total, ${active} active in pipeline`
                  : 'No candidates yet'
                }
              </p>
            )
        }
      </div>
    </div>
  );
};

export default Job;