import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { SchemeCard } from '../components/cards/SchemeCard';
import { ServiceCard } from '../components/cards/ServiceCard';
import { mockApi } from '../services/mockApi';
import { useStateContext } from '../context/StateContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Landmark,
  MapPin,
  Megaphone,
  FileCheck,
  Building2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const TamilNaduPage = () => {
  const navigate = useNavigate();
  const { selectedDistrict, setSelectedDistrict } = useStateContext();
  const { t, getLocalized } = useLanguage();

  const [districts, setDistricts] = useState([]);
  const [tnSchemes, setTnSchemes] = useState([]);
  const [tnServices, setTnServices] = useState([]);

  useEffect(() => {
    const loadTN = async () => {
      const [distList, allSchemes, allServices] = await Promise.all([
        mockApi.getDistrictsByState('tamil-nadu'),
        mockApi.getSchemes({ state: 'tamil-nadu' }),
        mockApi.getServices({ state: 'tamil-nadu' })
      ]);
      setDistricts(distList);
      // Filter strictly for Tamil Nadu state-specific schemes
      setTnSchemes(allSchemes.filter(s => s.applicableStates.includes('tamil-nadu')));
      setTnServices(allServices.filter(s => s.applicableStates.includes('tamil-nadu')));
    };

    loadTN();
  }, []);

  const currentDistrictObj = districts.find(d => (d.id || d.name || d) === selectedDistrict) || (typeof selectedDistrict === 'object' ? selectedDistrict : { name: selectedDistrict });
  const districtDisplayName = getLocalized(currentDistrictObj, 'name') || selectedDistrict;

  const tnAnnouncements = [
    {
      id: 1,
      title: t("tn.ann1Title", "Kalaignar Magalir Urimai Thogai: Grievance & Appeal Camps"),
      date: t("tn.ann1Date", "February 2025"),
      body: t("tn.ann1Body", "Appeals for eligible female heads of families can be submitted through Revenue Divisional Offices (RDO) or nearest e-Sevai centres."),
      status: t("tn.ann1Status", "Official Gazette Notice")
    },
    {
      id: 2,
      title: t("tn.ann2Title", "Pudhumai Penn Scheme: Semester Renewal Verification"),
      date: t("tn.ann2Date", "January 2025"),
      body: t("tn.ann2Body", "College Nodal Officers instructed to verify government school EMIS registration numbers for 2024-25 academic year disbursement."),
      status: t("tn.ann2Status", "Higher Education Dept")
    },
    {
      id: 3,
      title: t("tn.ann3Title", "Patta Chitta Digitization: Instant Online Verification"),
      date: t("tn.ann3Date", "Updated Regularly"),
      body: t("tn.ann3Body", "View rural survey and urban town survey extracts (TSLR) with QR verification free on eservices.tn.gov.in."),
      status: t("tn.ann3Status", "Survey & Settlement")
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title={t('tn.title', 'Tamil Nadu State Services Portal')}
        subtitle={t('tn.subtitle', 'Dedicated portal for Tamil Nadu e-Sevai citizen certificates, state welfare schemes, land records (Patta/Chitta), and department announcements.')}
        badge={t('tn.badge', 'Tamil Nadu State Guide')}
      />

      {/* District Selector & Regional Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {t('tn.adminTitle', 'Tamil Nadu District Administration')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('tn.adminSubtitle', 'Filter taluk and e-Sevai services by your local district')}
            </p>
          </div>
        </div>

        {/* District Selector dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <MapPin className="w-4 h-4 text-[#075BA8] dark:text-blue-400" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#075BA8] cursor-pointer"
          >
            {districts.map((d) => {
              const val = d.id || d.name || d;
              const name = getLocalized(d, 'name') || d.name || d;
              return (
                <option key={val} value={val}>
                  {name} {t('common.district', 'District')}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* State Announcements Section */}
      <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/50 dark:from-slate-900 dark:to-slate-800/80 rounded-3xl p-6 border border-blue-200/70 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-[#075BA8] dark:text-blue-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t('tn.announcementsTitle', 'Tamil Nadu State Announcements & Gazettes')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tnAnnouncements.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-[#075BA8] dark:text-blue-400 uppercase tracking-wider block mb-1">
                  {item.status} • {item.date}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Tamil Nadu Portals Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">{t('cat.land', 'Revenue & Land')}</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{t('tn.portalPattaTitle', 'Patta / Chitta & Tamil Nilam')}</h3>
            <p className="text-xs text-slate-500 mt-1">{t('tn.portalPattaDesc', { district: districtDisplayName })}</p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700">
            <Link to="/documents/patta-chitta" className="text-xs font-bold text-[#075BA8] dark:text-blue-400 hover:underline flex items-center gap-1">
              <span>{t('tn.portalPattaLink', 'View Patta Guide')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">{t('cat.identity', 'Certificates')}</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{t('tn.portaleSevaiTitle', 'e-Sevai (TNeGA) Portal')}</h3>
            <p className="text-xs text-slate-500 mt-1">{t('tn.portaleSevaiDesc', 'Single-window issuance of income, community, first-generation graduate, and legal heir certificates.')}</p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700">
            <Link to="/services/income-certificate-service" className="text-xs font-bold text-[#075BA8] dark:text-blue-400 hover:underline flex items-center gap-1">
              <span>{t('tn.portaleSevaiLink', 'e-Sevai Workflow')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">{t('cat.food', 'Food & Welfare')}</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{t('tn.portalTNPDS', 'TNPDS Smart Family Card')}</h3>
            <p className="text-xs text-slate-500 mt-1">{t('tn.portalTNPDSDesc', 'Smart card management, member additions, Fair Price Shop quotas, and festive pongal allowances.')}</p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700">
            <Link to="/services/ration-card-service" className="text-xs font-bold text-[#075BA8] dark:text-blue-400 hover:underline flex items-center gap-1">
              <span>{t('tn.portalTNPDSLink', 'Smart Card Guide')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Flagship State Welfare Schemes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {t('tn.flagshipTitle', 'Flagship Tamil Nadu Welfare Schemes')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('tn.flagshipSubtitle', { district: districtDisplayName })}
            </p>
          </div>
          <Link to="/schemes" className="text-xs font-bold text-[#075BA8] dark:text-blue-400 hover:underline">
            {t('common.viewAllSchemes', 'View All Schemes')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tnSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      </div>

      {/* Tamil Nadu Online Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {t('tn.servicesTitle', 'Tamil Nadu State Citizen Services')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('tn.servicesSubtitle', 'Department services verified against Tamil Nadu e-District guidelines')}
            </p>
          </div>
          <Link to="/services" className="text-xs font-bold text-[#075BA8] dark:text-blue-400 hover:underline">
            {t('common.viewAllServices', 'View All Services')}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {tnServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

