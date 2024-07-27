import {ProjectFilterProps} from "../../../interfaces";
import {MdSchedule, MdOutlineDone} from "react-icons/md";
import {RiProgress3Line} from "react-icons/ri";
import {CSelect, SelectOption} from "../../template/inputs/CustomInputs";
import {useEffect, useState} from "react";
import {ProjectListStatusResponse} from "../../../../temp_ts";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import {LuFilterX} from "react-icons/lu";

export const ProjectFilter = ({setSelectedStatus, selectedStatus}: ProjectFilterProps) => {
    const [projectStatusCount, setProjectStatusCount] = useState<ProjectListStatusResponse>();
    const requestArgs = useRequestArgs();
    const fetchProjectsByStatus = async () => {
        const response = await projectAPI.listProjectsStatus(requestArgs);
        if (response.status === 200) {
            setProjectStatusCount(response.data);
        }
    }

    useEffect(() => {
        fetchProjectsByStatus();
    }, []);

    return (
        <div className="flex flex-grow justify-between pb-5 border-solid border-gray-200 border-b-[1px]">
            <div className="flex flex-row space-x-10">
                <div className="p-3 border-solid border-[1px] min-w-[170px] border-gray-200 rounded-lg">
                    <div className="text-sm uppercase tracking-wider">
                        finished
                    </div>
                    <div className="flex">
                        <div className="flex items-center justify-center">
                            <MdOutlineDone size={30}/>
                        </div>
                        <div className="text-4xl pl-3 font-medium">
                            {projectStatusCount?.finishedProjects ?? 0}
                        </div>
                    </div>
                </div>
                <div className="p-3 border-solid border-[1px] min-w-[170px] border-gray-200 rounded-lg">
                    <div className="text-sm uppercase tracking-wider">
                        in progress
                    </div>
                    <div className="flex">
                        <div className="flex items-center justify-center">
                            <RiProgress3Line size={30}/>
                        </div>
                        <div className="text-4xl pl-3 font-medium">
                            {projectStatusCount?.inProgressProjects ?? 0}
                        </div>
                    </div>
                </div>
                <div className="p-3 border-solid border-[1px] min-w-[170px] border-gray-200 rounded-lg">
                    <div className="text-sm uppercase tracking-wider">
                        scheduled
                    </div>
                    <div className="flex">
                        <div className="flex items-center justify-center">
                            <MdSchedule size={30} />
                        </div>
                        <div className="text-4xl pl-3 font-medium">
                            {projectStatusCount?.scheduledProjects ?? 0}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-end">
                <div className="w-[200px]">
                    <CSelect placeholderText="Select by status" focusColor="primary" selected={selectedStatus}
                             setSelected={setSelectedStatus}>
                        <SelectOption value="finished" icon={<MdOutlineDone size={18}/>}>
                            finished
                        </SelectOption>
                        <SelectOption value="in progress" icon={<RiProgress3Line size={18}/>}>
                            in progress
                        </SelectOption>
                        <SelectOption value="scheduled" icon={<MdSchedule size={18}/>}>
                            scheduled
                        </SelectOption>
                    </CSelect>
                </div>
                <div className="flex items-center h-[42px] pl-4 uppercase">
                    <button onClick={() => setSelectedStatus({text: "", value: ""})}>
                        <LuFilterX size={25}/>
                    </button>
                </div>
            </div>
        </div>
    )
}