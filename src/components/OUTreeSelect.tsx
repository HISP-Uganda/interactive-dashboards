import OUTree from "./OUTree";

const OUTreeSelect = ({
    value,
    onChange,
}: {
    value: string[];
    onChange: (value: string[]) => void;
}) => {
    return <OUTree onChange={onChange} value={value} />;
};

export default OUTreeSelect;
