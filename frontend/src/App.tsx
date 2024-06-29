import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import Signin from "./pages/Signin";
import { useAppContext } from "./hooks/useAppContext";
import AddHotel from "./pages/AddHotel";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";

function App() {
    const { isLoggedIn } = useAppContext();
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<p>home page</p>} />
                        <Route path="register" element={<Register />} />
                        <Route path="sign-in" element={<Signin />} />
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
                            </>
                        )}
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
