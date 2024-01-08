'use client';
import { useRouter } from 'next/navigation';
import { FC } from 'react'

function BackButton(){
  const router = useRouter();
  return (
    <button onClick={() => router.back()}>
      Back
    </button>
  );
}

export default BackButton;