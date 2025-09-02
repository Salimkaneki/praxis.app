'use client'
import React, { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, Save, Loader2 } from "lucide-react";
import { getFormations, updateFormation } from "../../_services/formation.service";
import { useRouter, useParams } from "next/navigation";

// Input réutilisable
type InputProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  error?: string;
};

function Input({ label, placeholder, value, onChange, type, required, error }: InputProps) {
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
        className={`h-[50px] px-4 py-2 rounded-xl font-poppins font-medium text-base
                   border ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}
                   focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500
                   text-gray-700 placeholder-gray-400 transition w-full`}
      />
      {error && <span className="text-sm text-red-500 font-poppins">{error}</span>}
    </div>
  );
}

// Textarea réutilisable
type TextareaProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  error?: string;
  rows?: number;
};

function Textarea({ label, placeholder, value, onChange, required, error, rows = 4 }: TextareaProps) {
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
        className={`px-4 py-3 rounded-xl font-poppins font-medium text-base
                   border ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}
                   focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500
                   text-gray-700 placeholder-gray-400 transition w-full resize-none`}
      />
      {error && <span className="text-sm text-red-500 font-poppins">{error}</span>}
    </div>
  );
}

export default function EditFormation() {
  const router = useRouter();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    duration_years: "",
    is_active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Charger les données
  useEffect(() => {
    const fetchFormation = async () => {
      if (!id) return;
      try {
        setInitialLoading(true);
        const res = await getFormations();
        const formation = res.data.find(f => f.id === Number(id));
        
        if (formation) {
          setFormData({
            name: formation.name,
            code: formation.code,
            description: formation.description,
            duration_years: formation.duration_years.toString(),
            is_active: formation.is_active
          });
        } else router.push("/dashboard/formation");
      } catch {
        router.push("/dashboard/formation");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchFormation();
  }, [id, router]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, is_active: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est requis";
    if (!formData.code.trim()) newErrors.code = "Le code est requis";
    if (!formData.description.trim()) newErrors.description = "La description est requise";
    if (!formData.duration_years || parseInt(formData.duration_years) <= 0)
      newErrors.duration_years = "La durée doit être un nombre positif";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await updateFormation(Number(id), {
        ...formData,
        duration_years: parseInt(formData.duration_years)
      });
      router.push("/dashboard/formation");
    } catch {
      setErrors({ general: "Erreur lors de la mise à jour" });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-forest-600" />
          <span className="font-poppins text-gray-600">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-poppins font-semibold text-gray-900">Modifier la Formation</h1>
              <p className="text-sm font-poppins text-gray-600 mt-1">Mettre à jour les informations</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => router.push("/dashboard/formation")} className="px-4 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 
                        text-sm font-poppins font-medium text-white 
                        bg-forest-600 hover:bg-forest-700 rounded-lg 
                        transition disabled:opacity-50 flex-nowrap min-w-[180px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer</span>
                </>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="h-full">
            <div className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col">
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center mr-3">
                  <BookOpen className="w-4 h-4 text-forest-600" />
                </div>
                <h2 className="text-lg font-poppins font-medium text-gray-900">Informations</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {errors.general && (
                  <div className="lg:col-span-2 mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                    {errors.general}
                  </div>
                )}

                <div className="space-y-6">
                  <Input label="Nom" placeholder="ex: Licence Informatique" value={formData.name} onChange={handleInputChange('name')} required error={errors.name} />
                  <Input label="Code" placeholder="ex: LIC-INFO-001" value={formData.code} onChange={handleInputChange('code')} required error={errors.code} />
                  <Input label="Durée (années)" placeholder="ex: 3" type="number" value={formData.duration_years} onChange={handleInputChange('duration_years')} required error={errors.duration_years} />
                  <div className="flex items-center">
                    <input type="checkbox" id="is_active" checked={formData.is_active} onChange={handleCheckboxChange} className="w-4 h-4 text-forest-600 rounded focus:ring-forest-500" />
                    <label htmlFor="is_active" className="ml-3 font-poppins text-sm text-gray-700">Active</label>
                  </div>
                </div>

                <Textarea label="Description" placeholder="ex: Formation en informatique générale..." value={formData.description} onChange={handleInputChange('description')} required error={errors.description} rows={8} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
