import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import '../css/main.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme({
    palette: {
        secondary: {
            light: '#e84a27',
            main: '#e84a27',
            dark: '#e84a27',
            contrastText: '#fff',
        },
        primary: {
            light: '#132a4c',
            main: '#132a4c',
            dark: '#132a4c',
            contrastText: '#fff',
        },
    },
    typography: {
        fontFamily: [
            'Lato',
            '-apple-system',
            'BlinkMacSystemFont',
            'Roboto',
            'Arial',
        ].join(','),
    },
});

export default function Landing() {
    const navigate = useNavigate();
    return (
        // Code adapted from: https://mui.com/material-ui/getting-started/templates/sign-in-side/
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://www.mhmproperties.com/wp-content/uploads/2017/08/DSC_3928-1-800x500.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'transparent' }}>
                            <StarIcon color='secondary' sx={{ fontSize: 50, display: 'inline-block' }} />
                        </Avatar>
                        <br></br>
                        <Typography component="h1" variant="h5" color='secondary'>
                            Welcome to Illini Sublets!
                        </Typography>
                        <br></br>
                        <Typography component="h1" variant="h5" color='primary' sx={{ textAlign: 'center' }}>Our site is dedicated to helping UIUC students find sublets. No more scouring Reddit, posting on Facebook, or asking around aimlessly. Illini Sublets is here to help you find the best possible sublet for your return to campus in one, centralized, and easy-to-use platform. Whether you're looking for a one-bedroom, a place on Green, or anything else: Illini Sublets has you covered.</Typography>
                        <br></br>
                        <Typography component="h1" variant="h5" color='primary' sx={{ textAlign: 'center' }}>Ready to get started?</Typography>
                        <Stack
                            sx={{ pt: 4 }}
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                        >
                            <Button variant="contained" disableRipple onClick={() => { navigate(`/login`); }}>Login</Button>
                            <Button variant="contained" disableRipple onClick={() => { navigate(`/register`); }}>Register</Button>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}