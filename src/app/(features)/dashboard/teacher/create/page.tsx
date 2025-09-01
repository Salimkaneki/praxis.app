'use client'
import React, { useState } from "react";
import { 
  User,
  ArrowLeft,
  Save,
  GraduationCap,
  Building,
  Award,
  Link,
  Clock
} from "lucide-react";

// Composant Input simplifié
type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  error?: string;
};

function Input({ 
  label, 
  placeholder, 
  value,
  onChange,
  type = "text",
  required = false,
  error
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-poppins text-sm font-medium text-gray-600">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-[50px] px-4 py-2 rounded-xl 
                   font-poppins font-medium text-base
                   border ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}
                   focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500
                   text-gray-700 placeholder-gray-400
                   transition-smooth
                   hover:bg-gray-100 hover:border-gray-400 w-full`}
      />
      {error && (
        <span className="text-sm text-red-500 font-poppins">{error}</span>
      )}
    </div>
  );
}

// Composant Select simplifié
type SelectProps = {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
};

function Select({ 
  label, 
  value,
  onChange,
  options,
  required = false,
  error
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-poppins text-sm font-medium text-gray-600">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`h-[50px] px-4 py-2 rounded-xl 
                   font-poppins font-medium text-base
                   border ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}
                   focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500
                   text-gray-700
                   transition-smooth
                   hover:bg-gray-100 hover:border-gray-400 w-full`}
      >
        <option value="">Sélectionner...</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-sm text-red-500 font-poppins">{error}</span>
      )}
    </div>
  );
}

export default function TeacherCreationForm() {
  const [formData, setFormData] = useState({
    user_id: "",
    specialization: "",
    grade: "",
    is_permanent: true,
    metadata: {
      experience: "",
      linkedin: ""
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Options pour les grades
  const gradeOptions = [
    { value: "assistant", label: "Assistant" },
    { value: "maitre_assistant", label: "Maître Assistant" },
    { value: "maitre_conferences", label: "Maître de Conférences" },
    { value: "professeur", label: "Professeur" },
    { value: "certifie", label: "Certifié" },
    { value: "agree", label: "Agrégé" }
  ];

  // Options pour l'expérience (simulées)
  const experienceOptions = [
    { value: "1 an", label: "1 an" },
    { value: "2 ans", label: "2 ans" },
    { value: "3 ans", label: "3 ans" },
    { value: "4 ans", label: "4 ans" },
    { value: "5 ans", label: "5 ans" },
    { value: "6-10 ans", label: "6-10 ans" },
    { value: "11-15 ans", label: "11-15 ans" },
    { value: "16-20 ans", label: "16-20 ans" },
    { value: "20+ ans", label: "Plus de 20 ans" }
  ];

  // Simuler des utilisateurs (en réalité, ceci viendrait d'une API)
  const userOptions = [
    { value: "1", label: "Dr. Marie Kouassi" },
    { value: "2", label: "Prof. Jean Akakpo" },
    { value: "3", label: "Dr. Fatou Diallo" },
    { value: "4", label: "Dr. Paul Mensah" },
    { value: "5", label: "Me. Adjoa Togo" }
  ];

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = field === 'user_id' ? parseInt(e.target.value) || "" : e.target.value;
    
    if (field.includes('metadata.')) {
      const metadataField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      is_permanent: e.target.checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.user_id) newErrors.user_id = "L'utilisateur est requis";
    if (!formData.specialization) newErrors.specialization = "La spécialisation est requise";
    if (!formData.grade) newErrors.grade = "Le grade est requis";
    if (!formData.metadata.experience) newErrors.experience = "L'expérience est requise";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Préparer les données pour l'API
      const apiData = {
        user_id: parseInt(formData.user_id),
        specialization: formData.specialization,
        grade: formData.grade,
        is_permanent: formData.is_permanent,
        metadata: {
          experience: formData.metadata.experience,
          linkedin: formData.metadata.linkedin || undefined
        }
      };
      
      console.log("Enseignant à créer:", apiData);
      // Appel API ici
      alert("Enseignant créé avec succès !");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-smooth">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-poppins font-semibold text-gray-900">
                  Nouvel Enseignant
                </h1>
                <p className="text-sm font-poppins text-gray-600 mt-1">
                  Ajouter un nouvel enseignant au corps professoral
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-smooth"
              >
                Annuler
              </button>
              <button 
                onClick={handleSubmit}
                className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-smooth"
              >
                <Save className="w-4 h-4 mr-2" />
                Créer l'Enseignant
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 flex-1">
        <div className="max-w-4xl mx-auto h-full">
          <div className="h-full">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              
              {/* Section Informations Générales */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-forest-600" />
                  </div>
                  <h2 className="text-lg font-poppins font-medium text-gray-900">
                    Informations générales
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Select
                    label="Utilisateur"
                    value={formData.user_id}
                    onChange={handleInputChange('user_id')}
                    options={userOptions}
                    required
                    error={errors.user_id}
                  />
                  
                  <Input
                    label="Spécialisation"
                    placeholder="ex: Design et art visuel"
                    value={formData.specialization}
                    onChange={handleInputChange('specialization')}
                    required
                    error={errors.specialization}
                  />
                </div>
              </div>

              {/* Section Grade et Statut */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Award className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-poppins font-medium text-gray-900">
                    Grade et statut
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Select
                    label="Grade académique"
                    value={formData.grade}
                    onChange={handleInputChange('grade')}
                    options={gradeOptions}
                    required
                    error={errors.grade}
                  />
                  
                  <div className="flex items-center justify-center">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_permanent"
                        checked={formData.is_permanent}
                        onChange={handleCheckboxChange}
                        className="w-4 h-4 text-forest-600 bg-gray-100 border-gray-300 rounded focus:ring-forest-500 focus:ring-2"
                      />
                      <label htmlFor="is_permanent" className="ml-3 font-poppins text-sm text-gray-700">
                        Enseignant permanent
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Expérience et Liens */}
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-lg font-poppins font-medium text-gray-900">
                    Expérience et informations complémentaires
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Select
                    label="Années d'expérience"
                    value={formData.metadata.experience}
                    onChange={handleInputChange('metadata.experience')}
                    options={experienceOptions}
                    required
                    error={errors.experience}
                  />
                  
                  <Input
                    label="Profil LinkedIn (optionnel)"
                    placeholder="https://linkedin.com/in/nom-prenom"
                    value={formData.metadata.linkedin}
                    onChange={handleInputChange('metadata.linkedin')}
                    type="url"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}