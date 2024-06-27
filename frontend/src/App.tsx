import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import Signin from "./pages/Signin";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<p>home page</p>} />
                        <Route path="register" element={<Register />} />
                        <Route path="sign-in" element={<Signin />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
