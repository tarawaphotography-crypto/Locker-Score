import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash(){
  const nav = useNavigate()
  React.useEffect(()=>{
    const t = setTimeout(()=>nav('/home'),1200)
    return ()=>clearTimeout(t)
  },[])
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in">
      <div className="text-5xl text-gold font-extrabold tracking-tight">Locker Scores</div>
      <div className="mt-4 text-white/70">Fast scoring for Locker (7<span className="text-red-400">♥</span>)</div>
      <div className="mt-6 w-24 h-24 rounded-full bg-gradient-to-b from-gold to-gold-700 shadow-lg animate-pulse" />
    </div>
  )
}
