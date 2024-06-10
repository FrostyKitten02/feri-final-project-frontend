import {useEffect} from 'react';
import {useNavigate, useParams, Outlet} from 'react-router-dom';
import {projectAPI} from "../util/ApiDeclarations";
import TextUtil from "../util/TextUtil";
import {useRequestArgs} from "../util/CustomHooks";

const ValidateProjectId = () => {
    const {projectId} = useParams();
    const navigate = useNavigate();
    const requestArgs = useRequestArgs();

    useEffect(() => {
        const getProject = async () => {
            try {
                if (projectId && TextUtil.isValidUUID(projectId)) {
                    const res = await projectAPI.getProject(projectId, requestArgs)
                    if (res.status !== 200)
                        navigate("/")

                } else navigate("/")
            } catch (err) {
                navigate('/');
            }
        }
        getProject();
    }, [projectId, navigate, requestArgs]);
    return <Outlet/>;
};

export default ValidateProjectId;
