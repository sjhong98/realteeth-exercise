import { SearchLocationForm } from "@/features/search-location"
import { Logo } from "@/shared/ui"
import { BookmarkLocationPanel } from "@/widgets/bookmark-location-panel"
import { WeatherDisplayPanel } from "@/widgets/weather-display-panel"

export default function Home() {

    return (
        <div className="flex flex-col w-screen min-h-screen gap-20 p-5">
            <div className="flex flex-col w-full items-center">
                <Logo />
            </div>
            <div className='flex flex-col w-full items-center'>
                <div className="flex flex-col md:flex-row w-full gap-10 justify-center">
                    <div
                        className='flex flex-col w-full md:w-[500px] gap-5 items-center'
                    >
                        <BookmarkLocationPanel />
                        <SearchLocationForm />
                    </div>
                    <WeatherDisplayPanel />
                </div>
            </div>
        </div>
    )
}