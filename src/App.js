import * as React from 'react';
import Link from '@mui/material/Link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import CopyrightIcon from '@mui/icons-material/Copyright';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import CookieIcon from '@mui/icons-material/Cookie';

import { Link as ReactRouterLink, BrowserRouter, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.min.css';
import HomeScreen from './screens/HomeScreen';


import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import ProfileScreen from './screens/ProfileScreen';

import { getError, BASE_URL } from './utils';
import axios from 'axios';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';

// new protection routes
import AdminOrModerator from './components/AdminOrModerator';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import MapScreen from './screens/MapScreen';

// New Addons
import SurveyListScreen from './screens/SurveyListScreen';
import SurveyEditScreen from './screens/SurveyEditScreen';
import SurveyScreen from './screens/SurveyScreen';
import SurveyAnalyzerScreen from './screens/SurveyAnalyzerScreen';
import SurveyTabulatorScreen from './screens/SurveyTabulatorScreen';
import { Grid } from '@mui/material';

function App() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

//   Original
const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  return (
    <BrowserRouter>
      {/* Header */}
        <AppBar position="static" style={{ background: '#00693e' }}>
        <Container maxWidth="xl">
            <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                }}
            >
                SAS
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                >
                <MenuIcon />
                </IconButton>
                <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                    display: { xs: 'block', md: 'none' },
                }}
                >
                    <MenuItem component={ReactRouterLink} to="/services" key={"services"} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        Our Services
                      </Typography>
                    </MenuItem>
                    <Divider/>

                    <MenuItem component={ReactRouterLink} to="/features" key={"features"} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        Features
                      </Typography>
                    </MenuItem>
                    <Divider/>

                    <MenuItem component={ReactRouterLink} to="/pricing" key={"pricing"} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        Pricing
                      </Typography>
                    </MenuItem>
                    <Divider/>

                    <MenuItem component={ReactRouterLink} to="/about-us" key={"about-us"} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        About Us
                      </Typography>
                    </MenuItem>
                    <Divider/>

                    <MenuItem component={ReactRouterLink} to="/team" key={"team"} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        Meet The Team
                      </Typography>
                    </MenuItem>
                    <Divider/>

                    <MenuItem component={ReactRouterLink} to="/blog" key={"blog"} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        Blog
                      </Typography>
                    </MenuItem>
                    <Divider/>

                    <MenuItem component={ReactRouterLink} to="/faq" key={"faq"} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        FAQ
                      </Typography>
                    </MenuItem>
                    <Divider/>

                    <MenuItem component={ReactRouterLink} to="/contact" key={"contact"} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        Contact
                      </Typography>
                    </MenuItem>
                    <Divider/>

                </Menu>
            </Box>

            {/* desktop */}
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                }}
            >
                SAS
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

              <Button
                key={"services"}
                onClick={handleCloseNavMenu}
                component={ReactRouterLink} to="/services"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Our Services
              </Button>

              <Button
                key={"features"}
                onClick={handleCloseNavMenu}
                component={ReactRouterLink} to="/features"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Features
              </Button>

              <Button
                key={"pricing"}
                onClick={handleCloseNavMenu}
                component={ReactRouterLink} to="/pricing"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Pricing
              </Button>

              <Button
                key={"about-us"}
                onClick={handleCloseNavMenu}
                component={ReactRouterLink} to="/about"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                About Us
              </Button>

              <Button
                key={"team"}
                onClick={handleCloseNavMenu}
                component={ReactRouterLink} to="/team"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Team
              </Button>
              
              <Button
                key={"blog"}
                onClick={handleCloseNavMenu}
                component={ReactRouterLink} to="/blog"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Blog
              </Button>

              <Button
                key={"faq"}
                onClick={handleCloseNavMenu}
                component={ReactRouterLink} to="/faq"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                FAQ
              </Button>

              <Button
                key={"contact"}
                onClick={handleCloseNavMenu}
                component={ReactRouterLink} to="/contact"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Contact
              </Button>

            </Box>

            {userInfo ? (
              <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt={userInfo.firstName} src={userInfo.image} />
                  </IconButton>
                  </Tooltip>
                  <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  >
                    <Divider>
                      <Chip sx={{ backgroundColor: '#587246', color: "white" }} label="ACCOUNT SETTINGS" />
                    </Divider>
                    <MenuItem component={ReactRouterLink} to="/userdashboard" key={"userdashboard"} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">
                        Dashboard
                      </Typography>
                    </MenuItem>
                    <Divider/>
                    <MenuItem component={ReactRouterLink} to="/profile" key={"profile"} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">
                        Profile
                      </Typography>
                    </MenuItem>
                    <Divider/>
                    <MenuItem component={ReactRouterLink} to="/billing" key={"billing"} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">
                        Billing
                      </Typography>
                    </MenuItem>
                    <Divider/>
                    <MenuItem component={ReactRouterLink} to="/survey/list" key={"tools"} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">
                        Tools
                      </Typography>
                    </MenuItem>

                    
                    {userInfo && userInfo.isAdmin && (
                      <Box>
                        <Divider>
                          <Chip sx={{ backgroundColor: '#587246', color: "white" }} label="ADMIN SETTINGS" />
                        </Divider>
                        <MenuItem component={ReactRouterLink} to="/admin/dashboard" key={"admindashboard"} onClick={handleCloseUserMenu}>
                          <Typography textAlign="center">
                            Dashboard
                          </Typography>
                        </MenuItem>
                      </Box>
                    )}

                    {userInfo && (userInfo.isAdmin || userInfo.isModerator) && (
                      <Box>
                        <Divider>
                          <Chip sx={{ backgroundColor: '#587246', color: "white" }} label="MANAGEMENT SETTINGS" />
                        </Divider>
                        <MenuItem component={ReactRouterLink} to="/user/list" key={"adminusers"} onClick={handleCloseUserMenu}>
                          <Typography textAlign="center">
                            Users
                          </Typography>
                        </MenuItem>
                      </Box>
                    )}

                    <Divider>
                      <Chip sx={{ backgroundColor: '#587246', color: "white" }} label="USER SESSION" />
                    </Divider>
                    <MenuItem component={ReactRouterLink} to="#signout" key={"logout"} onClick={() => [handleCloseUserMenu(), signoutHandler()]}>
                      <Typography textAlign="center">
                        Logout
                      </Typography>
                    </MenuItem>

                  </Menu>
              </Box>
              ) : (
                  <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <AccountCircle/>
                    </IconButton>
                    </Tooltip>
                    <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    >
                      <Divider>
                        <Chip label="GET STARTED" />
                      </Divider>
                      <MenuItem component={ReactRouterLink} to="/signin" key={"Login"} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">
                          Login
                        </Typography>
                      </MenuItem>

                      <Divider/>
                      <MenuItem component={ReactRouterLink} to="/signup" key={"signup"} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">
                          Register
                        </Typography>
                      </MenuItem>

                    </Menu>
                </Box>
            )}
            </Toolbar>
        </Container>
        </AppBar>
        {/* Main */}
        <main>
        <Routes>
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/signin" element={<SigninScreen />} />
          <Route path="/signup" element={<SignupScreen />} />

          {/* Not signed in Protected routes */}
          <Route
            path="/survey/list"
            element={
              <ProtectedRoute>
                <SurveyListScreen />
              </ProtectedRoute>
            }
          />

          {/* Disabled survey access momentarily */}
          <Route
            path="/survey/:slug"
            element={
                <SurveyScreen />
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipping"
            element={<ShippingAddressScreen />}
          ></Route>
          <Route path="/payment" element={<PaymentMethodScreen />}></Route>
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <DashboardScreen />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/survey/analysis/:slug"
            element={
              <AdminRoute>
                <SurveyAnalyzerScreen />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/survey/table/:slug"
            element={
              <AdminRoute>
                <SurveyTabulatorScreen />
              </AdminRoute>
            }
          ></Route>

          {/* Admin or Moderator */}
          <Route
            path="/survey/edit/:id"
            element={
              <AdminOrModerator>
                <SurveyEditScreen />
              </AdminOrModerator>
            }
          ></Route>
          <Route
            path="/user/list"
            element={
              <AdminOrModerator>
                <UserListScreen />
              </AdminOrModerator>
            }
          ></Route>
            <Route
              path="/user/edit/:id"
              element={
                <AdminOrModerator>
                  <UserEditScreen />
                </AdminOrModerator>
              }
            ></Route>

          <Route path="/" element={<HomeScreen />} />
        </Routes>
        <ToastContainer />
        </main>
        {/* Footer */}
        <footer>
          <Box px={{xs: 3, sm: 10}} py={{xs: 5, sm: 10}}
            bgcolor="#4f7942" color="white">
            <Container maxWidth="lg">
              <Grid container spacing={5}>

                <Grid xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant='body1' component="body1">
                    <InfoIcon sx={{mr: 2}}/>
                      <Link style={{textDecoration: 'none', color: 'inherit'}} component={ReactRouterLink} to="/">
                        About Us
                      </Link>
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant='body1' component="body1">
                      <Diversity3Icon sx={{mr: 2}}/>
                      <Link style={{textDecoration: 'none', color: 'inherit'}} component={ReactRouterLink} to="/">
                        Meet The Team
                      </Link>
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant='body1' component="body1">
                      <MiscellaneousServicesIcon sx={{mr: 2}}/>
                      <Link style={{textDecoration: 'none', color: 'inherit'}} component={ReactRouterLink} to="/">
                        Our Services
                      </Link>
                    </Typography>
                  </Box>
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant='body1' component="body1">
                      <GavelIcon sx={{mr: 2}}/>
                      <Link style={{textDecoration: 'none', color: 'inherit'}} component={ReactRouterLink} to="/">
                        Terms and Conditions
                      </Link>
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant='body1' component="body1">
                      <SecurityIcon sx={{mr: 2}}/>
                      <Link style={{textDecoration: 'none', color: 'inherit'}} component={ReactRouterLink} to="/">
                        Privacy Policy
                      </Link>
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant='body1' component="body1">
                      <CookieIcon sx={{mr: 2}}/>
                      <Link style={{textDecoration: 'none', color: 'inherit'}} component={ReactRouterLink} to="/">
                        Cookie Policy
                      </Link>
                    </Typography>
                  </Box>
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                  <Box>
                    <Typography variant='body1' component="body1">
                      <MailIcon sx={{mr: 2}}/>
                      <Link style={{textDecoration: 'none', color: 'inherit'}} component={ReactRouterLink} to="/">
                        info@synergistic.com
                      </Link>
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant='body1' component="body1">
                      <PhoneIcon sx={{mr: 2}}/>
                      <Link style={{textDecoration: 'none', color: 'inherit'}} component={ReactRouterLink} to="/">
                        +254702817040
                      </Link>
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant='body1' component="body1">
                      <LocationOnIcon sx={{mr: 2}}/>
                      <Link style={{textDecoration: 'none', color: 'inherit'}} component={ReactRouterLink} to="/">
                        876, 10106 Nairobi, Kenya
                      </Link>
                    </Typography>
                  </Box>
                </Grid>

              </Grid>
              
              <Box textAlign="center" pt={{xs: 5, sm: 10}} pb={{xs: 5, sm: 0}}>
              <Divider color="white"/>
                <Typography variant='h6' component="body1"><CopyrightIcon sx={{mr: 1}}/> {new Date().getFullYear()} SAS, Inc. All rights reserved.</Typography>
              </Box>
            </Container>
          </Box>
        </footer>
    </BrowserRouter>
  );
}
export default App;