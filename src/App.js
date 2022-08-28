import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
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
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
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

// Search and filter addons
import SurveySearchScreen from './screens/SurveySearchScreen';

const BASE_URL = "https://mukundi-agriculture-backend.herokuapp.com";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
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
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
            ? 'site-container d-flex flex-column full-box'
            : 'site-container d-flex flex-column'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="light" variant="light" expand="lg">
            <Container>
              <Button
                variant="success"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>

              <LinkContainer to="/">
                <Navbar.Brand href="/">
                  {/* <img
                    alt=""
                    src="/logo.png"
                    width="400"
                    height="280"
                  /> */}
                  SynergisticAgribusiness
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                {/* <SearchBox /> */}
                <Nav className="me-auto  w-100  justify-content-end">
                  {/* <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link> */}
                  {userInfo ? (
                    <NavDropdown title={`${userInfo.firstName} ${userInfo.lastName}`} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      {/* <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer> */}
                      <LinkContainer to="/survey/list">
                        <NavDropdown.Item>Tools</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {/* {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Dashboard" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )} */}
                   {userInfo && (userInfo.isAdmin || userInfo.isModerator) && (
                    <NavDropdown title="Management" id="admin-nav-dropdown">
                      <LinkContainer to="/user/list">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                    )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        {/* <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div> */}
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />

              {/* Not signed in Protected routes */}
              <Route
                path="/survey/search"
                element={
                  <ProtectedRoute>
                    <SurveySearchScreen />
                  </ProtectedRoute>
                }
              />
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
          </Container>
        </main>
        <footer>
          <div className="text-center">SynergisticAgribusiness All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
