import React, { useEffect, useState } from 'react'
import Job from '../../Components/job'
import { Link, useNavigate } from 'react-router-dom'
import { changeTitle } from '../../../utils/changeTitle'
import Loader from '../../Components/Loader'
import spinner from '../../../assets/green-spinner.svg'
import axios from 'axios'
import { useSnackbar } from '../../Components/SnackbarContext'

const Jobs = () => {
  const [loading,setLoading] = useState(false)
  const {showSnackbar} = useSnackbar()
  const [jobList,setJobList] = useState([])
  const navigate = useNavigate()
  useEffect(()=>{
    changeTitle("Jobs") 
    get_jobs_list()
  },[])

  // api call to fetch the jobs and show the list
  const get_jobs_list = async()=>{
    try {
      setLoading(true)
      const response = await axios.get("https://bipani.com/api/v.1/job/list",{
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("access_token"),
        }
      })
      if(response.status === 200){
          const sortedJobs = response.data.data.sort((a, b) => b.id - a.id);
        setJobList([...sortedJobs])
      }else{
        showSnackbar(response.data.message)
        setJobList([])
      }
    } catch (error) {
      console.log(error)
      if(error.status===401){
        navigate("/signin")
        showSnackbar("Session expired, please login again","error")
        // localStorage.removeItem("access_token")
      }else{
        showSnackbar(error.response.data.message,"error")
        setJobList([])
      }
    }
    setLoading(false)
  }
  
  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <div className='flex bg-white w-full items-center justify-between px-32 py-4 border-b-2 shadow-sm shadow-gray-100 border-gray-200'>
        <p className='text-xl font-medium'>Jobs</p>
        <div className='flex gap-4 items-center'>
          {/* <button className='rounded-full px-4 py-1 text-sm bg-[#00756A] text-white'>Post a Job</button> */}
          <Link to="/dashboard/jobs/create-job"><button className='rounded-full px-4 py-1 text-sm bg-[#00756A] text-white'>Create a New Job</button></Link>
        </div>
      </div>
      {
        !loading
        ?
          <div className='w-full min-h-[78vh] grid grid-flow-row px-32 gap-8 py-10'>
            {
              jobList.length
              ?
              jobList.map((item,index)=>{
                return <Job key={item} job={item} />
              })
              :
              // <></>
              <div className='bg-white h-fit flex justify-center items-center py-5 rounded-lg text-gray-800'>No Jobs</div>
            }
          </div>
        :
            
          <div className='w-full min-h-[78vh] flex justify-center items-center px-32 text-green-600 gap-8 py-10'>
            <img src={spinner} className="w-28 h-28 " alt="Loading..." />
          </div>
      }
    </div>
  )
}

export default Jobs
