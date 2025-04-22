import React, { useEffect } from "react";
import './pricing.css'
import Navbar from "../Components/Navbar";
import greenPointer from '../assets/green_pointer.svg'
import { pricingPlans } from "../Data/content";
import Footer from "../Components/Footer";
import { changeTitle } from "../utils/changeTitle";
const Pricing = () => {
  useEffect(()=>{
    changeTitle("Pricing")
  },[])
  return (
    <>
      {/* Navbar */}
      <Navbar />

      <section className="flex justify-center items-center bg-[#00756A] py-8">
        <div className="w-3/5 sm:min-w-[500px] min-w-[350px] max-w-[900px] flex flex-col justify-start items-center text-center md:py-10 py-2 gap-10">
          <h1 className="sm:text-5xl text-4xl font-semibold text-white" style={{lineHeight:'3.3rem'}}>Simple, fair pricing for your complete HR solution</h1>
          <p className="text-lg font-light text-white">Over 30,000 companies have used to find, hire, and manage their employees. Buy what you need and we able can grow with you.</p>
          <p className="text-lg font-light text-white">Try it for free, no credit card required.</p>
          {/* <div className="flex flex-col sm:flex-row justify-center gap-2">
            <button className='rounded-full font-semibold px-6 py-2.5 hover:bg-gray-100 text-[#00756A] bg-white'>Start a free trial</button>
            <button className='rounded-full font-semibold text-white hover:text-[#00756A] hover:bg-white  px-6 py-2.5'>Request a Demo &rarr;</button>
          </div> */}
        </div>
      </section>


      <section className="flex justify-center items-center">
        <div className="flex flex-col justify-start items-center py-12 gap-14">
            <div className="w-3/5 min-w-[350px] max-w-[1440px] flex flex-col justify-start items-center gap-3">
                <p className="text-center text-4xl font-semibold">Our Pricing Plans</p>
                <p className="sm:text-center text-justify">When you’re ready to go beyond prototyping in Figma,Webflow is ready to help you bring your designs to life — without coding them.</p>
            </div>

            <div className="grid lg:grid-cols-3 grid-cols-1 gap-10">
                {
                    pricingPlans.map((item,indx)=>{
                        return <div key={indx} className={`max-w-[350px] ${indx===1 ? 'bg-black text-white':'bg-[#F4F6FC]'} rounded-xl px-5 py-10 flex flex-col justify-between items-start gap-5`}>
                            <div className="flex flex-col justify-start items-start gap-4">
                                <p className={`${indx===1 ? 'text-[#FCD980]': 'text-black'} flex gap-2 items-center`}><span className={`${indx===1 ? 'text-white': 'text-black'} text-3xl font-bold `}>{item.price}</span> USD/month</p>
                                <p className="text-xl font-semibold">{item.description}</p>
                                <div className="flex flex-col justify-start items-start gap-3">
                                    {
                                        item.features.map((feature,index)=>{
                                            return <div key={index} className="flex gap-3">
                                                    <img src={greenPointer} />
                                                    <p className={`${indx===1 ? 'text-white' : (feature.isIncluded ? 'text-gray-900':'text-gray-400 line-through')} font-light`}>{feature.name}</p>
                                                </div>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="w-[100%] flex justify-center items-center">
                                <button className="rounded-full font-semibold px-16 w-fit py-2.5 hover:bg-white hover:text-[#00756A] text-white bg-[#00756A]">Get Started</button>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
      </section>

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
  );
};


export default Pricing;



