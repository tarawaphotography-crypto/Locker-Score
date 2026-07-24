import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash(){
  const nav = useNavigate()
  React.useEffect(()=>{
    const t = setTimeout(()=>nav('/home'),900)
    return ()=>clearTimeout(t)
  },[])
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <div className="text-4xl text-gold font-bold">Locker Scores</div>
      <div className="mt-4 text-white/70">A PWA scorer for Locker (7♥)</div>
    </div>
  )
}
