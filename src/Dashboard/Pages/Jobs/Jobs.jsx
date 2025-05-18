import React, { useEffect, useState } from 'react'
import Job from '../../Components/job'
import { Link, useNavigate } from 'react-router-dom'
import { changeTitle } from '../../../utils/changeTitle'
import spinner from '../../../assets/green-spinner.svg'
import axios from 'axios'
import { useSnackbar } from '../../Components/SnackbarContext'
import UploadCandidateForm from '../../Components/Candidates/UploadCandidateForm';

const Jobs = () => {
  const [loading, setLoading] = useState(false)
  const { showSnackbar } = useSnackbar()
  const [jobList, setJobList] = useState([])
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [animateOut, setAnimateOut] = useState(false);
  const navigate = useNavigate()
  const [jobStats, setJobStats] = useState([]);

  const getJobsStats = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v.1/job-applications/stats", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      if (response.status === 200 && response.data.status === 'success') {
        const normalizedJobStats = response.data.data.map(stat => {
          const stages = stat.stages || {};
          return {
            job_id: stat.job_id,
            resource_count: stat.total || 0,
            applied: stages["Applied"] || 0,
            phone_screen: stages["Phone Screen"] || 0,
            assessment: stages["Assessment"] || 0,
            interview: stages["Interview"] || 0,
            offer: stages["Offer"] || 0,
            hired: stages["Hired"] || 0,
            sourced: stages["Sourced"] || 0,
            total_candidates: stat.total || 0,
          };
        });
        setJobStats(normalizedJobStats);
      } else {
        showSnackbar("Failed to fetch job stats", "error");
      }
    } catch (error) {
      console.error("Error fetching job stats:", error);
      showSnackbar("Error fetching job stats", "error");
    }
  };



  useEffect(() => {
    changeTitle("Jobs");
    get_jobs_list();
  }, []);


  const handleUploadClick = (job) => {
    setSelectedJob(job);
    setShowUploadForm(true);
  };

  const handleCandidateUpload = async (formData, showSnackbar) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/v.1/job-applications",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (res.status === 201) {
        showSnackbar("Candidate uploaded successfully", "success");
        setShowUploadForm(false);
      } else {
        showSnackbar("Upload failed", "error");
      }
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Error during upload", "error");
    }
  };

  const closeUploadForm = () => {
    setAnimateOut(true); // Trigger the fade-out animation
    setTimeout(() => {
      setShowUploadForm(false); // Hide the modal after animation ends
      setAnimateOut(false);     // Reset animation state
      setSelectedJob(null);     // Clear the selected job
    }, 300); // match this with the fadeOut duration in Tailwind (0.3s = 300ms)
  };



  const get_jobs_list = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/v.1/job/list", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("access_token"),
        },
      });
      if (response.status === 200) {
        const sortedJobs = response.data.data.sort((a, b) => b.id - a.id);
        setJobList([...sortedJobs]);
        await getJobsStats();  // fetch stats only after jobs list is ready
      } else {
        showSnackbar(response.data.message);
        setJobList([]);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 401) {
        navigate("/signin");
        showSnackbar("Session expired, please login again", "error");
      } else {
        showSnackbar(error.response?.data?.message || "Error fetching jobs", "error");
        setJobList([]);
      }
    }
    setLoading(false);
  };

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <div className='flex bg-white w-full items-center justify-between px-32 py-4 border-b-2 shadow-sm shadow-gray-100 border-gray-200'>
        <p className='text-xl font-medium'>Jobs</p>
        <div className='flex gap-4 items-center'>
          <Link to="/dashboard/jobs/new">
            <button className='rounded-full px-4 py-1 text-sm bg-[#00756A] text-white'>
              Create a New Job
            </button>
          </Link>
        </div>
      </div>
      {
        !loading
          ?
          <div className='w-full min-h-[78vh] grid grid-flow-row px-32 gap-8 py-10'>
            {
              jobList.length
                ? jobList.map((item) => {
                  // Find the stats for this job by job_id
                  const stats = jobStats.find((s) => s.job_id === item.id) || {};
                  return (
                    <Job
                      key={item.id}
                      job={item}
                      stats={stats}
                      onUploadClick={handleUploadClick}
                    />
                  );
                })
                : <div className='bg-white h-fit flex justify-center items-center py-5 rounded-lg text-gray-800'>No Jobs</div>
            }
          </div>
          :
          <div className='w-full min-h-[78vh] flex justify-center items-center px-32 text-green-600 gap-8 py-10'>
            <img src={spinner} className="w-28 h-28 " alt="Loading..." />
          </div>
      }
      {showUploadForm && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-40 z-50 overflow-y-auto flex justify-center items-start pt-8 px-4 sm:px-6 
    ${animateOut ? 'animate-shrinkToBottom' : 'animate-growFromBottom'}`}
        >
          <div className="w-full max-w-4xl">
            <UploadCandidateForm
              onClose={closeUploadForm}
              selectedJob={selectedJob}
              sourceId={1}
              onSubmit={(formData) => handleCandidateUpload(formData, showSnackbar)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Jobs
