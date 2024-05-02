'use client'

import { Fragment } from 'react'

import { useAtomValue, useSetAtom } from 'jotai'
import { coursesAtom, selectedCourseAtom } from '@/atoms/institutionCoursesData'

import { Button } from './ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export default function CourseList() {
  const courses = useAtomValue(coursesAtom)
  const setSelectedCourse = useSetAtom(selectedCourseAtom)

  return (
    <ScrollArea className='h-80 w-full rounded-md border p-4'>
      <h4 className='mb-4 text-lg font-bold leading-none'>
        Cursos disponíveis
      </h4>
      {courses.map((course) => {
        const lastCourseId = courses.at(-1)?.id
        if (lastCourseId === course.id) {
          return (
            <Button
              key={course.id}
              variant='outline'
              className='h-auto w-full text-pretty'
              onClick={() => setSelectedCourse(course)}
            >
              {course.title}
            </Button>
          )
        }

        return (
          <Fragment key={course.id}>
            <Button
              variant='outline'
              className='h-auto w-full text-pretty'
              onClick={() => setSelectedCourse(course)}
            >
              {course.title}
            </Button>
            <Separator className='my-2' />
          </Fragment>
        )
      })}
    </ScrollArea>
  )
}
