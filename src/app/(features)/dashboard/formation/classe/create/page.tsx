'use client'
import React, { useState, useEffect } from "react";
import { BookOpen, ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Inputs/Input";
import SelectInput from "@/components/ui/Inputs/Select";
import { GraduationCap } from "lucide-react";
import ClasseService from "../_services/classe.service";
import { getFormations, Formation } from "../../_services/formation.service";

// Types
interface Classe {
  id: number;
  name: string;
  level: number;
  academic_year: string;
  formation_id: number;
  max_students: number;
  is_active: boolean;
  formation?: { name: string; code: string; };
  students_count?: number;
}

export default function ClassePage() {
  const router = useRouter();
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "", 
    level: "", 
    academic_year: "", 
    formation_id: "", 
    max_students: "", 
    is_active: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchFormations = async () => {
    try {
      const data = await getFormations(1);
      setFormations(data?.data || []);
    } catch (err) {
      // Erreur récupération formations gérée silencieusement
    }
  };

  useEffect(() => { fetchFormations(); }, []);

  // Form handlers
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const resetForm = () => {
    setFormData({ 
      name: "", 
      level: "", 
      academic_year: "", 
      formation_id: "", 
      max_students: "", 
      is_active: true 
    });
    setErrors({});
    setApiError(null);
  };

  // Actions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Le nom est requis";
    if (!formData.level) newErrors.level = "Le niveau est requis";
    if (!formData.academic_year) newErrors.academic_year = "L'année académique est requise";
    if (!formData.formation_id) newErrors.formation_id = "La formation est requise";
    if (!formData.max_students) newErrors.max_students = "Le nombre maximal d'étudiants est requis";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await ClasseService.createClasse({
        name: formData.name,
        level: Number(formData.level),
        academic_year: formData.academic_year,
        formation_id: Number(formData.formation_id),
        max_students: Number(formData.max_students),
        is_active: formData.is_active,
      });
      resetForm();
      // Rediriger vers la liste des classes ou afficher un message de succès
      router.push('/dashboard/formation/classe');
    } catch (error: any) {
      setApiError(error?.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-smooth"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-poppins font-semibold text-gray-900">Nouvelle Classe</h1>
              <p className="text-sm font-poppins text-gray-600 mt-1">Créer une nouvelle classe académique</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-poppins font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-smooth"
            >
              Annuler
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-poppins font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg transition-smooth disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Création..." : "Créer la Classe"}
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        <div className="w-full mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="w-4 h-4 text-forest-600" />
              </div>
              <h2 className="text-lg font-poppins font-medium text-gray-900">Informations de la classe</h2>
            </div>

            {apiError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-poppins">{apiError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-6">
                <div className="flex-1">
                  <Input 
                    label="Nom de la classe" 
                    placeholder="ex: L1-INFO-B" 
                    value={formData.name} 
                    onChange={handleInputChange('name')} 
                    required 
                    error={errors.name} 
                  />
                </div>
                <div className="flex-1">
                  <Input 
                    label="Niveau" 
                    placeholder="ex: 2" 
                    value={formData.level} 
                    onChange={handleInputChange('level')} 
                    required 
                    error={errors.level} 
                  />
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex-1">
                  <Input 
                    label="Année académique" 
                    placeholder="ex: 2024-2025" 
                    value={formData.academic_year} 
                    onChange={handleInputChange('academic_year')} 
                    required 
                    error={errors.academic_year} 
                  />
                </div>
                <div className="flex-1">
                  <SelectInput
                    label="Formation associée" 
                    name="formation_id" 
                    placeholder="Sélectionnez une formation" 
                    leftIcon={GraduationCap}
                    value={formData.formation_id} 
                    onChange={(e) => setFormData(prev => ({ ...prev, formation_id: e.target.value }))}
                    options={formations.map(f => ({ 
                      value: f.id?.toString() || "", 
                      label: f.name || "" 
                    }))}
                    error={errors.formation_id}
                  />
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex-1">
                  <Input 
                    label="Nombre maximal d'étudiants" 
                    placeholder="ex: 100" 
                    type="number" 
                    value={formData.max_students} 
                    onChange={handleInputChange('max_students')} 
                    required 
                    error={errors.max_students} 
                  />
                </div>
                <div className="flex-1 flex items-center mt-6">
                  <input 
                    type="checkbox" 
                    id="is_active" 
                    checked={formData.is_active} 
                    onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))} 
                    className="w-4 h-4 text-forest-600 bg-gray-100 border-gray-300 rounded focus:ring-forest-500 focus:ring-2" 
                  />
                  <label htmlFor="is_active" className="ml-3 font-poppins text-sm text-gray-700">
                    Classe active
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}