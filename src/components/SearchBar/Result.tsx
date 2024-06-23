import Image from 'next/image'

import { useSetAtom } from 'jotai'

import { setSelectedInstitutionByIdAtom } from '@/atoms/institutions'
import { openInstitutionInfoAtom } from '@/atoms/sheets'

import { Button } from '../ui/button'

import Small from '../Typography/Small'
import Muted from '../Typography/Muted'

import { cn } from '@/lib/utils'

import type { SearchBarResult } from '.'
import { useAtom } from 'jotai'
import { photosAtom } from '@/atoms/photos'
import { useEffect } from 'react'
import api from '@/lib/api'

interface ResultProps extends SearchBarResult {
  className?: string
}

const fetchInstitutionPhotos = async (id: number) => {
  const { data: { photos } } = await api.get(`/photos/institution/${id}`);
  return photos;
}

export default function Result({
  id,
  name,
  address,
  cityName,
  photoUrl,
  className,
}: ResultProps) {

  const [photos, setPhotos] = useAtom(photosAtom)

  useEffect(() => {
    async function fetchData() {
      try {
        const newPhotos = await fetchInstitutionPhotos(id)
        setPhotos([...photos, ...newPhotos]);
      } catch (error) {
        console.error(error)
      }
    }

    fetchData();
  })

  const setSelectedInstitutionById = useSetAtom(setSelectedInstitutionByIdAtom)
  const openInstitutionInfo = useSetAtom(openInstitutionInfoAtom)

  function handleButtonClick() {
    setSelectedInstitutionById(id)
    openInstitutionInfo()
  }

  return (
    <Button
      variant='secondary'
      className={cn('flex h-32 w-full gap-x-2', className)}
      onClick={handleButtonClick}
    >
      <div className='flex h-full flex-1 flex-col gap-y-6 pt-1 text-start'>
        <Small>{name}</Small>
        <Muted className='text-pretty'>{address}</Muted>
      </div>
      <div className='flex flex-1 flex-col items-center gap-y-2'>
        <Muted>{cityName}</Muted>
        <Image  
          src={photoUrl || ''}
          alt={`Imagem da ${name}`}
          width={160}
          height={82.064516112}
          className='rounded-sm shadow-sm'
        />
      </div>
    </Button>
  )
}
