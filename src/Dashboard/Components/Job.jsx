import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Divider from '@mui/material/Divider';
import Dropdown from '../Components/Dropdown'

const Job = ({ job, stats = {}, onUploadClick }) => {
  console.log(stats)
  const [openDropdownId, setOpenDropdownId] = React.useState(null);

  const jobTypes = {
    'hybrid': 'Hybrid',
    'remote': 'Remote',
    'onsite': 'On-site',
  }

  const options = [
    { label: "Preview job post", action: () => console.log("Preview job clicked") },
    { label: "Edit job", action: () => console.log("Edit job clicked") },
    { label: "Upload Candidate", action: () => onUploadClick(job) },
    { label: "Duplicate job", action: () => console.log("Duplicate job clicked") },
    { label: "Delete job", action: () => console.log("Delete job clicked") },
    { label: "Leave job", action: () => console.log("Leave job clicked") },
  ];

  return (
    <div className='w-[100%] h-fit grid grid-cols-12 px-4 py-2 bg-white rounded-lg border-2 border-gray-200 shadow-sm shadow-gray-200'>
      <div className='col-span-12 h-14 w-full flex items-center justify-between px-2 border-b-2 border-gray-200'>
        <div className='flex items-center gap-4'>
          <p className='text-lg text-gray-800 font-semibold'>{job.job_title}</p>
          <p className='text-sm font-light text-gray-500'>
            {`${job.job_workplace ? jobTypes[job.job_workplace] : 'N/A'}, ${job.job_location || 'N/A'}`}
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => onUploadClick(job)}
            className='px-6 py-1 bg-[#00756A] text-white text-sm rounded-full'
          >
            Upload Candidate
          </button>

          <div className='relative cursor-pointer'>
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
          </div>
        </div>
      </div>

      <div className='col-span-12 h-fit w-full flex items-center justify-between px-2 py-4 border-b-2 border-gray-200'>
        {/* Resource Count */}
        <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
          <p className='text-3xl font-bold p-0 m-0'>{stats.resource_count ?? 0}</p>
          <p className='text-sm p-0 m-0'>Resource Count</p>
        </div>
        <Divider orientation="vertical" flexItem />

        {/* Sourced */}
        <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
          <p className='text-3xl font-bold p-0 m-0'>{stats.sourced ?? 0}</p>
          <p className='text-sm p-0 m-0'>Sourced</p>
        </div>
        <Divider orientation="vertical" flexItem />

        {/* Applied */}
        <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
          <p className='text-3xl font-bold p-0 m-0'>{stats.applied ?? 0}</p>
          <p className='text-sm p-0 m-0'>Applied</p>
        </div>
        <Divider orientation="vertical" flexItem />

        {/* Phone Screen */}
        <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
          <p className='text-3xl font-bold p-0 m-0'>{stats.phone_screen ?? 0}</p>
          <p className='text-sm p-0 m-0'>Phone Screen</p>
        </div>
        <Divider orientation="vertical" flexItem />

        {/* Assessment */}
        <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
          <p className='text-3xl font-bold p-0 m-0'>{stats.assessment ?? 0}</p>
          <p className='text-sm p-0 m-0'>Assessment</p>
        </div>
        <Divider orientation="vertical" flexItem />

        {/* Interview */}
        <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
          <p className='text-3xl font-bold p-0 m-0'>{stats.interview ?? 0}</p>
          <p className='text-sm p-0 m-0'>Interview</p>
        </div>
        <Divider orientation="vertical" flexItem />

        {/* Offer */}
        <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
          <p className='text-3xl font-bold p-0 m-0'>{stats.offer ?? 0}</p>
          <p className='text-sm p-0 m-0'>Offer</p>
        </div>
        <Divider orientation="vertical" flexItem />

        {/* Hired */}
        <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center px-4'>
          <p className='text-3xl font-bold p-0 m-0'>{stats.hired ?? 0}</p>
          <p className='text-sm p-0 m-0'>Hired</p>
        </div>
      </div>

      <div className='col-span-12 h-10 w-full flex items-center justify-center'>
        <p className='text-sm text-gray-500'>
          Candidates: {stats.total_candidates ?? 0} total, {stats.active_candidates ?? 0} active in pipeline, Last Candidate on {stats.last_candidate_date ?? 'N/A'}
        </p>
      </div>
    </div>
  )
}

export default Job;
