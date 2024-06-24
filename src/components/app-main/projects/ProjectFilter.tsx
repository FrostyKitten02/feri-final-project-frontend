import {ProjectFilterProps} from "../../../interfaces";
import {ProjectModal} from "./ProjectModal";
import { MdSchedule, MdOutlineDone } from "react-icons/md";
import { RiProgress3Line } from "react-icons/ri";
import {CSelect, SelectOption} from "../../template/inputs/CustomInputs";

export const ProjectFilter = ({handleProjectAdd, setSelectedStatus, selectedStatus}: ProjectFilterProps) => {
    return (
        <div className="flex flex-grow flex-row justify-between">
            <div className="flex flex-row space-x-10">
                <div className="flex items-center flex-row rounded-lg px-4 py-2 min-w-[180px] space-x-3">
                    <div className="flex items-center justify-center">
                        <MdOutlineDone size={30} />
                    </div>
                    <div className="flex items-start justify-center flex-col">
                        <div className="text-4xl py-1 font-medium">
                            56
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
                            78
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
                            7
                        </div>
                        <div className="text-sm uppercase tracking-wider">
                            scheduled
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                <div className="w-[200px] px-2">
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
                    </CSelect>
                </div>
            </div>
            <ProjectModal handleAddProject={handleProjectAdd}/>
        </div>
    )
}