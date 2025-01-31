import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../css/main.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

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

export default function Register() {
  const APIURL = `https://drop-table-backend.onrender.com/api/users`
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var username = String(data.get('username'));
    var email = String(data.get('email'));
    var password = String(data.get('password'));
    var firebase = '';
    var passed = false;
    var response = await axios.get(APIURL + `?where={"username":"${username}"}`);
    if (response.data.data.length !== 0) setErrorMsg("Username already exists. Try again.");
    else {
      response = await axios.get(APIURL + `?where={"email":"${email}"}`);
      if (response.data.data.length !== 0) setErrorMsg("Email already in use. Try again.");
      else {
        await createUserWithEmailAndPassword(auth, email, password)
          .then((user) => {
            firebase = user.user.uid;
            passed = true;
          })
          .catch((error) => {
            const errorMessage = error.message;
            if (errorMessage === 'Firebase: Error (auth/invalid-email).') setErrorMsg("Invalid email. Try again.");
            else if (errorMessage === 'Firebase: Password should be at least 6 characters (auth/weak-password).') setErrorMsg("Password should be at least 6 characters. Try again.");
            else if (errorMessage === 'Firebase: Error (auth/email-already-in-use).') setErrorMsg("Email already in use. Try again.");
            else setErrorMsg("Error registering. Try again.");
          });
          if (passed) {
            var body = {
              email: email,
              username: username,
              firebase_id: firebase
            };
            await axios.post(APIURL, body);
            navigate("/login");
          }
      }
    }
  };

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
            <Avatar sx={{ m: 1, bgcolor: 'white' }}>
              <StarIcon color="secondary" sx={{ fontSize: 50, display: 'inline-block' }} />
            </Avatar>
            <Typography component="h1" variant="h5" color='primary'>
              Register
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
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
                autoComplete="password"
              />
              <Button
                type="submit"
                fullWidth
                disableRipple
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register
              </Button>
              <Grid container>
                <Link variant="body2" sx={{ cursor: "pointer" }} onClick={() => { navigate(`/login`); }}>
                  {"Have an account? Login here."}
                </Link>
              </Grid>
              <br id="break"></br>
              <Typography variant="body1" color='red'>
                {errorMsg}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}