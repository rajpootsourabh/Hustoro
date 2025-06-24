import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CustomDropdown from '../../Components/CustomDropdown';
import TagInput from '../../Components/TagInput';
import { changeTitle } from '../../../utils/changeTitle';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Loader from '../../Components/Loader';
import currencies from '../../../Data/currencies';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useSnackbar } from '../../Components/SnackbarContext';
import magicIcon from '../../../assets/magic.png';
import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useParams } from 'react-router-dom';

import { job_titles, department, employment_type, experience, education, keywords_list } from '../../../Data/create_job_dropdown';

const CreateJob = () => {
  const { id } = useParams();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showAICard, setShowAICard] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    changeTitle("Create Job")
  }, [])

  useEffect(() => {
    changeTitle(id ? "Edit Job" : "Create Job");
    if (id) {
      fetchJobDetails(id);
    }
  }, [id]);

  const fetchJobDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/job/${id}`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("access_token"),
        }
      });

      const jobData = response.data.data; // Adjust based on your API response structure
      console.log(jobData);
      formik.setValues({
        job_title: jobData.job_title || '',
        job_code: jobData.job_code || '',
        job_workplace: jobData.job_workplace || '',
        job_location: jobData.job_location || '',
        job_department: jobData.job_department || '',
        job_function: jobData.job_function || '',
        employment_type: jobData.employment_type || '',
        experience: jobData.experience || '',
        education: jobData.education || '',
        keywords: jobData.keywords ? jobData.keywords.split(',').map(k => k.trim()) : [],
        annual_salary_from: jobData.from_salary || '',
        annual_salary_to: jobData.to_salary || '',
        currency: jobData.currency || '',
        showOnCarrerPage: jobData.showOnCarrerPage !== false,
        job_description: jobData.description || '',
        job_requirements: jobData.requirements || '',
        job_benefits: jobData.benefits || ''
      });

    } catch (error) {
      showSnackbar("Failed to load job data", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (id, values) => {
    try {
      setLoading(true);
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/job/update/${id}`, values, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("access_token"),
        }
      });
      if (response.status === 200) {
        showSnackbar("Job updated successfully", "success");
        navigate("/dashboard/jobs");
      }
    } catch (error) {
      showSnackbar(error.response?.data?.message || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };


  const formik = useFormik({
    initialValues: {
      job_title: '',
      job_code: '',
      job_workplace: '',
      job_location: '',
      job_department: '',
      job_function: '',
      employment_type: '',
      experience: '',
      education: '',
      keywords: [],
      annual_salary_from: '',
      annual_salary_to: '',
      currency: '',
      showOnCarrerPage: true,
      job_description: '',
      job_requirements: '',
      job_benefits: ''
    },
    validationSchema: Yup.object({
      job_title: Yup.string().required('Required'),
      job_code: Yup.string().required('Required'),
      job_workplace: Yup.string().required('Required'),
      job_location: Yup.string().required('Required'),
      job_department: Yup.string().required('Required'),
      job_function: Yup.string().required('Required'),
      employment_type: Yup.string().required('Required'),
      experience: Yup.string().required('Required'),
      education: Yup.string().required('Required'),
      keywords: Yup.array().min(1, 'At least one keyword is required'),
      annual_salary_from: Yup.number()
        .typeError('Must be a number')
        .required('Required')
        .test(
          'lessThanAnnualSalaryTo',
          'Annual salary from must be less than annual salary to',
          function (value) {
            const { annual_salary_to } = this.parent;
            return !annual_salary_to || !value || value < annual_salary_to;
          }
        ),
      annual_salary_to: Yup.number()
        .typeError('Must be a number')
        .required('Required'),
      currency: Yup.string().required('Required'),
      job_description: Yup.string().required('Required'),
      job_requirements: Yup.string().required('Required'),
      job_benefits: Yup.string().required('Required')
    }),



    onSubmit: (values) => {
      if (id) {
        updateJob(id, values);
      } else {
        postCreateJob(values);
      }
    },
  })

  const postCreateJob = async (values) => {
    try {
      const data = { ...values }
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/job/create`, data, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("access_token"),
        }
      })
      if (response.status === 201) {
        showSnackbar("Job Create Successfully", "success");
        setSuccess(true)
        navigate("/dashboard/jobs")
      } else {
        showSnackbar(response.message, "error");
        setSuccess(false)
      }
    } catch (error) {
      setSuccess(false)
      showSnackbar(error.response.data.message, "error");
      console.error("error ", error)
    }
    setLoading(false)
  }

  const handleGenerateWithAI = async () => {
    // api call to get the response backend for description, resquirement and benefits
  }


  return (
    <div className=''>
      {
        (loading || success)
          ?
          <Loader />
          :
          <></>
      }

      {/* <div className='flex bg-white w-full px-32 items-center justify-between py-4 border-b shadow-sm shadow-gray-100 border-gray-200'> */}
      <div className='flex bg-white w-full px-48 items-center justify-between py-4 border-b shadow-sm shadow-gray-100 border-gray-200'>
        <p className='text-xl font-medium'>{id ? 'Edit Job' : 'Create Job'}</p>
      </div>

      {/* <div className='px-32 py-5'> */}
      <div className='px-48 py-5 text-[0.8rem]'>
        {/* first */}
        <div className='w-full mt-8 flex flex-col bg-white rounded-lg border-4 border-gray-200 shadow-lg shadow-gray-200'>
          <div className='px-10 py-4 border-b border-gray-300'>
            <p className='p-0 m-0 text-lg font-medium text-gray-900'>Job Title and Department</p>
          </div>

          <div className='w-full grid grid-cols-2 gap-10 px-10 py-5'>
            {/* <div className="col-span-4"> */}
            <CustomDropdown options={job_titles} label="Job Title" formik={formik} name='job_title' />
            {/* </div> */}
            <TextField
              fullWidth
              className='rounded-lg'
              style={{ borderRadius: '10px', fontFamily: 'poppins' }}
              label='Job Code'
              {...formik.getFieldProps('job_code')}
              error={formik.touched.job_code && Boolean(formik.errors.job_code)}
              helperText={formik.touched.job_code && formik.errors.job_code}
            />
          </div>
        </div>

        {/* second */}
        <div className='w-full mt-8 flex flex-col bg-white rounded-lg border-4 border-gray-200 shadow-lg shadow-gray-200'>
          <div className='px-10 py-4 border-b border-gray-300'>
            <p className='p-0 m-0 text-lg font-medium text-gray-700'>Location</p>
          </div>

          <div className='w-full grid grid-cols-1 gap-10 px-10 py-5'>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label" style={{ color: '#000000', fontFamily: 'poppins' }}>Workplace*</FormLabel>
              <RadioGroup
                // className='w-full flex justify-between'
                className='w-full grid grid-cols-12 gap-10'
                row
                {...formik.getFieldProps('job_workplace')}
                error={formik.touched.job_workplace && Boolean(formik.errors.job_workplace)}
                helperText={formik.touched.job_workplace && formik.errors.job_workplace}
              >
                <div className='flex flex-col col-span-3'>
                  <FormControlLabel value="onsite" control={<Radio style={{ color: '#00756A', fontFamily: 'poppins' }} />} label="On-Site" />
                  <p className='text-xs text-gray-500 pl-8 -mt-2'>Employees work from an office</p>
                </div>

                <div className='flex flex-col col-span-3'>
                  <FormControlLabel value="hybrid" control={<Radio style={{ color: '#00756A', fontFamily: 'poppins' }} />} label="Hybrid" />
                  <p className='text-xs text-gray-500 pl-8 -mt-2'>Employees work from both office and home</p>
                </div>

                <div className='flex flex-col col-span-3'>
                  <FormControlLabel value="remote" control={<Radio style={{ color: '#00756A', fontFamily: 'poppins' }} />} label="Remote" />
                  <p className='text-xs text-gray-500 pl-8 -mt-2'>Employees work from home</p>
                </div>
              </RadioGroup>
            </FormControl>
            <div className='grid grid-cols-2 gap-8'>
              <TextField
                fullWidth
                className='rounded-lg'
                style={{ borderRadius: '10px', fontFamily: 'poppins' }}
                label='Office Location'
                {...formik.getFieldProps('job_location')}
                error={formik.touched.job_location && Boolean(formik.errors.job_location)}
                helperText={formik.touched.job_location && formik.errors.job_location}
              />
              <div>
                <p className='text-gray-800'>On Carrer Page?</p>
                <div className='flex gap-2 cursor-pointer' onClick={() => formik.setFieldValue('showOnCarrerPage', !formik.values.showOnCarrerPage)}>
                  {
                    formik.values.showOnCarrerPage
                      ?
                      <RemoveRedEyeIcon style={{ color: '#00756A' }} />
                      :
                      <VisibilityOffIcon style={{ color: '#00756A' }} />
                  }
                  <p className='text-gray-800'>{formik.values.showOnCarrerPage ? 'Shown' : 'Hide'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description*/}
        <div className='w-full mt-8 flex flex-col bg-white rounded-lg border-4 border-gray-200 shadow-lg shadow-gray-200'>
          <div className='px-10 py-4 border-b border-gray-300'>
            <p className='p-0 m-0 text-lg font-medium text-gray-900'>Description</p>
          </div>

          <div className={`${showAICard ? '' : 'hidden'} grid grid-cols-12 mx-10 my-5 p-3 rounded-lg bg-[#FBF3FE]`}>
            <div className='col-span-1 px-5'>
              <img src={magicIcon} className='w-8 h-8' />
            </div>
            <div className='col-span-11 grid grid-cols-12'>
              <p className='col-span-8'>Generate personalized job description based on past account data</p>
              <div className={`col-span-4 flex justify-end px-5 cursor-pointer`}>
                <CloseIcon onClick={() => setShowAICard(!showAICard)} />
              </div>
            </div>
            <p className='col-span-1'></p>
            <p className='col-span-8 text-sm text-gray-600'>When you generate with AI. we look for similar jobs you’ve created in the past and use the data to create content that’s impactful, accurate and personalised to your company.</p>
          </div>

          <div className='px-10 flex justify-between py-5'>
            <p className='text-md font-semibold'>About the role*</p>
            <button className='px-5 py-1.5 bg-[#00756A] rounded-full text-white' onClick={handleGenerateWithAI}>Generate with AI</button>
          </div>

          <div className='px-10 grid grid-cols-12 gap-5 pb-5 '>
            <div className='col-span-8 grid grid-cols-1 gap-5'>
              <TextField
                id="outlined-multiline-static"
                label="Description"
                multiline
                minRows={3}
                defaultValue=""
                {...formik.getFieldProps('job_description')}
                placeholder='Enter the job description here include key areas of responsibity and what the candidate might do on a typical day'
                autoFocus
                error={formik.touched.job_description && Boolean(formik.errors.job_description)}
                helperText={formik.touched.job_description && formik.errors.job_description}
              />
              <TextField
                id="outlined-multiline-static"
                label="Requirements"
                multiline
                minRows={3}
                defaultValue=""
                {...formik.getFieldProps('job_requirements')}
                placeholder='Enter the job requirement here, from soft skills to specific qualifications needed to perform the role'
                error={formik.touched.job_requirements && Boolean(formik.errors.job_requirements)}
                helperText={formik.touched.job_requirements && formik.errors.job_requirements}
              />
              <div className='w-full flex flex-col gap-1'>
                <TextField
                  id="outlined-multiline-static"
                  label="Benefits"
                  className='w-full'
                  multiline
                  minRows={3}
                  defaultValue=""
                  {...formik.getFieldProps('job_benefits')}
                  placeholder='Enter the benefits here include not just salary details but the perks that make your company unique.'
                  error={formik.touched.job_benefits && Boolean(formik.errors.job_benefits)}
                  helperText={formik.touched.job_benefits && formik.errors.job_benefits}
                />
                <p className='text-sm text-medium text-[#00756A] cursor-pointer pl-2'>Import common benefits for this location</p>
              </div>
            </div>
            <div className='col-span-4 mb-6 max-h-fit bg-[#F5F5F5] flex flex-col justify-start items-start p-5 rounded-lg gap-5'>
              <div>
                <p className='text-md font-semibold'>DO</p>
                <p className='text-sm text-gray-600'>Include at least 700 characters Use formatting like bold headings and lists to make text easier to read Avoid discriminatory language: Yes: students, native-level, they No: college students, native, he or she</p>
              </div>
              <div>
                <p className='text-md font-semibold'>Don't</p>
                <p className='text-sm text-gray-600'>{`Add a link to apply (one is added automatically) Describe more than one job, even if there is more than one opening.`}</p>
              </div>
              <div>
                <p className='text-md font-semibold'>Need inspiration?</p>
                <p className='text-sm text-medium text-[#00756A]'>Import sections from our job description templates. They're fully editable.</p>
              </div>
            </div>
          </div>
        </div>

        {/* third */}
        <div className='w-full mt-8 flex flex-col bg-white rounded-lg border-4 border-gray-200 shadow-lg shadow-gray-200'>
          <div className='px-10 py-4 border-b border-gray-300'>
            <p className='p-0 m-0 text-lg font-medium text-gray-700'>Company Industry and Job Function  </p>
          </div>

          <div className='w-full grid grid-cols-2 gap-10 px-10 py-5'>
            <CustomDropdown options={department} label="Department" formik={formik} name='job_department' />
            <TextField
              fullWidth
              className='rounded-lg'
              style={{ borderRadius: '10px', fontFamily: 'poppins' }}
              label='Job Function'
              {...formik.getFieldProps('job_function')}
              error={formik.touched.job_function && Boolean(formik.errors.job_function)}
              helperText={formik.touched.job_function && formik.errors.job_function}
            />
          </div>
        </div>

        {/* fourth */}
        <div className='w-full mt-8 flex flex-col bg-white rounded-lg border-4 border-gray-200 shadow-lg shadow-gray-200'>
          <div className='px-10 py-4 border-b border-gray-300'>
            <p className='p-0 m-0 text-lg font-medium text-gray-700'>Employment Details</p>
          </div>

          <div className='w-full grid grid-cols-2 gap-x-10 gap-y-5 px-10 py-5'>
            <CustomDropdown options={employment_type} label="Employment Type" formik={formik} name='employment_type' />
            <CustomDropdown options={experience} label="Experience" formik={formik} name='experience' />
            <CustomDropdown options={education} label="Education" formik={formik} name='education' />
            <TagInput formik={formik} keywords_list={keywords_list} />
          </div>
        </div>

        {/* third */}
        <div className='w-full mt-8 flex flex-col bg-white rounded-lg border-4 border-gray-200 shadow-lg shadow-gray-200'>
          <div className='px-10 py-4 border-b border-gray-300'>
            <p className='p-0 m-0 text-lg font-medium text-gray-700'>Annual Salary</p>
          </div>

          <div className='w-full grid grid-cols-12 gap-10 px-10 py-5'>
            <TextField
              fullWidth
              className='rounded-lg col-span-4'
              style={{ borderRadius: '10px' }}
              label='From'
              {...formik.getFieldProps('annual_salary_from')}
              error={formik.touched.annual_salary_from && Boolean(formik.errors.annual_salary_from)}
              helperText={formik.touched.annual_salary_from && formik.errors.annual_salary_from}
            />
            <TextField
              fullWidth
              className='rounded-lg col-span-4'
              style={{ borderRadius: '10px' }}
              label='To'
              {...formik.getFieldProps('annual_salary_to')}
              error={formik.touched.annual_salary_to && Boolean(formik.errors.annual_salary_to)}
              helperText={formik.touched.annual_salary_to && formik.errors.annual_salary_to}
            />
            <Autocomplete
              fullWidth
              className="rounded-lg col-span-4"
              options={currencies}
              getOptionLabel={(option) => `${option.name} (${option.code})`}
              value={currencies.find((c) => c.code === formik.values.currency) || null} // Correct value retrieval
              onChange={(event, newValue) => formik.setFieldValue("currency", newValue ? newValue.code : "")}
              isOptionEqualToValue={(option, value) => option.code === value.code}
              clearOnEscape // Allows clearing via ESC key
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Currency"
                  variant="outlined"
                  fullWidth
                  error={formik.touched.currency && Boolean(formik.errors.currency)}
                  helperText={formik.touched.currency && formik.errors.currency}
                />
              )}
              disableClearable={false}
            />
          </div>
        </div>

        <div className='flex justify-center items-center py-5'>
          <button type='submit' onClick={formik.handleSubmit} className='px-5 py-1.5 bg-[#00756A] rounded-full text-white'>{id ? 'Update' : 'Create Job'}</button>
        </div>
      </div>
    </div>
  )
}

export default CreateJob
