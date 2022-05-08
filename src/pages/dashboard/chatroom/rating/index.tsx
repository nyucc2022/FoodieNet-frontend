import * as React from 'react';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Rating } from '@mui/material';
import { IUser } from '../../../../api/interface';
import { isMe } from '../../../../api/api';

export interface IRatingDialog {
    open: boolean;
    users: IUser[];
    handleClose: (data: { [name: number]: number } | null) => void;
}

export default function RatingDialog({ open, users, handleClose }: IRatingDialog) {
    const data: { [id: string]: number } = {};

    const onClose = () => handleClose(null);
    const onSubmit = () => handleClose(data);

    return (<Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Rate your dine mates</DialogTitle>
        <DialogContent sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            {users.filter(user => !isMe(user)).map(user => (
                <Box key={user.username} sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginY: 1,
                }}>
                    <Box component="span">{`${user.username}`}</Box>
                    <Rating
                        name={`${user.username}`}
                        onChange={(_: React.SyntheticEvent, newValue: number | null) => {
                            data[user.username] = newValue || 0;
                        }}
                    />
                </Box>
            ))}
        </DialogContent>
        <DialogActions>
            <Button variant="outlined" color="warning" onClick={onClose}>Dismiss</Button>
            <Button variant="contained" color="primary" onClick={onSubmit}>Rate</Button>
        </DialogActions>
    </Dialog>);
}