import React, { useEffect, useState } from 'react'
import signup_bg from '../../assets/signup-bg.png'
import white_tick from '../../assets/white-tick.png'
// import icon from '../../assets/Icon.png'
import icon from '../../assets/logo.png'
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Loader from '../Components/Loader'
import { changeTitle } from '../../utils/changeTitle';
import { useSnackbar } from '../Components/SnackbarContext';

const Login = () => {
  const { showSnackbar } = useSnackbar();
  const [rememberMe,setRememberMe] = useState(false)
  const [loading,setLoading] = useState(false)
  const [success,setSuccess] = useState(false)
  const [error,setError] = useState("")
  const navigate = useNavigate()
  useEffect(()=>{
    // get the email from local storage and set it on email
    changeTitle("Login")
    const email = localStorage.getItem('email')
    if(email){
      setRememberMe(true)
      formik.values.email = email
    }
    console.log("email in local storage ",email)
  },[])

  const handleRememberMe = (e)=>{
    console.log("e.target.checked ",e.target.checked)
    setRememberMe(e.target.checked)
  }

  const formik = useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: Yup.object({
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
      }),
      onSubmit: (values) => {
        if(rememberMe){
          localStorage.setItem('email',values.email)
        }else{
          localStorage.removeItem('email')
          // localStorage.setItem('email',values.email)
        }
        postLogin(values)
  
      },
    });

    const postLogin = async(values)=>{
      try {
          setLoading(true)
          const payload = {
            email: values.email,
            password: values.password,
          };
  
          const response = await axios.post('https://bipani.com/api/v.1/login', payload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log("response ",response)
          if(response.status ===200){
            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('email', values.email)
            setLoading(false)
            setSuccess(true)            
            navigate("/dashboard/jobs")
          }else{
            setLoading(false)
            setSuccess(false)
            showSnackbar(response.error, "error")
          }
        } catch (error) {
          showSnackbar(error.response.data.error, "error") 
          setLoading(false)
          setSuccess(false)
        } finally {
          console.log("finaaly run")
        }
      }



  const points = [
    'Find, hire, onboard for every job.',
    'Manage the right person for every job.',
    'Move the right applicants forward.',
    'Find and attract candidates.'
  ]
  return (
    <div className='w-[100vw] relative h-[100vh] flex items-center justify-center bg-contain bg-top' style={{backgroundImage: `url(${signup_bg})` }}>
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
              <Loader message={"Getting you logged in ..."}/>
            :
              <></>
          }
        {
        <div className='max-w-[1700px] grid [@media(min-width:1000px)]:grid-cols-2 grid-cols-1 gap-5 items-center text-white'>
          <div className='xl:pl-40 md:pl-10 flex-col gap-6 [@media(min-width:1000px)]:flex hidden'>
            {/* <img src={icon} className='w-16 h-16' /> */}
            <img src={icon} className='w-fit h-16' />
            <p className='text-3xl font-semibold'>Big ideas. Amazing talent.The recruiting software that brings them together.</p>
            <div className='flex flex-col gap-4'>
              {
                points.map((item)=>{
                  return <div key={item} className='flex items-center gap-3'>
                    <img src={white_tick} className='w-6 h-6' />
                    <p className='text-lg'>{item}</p>
                  </div>
                })
              }
            </div>
          </div>

          <div className='w-[100%] flex flex-col justify-end [@media(max-width:1000px)]:items-center 2xl:pr-40 xl:pr-32 lg:pr-10'>
            <div style={{scrollbarWidth:'none'}} className='md:h-[95vh] h-[90vh] md:mt-[5vh] mt-[10vh] shadow-gray-800 shadow-lg overflow-auto text-gray-500 [@media(max-width:500px)]:w-[98vw] w-[100%] lg:w-[80%] 2xl:w-[70%] bg-white rounded-t-3xl  gap-4 px-10 [@media(max-width:450px)]:px-4 py-8'>
              <form 
                onSubmit={formik.handleSubmit} 
                className='w-[100%] flex flex-col md:gap-4 gap-2 text-sm'
              >
                <div className='flex flex-col gap-1 mb-4'>
                  <p className='text-2xl font-medium text-gray-700'>Log In to your Account</p>
                </div>
                <TextField
                  fullWidth
                  className='rounded-lg'
                  style={{borderRadius:'10px'}}
                  label='Email'
                  {...formik.getFieldProps('email')}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  fullWidth
                  className='rounded-lg'
                  style={{borderRadius:'10px'}}
                  label='Password'
                  type='password'
                  {...formik.getFieldProps('password')}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
                <div className='w-[100%] p-0 m-0 flex lg:flex-row flex-col  justify-between lg:items-center items-start'>
                    <FormControlLabel
                        className='text-sm'
                      style={{ margin:'0'}}
                      control={
                        <Checkbox 
                          style={{}} 
                          checked={rememberMe}  
                          onChange={(e)=>handleRememberMe(e)}
                          name="Remember Me" 
                        />
                      }
                      label="Remember me"
                    />
                    {/* <p className='lg:p-0 pl-4 m-0 text-sm'>Forget Password?</p> */}
                </div>
                {
                  error
                  ?
                  <div className='w-[100%] p-0 m-0 flex lg:flex-row flex-col  justify-between lg:items-center items-start'>
                    <p className='text-red-500 text-md pl-2'>{error}</p>
                  </div>
                  :
                  <></>
                }
                <Button type='submit' variant='contained' style={{ backgroundColor: '#212121', padding: '10px 20px', borderRadius: '10px' }}>
                  Login
                </Button>
                <p className='text-center text-sm font-normal mt-2'>
                  New User ? <Link to='/signup'><span className='font-semibold underline pl-1'>SIGN UP HERE</span></Link>
                </p>
              </form>
            </div>
          </div>
        </div>
        }
    </div>
  )
}

export default Login
