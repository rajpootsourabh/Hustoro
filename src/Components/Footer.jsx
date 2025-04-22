import React from 'react'

const Footer = () => {
  return (
    <div className='h-[8vh] text-gray-600 bg-white sm:flex grid grid-cols-12 justify-center items-center sm:gap-4 gap-1 px-2 sm:py-0 py-1'>
      <p className='p-0 m-0 col-span-12 sm:text-sm text-xs text-center'>© copyright 2025 www.bipani.com </p>
      <p className='p-0 m-0 sm:text-sm text-xs sm:block hidden'>|</p>
      <p className='p-0 m-0 col-span-6 sm:text-sm text-xs text-center'>Privacy Policy</p>
      <p className='p-0 m-0 sm:text-sm text-xs sm:block hidden'>|</p>
      <p className='p-0 m-0 col-span-6 sm:text-sm text-xs text-center'>Terms & Condition</p>
    </div>
  )
}

export default Footer
