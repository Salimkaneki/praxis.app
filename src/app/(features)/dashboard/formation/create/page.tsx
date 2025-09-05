'use client'
import React, { useState } from "react";
import { 
  BookOpen,
  ArrowLeft,
  Save
} from "lucide-react";
import { createFormation } from "../_services/formation.service";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Inputs/Input";
import Textarea from "@/components/ui/Inputs/Textarea";

export default function SimpleFormationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    duration_years: "",
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleTextareaChange = (field: string) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      is_active: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Le nom est requis";
    if (!formData.code) newErrors.code = "Le code est requis";
    if (!formData.description) newErrors.description = "La description est requise";
    if (!formData.duration_years) newErrors.duration_years = "La durée est requise";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const apiData = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        duration_years: parseInt(formData.duration_years),
        is_active: formData.is_active
      };

      const res = await createFormation(apiData);
      console.log("✅ Formation créée :", res);

      // Après création -> redirection vers la liste
      router.push("/dashboard/formation");
    } catch (err: any) {
      console.error("❌ Erreur lors de la création :", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                type="button"
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-smooth"
              >
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
                onClick={() => router.push("/dashboard/formation")}
                className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-smooth"
              >
                Annuler
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-smooth disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Création..." : "Créer la Formation"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
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
                    onChange={handleTextareaChange('description')}
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