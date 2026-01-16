import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

// Наши специальные страницы

import Feedback from './pages/Feedback';
import Administration from './pages/Administration';
import Vacancies from './pages/Vacancies';
import OrgStructure from './pages/OrgStructure';
import AboutGeneral from './pages/AboutGeneral';
import ServicesPrices from './pages/ServicesPrices';
import GuestReviews from './pages/GuestReviews';      // <-- НОВОЕ
import PersonalSchedule from './pages/PersonalSchedule'; // <-- НОВОЕ
import AboutSphere from './pages/AboutSphere';
import AboutAnticorruption from './pages/AboutAnticorruption';
import AboutPolicy from './pages/AboutPolicy';
import BlogWelcome from './pages/BlogWelcome';
import ServicesActs from './pages/ServicesActs';
import ServicesRegistry from './pages/ServicesRegistry';
import ServicesStandards from './pages/ServicesStandards';
import ServicesRegulations from './pages/ServicesRegulations';
import ServicesInfo from './pages/ServicesInfo';
import ServicesContact from './pages/ServicesContact';
import ServicesRights from './pages/ServicesRights';
import StateSymbols from './pages/StateSymbols';
import ServicesReception from './pages/ServicesReception';
import ServicesSupport from './pages/ServicesSupport';
import ServicesArea from './pages/ServicesArea';
import ServicesDoctors from './pages/ServicesDoctors';
import ServicesPatientRules from './pages/ServicesPatientRules';
import ServicesUseful from './pages/ServicesUseful';
import ServicesHealthSchools from './pages/ServicesHealthSchools';
import ServicesHealthyLifestyle from './pages/ServicesHealthyLifestyle';
import MediaVideo from './pages/MediaVideo';
import News from './pages/News';
import ServicesScreening from './pages/ServicesScreening';
// Наша универсальная страница для всего остального
import UniversalPage from './pages/UniversalPage';   // <-- НОВОЕ

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          
          <Route index element={<Home />} />

          {/* === 2. О ПОЛИКЛИНИКЕ === */}
          <Route path="about/general" element={<AboutGeneral />} />
          {/* Используем UniversalPage с ключами из pagesData.js */}
          <Route path="about/sphere" element={<AboutSphere />} />
          <Route path="about/anticorruption" element={<AboutAnticorruption />} />
          <Route path="about/structure" element={<OrgStructure />} />
          <Route path="about/certificates" element={<UniversalPage pageId="about_certs" />} />
          <Route path="about/admin" element={<Administration />} />
          <Route path="about/vacancies" element={<Vacancies />} />
          <Route path="about/income" element={<UniversalPage pageId="about_income" />} />
          <Route path="about/procurement" element={<UniversalPage pageId="about_procurement" />} />
          <Route path="about/ethics" element={<UniversalPage pageId="about_ethics" />} />
          <Route path="about/annual" element={<UniversalPage pageId="about_annual" />} />
          <Route path="about/policy" element={<AboutPolicy />} />
          
          <Route path="about/corp/council" element={<UniversalPage pageId="corp_council" />} />
          <Route path="about/corp/docs" element={<UniversalPage pageId="corp_docs" />} />
          <Route path="about/corp/licenses" element={<UniversalPage pageId="corp_licenses" />} />

          {/* === 3. БЛОГ === */}
          <Route path="blog/welcome" element={<BlogWelcome />} />
          <Route path="blog/feedback" element={<Feedback />} />

          {/* === 4. ГОСТЕВАЯ === */}
          <Route path="guest/thanks" element={<Feedback />} />
          <Route path="guest/complaints" element={<Feedback />} />
          <Route path="guest/reviews" element={<GuestReviews />} /> {/* Специальный компонент */}

          {/* === 5. ГОСУСЛУГИ === */}
          <Route path="services/acts" element={<ServicesActs />} />
          <Route path="services/registry" element={<ServicesRegistry />} />
          <Route path="services/standards" element={<ServicesStandards />} />
          <Route path="services/regulations" element={<ServicesRegulations />} />
          <Route path="services/info" element={<ServicesInfo />} />
          <Route path="services/contact" element={<ServicesContact />} />
          <Route path="services/rights" element={<ServicesRights />} />

          {/* === 6. СИМВОЛЫ === */}
          <Route path="/symbols" element={<StateSymbols />} />

          {/* === 7. ПАЦИЕНТАМ === */}
          <Route path="patients/admin-reception" element={<ServicesReception />} />
          <Route path="patients/support" element={<ServicesSupport />} />
          <Route path="patients/territory" element={<ServicesArea />} />
          <Route path="patients/personal-schedule" element={<PersonalSchedule />} /> {/* Специальный компонент */}
          <Route path="patients/doc-schedule" element={<ServicesDoctors />} />
          <Route path="patients/rights" element={<ServicesPatientRules />} />
          <Route path="patients/prices" element={<ServicesPrices />} />
          <Route path="patients/info" element={<ServicesUseful />} />
          <Route path="patients/schools" element={<ServicesHealthSchools />} />
          <Route path="patients/lifestyle" element={<ServicesHealthyLifestyle />} />
          <Route path="media/video" element={<MediaVideo />} />
          <Route path="/news" element={<News />} />
          <Route path="patients/screening" element={<ServicesScreening />} />

          {/* === 404 - НЕ НАЙДЕНО === */}
          <Route path="*" element={<UniversalPage pageId="404" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;