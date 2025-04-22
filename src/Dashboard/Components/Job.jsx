import React from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import JobMenu from './JobMenu';
import Divider from '@mui/material/Divider';

const Job = ({job}) => {
  const [openMenu, setOpenMenu] = React.useState(false)
  const handleToggleMenu = ()=>{
    setOpenMenu(!openMenu)
  }
  const jobTypes ={
    'hybrid':'Hybrid',
    'remote':'Remote',
    'onsite':'On-site',
  }
  return (
    <div className='w-[100%] h-fit grid grid-cols-12  px-4 py-2 bg-white rounded-lg border-2 border-gray-200 shadow-sm shadow-gray-200'>
        <div className='col-span-12 h-14 w-full flex items-center justify-between px-2 border-b-2 border-gray-200'>
            <div className='flex items-center gap-4'>
                <p className='text-lg text-gray-800 font-semibold'>{job.job_title}</p>
                <p className='text-sm font-light text-gray-500'>{`${job.job_workplace?jobTypes[job.job_workplace]:'N/A'}, ${job.job_location?job.job_location:'N/A'}`}</p>
            </div>
            <div className='flex items-center gap-4'>
                <button className='px-6 py-1 bg-[#00756A] text-white text-sm rounded-full'>Find Candidate</button>
                <button className='px-6 py-1 bg-[#00756A] text-white text-sm rounded-full'>Used Internally</button>
                <div onClick={handleToggleMenu} className='relative cursor-pointer'>
                  <MoreVertIcon  />
                  {/* {
                    openMenu
                    ?
                      <div className='absolute top-6 right-2 z-10'>
                        <JobMenu />
                      </div>
                    :
                      <></>
                  } */}
                </div>
            </div>
        </div>
        
        <div className='col-span-12 h-fit w-full flex items-center justify-between px-2 py-4 border-b-2 border-gray-200'>
          <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
            <p className='text-3xl font-bold p-0 m-0'>0</p>
            <p className='text-sm p-0 m-0'>Resource Count</p>
          </div>
          <Divider orientation="vertical" flexItem />

          <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
            <p className='text-3xl font-bold p-0 m-0'>0</p>
            <p className='text-sm p-0 m-0'>Applied</p>
          </div>
          <Divider orientation="vertical" flexItem />

          <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
            <p className='text-3xl font-bold p-0 m-0'>0</p>
            <p className='text-sm p-0 m-0'>Phone Section</p>
          </div>
          <Divider orientation="vertical" flexItem />

          <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
            <p className='text-3xl font-bold p-0 m-0'>0</p>
            <p className='text-sm p-0 m-0'>Assessment</p>
          </div>
          <Divider orientation="vertical" flexItem />

          <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
            <p className='text-3xl font-bold p-0 m-0'>0</p>
            <p className='text-sm p-0 m-0'>Interview</p>
          </div>
          <Divider orientation="vertical" flexItem />

          <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center'>
            <p className='text-3xl font-bold p-0 m-0'>0</p>
            <p className='text-sm p-0 m-0'>Offer</p>
          </div>
          <Divider orientation="vertical" flexItem />

          <div className='col-span-2 flex flex-col gap-1 py-2 items-center justify-center px-4'>
            <p className='text-3xl font-bold p-0 m-0'>0</p>
            <p className='text-sm p-0 m-0'>Hired</p>
          </div>
        </div>
        
        <div className=' col-span-12 h-10 w-full flex items-center justify-center'>
          <p className='text-sm text-gray-500'>Candidates: 0 total, 0 active in pipleline, Last Candidate on N/A</p>
        </div>
    </div>
  )
}

export default Job
