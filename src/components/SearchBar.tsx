import Image from 'next/image'

import { atom, useAtom, useAtomValue } from 'jotai'
import {
  getCityInstitutionsAtom,
  institutionsAtom,
  type Institution,
} from '@/atoms/institutions'
import { citiesAtom, getInstitutionCityAtom, type City } from '@/atoms/cities'

import Fuse, { type FuseResult } from 'fuse.js'

import { Input } from './ui/input'

import Small from './Typography/Small'
import Muted from './Typography/Muted'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'
import { getInstitutionFirstPhotoAtom } from '@/atoms/photos'

interface SearchBarResult {
  id: number
  name: string
  address: string
  cityName?: string
  photoUrl?: string
}

const searchBarResultsAtom = atom<SearchBarResult[]>([])

export default function SearchBar() {
  const institutions = useAtomValue(institutionsAtom)
  const cities = useAtomValue(citiesAtom)

  const getInstitutionCity = useAtomValue(getInstitutionCityAtom)
  const getCityInstitutions = useAtomValue(getCityInstitutionsAtom)
  const getInstitutionFirstPhoto = useAtomValue(getInstitutionFirstPhotoAtom)

  const [searchBarResults, setSearchBarResults] = useAtom(searchBarResultsAtom)

  const fuse = new Fuse<Institution | City>([...institutions, ...cities], {
    keys: ['name'],
  })

  // Organize this functions into classes?
  // Functions with functions inside seems like classes xD
  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value
    const fuseResults = fuse.search(query)

    function searchResultsFromFuseResults(): SearchBarResult[] {
      const searchResults: SearchBarResult[] = []

      function addSearchResultsFromFuseResults(): void {
        function addSearchResultFromFuseResult(
          result: FuseResult<City | Institution>,
        ): void {
          const item = result.item

          function isItemInstitution(): boolean {
            return 'cityId' in item
          }

          function searchBarResultFromInstitution(
            institution: Institution,
            cityName?: string,
            photoUrl?: string,
          ): SearchBarResult {
            return {
              id: institution.id,
              name: institution.name,
              address: institution.address,
              cityName,
              photoUrl,
            }
          }

          function addSearchResult(): void {
            function institutionWithCityNameFromInstitution(): SearchBarResult {
              const institution = item as Institution
              const institutionCity = getInstitutionCity(institution)
              const institutionPhoto = getInstitutionFirstPhoto(institution)
              const searchBarResult: SearchBarResult =
                searchBarResultFromInstitution(
                  institution,
                  institutionCity?.name,
                  institutionPhoto?.url,
                )

              return searchBarResult
            }

            searchResults.push(institutionWithCityNameFromInstitution())
          }

          function addSearchResultFromCity(): void {
            function searchResultsFromCity(): SearchBarResult[] {
              const city = item as City
              const cityInstitutions = getCityInstitutions(city)

              return cityInstitutions.map((institution) => {
                const institutionPhoto = getInstitutionFirstPhoto(institution)

                return searchBarResultFromInstitution(
                  institution,
                  city.name,
                  institutionPhoto?.url,
                )
              })
            }

            searchResults.push(...searchResultsFromCity())
          }

          if (isItemInstitution()) {
            addSearchResult()
          } else {
            addSearchResultFromCity()
          }
        }

        fuseResults.forEach(addSearchResultFromFuseResult)
      }

      function removeSearchResultsDuplicates(): void {
        searchResults.forEach((searchResult1, index1) => {
          searchResults.forEach((searchResult2, index2) => {
            if (index1 !== index2 && searchResult2.id === searchResult1.id) {
              searchResults.splice(index2, 1)
            }
          })
        })
      }

      addSearchResultsFromFuseResults()
      removeSearchResultsDuplicates()

      return searchResults
    }

    setSearchBarResults(searchResultsFromFuseResults())
  }

  return (
    <div
      className={cn(
        'absolute z-10 w-full space-y-2 bg-white px-5 py-4 transition-all sm:mx-6 sm:my-3 sm:w-96 sm:bg-transparent sm:p-0 2xl:m-3',
        {
          'rounded sm:m-0 sm:w-[25.5rem] sm:bg-white sm:p-3 2xl:m-0':
            searchBarResults.length > 0,
        },
      )}
    >
      <Input placeholder='Pesquisar cidade ou FATEC' onChange={handleSearch} />
      <div
        className={cn('rounded bg-white p-2', {
          hidden: searchBarResults.length === 0,
        })}
      >
        {searchBarResults.map((searchBarResult) => (
          <Button
            variant='secondary'
            className='flex h-32 w-full gap-x-2'
            key={searchBarResult.id}
          >
            <div className='flex h-full flex-1 flex-col gap-y-6 pt-1 text-start'>
              <Small>{searchBarResult.name}</Small>
              <Muted className='text-pretty'>{searchBarResult.address}</Muted>
            </div>
            <div className='flex flex-1 flex-col items-center gap-y-2'>
              <Muted>{searchBarResult.cityName}</Muted>
              <Image
                src={searchBarResult.photoUrl || ''}
                alt={`Imagem da ${searchBarResult.name}`}
                width={160}
                height={82.064516112}
                className='rounded-sm shadow-sm'
              />
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}
