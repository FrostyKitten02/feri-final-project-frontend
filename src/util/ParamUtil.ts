import {SelectedItemProps} from "../components/template/inputs/inputsInterface";
import {ProjectListSearchParams} from "../../temp_ts";
import TextUtil from "./TextUtil";

export default class ParamUtil {
    static returnSelectedItemProps = (status: SelectedItemProps): ProjectListSearchParams => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        switch (status.value.toString().toLowerCase()) {
            case "finished":
                return {
                    endDateTo: TextUtil.formatFormDate(today)
                }
            case "in progress":
                return {
                    endDateFrom: TextUtil.formatFormDate(today),
                    startDateTo: TextUtil.formatFormDate(today)
                }
            case "scheduled":
                return {
                    startDateFrom: TextUtil.formatFormDate(tomorrow)
                }
            default:
                    return {}
        }
    }
}