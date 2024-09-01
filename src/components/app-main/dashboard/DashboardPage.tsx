import {UserDetails} from "./UserDetails";
import {ActiveProjectsSection} from "./ActiveProjectsSection";
import {UpcomingProject} from "./UpcomingProject";

export const DashboardPage = () => {
    return (
        <div className="flex flex-grow">
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex max-[1400px]:flex-col flex-grow">
                        <div className="flex max-[1200px]:flex-col min-[1400px]:flex-col">
                            <UserDetails />
                            <UpcomingProject />
                        </div>
                        <ActiveProjectsSection/>
                    </div>
                </div>
        </div>
    )
}