import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Dropdown from '../Components/Dropdown';

const Job = ({
  job,
  stats = {},
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
    // { label: "Assign Job", action: () => onAssignJobClick(job) },
  ];

  const renderStat = (label, value) => (
    <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
      {
        isLoading
          ? <Skeleton variant="text" width={40} height={30} />
          : <p className='text-3xl font-bold p-0 m-0'>{value ?? 0}</p>
      }
      <p className='text-sm p-0 m-0'>{label}</p>
    </div>
  );

  return (
    <div className='w-full h-fit grid grid-cols-12 px-4 py-2 bg-white rounded-lg border-2 border-gray-200 shadow-sm shadow-gray-200'>
      <div className='col-span-12 h-14 w-full flex items-center justify-between px-2 border-b-2 border-gray-200'>
        <div className='flex items-center gap-4'>
          {
            isLoading ? (
              <>
                <Skeleton variant="text" width={150} height={28} />
                <Skeleton variant="text" width={120} height={20} />
              </>
            ) : (
              <>
                <p className='text-lg text-gray-800 font-semibold'>{job.job_title}</p>
                <p className='text-sm font-light text-gray-500'>
                  {`${job.job_workplace ? jobTypes[job.job_workplace] : 'N/A'}, ${job.job_location || 'N/A'}`}
                </p>
              </>
            )
          }
        </div>
        <div className='flex items-center gap-4'>
          {
            isLoading ? (
              <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 999 }} />
            ) : (
              <button
                onClick={() => onUploadClick(job)}
                className='px-6 py-1 bg-[#00756A] text-white text-sm rounded-full'
              >
                Upload Candidate
              </button>
            )
          }

          <div className='relative cursor-pointer'>
            {
              !isLoading && (
                <>
                  <MoreVertIcon onClick={() => {
                    setOpenDropdownId(openDropdownId === job.id ? null : job.id);
                  }} />
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

      <div className='col-span-12 h-fit w-full flex items-center justify-between px-2 py-4 border-b-2 border-gray-200'>
        {renderStat('Resource Count', stats.resource_count)}
        <Divider orientation="vertical" flexItem />
        {renderStat('Sourced', stats.sourced)}
        <Divider orientation="vertical" flexItem />
        {renderStat('Applied', stats.applied)}
        <Divider orientation="vertical" flexItem />
        {renderStat('Phone Screen', stats.phone_screen)}
        <Divider orientation="vertical" flexItem />
        {renderStat('Assessment', stats.assessment)}
        <Divider orientation="vertical" flexItem />
        {renderStat('Interview', stats.interview)}
        <Divider orientation="vertical" flexItem />
        {renderStat('Offer', stats.offer)}
        <Divider orientation="vertical" flexItem />
        {renderStat('Hired', stats.hired)}
      </div>

      <div className='col-span-12 h-10 w-full flex items-center justify-center'>
        {
          isLoading
            ? <Skeleton variant="text" width={400} height={20} />
            : <p className='text-sm text-gray-500'>
              Candidates: {stats.total_candidates ?? 0} total, {stats.active_candidates ?? 0} active in pipeline, Last Candidate on {stats.last_candidate_date ?? 'N/A'}
            </p>
        }
      </div>
    </div>
  );
};

export default Job;
