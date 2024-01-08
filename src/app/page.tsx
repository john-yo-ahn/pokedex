import React from 'react'
import HomePage from '@/components/HomePage/HomePage'

export default function Home() {
  return (
    <main>
      <div className="display flex justify-center py-6 font-bold text-6xl text-green-800">Pokedex</div>
      <HomePage />
    </main>
  )
}

export interface HomeData {
  name: string | null,
  id: number | null,

}

