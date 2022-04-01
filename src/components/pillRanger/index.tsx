import * as React from 'react';

import { Button, Popover, Slider, SxProps, Theme, Typography } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

export interface IPillRanger {
    placeholder: string;
    ranging: [number, number];
    tag: string;
    marks?: {values: number[], formatter?: (n: number) => string};
    onChange?: (value: [number, number]) => void;
    sx?: SxProps<Theme> | undefined;
}

export default function PillRanger({ tag, placeholder, ranging, marks, onChange, sx={} }: IPillRanger) {
    const [range, changeRange] = React.useState<[number, number]>(ranging);
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);

    const handleValueChange = (event: Event, value: number | number[], activeThumb: number) => {
        const v = value as [number, number];
        if (v[0] !== range[0] || v[1] !== range[1]) {
            changeRange(v);
            onChange && onChange(v);
        }
    };

    return (
        <>
            <Button sx={{
                marginTop: 1,
                marginRight: 0.8,
                paddingBottom: 0.2,
                fontSize: 12,
                borderRadius: 6,
                textTransform: 'inherit',
                ...sx,
            }} variant="outlined" ref={anchorRef} size="small" onClick={() => setOpen(!open)}>
                {range.join('-') === ranging.join('-') ? <em>{placeholder}</em> : `${tag}: ${range.join(' - ')}`}
                <ArrowDropDown />
            </Button>

            <Popover
                open={open}
                anchorEl={anchorRef.current}
                onClose={() => setOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ paddingX: 5, paddingTop: 1, width: 250, }}>
                    <Slider
                        value={range}
                        onChange={handleValueChange}
                        getAriaValueText={num => `${num} People`}
                        step={1}
                        marks={marks ? marks.values.map(v => ({
                            value: v,
                            label: (marks.formatter || (v => `${v}`))(v),
                        })) : true}
                        min={ranging[0]}
                        max={ranging[1]}
                        valueLabelDisplay="off"
                    />
                </Typography>
            </Popover>
        </>
    );
}
