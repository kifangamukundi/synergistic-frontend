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

import { Link as ReactRouterLink, BrowserRouter, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.min.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';


import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';

import { getError, BASE_URL } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';

// new protection routes
import AdminOrModerator from './components/AdminOrModerator';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import MapScreen from './screens/MapScreen';

// New Addons
import SurveyListScreen from './screens/SurveyListScreen';
import SurveyEditScreen from './screens/SurveyEditScreen';
import SurveyScreen from './screens/SurveyScreen';
import SurveyAnalyzerScreen from './screens/SurveyAnalyzerScreen';
import SurveyTabulatorScreen from './screens/SurveyTabulatorScreen';

const pages = ['Products', 'Pricing', 'Blog'];

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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
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
                      <Chip label="ACCOUNT SETTINGS" />
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
                      <>
                        <Divider>
                          <Chip label="ADMIN SETTINGS" />
                        </Divider>
                        <MenuItem component={ReactRouterLink} to="/admin/dashboard" key={"admindashboard"} onClick={handleCloseUserMenu}>
                          <Typography textAlign="center">
                            Dashboard
                          </Typography>
                        </MenuItem>
                        <MenuItem component={ReactRouterLink} to="/admin/products" key={"adminproducts"} onClick={handleCloseUserMenu}>
                          <Typography textAlign="center">
                            Products
                          </Typography>
                        </MenuItem>
                        <MenuItem component={ReactRouterLink} to="/admin/orders" key={"adminorders"} onClick={handleCloseUserMenu}>
                          <Typography textAlign="center">
                            Orders
                          </Typography>
                        </MenuItem>
                      </>
                    )}

                    {userInfo && (userInfo.isAdmin || userInfo.isModerator) && (
                      <>
                        <Divider>
                          <Chip label="MANAGEMENT SETTINGS" />
                        </Divider>
                        <MenuItem component={ReactRouterLink} to="/user/list" key={"adminusers"} onClick={handleCloseUserMenu}>
                          <Typography textAlign="center">
                            Users
                          </Typography>
                        </MenuItem>
                      </>
                    )}

                    <Divider>
                      <Chip label="USER SESSION" />
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
        <Container maxWidth="xl" style={{ background: '#f5f5f5' }}>
        <Routes>
          <Route path="/product/:slug" element={<ProductScreen />} />
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
          <Route
            path="/survey/:slug"
            element={
              <ProtectedRoute>
                <SurveyScreen />
              </ProtectedRoute>
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
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderScreen />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/orderhistory"
            element={
              <ProtectedRoute>
                <OrderHistoryScreen />
              </ProtectedRoute>
            }
          ></Route>
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
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <OrderListScreen />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <ProductListScreen />
              </AdminRoute>
            }
          ></Route>
          <Route
            path="/admin/product/:id"
            element={
              <AdminRoute>
                <ProductEditScreen />
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
        </Container>
        <footer>
          <div className="text-center">SynergisticAgribusiness All rights reserved</div>
        </footer>
    </BrowserRouter>
  );
}
export default App;