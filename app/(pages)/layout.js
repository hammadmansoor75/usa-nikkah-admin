import { MainNav } from '@/components/main-nav'
// import { UserNav } from '@/components/user-nav'
import React from 'react'

const PagesLayout = ({children}) => {
  return (
    <>
        <div className='border-b flex h-16 items-center px-4' >
            <MainNav className='mx-6'  />
            <div className='ml-auto' >
                {/* <UserNav /> */}
            </div>
        </div>
        {children}
    </>
  )
}

export default PagesLayout