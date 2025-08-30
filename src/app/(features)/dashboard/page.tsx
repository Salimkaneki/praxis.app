'use client'
import React from "react";
import { 
  User,
  Users,
  BookOpen,
  GraduationCap,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Filter,
  Download,
  Search,
  Calendar,
  ChevronDown
} from "lucide-react";

export default function Dashboard() {
  const kpis = [
    {
      label: "Personnel Académique",
      value: "248",
      previousValue: "235",
      period: "vs mois précédent",
      trend: "positive"
    },
    {
      label: "Programmes Actifs",
      value: "47",
      previousValue: "44",
      period: "vs mois précédent", 
      trend: "positive"
    },
    {
      label: "Effectif Étudiant",
      value: "3,847",
      previousValue: "3,720",
      period: "vs mois précédent",
      trend: "positive"
    },
    {
      label: "Taux d'Occupation",
      value: "87.3%",
      previousValue: "89.1%",
      period: "vs mois précédent",
      trend: "negative"
    }
  ];

  const metrics = [
    { label: "Taux de réussite global", value: "94.2%", change: "+1.8", unit: "pt" },
    { label: "Note satisfaction (NPS)", value: "72", change: "+5", unit: "" },
    { label: "Ratio encadrement", value: "1:15.5", change: "-0.3", unit: "" },
    { label: "Budget exécuté", value: "78.4%", change: "+3.2", unit: "pt" },
    { label: "Publications scientifiques", value: "157", change: "+12", unit: "" },
    { label: "Partenariats actifs", value: "23", change: "+2", unit: "" }
  ];

  const recentEvents = [
    {
      date: "2024-08-30",
      time: "09:30",
      title: "Conseil d'administration",
      location: "Salle du conseil",
      status: "En cours"
    },
    {
      date: "2024-08-30", 
      time: "14:00",
      title: "Commission pédagogique - Faculté de Droit",
      location: "Amphi A",
      status: "Programmé"
    },
    {
      date: "2024-08-30",
      time: "16:30", 
      title: "Soutenance HDR - Dr. Akakpo",
      location: "Salle de conférence",
      status: "Programmé"
    },
    {
      date: "2024-08-31",
      time: "10:00",
      title: "Réunion budgétaire Q3",
      location: "Bureau du recteur",
      status: "Programmé"
    }
  ];

//   const calculateChange = (current, previous) => {
//     const change = ((parseFloat(current.replace(/[,%]/g, '')) - parseFloat(previous.replace(/[,%]/g, ''))) / parseFloat(previous.replace(/[,%]/g, '')) * 100);
//     return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
//   };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-semibold text-gray-900">
                Université de Lomé
              </h1>
              <p className="text-sm font-poppins text-gray-600 mt-1">
                Tableau de bord de pilotage
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </button>
              <button className="inline-flex items-center px-3 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
              <div className="text-sm font-poppins text-gray-500">
                {new Date().toLocaleDateString('fr-FR', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-poppins font-medium text-gray-600">
                  {kpi.label}
                </h3>
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="mb-2">
                <div className="text-3xl font-poppins font-light text-gray-900 mb-1">
                  {kpi.value}
                </div>
                <div className="flex items-center text-sm">
                  <span className={`inline-flex items-center font-poppins font-medium ${
                    kpi.trend === 'positive' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {kpi.trend === 'positive' ? (
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                    )}
                    {/* {calculateChange(kpi.value, kpi.previousValue)} */}
                  </span>
                  <span className="text-gray-500 font-poppins ml-2">{kpi.period}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Metrics Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-poppins font-medium text-gray-900">
                    Indicateurs de performance
                  </h2>
                  <button className="text-sm font-poppins text-gray-500 hover:text-gray-700">
                    Voir tout
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {metrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-sm font-poppins font-medium text-gray-600 mb-1">
                          {metric.label}
                        </div>
                        <div className="text-2xl font-poppins font-light text-gray-900">
                          {metric.value}
                        </div>
                      </div>
                      <div className={`text-right ${
                        metric.change.startsWith('+') ? 'text-green-700' : 'text-red-700'
                      }`}>
                        <div className="text-sm font-poppins font-medium">
                          {metric.change}{metric.unit}
                        </div>
                        <div className="text-xs font-poppins text-gray-500">
                          30j
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-poppins font-medium text-gray-900">
                  Agenda
                </h2>
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {recentEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3 pb-4 last:pb-0 border-b border-gray-100 last:border-b-0">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-poppins font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-poppins font-medium rounded-full ${
                          event.status === 'En cours' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <p className="text-sm font-poppins text-gray-600 mb-1">
                        {event.location}
                      </p>
                      <p className="text-xs font-poppins text-gray-500">
                        {new Date(event.date).toLocaleDateString('fr-FR', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'short' 
                        })} à {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-2 text-sm font-poppins font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
                Voir l'agenda complet
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-poppins font-medium text-gray-900">
                Actions rapides
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { icon: User, label: "Gestion RH", sublabel: "Personnel & recrutement" },
                  { icon: BookOpen, label: "Programmes", sublabel: "Cursus & formations" },
                  { icon: GraduationCap, label: "Scolarité", sublabel: "Étudiants & examens" },
                  { icon: Users, label: "Administration", sublabel: "Services & support" }
                ].map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <button 
                      key={index}
                      className="flex items-center p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <IconComponent className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-poppins font-medium text-gray-900">
                          {action.label}
                        </div>
                        <div className="text-xs font-poppins text-gray-500">
                          {action.sublabel}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}