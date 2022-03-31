import * as React from 'react';

import { Button, Popover, Slider, SxProps, Theme, Typography } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';

export interface IPillRanger {
    placeholder: string;
    ranging: [number, number];
    onChange?: (value: [number, number]) => void;
    sx?: SxProps<Theme> | undefined;
}

export default function PillRanger({ placeholder, ranging, onChange, sx={} }: IPillRanger) {
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
                paddingTop: 0.4,
                paddingBottom: 0.2,
                fontSize: 12,
                borderRadius: 6,
                ...sx,
            }} variant="outlined" ref={anchorRef} size="small" onClick={() => setOpen(!open)}>
                {range.join('-') === ranging.join('-') ? <em>{placeholder}</em> : range.join(' - ')}
                <ArrowDropDown sx={{ marginTop: -0.25 }} />
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
                        marks={true}
                        min={ranging[0]}
                        max={ranging[1]}
                        valueLabelDisplay="off"
                    />
                </Typography>
            </Popover>
        </>
    );
}
