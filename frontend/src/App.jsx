import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateCustomer from "./pages/CreateCustomer";
import CustomerDetail from "./pages/CustomerDetail";
import Navbar from "./components/Navbar";
import CustomerEdit from "./pages/CustomerEdit";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateCustomer />} />
        <Route path="/customer/:id" element={<CustomerDetail />} />
        <Route path="/customer/:id/edit" element={<CustomerEdit />} />
        <Route path="*" element={<h2 className="text-center mt-5">Page Not Found</h2>} />
      </Routes>
    </>
  );
}

export default App;
