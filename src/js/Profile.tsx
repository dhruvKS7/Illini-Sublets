import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/main.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { List, ListItem, ListItemText } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import StarIcon from '@mui/icons-material/Star';
import Divider from '@mui/material/Divider';
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import axios from 'axios';

const userURL = `https://drop-table-backend.onrender.com/api/users`

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

function ProfileContent({ formData, handleInputChange, handleSubmit, errorMsg, successMsg }: { formData: any, handleInputChange: any, handleSubmit: any, errorMsg: any, successMsg: any }) {
    return (
        <div>
            <Typography
                variant="h6"
            >
                {formData.email}
            </Typography>
            <br />
            <Typography variant="body1" color='red'>
                {errorMsg}
            </Typography>
            <Typography variant="body1" color='green'>
                {successMsg}
            </Typography>
            <br />
            <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                inputProps={{
                    maxLength: 32,
                }}
                sx={{
                    margin: "15px"
                }}
            />
            <br />
            <Button
                color="secondary"
                style={{
                    backgroundColor: '#DFD',
                    margin: "20px"
                }}
                onClick={handleSubmit}
            >
                Submit Changes
            </Button>
        </div>
    );
}

export default function EditProfile() {
    const handleLogout = async (event: any) => {
        event.preventDefault();
        await signOut(auth).then(() => {
            navigate("/");
        }).catch((error) => {
        });
    };
    const [userID, setUserId] = useState("");
    const navigate = useNavigate();
    const auth = getAuth();
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const fetchMongoID = async () => {
                    try {
                        if (user.uid.length > 0) {
                            const response = await axios.get(userURL + `?where={"firebase_id": "${user.uid}"} `);
                            setUserId(response.data.data[0]._id);
                        }
                    } catch (error) {
                    }
                };

                fetchMongoID();
            } else {
                navigate('/');
            }
        });
    }, [auth, navigate]);

    const [formData, setFormData] = useState({
        _id: "",
        email: "",
        username: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userID.length > 0) {
                    const response = await axios.get(userURL + `/${userID}`);
                    setFormData(response.data.data);
                }
            } catch (error) {
            }
        };

        fetchData();

    }, [userID]);

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async () => {
        var response = await axios.get(userURL + `?where={"username":"${formData.username}"}`);
        if (response.data.data.length !== 0) {
            setErrorMsg("Username already exists. Try again.");
            setSuccessMsg("");
        }
        else 
        try {
            await axios.put(userURL + `/${formData._id}`, formData);
            setSuccessMsg("Username Updated Successfully");
            setErrorMsg("");
        } catch (error) {
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" spacing={2} sx={{ textAlign: 'center' }}>
                <Grid item xs={12}>
                    <AppBar sx={{ padding: '10px 0px 10px 0px', borderRadius: '5px' }} position="static">
                        <Toolbar>
                            <StarIcon
                                sx={{ fontSize: '60px', color: '#e84a27' }}
                            />
                            <Typography variant="h3" sx={{ color: { xs: '#132a4c', sm: 'white' }, fontSize: { xs: '15px', sm: '40px' }, marginLeft: { xs: '40px', sm: '10px' }, cursor: 'default' }} marginRight="auto">
                                IlliniSublets
                            </Typography>
                            <Button
                                color="inherit"
                                component="a"
                                onClick={() => { navigate('/search') }}
                                disableRipple
                            >
                                <Typography variant="h5" sx={{ fontSize: '24px' }} id="hovering">
                                    Search
                                </Typography>
                            </Button>
                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{ backgroundColor: 'white', margin: '10px 16px' }}
                            />
                            <Button
                                color="inherit"
                                component="a"
                                href="#"
                                disableRipple
                            >
                                <Typography variant="h5" color="secondary" sx={{ fontSize: '24px' }}>
                                    My Info
                                </Typography>
                            </Button>
                        </Toolbar>
                    </AppBar>
                </Grid>
                <Grid item xs={2}>
                    <List
                        sx={{
                            backgroundColor: defaultTheme.palette.primary.main,
                            color: defaultTheme.palette.primary.contrastText,
                            textAlign: 'center',
                            minHeight: 'calc(100vh - 132px)',
                            borderRadius: '5px'
                        }}
                    >
                        <Typography variant="h6">
                            My Info
                        </Typography>
                        <ListItem disablePadding>
                            <ListItemButton
                                component="a"
                                sx={[
                                    {
                                        '&:hover': {
                                            backgroundColor: '#e84a27',
                                        }, backgroundColor: '#e84a27'
                                    },
                                ]}
                            >
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component="a" onClick={() => { navigate('/editListing') }} className="hovering2">
                                <ListItemText primary="Create/Edit Listing" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component="a" onClick={() => { navigate('/contacted') }} className="hovering2">
                                <ListItemText primary="Lessors I've Contacted" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component="a" className="hovering2" onClick={handleLogout}>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Grid>


                <Grid item xs={10}>
                    <ProfileContent
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        errorMsg={errorMsg}
                        successMsg={successMsg}
                    />
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}