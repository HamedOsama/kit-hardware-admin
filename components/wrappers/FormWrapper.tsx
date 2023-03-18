import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
interface IProps {
  children: React.ReactNode
  login: boolean
}
const FormWrapper = ({ login, children }: IProps) => {
  return (
    <div className="relative flex items-center w-full max-md:max-w-md px-8 sm:px-14 mx-auto lg:w-1/2 xl:w-5/12 bg-white lg:rounded-r-md">
      <div className="flex-1 ">
        <Link
          href="/"
          className="absolute top-4 left-4 flex items-stretch gap-1 text-gray-400 focus:text-blue-500 hover:text-blue-500">
          <KeyboardBackspaceRoundedIcon className=' hover:underline duration-150' />
          <span className="text-sm duration-150">
            Home
          </span>
        </Link>
        <div className="text-center">
          <div className="flex justify-center mx-auto">
            <Image
              src="https://zammit.s3-eu-west-1.amazonaws.com/website_assets/images/000/070/704/medium/image.png?1674118930"
              alt="logo"
              width={100}
              height={100}
            />
          </div>

          <p className="mt-3 text-gray-500 dark:text-gray-300">{login ? 'Sign in to access your account' : 'sign up to get access'}</p>
        </div>

        <div>
          {children}

          {/* <p className="mt-6 text-sm text-center text-gray-400">
            {login ? 'Don\'t have an account yet?' : 'Already have an account?'}
            <Link href={login ? '/sign-up' : '/login' } className="text-blue-500 focus:outline-none focus:underline hover:underline">
              Sign {login ? 'up' : 'in'}
            </Link>.</p> */}
        </div>
      </div>
    </div>
  )
}

export default FormWrapper