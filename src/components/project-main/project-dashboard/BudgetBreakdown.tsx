import {ProgressCircle} from "@tremor/react";
import {Label} from "flowbite-react";

export const BudgetBreakdown = () => {

    return (
        <div className="relative p-5 flex-grow">
            <div className="p-5 flex flex-col border-solid space-y-5 border-[1px] rounded-[20px] border-gray-200 h-full">
                <div className="flex space-x-5 pt-2">
                    <ProgressCircle
                        value={75}
                        radius={60}
                        strokeWidth={13}
                        color="indigo"
                    >
                        <div>
                            75%
                        </div>
                    </ProgressCircle>
                    <div className="flex flex-col justify-center">
                        <div className="text-xl font-medium">
                            70,000€/90,000€ (75%)
                        </div>
                        <div className="text-muted uppercase text-xs">
                            Used staff budget
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center">
                    <div className="w-[7%] h-[1px] bg-gray-300"/>
                    <Label className="px-2 uppercase text-muted">
                        n/a
                    </Label>
                    <div className="flex-grow h-[1px] bg-gray-300"/>
                </div>
                <div className="flex items-center text-muted justify-center h-full">
                    Section is in progress.
                </div>
            </div>
            <div
                className="absolute rounded-[20px] text-center text-muted bg-white top-2 font-medium left-20 uppercase flex px-2">
                budget breakdown
            </div>
        </div>
    )
}