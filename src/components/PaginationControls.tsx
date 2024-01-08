'use client'
import { FC } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationControlsProps {
  hasNextPage: boolean
  hasPrevPage: boolean
  dataLength: number
}

const PaginationControls: FC<PaginationControlsProps> = (
  {
    hasNextPage,
    hasPrevPage,
    dataLength,
  }
) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const page = searchParams?.get('page') ?? '1'
  const per_page = searchParams?.get('per_page') ?? '6'
  const pageMax = Math.ceil(dataLength/Number(per_page))
  console.log('data', pageMax)

  return (
        <div className='flex md:justify-end gap-2 lg:pr-10 justify-center md:pr-5'>
        <button
            className={`${hasPrevPage ? 'bg-green-800 active:bg-green-700 hover:bg-green-700': 'bg-gray-500'} text-white p-2 cursor-pointer rounded-full px-5`}
            disabled={!hasPrevPage}
            onClick={() => {
            router.push(`/?page=${Number(page) - 1}&per_page=${per_page}`)
            }}>
            Prev
        </button>

        <div className="mt-1.5 font-medium px-2 w-20 text-center text-lg">
            {page}/{pageMax}
        </div>

        <button
            className={`${hasNextPage ? 'bg-green-800 active:bg-green-700 hover:bg-green-700' : 'bg-gray-500'} text-white p-2 cursor-pointer rounded-full px-5`}
            disabled={!hasNextPage}
            onClick={() => {
            router.push(`/?page=${Number(page) + 1}&per_page=${per_page}`)
            }}>
            Next
        </button>
        </div>
  )
}

export default PaginationControls