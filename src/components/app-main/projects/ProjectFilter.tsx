import {ProjectFilterProps} from "../../../interfaces";
import {ProjectModal} from "./ProjectModal";
import { MdSchedule, MdOutlineDone } from "react-icons/md";
import { RiProgress3Line } from "react-icons/ri";
import {CSelect, SelectOption} from "../../template/inputs/CustomInputs";
import {useEffect, useState} from "react";
import {ProjectListStatusResponse} from "../../../../temp_ts";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";

export const ProjectFilter = ({handleProjectAdd, setSelectedStatus, selectedStatus}: ProjectFilterProps) => {
    const [projectStatusCount, setProjectStatusCount] = useState<ProjectListStatusResponse>();
    const requestArgs = useRequestArgs();
    useEffect(() => {
        fetchProjectsByStatus();
    }, []);
    const fetchProjectsByStatus = async () => {
        const response = await projectAPI.listProjectsStatus(requestArgs);
        if (response.status === 200) {
            setProjectStatusCount(response.data);
        }
    }
    return (
        <div className="flex flex-grow flex-row justify-between">
            <div className="flex flex-row space-x-10">
                <div className="flex items-center flex-row rounded-lg px-4 py-2 min-w-[180px] space-x-3">
                    <div className="flex items-center justify-center">
                        <MdOutlineDone size={30} />
                    </div>
                    <div className="flex items-start justify-center flex-col">
                        <div className="text-4xl py-1 font-medium">
                            {projectStatusCount?.finishedProjects}
                        </div>
                        <div className="text-sm uppercase tracking-wider">
                            finished
                        </div>
                    </div>
                </div>
                <div className="flex items-center flex-row rounded-lg px-4 py-2 min-w-[180px] space-x-3">
                    <div className="flex items-center justify-center">
                        <RiProgress3Line size={30}/>
                    </div>
                    <div className="flex items-start justify-center flex-col">
                        <div className="text-4xl py-1 font-medium">
                            {projectStatusCount?.inProgressProjects}
                        </div>
                        <div className="text-sm uppercase tracking-wider">
                            in progress
                        </div>
                    </div>
                </div>
                <div className="flex items-center flex-row rounded-lg px-4 py-2 min-w-[180px] space-x-3">
                    <div className="flex items-center justify-center">
                        <MdSchedule size={30} />
                    </div>
                    <div className="flex items-start justify-center flex-col">
                        <div className="text-4xl py-1 font-medium">
                            {projectStatusCount?.scheduledProjects}
                        </div>
                        <div className="text-sm uppercase tracking-wider">
                            scheduled
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                <div className="w-[200px]">
                    <CSelect placeholderText="Select by status" focusColor="primary" selected={selectedStatus} setSelected={setSelectedStatus}>
                        <SelectOption value="finished" icon={<MdOutlineDone size={18} />}>
                           finished
                        </SelectOption>
                        <SelectOption value="in progress" icon={<RiProgress3Line size={18}/>}>
                            in progress
                        </SelectOption>
                        <SelectOption value="scheduled" icon={<MdSchedule size={18} />}>
                            scheduled
                        </SelectOption>
                        <SelectOption value="">
                            all
                        </SelectOption>
                    </CSelect>
                </div>
                <div className="px-10">
                    <ProjectModal handleAddProject={handleProjectAdd}/>
                </div>
            </div>
        </div>
    )
}