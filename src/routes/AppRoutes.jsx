import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/login';
import Dashboard from '../pages/Dashboard';
import UserType from '../pages/usertype/UserType';
import TypeList from '../pages/usertype/Usertypelist';
import Quotationlist from '../pages/quotation/Quotationlist';
import QuotationForm from '../pages/quotation/Quotation';
import QuotationView from '../pages/quotation/QuotationView';

import BillingForm from '../pages/billing/Billing';
import BillingList from '../pages/billing/Billinglist';
import UserCreate from '../pages/usercreation/UserCreation';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Login />} />

        {/* PROTECTED */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        }/>

        <Route path="/usertype" element={
          <ProtectedRoute><UserType /></ProtectedRoute>
        }/>

        <Route path="/usertype/:id" element={
          <ProtectedRoute><UserType /></ProtectedRoute>
        }/>

        <Route path="/usertypelist" element={
          <ProtectedRoute><TypeList /></ProtectedRoute>
        }/>

        <Route path="/quotation" element={
          <ProtectedRoute><Quotationlist /></ProtectedRoute>
        }/>

        <Route path="/quotationform" element={
          <ProtectedRoute><QuotationForm /></ProtectedRoute>
        }/>

         <Route path="/quotationform/edit/:quotationId" element={
          <ProtectedRoute><QuotationForm /></ProtectedRoute>
        }/>

        <Route path="/quotation/view/:quotationId" element={
            <ProtectedRoute><QuotationView /></ProtectedRoute>
        }/>

        <Route path="/billinglist" element={
          <ProtectedRoute><BillingList /></ProtectedRoute>
        }/>

        <Route path="/billingform" element={
          <ProtectedRoute><BillingForm /></ProtectedRoute>
        }/>

        <Route path="/usercreate" element={
          <ProtectedRoute><UserCreate /></ProtectedRoute>
        }/>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;