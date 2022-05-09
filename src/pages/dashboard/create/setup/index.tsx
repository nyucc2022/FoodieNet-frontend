import * as React from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, InputLabel, Slider, TextField } from '@mui/material';
import { ICreateGroup, IRestaurant } from '../../../../api/interface';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

export interface ISetupDialog {
    open: boolean;
    restaurant: IRestaurant;
    handleClose: (data: ICreateGroup | null) => void;
}

export default function SetupDialog({ open, restaurant, handleClose }: ISetupDialog) {
    const [name, setName] = React.useState<string>('');
    const [size, setSize] = React.useState<number>(2);
    const [date, setDate] = React.useState<Date>(new Date());

    const onClose = () => handleClose(null);
    const onSubmit = () => handleClose({
        groupName: name,
        totalSize: size,
        startTime: parseInt(date.getTime() / 1000 as any, 10),
        restaurantId: restaurant.rid,
    });

    return (<Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>{restaurant?.name}</DialogTitle>
        <DialogContent sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <InputLabel>Group Name</InputLabel>
            <Input sx={{marginBottom: 2}} value={name} onChange={ele => setName(ele.target.value)} size="small" placeholder="My Group" />

            <InputLabel>Group Size</InputLabel>
            <Slider
                value={size}
                onChange={(_, value) => setSize(value as number)}
                getAriaValueText={num => `${num} People`}
                step={1}
                marks
                min={2}
                max={10}
                valueLabelDisplay="auto"
            />

            <InputLabel>Dining Time</InputLabel>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDateTimePicker
                    renderInput={(props) => <TextField variant="standard" {...props} />}
                    value={date}
                    onChange={(newValue) => {
                        setDate(newValue || new Date());
                    }}
                />
            </LocalizationProvider>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" color="warning" onClick={onClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={onSubmit}>Create</Button>
        </DialogActions>
    </Dialog>);
}