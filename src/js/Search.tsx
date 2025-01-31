import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import '../css/main.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import StarIcon from '@mui/icons-material/Star';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { getAuth, onAuthStateChanged } from "firebase/auth";
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

export default function Search() {
  const searchRef = useRef();
  const sortRef = useRef();
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [userID, setUserId] = useState("");
  const [sort, setSort] = useState("costAsc");
  const [filters, setFilters] = useState({
    petFriendly: undefined,
    parking: undefined,
    gym: undefined,
    utilitiesIncluded: undefined,
    secureEntry: undefined,
    elevator: undefined
  });
  const [openFilter, setOpenFilter] = useState(false);
  const handleOpenFilter = () => {
    setOpenFilter(true);
  };
  const sorting = [
    {
      value: 'costAsc',
      label: 'Monthly Price (low to high)',
    },
    {
      value: 'costDesc',
      label: 'Monthly Price (high to low)',
    }
  ];
  const [sublets, setSublets] = useState([]);
  const [interestText, setInterestText] = useState('');
  const [selectedApartment, setSelectedApartment] = useState([{
    _id: '',
    interestedUsers: [],
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
  useEffect(() => {
    completeSearch(search, sort, filters);
  }, [search, sort, filters]);
  const completeSearch = async (search: any, sort: any, filters: any) => {
    let finalUrl = subletURL + `?where={`;
    let initlen = finalUrl.length;
    if (search !== '') finalUrl += `"address":{$regex:"${search}"}`;
    if (filters.petFriendly === true) {
      if (finalUrl.length === initlen) finalUrl += `"petFriendly":true`;
      else finalUrl += `, "petFriendly":true`;
    }
    if (filters.parking === true) {
      if (finalUrl.length === initlen) finalUrl += `"parking":true`;
      else finalUrl += `, "parking":true`;
    }
    if (filters.gym === true) {
      if (finalUrl.length === initlen) finalUrl += `"gym":true`;
      else finalUrl += `, "gym":true`;
    }
    if (filters.utilitiesIncluded === true) {
      if (finalUrl.length === initlen) finalUrl += `"utilitiesIncluded":true`;
      else finalUrl += `, "utilitiesIncluded":true`;
    }
    if (filters.secureEntry === true) {
      if (finalUrl.length === initlen) finalUrl += `"secureEntry":true`;
      else finalUrl += `, "secureEntry":true`;
    }
    if (filters.elevator === true) {
      if (finalUrl.length === initlen) finalUrl += `"elevator":true`;
      else finalUrl += `, "elevator":true`;
    }
    let sortVal = 1;
    if (sort === 'costDesc') sortVal = -1;
    finalUrl += `}&sort={"monthlyPrice":${sortVal}}`;
    var response;
    response = await axios.get(finalUrl);
    setSublets(response.data.data);
  };
  const createInterest = async (sublet:any, user:any) => {
    await axios.put(`https://drop-table-backend.onrender.com/api/interested/${user}/${sublet}`);
    window.location.reload();
  };
  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  const [formData, setFormData] = useState({
    petFriendly: undefined,
    parking: undefined,
    gym: undefined,
    utilitiesIncluded: undefined,
    secureEntry: undefined,
    elevator: undefined
  });
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
              setStatus('loaded');
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
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const updateSearch = () => {
    setSearch(searchRef.current!['value']);
    setSort(sortRef.current!['value']);
    setFilters(formData);
  };
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = async (id: any) => {
    let temp = await axios.get(subletURL + `?where={"_id":"${id}"}`);
    setSelectedApartment(temp.data.data);
    if (temp.data.data[0].interestedUsers.includes(userID)) setInterestText('Rescind your interest');
    else setInterestText("Let the lessor know you're interested!");
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const ChecklistItem = ({ label, value }: { label: any, value: any }) => (
    <div style={{ display: 'flex' }}>
      <span>{value ? <CheckBoxIcon color='secondary' sx={{ mt: 1.15 }} /> : <CheckBoxOutlineBlankIcon color='secondary' sx={{ mt: 1.15 }} />}</span>
      <span><Typography sx={{ mt: 1, ml: 1, textAlign: 'left' }}>{label}</Typography></span>
    </div>
  );
  if (status === 'loading') return (<div></div>);
  else {
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
                  href="#"
                  disableRipple
                >
                  <Typography variant="h5" color="secondary" sx={{ fontSize: '24px' }}>
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
                  onClick={() => {navigate('/profile')}}
                  disableRipple
                >
                  <Typography variant="h5" sx={{ fontSize: '24px' }} id="hovering">
                    My Info
                  </Typography>
                </Button>
              </Toolbar>
            </AppBar>
          </Grid>
        </Grid>
        <br></br>
        <Typography variant="h3" color='secondary' sx={{ fontSize: '30px', textAlign: 'center', mt: 1 }}>
          Find your dream sublet!
        </Typography>
        <Stack
          sx={{ pt: 4, mr: 10, ml: 10 }}
          direction="row"
          spacing={2}
          justifyContent="center"
        >
          <TextField
            fullWidth
            label="Search"
            name="Search"
            inputRef={searchRef}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            color='primary'
          />
          <Button variant="contained" disableRipple onClick={handleOpenFilter}>
            <FilterListIcon />
          </Button>
          <TextField
            select
            label="Sort"
            inputRef={sortRef}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SwapVertIcon />
                </InputAdornment>
              ),
            }}
            defaultValue="costAsc"
            sx={{ minWidth: '100px', width: '450px', maxWidth: '450px' }}
          >
            {sorting.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" disableRipple onClick={updateSearch}>Search</Button>
        </Stack>
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
        <Dialog
          open={openFilter}
          onClose={handleCloseFilter}
          maxWidth="md"
          PaperProps={{
            sx: {
              backgroundColor: defaultTheme.palette.primary.main,
              color: 'white',
            },
          }}
        >
          <DialogTitle>
            Filters
            <span style={{ float: 'right', cursor: 'pointer' }} onClick={handleCloseFilter}> &times;</span>
          </DialogTitle>
          <DialogContent style={{ display: 'flex', flexDirection: 'row' }}>
            <Grid item xs={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="petFriendly"
                      checked={formData.petFriendly}
                      onChange={handleInputChange}
                      color='secondary'
                      disableRipple
                      sx={{ color: 'white' }}
                    />
                  }
                  label="Pet Friendly"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="parking"
                      color='secondary'
                      disableRipple
                      sx={{ color: 'white' }}
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
                      color='secondary'
                      disableRipple
                      sx={{ color: 'white' }}
                    />
                  }
                  label="Gym"
                />
              </FormGroup>
            </Grid>
            <Grid item xs={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="utilitiesIncluded"
                      color='secondary'
                      disableRipple
                      sx={{ color: 'white' }}
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
                      color='secondary'
                      disableRipple
                      sx={{ color: 'white' }}
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
                      color='secondary'
                      disableRipple
                      sx={{ color: 'white' }}
                      checked={formData.elevator}
                      onChange={handleInputChange}
                    />
                  }
                  label="Elevator"
                />
              </FormGroup>
            </Grid>
          </DialogContent>
        </Dialog>
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
            <Button color="secondary" style={{ backgroundColor: '#FFF' }} onClick={() => createInterest(selectedApartment[0]._id, userID)}>{interestText}</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    );
  }
}