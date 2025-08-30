'use client'
import React, { useState } from "react";
import { 
  BookOpen,
  ArrowLeft,
  Save
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

// Composant Textarea simplifié
type TextareaProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  error?: string;
  rows?: number;
};

function Textarea({ 
  label, 
  placeholder, 
  value,
  onChange,
  required = false,
  error,
  rows = 4
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-poppins text-sm font-medium text-gray-600">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`px-4 py-3 rounded-xl 
                   font-poppins font-medium text-base
                   border ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}
                   focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500
                   text-gray-700 placeholder-gray-400
                   transition-smooth
                   hover:bg-gray-100 hover:border-gray-400 w-full
                   resize-none`}
      />
      {error && (
        <span className="text-sm text-red-500 font-poppins">{error}</span>
      )}
    </div>
  );
}

export default function SimpleFormationForm() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    duration_years: "",
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = field === 'duration_years' ? parseInt(e.target.value) || "" : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      // setErrors(prev => ({
      //   ...prev,
      //   [field]: undefined
      // }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      is_active: e.target.checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Le nom est requis";
    if (!formData.code) newErrors.code = "Le code est requis";
    if (!formData.description) newErrors.description = "La description est requise";
    if (!formData.duration_years) newErrors.duration_years = "La durée est requise";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      // Préparer les données pour l'API
      const apiData = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        duration_years: parseInt(formData.duration_years),
        is_active: formData.is_active
      };
      
      console.log("Formation à créer:", apiData);
      // Appel API ici
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
                  Nouvelle Formation
                </h1>
                <p className="text-sm font-poppins text-gray-600 mt-1">
                  Créer une nouvelle formation académique
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
                Créer la Formation
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 flex-1">
        <div className="max-w-4xl mx-auto h-full">
          <form onSubmit={handleSubmit} className="h-full">
            <div className="bg-white border border-gray-200 rounded-lg p-8 h-full flex flex-col">
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center mr-3">
                  <BookOpen className="w-4 h-4 text-forest-600" />
                </div>
                <h2 className="text-lg font-poppins font-medium text-gray-900">
                  Informations de la formation
                </h2>
              </div>
              
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Input
                    label="Nom de la formation"
                    placeholder="ex: Licence Informatique"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    required
                    error={errors.name}
                  />
                  
                  <Input
                    label="Code de la formation"
                    placeholder="ex: LIC-INFO-001"
                    value={formData.code}
                    onChange={handleInputChange('code')}
                    required
                    error={errors.code}
                  />
                  
                  <Input
                    label="Durée (en années)"
                    placeholder="ex: 3"
                    type="number"
                    value={formData.duration_years}
                    onChange={handleInputChange('duration_years')}
                    required
                    error={errors.duration_years}
                  />
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-forest-600 bg-gray-100 border-gray-300 rounded focus:ring-forest-500 focus:ring-2"
                    />
                    <label htmlFor="is_active" className="ml-3 font-poppins text-sm text-gray-700">
                      Formation active
                    </label>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <Textarea
                    label="Description"
                    placeholder="ex: Formation de trois ans en informatique générale avec spécialisation progressive."
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    required
                    error={errors.description}
                    rows={8}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}