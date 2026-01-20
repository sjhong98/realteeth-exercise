import { useEffect } from "react"
import dayjs from "dayjs"
import 'dayjs/locale/ko'

import { useBookmark } from '@/entities/location-bookmark'
import { CurrentLocationInfo, CurrentWeatherInfo, EmptyWeather, HourlyWeatherList, LoadingWeather, MinMaxTemperature, useWeather } from '@/entities/weather'
import { BookmarkToggleButton, useUpdateBookmark, WeatherTitleUpdateForm } from '@/features/manage-location-bookmark'

import { useCurrentDistrict } from "@/features/search-location"

dayjs.locale('ko')

export default function WeatherDisplayPanel() {
    const { useWeatherQuries } = useWeather()
    const { currentDistrict, isMyDistrict } = useCurrentDistrict()

    const { isBookmarked, setIsBookmarked, titleInput, titleChanged, titleSaved } = useBookmark(currentDistrict)
    const { handleSaveTitle, handleChangeTitle, toggleBookmark } = useUpdateBookmark(currentDistrict)

    const {
        data: weather,
        isLoading: weatherLoading,
        error: weatherError
    } = useWeatherQuries([currentDistrict || ''])[0]

    useEffect(() => {
        if (weatherError) {
            console.error(weatherError)
        }
    }, [weatherError])

    if (!currentDistrict) return null

    return (
        <div className='flex flex-col w-full md:w-[50vw] h-[408px] gap-2 pt-5 relative overflow-hidden rounded-lg bg-[#222222]'>
            {/* 지역 정보 */}
            <div className={`flex flex-col gap-2`}>
                {/* 선택된 지역 */}
                <CurrentLocationInfo isMyLocation={isMyDistrict} district={currentDistrict} />

                {/* 별칭 */}
                <WeatherTitleUpdateForm isBookmarked={isBookmarked} handleSaveTitle={handleSaveTitle} handleChangeTitle={handleChangeTitle} titleInput={titleInput} titleChanged={titleChanged} titleSaved={titleSaved} />
            </div>

            {weather ? (
                <div className={`flex flex-col gap-10 mt-[-20px] md:mt-[-40px] relative ${weatherLoading ? 'opacity-20' : 'opacity-100'} duration-200`}>
                    <div className='flex flex-row justify-between pl-5 pr-5 md:pl-6 md:pr-12'>

                        {/* 오늘 날씨 정보 */}
                        <CurrentWeatherInfo weather={weather} />

                        {/* 오늘 최고/최저 온도 정보 */}
                        <MinMaxTemperature weather={weather} />
                    </div>

                    {/* 오늘 시간대별 온도 정보 */}
                    <HourlyWeatherList weather={weather} />
                </div>
            ) : !weatherLoading && (
                <EmptyWeather />
            )}

            {weatherLoading && (
                <LoadingWeather />
            )}


            {/* 북마크 */}
            {weather && (
                <BookmarkToggleButton isBookmarked={isBookmarked} toggleBookmark={toggleBookmark} setIsBookmarked={setIsBookmarked} district={currentDistrict} weather={weather} />
            )}
        </div>
    )
}

