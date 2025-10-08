'use client';
import React, { useEffect, useState } from "react";
import {
  BookOpen,
  ArrowLeft,
  Save,
  Award,
  GraduationCap,
  Hash,
} from "lucide-react";
import Input from "@/components/ui/Inputs/Input";
import SelectInput from "@/components/ui/Inputs/Select";
import { getFormations } from "../../formation/_services/formation.service";
import { createSubject } from "../_services/subject.service";
import { useRouter } from "next/navigation";

export default function SubjectCreationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    credits: "",
    coefficient: "",
    type: "",
    formation_id: "",
    semester: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [formationOptions, setFormationOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingFormations, setLoadingFormations] = useState(true);

  // Options pour les types de matière
  const typeOptions = [
    { value: "cours", label: "Cours" },
    { value: "tp", label: "TP (Travaux Pratiques)" },
    { value: "projet", label: "Projet" },
    { value: "stage", label: "Stage" },
    { value: "examen", label: "Examen" },
  ];

  // Options pour les semestres
  const semesterOptions = [
    { value: "1", label: "Semestre 1" },
    { value: "2", label: "Semestre 2" },
    { value: "3", label: "Semestre 3" },
    { value: "4", label: "Semestre 4" },
    { value: "5", label: "Semestre 5" },
    { value: "6", label: "Semestre 6" },
  ];

  // Options pour les crédits (1 à 10)
  const creditOptions = Array.from({ length: 10 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} crédit${i > 0 ? "s" : ""}`,
  }));

  // Options pour les coefficients (1 à 5)
  const coefficientOptions = Array.from({ length: 5 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `Coefficient ${i + 1}`,
  }));

  // 🔹 Récupération réelle des formations depuis l’API
  const fetchFormations = async () => {
    try {
      setLoadingFormations(true);
      const res = await getFormations(1); // page 1 par défaut
      const formatted = res.data.map((f) => ({
        value: f.id.toString(),
        label: f.name,
      }));
      setFormationOptions(formatted);
    } catch (error) {
      // Erreur récupération formations - affichage silencieux
    } finally {
      setLoadingFormations(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  // Gestion des inputs
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Gestion des selects
  const handleSelectChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLSelectElement> | { target: { value: string } }) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, is_active: e.target.checked }));
  };

  // Soumission formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = "Le nom de la matière est requis";
    if (!formData.code) newErrors.code = "Le code de la matière est requis";
    if (!formData.credits) newErrors.credits = "Le nombre de crédits est requis";
    if (!formData.coefficient) newErrors.coefficient = "Le coefficient est requis";
    if (!formData.type) newErrors.type = "Le type de matière est requis";
    if (!formData.formation_id) newErrors.formation_id = "La formation est requise";
    if (!formData.semester) newErrors.semester = "Le semestre est requis";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        const apiData = {
          name: formData.name,
          code: formData.code,
          description: formData.description,
          credits: parseInt(formData.credits),
          coefficient: parseInt(formData.coefficient),
          type: formData.type,
          formation_id: parseInt(formData.formation_id),
          semester: parseInt(formData.semester),
          is_active: formData.is_active,
        };

        await createSubject(apiData);
        router.push("/dashboard/subject");
      } catch (error: any) {
        console.error("Erreur création:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    router.push("/dashboard/subject");
  };

  const handleCancel = () => {
    router.push("/dashboard/subject");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-poppins font-semibold text-gray-900">
                Nouvelle Matière
              </h1>
              <p className="text-sm font-poppins text-gray-600 mt-1">
                Ajouter une nouvelle matière au programme de formation
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg flex items-center disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Création..." : "Créer la Matière"}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-8 py-8 flex-1">
        <div className="w-full mx-auto h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Informations Générales */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="w-4 h-4 text-forest-600" />
              </div>
              <h2 className="text-lg font-poppins font-medium text-gray-900">
                Informations générales
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                label="Nom de la matière"
                placeholder="ex: Ergonomie et Expérience Utilisateur"
                value={formData.name}
                onChange={handleInputChange("name")}
                required
                error={errors.name}
              />
              <Input
                label="Code de la matière"
                placeholder="ex: UX-ERG-001"
                value={formData.code}
                onChange={handleInputChange("code")}
                required
                error={errors.code}
                rightIcon={Hash}
              />
            </div>
            <div className="mt-6">
              <div className="flex flex-col gap-2">
                <label className="font-poppins text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Description détaillée de la matière, objectifs pédagogiques..."
                  rows={4}
                  className="w-full h-[100px] px-4 py-2 rounded-xl font-poppins font-medium text-base border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-forest-300 focus:border-forest-500 text-gray-700 placeholder-gray-400 transition-smooth hover:bg-gray-100 hover:border-gray-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Configuration Académique */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <GraduationCap className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-poppins font-medium text-gray-900">
                Configuration académique
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SelectInput
                label="Formation"
                placeholder={
                  loadingFormations ? "Chargement..." : "Sélectionner une formation"
                }
                value={formData.formation_id}
                onChange={handleSelectChange("formation_id")}
                options={formationOptions}
                required
                error={errors.formation_id}
                disabled={loadingFormations}
              />
              <SelectInput
                label="Semestre"
                placeholder="Sélectionner le semestre"
                value={formData.semester}
                onChange={handleSelectChange("semester")}
                options={semesterOptions}
                required
                error={errors.semester}
              />
              <SelectInput
                label="Type de matière"
                placeholder="Sélectionner le type"
                value={formData.type}
                onChange={handleSelectChange("type")}
                options={typeOptions}
                required
                error={errors.type}
              />
            </div>
          </div>

          {/* Crédits et Coefficient */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Award className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-lg font-poppins font-medium text-gray-900">
                Évaluation et pondération
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <SelectInput
                label="Nombre de crédits"
                placeholder="Sélectionner les crédits"
                value={formData.credits}
                onChange={handleSelectChange("credits")}
                options={creditOptions}
                required
                error={errors.credits}
              />
              <SelectInput
                label="Coefficient"
                placeholder="Sélectionner le coefficient"
                value={formData.coefficient}
                onChange={handleSelectChange("coefficient")}
                options={coefficientOptions}
                required
                error={errors.coefficient}
              />
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-forest-600 bg-gray-100 border-gray-300 rounded focus:ring-forest-500 focus:ring-2"
                />
                <label
                  htmlFor="is_active"
                  className="ml-3 text-sm text-gray-700 font-poppins"
                >
                  Matière active
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
