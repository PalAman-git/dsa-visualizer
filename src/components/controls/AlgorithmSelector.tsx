import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type AlgorithmItem = {
    id: string;
    label: string;
};

type AlgorithmGroup = {
    category: string;
    items: AlgorithmItem[];
};

type Props = {
    value: string;

    onChange: (value: string) => void;

    algorithms: AlgorithmGroup[];
};

const AlgorithmSelector = ({
    value,
    onChange,
    algorithms
}: Props) => {

    return (

        <Select
            value={value}
            onValueChange={onChange}
        >

            <SelectTrigger className="w-[400px] text-white">

                <SelectValue
                    placeholder="Choose Algorithm"
                />

            </SelectTrigger>

            <SelectContent>

                {
                    algorithms.map((group) => (

                        <SelectGroup
                            key={group.category}
                        >

                            <SelectLabel>
                                {group.category}
                            </SelectLabel>

                            {
                                group.items.map((item) => (

                                    <SelectItem
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.label}
                                    </SelectItem>

                                ))
                            }

                        </SelectGroup>

                    ))
                }

            </SelectContent>

        </Select>

    );
};

export default AlgorithmSelector;