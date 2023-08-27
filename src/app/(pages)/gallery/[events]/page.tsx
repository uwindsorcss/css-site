import React, { FC } from 'react'

interface pageProps{
    params: {events:string}
}

const page:FC<pageProps>= ({params}) => {

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      <h1 className='text-4xl text-center font-bold'>{params.events}</h1>
    </div>
  )
}

export default page
