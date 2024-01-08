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

  return (
        <div className='flex md:justify-end gap-2 lg:pr-10 justify-center md:pr-5'>
        <button
            className={`${hasPrevPage ? 'bg-blue-500': 'bg-gray-500'} text-white p-2 cursor-pointer rounded-full`}
            disabled={!hasPrevPage}
            onClick={() => {
            router.push(`/?page=${Number(page) - 1}&per_page=${per_page}`)
            }}>
            prev page
        </button>

        <div className="mt-2 font-medium px-2 w-[30px] text-center">
            {page} / 
        </div>

        <button
            className={`${hasNextPage ? 'bg-blue-500' : 'bg-gray-500'} text-white p-2 cursor-pointer rounded-full`}
            disabled={!hasNextPage}
            onClick={() => {
            router.push(`/?page=${Number(page) + 1}&per_page=${per_page}`)
            }}>
            next page
        </button>
        </div>
  )
}

export default PaginationControls