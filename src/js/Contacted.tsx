import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/main.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { List, ListItem, ListItemText } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import StarIcon from '@mui/icons-material/Star';
import Divider from '@mui/material/Divider';
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
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

export default function Contacted() {
    const [sublets, setSublets] = useState([]);
    const [selectedApartment, setSelectedApartment] = useState([{
        _id: '',
        numBedrooms: 2,
        numBathrooms: 1,
        petFriendly: false,
        parking: false,
        gym: false,
        utilitiesIncluded: true,
        secureEntry: true,
        elevator: false,
        address: "57 E John St, Champaign, IL 61820",
        lat: 40.1087274,
        long: -88.239369,
        description: "A modest, furnished sublet available near campus, featuring a furnished bedroom and shared common areas. Suitable for a studious individual seeking a temporary residence with minimal frills. A modest, furnished sublet available near campus, featuring a furnished bedroom and shared common areas. Suitable for a studious individual seeking a temporary residence with minimal frills. A modest, furnished sublet available near campus, featuring a furnished bedroom and shared common areas. Suitable for a studious individual.",
        term: "Spring 2024",
        monthlyPrice: 650.50,
        leasingCompany: "JSM",
        lessor: "John Doe"
    }]);
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

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const fetchMongoID = async () => {
                    try {
                        if (user.uid.length > 0) {
                            const response = await axios.get(userURL + `?where={"firebase_id": "${user.uid}"} `);
                            setUserId(response.data.data[0]._id);
                            completeSearch(response.data.data[0]._id);
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

    const completeSearch = async (id: any) => {
        var url = `https://drop-table-backend.onrender.com/api/interestedSublets/${id}`;
        var response = await axios.get(url);
        setSublets(response.data.data);
    };

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = async (id: any) => {
        let temp = await axios.get(subletURL + `?where={"_id":"${id}"}`);
        setSelectedApartment(temp.data.data);
        setOpenModal(true);
    };
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const removeInterest = async (sublet:any, user:any) => {
        await axios.put(`https://drop-table-backend.onrender.com/api/interested/${user}/${sublet}`);
        window.location.reload();
      };
    const ChecklistItem = ({ label, value }: { label: any, value: any }) => (
        <div style={{ display: 'flex' }}>
            <span>{value ? <CheckBoxIcon color='secondary' sx={{ mt: 1.15 }} /> : <CheckBoxOutlineBlankIcon color='secondary' sx={{ mt: 1.15 }} />}</span>
            <span><Typography sx={{ mt: 1, ml: 1, textAlign: 'left' }}>{label}</Typography></span>
        </div>
    );

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
                <Dialog
                    open={openModal}
                    onClose={handleCloseModal}
                    maxWidth="md"
                    PaperProps={{
                        sx: {
                            backgroundColor: defaultTheme.palette.primary.main,
                            color: defaultTheme.palette.primary.contrastText,
                        },
                    }}
                >
                    <DialogTitle>
                        {selectedApartment[0].address}
                        <span style={{ float: 'right', cursor: 'pointer' }} onClick={handleCloseModal}> &times;</span>
                    </DialogTitle>
                    <DialogContent style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ flex: 1 }}>
                            <img alt="subletView" src={`https://maps.googleapis.com/maps/api/streetview?location=${selectedApartment[0].lat},${selectedApartment[0].long}&size=450x250&key=${apiKey}`}></img>
                            <Typography variant="h3" sx={{ fontSize: '20px', mt: 1.5, mb: 1 }}>Details</Typography>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ChecklistItem label="Pet Friendly" value={selectedApartment[0].petFriendly} />
                                    <ChecklistItem label="Parking" value={selectedApartment[0].parking} />
                                    <ChecklistItem label="Gym" value={selectedApartment[0].gym} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '10px' }}>
                                    <ChecklistItem label="Utilities Included" value={selectedApartment[0].utilitiesIncluded} />
                                    <ChecklistItem label="Secure Entry" value={selectedApartment[0].secureEntry} />
                                    <ChecklistItem label="Elevator" value={selectedApartment[0].elevator} />
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: 1, marginLeft: 10 }}>
                            <div style={{ border: '1px solid #FFF', padding: 10, marginBottom: 10 }}>
                                <Typography>
                                    Price: ${selectedApartment[0].monthlyPrice}/month
                                </Typography>
                                <Typography>
                                    Term: {selectedApartment[0].term}
                                </Typography>
                                <Typography>
                                    Leasing Company: {selectedApartment[0].leasingCompany}
                                </Typography>
                                <Typography>
                                    Lessor: {selectedApartment[0].lessor}
                                </Typography>
                                <Typography>
                                    Layout: {selectedApartment[0].numBedrooms} Bed, {selectedApartment[0].numBathrooms} Bath
                                </Typography>
                            </div>
                            <div style={{ border: '1px solid #FFF', padding: 10 }}>
                                <Typography>
                                    {selectedApartment[0].description}
                                </Typography>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions
                        style={{
                            justifyContent: 'center',
                            paddingBottom: '16px',
                        }}>
                        <Button color="secondary" style={{ backgroundColor: '#FFF' }} onClick={() => removeInterest(selectedApartment[0]._id, userID)}>Rescind your interest</Button>
                    </DialogActions>
                </Dialog>
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
                            <ListItemButton component="a" onClick={() => {navigate('/editListing')}} className="hovering2">
                                <ListItemText primary="Create/Edit Listing" />
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
                    <br></br>
                    <Typography variant="h3" color='secondary' sx={{ fontSize: '30px', textAlign: 'center', mt: 1 }}>
                        Sublets whose lessors you've contacted:
                    </Typography>
                    <br></br>
                    <br></br>
                    <Container sx={{ py: 2 }} maxWidth="xl">
                        <Grid container spacing={4}>
                            {sublets.map((sublet) => (
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card
                                        key={sublet['_id']} onClick={() => handleOpenModal(sublet['_id'])} sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#132a4c', color: 'white', cursor: 'pointer' }} className="subletCard"
                                    >
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {sublet['address']}
                                            </Typography>
                                            <Typography variant="body2" color="secondary">
                                                ${sublet['monthlyPrice']}/month – {sublet['numBedrooms']} Bed, {sublet['numBathrooms']} Bath
                                            </Typography>
                                            <Typography variant="body2" color="secondary">
                                                {sublet['term']}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}