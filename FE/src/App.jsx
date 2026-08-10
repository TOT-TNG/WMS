import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import PlaceholderPage from "./pages/PlaceholderPage";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="inventory" element={<PlaceholderPage title="Kho hàng" />} />
        <Route path="orders" element={<PlaceholderPage title="Đơn hàng" />} />
        <Route path="shipping" element={<PlaceholderPage title="Vận chuyển" />} />
        <Route path="reports" element={<PlaceholderPage title="Báo cáo" />} />
        <Route path="settings" element={<PlaceholderPage title="Cài đặt" />} />
      </Route>
    </Routes>
  );
}

export default App;
