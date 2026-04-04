import React, { useCallback } from 'react';
import ReactSelect, { type ActionMeta, type MultiValue, type SingleValue } from 'react-select';

export interface SelectOption {
    value: string;
    label: string;
}

type SingleProps = {
    isMulti?: false;
    value: string;
    onChange: (value: string) => void;
};

type MultiProps = {
    isMulti: true;
    value: string[];
    onChange: (values: string[]) => void;
};

export type FilterSelectProps = (SingleProps | MultiProps) & {
    options: SelectOption[];
    placeholder?: string;
    className?: string;
};

const FilterSelect: React.FC<FilterSelectProps> = props => {
    const { options, placeholder, className } = props;
    const isMulti = props.isMulti ?? false;
    const onChangeProp = props.onChange as (v: string | string[]) => void;

    const handleChange = useCallback(
        (newValue: MultiValue<SelectOption> | SingleValue<SelectOption>) => {
            if (isMulti) {
                onChangeProp((newValue as MultiValue<SelectOption>).map(o => o.value));
            } else {
                onChangeProp((newValue as SingleValue<SelectOption>)?.value ?? '');
            }
        },
        [isMulti, onChangeProp],
    );

    if (isMulti) {
        const selectedOptions = options.filter(o => (props.value as string[]).includes(o.value));

        return (
            <ReactSelect<SelectOption, true>
                isMulti
                options={options}
                value={selectedOptions}
                onChange={handleChange as (newValue: MultiValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => void}
                placeholder={placeholder}
                className={className}
                classNamePrefix="filter-select"
                isClearable
            />
        );
    }

    const selectedOption = options.find(o => o.value === (props.value as string)) ?? null;

    return (
        <ReactSelect<SelectOption, false>
            options={options}
            value={selectedOption}
            onChange={handleChange as (newValue: SingleValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => void}
            placeholder={placeholder}
            className={className}
            classNamePrefix="filter-select"
            isClearable
        />
    );
};

export default FilterSelect;
