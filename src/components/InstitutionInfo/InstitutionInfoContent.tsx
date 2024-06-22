import { useEffect } from 'react'

import api from '@/lib/api'

import { useAtomValue, useSetAtom } from 'jotai'

import { institutionPhotosAtom } from '@/atoms/photos'
import { selectedInstitutionAtom } from '@/atoms/institutions'
import {
  fetchedInstitutionsIdsOnInstitutionCoursesDataAtom,
  addFetchedInstitutionIdOnInstitutionCoursesDataAtom,
} from '@/atoms/fetchedData'
import { addCoursesAtom, type Course } from '@/atoms/courses'
import {
  addCourseOfferingsAtom,
  type CourseOffering,
} from '@/atoms/courseOfferings'

import { SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet'
import { ScrollArea } from '../ui/scroll-area'

import CourseList from '../CourseList'
import Photo from './Photo'
import PhotosCarousel from './PhotosCarousel'

interface FetchInstitutionCoursesDataResponse {
  courses: Course[]
  courseOfferings: CourseOffering[]
}

export default function InstitutionInfoContent() {
  const institutionPhotos = useAtomValue(institutionPhotosAtom)
  const selectedInstitution = useAtomValue(selectedInstitutionAtom)
  const fetchedInstitutionsIdsOnInstitutionCoursesData = useAtomValue(
    fetchedInstitutionsIdsOnInstitutionCoursesDataAtom,
  )
  const addFetchedInstitutionIdOnInstitutionCoursesData = useSetAtom(
    addFetchedInstitutionIdOnInstitutionCoursesDataAtom,
  )
  const addCourses = useSetAtom(addCoursesAtom)
  const addCourseOfferings = useSetAtom(addCourseOfferingsAtom)

  const hasOnlyOnePhoto = institutionPhotos.length === 1

  useEffect(() => {
    async function fetchData() {
      try {
        if (
          !selectedInstitution ||
          fetchedInstitutionsIdsOnInstitutionCoursesData.includes(
            selectedInstitution.id,
          )
        )
          return

        const {
          data: { courses, courseOfferings },
        } = await api.get<FetchInstitutionCoursesDataResponse>(
          `/institution-courses-data/${selectedInstitution.id}`,
        )

        addCourses(courses)
        addCourseOfferings(courseOfferings)
        addFetchedInstitutionIdOnInstitutionCoursesData(selectedInstitution.id)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [
    selectedInstitution,
    fetchedInstitutionsIdsOnInstitutionCoursesData,
    addFetchedInstitutionIdOnInstitutionCoursesData,
    addCourses,
    addCourseOfferings,
  ])

  if (!selectedInstitution) return

  const { name, description, address, phoneNumber } = selectedInstitution

  return (
    <>
      <SheetHeader>
        <SheetTitle>Informações da {name}</SheetTitle>
      </SheetHeader>
      <ScrollArea className='pr-3'>
        <SheetDescription>
          {description.map((paragraph, index) => (
            <span key={index} className='block'>
              {paragraph}
            </span>
          ))}
        </SheetDescription>
        <div className='flex flex-col gap-2'>
          <span className='font-semibold'>
            Endereço:{' '}
            <span className='self-center text-sm font-medium leading-none'>
              {address}
            </span>
          </span>
          <span className='font-semibold'>
            Telefone:{' '}
            <span className='text-sm font-medium leading-none'>
              {phoneNumber}
            </span>
          </span>
          <div className='w-full space-y-4'>
            {hasOnlyOnePhoto ? <Photo /> : <PhotosCarousel />}
            <CourseList />
          </div>
        </div>
      </ScrollArea>
    </>
  )
}
