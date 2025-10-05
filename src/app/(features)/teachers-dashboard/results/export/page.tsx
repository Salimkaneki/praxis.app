'use client';
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Download, FileText, BarChart3, Calendar,
  CheckCircle, XCircle, Loader2, AlertCircle,
  Settings, FileSpreadsheet, File
} from "lucide-react";
import TeacherPageHeader from "../../_components/page-header";
import exportService, { ExportOptions } from "../_services/export.service";

const ExportResultsPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    }>
      <ExportResultsContent />
    </Suspense>
  );
};

const ExportResultsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeDetails: true,
    includeComments: false
  });

  const [exporting, setExporting] = useState(false);
  const [exportResult, setExportResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleExport = async () => {
    setExporting(true);
    setExportResult(null);

    try {
      let result;
      if (sessionId) {
        // Export d'une session spécifique
        if (exportOptions.format === 'csv') {
          result = await exportService.exportSessionResultsCSV(parseInt(sessionId), exportOptions);
        } else {
          result = await exportService.exportSessionResultsPDF(parseInt(sessionId), exportOptions);
        }
      } else {
        // Export des statistiques globales
        result = await exportService.exportGlobalStatistics(exportOptions);
      }

      setExportResult(result);
    } catch (error) {
      setExportResult({
        success: false,
        message: 'Une erreur inattendue s\'est produite'
      });
    } finally {
      setExporting(false);
    }
  };

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <TeacherPageHeader
        title={sessionId ? "Exporter les résultats de la session" : "Exporter les statistiques"}
        subtitle={sessionId ? `Session #${sessionId}` : "Aperçu global des résultats"}
        backButton={{
          onClick: () => router.back()
        }}
      />

      <div className="px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Options d'export */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Options d'export</h3>
                <p className="text-sm text-gray-600">Personnalisez votre export selon vos besoins</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Format d'export
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative">
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={exportOptions.format === 'csv'}
                      onChange={(e) => handleOptionChange('format', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      exportOptions.format === 'csv'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className={`w-6 h-6 ${
                          exportOptions.format === 'csv' ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">CSV</p>
                          <p className="text-sm text-gray-600">Feuille de calcul</p>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="relative">
                    <input
                      type="radio"
                      name="format"
                      value="pdf"
                      checked={exportOptions.format === 'pdf'}
                      onChange={(e) => handleOptionChange('format', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      exportOptions.format === 'pdf'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center gap-3">
                        <File className={`w-6 h-6 ${
                          exportOptions.format === 'pdf' ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">PDF</p>
                          <p className="text-sm text-gray-600">Document formaté</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Options supplémentaires */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="includeDetails"
                    type="checkbox"
                    checked={exportOptions.includeDetails}
                    onChange={(e) => handleOptionChange('includeDetails', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeDetails" className="ml-3 text-sm text-gray-700">
                    Inclure les détails des réponses
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="includeComments"
                    type="checkbox"
                    checked={exportOptions.includeComments}
                    onChange={(e) => handleOptionChange('includeComments', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeComments" className="ml-3 text-sm text-gray-700">
                    Inclure les commentaires enseignant
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Aperçu du contenu */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Aperçu du contenu</h3>
                <p className="text-sm text-gray-600">Ce qui sera inclus dans votre export</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Informations des étudiants (nom, email)</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Scores et statistiques</span>
              </div>
              {exportOptions.includeDetails && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Détails des réponses par question</span>
                </div>
              )}
              {exportOptions.includeComments && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Commentaires des enseignants</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Dates et horaires de soumission</span>
              </div>
            </div>
          </div>

          {/* Résultat de l'export */}
          {exportResult && (
            <div className={`p-4 rounded-lg mb-6 ${
              exportResult.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {exportResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <p className={`text-sm font-medium ${
                  exportResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {exportResult.message}
                </p>
              </div>
            </div>
          )}

          {/* Bouton d'export */}
          <div className="flex justify-center">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  {sessionId ? 'Exporter les résultats' : 'Exporter les statistiques'}
                </>
              )}
            </button>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">À propos des exports</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Les fichiers CSV peuvent être ouverts avec Excel, Google Sheets, etc.</li>
                  <li>• Les fichiers PDF contiennent une mise en page formatée</li>
                  <li>• Les exports incluent uniquement les données autorisées</li>
                  <li>• L'historique des exports est conservé pour audit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportResultsPage;