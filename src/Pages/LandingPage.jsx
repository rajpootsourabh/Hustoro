import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar'
import mainImg from '../assets/main-img.png'
import tick from '../assets/tick.svg'
import TalentSourcingImg from '../assets/TalentSourcingSuite.png'
import laptopImg from '../assets/laptopImg.png'
import { features,hr_system } from '../Data/content'
import TestimonialCarousel from '../Components/TestimonialCarousel'
import Footer from '../Components/Footer'
import { changeTitle } from '../utils/changeTitle'
const LandingPage = () => {
  useEffect(()=>{
    changeTitle("Hustoro")
  },[])
  
  return (
    <div className='flex flex-col'>
        <Navbar />
        {/* hero section */}
        <div className='flex justify-center items-center lg:px-32 sm:px-16 px-4 lg:py-36 sm:py-16 py-8 h-fit relative gap-5 bg-[#00756A]'>
          <div className='max-w-[1700px] grid grid-cols-12 gap-8'>
            {/* <div className='lg:col-span-6 col-span-12 flex flex-col gap-8 pt-5'>  */}
            <div className='lg:col-span-6 col-span-12 flex flex-col gap-8 md:pt-5 mt-3'> 
              <p className='sm:text-5xl text-4xl font-bold text-white md:text-left text-center'>The future-ready HR platform</p>
              <p className='text-xl text-white md:text-left text-center'>Redefining HR with intelligent tools to streamline hiring, employee data management, time tracking, and payroll.</p>
              {/* <div className='flex flex-col sm:flex-row items-center gap-6'>
                <button className='rounded-full font-semibold px-6 py-2.5 hover:bg-gray-100 bg-white text-[#00756A]'>Start a free trial</button>
                <button className='rounded-full font-semibold hover:text-[#00756A] hover:bg-white text-white px-6 py-2.5 bg-[#00756A] border border-solid border-white'>Request a Demo &rarr;</button>
              </div> */}
            </div>
            <div className='lg:col-span-6 col-span-12'>
              {/* <img src={mainImg} alt="main-logo" width={900} height={900} className='lg:block hidden' /> */}
              <img src={mainImg} alt="main-logo" width={900} height={900} className='' />
            </div>
          </div>
          
        </div>

        {/* candidate sourcing suite */}
        <div className='flex flex-col items-center gap-6 py-10 px-4'>
          <p className='text-lg bg-[#00756A] px-6 py-2 rounded-full text-white'>Candidate sourcing suite</p>
          <p className='text-3xl font-bold text-center '>A complete talent sourcing solution</p>
          <img src={TalentSourcingImg} alt="image" width={920} height={500} className='shadow-xl rounded-2xl' />
        </div>


        {/* features */}
        <div className='h-fit bg-black flex flex-col items-center py-8 justify-start gap-10'>
          <p className='text-3xl font-bold text-white'>Features</p>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-[1920px] md:px-32 sm:px-16 px-4 gap-5'>
            {
              features.map((item,index)=>{
                return  <div key={index} className='bg-white rounded-xl min-h-[250px] px-5 py-4 border border-b-4 border-[#00756A] flex flex-col gap-3'>
                          <img src={tick} alt="sd" width={25} height={25} />
                          <p className='text-xl font-bold p-0 m-0'>{item.heading}</p>
                          <p className='text-gray-500 p-0 m-0'>{item.content}</p>
                        </div>
              })
            }
          </div>
        </div>

        {/* time and attendence system */}
        <div className='w-full flex justify-center items-center'>
          <div className='max-w-[1700px] lg:p-16 md:p-8 p-4'>
            <div className='shadow-2xl rounded-lg grid grid-cols-12 lg:p-5 p-3 items-center'>
              <div className='md:col-span-6 col-span-12 flex flex-col md:items-start items-center gap-5 md:px-4 px-2'>
                <p className='sm:px-10 px-2 py-2 rounded-lg bg-[#00756A] text-white font-semibold w-fit'>Time and attendance system</p>
                <p className='text-3xl md:text-left text-center font-bold'>An easy way to track time and make payroll</p>
                <p className='text-gray-500 md:text-left text-center'>From clock-ins to time off, with detailed approval workflows, Workable helps you handle attendance, leave, and payroll reporting in one place.</p>
              </div>
              <div className='lg:p-16 sm:p-2 md:col-span-6 col-span-12 mt-4 md:mt-0'>
                <img src={laptopImg} alt="laptop-image" />
              </div>
            </div>
          </div>
        </div>

          {/* testimonial */}
          <TestimonialCarousel />


          {/* hr software */}
          <div className='w-full flex justify-center items-center'>
          <div className='h-fit max-w-[1700px] grid grid-cols-12'>
            <div className='md:col-span-5 col-span-12 md:pt-16 py-4  md:px-16 sm:px-8 px-4 flex flex-col gap-5'>
              <p className='text-4xl font-semibold'>Our take on HR software</p>
              <p className='text-lg'>We believe HR software should work for you, not against you.
              Here's what that means to us:</p>
            </div>

            <div className='md:col-span-7 col-span-12 md:pt-16 py-4 md:px-16 sm:px-8 px-4  flex flex-col gap-5'>
              {
                hr_system.map((item,index)=>{
                  return <div className='flex sm:gap-4 md:gap-16 gap-8 border border-b-1 border-t-0 border-x-0 py-3 border-grey-500'>
                    <p className='text-[#00756A] text-xl font-medium'>{item.id}</p>
                    <div>
                      <p className='text-gray-800 text-lg font-medium'>{item.heading}</p>
                      <p className='text-gray-600 text-sm'>{item.content}</p>
                    </div>
                  </div>
                })
              }
            </div>
          </div>
          </div>


          {/* explore section */}
          <div className='flex flex-col justify-center bg-black  py-16 items-center gap-12'>
              <div className='flex flex-col gap-6 items-center'>
                <p className='text-4xl text-white text-center font-semibold'>Explore our full platform with a 15-day free trial.</p>
                <p className='text-lg w-3/4 text-center font-light text-white'>No credit card required. Post jobs, hire faster, and manage your people effortlessly with our all-in-one platform.</p>
              </div>
              {/* <div className='flex sm:flex-row flex-col gap-3'>
                <button className='rounded-full font-semibold px-6 py-2.5 hover:text-[#0D6C5A] hover:bg-white text-white bg-[#0D6C5A]'>Start a free trial</button>
                <button className='rounded-full font-semibold text-white hover:text-[#0D6C5A] hover:bg-white px-6 py-2.5 border border-solid border-white'>Request a Demo &rarr;</button>
              </div> */}
          </div>

          {/* end footer */}
          <Footer />
    </div>
  )
}

export default LandingPage



