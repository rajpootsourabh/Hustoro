import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar'
import candidateImg from '../assets/candidate.png'
import tick from '../assets/tick.svg'
import ats from '../assets/ats.png'
import Footer from '../Components/Footer'
import { changeTitle } from '../utils/changeTitle'
const ProductsPage = () => {
    useEffect(()=>{
      changeTitle("Products")
    },[])

    const cand = [
        {
            heading:"200+ free and premium job boards",
            content:'Post your job to 200+ job boards simultaneously, reaching a wider audience with a single submission.'
        },
        {
            heading:'Multi-language hiring options',
            content:'Translate job posts, applications, and offers into six languages, supporting global recruitment efforts.'
        },
        {
            heading:'No-code careers page builder',
            content:'Create a branded, mobile-friendly careers page with built-in search, filtering, and auto-fill applications without coding skills. Brand with custom layout, brand colors, fonts and media.'
        },
        {
            heading:'Jobs widget and API access',
            content:'Embed an automatically updating, branded job list on your existing website using a simple, customizable widget. Or access our API for further customization.'
        },
        {
            heading:'Our Jobs',
            content:'Access our job board to send targeted job recommendations and source resumes from opted-in candidates.'
        }
    ]
  return (
    <>
        {/* Navbar */}
        <Navbar />

        <section className="flex justify-center items-center bg-[#00756A] py-8">
          <div className="w-3/5 sm:min-w-[500px] min-w-[350px] max-w-[900px] flex flex-col justify-start items-center text-center md:py-10 py-2 gap-10">
            <h1 className="sm:text-5xl text-4xl font-semibold text-white" style={{lineHeight:'3.3rem'}}>Your complete HR and hiring platform</h1>
            <p className="text-lg font-light text-white">Your system of record for everything HR. All the features you need to find and hire the best, manage HR data, and keep track of time off and attendance.</p>
            {/* <p className="text-lg font-light text-white">Try it for free, no credit card required.</p> */}
            {/* <div className="flex flex-col sm:flex-row justify-center gap-2">
              <button className='rounded-full font-semibold px-6 py-2.5 hover:bg-gray-100 text-[#00756A] bg-white'>Start a free trial</button>
              <button className='rounded-full font-semibold text-white hover:text-[#00756A] hover:bg-white  px-6 py-2.5'>Request a Demo &rarr;</button>
            </div> */}
          </div>
        </section>

        {/* Candidate sourcing suite */}
        <div className='py-16 flex justify-center items-center'>
            <div className='max-w-[1700px] grid lg:grid-cols-2 grid-cols-1 items-center gap-5'>
                <div className='flex flex-col lg:items-start items-center justify-center w-9/10 sm:px-16 px-4 gap-5'>
                    <div>
                        <p className='sm:text-5xl text-4xl font-semibold lg:text-left text-center' style={{lineHeight:'3.2rem'}}>Candidate</p>
                        <p className='sm:text-5xl text-4xl font-semibold lg:text-left text-center' style={{lineHeight:'3.2rem'}}>sourcing suite</p>
                    </div>
                    <p className='lg:text-left text-center'>A Candidate Sourcing Suite is a powerful tool that helps recruiters find, engage, and manage top talent efficiently. It streamlines sourcing from job boards, social media, and databases, using AI-driven insights to identify the best candidates. With automation and analytics, it enhances hiring speed and quality.</p>
                </div>
                <div className='sm:px-16 px-4 flex items-center justify-center'>
                    <img src={candidateImg} alt="iii" />
                </div>
            </div>
        </div>

        {/* job posting and distribution */}
        <div className='py-16 bg-[#F3F3F3] flex justify-center items-center'>
            <div className='max-w-[1700px] flex flex-col items-center gap-10'>
                <p className='sm:text-5xl text-4xl font-semibold text-center' style={{lineHeight:'3.5rem'}}>Job posting and distribution</p>
                <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10 xl:px-36 lg:px-16 md:px-16 px-4'>
                    {
                        cand.map((item,index)=>{
                            return <div key={item.heading} className='flex flex-col items-start justify-start gap-3 py-8 px-4 rounded-lg bg-white border border-[#00756A] border-b-4 border-x-0 border-t-0 '>
                                <img src={tick} alt="" />
                                <p className='text-xl font-semibold'>{item.heading}</p>
                                <p>{item.content}</p>
                            </div>
                        })
                    }
                </div>

            </div>
        </div>


        {/* Candidate sourcing suite */}
        <div className='py-16 flex justify-center items-center'>
            <div className='max-w-[1700px] grid lg:grid-cols-2 grid-cols-1 items-center gap-5'>
                <div className='flex flex-col lg:items-start items-center justify-center w-9/10 sm:px-16 px-4 gap-5'>
                    <div>
                        <p className='sm:text-5xl text-4xl font-semibold lg:text-left text-center' style={{lineHeight:'3.2rem'}}>Applicant tracking system | ATS</p>
                        {/* <p className='sm:text-5xl text-4xl font-semibold lg:text-left text-center' style={{lineHeight:'3.2rem'}}>sourcing suite</p> */}
                    </div>
                    <p className='lg:text-left text-center'>An Applicant Tracking System (ATS) is a software solution that streamlines the hiring process by managing job applications, resumes, and candidate communications. It automates job postings, resume screening, and interview scheduling to improve efficiency. With AI-driven insights, it helps recruiters find the best talent faster.</p>
                </div>
                <div className='sm:px-16 px-4 flex items-center justify-center'>
                    <img src={ats} alt="iii" />
                </div>
            </div>
        </div>



        {/* CTA Section */}
        <div className='flex flex-col justify-center bg-black  py-16 items-center gap-12'>
            <div className='flex flex-col gap-6 items-center'>
              <p className='text-4xl text-white text-center font-semibold'>Explore our full platform with a 15-day free trial.</p>
              <p className='text-lg w-3/4 sm:text-center text-justify font-light text-white'>No credit card required. Post jobs, hire faster, and manage your people effortlessly with our all-in-one platform.</p>
            </div>
            {/* <div className='flex sm:flex-row flex-col gap-3'>
              <button className='rounded-full font-semibold px-6 py-2.5 hover:text-[#0D6C5A] hover:bg-white text-white bg-[#0D6C5A]'>Start a free trial</button>
              <button className='rounded-full font-semibold text-white hover:text-[#0D6C5A] hover:bg-white px-6 py-2.5 border border-solid border-white'>Request a Demo &rarr;</button>
            </div> */}
        </div>
        {/* Footer */}
        <Footer />
    </>
  )
}

export default ProductsPage
