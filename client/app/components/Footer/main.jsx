import React from 'react'

const Footer = () => {
  return (
    <div className="w-full p-2 flex justify-end items-center -my-7">
        <ul className='flex gap-7 font-normal text-sm text-[#FFFFFFA6]'>
            <li className='hover:text-white cursor-pointer '>AI Policy</li>
            <li className='hover:text-white cursor-pointer '>Terms & Conditions</li>
            <li className='hover:text-white cursor-pointer '>Contact Us</li>
        </ul>
    </div>
  )
}

export default Footer