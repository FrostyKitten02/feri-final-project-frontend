import {useEffect, useState} from "react";
import {PersonOnProjectDto} from "../../../../temp_ts";
import TeamModal from "./TeamModal";
import {useParams} from "react-router-dom";
import {toastError} from "../../toast-modals/ToastFunctions";
import {projectAPI} from "../../../util/ApiDeclarations";
import {useRequestArgs} from "../../../util/CustomHooks";
import {Spinner} from "flowbite-react";
import {DeleteTeamModal} from "./DeleteTeamModal";
import TextUtil from "../../../util/TextUtil";

export default function ProjectTeamPage() {
    const [peopleOnProject, setPeopleOnProject] = useState<PersonOnProjectDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const {projectId} = useParams();
    const requestArgs = useRequestArgs();

    useEffect(() => {
        fetchPeopleOnProject();
    }, [projectId]);

    const fetchPeopleOnProject = async (): Promise<void> => {
        try {
            if (projectId) {
                const response = await projectAPI.getPeopleOnProjectByProjectId(
                    projectId,
                    await requestArgs.getRequestArgs()
                );
                if (response.status === 200) {
                    if (response.data.people) setPeopleOnProject(response.data.people);
                }
            } else {
                toastError("Project id not found.");
            }
        } catch (error: any) {
            toastError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full p-10">
            <div
                className={`relative flex flex-col flex-grow border-[1px] border-gray-200 border-solid rounded-[20px] px-5`}>
                <div className="w-full h-full px-12 rounded-bl-[20px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spinner size="xl"/>
                        </div>
                    ) : peopleOnProject.length > 0 ? (
                        <div className="flex flex-col h-full">
                            <div className="grid grid-cols-6 pt-8 pb-4 px-3">
                                <div className="flex justify-center items-center gap-x-4">
                                    <div className="text-sm text-gray-600 font-semibold">
                                        NAME
                                    </div>
                                </div>
                                <div className="flex justify-center items-center gap-x-4">
                                    <div className="text-sm text-gray-600 font-semibold">
                                        EMAIL ADDRESS
                                    </div>
                                </div>
                                <div className="flex justify-center items-center gap-x-4">
                                    <div className="text-sm text-gray-600 font-semibold">
                                        FROM
                                    </div>
                                </div>
                                <div className="flex justify-center items-center gap-x-4">
                                    <div className="text-sm text-gray-600 font-semibold">
                                        TO
                                    </div>
                                </div>
                                <div className="flex justify-center items-center gap-x-4">
                                    <div className="text-sm text-gray-600 font-semibold">
                                        ESTIMATED PM
                                    </div>
                                </div>
                                <div className="flex justify-center items-center gap-x-4">
                                    <div className="text-sm text-gray-600 font-semibold">
                                        SETTINGS
                                    </div>
                                </div>
                            </div>
                            <div className="flex-grow overflow-y-auto px-3">
                                <div className="rounded-2xl border border-solid border-gray-200 bg-white divide-y divide-solid divide-gray-200">
                                    {peopleOnProject?.map((person) => (
                                        <div className="grid grid-cols-6 py-6" key={person.id}>
                                            <div className="flex items-center justify-center text-sm font-semibold">
                                                <div>
                                                    {person.name && person.lastname ? (
                                                        <p>
                                                            {person.name} {person.lastname}
                                                        </p>
                                                    ) : (
                                                        <p>N/A</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className="flex items-center justify-center text-sm font-normal text-gray-500">
                                                {person.email}
                                            </div>
                                            <div
                                                className="flex items-center justify-center text-sm font-semibold">
                                                {TextUtil.refactorDate(person.fromDate)}
                                            </div>
                                            <div
                                                className="flex items-center justify-center text-sm font-semibold">
                                                {TextUtil.refactorDate(person.toDate)}
                                            </div>
                                            <div
                                                className="flex items-center justify-center text-sm font-normal text-gray-500">
                                                {person.estimatedPm}
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <DeleteTeamModal
                                                    person={person}
                                                    onSuccess={fetchPeopleOnProject}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>

                        </div>
                    ) : (
                        <div className="flex flex-col h-full items-center justify-center">
                            <p className="text-2xl font-bold">
                                There is no one currently assigned to this project.
                            </p>
                            <p>
                                Navigate to the top right to assign someone to this project.
                            </p>
                        </div>
                    )}
                </div>
                <div
                    className="absolute rounded-[20px] text-center text-muted bg-white top-[-12px] font-medium left-20 uppercase flex px-2">
                    EMPLOYEE LIST
                </div>
                <div className="absolute right-[-25px] top-[-30px]">
                    <div className="bg-white py-2">
                        <TeamModal handleAddPerson={fetchPeopleOnProject}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
