import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import signup_bg from '../../assets/signup-bg.png';
import white_tick from '../../assets/white-tick.png';
import spinner from '../../assets/white-spinner.svg'
// import icon from '../../assets/Icon.png';
import icon from '../../assets/logo.png';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Components/Loader';
import { changeTitle } from '../../utils/changeTitle';
import { useSnackbar } from '../Components/SnackbarContext';

const Signup = () => {
  const [loading, setloading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    changeTitle("Register")
  }, [])
  const roles = [
    { label: 'Business Owner / Executive', id: 1 },
    { label: 'Human Resources', id: 2 },
    { label: 'Recruitment', id: 3 },
    { label: 'Finance', id: 4 },
  ]
  const formik = useFormik({
    initialValues: {
      companyName: '',
      companyWebsite: '',
      companySize: '',
      phoneNumber: '',
      evaluatingWebsite: [{ name: "Recruiting", checked: false }, { name: "HR", checked: false }],
      role: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required('Required'),
      companyWebsite: Yup.string()
        .matches(
          /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,63}$/,
          'Invalid URL'
        )
        .required('Required'),
      // companyWebsite: Yup.string().matches(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/,'Invalid URL').required('Required'),
      // companyWebsite: Yup.string().url('Invalid URL').required('Required'),
      companySize: Yup.number()
        .min(1, 'Must be at least 1')
        .max(1000, 'Must be at most 1000')
        .required('Required'),
      //   companySize: Yup.string().required('Required'),
      evaluatingWebsite: Yup.array()
        .test(
          'at-least-one-checked',
          'At least one option (HR or Recruiting) must be selected',
          (value) => value.some((item) => item.checked) // Ensure at least one is checked
        ),
      // phoneNumber: Yup.string().matches(/^[0-9]+$/, 'Must be a number').required('Required'),
      phoneNumber: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    }),
    onSubmit: (values) => {
      event.preventDefault;
      postSignup(values)

    },
  });

  const postSignup = async (values) => {
    try {
      const selectedOptions = values.evaluatingWebsite
        .filter(item => item.checked)
        .map(item => item.name)
        .join(', ');
  
      setloading(true);
  
      const payload = {
        companyName: values.companyName,
        companyWebsite: values.companyWebsite,
        companySize: values.companySize,
        phoneNumber: values.phoneNumber,
        evaluatingWebsite: selectedOptions,
        role: values.role,
        first_name: "Rahul",
        last_name: "Singh",
        email: values.email,
        password: values.password,
      };
  
      console.log(payload);
  
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 201) {
        showSnackbar("Signup successful");
        setSuccess(true);
        navigate("/signin");
      } else {
        // fallback generic error
        setError("Something went wrong. Please try again.");
        setSuccess(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
  
      let message = "An error occurred";
      if (error.response?.data?.message) {
        const keys = Object.keys(error.response.data.message);
        if (keys.length > 0) {
          message = error.response.data.message[keys[0]][0];
        }
      }
  
      setError(message);
      setSuccess(false);
    } finally {
      setloading(false);
    }
  };
  

  const points = [
    'Find, hire, onboard for every job.',
    'Manage the right person for every job.',
    'Move the right applicants forward.',
    'Find and attract candidates.',
  ];

  return (
    <div
      className='relative flex items-center justify-center bg-contain bg-top'
      style={{ backgroundImage: `url(${signup_bg})` }}
    >
      <div className='sm:block hidden'>
        <Link to="/">
          <div className='h-10 w-10 flex hover:scale-105 hover:shadow-sm hover:shadow-gray-500 items-center justify-center bg-gray-200 rounded-full cursor-pointer absolute [@media(max-width:500px)]:top-5 top-10 [@media(max-width:500px)]:left-5 left-10' title={"Home Page"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          </div>
        </Link>
      </div>
      {
        (loading || success)
          ?
          <Loader message={"Creating your account..."} />
          :
          <></>
      }
      <div className='max-w-[1700px] grid [@media(min-width:1000px)]:grid-cols-2 grid-cols-1 gap-5 items-center text-white'>
        <div className='xl:pl-40 md:pl-10 flex-col gap-6 [@media(min-width:1000px)]:flex hidden'>
          {/* <img src={icon} className='w-16 h-16' /> */}
          <img src={icon} className='w-fit h-16' />
          <p className='text-3xl font-semibold'>Big ideas. Amazing talent.The recruiting software that brings them together.</p>
          <div className='flex flex-col gap-4'>
            {points.map((item) => (
              <div key={item} className='flex items-center gap-3'>
                <img src={white_tick} className='w-6 h-6' />
                <p className='text-lg'>{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='w-[100%] flex flex-col justify-end [@media(max-width:1000px)]:items-center 2xl:pr-40 xl:pr-32 lg:pr-10'>
          <div style={{ scrollbarWidth: 'none' }} className='md:h-[95vh] h-[90vh] md:mt-[5vh] mt-[10vh] shadow-gray-800 shadow-lg overflow-auto text-gray-500 [@media(max-width:500px)]:w-[98vw] w-[100%] lg:w-[80%] 2xl:w-[70%] bg-white rounded-t-3xl  gap-4 px-10 [@media(max-width:450px)]:px-4 py-8'>
            <form onSubmit={formik.handleSubmit} className='w-[100%] flex flex-col gap-4'>
              <div className='flex flex-col gap-1 mb-1'>
                <p className='text-2xl text-gray-700 font-medium'>Signup</p>
                <p className='text-sm font-light'>Start your 15-day trial, no credit card required.</p>
              </div>
              <TextField
                fullWidth
                sx={{ borderRadius: '10px' }}
                label='Company Name'
                {...formik.getFieldProps('companyName')}
                error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                helperText={formik.touched.companyName && formik.errors.companyName}
              />
              <TextField
                fullWidth
                className='rounded-lg'
                style={{ borderRadius: '10px' }}
                label='Company Website'
                {...formik.getFieldProps('companyWebsite')}
                error={formik.touched.companyWebsite && Boolean(formik.errors.companyWebsite)}
                helperText={formik.touched.companyWebsite && formik.errors.companyWebsite}
              />
              <TextField
                fullWidth
                type="number"
                label="Company Size"
                {...formik.getFieldProps('companySize')}
                onChange={(event) => {
                  let value = Number(event.target.value);
                  if (value < 1) value = 1;
                  if (value > 1000) value = 1000;
                  formik.setFieldValue('companySize', value);
                }}
                inputProps={{ min: 1, max: 1000 }}
                error={formik.touched.companySize && Boolean(formik.errors.companySize)}
                helperText={formik.touched.companySize && formik.errors.companySize}
              />
              <TextField
                fullWidth
                className='rounded-lg'
                style={{ borderRadius: '10px' }}
                label='Phone Number'
                {...formik.getFieldProps('phoneNumber')}
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              />
              <div className='px-2'>
                {formik.touched.evaluatingWebsite && formik.errors.evaluatingWebsite ? (
                  <p className="text-red-500 text-sm">{formik.errors.evaluatingWebsite}</p>
                ) : null}
                <p>Evaluating Website Purpose</p>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.evaluatingWebsite[0].checked}
                      onChange={() => {
                        const updatedEvaluatingWebsite = [...formik.values.evaluatingWebsite];
                        updatedEvaluatingWebsite[0].checked = !updatedEvaluatingWebsite[0].checked;
                        formik.setFieldValue('evaluatingWebsite', updatedEvaluatingWebsite);
                      }}
                    />
                  }
                  label={formik.values.evaluatingWebsite[0].name}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.evaluatingWebsite[1].checked}
                      onChange={() => {
                        const updatedEvaluatingWebsite = [...formik.values.evaluatingWebsite];
                        updatedEvaluatingWebsite[1].checked = !updatedEvaluatingWebsite[1].checked;
                        formik.setFieldValue('evaluatingWebsite', updatedEvaluatingWebsite);
                      }}
                    />
                  }
                  label={formik.values.evaluatingWebsite[1].name}
                />
              </div>
              <Autocomplete
                disablePortal
                options={roles}
                onChange={(event, value) => formik.setFieldValue('role', value.id)}
                renderInput={(params) => <TextField {...params} label='Select Role' />}
              />
              <TextField
                fullWidth
                className='rounded-lg'
                style={{ borderRadius: '10px' }}
                label='Email'
                {...formik.getFieldProps('email')}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                fullWidth
                className='rounded-lg'
                style={{ borderRadius: '10px' }}
                label='Password'
                type='password'
                {...formik.getFieldProps('password')}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              {
                error
                  ?
                  <div className=''>
                    <p className='text-red-500 text-wrap'>{error}</p>
                  </div>
                  :
                  <></>
              }
              <Button type='submit' variant='contained' style={{ backgroundColor: '#212121', padding: '10px 20px', borderRadius: '10px' }}>
                Sign Up
              </Button>
              <p className='text-center text-sm font-normal'>
                Already have an account? <Link to='/signin'><span className='font-semibold underline pl-1'>SIGN IN</span></Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
