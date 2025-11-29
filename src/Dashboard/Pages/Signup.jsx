import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import signup_bg from '../../assets/signup-bg.png';
import white_tick from '../../assets/white-tick.png';
import logo from '../../assets/logo_white.png';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Components/Loader';
import { changeTitle } from '../../utils/changeTitle';
import { useSnackbar } from '../Components/SnackbarContext';
import StageConfigurationModal from '../../Components/StageConfigurationModal';
import { Check, CheckIcon } from 'lucide-react';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [stages, setStages] = useState([]);
  const [useDefaultStages, setUseDefaultStages] = useState(true);
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [stagesTouched, setStagesTouched] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    changeTitle("Register");
    fetchAvailableDocuments();
  }, []);

  const fetchAvailableDocuments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/documents`);
      if (response.data.status === 'success') {
        setAvailableDocuments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const roles = [
    { label: 'Business Owner / Executive', id: 1 },
    { label: 'Human Resources', id: 2 },
    { label: 'Recruitment', id: 3 },
    { label: 'Finance', id: 4 },
  ];

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
      companySize: Yup.number()
        .min(1, 'Must be at least 1')
        .max(1000, 'Must be at most 1000')
        .required('Required'),
      evaluatingWebsite: Yup.array()
        .test(
          'at-least-one-checked',
          'At least one option (HR or Recruiting) must be selected',
          (value) => value.some((item) => item.checked)
        ),
      phoneNumber: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    }),
    onSubmit: (values) => {
      // Validate custom stages before submission
      if (!useDefaultStages && stages.length === 0) {
        setStagesTouched(true);
        setError("Please configure at least one custom stage");
        return;
      }
      // Clear any previous custom stage errors if stages are now valid
      if (stages.length > 0) {
        setError("");
      }
      postSignup(values);
    },
  });

  const handleUseDefaultStagesChange = (e) => {
    setUseDefaultStages(e.target.checked);
    // Reset stages when switching back to default
    if (e.target.checked) {
      setStages([]);
      setStagesTouched(false);
      setError(""); // Clear any custom stage errors
    }
  };

  const handleStageModalOpen = () => {
    setStageModalOpen(true);
    // Don't set stagesTouched here - only set it on form submission
  };

  const handleStageModalClose = () => {
    setStageModalOpen(false);
  };

  const postSignup = async (values) => {
    try {
      const selectedOptions = values.evaluatingWebsite
        .filter(item => item.checked)
        .map(item => item.name)
        .join(', ');

      setLoading(true);

      // Build payload conditionally
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
        stage_type: useDefaultStages ? 'default' : 'custom',
      };

      // Only add stages for custom stage type
      if (!useDefaultStages) {
        payload.stages = stages;
      }

      console.log('Registration payload:', payload);

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        showSnackbar("Signup successful");
        setSuccess(true);
        navigate("/signin");
      } else {
        setError("Something went wrong. Please try again.");
        setSuccess(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Full error response:", error.response);

      let message = "An error occurred during registration";

      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle different error response structures
        if (errorData.message) {
          // If message is an object with field-specific errors like {"email": ["The email has already been taken."]}
          if (typeof errorData.message === 'object') {
            // Get the first error message from the first field
            const firstField = Object.keys(errorData.message)[0];
            if (firstField && errorData.message[firstField] && errorData.message[firstField].length > 0) {
              message = errorData.message[firstField][0];
            }
          }
          // If message is a string
          else if (typeof errorData.message === 'string') {
            message = errorData.message;
          }
        }
        // If the response has a different structure
        else if (errorData.errors) {
          // Handle Laravel-like validation errors
          const firstErrorKey = Object.keys(errorData.errors)[0];
          if (firstErrorKey && errorData.errors[firstErrorKey] && errorData.errors[firstErrorKey].length > 0) {
            message = errorData.errors[firstErrorKey][0];
          }
        }
      } else if (error.message) {
        message = error.message;
      }

      // Show the error in snackbar
      showSnackbar(message, 'error');
      setError(message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const points = [
    'Find, hire, onboard for every job.',
    'Manage the right person for every job.',
    'Move the right applicants forward.',
    'Find and attract candidates.',
  ];

  // Check if custom stages are required and valid
  // Only show error after form submission attempt (stagesTouched is true)
  const showCustomStagesError = !useDefaultStages && stages.length === 0 && stagesTouched;

  return (
    <div
      className='relative flex items-center justify-center bg-contain bg-top'
      style={{ backgroundImage: `url(${signup_bg})` }}
    >
      <div className='sm:block hidden'>
        <Link to="/">
          <div className='h-10 w-10 flex hover:scale-105 hover:shadow-sm hover:shadow-gray-500 items-center justify-center bg-gray-200 rounded-full cursor-pointer absolute [@media(max-width:500px)]:top-5 top-10 [@media(max-width:500px)]:left-5 left-10' title={"Home Page"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          </div>
        </Link>
      </div>

      {(loading || success) && <Loader message={"Creating your account..."} />}

      <StageConfigurationModal
        open={stageModalOpen}
        onClose={handleStageModalClose}
        stages={stages}
        setStages={setStages}
        availableDocuments={availableDocuments}
      />

      <div className='max-w-[1700px] grid [@media(min-width:1000px)]:grid-cols-2 grid-cols-1 gap-5 items-center text-white'>
        <div className='xl:pl-40 md:pl-10 flex-col gap-6 [@media(min-width:1000px)]:flex hidden'>
          <img src={logo} alt="Logo" className="h-16 w-fit" />
          <p className='text-3xl font-semibold'>Big ideas. Amazing talent.The recruiting software that brings them together.</p>
          <div className='flex flex-col gap-4'>
            {points.map((item) => (
              <div key={item} className='flex items-center gap-3'>
                <img src={white_tick} className='w-6 h-6' alt="check" />
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

              {/* Existing form fields */}
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
                onChange={(event, value) => formik.setFieldValue('role', value?.id || '')}
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

              {/* Stage Configuration Toggle */}
              <div className={`border rounded-lg p-4 ${showCustomStagesError ? 'border-red-500 bg-red-50' : 'bg-gray-50'}`}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={useDefaultStages}
                        onChange={handleUseDefaultStagesChange}
                      />
                    }
                    label={
                      <div>
                        <span className="font-medium">Use Default Stages</span>
                        <p className="text-sm text-gray-600">
                          Pre-configured hiring pipeline with Pre-Hire and Onboarding stages
                        </p>
                      </div>
                    }
                  />
                </FormGroup>

                {!useDefaultStages && (
                  <div className="mt-3">
                    <Button
                      variant="outlined"
                      onClick={handleStageModalOpen}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderColor: showCustomStagesError ? 'error.main' : 'grey.400'
                      }}
                      color={showCustomStagesError ? 'error' : 'primary'}
                    >
                      {stages.length > 0
                        ? `Re-configure Pipeline`
                        : 'Configure Custom Pipeline'
                      }
                    </Button>

                    {stages.length > 0 && (
                      <div className="mt-2 p-2 text-green-600 flex items-center gap-2">
                        <Check />
                        <p className="text-sm text-gray-700">
                          Pipeline configured with {stages.length} stage(s)
                        </p>
                      </div>
                    )}

                    {showCustomStagesError && (
                      <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
                        <p className="text-sm text-red-800">
                          <strong>Required:</strong> Please configure at least one custom stage
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button
                type='submit'
                variant='contained'
                style={{ backgroundColor: '#212121', padding: '10px 20px', borderRadius: '10px' }}
              >
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