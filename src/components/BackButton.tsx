'use client';
import { useRouter } from 'next/navigation';
import { FC } from 'react'

function BackButton(){
  const router = useRouter();
  return (
    <button className="bg-gray-200 text-lg py-1 px-3 rounded-full mt-3 ml-4 hover:bg-gray-400 active:bg-gray-400" onClick={() => router.back()}>
      Back
    </button>
  );
}

export default BackButton;