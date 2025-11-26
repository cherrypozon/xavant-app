'use client'
import React from 'react'
import Header from '../Header/main'

const Setting = () => {
  return (
    <div className="p-10 w-full h-screen flex flex-col gap-12 overflow-y-scroll no-scrollbar">
        <Header />
        <div>
            <h1 className="text-2xl text-foreground">Setting View</h1>
        </div>
    </div>
  )
}

export default Setting