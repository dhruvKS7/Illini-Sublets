import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/main.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { List, ListItem, ListItemText } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import StarIcon from '@mui/icons-material/Star';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import axios from 'axios';

const apiKey = "";
const subletURL = `https://drop-table-backend.onrender.com/api/sublets`
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

function ListingContent({ formData, handleInputChange, handleSubmit, handleDelete, handleTextFieldBlur }: { formData: any, handleInputChange: any, handleSubmit: any, handleDelete: any, handleTextFieldBlur: any }) {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleTextFieldBlur} // User clicks off of the text field
                    sx={{ marginBottom: '10px', width: '100%' }}
                />
            </Grid>
            <Grid item xs={6}>
                <img alt="subletView" style={{ maxWidth: "100%" }} src={`https://maps.googleapis.com/maps/api/streetview?location=${formData.lat},${formData.long}&size=450x370&key=${apiKey}`} />
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="petFriendly"
                                        checked={formData.petFriendly}
                                        onChange={handleInputChange}
                                    />
                                }
                                label="Pet Friendly"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="parking"
                                        checked={formData.parking}
                                        onChange={handleInputChange}
                                    />
                                }
                                label="Parking"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="gym"
                                        checked={formData.gym}
                                        onChange={handleInputChange}
                                    />
                                }
                                label="Gym"
                            />
                        </FormGroup>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="utilitiesIncluded"
                                        checked={formData.utilitiesIncluded}
                                        onChange={handleInputChange}
                                    />
                                }
                                label="Utilities Included"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="secureEntry"
                                        checked={formData.secureEntry}
                                        onChange={handleInputChange}
                                    />
                                }
                                label="Secure Entry"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="elevator"
                                        checked={formData.elevator}
                                        onChange={handleInputChange}
                                    />
                                }
                                label="Elevator"
                            />
                        </FormGroup>
                    </div>
                </div>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    type='number'
                    label="Price"
                    name="monthlyPrice"
                    value={formData.monthlyPrice}
                    onChange={handleInputChange}
                    style={{ marginBottom: '10px', width: '100%' }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        endAdornment: <InputAdornment position="end">/month</InputAdornment>
                    }}
                />
                <TextField
                    label="Term"
                    name="term"
                    value={formData.term}
                    onChange={handleInputChange}
                    style={{ marginBottom: '10px', width: '100%' }}
                />
                <TextField
                    label="Leasing Company"
                    name="leasingCompany"
                    value={formData.leasingCompany}
                    onChange={handleInputChange}
                    style={{ marginBottom: '10px', width: '100%' }}
                />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            type='number'
                            label='Bedrooms'
                            name='numBedrooms'
                            value={formData.numBedrooms}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px', width: '100%' }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            type='number'
                            label='Bathrooms'
                            name='numBathrooms'
                            value={formData.numBathrooms}
                            onChange={handleInputChange}
                            style={{ marginBottom: '10px', width: '100%' }}
                        />
                    </Grid>
                </Grid>
                <TextField
                    multiline
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    fullWidth
                    inputProps={{
                        maxLength: 400,
                    }}
                />
            </Grid>
            <Grid
                item
                xs={6}
                sx={{ textAlign: 'right', padding: '5px' }}
            >
                <Button
                    color="secondary"
                    style={{
                        backgroundColor: '#DFD'
                    }}
                    onClick={handleSubmit}
                >
                    Submit Changes
                </Button>
            </Grid>
            <Grid
                item
                xs={6}
                sx={{ textAlign: 'left', padding: '5px' }}
            >
                <Button
                    color="secondary"
                    style={{
                        backgroundColor: '#FDD'
                    }}
                    onClick={handleDelete}
                >
                    Delete Listing
                </Button>
            </Grid>
        </Grid>
    );
}

export default function EditListing() {
    const handleLogout = async (event: any) => {
        event.preventDefault();
        await signOut(auth).then(() => {
            navigate("/");
        }).catch((error) => {
        });
    };
    const [userID, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [interestedUserNames, setInterestedUserNames] = useState<string[]>([]);
    const [addressChanged, setAddressChanged] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const fetchMongoID = async () => {
                    try {
                        if (user.uid.length > 0) {
                            const response = await axios.get(userURL + `?where={"firebase_id": "${user.uid}"} `);
                            setUserId(response.data.data[0]._id);
                            setUserName(response.data.data[0].username);
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
        poster_id: "",
        numBedrooms: 0,
        numBathrooms: 0,
        petFriendly: false,
        parking: false,
        gym: false,
        utilitiesIncluded: false,
        secureEntry: false,
        elevator: false,
        address: "",
        lat: 0,
        long: 0,
        description: "",
        term: "",
        monthlyPrice: 0,
        leasingCompany: "",
        lessor: "",
        interestedUsers: []
    });

    useEffect(() => {
        const fetchUserNames = async () => {
            try {
                if (formData && formData.interestedUsers && formData.interestedUsers.length > 0) {
                    const userNames = await Promise.all(
                        formData.interestedUsers.map(async (uid) => {
                            const response = await axios.get(userURL + "/" + uid);
                            return response.data.data.username + ": " + response.data.data.email;
                        })
                    );
                    setInterestedUserNames(userNames);
                }
            } catch (error) {
            }
        };

        fetchUserNames();
    }, [formData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userID.length > 0) {
                    const response = await axios.get(subletURL + `?where={"poster_id":"${userID}"}`);
                    setFormData(response.data.data[0]);
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
        if (name === "address") {
            setAddressChanged(true);
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.put(subletURL + `/${formData._id}`, formData);
        } catch (error) {
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(subletURL + `/${formData._id}`);
            window.location.reload();
        } catch (error) {
        }
    };

    const handleTextFieldBlur = async () => {
        if (addressChanged) {
            setAddressChanged(false);
            const cleanedAddress = formData.address.replace(/[^a-zA-Z0-9]/g, '')
            if (cleanedAddress.trim() !== '') {
                const apiURL = 'https://maps.googleapis.com/maps/api/geocode/json?'
                try {
                    const response = await axios.get(apiURL, {
                        params: {
                            address: encodeURIComponent(cleanedAddress),
                            key: apiKey
                        }
                    });

                    if (response.status === 200) {
                        const results = response.data.results;
                        if (results.length > 0) {
                            const location = results[0].geometry.location;
                            setFormData((prevData) => ({
                                ...prevData,
                                lat: location.lat,
                                long: location.lng
                            }));
                        } else {
                        }
                    } else {
                        throw new Error('Failed to fetch Geocoded Location')
                    }
                } catch (error) {
                    throw new Error('Request Failed')
                }
            }
        }

    };

    const handleCreateNewListing = async () => {
        if (userID.length > 0) {
            try {
                await axios.post(subletURL, {
                    "poster_id": userID,
                    "numBedrooms": 0,
                    "numBathrooms": 0,
                    "petFriendly": false,
                    "parking": false,
                    "gym": false,
                    "utilitiesIncluded": false,
                    "secureEntry": false,
                    "elevator": false,
                    "address": "Green St, Champaign, IL, 61820",
                    "lat": 0,
                    "long": 0,
                    "description": "Description goes here",
                    "term": "Fall 2024",
                    "monthlyPrice": 0,
                    "leasingCompany": "JSM",
                    "lessor": userName
                });
                window.location.reload();
            } catch (error) {
            }
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
                                onClick={() => {navigate('/search')}}
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
                            <ListItemButton component="a" onClick={() => {navigate('/profile')}} className="hovering2">
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>
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
                                <ListItemText primary="Create/Edit Listing" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component="a" onClick={() => {navigate('/contacted')}} className="hovering2">
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


                <Grid item xs={8}>
                    {(formData && formData._id !== "") ? (
                        <ListingContent
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            handleDelete={handleDelete}
                            handleTextFieldBlur={handleTextFieldBlur}
                        />
                    ) : (
                        <Button
                            variant="outlined"
                            sx={{
                                textAlign: 'center',
                            }}
                            onClick={handleCreateNewListing}
                        >
                            <AddCircleOutlineIcon sx={{ fontSize: '80px', color: '#e84a27', marginRight: '8px' }} />
                            Create Listing
                        </Button>
                    )}
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
                            Interest
                        </Typography>
                        {(formData && formData.interestedUsers && formData.interestedUsers.length) > 0 ? (
                            interestedUserNames.map((uid, index) => (
                                <ListItem key={index}>
                                    <ListItemText sx={{ textAlign: 'center' }} primary={uid} />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText sx={{ textAlign: 'center' }} primary="No interested users yet." />
                            </ListItem>
                        )}
                    </List>
                </Grid>

            </Grid>
        </ThemeProvider>
    );
}
