import * as React from 'react';

import { FormControl, MenuItem, Select, SelectChangeEvent, SxProps, Theme } from '@mui/material';

export interface IPillSelector {
    items: ({
        children: JSX.Element | JSX.Element[];
        value: string;
    } | string)[];
    placeholder: string;
    multiple?: boolean;
    onChange?: (value: string | string[]) => void;
    sx?: SxProps<Theme> | undefined;
}

export default function PillSelector({ items, placeholder, onChange, multiple=false, sx={} }: IPillSelector) {
    const [value, changeValue] = React.useState<string[] | string>(multiple ? [] : '');
    const handleValueChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
        changeValue(event.target.value);
        onChange && onChange(event.target.value);
    };

    return (
        <FormControl variant="outlined" size="small" sx={{ marginTop: 2, marginRight: 0.8, ...sx }}>
            <Select sx={{
                paddingTop: 0.1,
                maxHeight: 30,
                fontSize: 12,
                borderRadius: 6,
            }} MenuProps={{
                MenuListProps: {
                    dense: true,
                },
                PaperProps: {
                    style: {
                        minWidth: 120,
                    },
                },
            }} renderValue={selected => {
                if (!selected || !selected.length) {
                    return <em>{placeholder}</em>;
                }

                return multiple ? (selected as any).join(', ') : selected;
            }} multiple={multiple} displayEmpty value={value as string} onChange={handleValueChange} placeholder={placeholder}>
                {items
                    .map(v => typeof(v) === 'string' ? {value: v, children: v} : v)
                    .map(v => <MenuItem key={v.value} value={v.value}>{v.children}</MenuItem>)}
            </Select>
        </FormControl>
    );
}
