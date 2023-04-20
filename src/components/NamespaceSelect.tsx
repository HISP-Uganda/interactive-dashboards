import { GroupBase, Select } from "chakra-react-select";
import { useStore } from "effector-react";
import { changeDataSource } from "../Events";
import { Option } from "../interfaces";
import { $dataSourceOptions, $indicator } from "../Store";
const NamespaceSelect = () => {
    const indicator = useStore($indicator);
    const dataSourceOptions = useStore($dataSourceOptions);
    return (
        <Select<Option, false, GroupBase<Option>>
            value={dataSourceOptions.find(
                (d: Option) => d.value === indicator.dataSource
            )}
            onChange={(e) => changeDataSource(e?.value)}
            options={dataSourceOptions}
        />
    );
};

export default NamespaceSelect;
