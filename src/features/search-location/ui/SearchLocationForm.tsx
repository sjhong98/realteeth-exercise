import { Input } from "@/shared/ui"

import { useSearchLocation } from "../model"

export default function SearchLocationForm() {
    const { filteredDistrictList, handleSelectLocation, search, setSearch } = useSearchLocation()

    return (
        <div className="flex flex-col w-full gap-2 items-center relative">
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-full z-[4]'
                placeholder='지역을 검색하세요'
            />
            <div className='absolute left-0 top-12 w-full md:relative md:top-0 z-[5] md:z-[1] overflow-hidden rounded-lg bg-[#333333] md:bg-transparent'>
                {filteredDistrictList.length > 0 ? (
                    <div className="flex flex-col w-full gap-2 pt-10 pb-[100px] md:pb-[300px] mt-[-10px] max-h-[calc(100vh-400px)] md:max-h-[calc(100vh-220px)] items-center overflow-y-scroll">
                        {filteredDistrictList.map((district) => (
                            <div
                                key={district}
                                onClick={() => handleSelectLocation(district)}
                                className="flex flex-col w-full px-10 py-1 mb-[-8px] rounded-full cursor-pointer duration-75 hover:bg-[#222222]"
                            >
                                <p className="text-md">{district.replaceAll('-', ' ')}</p>
                            </div>
                        ))}
                    </div>
                ) : filteredDistrictList.length === 0 && search.length > 0 && (
                    <div className='flex w-full h-[200px] items-center justify-center'>
                        <p className='text-md'>검색 결과가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    )
}