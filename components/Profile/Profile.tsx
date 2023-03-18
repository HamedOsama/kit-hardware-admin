import React from 'react'
import ProfileImage from '../ProfileImage/ProfileImage'

const Profile = () => {
  return (
    <div className="p-4">
      <ProfileImage color='#DA1522' />
      <p className='text-main text-xl text-center mt-4'>HamedOsama19</p>
      <p className='text-gray-500 text-sm text-center mt-4'>hamedosama19@gmail.com</p>
    </div>
  )
}

export default Profile