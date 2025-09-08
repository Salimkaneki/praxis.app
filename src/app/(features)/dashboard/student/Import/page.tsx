'use client';
import React, { useState, useRef, ChangeEvent, useEffect } from "react";
import { 
  Upload, FileText, Sheet, Users, Download, 
  ArrowLeft, AlertCircle, CheckCircle, X,
  Eye, Trash2, Loader2
} from "lucide-react";
import Papa from 'papaparse';
import ClasseService, { Classe } from "@/app/(features)/dashboard/formation/classe/_services/classe.service";
import { importStudentsCSV } from "../_services/student.service";

// Types pour les données d'import
interface ImportedStudent {
  student_number?: string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  phone: string;
  class_id: string;
  gender: string;
  address?: string;
  errors?: string[];
}

interface ImportResult {
  success: number;
  errors: number;
  total: number;
  duplicates?: number;
  errorDetails?: any[];
}

export default function StudentImport() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ImportedStudent[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStatus, setImportStatus] = useState<'success' | 'error' | null>(null);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Options pour le genre
  const genderOptions = [
    { value: "M", label: "Masculin" },
    { value: "F", label: "Féminin" }
  ];

  // Charger les classes au montage
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoadingClasses(true);
        const response = await ClasseService.getClasses();
        setClasses(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des classes", err);
      } finally {
        setLoadingClasses(false);
      }
    };
    loadClasses();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Vérifier le type de fichier
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      alert("Veuillez sélectionner un fichier CSV valide.");
      return;
    }

    setFile(selectedFile);
    processCSVFile(selectedFile);
  };

const processCSVFile = (selectedFile: File) => {
    setIsProcessing(true);
    setPreviewData([]);
    setImportResult(null);
    setImportStatus(null);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        const processedData = results.data.map((row: any, index: number) => {
          const errors: string[] = [];
          
          // Validation des champs requis selon le controller Laravel
          if (!row.student_number?.trim()) errors.push("Numéro étudiant requis");
          if (!row.first_name?.trim()) errors.push("Prénom requis");
          if (!row.last_name?.trim()) errors.push("Nom requis");
          if (!row.birth_date?.trim()) errors.push("Date de naissance requise");
          if (!row.email?.trim()) errors.push("Email requis");
          if (!row.phone?.trim()) errors.push("Téléphone requis");
          if (!row.class_id?.trim()) errors.push("ID classe requis");

          // Validation format email
          if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
            errors.push("Format d'email invalide");
          }

          // Validation format téléphone
          if (row.phone && !/^\+228\s?\d{8}$/.test(row.phone)) {
            errors.push("Format téléphone invalide (+228 90123456)");
          }

          // Validation date
          if (row.birth_date && isNaN(Date.parse(row.birth_date))) {
            errors.push("Format de date invalide (YYYY-MM-DD)");
          }

          // Validation class_id
          if (row.class_id && !classes.find(c => c.id.toString() === row.class_id.toString())) {
            errors.push("ID classe inexistant");
          }

          return {
            student_number: row.student_number?.trim() || '',
            first_name: row.first_name?.trim() || '',
            last_name: row.last_name?.trim() || '',
            email: row.email?.trim() || '',
            birth_date: row.birth_date?.trim() || '',
            phone: row.phone?.trim() || '',
            class_id: row.class_id?.toString() || '',
            // ❌ Supprimer gender et address - Laravel ne les accepte pas
            errors: errors.length > 0 ? errors : undefined
          } as ImportedStudent;
        });

        setPreviewData(processedData);
        setIsProcessing(false);
      },
      error: (error) => {
        console.error("Erreur lors du parsing CSV:", error);
        alert("Erreur lors de la lecture du fichier CSV.");
        setIsProcessing(false);
      }
    });
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewData([]);
    setImportResult(null);
    setImportStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImport = async () => {
    if (!file || previewData.length === 0) return;

    // Vérifier s'il y a des erreurs
    const hasErrors = previewData.some(student => student.errors);
    if (hasErrors) {
      if (!confirm("Certaines données contiennent des erreurs. Voulez-vous continuer l'import pour les données valides uniquement ?")) {
        return;
      }
    }

    setIsImporting(true);
    setImportStatus(null);

    try {
      const result = await importStudentsCSV(file);
      
      setImportResult({
        success: result.imported || 0,
        errors: result.errors?.length || 0,
        total: previewData.length,
        errorDetails: result.errors
      });
      
      setImportStatus('success');
      
      // Redirection après succès
      setTimeout(() => {
        window.location.href = '/dashboard/student';
      }, 3000);

    } catch (error: any) {
      console.error("Erreur lors de l'importation:", error);
      setImportStatus('error');
      
      // Essayer d'extraire les détails d'erreur de l'API
      if (error?.response?.data) {
        setImportResult({
          success: 0,
          errors: 1,
          total: previewData.length,
          errorDetails: [error.response.data.message || "Erreur inconnue"]
        });
      }
    } finally {
      setIsImporting(false);
    }
  };

  const getClassLabel = (classId: string) => {
    const foundClass = classes.find(c => c.id.toString() === classId);
    return foundClass ? foundClass.name : `ID: ${classId}`;
  };

  const getGenderLabel = (gender: string) => {
    return genderOptions.find(opt => opt.value === gender)?.label || gender;
  };

  const handleNavigateBack = () => {
    window.location.href = '/dashboard/student';
  };

  const downloadTemplate = () => {
    const headers = [
      'first_name',
      'last_name', 
      'email',
      'birth_date',
      'phone',
      'class_id',
      'gender',
      'address',
      'student_number'
    ];
    
    const csvContent = headers.join(',') + '\n' + 
      'Jean,Dupont,jean.dupont@univ-lome.tg,2000-05-15,+228 90123456,1,M,Lomé Quartier Administratif,\n' +
      'Marie,Koné,marie.kone@univ-lome.tg,2001-08-22,+228 90234567,2,F,Lomé Nyékonakpoè,';
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modele_import_etudiants.csv';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={handleNavigateBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Importation d'Étudiants
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Importez une liste d'étudiants via un fichier CSV
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={downloadTemplate}
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Télécharger le modèle
                <Download className="w-4 h-4 ml-2 inline" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {importStatus && (
        <div className="px-8 py-4">
          {importStatus === 'success' && importResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-sm text-green-800 font-medium">
                  Importation terminée avec succès ! Redirection en cours...
                </span>
              </div>
              <div className="mt-2 text-sm text-green-700">
                <p>{importResult.success} étudiants importés avec succès</p>
                {importResult.errors > 0 && <p>{importResult.errors} erreurs</p>}
              </div>
            </div>
          )}
          {importStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-sm text-red-800">
                  Une erreur est survenue lors de l'importation.
                </span>
              </div>
              {importResult?.errorDetails && (
                <div className="mt-2 text-sm text-red-700">
                  {importResult.errorDetails.slice(0, 3).map((error, index) => (
                    <p key={index}>• {typeof error === 'string' ? error : JSON.stringify(error)}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Upload Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Importer un fichier
                </h2>
                <p className="text-sm text-gray-600">
                  Sélectionnez un fichier CSV contenant la liste des étudiants
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
                disabled={isProcessing || loadingClasses}
              />
              
              {!file ? (
                <div>
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Glissez-déposez votre fichier ici, ou
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing || loadingClasses}
                    className="px-4 py-2 text-sm font-medium text-forest-600 bg-forest-50 rounded-lg hover:bg-forest-100 transition-colors disabled:opacity-50"
                  >
                    {loadingClasses ? "Chargement des classes..." : "Parcourir les fichiers"}
                  </button>
                  <p className="text-xs text-gray-500 mt-4">
                    Format supporté: CSV uniquement
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-forest-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-forest-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {isProcessing && (
              <div className="mt-6 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-forest-600 mr-2" />
                <span className="text-sm text-gray-600">Analyse du fichier en cours...</span>
              </div>
            )}

            {previewData.length > 0 && !isProcessing && (
              <div className="mt-6">
                <button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="w-full py-3 text-sm font-medium text-white bg-forest-600 hover:bg-forest-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forest-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin inline-block" />
                      Importation en cours...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2 inline" />
                      Importer {previewData.filter(s => !s.errors).length} étudiants valides
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {previewData.length > 0 && !isProcessing && (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Aperçu des données ({previewData.length} étudiants)
                  </h2>
                  <p className="text-sm text-gray-600">
                    Vérifiez les données avant l'importation
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom & Prénom
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Téléphone
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Classe
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Genre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((student, index) => (
                      <tr key={index} className={student.errors ? "bg-red-50" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {student.birth_date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getClassLabel(student.class_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getGenderLabel(student.gender)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.errors ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Erreur
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Valide
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {previewData.some(student => student.errors) && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-sm font-medium text-red-800 mb-2">
                    Erreurs détectées:
                  </h3>
                  <div className="text-sm text-red-700 max-h-40 overflow-y-auto">
                    {previewData.map((student, index) => 
                      student.errors?.map(error => (
                        <div key={`${index}-${error}`} className="mb-1">
                          Ligne {index + 1}: {student.first_name} {student.last_name} - {error}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}