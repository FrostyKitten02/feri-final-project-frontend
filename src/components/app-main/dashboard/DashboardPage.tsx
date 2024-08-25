import {UserDetails} from "./UserDetails";
import {ActiveProjectsSection} from "./ActiveProjectsSection";
import {UpcomingProject} from "./UpcomingProject";

export const DashboardPage = () => {
    return (
        <div className="flex flex-grow">
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex flex-grow">
                        <div className="flex flex-col">
                            <UserDetails />
                            <UpcomingProject />
                        </div>
                        <ActiveProjectsSection/>
                    </div>
                </div>
        </div>
    )
}