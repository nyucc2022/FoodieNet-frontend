import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import BaseContainer from '../../components/baseContainer';
import { signIn } from '../../api/amplify';
import AppContext from '../../api/state';

export default function SignIn() {
    const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '';
    const ctx = React.useContext(AppContext);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email')?.toString() || '';
        const password = data.get('password')?.toString() || '';

        ctx.setBackDropStatus?.(true);
        try {
            const user = await signIn(email, password);
            ctx.openSnackBar?.(`Success, welcome back ${user.getUsername()}!`, "success");
            ctx.navigate?.(redirectTo || `/dashboard/explore`);
        } catch(err) {
            ctx.openSnackBar?.(`Error: ${err}`, "error");
        }
        ctx.setBackDropStatus?.(false);
    };

    return (
        <BaseContainer>
            <Container component="main" maxWidth="xs" sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
            }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: -8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="username"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href={`/signup${redirectTo ? `?redirect=${redirectTo}` : ''}`} variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </BaseContainer>
    );
}
