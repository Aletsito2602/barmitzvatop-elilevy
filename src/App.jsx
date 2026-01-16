import { ChakraProvider, Box } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import StrugglesSection from './components/StrugglesSection'
import BenefitsSection from './components/BenefitsSection'
import About from './components/About'
import AboutEli from './components/AboutEli'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import VideoModal from './components/VideoModal'
import KpiCounterSection from './components/KpiCounterSection'
import PricingSection from './components/PricingSection'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Checkout from './components/Checkout'
import CheckoutSuccess from './components/CheckoutSuccess'
import CheckoutCancel from './components/CheckoutCancel'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

// Componente Home con todo el contenido de la landing
const Home = () => (
  <Box width="100vw" minH="100vh" overflowX="hidden" position="relative">
    <VideoModal />
    <Navbar />
    <Box as="main" width="100%" position="relative">
      <Hero />
      <StrugglesSection />
      <BenefitsSection />
      <AboutEli />
      <KpiCounterSection />
      <PricingSection />
      <About />
      <FAQ />
      <Contact />
    </Box>
    <Footer />
  </Box>
)

function App() {
  return (
    <ChakraProvider>
      <Box width="100%" minH="100vh">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/comunidad" element={<Dashboard />} />
          <Route path="/dashboard/clases" element={<Dashboard />} />
          <Route path="/dashboard/herramientas" element={<Dashboard />} />
          <Route path="/dashboard/crm" element={<Dashboard />} />
          <Route path="/dashboard/perfil" element={<Dashboard />} />
          <Route path="/dashboard/parasha" element={<Dashboard />} />
        </Routes>
      </Box>
    </ChakraProvider>
  )
}

export default App