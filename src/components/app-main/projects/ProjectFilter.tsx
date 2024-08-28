import {ProjectFilterProps} from "../../../interfaces";
import {CSelect, SelectOption} from "../../template/inputs/CustomInputs";
import {useEffect, useState} from "react";
import {ProjectListStatusResponse} from "../../../../client";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import {IoCloseOutline} from "react-icons/io5";

export const ProjectFilter = ({setSelectedStatus, selectedStatus}: ProjectFilterProps) => {
    const [projectStatusCount, setProjectStatusCount] = useState<ProjectListStatusResponse>();
    const requestArgs = useRequestArgs();

    useEffect(() => {
        fetchProjectsByStatus();
    }, []);
    const fetchProjectsByStatus = async () => {
        const response = await projectAPI.listProjectsStatus(await requestArgs.getRequestArgs());
        if (response.status === 200) {
            setProjectStatusCount(response.data);
        }
    }

    return (
        <div className="flex flex-grow justify-between items-center">
            <div className="flex flex-row space-x-10">
                <div className="flex items-center">
                    <div className="rounded-full bg-c-teal w-2 h-2 mr-2"/>
                    <div className="text-sm uppercase tracking-wider">
                        finished:
                    </div>
                    <div className="text-3xl pl-3 font-medium flex items-center">
                        {projectStatusCount?.finishedProjects ?? 0}
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="rounded-full bg-warning w-2 h-2 mr-2"/>
                    <div className="text-sm uppercase tracking-wider">
                        in progress:
                    </div>
                    <div className="text-3xl pl-3 font-medium flex items-center">
                        {projectStatusCount?.inProgressProjects ?? 0}
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="rounded-full bg-danger w-2 h-2 mr-2"/>
                    <div className="text-sm uppercase tracking-wider">
                        scheduled:
                    </div>
                    <div className="text-3xl pl-3 font-medium flex items-center">
                        {projectStatusCount?.scheduledProjects ?? 0}
                    </div>
                </div>
            </div>
            <div className="flex h-full justify-center items-center">
                <div className="w-[300px]">
                    <CSelect placeholderText="Select by status" focusColor="primary" selected={selectedStatus}
                             setSelected={setSelectedStatus}>
                        <SelectOption
                            value="finished"
                            icon={<div className="rounded-full bg-c-teal w-2 h-2"/>}
                        >
                            FINISHED
                        </SelectOption>
                        <SelectOption
                            value="in progress"
                            icon={<div className="rounded-full bg-warning w-2 h-2"/>}
                        >
                            IN PROGRESS
                        </SelectOption>
                        <SelectOption
                            value="scheduled"
                            icon={<div className="rounded-full bg-danger w-2 h-2"/>}
                        >
                            SCHEDULED
                        </SelectOption>
                    </CSelect>
                </div>
                <button
                    className="h-full flex items-center ml-2 justify-center"
                    onClick={() => setSelectedStatus({text: "", value: ""})}>
                    <IoCloseOutline size={22} className=""/>
                </button>
            </div>
        </div>
    )
}