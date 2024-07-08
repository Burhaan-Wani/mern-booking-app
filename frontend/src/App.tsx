import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import Signin from "./pages/Signin";
import { useAppContext } from "./hooks/useAppContext";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";

function App() {
    const { isLoggedIn } = useAppContext();
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="register" element={<Register />} />
                        <Route path="sign-in" element={<Signin />} />
                        <Route path="search" element={<Search />} />
                        {isLoggedIn && (
                            <>
                                <Route
                                    path="add-hotel"
                                    element={<AddHotel />}
                                />
                                <Route
                                    path="my-hotels"
                                    element={<MyHotels />}
                                />
                                <Route
                                    path="add-hotel/:hotelId"
                                    element={<EditHotel />}
                                />
                                <Route
                                    path="hotel/:hotelId/booking"
                                    element={<Booking />}
                                />
                                <Route
                                    path="my-bookings"
                                    element={<MyBookings />}
                                />
                            </>
                        )}
                        <Route path="detail/:hotelId" element={<Detail />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
