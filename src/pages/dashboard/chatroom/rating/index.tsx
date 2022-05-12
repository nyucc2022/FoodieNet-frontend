import * as React from 'react';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Rating } from '@mui/material';
import { isMe } from '../../../../api/api';

export interface IRatingDialog {
    open: boolean;
    usernames: string[];
    handleClose: (data: { [name: number]: number } | null) => void;
}

export default function RatingDialog({ open, usernames, handleClose }: IRatingDialog) {
    const [data, setData] = React.useState<{ [id: string]: number }>({});

    const onClose = () => handleClose(null);
    const onSubmit = () => handleClose(data);

    return (<Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Rate your dine mates</DialogTitle>
        <DialogContent sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            {usernames.filter(usernames => !isMe(usernames)).map(user => (
                <Box key={user} sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginY: 1,
                }}>
                    <Box component="span">{`${user}`}</Box>
                    <Rating
                        name={`${user}`}
                        onChange={(_: React.SyntheticEvent, newValue: number | null) => {
                            setData({
                                ...data,
                                [user]: newValue || 0,
                            });
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